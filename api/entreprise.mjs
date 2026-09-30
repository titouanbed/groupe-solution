// POST /api/entreprise { q?, url? }  (Vercel Function) — « Analyser mon entreprise ».
// Déclenché uniquement quand le visiteur donne LUI-MÊME le nom de son entreprise (ou son SIREN) et/ou
// l'adresse de son site. Renvoie :
//   • la fiche publique de l'entreprise (annuaire officiel recherche-entreprises.api.gouv.fr) :
//     raison sociale, activité, date de création, tranche d'effectif, commune — pas les dirigeants ;
//   • l'analyse de la page d'accueil de son site : ce que tout internaute peut voir (HTTPS, mobile,
//     balises de référencement, moyens de contact, réseaux sociaux, poids, extrait de texte).
// Rien n'est stocké. Le contenu du site est traité comme une donnée, jamais comme une instruction.
import { allow, sameSite, readBody } from "./_guard.mjs";
import { registre, fetchPage, analyse } from "./_entreprise-lib.mjs";

const send = (res, status, body) => { res.statusCode = status; res.setHeader("Content-Type", "application/json; charset=utf-8"); res.setHeader("Cache-Control", "private, no-store"); res.end(JSON.stringify(body)); };

export default async function handler(req, res) {
  if (req.method !== "POST") return send(res, 405, { error: "method_not_allowed" });
  if (!sameSite(req)) return send(res, 403, { error: "forbidden" });
  // 15 analyses / heure par visiteur, 500 / jour au total.
  if (!(await allow("entreprise", req, 15, 3600, 500))) return send(res, 429, { error: "rate_limited" });
  const b = readBody(req);
  const q = String(b.q || "").replace(/[\u0000-\u001f<>]/g, " ").trim().slice(0, 120);
  const url = String(b.url || "").trim().slice(0, 300);
  if (q.length < 2 && !url) return send(res, 400, { error: "empty" });
  try {
    const [ent, page] = await Promise.all([q.length >= 2 ? registre(q) : null, url ? fetchPage(url) : null]);
    let site = null; try { site = page && !page.error ? analyse(page) : null; } catch { site = null; }
    return send(res, 200, { entreprise: ent, site, site_erreur: page && page.error ? page.error : site ? null : page ? "page illisible" : null });
  } catch (e) {
    console.error("entreprise:", e?.message);
    return send(res, 502, { error: "lecture_impossible" });
  }
}
