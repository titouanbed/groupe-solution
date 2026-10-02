// Trafic du site (fichier « _ » : pas une route) — mesure d'audience maison, sans cookie et sans adresse IP.
// • Pour tous les visiteurs : des compteurs anonymes par jour (pages vues, villes approximatives, provenance,
//   appareil, actions comme un clic sur le téléphone). Rien qui permette de reconnaître une personne.
// • Seulement pour les visiteurs qui ont accepté la mesure d'audience dans le bandeau : le parcours de leur visite
//   (pages vues dans l'ordre, actions), sans IP ni identité, gardé 30 jours.
// L'adresse IP n'est jamais enregistrée : la ville vient de l'hébergeur (Vercel) au moment de la requête.
import { redis } from "./_guard.mjs";

const JOURS = 400, VISITES_J = 30, MAX_VISITES = 3000;
export const EVENTS = /^(pv|tel|mail|whatsapp|form|chat|rdv|lead|devis|newsletter_signup|generate_lead|quiz_complete|poll_vote|calculator_cta|visibility_test_complete|home_pourvous_metier|fin)$/;
const BOT = /bot|crawl|spider|slurp|headless|lighthouse|pagespeed|preview|monitor|curl|wget|python|axios|facebookexternalhit|embedly|bingpreview|vercel-screenshot/i;
const s = (v, n) => String(v ?? "").replace(/[\u0000-\u001f|]/g, " ").trim().slice(0, n);
const dec = v => { try { return v ? decodeURIComponent(v) : ""; } catch { return v || ""; } };
const jour = (t = Date.now()) => new Date(t).toISOString().slice(0, 10);
const PAYS = { FR: "", YT: "Mayotte", RE: "La Réunion", GP: "Guadeloupe", MQ: "Martinique", GF: "Guyane", NC: "Nouvelle-Calédonie", PF: "Polynésie", BE: "Belgique", CH: "Suisse", CA: "Canada" };

export function lieu(h) {
  const ville = s(dec(h["x-vercel-ip-city"]), 60), pays = s(h["x-vercel-ip-country"], 2).toUpperCase();
  const p = pays in PAYS ? PAYS[pays] : pays;
  return [ville, p].filter(Boolean).join(", ") || "Inconnue";
}

// Un événement envoyé par la page (analytics.js). Renvoie false s'il est ignoré.
export async function enregistrer(b, headers) {
  if (BOT.test(String(headers["user-agent"] || ""))) return false;
  const e = s(b.e, 30); if (!EVENTS.test(e)) return false;
  const p = s(String(b.p || "/").split(/[?#]/)[0], 120) || "/", d = jour(), k = "tr:d:" + d, ville = lieu(headers);
  const src = s(b.s, 20).toLowerCase().replace(/[^a-z0-9_-]/g, "") || "direct", dv = b.d === "mobile" ? "mobile" : "ordinateur";
  const cmds = [];
  if (e === "pv") {
    cmds.push(["HINCRBY", k, "pv", 1], ["HINCRBY", k, "p|" + p, 1]);
    if (b.n) cmds.push(["HINCRBY", k, "vis", 1], ["HINCRBY", k, "c|" + ville, 1], ["HINCRBY", k, "s|" + src, 1], ["HINCRBY", k, "dv|" + dv, 1]);
  } else if (e !== "fin") cmds.push(["HINCRBY", k, "e|" + e, 1]);
  if (cmds.length) cmds.push(["EXPIRE", k, JOURS * 86400]);
  // Parcours détaillé : uniquement avec l'accord du visiteur (identifiant de visite aléatoire, propre à l'onglet).
  const v = /^[a-z0-9]{12,32}$/.test(String(b.v || "")) ? b.v : "";
  if (v) {
    const now = Date.now(), kv = "tr:vp:" + v, km = "tr:vm:" + v;
    cmds.push(["RPUSH", kv, JSON.stringify({ e, p, t: s(b.t, 90), x: s(b.x, 60), ts: now })], ["LTRIM", kv, -80, -1], ["EXPIRE", kv, VISITES_J * 86400],
      ["HSETNX", km, "debut", String(now)], ["HSETNX", km, "ville", ville], ["HSETNX", km, "src", src], ["HSETNX", km, "dv", dv], ["HSETNX", km, "ref", s(b.r, 60)],
      ["HSET", km, "fin", String(now)], ["EXPIRE", km, VISITES_J * 86400], ["ZADD", "tr:vl", now, v], ["ZREMRANGEBYRANK", "tr:vl", 0, -MAX_VISITES - 1]);
  }
  if (cmds.length) await redis(cmds);
  return true;
}

// Vue d'ensemble pour le tableau de bord : chaque jour (graphique) + classements sur la période + visites détaillées.
export async function lireTrafic(jours = 30) {
  jours = Math.max(1, Math.min(90, +jours || 30));
  const dates = Array.from({ length: Math.max(jours, 30) }, (_, i) => jour(Date.now() - i * 864e5)).reverse();
  const rows = await redis(dates.map(d => ["HGETALL", "tr:d:" + d]));
  const parJour = [], tot = { pages: {}, villes: {}, sources: {}, appareils: {}, actions: {} }, T = { vis: 0, pv: 0 };
  const cle = { p: "pages", c: "villes", s: "sources", dv: "appareils", e: "actions" };
  rows.forEach((a, i) => {
    const h = {}; for (let k = 0; k + 1 < (a || []).length; k += 2) h[a[k]] = +a[k + 1] || 0;
    const act = Object.keys(h).filter(x => x.startsWith("e|")).reduce((t, x) => t + h[x], 0);
    parJour.push({ date: dates[i], vis: h.vis || 0, pv: h.pv || 0, actions: act });
    if (i < dates.length - jours) return;
    T.vis += h.vis || 0; T.pv += h.pv || 0;
    for (const [f, n] of Object.entries(h)) { const [g, ...r] = f.split("|"); if (cle[g]) { const kk = r.join("|"); tot[cle[g]][kk] = (tot[cle[g]][kk] || 0) + n; } }
  });
  const top = (o, n = 12) => Object.entries(o).sort((a, b) => b[1] - a[1]).slice(0, n).map(([k, n]) => ({ k, n }));
  const [sids] = await redis([["ZREVRANGE", "tr:vl", 0, 59]]);
  const det = sids?.length ? await redis(sids.flatMap(v => [["HGETALL", "tr:vm:" + v], ["LRANGE", "tr:vp:" + v, 0, -1]])) : [];
  const visites = [];
  (sids || []).forEach((v, i) => {
    const a = det[2 * i] || [], m = {}; for (let k = 0; k + 1 < a.length; k += 2) m[a[k]] = a[k + 1];
    const ev = (det[2 * i + 1] || []).map(x => { try { return JSON.parse(x); } catch { return null; } }).filter(Boolean);
    if (!m.debut || !ev.length) return;
    visites.push({ id: v.slice(0, 6), debut: +m.debut, fin: +m.fin || +m.debut, ville: m.ville, src: m.src, dv: m.dv, ref: m.ref, etapes: ev.filter(x => x.e !== "fin").slice(-40) });
  });
  return { jours, total: { visites: T.vis, pages: T.pv, actions: Object.values(tot.actions).reduce((x, y) => x + y, 0) }, parJour: parJour.slice(-30),
    pages: top(tot.pages, 15), villes: top(tot.villes), sources: top(tot.sources, 8), appareils: top(tot.appareils, 3), actions: top(tot.actions, 12), visites };
}
