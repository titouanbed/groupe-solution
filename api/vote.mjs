// /api/vote  (Vercel Function) — « Le pouls des dirigeants » : votes sur les actus et dossiers.
// Stockage : Upstash Redis (Vercel → Storage → Upstash for Redis, offre gratuite), via son API REST.
// Variables fournies automatiquement par l'intégration : KV_REST_API_URL + KV_REST_API_TOKEN
// (ou UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN). Sans elles → 503 et le widget reste masqué.
//   GET  /api/vote?ids=a,b,c          → { counts: { a: { utile: 3, surveiller: 1, pasmoi: 0 }, … } }
//   POST /api/vote { id, choice }     → { ok, counts }   (1 vote par IP et par sujet, 30 jours)
const URL_ = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
export const CHOICES = ['utile', 'surveiller', 'pasmoi'];
const ID_RE = /^[a-z0-9:-]{3,120}$/;

const send = (res, status, body) => { res.statusCode = status; res.setHeader('Content-Type', 'application/json; charset=utf-8'); res.setHeader('Cache-Control', 'no-store'); res.end(JSON.stringify(body)); };
const redis = async commands => {
  const r = await fetch(URL_ + '/pipeline', { method: 'POST', headers: { Authorization: 'Bearer ' + TOKEN, 'Content-Type': 'application/json' }, body: JSON.stringify(commands) });
  if (!r.ok) throw new Error('redis ' + r.status);
  return (await r.json()).map(x => x.result);
};
const toCounts = flat => { const o = Object.fromEntries(CHOICES.map(c => [c, 0])); for (let i = 0; i + 1 < (flat || []).length; i += 2) if (CHOICES.includes(flat[i])) o[flat[i]] = +flat[i + 1] || 0; return o; };

export default async function handler(req, res) {
  if (!URL_ || !TOKEN) return send(res, 503, { configured: false });
  try {
    if (req.method === 'GET') {
      const ids = String(req.query?.ids || new URL(req.url, 'http://x').searchParams.get('ids') || '').split(',').filter(id => ID_RE.test(id)).slice(0, 60);
      if (!ids.length) return send(res, 400, { error: 'ids' });
      const out = await redis(ids.map(id => ['HGETALL', 'poll:' + id]));
      res.setHeader('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=120');
      return send(res, 200, { counts: Object.fromEntries(ids.map((id, i) => [id, toCounts(out[i])])) });
    }
    if (req.method === 'POST') {
      let body = req.body;
      if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
      const id = String(body?.id || ''), choice = String(body?.choice || '');
      if (!ID_RE.test(id) || !CHOICES.includes(choice)) return send(res, 400, { error: 'invalid' });
      const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
      const [first] = await redis([['SET', `voted:${id}:${ip}`, '1', 'NX', 'EX', 2592000]]);
      if (first !== 'OK') { const [flat] = await redis([['HGETALL', 'poll:' + id]]); return send(res, 200, { ok: false, already: true, counts: toCounts(flat) }); }
      const [, flat] = await redis([['HINCRBY', 'poll:' + id, choice, 1], ['HGETALL', 'poll:' + id], ['ZINCRBY', 'poll:index', 1, id]]);
      return send(res, 200, { ok: true, counts: toCounts(flat) });
    }
    return send(res, 405, { error: 'method_not_allowed' });
  } catch (e) {
    console.error('vote:', e.message);
    return send(res, 502, { error: 'storage' });
  }
}
