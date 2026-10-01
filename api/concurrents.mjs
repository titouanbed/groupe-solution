// POST /api/concurrents — « Vous face à vos concurrents » : l'entreprise analysée comparée aux 3 établissements
// les plus proches du même métier, d'après les fiches publiques Google Maps (note, nombre d'avis, site).
// Coût maîtrisé : 2 recherches Google au maximum par comparaison, résultat gardé 30 jours (une même entreprise
// ne coûte qu'une fois), et toutes les recherches passent par le plafond gratuit de _places.mjs.
// Aucune donnée sur des personnes : uniquement des fiches d'établissements publiques.
import { createHash } from "node:crypto";
import { allow, sameSite, readBody, redis, UPSTASH } from "./_guard.mjs";
import { placesOn, searchText } from "./_places.mjs";
import { tagConv } from "./_conv.mjs";
import { obsGoogle } from "./_observatoire.mjs";

const MASK = "places.id,places.displayName,places.rating,places.userRatingCount,places.websiteUri,places.primaryTypeDisplayName,places.location,places.photos,places.businessStatus";
const send = (res, status, body) => { res.statusCode = status; res.setHeader("Content-Type", "application/json; charset=utf-8"); res.setHeader("Cache-Control", "private, no-store"); res.end(JSON.stringify(body)); };
const clip = (v, n) => String(v || "").replace(/\s+/g, " ").trim().slice(0, n);
const norm = s => String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, " ").trim();
const fiche = p => ({ nom: clip(p.displayName?.text, 70), note: typeof p.rating === "number" ? Math.round(p.rating * 10) / 10 : null, avis: p.userRatingCount || 0, site: !!p.websiteUri, photos: (p.photos || []).length });

// Même entreprise ? (le nom Google contient souvent l'enseigne plutôt que la raison sociale)
function memeNom(a, b) {
  const x = norm(a), y = norm(b); if (!x || !y) return false;
  if (x.includes(y) || y.includes(x)) return true;
  const mx = x.split(" ").filter(w => w.length > 3), my = new Set(y.split(" ").filter(w => w.length > 3));
  return mx.length > 0 && mx.filter(w => my.has(w)).length >= Math.min(2, mx.length);
}

// Constats calculés (aucune IA, aucun chiffre inventé) : seulement ce que montrent les fiches.
function constats(moi, autres) {
  const out = [];
  if (!autres.length) return out;
  const moyAvis = Math.round(autres.reduce((s, c) => s + c.avis, 0) / autres.length);
  const notes = autres.filter(c => c.note != null), moyNote = notes.length ? notes.reduce((s, c) => s + c.note, 0) / notes.length : null;
  if (!moi) {
    out.push({ ton: "alerte", texte: "Votre entreprise n'apparaît pas sur Google Maps alors que vos concurrents y sont : c'est souvent la première chose qu'un client regarde." });
    return out;
  }
  if (moi.avis < moyAvis) out.push({ ton: "alerte", texte: `Vos concurrents ont en moyenne ${moyAvis} avis, vous en avez ${moi.avis}. Demander un avis au bon moment, automatiquement, aide à combler l'écart.` });
  else if (moi.avis > 0) out.push({ ton: "bon", texte: `Avec ${moi.avis} avis, vous faites mieux que la moyenne de vos concurrents (${moyAvis}).` });
  if (moi.note != null && moyNote != null) {
    if (moi.note >= moyNote + 0.1) out.push({ ton: "bon", texte: `Votre note (${moi.note.toFixed(1).replace(".", ",")}) est au-dessus de celle de vos concurrents : c'est un atout à mettre en avant.` });
    else if (moi.note < moyNote - 0.1) out.push({ ton: "alerte", texte: `Votre note (${moi.note.toFixed(1).replace(".", ",")}) est un peu sous celle de vos concurrents (${moyNote.toFixed(1).replace(".", ",")}). Répondre à chaque avis aide à la remonter.` });
  }
  const avecSite = autres.filter(c => c.site).length;
  if (!moi.site && avecSite) out.push({ ton: "alerte", texte: avecSite > 1 ? `${avecSite} concurrents sur ${autres.length} ont un site relié à leur fiche Google, pas vous.` : "Un de vos concurrents a un site relié à sa fiche Google, pas vous." });
  if (moi.photos < 3 && autres.some(c => c.photos >= 5)) out.push({ ton: "info", texte: "Votre fiche a peu de photos ; celles de vos concurrents en montrent davantage." });
  return out.slice(0, 3);
}

