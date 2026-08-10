// ─────────────────────────────────────────────────────────────
//  Groupe Solution — logique partagée de prise de rendez-vous
//  Modèle : OAuth Google (refresh token long) → API Calendar en REST.
//  Aucune dépendance Google lourde : fetch natif (Node 18+) + luxon (fuseaux/DST).
// ─────────────────────────────────────────────────────────────
import { DateTime, Interval } from "luxon";

// ── Configuration des disponibilités (modifiable ici) ──────────
export const CONFIG = {
  timezone: process.env.BOOKING_TIMEZONE || "Europe/Paris",
  meetingMinutes: 30,      // durée d'un rendez-vous
  bufferMinutes: 30,       // buffer imposé entre deux créneaux (et autour des évènements existants)
  leadHours: 12,           // délai minimum avant le premier créneau réservable
  horizonDays: 14,         // fenêtre de réservation (jours à l'avance)
  // Horaires d'ouverture par jour de semaine (1 = lundi … 7 = dimanche).
  // Chaque plage = ["HH:MM", "HH:MM"]. Jour absent ou vide = fermé.
  openingHours: {
    1: [["09:00", "12:30"], ["14:00", "18:00"]],
    2: [["09:00", "12:30"], ["14:00", "18:00"]],
    3: [["09:00", "12:30"], ["14:00", "18:00"]],
    4: [["09:00", "12:30"], ["14:00", "18:00"]],
    5: [["09:00", "12:30"], ["14:00", "17:00"]],
  },
};

// ── Configuration présente ? (identifiants Google fournis) ─────
export function isConfigured() {
  return Boolean(
    process.env.GOOGLE_CLIENT_ID &&
    process.env.GOOGLE_CLIENT_SECRET &&
    process.env.GOOGLE_REFRESH_TOKEN
  );
}

export function calendarId() {
  return process.env.GOOGLE_CALENDAR_ID || "primary";
}

// ── OAuth : échange le refresh token contre un access token ────
export async function getAccessToken() {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    grant_type: "refresh_token",
  });
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`OAuth token refresh failed (${res.status}): ${detail}`);
  }
  const data = await res.json();
  return data.access_token;
}

// ── Free/Busy : périodes occupées sur le calendrier ────────────
export async function getBusy(accessToken, timeMinISO, timeMaxISO) {
  const res = await fetch("https://www.googleapis.com/calendar/v3/freeBusy", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      timeMin: timeMinISO,
      timeMax: timeMaxISO,
      timeZone: CONFIG.timezone,
      items: [{ id: calendarId() }],
    }),
  });
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`freeBusy failed (${res.status}): ${detail}`);
  }
  const data = await res.json();
  const cal = data.calendars?.[calendarId()];
  return (cal?.busy || []).map((b) => Interval.fromDateTimes(
    DateTime.fromISO(b.start), DateTime.fromISO(b.end)
  ));
}

// ── Génération des créneaux candidats (pure, testable hors ligne) ──
//  busyIntervals : tableau d'Interval luxon (peut être vide).
//  now : DateTime (défaut = maintenant). Retourne des créneaux structurés.
export function generateSlots(busyIntervals = [], now = DateTime.now()) {
  const tz = CONFIG.timezone;
  const step = CONFIG.meetingMinutes + CONFIG.bufferMinutes; // espacement des débuts de créneaux
  const earliest = now.setZone(tz).plus({ hours: CONFIG.leadHours });
  const horizonEnd = now.setZone(tz).plus({ days: CONFIG.horizonDays }).endOf("day");

  const slots = [];
  const startDay = now.setZone(tz).startOf("day");

  for (let d = 0; d <= CONFIG.horizonDays; d++) {
    const day = startDay.plus({ days: d });
    const ranges = CONFIG.openingHours[day.weekday] || [];
    for (const [openStr, closeStr] of ranges) {
      const [oh, om] = openStr.split(":").map(Number);
      const [ch, cm] = closeStr.split(":").map(Number);
      const open = day.set({ hour: oh, minute: om, second: 0, millisecond: 0 });
      const close = day.set({ hour: ch, minute: cm, second: 0, millisecond: 0 });

      let cursor = open;
      while (cursor.plus({ minutes: CONFIG.meetingMinutes }) <= close) {
        const start = cursor;
        const end = cursor.plus({ minutes: CONFIG.meetingMinutes });

        const withinWindow = start >= earliest && end <= horizonEnd;
        if (withinWindow && isFree(start, end, busyIntervals)) {
          slots.push({
            start: start.toUTC().toISO(),
            end: end.toUTC().toISO(),
            dayKey: start.toFormat("yyyy-MM-dd"),
            dayLabel: capitalize(start.setLocale("fr").toFormat("cccc d LLLL")),
            time: start.toFormat("HH:mm"),
          });
        }
        cursor = cursor.plus({ minutes: step });
      }
    }
  }
  return slots;
}

// Un créneau est libre s'il ne recoupe aucune période occupée élargie du buffer.
function isFree(start, end, busyIntervals) {
  const b = CONFIG.bufferMinutes;
  const guarded = Interval.fromDateTimes(start.minus({ minutes: b }), end.plus({ minutes: b }));
  return !busyIntervals.some((busy) => busy.overlaps(guarded));
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// Réponse JSON (format Vercel : on écrit directement dans `res`).
export const send = (res, statusCode, payload) => {
  res.setHeader("Cache-Control", "no-store");
  res.status(statusCode).json(payload);
};
