// POST /api/t — mesure d'audience du site (voir _trafic.mjs) : sans cookie, sans adresse IP enregistrée.
import { sameSite, allow, readBody, UPSTASH } from "./_guard.mjs";
import { enregistrer } from "./_trafic.mjs";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  const fin = () => { res.statusCode = 204; res.end(); };
  if (req.method !== "POST" || !UPSTASH) return fin();
  try {
    if (!sameSite(req)) return fin();
    // Garde-fou : 120 événements par minute et par visiteur, 30 000 par jour au total.
    if (!(await allow("t", req, 120, 60, 30000))) return fin();
    await enregistrer(readBody(req), req.headers);
  } catch (e) { console.error("trafic", e?.message); }
  return fin();
}
