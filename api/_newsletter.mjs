// Newsletter « L'essentiel du lundi » (fichier « _ » : pas une route).
// Double opt-in : inscription → e-mail de confirmation → abonné. Désinscription en un clic dans chaque envoi.
// Envoi chaque lundi (tâche Vercel) : les actus vérifiées de la semaine, lues depuis le flux RSS du site.
import { randomBytes, createHash } from "node:crypto";
import { redis } from "./_guard.mjs";
import { sendMail, esc, lastMailError, explique } from "./_mail.mjs";

const SITE = "https://www.groupsolution.fr";
const EMAIL = /^[^\s@<>"]{1,64}@[^\s@<>"]{1,190}\.[a-z]{2,}$/i;
const hash = e => createHash("sha256").update(e.toLowerCase()).digest("hex").slice(0, 32);
const shell = (inner, stop) => `<div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:600px;margin:0 auto;color:#171613;line-height:1.6">
<p style="font-weight:800;font-size:18px;margin:0">Groupe Solution <span style="color:#E61E4D">·</span> L'essentiel du lundi</p>${inner}
<p style="color:#77736A;font-size:12px;margin-top:28px;border-top:1px solid #eee;padding-top:12px">Vous recevez cet e-mail parce que vous vous êtes inscrit sur groupsolution.fr. ${stop ? `<a href="${stop}" style="color:#77736A">Se désinscrire en un clic</a>.` : ""}<br>Groupe Solution · Saint-Jean-de-Védas · 07 82 29 85 59</p></div>`;

async function mailConfirmation(email, t) {
  return sendMail({ to: email, subject: "Confirmez votre inscription à L'essentiel du lundi", html: shell(`<p>Bonjour,</p><p>Chaque lundi, les actualités IA, numériques et réglementaires de la semaine, vérifiées et traduites en actions concrètes pour votre entreprise. Une seule condition : confirmer votre adresse.</p><p><a href="${SITE}/api/devis?nl=confirm&t=${t}" style="display:inline-block;background:#E61E4D;color:#fff;padding:12px 20px;border-radius:999px;text-decoration:none;font-weight:700">Confirmer mon inscription</a></p><p style="font-size:13px;color:#77736A">Vous n'avez rien demandé ? Ignorez simplement cet e-mail.</p>`, null) });
}
export async function nlSubscribe(email, source) {
  email = String(email || "").trim().toLowerCase();
  if (!EMAIL.test(email)) return { ok: false, message: "Adresse e-mail invalide." };
  const h = hash(email), [cur] = await redis([["HGET", "nl:subs", h]]);
  let prev = null; try { prev = cur ? JSON.parse(cur) : null; } catch {}
  if (prev?.ok) return { ok: true, deja: true };
  const t = prev?.t || randomBytes(16).toString("hex");
  const sub = { email, ok: false, t, source, date: prev?.date || new Date().toISOString() };
  // Enregistré AVANT l'envoi : même si l'e-mail ne part pas, l'inscription est visible dans le tableau de bord.
  await redis([["HSET", "nl:subs", h, JSON.stringify(sub)], ["SET", "nl:tok:" + t, h, "EX", 60 * 86400]]);
  const sent = await mailConfirmation(email, t);
  sub.envoi = sent ? "envoye" : "echec"; sub.essai = new Date().toISOString();
  await redis([["HSET", "nl:subs", h, JSON.stringify(sub)]]);
  return sent ? { ok: true } : { ok: true, envoi: false, message: "Inscription enregistrée. L'e-mail de confirmation n'a pas pu partir tout de suite : nous vous le renvoyons au plus vite." };
}
export async function nlResend(email) {
  const h = hash(String(email || "").trim()), [cur] = await redis([["HGET", "nl:subs", h]]);
  if (!cur) return { ok: false };
  const sub = JSON.parse(cur); if (sub.ok) return { ok: true, deja: true };
  await redis([["SET", "nl:tok:" + sub.t, h, "EX", 60 * 86400]]);
  const sent = await mailConfirmation(sub.email, sub.t);
  sub.envoi = sent ? "envoye" : "echec"; sub.essai = new Date().toISOString(); sub.essais = (sub.essais || 0) + 1;
  await redis([["HSET", "nl:subs", h, JSON.stringify(sub)]]);
  return sent ? { ok: true } : { ok: false, erreur: lastMailError, conseil: explique(lastMailError) };
}
export async function nlList() {
  const [all] = await redis([["HVALS", "nl:subs"]]);
  return (all || []).map(v => { try { const x = JSON.parse(v); return { email: x.email, ok: !!x.ok, date: x.date, confirme: x.confirme || null, envoi: x.envoi || null, source: x.source || "", essais: x.essais || 0, lien: x.ok ? null : `${SITE}/api/devis?nl=confirm&t=${x.t}` }; } catch { return null; } }).filter(Boolean).sort((a, b) => (b.date || "").localeCompare(a.date || ""));
}
async function byToken(t) {
  if (!/^[a-f0-9]{32}$/.test(t)) return null;
  const [h] = await redis([["GET", "nl:tok:" + t]]); if (!h) return null;
  const [v] = await redis([["HGET", "nl:subs", h]]); if (!v) return null;
  return { h, sub: JSON.parse(v) };
}
export async function nlConfirm(t) {
  const r = await byToken(t); if (!r) return false;
  const nouveau = !r.sub.ok;
  r.sub.ok = true; r.sub.confirme = r.sub.confirme || new Date().toISOString();
  await redis([["HSET", "nl:subs", r.h, JSON.stringify(r.sub)], ["PERSIST", "nl:tok:" + t]]);
  // Bienvenue immédiate, avec les dernières actus, pour ne pas attendre lundi.
  if (nouveau) {
    const items = (await semaine().catch(() => [])).slice(0, 3);
    await sendMail({ to: r.sub.email, subject: "Bienvenue — voici L'essentiel de la semaine", html: shell(`<p>Bonjour,</p><p>Merci pour votre confiance. Chaque lundi, vous recevrez les actualités IA, numériques et réglementaires qui comptent pour votre entreprise, vérifiées par au moins deux sources, avec l'action à mener.</p>${items.length ? `<p><b>Pour commencer, les dernières :</b></p>${items.map(x => `<p style="margin:10px 0"><a href="${esc(x.lien)}" style="color:#171613;font-weight:700">${esc(x.titre)}</a></p>`).join("")}` : ""}<p>Un projet, une question ? Décrivez votre entreprise à notre assistant : il vous propose des idées concrètes en une minute. <a href="${SITE}/#heroAI" style="color:#E61E4D;font-weight:700">Essayer →</a></p><p>Titouan Bedos — Groupe Solution</p>`, `${SITE}/api/devis?nl=stop&t=${t}`) });
  }
  return true;
}
export async function nlStop(t) {
  const r = await byToken(t); if (!r) return false;
  await redis([["HDEL", "nl:subs", r.h], ["DEL", "nl:tok:" + t]]);
  return true;
}
export async function nlCount() {
  const [all] = await redis([["HVALS", "nl:subs"]]);
  return (all || []).filter(v => { try { return JSON.parse(v).ok; } catch { return false; } }).length;
}

