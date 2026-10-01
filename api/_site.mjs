// Contenu géré depuis le tableau de bord + entretien automatique du site (fichier « _ » : pas une route).
//  • Réalisations : Titouan ajoute un projet (titre, lien, photo, texte) → page Réalisations et accueil à jour aussitôt.
//  • Devis commencés non envoyés : gardés 7 jours pour une relance douce.
//  • Entretien : chaque nuit, le site se vérifie lui-même, corrige ce qui peut l'être et signale le reste.
import { randomBytes } from "node:crypto";
import { redis } from "./_guard.mjs";
import { diagMail } from "./_mail.mjs";
import { placesUsage } from "./_places.mjs";
import { nlRetry, nlCount } from "./_newsletter.mjs";
import { fetchPage, fetchImage } from "./_entreprise-lib.mjs";

const SITE = "https://www.groupsolution.fr";
const parse = v => { try { return v ? JSON.parse(v) : null; } catch { return null; } };
const clean = (v, n) => String(v ?? "").replace(/[\u0000-\u001f<>]/g, " ").replace(/\s+/g, " ").trim().slice(0, n);

/* ── Réalisations ── */
const RID = /^[a-f0-9]{12}$/;
const IMG = /^data:image\/(jpeg|webp|png);base64,([A-Za-z0-9+/=]+)$/;
export async function listReal(all = false) {
  const [ids] = await redis([["LRANGE", "real:list", 0, 99]]);
  if (!(ids || []).length) return [];
  const rows = (await redis(ids.map(i => ["GET", "real:" + i]))).map(parse).filter(Boolean);
  return rows.filter(x => all || x.visible !== false);
}
export async function saveReal(b) {
  const id = RID.test(b.id || "") ? b.id : randomBytes(6).toString("hex");
  const [prev] = await redis([["GET", "real:" + id]]);
  const old = parse(prev) || {};
  let lien = clean(b.lien, 300);
  if (lien && !/^https?:\/\//i.test(lien)) lien = "https://" + lien;
  try { if (lien) lien = new URL(lien).href; } catch { return { ok: false, message: "Lien invalide." }; }
  const x = { id, titre: clean(b.titre, 90), texte: clean(b.texte, 400), lien, secteur: clean(b.secteur, 60), lieu: clean(b.lieu, 60),
    annee: clean(b.annee, 7), visible: b.visible !== false, img: old.img || null, date: old.date || new Date().toISOString() };
  if (!x.titre) return { ok: false, message: "Donnez un titre au projet." };
  const cmds = [];
  if (b.photo === null) { x.img = null; cmds.push(["DEL", "realimg:" + id]); }
  else if (typeof b.photo === "string" && b.photo) {
    const m = b.photo.match(IMG);
    if (!m) return { ok: false, message: "Photo illisible : utilisez un JPEG, PNG ou WebP." };
    if (m[2].length > 900000) return { ok: false, message: "Photo trop lourde, même compressée." };
    x.img = randomBytes(4).toString("hex"); // version : change à chaque nouvelle photo (cache navigateur)
    cmds.push(["SET", "realimg:" + id, b.photo]);
  }
  cmds.push(["SET", "real:" + id, JSON.stringify(x)]);
  if (!old.id) cmds.push(["LPUSH", "real:list", id]);
  await redis(cmds);
  return { ok: true, item: x };
}
// « Remplir depuis le lien » : titre, description et image d'aperçu lus sur la page du projet.
export async function previewReal(lien) {
  const p = await fetchPage(String(lien || "").trim());
  if (p.error) return { ok: false, message: "Lecture du site impossible : " + p.error };
  const meta = n => { const m = p.html.match(new RegExp(`<meta[^>]+(?:property|name)=["']${n}["'][^>]*>`, "i")); const c = m && m[0].match(/content=["']([^"']*)["']/i); return c ? c[1].replace(/&amp;/g, "&").replace(/&#39;|&rsquo;/g, "’").replace(/&quot;/g, '"').trim() : ""; };
  const titre = meta("og:title") || (p.html.match(/<title[^>]*>([^<]*)<\/title>/i) || [])[1] || "";
  const texte = meta("og:description") || meta("description");
  let img = meta("og:image") || meta("twitter:image"), photo = null;
  if (img) { try { photo = await fetchImage(new URL(img, p.url).href); } catch {} }
  return { ok: true, lien: p.url, titre: clean(titre, 90), texte: clean(texte, 400), photo };
}
export async function deleteReal(id) {
  if (!RID.test(id)) return false;
  await redis([["DEL", "real:" + id], ["DEL", "realimg:" + id], ["LREM", "real:list", 0, id]]);
  return true;
}
export async function moveReal(id, dir) {
  const [ids] = await redis([["LRANGE", "real:list", 0, 99]]);
  const i = (ids || []).indexOf(id), j = i + (dir < 0 ? -1 : 1);
  if (i < 0 || j < 0 || j >= ids.length) return false;
  await redis([["LSET", "real:list", i, ids[j]], ["LSET", "real:list", j, id]]);
  return true;
}
export async function realImage(id) {
  if (!RID.test(id)) return null;
  const [v] = await redis([["GET", "realimg:" + id]]);
  const m = String(v || "").match(IMG);
  return m ? { type: "image/" + m[1], buf: Buffer.from(m[2], "base64") } : null;
}

/* ── Devis commencés mais pas envoyés (relance douce) ── */
export async function devisEnAttente() {
  const [ids] = await redis([["LRANGE", "estimations:list", 0, 99]]);
  if (!(ids || []).length) return [];
  const rows = (await redis(ids.map(i => ["GET", "estimation:" + i]))).map(parse).filter(Boolean);
  // Au moins 30 minutes : le visiteur a eu le temps d'envoyer s'il le voulait.
  return rows.filter(e => Date.now() - Date.parse(e.date) > 30 * 60e3)
    .map(e => ({ id: e.id, sid: e.sid || null, date: e.date, titre: e.titre, resume: e.resume, budget: e.budget?.label, delai: e.delai, briques: (e.briques || []).map(x => x.titre), besoin: e.besoin || "", relance: e.relance || null }));
}
export async function marquerRelance(id) {
  if (!/^[a-f0-9]{32}$/.test(id)) return false;
  const [v] = await redis([["GET", "estimation:" + id]]); const e = parse(v); if (!e) return false;
  e.relance = new Date().toISOString();
  await redis([["SET", "estimation:" + id, JSON.stringify(e), "KEEPTTL"]]);
  return true;
}

/* ── Entretien automatique ── */
async function fetchOk(url, ms = 9000) {
  try { const r = await fetch(url, { signal: AbortSignal.timeout(ms), redirect: "follow", headers: { "User-Agent": "GroupeSolution-Entretien/1.0" } }); return { ok: r.ok, status: r.status, text: r.ok ? await r.text() : "" }; }
  catch (e) { return { ok: false, status: 0, text: "" }; }
}
// Nettoie une liste d'identifiants dont les fiches ont expiré (la base reste légère et rapide).
async function purge(list, prefix) {
  const [ids] = await redis([["LRANGE", list, 0, 499]]);
  if (!(ids || []).length) return 0;
  const ex = await redis(ids.map(i => ["EXISTS", prefix + i]));
  const morts = ids.filter((_, k) => !ex[k]);
  if (morts.length) await redis(morts.map(i => ["LREM", list, 0, i]));
  return morts.length;
}
export async function runEntretien() {
  const t0 = Date.now(), checks = [], corrige = [];
  const add = (groupe, nom, ok, detail = "", fix = "", niveau = ok ? "ok" : "ko") => checks.push({ groupe, nom, ok, niveau, detail, fix });

  // 1. Pages du site : pages clés + 25 pages tirées au hasard dans le plan du site.
  const cles = ["/", "/realisations.html", "/demos/", "/lab/actus/", "/pourquoi-accessible.html", "/newsletter.html", "/sitemap.xml", "/robots.txt", "/llms.txt"];
  const sm = await fetchOk(SITE + "/sitemap.xml");
  const urls = [...(sm.text.matchAll(/<loc>([^<]+)<\/loc>/g))].map(m => m[1]).filter(u => u.startsWith(SITE));
  const tirage = urls.sort(() => Math.random() - .5).slice(0, 25).map(u => u.slice(SITE.length) || "/");
  const pages = [...new Set([...cles, ...tirage])];
  const res = await Promise.all(pages.map(async p => ({ p, r: await fetchOk(SITE + p) })));
  const ko = res.filter(x => !x.r.ok), sansTitre = res.filter(x => x.r.ok && /\.html$|\/$/.test(x.p) && !/<title>[^<]{5,}<\/title>/.test(x.r.text));
  add("Site", "Pages en ligne", !ko.length, `${res.length - ko.length}/${res.length} pages vérifiées répondent` + (ko.length ? ` · en erreur : ${ko.slice(0, 6).map(x => `${x.p} (${x.r.status || "délai"})`).join(", ")}` : ""), ko.length ? "Une page manque ou le site ne répond plus : le contrôle qualité GitHub va la signaler ; si c'est la page d'accueil, vérifiez Vercel → Deployments." : "");
  add("Site", "Balises des pages", !sansTitre.length, sansTitre.length ? `sans titre : ${sansTitre.slice(0, 5).map(x => x.p).join(", ")}` : "titre présent partout");
  add("Site", "Plan du site", urls.length > 100, `${urls.length} adresses déclarées à Google`, urls.length > 100 ? "" : "Le plan du site semble incomplet : relancez la génération (npm run generate).");

  // 2. Publication continue : les actus doivent avoir moins de 3 jours.
  const rss = await fetchOk(SITE + "/lab/actus/rss.xml");
  const derniere = Math.max(0, ...[...rss.text.matchAll(/<pubDate>([^<]+)<\/pubDate>/g)].map(m => Date.parse(m[1]) || 0));
  const age = derniere ? (Date.now() - derniere) / 864e5 : 99;
  add("Publication", "Actus du jour", age < 3, derniere ? `dernière publication il y a ${age < 1 ? "moins d'un jour" : Math.round(age) + " j"}` : "flux introuvable", age < 3 ? "" : "La publication quotidienne semble arrêtée : vérifiez la routine « Actus » dans Claude (claude.ai/code → Routines).", age < 3 ? "ok" : age < 6 ? "wa" : "ko");

  // 3. E-mails : configuration Brevo complète, puis renvoi automatique des confirmations bloquées.
  const diag = await diagMail();
  const mailKo = diag.filter(d => !d.ok);
  add("E-mails", "Configuration Brevo", !mailKo.length, mailKo.length ? mailKo.map(d => `${d.nom} : ${d.detail}`).join(" · ") : "clé, compte et expéditeur valides", mailKo[0]?.fix || "");
  if (!mailKo.length) {
    const r = await nlRetry().catch(() => ({ bloques: 0, renvoyes: 0 }));
    if (r.renvoyes) corrige.push(`${r.renvoyes} confirmation(s) de newsletter renvoyée(s)`);
    add("E-mails", "Confirmations newsletter", r.renvoyes === r.bloques, r.bloques ? `${r.renvoyes}/${r.bloques} renvoyée(s) automatiquement` : "aucune en attente");
  }
  const day = new Date(Date.now() - 864e5).toISOString().slice(0, 10), today = new Date().toISOString().slice(0, 10);
  const [ko1, ko2, ok1, ok2] = await redis([["GET", "mail:ko:" + day], ["GET", "mail:ko:" + today], ["GET", "mail:ok:" + day], ["GET", "mail:ok:" + today]]);
  const nko = (+ko1 || 0) + (+ko2 || 0), nok = (+ok1 || 0) + (+ok2 || 0);
  add("E-mails", "Envois des dernières 24 h", !nko, `${nok} parti(s), ${nko} échec(s)`, nko ? "Les contacts restent enregistrés dans le tableau de bord : aucun n'est perdu." : "", nko ? "wa" : "ok");

  // 4. Services dont dépend le site.
  const ia = Boolean(process.env.ANTHROPIC_API_KEY);
  add("Services", "Assistant IA", ia, ia ? "clé présente" : "clé ANTHROPIC_API_KEY absente", ia ? "" : "Ajoutez ANTHROPIC_API_KEY dans Vercel puis redéployez.");
  const reg = await fetchOk("https://recherche-entreprises.api.gouv.fr/search?q=552081317&per_page=1", 8000);
  const pu = await placesUsage();
  if (pu.actif) add("Services", "Google (photos et concurrents)", pu.mois < pu.plafond_mois, `${pu.mois}/${pu.plafond_mois} appels ce mois-ci · ${pu.jour}/${pu.plafond_jour} aujourd'hui · plafond = part gratuite de Google, au-delà tout s'arrête seul`, pu.mois < pu.plafond_mois ? "" : "Plafond du mois atteint : la comparaison et les photos Google reprennent le 1er du mois, sans aucun frais.", pu.mois < pu.plafond_mois * 0.8 ? "ok" : "wa");
  else add("Services", "Google (photos et concurrents)", true, "clé GOOGLE_PLACES_KEY absente : la comparaison avec les concurrents est masquée", "", "ok");
  add("Services", "Registre des entreprises", reg.ok, reg.ok ? "joignable" : `indisponible (${reg.status || "délai"})`, reg.ok ? "" : "Service public externe : l'assistant bascule sur la recherche web en attendant.", reg.ok ? "ok" : "wa");
  const bod = await fetchOk("https://bodacc-datadila.opendatasoft.com/api/explore/v2.1/catalog/datasets/annonces-commerciales/records?limit=1", 8000);
  add("Services", "Annonces officielles (radar)", bod.ok, bod.ok ? "joignables" : `indisponibles (${bod.status || "délai"})`, "", bod.ok ? "ok" : "wa");

  // 5. Tâches automatiques.
  const [lr, ln] = await redis([["GET", "cron:last:radar"], ["GET", "cron:last:newsletter"]]);
  const radar = parse(lr), nl = parse(ln), subs = await nlCount().catch(() => 0);
  const rAge = radar ? (Date.now() - Date.parse(radar.date)) / 36e5 : 999;
  add("Automatismes", "Radar du matin", rAge < 36, radar ? `dernier passage il y a ${Math.round(rAge)} h · ${radar.retenues ?? 0} retenue(s)` : "jamais passé", rAge < 36 ? "" : "Vercel → Settings → Cron Jobs : vérifiez que les tâches sont activées.", rAge < 36 ? "ok" : "wa");
  const nAge = nl ? (Date.now() - Date.parse(nl.date)) / 864e5 : 99;
  add("Automatismes", "Newsletter du lundi", !subs || nAge < 8, nl ? `dernier passage il y a ${Math.round(nAge)} j · ${nl.envoyes || 0} envoi(s)` : subs ? "pas encore passée" : "aucun abonné confirmé pour l'instant", "", !subs || nAge < 8 ? "ok" : "wa");

  // 6. Parcours visiteur : rien ne doit bloquer (accueil complet, fichiers présents, chaque fonction répond).
  const home = res.find(x => x.p === "/")?.r || await fetchOk(SITE + "/");
  const manque = [["zone de discussion", /id="aiBox"/], ["champ de saisie", /id="aiInput"/], ["téléphone cliquable", /href="tel:\+33782298559"/], ["section contact", /id="contact"/], ["assistant", /home-ai\.js/], ["formulaire newsletter", /id="nlForm"/]].filter(([, re]) => !re.test(home.text)).map(([n]) => n);
  add("Parcours visiteur", "Accueil complet", !manque.length, manque.length ? "manque : " + manque.join(", ") : "discussion, téléphone, contact et newsletter présents", manque.length ? "Un élément essentiel a disparu de l'accueil : à rétablir (l'entretien du matin s'en charge ou ouvre une demande)." : "");
  const fichiers = [...new Set([...home.text.matchAll(/(?:src|href)="(\/?(?:assets\/|site\.js|analytics\.js|Logo\.svg|photo-president\.jpg)[^"?#]*)"/g)].map(m => "/" + m[1].replace(/^\//, "")))].slice(0, 30);
  const fr = await Promise.all(fichiers.map(async f => ({ f, ok: (await fetchOk(SITE + f, 8000)).ok })));
  const fko = fr.filter(x => !x.ok).map(x => x.f);
  add("Parcours visiteur", "Fichiers de l'accueil", !fko.length, fko.length ? "introuvables : " + fko.join(", ") : `${fr.length} scripts, styles et images chargés`);
  const fonctions = ["assistant", "lead", "entreprise", "concept", "demo", "availability", "book", "vote", "perso", "idees", "geo", "concurrents"];
  const fx = await Promise.all(fonctions.map(async n => { try { const r = await fetch(`${SITE}/api/${n}`, { signal: AbortSignal.timeout(8000), headers: { "User-Agent": "GroupeSolution-Entretien/1.0" } }); return { n, st: r.status }; } catch { return { n, st: 0 }; } }));
  const fko2 = fx.filter(x => !x.st || x.st >= 500 && x.st !== 503);
  add("Parcours visiteur", "Fonctions du site (formulaires, chat, démos)", !fko2.length, fko2.length ? "en panne : " + fko2.map(x => `${x.n} (${x.st || "délai"})`).join(", ") : `${fx.length} fonctions répondent`, fko2.length ? "Vercel → Deployments → dernier déploiement → Functions : l'erreur y est détaillée." : "");

  // 7. Données : écriture/lecture, aucun contact oublié, liens de confirmation valides.
  const jeton = String(Date.now());
  const [, lu] = await redis([["SET", "entretien:ping", jeton, "EX", 3600], ["GET", "entretien:ping"]]);
  add("Données", "Enregistrement des données", lu === jeton, lu === jeton ? "écriture et lecture vérifiées" : "la base ne répond pas correctement", lu === jeton ? "" : "Vercel → Storage : vérifiez la base Upstash.");
  const [lids] = await redis([["LRANGE", "leads:list", 0, 149]]);
  const leads = (lids || []).length ? (await redis(lids.map(i => ["GET", "lead:" + i]))).map(parse).filter(Boolean) : [];
  const oublies = leads.filter(l => l.statut !== "traite" && Date.now() - Date.parse(l.date) > 24 * 36e5);
  add("Données", "Contacts à rappeler", !oublies.length, oublies.length ? `${oublies.length} demande(s) de rappel de plus de 24 h pas encore marquée(s) « Traité » : ${oublies.slice(0, 3).map(l => l.nom || l.telephone || l.email).join(", ")}` : "aucun contact en attente depuis plus de 24 h", oublies.length ? "Tableau de bord → Contacts : rappelez puis cliquez « Traité »." : "", oublies.length ? "wa" : "ok");
  const [dids] = await redis([["LRANGE", "demandes:list", 0, 149]]);
  const dems = (dids || []).length ? (await redis(dids.map(i => ["GET", "demande:" + i]))).map(parse).filter(Boolean) : [];
  const dAtt = dems.filter(d => (d.statut || "nouveau") !== "traite" && Date.now() - Date.parse(d.date) > 48 * 36e5);
  add("Données", "Devis à envoyer", !dAtt.length, dAtt.length ? `${dAtt.length} demande(s) de devis de plus de 48 h sans « Devis envoyé »` : "aucune demande en retard", dAtt.length ? "Tableau de bord → Devis : envoyez le devis depuis Indy puis cliquez « Devis envoyé »." : "", dAtt.length ? "wa" : "ok");
  const [nlh] = await redis([["HGETALL", "nl:subs"]]);
  const attente = []; for (let i = 0; i + 1 < (nlh || []).length; i += 2) { const v = parse(nlh[i + 1]); if (v && !v.ok && v.t) attente.push([nlh[i], v.t]); }
  if (attente.length) {
    const ex = await redis(attente.map(([, t]) => ["EXISTS", "nl:tok:" + t]));
    const perdus = attente.filter((_, k) => !ex[k]);
    if (perdus.length) { await redis(perdus.map(([h, t]) => ["SET", "nl:tok:" + t, h, "EX", 60 * 86400])); corrige.push(`${perdus.length} lien(s) de confirmation newsletter réactivé(s)`); }
  }
  add("Données", "Liens de confirmation newsletter", true, attente.length ? `${attente.length} inscription(s) en attente, liens valides` : "aucune inscription en attente");

  // 8. Nettoyage de la base.
  const n = (await purge("demandes:list", "demande:")) + (await purge("leads:list", "lead:")) + (await purge("estimations:list", "estimation:"));
  if (n) corrige.push(`${n} entrée(s) expirée(s) retirée(s) des listes`);
  add("Base", "Nettoyage", true, n ? `${n} entrée(s) expirée(s) retirée(s)` : "rien à nettoyer");

  const rapport = { date: new Date().toISOString(), duree: Date.now() - t0, ok: checks.every(c => c.niveau !== "ko"), alertes: checks.filter(c => c.niveau !== "ok").length, corrige, checks };
  await redis([["SET", "entretien:last", JSON.stringify(rapport)], ["LPUSH", "entretien:hist", JSON.stringify({ date: rapport.date, ok: rapport.ok, alertes: rapport.alertes, corrige: corrige.length })], ["LTRIM", "entretien:hist", 0, 29]]);
  return rapport;
}
export async function lastEntretien() {
  const [l, h] = await redis([["GET", "entretien:last"], ["LRANGE", "entretien:hist", 0, 29]]);
  return { rapport: parse(l), historique: (h || []).map(parse).filter(Boolean) };
}
// Version publique, sans aucun détail technique : pour la page « État du site ».
export async function etatPublic() {
  const { rapport } = await lastEntretien();
  if (!rapport) return { maj: null, groupes: [] };
  const g = {};
  for (const c of rapport.checks) { if (c.groupe === "Base" || /Contacts à rappeler|Devis à envoyer/.test(c.nom)) continue; const x = g[c.groupe] ||= { nom: c.groupe, niveau: "ok" }; if (c.niveau === "ko") x.niveau = "ko"; else if (c.niveau === "wa" && x.niveau === "ok") x.niveau = "wa"; }
  return { maj: rapport.date, groupes: Object.values(g) };
}
