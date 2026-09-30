// /api/idees  (Vercel Function) — « Laboratoire d'idées » en direct.
//   GET  /api/idees?secteur=restaurant  → { idees: [...] } (50 dernières idées publiées, tous secteurs ou un secteur)
//   POST /api/idees { id }              → publie l'idée ANONYME préparée par /api/concept (attente 1 h max)
// Seules des idées rédigées par notre IA sous forme anonyme, passées au filtre anti-identifiants de
// /api/concept, sont publiées, uniquement sur clic du visiteur, et 30 au plus par jour.
import { allow, sameSite, readBody, redis, UPSTASH } from "./_guard.mjs";

const send = (res, status, body, cache) => { res.statusCode = status; res.setHeader("Content-Type", "application/json; charset=utf-8"); res.setHeader("Cache-Control", cache || "no-store"); res.end(JSON.stringify(body)); };
const cache = new Map(); // lecture : 60 s par instance, quelle que soit l'URL demandée

export default async function handler(req, res) {
  if (!UPSTASH) return send(res, 503, { configured: false });
  try {
    if (req.method === "GET") {
      const q = new URL(req.url, "http://x").searchParams, secteur = String(req.query?.secteur || q.get("secteur") || "");
      const key = /^[a-z-]{3,40}$/.test(secteur) ? "idees:" + secteur : "idees:all";
      let hit = cache.get(key);
      if (!hit || Date.now() - hit.t > 60e3) {
        const [list] = await redis([["LRANGE", key, 0, 49]]);
        hit = { t: Date.now(), idees: (list || []).map(x => { try { return JSON.parse(x); } catch { return null; } }).filter(Boolean) };
        if (cache.size > 40) cache.clear();
        cache.set(key, hit);
      }
      return send(res, 200, { idees: hit.idees }, "public, s-maxage=60, stale-while-revalidate=300");
    }
    if (req.method === "POST") {
      if (!sameSite(req)) return send(res, 403, { error: "forbidden" });
      if (!(await allow("idees", req, 5, 3600, 30))) return send(res, 429, { error: "rate_limited" });
      const id = String(readBody(req).id || "");
      if (!/^[0-9a-f-]{36}$/.test(id)) return send(res, 400, { error: "id" });
      const [raw] = await redis([["GET", "idee:pending:" + id]]);
      if (!raw) return send(res, 404, { error: "expired" });
      const idee = JSON.parse(raw);
      await redis([["LPUSH", "idees:all", raw], ["LTRIM", "idees:all", 0, 499], ["LPUSH", "idees:" + idee.secteur, raw], ["LTRIM", "idees:" + idee.secteur, 0, 199], ["DEL", "idee:pending:" + id]]);
      cache.clear();
      return send(res, 200, { ok: true, secteur: idee.secteur });
    }
    return send(res, 405, { error: "method_not_allowed" });
  } catch (e) {
    console.error("idees:", e.message);
    return send(res, 502, { error: "storage" });
  }
}
