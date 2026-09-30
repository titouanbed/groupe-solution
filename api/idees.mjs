// /api/idees  (Vercel Function) — « Laboratoire d'idées » en direct.
//   GET  /api/idees?secteur=restaurant  → { idees: [...] } (50 dernières idées publiées, tous secteurs ou un secteur)
//   POST /api/idees { id }              → publie l'idée ANONYME préparée par /api/concept (attente 1 h max)
// Seules des idées rédigées par notre IA sous forme anonyme sont publiées, et uniquement sur clic du visiteur.
const URL_ = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || process.env[Object.keys(process.env).filter(k => /_REST_(API_)?URL$/.test(k)).sort()[0]];
const TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || process.env[Object.keys(process.env).filter(k => /_REST_(API_)?TOKEN$/.test(k) && !/READ_ONLY/.test(k)).sort()[0]];
const send = (res, status, body, cache) => { res.statusCode = status; res.setHeader("Content-Type", "application/json; charset=utf-8"); res.setHeader("Cache-Control", cache || "no-store"); res.end(JSON.stringify(body)); };
async function redis(cmds) {
  const r = await fetch(URL_ + "/pipeline", { method: "POST", headers: { Authorization: "Bearer " + TOKEN, "Content-Type": "application/json" }, body: JSON.stringify(cmds) });
  if (!r.ok) throw new Error("redis " + r.status);
  return (await r.json()).map(x => x.result);
}
const hits = new Map();
const limited = ip => { const now = Date.now(), a = (hits.get(ip) || []).filter(t => now - t < 3600e3); a.push(now); hits.set(ip, a); return a.length > 10; };

export default async function handler(req, res) {
  if (!URL_ || !TOKEN) return send(res, 503, { configured: false });
  try {
    if (req.method === "GET") {
      const q = new URL(req.url, "http://x").searchParams, secteur = String(req.query?.secteur || q.get("secteur") || "");
      const key = /^[a-z-]{3,40}$/.test(secteur) ? "idees:" + secteur : "idees:all";
      const [list] = await redis([["LRANGE", key, 0, 49]]);
      const idees = (list || []).map(x => { try { return JSON.parse(x); } catch { return null; } }).filter(Boolean);
      return send(res, 200, { idees }, "public, s-maxage=60, stale-while-revalidate=300");
    }
    if (req.method === "POST") {
      const ip = (req.headers["x-forwarded-for"] || "").split(",")[0].trim() || "unknown";
      if (limited(ip)) return send(res, 429, { error: "rate_limited" });
      let b = req.body; if (typeof b === "string") { try { b = JSON.parse(b); } catch { b = {}; } }
      const id = String(b?.id || "");
      if (!/^[0-9a-f-]{36}$/.test(id)) return send(res, 400, { error: "id" });
      const [raw] = await redis([["GET", "idee:pending:" + id]]);
      if (!raw) return send(res, 404, { error: "expired" });
      const idee = JSON.parse(raw);
      await redis([["LPUSH", "idees:all", raw], ["LTRIM", "idees:all", 0, 499], ["LPUSH", "idees:" + idee.secteur, raw], ["LTRIM", "idees:" + idee.secteur, 0, 199], ["DEL", "idee:pending:" + id]]);
      return send(res, 200, { ok: true, secteur: idee.secteur });
    }
    return send(res, 405, { error: "method_not_allowed" });
  } catch (e) {
    console.error("idees:", e.message);
    return send(res, 502, { error: "storage" });
  }
}