export default async function handler(req, res) {
  // GET : le chat demande seulement si la comparaison est disponible (clé Google présente), pour ne pas proposer une étape impossible.
  if (req.method === "GET") { res.setHeader("Cache-Control", "public, s-maxage=300"); res.setHeader("Content-Type", "application/json; charset=utf-8"); res.statusCode = 200; return res.end(JSON.stringify({ on: placesOn() })); }
  if (req.method !== "POST") return send(res, 405, { error: "method_not_allowed" });
  if (!sameSite(req)) return send(res, 403, { error: "forbidden" });
  if (!placesOn()) return send(res, 503, { configured: false });
  const b = readBody(req);
  const nom = clip(b.nom, 90), commune = clip(b.commune, 60), secteur = clip(b.secteur, 90);
  if (!nom || !commune) return send(res, 400, { error: "nom_commune" });

  const cle = "conc:" + createHash("sha1").update(norm(nom) + "|" + norm(commune)).digest("hex").slice(0, 20);
  try { const c = await redis([["GET", cle]]); if (c[0]) return send(res, 200, { ...JSON.parse(c[0]), cache: true }); } catch {}
  // 6 comparaisons / heure par visiteur, 40 / jour au total (en plus des plafonds Google).
  if (!(await allow("concurrents", req, 6, 3600, 40))) return send(res, 429, { error: "rate_limited" });

  // 1) L'entreprise elle-même (pour sa note, sa position et son métier tel que Google le nomme).
  const trouv = await searchText({ textQuery: `${nom} ${commune}`, maxResultCount: 3 }, MASK);
  if (trouv === null) return send(res, 503, { error: "indisponible" });
  const moiP = trouv.find(p => memeNom(p.displayName?.text, nom)) || null;
  const metier = clip(moiP?.primaryTypeDisplayName?.text, 60) || secteur;
  if (!metier) return send(res, 200, { ok: false, raison: "metier" });

  // 2) Les établissements du même métier autour d'elle.
  const body = { textQuery: `${metier} ${commune}`, maxResultCount: 8 };
  if (moiP?.location) body.locationBias = { circle: { center: moiP.location, radius: 12000 } };
  const proches = await searchText(body, MASK);
  if (proches === null) return send(res, 503, { error: "indisponible" });
  const autresP = proches.filter(p => p.id !== moiP?.id && !memeNom(p.displayName?.text, nom) && p.businessStatus !== "CLOSED_PERMANENTLY").slice(0, 3);
  const autres = autresP.map(fiche);
  await obsGoogle(metier, [moiP, ...autresP].filter(Boolean).map(p => ({ id: p.id, ...fiche(p) })));
  const moi = moiP ? fiche(moiP) : null;
  const out = { ok: autres.length > 0, metier, commune, moi, autres, constats: constats(moi, autres), source: "Fiches publiques Google Maps", date: new Date().toISOString().slice(0, 10) };
  if (UPSTASH) { try { await redis([["SET", cle, JSON.stringify(out), "EX", 2592000]]); } catch {} }
  if (b.sid) { try { await tagConv(String(b.sid).slice(0, 40), { evenement: "Comparaison concurrents", detail: `${nom} (${commune}) : ${moi ? (moi.note ?? "–") + "★, " + moi.avis + " avis" : "absente de Google Maps"} · concurrents : ${autres.map(a => a.nom + " " + (a.note ?? "–") + "★/" + a.avis).join(" ; ")}` }); } catch {} }
  return send(res, 200, out);
}
