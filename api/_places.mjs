// Google Places (New) — appels comptés et plafonnés pour rester dans la part GRATUITE de Google.
// Chaque appel (recherche ou photo) passe par budget() : compteur mensuel + compteur du jour dans Upstash.
// Plafonds par défaut : 800 appels / mois (Google offre 1 000 / mois par type d'appel), 100 / jour.
// Réglables sans toucher au code : PLACES_MONTHLY_CAP, PLACES_DAILY_CAP. Sans Upstash : aucun appel (prudence).
import { redis, UPSTASH } from "./_guard.mjs";

const KEY = () => String(process.env.GOOGLE_PLACES_KEY || "").trim();
const CAP_M = () => Math.max(0, +process.env.PLACES_MONTHLY_CAP || 800);
const CAP_D = () => Math.max(0, +process.env.PLACES_DAILY_CAP || 100);
const mois = () => new Date().toISOString().slice(0, 7);
const jour = () => new Date().toISOString().slice(0, 10);

export const placesOn = () => !!(KEY() && UPSTASH);

// Réserve n appels ; refuse (et rend la réservation) si un plafond serait dépassé.
export async function budget(n = 1) {
  if (!placesOn()) return false;
  try {
    const km = "places:m:" + mois(), kd = "places:d:" + jour();
    const r = await redis([["INCRBY", km, n], ["EXPIRE", km, 3024000], ["INCRBY", kd, n], ["EXPIRE", kd, 172800]]);
    const m = +r[0], d = +r[2];
    if (m > CAP_M() || d > CAP_D()) { await redis([["DECRBY", km, n], ["DECRBY", kd, n]]); return false; }
    return true;
  } catch { return false; }
}

export async function placesUsage() {
  if (!UPSTASH) return { actif: false };
  try {
    const r = await redis([["GET", "places:m:" + mois()], ["GET", "places:d:" + jour()]]);
    return { actif: !!KEY(), mois: +r[0] || 0, jour: +r[1] || 0, plafond_mois: CAP_M(), plafond_jour: CAP_D() };
  } catch { return { actif: !!KEY() }; }
}

export async function searchText(body, mask) {
  if (!(await budget(1))) return null;
  try {
    const r = await fetch("https://places.googleapis.com/v1/places:searchText", { method: "POST", signal: AbortSignal.timeout(6000),
      headers: { "Content-Type": "application/json", "X-Goog-Api-Key": KEY(), "X-Goog-FieldMask": mask },
      body: JSON.stringify({ languageCode: "fr", regionCode: "FR", ...body }) });
    if (!r.ok) return null;
    const j = await r.json(), l = j.places || [];
    l.nextPageToken = j.nextPageToken || "";   // page suivante (recherches de plus de 20 résultats)
    return l;
  } catch { return null; }
}

export async function photoMedia(name, maxWidth = 900) {
  if (!(await budget(1))) return null;
  try {
    const m = await fetch(`https://places.googleapis.com/v1/${name}/media?maxWidthPx=${maxWidth}&key=${encodeURIComponent(KEY())}`, { signal: AbortSignal.timeout(5000) });
    const type = String(m.headers.get("content-type") || "");
    if (!m.ok || !/^image\/(jpeg|png|webp)/.test(type)) return null;
    const buf = Buffer.from(await m.arrayBuffer()); if (buf.length > 400000) return null;
    return `data:${type.split(";")[0]};base64,${buf.toString("base64")}`;
  } catch { return null; }
}
