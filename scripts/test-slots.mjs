// Test hors-ligne de la génération de créneaux (horaires + buffer + free/busy).
// Lancement : npm run test:slots
import { DateTime, Interval } from "luxon";
import { CONFIG, generateSlots } from "../api/_shared.mjs";

let pass = 0, fail = 0;
const ok = (cond, msg) => { if (cond) { pass++; console.log("  ✓ " + msg); } else { fail++; console.log("  ✗ " + msg); } };

// Point de départ fixe : mercredi 2026-08-12 08:00 (Europe/Paris) pour un test déterministe.
const now = DateTime.fromISO("2026-08-12T08:00:00", { zone: CONFIG.timezone });

console.log("\n1) Sans évènement occupé :");
const free = generateSlots([], now);
ok(free.length > 0, `${free.length} créneaux générés sur ${CONFIG.horizonDays} jours`);
ok(free.every(s => s.start && s.end && s.time && s.dayKey), "chaque créneau est structuré (start/end/time/dayKey)");

// Respect du délai minimum (lead) : aucun créneau avant now + leadHours.
const earliest = now.plus({ hours: CONFIG.leadHours });
ok(free.every(s => DateTime.fromISO(s.start) >= earliest), `aucun créneau avant le délai minimum (+${CONFIG.leadHours}h)`);

// Weekends fermés : aucun samedi/dimanche.
ok(free.every(s => { const wd = DateTime.fromISO(s.start).setZone(CONFIG.timezone).weekday; return wd >= 1 && wd <= 5; }), "aucun créneau le week-end");

// Espacement : deux créneaux consécutifs le même jour sont espacés d'au moins meeting+buffer.
const step = CONFIG.meetingMinutes + CONFIG.bufferMinutes;
const byDay = {};
free.forEach(s => (byDay[s.dayKey] ??= []).push(DateTime.fromISO(s.start)));
let spacingOk = true;
for (const day in byDay) {
  const ds = byDay[day].sort((a, b) => a - b);
  for (let i = 1; i < ds.length; i++) if (ds[i].diff(ds[i - 1], "minutes").minutes < step - 0.01) spacingOk = false;
}
ok(spacingOk, `espacement ≥ ${step} min entre créneaux d'une même journée (buffer respecté)`);

// Horaires : chaque créneau tombe dans une plage d'ouverture.
const inHours = free.every(s => {
  const d = DateTime.fromISO(s.start).setZone(CONFIG.timezone);
  const ranges = CONFIG.openingHours[d.weekday] || [];
  return ranges.some(([o, c]) => {
    const [oh, om] = o.split(":").map(Number), [ch, cm] = c.split(":").map(Number);
    const open = d.set({ hour: oh, minute: om }), close = d.set({ hour: ch, minute: cm });
    return d >= open && d.plus({ minutes: CONFIG.meetingMinutes }) <= close;
  });
});
ok(inHours, "chaque créneau est dans une plage d'ouverture");

console.log("\n2) Avec un évènement occupé (jeudi 10:00–11:00) :");
const busyDay = now.plus({ days: 1 }).set({ hour: 10, minute: 0 });
const busy = [Interval.fromDateTimes(busyDay, busyDay.plus({ hours: 1 }))];
const withBusy = generateSlots(busy, now);
// Un créneau chevauchant l'évènement ± buffer doit disparaître.
const conflict = withBusy.some(s => {
  const st = DateTime.fromISO(s.start), en = DateTime.fromISO(s.end);
  const guarded = Interval.fromDateTimes(busyDay.minus({ minutes: CONFIG.bufferMinutes }), busyDay.plus({ hours: 1 }).plus({ minutes: CONFIG.bufferMinutes }));
  return guarded.overlaps(Interval.fromDateTimes(st, en));
});
ok(!conflict, "aucun créneau ne chevauche l'évènement occupé (buffer inclus)");
ok(withBusy.length < free.length, `des créneaux ont bien été retirés (${free.length} → ${withBusy.length})`);

console.log(`\nRésultat : ${pass} réussis, ${fail} échoués.`);
console.log("Exemples de créneaux :", free.slice(0, 4).map(s => `${s.dayLabel} ${s.time}`));
process.exit(fail ? 1 : 0);
