// POST /api/book  { start, name, email, topic? }  (Vercel Function)
// Vérifie que le créneau est toujours libre, puis crée l'évènement (avec invitation).
import { DateTime, Interval } from "luxon";
import { CONFIG, isConfigured, calendarId, getAccessToken, getBusy, send } from "./_shared.mjs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(req, res) {
  if (req.method !== "POST") return send(res, 405, { error: "method_not_allowed" });
  if (!isConfigured()) return send(res, 503, { configured: false, error: "not_configured" });

  // Vercel parse déjà le JSON ; on gère aussi le cas d'un corps encore en chaîne.
  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body || "{}"); }
    catch { return send(res, 400, { error: "invalid_json" }); }
  }
  body = body || {};

  const name = (body.name || "").trim();
  const email = (body.email || "").trim();
  const topic = (body.topic || "").trim();
  const startISO = body.start;

  // ── Validation ──
  if (!name || name.length < 2) return send(res, 400, { error: "invalid_name" });
  if (!EMAIL_RE.test(email)) return send(res, 400, { error: "invalid_email" });
  const start = DateTime.fromISO(startISO);
  if (!start.isValid) return send(res, 400, { error: "invalid_start" });

  const startZ = start.setZone(CONFIG.timezone);
  const endZ = startZ.plus({ minutes: CONFIG.meetingMinutes });

  // Refus si le créneau est dans le passé ou hors du délai minimum.
  if (startZ < DateTime.now().plus({ hours: CONFIG.leadHours })) {
    return send(res, 409, { error: "slot_too_soon" });
  }

  try {
    const accessToken = await getAccessToken();

    // ── Re-vérification anti-double-réservation (avec buffer) ──
    const guard = Interval.fromDateTimes(
      startZ.minus({ minutes: CONFIG.bufferMinutes }),
      endZ.plus({ minutes: CONFIG.bufferMinutes })
    );
    const busy = await getBusy(accessToken, guard.start.toUTC().toISO(), guard.end.toUTC().toISO());
    if (busy.some((b) => b.overlaps(Interval.fromDateTimes(startZ, endZ)))) {
      return send(res, 409, { error: "slot_taken" });
    }

    // ── Création de l'évènement (gres = réponse de l'API Google, distincte de `res`) ──
    const gres = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId())}/events?sendUpdates=all&conferenceDataVersion=1`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          summary: `Rendez-vous — ${name} × Groupe Solution`,
          description:
            `Demande de rendez-vous via groupe-solution.\n\n` +
            `Nom : ${name}\nEmail : ${email}\n` +
            (topic ? `Sujet : ${topic}\n` : ""),
          start: { dateTime: startZ.toISO(), timeZone: CONFIG.timezone },
          end: { dateTime: endZ.toISO(), timeZone: CONFIG.timezone },
          attendees: [{ email, displayName: name }],
          reminders: { useDefault: true },
          conferenceData: {
            createRequest: {
              requestId: `gs-${Date.now()}`,
              conferenceSolutionKey: { type: "hangoutsMeet" },
            },
          },
        }),
      }
    );

    if (!gres.ok) {
      const detail = await gres.text();
      console.error("event insert failed:", gres.status, detail);
      return send(res, 502, { error: "booking_failed" });
    }
    const ev = await gres.json();
    return send(res, 200, {
      ok: true,
      eventId: ev.id,
      htmlLink: ev.htmlLink,
      meetLink: ev.hangoutLink || null,
      start: startZ.toISO(),
      end: endZ.toISO(),
      timezone: CONFIG.timezone,
    });
  } catch (err) {
    console.error("book error:", err);
    return send(res, 502, { error: "booking_failed" });
  }
}
