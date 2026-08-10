// ─────────────────────────────────────────────────────────────
//  Génération UNIQUE du refresh token Google (à lancer en local).
//
//  Pré-requis :
//   1. Projet Google Cloud + API Google Calendar activée.
//   2. Écran de consentement OAuth publié EN PRODUCTION
//      (sinon le refresh token expire au bout de 7 jours).
//   3. Identifiant OAuth "Application Web" avec l'URI de redirection :
//        http://localhost:53682/callback
//
//  Lancement :
//    GOOGLE_CLIENT_ID=xxx GOOGLE_CLIENT_SECRET=yyy node scripts/google-oauth-setup.mjs
//
//  Le script ouvre une URL de consentement, récupère le code, et affiche
//  le GOOGLE_REFRESH_TOKEN à copier dans les variables d'environnement Vercel.
// ─────────────────────────────────────────────────────────────
import http from "node:http";
import { exec } from "node:child_process";

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT = "http://localhost:53682/callback";
const SCOPE = "https://www.googleapis.com/auth/calendar";

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error("✗ Définis GOOGLE_CLIENT_ID et GOOGLE_CLIENT_SECRET avant de lancer.");
  process.exit(1);
}

const authUrl =
  "https://accounts.google.com/o/oauth2/v2/auth?" +
  new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT,
    response_type: "code",
    scope: SCOPE,
    access_type: "offline",
    prompt: "consent", // force la délivrance d'un refresh token
  });

const server = http.createServer(async (req, res) => {
  if (!req.url.startsWith("/callback")) { res.writeHead(404).end(); return; }
  const code = new URL(req.url, REDIRECT).searchParams.get("code");
  if (!code) { res.writeHead(400).end("Code manquant."); return; }

  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code, client_id: CLIENT_ID, client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT, grant_type: "authorization_code",
      }).toString(),
    });
    const data = await tokenRes.json();
    if (!data.refresh_token) {
      res.writeHead(200).end("Aucun refresh_token reçu. Révoque l'accès du compte puis relance.");
      console.error("✗ Pas de refresh_token :", data);
      server.close();
      return;
    }
    res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" })
       .end("✓ Refresh token obtenu. Reviens au terminal, tu peux fermer cet onglet.");
    console.log("\n✓ Copie ces variables dans Vercel (Project → Settings → Environment Variables) :\n");
    console.log("GOOGLE_CLIENT_ID=" + CLIENT_ID);
    console.log("GOOGLE_CLIENT_SECRET=" + CLIENT_SECRET);
    console.log("GOOGLE_REFRESH_TOKEN=" + data.refresh_token);
    console.log("GOOGLE_CALENDAR_ID=primary   # ou l'ID d'un calendrier dédié");
    console.log("BOOKING_TIMEZONE=Europe/Paris\n");
  } catch (e) {
    console.error(e);
    res.writeHead(500).end("Erreur pendant l'échange du code.");
  } finally {
    setTimeout(() => server.close(), 500);
  }
});

server.listen(53682, () => {
  console.log("→ Ouverture du consentement Google dans le navigateur…");
  console.log("  Si rien ne s'ouvre, colle cette URL :\n  " + authUrl + "\n");
  const opener = process.platform === "darwin" ? "open" : process.platform === "win32" ? "start" : "xdg-open";
  exec(`${opener} "${authUrl}"`);
});
