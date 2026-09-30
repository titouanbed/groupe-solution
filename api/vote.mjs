// /api/vote  (Vercel Function) — « Le pouls des dirigeants » : votes sur les actus et dossiers.
// Stockage : Upstash Redis (Vercel → Storage → Upstash for Redis, offre gratuite), via son API REST.
// Sans base connectée → 503 et le widget reste masqué.
//   GET  /api/vote?ids=a,b,c          → { counts: { a: { utile: 3, surveiller: 1, pasmoi: 0 }, … } }
//   POST /api/vote { id, choice }     → { ok, counts }   (1 vote par connexion et par sujet, 30 jours ;
//   l'IP n'est jamais stockée : seule une empreinte HMAC-SHA-256, avec une clé secrète, sert d'anti-doublon)
import { createHmac } from 'node:crypto';
import { allow, sameSite, readBody, redis, clientKey, UPSTASH } from './_guard.mjs';

export const CHOICES = ['utile', 'surveiller', 'pasmoi'];
// Seuls les sujets publiés par la rédaction : actu-…, dossier-…, question-…
const ID_RE = /^(actu|dossier|question)-[a-z0-9-]{3,110}$/;
// Clé secrète : VOTE_SALT si définie, sinon le jeton (secret) de la base — jamais une valeur écrite dans le code.
const SECRET = process.env.VOTE_SALT || UPSTASH?.token || '';

const send = (res, status, body, cache) => { res.statusCode = status; res.setHeader('Content-Type', 'application/json; charset=utf-8'); res.setHeader('Cache-Control', cache || 'no-store'); res.end(JSON.stringify(body)); };
const toCounts = flat => { const o = Object.fromEntries(CHOICES.map(c => [c, 0])); for (let i = 0; i + 1 < (flat || []).length; i += 2) if (CHOICES.includes(flat[i])) o[flat[i]] = +flat[i + 1] || 0; return o; };

export default async function handler(req, res) {
  if (!UPSTASH || !SECRET) return send(res, 503, { configured: false });
  try {
    if (req.method === 'GET') {
      const ids = [...new Set(String(req.query?.ids || new URL(req.url, 'http://x').searchParams.get('ids') || '').split(','))].filter(id => ID_RE.test(id)).slice(0, 20);
      if (!ids.length) return send(res, 400, { error: 'ids' });
      if (!(await allow('vote-get', req, 120, 600, 50000))) return send(res, 429, { error: 'rate_limited' });
      const out = await redis(ids.map(id => ['HGETALL', 'poll:' + id]));
      return send(res, 200, { counts: Object.fromEntries(ids.map((id, i) => [id, toCounts(out[i])])) }, 'public, s-maxage=30, stale-while-revalidate=120');
    }
    if (req.method === 'POST') {
      if (!sameSite(req)) return send(res, 403, { error: 'forbidden' });
      if (!(await allow('vote', req, 30, 3600, 5000))) return send(res, 429, { error: 'rate_limited' });
      const body = readBody(req);
      const id = String(body.id || ''), choice = String(body.choice || '');
      if (!ID_RE.test(id) || !CHOICES.includes(choice)) return send(res, 400, { error: 'invalid' });
      const who = createHmac('sha256', SECRET).update(clientKey(req)).digest('hex').slice(0, 24);
      const [first] = await redis([['SET', `voted:${id}:${who}`, '1', 'NX', 'EX', 2592000]]);
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
