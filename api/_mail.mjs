// Envoi d'e-mails transactionnels via Brevo (fichier « _ » : pas une route).
// Variables : BREVO_API_KEY, LEAD_FROM (expéditeur validé), LEAD_TO (défaut contact@groupsolution.fr).
export const MAIL_OK = () => Boolean(process.env.BREVO_API_KEY && process.env.LEAD_FROM);
export const OWNER = () => process.env.LEAD_TO || "contact@groupsolution.fr";
export const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

export async function sendMail({ to, subject, html, replyTo }) {
  if (!MAIL_OK()) return false;
  try {
    const r = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST", signal: AbortSignal.timeout(8000),
      headers: { "api-key": process.env.BREVO_API_KEY, "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        sender: { name: "Groupe Solution", email: process.env.LEAD_FROM },
        to: (Array.isArray(to) ? to : [to]).map(email => ({ email })),
        ...(replyTo ? { replyTo: { email: replyTo } } : {}),
        subject: String(subject).slice(0, 180), htmlContent: html
      })
    });
    if (!r.ok) console.error("mail: Brevo", r.status, (await r.text().catch(() => "")).slice(0, 200));
    return r.ok;
  } catch (e) { console.error("mail:", e?.message); return false; }
}

// Gabarit sobre, lisible sur téléphone.
export const layout = (title, body) => `<div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:600px;margin:0 auto;color:#171613;line-height:1.6">
<p style="font-weight:800;font-size:18px;margin:0 0 4px">Groupe Solution</p>
<h2 style="font-size:20px;margin:18px 0 10px">${esc(title)}</h2>${body}
<p style="color:#77736A;font-size:13px;margin-top:28px;border-top:1px solid #eee;padding-top:12px">Groupe Solution · 07 82 29 85 59 · contact@groupsolution.fr · www.groupsolution.fr</p></div>`;