// Actus des 7 derniers jours depuis le flux RSS public du site.
async function semaine() {
  const r = await fetch(SITE + "/lab/actus/rss.xml", { signal: AbortSignal.timeout(8000) });
  if (!r.ok) return [];
  const xml = await r.text(), limite = Date.now() - 7.5 * 86400e3;
  const tag = (s, n) => (s.match(new RegExp(`<${n}>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?</${n}>`)) || [])[1] || "";
  const dec = s => s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'");
  return (xml.match(/<item>[\s\S]*?<\/item>/g) || []).map(it => ({ titre: dec(tag(it, "title")), lien: dec(tag(it, "link")), texte: dec(tag(it, "description")), date: Date.parse(tag(it, "pubDate")) || 0 }))
    .filter(x => x.titre && x.date >= limite).slice(0, 8);
}
export async function nlSend() {
  const items = await semaine();
  if (items.length < 2) return { envoyes: 0, raison: "moins de 2 actus cette semaine" };
  const [all] = await redis([["HGETALL", "nl:subs"]]);
  const subs = [];
  for (let i = 0; i + 1 < (all || []).length; i += 2) { try { const v = JSON.parse(all[i + 1]); if (v.ok) subs.push(v); } catch {} }
  if (!subs.length) return { envoyes: 0, raison: "aucun abonné confirmé" };
  const semaineId = new Date().toISOString().slice(0, 10);
  const [deja] = await redis([["SET", "nl:sent:" + semaineId, "1", "NX", "EX", 8 * 86400]]);
  if (deja !== "OK") return { envoyes: 0, raison: "déjà envoyée aujourd'hui" };
  const corps = items.map(x => `<div style="margin:18px 0;padding:14px 16px;border:1px solid #eee;border-radius:14px"><a href="${esc(x.lien)}" style="color:#171613;font-weight:800;text-decoration:none;font-size:16px">${esc(x.titre)}</a><p style="margin:6px 0 0;font-size:14px;color:#57534B">${esc(x.texte.slice(0, 420))}</p></div>`).join("");
  let n = 0;
  for (let i = 0; i < subs.length; i += 10) {
    const res = await Promise.all(subs.slice(i, i + 10).map(v => sendMail({ to: v.email, subject: `L'essentiel du lundi — ${items[0].titre.slice(0, 60)}`,
      html: shell(`<p>Bonjour,</p><p>Les ${items.length} actualités de la semaine qui comptent pour votre entreprise, vérifiées par au moins deux sources.</p>${corps}<p><a href="${SITE}/#heroAI" style="color:#E61E4D;font-weight:700">Une idée pour votre entreprise ? Parlez-en à notre assistant →</a></p>`, `${SITE}/api/devis?nl=stop&t=${v.t}`) })));
    n += res.filter(Boolean).length;
  }
  return { envoyes: n, abonnes: subs.length, actus: items.length };
}

// Entretien : renvoie automatiquement les confirmations restées bloquées (3 essais maximum par adresse).
export async function nlRetry() {
  const [all] = await redis([["HVALS", "nl:subs"]]);
  const bloques = (all || []).map(v => { try { return JSON.parse(v); } catch { return null; } }).filter(x => x && !x.ok && x.envoi === "echec" && (x.essais || 0) < 3);
  let ok = 0;
  for (const x of bloques.slice(0, 20)) if ((await nlResend(x.email)).ok) ok++;
  return { bloques: bloques.length, renvoyes: ok };
}
