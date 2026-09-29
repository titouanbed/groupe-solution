// GET /api/geo  (Vercel Function) — localisation APPROXIMATIVE du visiteur (ville), déduite par Vercel
// de l'adresse IP de la requête. Rien n'est enregistré ni journalisé : la réponse sert uniquement à
// suggérer la page de la commune la plus proche (assets/perso.js).
const dec = v => { try { return v ? decodeURIComponent(v) : ''; } catch { return v || ''; } };
export default function handler(req, res) {
  const h = req.headers;
  const lat = parseFloat(h['x-vercel-ip-latitude']), lng = parseFloat(h['x-vercel-ip-longitude']);
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'private, no-store');
  res.end(JSON.stringify({
    city: dec(h['x-vercel-ip-city']).slice(0, 80),
    region: String(h['x-vercel-ip-country-region'] || '').slice(0, 10),
    country: String(h['x-vercel-ip-country'] || '').slice(0, 2),
    // arrondi à ~1 km : suffisant pour trouver la commune, pas plus
    lat: Number.isFinite(lat) ? Math.round(lat * 100) / 100 : null,
    lng: Number.isFinite(lng) ? Math.round(lng * 100) / 100 : null
  }));
}
