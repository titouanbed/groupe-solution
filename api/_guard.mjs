// Garde-fous communs aux fonctions /api (fichier préfixé « _ » : pas exposé comme route).
//  • sameSite(req)   : refuse les POST venus d'autres sites (Sec-Fetch-Site / Origin + JSON obligatoire).
//  • clientKey(req)  : IP du visiteur, IPv6 ramenée à son /64 (un seul abonné = une seule clé).
//  • allow(...)      : limite par visiteur ET budget quotidien global, partagés entre instances via
//                      Upstash quand il est configuré ; repli en mémoire sinon.
//  • redis(cmds)     : pipeline Upstash REST, URL et jeton pris sur la MÊME intégration.
import net from "node:net";

function upstashEnv() {
  const pairs = [["KV_REST_API_URL", "KV_REST_API_TOKEN"], ["UPSTASH_REDIS_REST_URL", "UPSTASH_REDIS_REST_TOKEN"]];
  // Intégration Vercel avec préfixe personnalisé (ex. STOCKAGE_KV_REST_API_URL) : jeton du même préfixe.
  for (const k of Object.keys(process.env).sort()) {
    const m = k.match(/^([A-Z0-9_]+_)(KV_REST_API_URL|UPSTASH_REDIS_REST_URL)$/);
    if (m) pairs.push([k, m[1] + m[2].replace(/URL$/, "TOKEN")]);
  }
  for (const [u, t] of pairs) if (process.env[u] && process.env[t]) return { url: process.env[u], token: process.env[t] };
  return null;
}
export const UPSTASH = upstashEnv();

export async function redis(cmds) {
  if (!UPSTASH) throw new Error("redis non configuré");
  const ctl = new AbortController(), timer = setTimeout(() => ctl.abort(), 4000);
  try {
    const r = await fetch(UPSTASH.url + "/pipeline", { method: "POST", signal: ctl.signal, headers: { Authorization: "Bearer " + UPSTASH.token, "Content-Type": "application/json" }, body: JSON.stringify(cmds) });
    if (!r.ok) throw new Error("redis " + r.status);
    return (await r.json()).map(x => x.result);
  } finally { clearTimeout(timer); }
}

export function clientKey(req) {
  const ip = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim();
  if (net.isIPv6(ip) && !/^::ffff:/i.test(ip)) {
    // Développe l'adresse puis garde les 4 premiers groupes (/64).
    const [a, b = ""] = ip.toLowerCase().split("::");
    const L = a ? a.split(":") : [], R = b ? b.split(":") : [];
    const full = [...L, ...Array(Math.max(0, 8 - L.length - R.length)).fill("0"), ...R];
    return full.slice(0, 4).join(":") + "::/64";
  }
  return ip.replace(/^::ffff:/i, "") || "unknown";
}

export function sameSite(req) {
  const site = req.headers["sec-fetch-site"], origin = req.headers.origin || "";
  if (!/application\/json/i.test(req.headers["content-type"] || "")) return false;
  if (site && site !== "same-origin" && site !== "none") return false;
  if (origin && !/^https:\/\/(www\.)?groupsolution\.fr$|^https:\/\/[a-z0-9-]+\.vercel\.app$|^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) return false;
  return true;
}

const mem = new Map();
function memAllow(key, max, windowSec) {
  const now = Date.now(), a = (mem.get(key) || []).filter(t => now - t < windowSec * 1000);
  a.push(now); mem.set(key, a);
  if (mem.size > 5000) for (const [k, v] of mem) if (!v.length || now - v[v.length - 1] > 3600e3) mem.delete(k);
  return a.length <= max;
}

// name : nom de la fonction · max/windowSec : par visiteur · dailyMax : toutes personnes confondues.
export async function allow(name, req, max, windowSec, dailyMax) {
  const who = clientKey(req);
  if (!memAllow(`${name}:${who}`, max, windowSec)) return false;
  if (!UPSTASH) return memAllow(`${name}:day`, dailyMax, 86400);
  const bucket = Math.floor(Date.now() / 1000 / windowSec), day = new Date().toISOString().slice(0, 10);
  const k1 = `rl:${name}:${who}:${bucket}`, k2 = `budget:${name}:${day}`;
  try {
    const [n, , g] = await redis([["INCR", k1], ["EXPIRE", k1, windowSec], ["INCR", k2], ["EXPIRE", k2, 90000]]);
    return n <= max && g <= dailyMax;
  } catch { return memAllow(`${name}:day`, dailyMax, 86400); }
}

export const readBody = req => { let b = req.body; if (typeof b === "string") { try { b = JSON.parse(b); } catch { b = {}; } } return b && typeof b === "object" ? b : {}; };
