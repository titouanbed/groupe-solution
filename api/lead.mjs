// POST /api/lead  (Vercel Function)
// Reçoit toutes les demandes des formulaires du site et les envoie par e-mail via Brevo
// (offre gratuite nettement plus large que les 50 envois/mois de Formspree gratuit).
// Variables Vercel : BREVO_API_KEY, LEAD_FROM (expéditeur validé dans Brevo), LEAD_TO (défaut : contact@groupsolution.fr).
// Sans BREVO_API_KEY → 503 { configured:false } et le navigateur bascule sur Formspree (comportement actuel).
import { allow, sameSite, readBody } from "./_guard.mjs";
const send = (res, status, body) => { res.statusCode = status; res.setHeader("Content-Type", "application/json; charset=utf-8"); res.setHeader("Cache-Control", "no-store"); res.end(JSON.stringify(body)); };
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const EMAIL = /^[^\s@<>"]{1,64}@[^\s@<>"]{1,190}\.[a-z]{2,}$/i;

export default async function handler(req, res) {
  if (req.method !== "POST") return send(res, 405, { error: "method_not_allowed" });
  if (!process.env.BREVO_API_KEY || !process.env.LEAD_FROM) return send(res, 503, { configured: false });
  if (!sameSite(req)) return send(res, 403, { error: "forbidden" });
  const body = readBody(req);
  if (body._gotcha) return send(res, 200, { ok: true }); // pot de miel anti-robots
  // 6 demandes / heure par visiteur, 150 / jour au total (partagé entre instances).
  if (!(await allow("lead", req, 6, 3600, 150))) return send(res, 429, { error: "rate_limited" });
  const fields = Object.entries(body).filter(([k, v]) => typeof v === "string" && v.trim() && k.length < 40).slice(0, 20).map(([k, v]) => [k, v.slice(0, 4000)]);
  const get = k => (fields.find(([f]) => f === k) || [])[1] || "";
  const contact = get("telephone") || get("contact") || get("email");
  if (!contact) return send(res, 400, { error: "missing_contact" });

  const who = get("nom") || "Visiteur";
  const where = [get("commune"), get("page")].filter(Boolean).join(" · ");
  const subject = `📩 Nouvelle demande — ${who}${where ? " · " + where : ""}`.slice(0, 180);
  const html = `<h2 style="font-family:sans-serif">Nouvelle demande depuis groupsolution.fr</h2><table style="font-family:sans-serif;border-collapse:collapse">${fields.map(([k, v]) => `<tr><td style="padding:6px 12px;border:1px solid #eee;font-weight:bold;vertical-align:top">${esc(k)}</td><td style="padding:6px 12px;border:1px solid #eee;white-space:pre-wrap">${esc(v)}</td></tr>`).join("")}</table>`;
  const email = [get("email"), get("contact")].map(x => x.trim()).find(x => EMAIL.test(x)) || "";
  try {
    const r = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST", signal: AbortSignal.timeout(8000),
      headers: { "api-key": process.env.BREVO_API_KEY, "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        sender: { name: "Site Groupe Solution", email: process.env.LEAD_FROM },
        to: [{ email: process.env.LEAD_TO || "contact@groupsolution.fr" }],
        ...(email ? { replyTo: { email, name: who.slice(0, 70) } } : {}),
        subject, htmlContent: html
      })
    });
    if (!r.ok) { console.error("lead: Brevo", r.status, await r.text().catch(() => "")); return send(res, 502, { error: "mail_failed" }); }
    return send(res, 200, { ok: true });
  } catch (e) {
    console.error("lead error:", e);
    return send(res, 502, { error: "mail_failed" });
  }
}
