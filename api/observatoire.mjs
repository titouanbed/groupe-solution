// GET /api/observatoire — chiffres publics et anonymes de l'Observatoire du numérique local (voir _observatoire.mjs).
import { obsPublic } from "./_observatoire.mjs";

export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  if (req.method !== "GET") { res.statusCode = 405; return res.end('{"error":"method_not_allowed"}'); }
  try {
    const d = await obsPublic();
    res.setHeader("Cache-Control", "public, s-maxage=1800, stale-while-revalidate=86400");
    res.statusCode = 200; res.end(JSON.stringify(d));
  } catch { res.statusCode = 503; res.setHeader("Cache-Control", "no-store"); res.end('{"error":"indisponible"}'); }
}
