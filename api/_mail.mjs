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

// Traduit une erreur Brevo en consigne claire (affichée dans le tableau de bord).
export function explique(err) {
  const e = String(err || "");
  if (!e) return "";
  if (/manquante/.test(e)) return "Ajoutez BREVO_API_KEY et LEAD_FROM dans Vercel → Settings → Environment Variables, puis redéployez.";
  if (/unrecognised IP|IP address/i.test(e)) return "Brevo bloque les envois depuis Vercel : Brevo → Paramètres → Sécurité → Adresses IP autorisées → « Désactiver le blocage ». Les serveurs Vercel changent d'IP, la liste ne peut pas fonctionner.";
  if (/401|unauthori[sz]ed|Key not found|invalid api key/i.test(e)) return "La clé BREVO_API_KEY est refusée. Créez une clé « API » (elle commence par xkeysib-) dans Brevo → SMTP & API → Clés API, collez-la dans Vercel, puis redéployez.";
  if (/sender|expéditeur|not valid|not verified|validated/i.test(e)) return "L'adresse LEAD_FROM n'est pas un expéditeur validé dans Brevo : Brevo → Expéditeurs, domaines et IP dédiées → ajoutez et validez cette adresse (ou authentifiez le domaine groupsolution.fr).";
  if (/permission|not enabled|activated|suspend/i.test(e)) return "Le compte Brevo n'a pas encore l'envoi transactionnel activé : ouvrez Brevo → Transactionnel et suivez l'activation (souvent une validation de compte par Brevo).";
  if (/injoignable|Timeout|Abort/i.test(e)) return "Brevo n'a pas répondu à temps : c'est en général passager, l'entretien automatique réessaiera.";
  return "Réponse inattendue de Brevo : ouvrez Brevo → Transactionnel → Logs pour le détail.";
}

// Diagnostic complet de la configuration e-mail : chaque point avec son état et la marche à suivre.
export async function diagMail() {
  const key = String(process.env.BREVO_API_KEY || "").trim(), from = String(process.env.LEAD_FROM || "").trim().toLowerCase();
  const out = [];
  const add = (nom, ok, detail, fix = "") => out.push({ nom, ok, detail, fix });
  add("Clé Brevo présente", !!key, key ? `${key.slice(0, 8)}… (${key.length} caractères)` : "absente", key ? "" : explique("manquante"));
  if (key && /^xsmtpsib-/.test(key)) add("Type de clé", false, "C'est une clé SMTP (xsmtpsib-), pas une clé API.", "Brevo → SMTP & API → onglet « Clés API » → Générer une nouvelle clé API (xkeysib-…), puis remplacez BREVO_API_KEY dans Vercel et redéployez.");
  else if (key) add("Type de clé", /^xkeysib-/.test(key), /^xkeysib-/.test(key) ? "Clé API (xkeysib-)" : "Ce n'est pas une clé API classique (elle devrait commencer par xkeysib-) : c'est peut-être une clé MCP.", /^xkeysib-/.test(key) ? "" : "Brevo → SMTP et API → Clés API et MCP → « Générer une nouvelle clé API » en laissant l'option MCP décochée, copiez-la (elle commence par xkeysib-), collez-la dans Vercel → Settings → Environment Variables → BREVO_API_KEY (Production), puis Deployments → ⋯ → Redeploy.");
  add("Expéditeur (LEAD_FROM)", !!from, from || "absent", from ? "" : explique("manquante"));
  if (!key) return out;
  const h = { "api-key": key, Accept: "application/json" };
  try {
    const r = await fetch("https://api.brevo.com/v3/account", { headers: h, signal: AbortSignal.timeout(8000) });
    const t = await r.text();
    if (!r.ok) add("Connexion au compte Brevo", false, `Brevo ${r.status} : ${t.slice(0, 200)}`, explique(`${r.status} ${t}`));
    else { let a = {}; try { a = JSON.parse(t); } catch {} add("Connexion au compte Brevo", true, [a.companyName, a.email].filter(Boolean).join(" · ") || "OK");
      const plan = (a.plan || []).map(p => `${p.type}${p.credits != null ? " (" + p.credits + " crédits)" : ""}`).join(", ");
      if (plan) add("Offre Brevo", !(a.plan || []).some(p => p.credits === 0 && p.type !== "subscription"), plan, "Crédits d'envoi épuisés : attendez le renouvellement quotidien ou changez d'offre."); }
  } catch (e) { add("Connexion au compte Brevo", false, "Brevo injoignable", explique("injoignable")); return out; }
  if (from) try {
    const r = await fetch("https://api.brevo.com/v3/senders", { headers: h, signal: AbortSignal.timeout(8000) });
    if (r.ok) { const s = (await r.json()).senders || []; const m = s.find(x => String(x.email).toLowerCase() === from);
      add("Expéditeur validé dans Brevo", !!(m && m.active !== false), m ? (m.active === false ? "présent mais non validé" : "validé") : `absent (expéditeurs connus : ${s.map(x => x.email).join(", ") || "aucun"})`, m && m.active !== false ? "" : explique("sender not valid")); }
  } catch {}
  return out;
}

// Gabarit sobre, lisible sur téléphone.
export const layout = (title, body) => `<div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:600px;margin:0 auto;color:#171613;line-height:1.6">
<p style="font-weight:800;font-size:18px;margin:0 0 4px">Groupe Solution</p>
<h2 style="font-size:20px;margin:18px 0 10px">${esc(title)}</h2>${body}
<p style="color:#77736A;font-size:13px;margin-top:28px;border-top:1px solid #eee;padding-top:12px">Groupe Solution · 07 82 29 85 59 · contact@groupsolution.fr · www.groupsolution.fr</p></div>`;
