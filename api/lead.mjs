// POST /api/lead  (Vercel Function)
// Reçoit toutes les demandes des formulaires du site et les envoie par e-mail via Brevo
// (offre gratuite nettement plus large que les 50 envois/mois de Formspree gratuit).
// Variables Vercel : BREVO_API_KEY, LEAD_FROM (expéditeur validé dans Brevo), LEAD_TO (défaut : contact@groupsolution.fr).
// Sans BREVO_API_KEY → 503 { configured:false } et le navigateur bascule sur Formspree (comportement actuel).
import { randomBytes } from "node:crypto";
import { allow, sameSite, readBody, redis, UPSTASH } from "./_guard.mjs";
import { sendMail, OWNER } from "./_mail.mjs";
import { tagConv } from "./_conv.mjs";
const send = (res, status, body) => { res.statusCode = status; res.setHeader("Content-Type", "application/json; charset=utf-8"); res.setHeader("Cache-Control", "no-store"); res.end(JSON.stringify(body)); };
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const EMAIL = /^[^\s@<>"]{1,64}@[^\s@<>"]{1,190}\.[a-z]{2,}$/i;

export default async function handler(req, res) {
  if (req.method !== "POST") return send(res, 405, { error: "method_not_allowed" });
  if (!sameSite(req)) return send(res, 403, { error: "forbidden" });
  const body = readBody(req);
  if (body._gotcha) return send(res, 200, { ok: true }); // pot de miel anti-robots
  // 6 demandes / heure par visiteur, 150 / jour au total (partagé entre instances).
  if (!(await allow("lead", req, 6, 3600, 150))) return send(res, 429, { error: "rate_limited" });
  const fields = Object.entries(body).filter(([k, v]) => k !== "sid" && typeof v === "string" && v.trim() && k.length < 40).slice(0, 20).map(([k, v]) => [k, v.slice(0, 4000)]);
  await tagConv(String(body.sid || ""), { evenement: "Demande de rappel", contact: { nom: body.nom, telephone: body.telephone, email: body.email } });
  const get = k => (fields.find(([f]) => f === k) || [])[1] || "";
  const contact = get("telephone") || get("contact") || get("email");
  if (!contact) return send(res, 400, { error: "missing_contact" });

  const who = get("nom") || "Visiteur";
  const where = [get("commune"), get("page")].filter(Boolean).join(" · ");
  const subject = `📩 Nouvelle demande — ${who}${where ? " · " + where : ""}`.slice(0, 180);
  const html = `<h2 style="font-family:sans-serif">Nouvelle demande depuis groupsolution.fr</h2><table style="font-family:sans-serif;border-collapse:collapse">${fields.map(([k, v]) => `<tr><td style="padding:6px 12px;border:1px solid #eee;font-weight:bold;vertical-align:top">${esc(k)}</td><td style="padding:6px 12px;border:1px solid #eee;white-space:pre-wrap">${esc(v)}</td></tr>`).join("")}</table>`;
  const email = [get("email"), get("contact")].map(x => x.trim()).find(x => EMAIL.test(x)) || "";
  // 1. Sauvegarde AVANT tout envoi : aucune demande ne peut être perdue (visible dans le tableau de bord).
  const id = randomBytes(12).toString("hex"), rec = { id, date: new Date().toISOString(), nom: who, telephone: get("telephone"), email, champs: Object.fromEntries(fields), sid: String(body.sid || "").slice(0, 40) || null, statut: "nouveau" };
  if (UPSTASH) { try { await redis([["SET", "lead:" + id, JSON.stringify(rec), "EX", 365 * 86400], ["LPUSH", "leads:list", id], ["LTRIM", "leads:list", 0, 999]]); } catch (e) { console.error("lead: stockage", e?.message); } }
  // 2. E-mail à Titouan. En cas d'échec, le navigateur bascule sur Formspree (double sécurité).
  const ok = await sendMail({ to: OWNER(), replyTo: email || undefined, subject, html });
  if (UPSTASH) { try { rec.mail = ok ? "envoye" : "echec"; await redis([["SET", "lead:" + id, JSON.stringify(rec), "KEEPTTL"]]); } catch {} }
  return ok ? send(res, 200, { ok: true, id }) : send(res, 502, { error: "mail_failed", saved: UPSTASH ? true : false });
}
