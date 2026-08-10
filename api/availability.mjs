// GET /api/availability  (Vercel Function)
// Renvoie les créneaux disponibles (déjà filtrés par horaires + buffer + free/busy Google).
import { DateTime } from "luxon";
import { CONFIG, isConfigured, getAccessToken, getBusy, generateSlots, send } from "./_shared.mjs";

export default async function handler(req, res) {
  if (!isConfigured()) {
    // Pas encore d'identifiants Google → l'UI bascule en mode démonstration.
    return send(res, 200, { configured: false, timezone: CONFIG.timezone, slots: [] });
  }
  try {
    const now = DateTime.now();
    const timeMin = now.toUTC().toISO();
    const timeMax = now.plus({ days: CONFIG.horizonDays }).endOf("day").toUTC().toISO();

    const accessToken = await getAccessToken();
    const busy = await getBusy(accessToken, timeMin, timeMax);
    const slots = generateSlots(busy, now);

    return send(res, 200, {
      configured: true,
      timezone: CONFIG.timezone,
      meetingMinutes: CONFIG.meetingMinutes,
      slots,
    });
  } catch (err) {
    console.error("availability error:", err);
    return send(res, 502, { configured: true, error: "availability_failed" });
  }
}
