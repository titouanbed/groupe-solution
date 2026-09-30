// Journal des conversations du chat (fichier « _ » : pas une route) — lu uniquement par Titouan dans /admin/.
// Une conversation = un identifiant de session tiré au hasard par le navigateur (aucun cookie, aucune IP).
// Conservée 30 jours. Coordonnées rattachées seulement si le visiteur les donne (rappel, devis).
import { redis, UPSTASH } from "./_guard.mjs";

const TTL = 30 * 86400;
export const SID_RE = /^[a-f0-9]{24,32}$/;
const key = sid => "conv:" + sid;
const load = async sid => { const [v] = await redis([["GET", key(sid)]]); try { return v ? JSON.parse(v) : null; } catch { return null; } };

async function save(c) {
  c.maj = new Date().toISOString();
  await redis([["SET", key(c.sid), JSON.stringify(c), "EX", TTL], ["ZADD", "convs", Date.now(), c.sid], ["ZREMRANGEBYSCORE", "convs", 0, Date.now() - TTL * 1000]]);
}
const fresh = (sid, extra) => ({ sid, debut: new Date().toISOString(), messages: [], evenements: [], ...extra });

// Un échange question / réponse de l'assistant.
export async function logTurn(sid, { q, answer, page, mode, fiche, ruptures }) {
  if (!UPSTASH || !SID_RE.test(sid || "")) return;
  try {
    const c = await load(sid) || fresh(sid, { page, mode });
    const ts = new Date().toISOString();
    c.messages.push({ r: "u", t: String(q).slice(0, 2000), ts }, { r: "a", t: String(answer).slice(0, 3000), ts });
    c.messages = c.messages.slice(-60);
    if (fiche?.entreprise) c.entreprise = { nom: fiche.entreprise.nom, commune: fiche.entreprise.commune, secteur: fiche.entreprise.secteur, siren: fiche.entreprise.siren };
    if (fiche?.site?.url) c.site = fiche.site.url;
    if (ruptures?.length) c.idees = ruptures.map(x => x.nom);
    await save(c);
  } catch (e) { console.error("conv:", e?.message); }
}

// Événement (rappel demandé, devis envoyé, plan généré…) et coordonnées éventuelles.
export async function tagConv(sid, { evenement, contact }) {
  if (!UPSTASH || !SID_RE.test(sid || "")) return;
  try {
    const c = await load(sid) || fresh(sid, {});
    if (evenement) c.evenements.push({ t: String(evenement).slice(0, 300), ts: new Date().toISOString() });
    if (contact) c.contact = { ...(c.contact || {}), ...Object.fromEntries(Object.entries(contact).filter(([, v]) => v).map(([k, v]) => [k, String(v).slice(0, 190)])) };
    await save(c);
  } catch (e) { console.error("conv:", e?.message); }
}

export async function listConvs(limit = 80) {
  const [ids] = await redis([["ZREVRANGE", "convs", 0, limit - 1]]);
  if (!ids?.length) return [];
  const all = await redis(ids.map(i => ["GET", key(i)]));
  return all.map(v => { try { return v ? JSON.parse(v) : null; } catch { return null; } }).filter(Boolean).map(c => ({
    sid: c.sid, debut: c.debut, maj: c.maj, n: c.messages.filter(m => m.r === "u").length,
    premier: (c.messages.find(m => m.r === "u")?.t || "").slice(0, 140), entreprise: c.entreprise?.nom || null,
    contact: c.contact || null, evenements: (c.evenements || []).map(e => e.t), statut: c.statut || "nouveau", page: c.page || "/"
  }));
}
export const getConv = load;

export async function setConvStatus(sid, statut) {
  if (!SID_RE.test(sid || "") || !["nouveau", "traite"].includes(statut)) return false;
  const c = await load(sid); if (!c) return false;
  c.statut = statut; await redis([["SET", key(sid), JSON.stringify(c), "KEEPTTL"]]);
  return true;
}
