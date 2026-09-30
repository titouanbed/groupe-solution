// Envoi d'e-mails transactionnels via Brevo (fichier « _ » : pas une route).
// Variables : BREVO_API_KEY, LEAD_FROM (expéditeur validé), LEAD_TO (défaut contact@groupsolution.fr).
import { redis, UPSTASH } from "./_guard.mjs";
export const MAIL_OK = () => Boolean(String(process.env.BREVO_API_KEY || "").trim() && String(process.env.LEAD_FROM || "").trim());
export const OWNER = () => process.env.LEAD_TO || "contact@groupsolution.fr";
export const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

// Chaque envoi est journalisé : compteur du jour et 30 derniers échecs avec la réponse exacte de Brevo
// (visible dans le tableau de bord → Réglages → E-mails). Retourne true si Brevo a accepté l'e-mail.
export let lastMailError = null;
async function journal(ok, info) {
  if (!UPSTASH) return;
  const day = new Date().toISOString().slice(0, 10);
  const cmds = [["INCR", `mail:${ok ? "ok" : "ko"}:${day}`], ["EXPIRE", `mail:${ok ? "ok" : "ko"}:${day}`, 40 * 86400]];
  if (!ok) cmds.push(["LPUSH", "mail:errors", JSON.stringify({ date: new Date().toISOString(), ...info })], ["LTRIM", "mail:errors", 0, 29]);
  try { await redis(cmds); } catch {}
}
export async function sendMail({ to, subject, html, replyTo }) {
  const dest = (Array.isArray(to) ? to : [to]).filter(Boolean);
  if (!MAIL_OK()) { lastMailError = "BREVO_API_KEY ou LEAD_FROM manquante dans Vercel"; await journal(false, { to: dest.join(","), subject, erreur: lastMailError }); return false; }
  try {
    const r = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST", signal: AbortSignal.timeout(9000),
      headers: { "api-key": process.env.BREVO_API_KEY.trim(), "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        sender: { name: "Groupe Solution", email: process.env.LEAD_FROM.trim() },
        to: dest.map(email => ({ email })),
        ...(replyTo ? { replyTo: { email: replyTo } } : {}),
        subject: String(subject).slice(0, 180), htmlContent: html
      })
    });
    if (!r.ok) {
      const txt = (await r.text().catch(() => "")).slice(0, 300);
      lastMailError = `Brevo ${r.status} : ${txt}`;
      console.error("mail:", lastMailError);
      await journal(false, { to: dest.join(","), subject: String(subject).slice(0, 120), erreur: lastMailError });
      return false;
    }
    lastMailError = null; await journal(true);
    return true;
  } catch (e) {
    lastMailError = "Brevo injoignable : " + (e?.name || e?.message);
    console.error("mail:", lastMailError);
    await journal(false, { to: dest.join(","), subject: String(subject).slice(0, 120), erreur: lastMailError });
    return false;
  }
}

// Gabarit sobre, lisible sur téléphone.
export const layout = (title, body) => `<div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:600px;margin:0 auto;color:#171613;line-height:1.6">
<p style="font-weight:800;font-size:18px;margin:0 0 4px">Groupe Solution</p>
<h2 style="font-size:20px;margin:18px 0 10px">${esc(title)}</h2>${body}
<p style="color:#77736A;font-size:13px;margin-top:28px;border-top:1px solid #eee;padding-top:12px">Groupe Solution · 07 82 29 85 59 · contact@groupsolution.fr · www.groupsolution.fr</p></div>`;
