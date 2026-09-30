// POST /api/entreprise { q?, url? }  (Vercel Function) — « Analyser mon entreprise ».
// Déclenché uniquement quand le visiteur donne LUI-MÊME le nom de son entreprise (ou son SIREN) et/ou
// l'adresse de son site. Renvoie :
//   • la fiche publique de l'entreprise (annuaire officiel recherche-entreprises.api.gouv.fr) :
//     raison sociale, activité, date de création, tranche d'effectif, commune — pas les dirigeants ;
//   • l'analyse de la page d'accueil de son site : ce que tout internaute peut voir (HTTPS, mobile,
//     balises de référencement, moyens de contact, réseaux sociaux, poids, extrait de texte).
// Rien n'est stocké. Le contenu du site est traité comme une donnée, jamais comme une instruction.
import dns from "node:dns/promises";
import net from "node:net";

const UA = "Mozilla/5.0 (compatible; GroupeSolutionBot/1.0; +https://www.groupsolution.fr/lab/coulisses.html)";
const MAX_BYTES = 900_000, TIMEOUT = 7000;
const send = (res, status, body) => { res.statusCode = status; res.setHeader("Content-Type", "application/json; charset=utf-8"); res.setHeader("Cache-Control", "private, no-store"); res.end(JSON.stringify(body)); };
const hits = new Map();
const limited = ip => { const now = Date.now(), a = (hits.get(ip) || []).filter(t => now - t < 3600e3); a.push(now); hits.set(ip, a); return a.length > 15; };

/* ── Adresses autorisées : uniquement des serveurs publics ── */
function isPublicIP(ip) {
  if (net.isIPv4(ip)) {
    const p = ip.split(".").map(Number);
    if (p[0] === 10 || p[0] === 127 || p[0] === 0 || p[0] >= 224) return false;
    if (p[0] === 169 && p[1] === 254) return false;
    if (p[0] === 172 && p[1] >= 16 && p[1] <= 31) return false;
    if (p[0] === 192 && p[1] === 168) return false;
    if (p[0] === 100 && p[1] >= 64 && p[1] <= 127) return false;
    if (p[0] === 198 && (p[1] === 18 || p[1] === 19)) return false;
    return true;
  }
  if (net.isIPv6(ip)) {
    const x = ip.toLowerCase();
    if (x === "::" || x === "::1" || x.startsWith("fc") || x.startsWith("fd") || x.startsWith("fe8") || x.startsWith("fe9") || x.startsWith("fea") || x.startsWith("feb") || x.startsWith("ff")) return false;
    if (x.startsWith("::ffff:")) return isPublicIP(x.slice(7));
    return true;
  }
  return false;
}
async function checkURL(raw) {
  let u;
  try { u = new URL(/^https?:\/\//i.test(raw) ? raw : "https://" + raw); } catch { return null; }
  if (!["http:", "https:"].includes(u.protocol) || u.username || u.password) return null;
  if (u.port && !["80", "443"].includes(u.port)) return null;
  const host = u.hostname.toLowerCase();
  if (net.isIP(host) || !/^[a-z0-9.-]+\.[a-z]{2,}$/.test(host) || /(^|\.)(localhost|internal|local|lan|home|corp)$/.test(host)) return null;
  try {
    const addrs = await dns.lookup(host, { all: true, verbatim: true });
    if (!addrs.length || !addrs.every(a => isPublicIP(a.address))) return null;
  } catch { return null; }
  return u;
}
async function fetchPage(raw) {
  let u = await checkURL(raw); if (!u) return { error: "adresse non valide ou non publique" };
  const t0 = Date.now();
  for (let hop = 0; hop < 4; hop++) {
    const ctl = new AbortController(), timer = setTimeout(() => ctl.abort(), TIMEOUT);
    let r;
    try { r = await fetch(u, { redirect: "manual", signal: ctl.signal, headers: { "User-Agent": UA, Accept: "text/html,application/xhtml+xml" } }); }
    catch { clearTimeout(timer); return { error: "site injoignable" }; }
    if ([301, 302, 303, 307, 308].includes(r.status)) {
      clearTimeout(timer);
      const loc = r.headers.get("location"); if (!loc) return { error: "redirection invalide" };
      u = await checkURL(new URL(loc, u).href); if (!u) return { error: "redirection vers une adresse non publique" };
      continue;
    }
    const type = r.headers.get("content-type") || "";
    if (!r.ok || !/html/i.test(type)) { clearTimeout(timer); return { error: `réponse ${r.status}` }; }
    const reader = r.body.getReader(), chunks = []; let size = 0;
    try { for (;;) { const { done, value } = await reader.read(); if (done) break; size += value.length; if (size > MAX_BYTES) { ctl.abort(); break; } chunks.push(value); } } catch { /* coupé volontairement */ }
    clearTimeout(timer);
    return { url: u.href, https: u.protocol === "https:", ms: Date.now() - t0, bytes: size, html: Buffer.concat(chunks.map(c => Buffer.from(c))).toString("utf8") };
  }
  return { error: "trop de redirections" };
}

/* ── Lecture de la page (ce que voit un internaute) ── */
const strip = s => String(s || "").replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&#39;|&rsquo;/g, "’").replace(/&quot;/g, '"').replace(/\s+/g, " ").trim();
const attr = (html, re) => { const m = html.match(re); return m ? strip(m[1]).slice(0, 300) : ""; };
function analyse(p) {
  const h = p.html, body = h.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<noscript[\s\S]*?<\/noscript>/gi, " ");
  const imgs = h.match(/<img\b[^>]*>/gi) || [];
  const socials = [...h.matchAll(/https?:\/\/(?:www\.|[a-z]{2}\.)?(facebook|instagram|linkedin|tiktok|youtube|x|twitter|pinterest)\.(?:com|fr)\//gi)].map(m => m[1].toLowerCase());
  const text = strip(body).slice(0, 1600);
  return {
    url: p.url, https: p.https, temps_ms: p.ms, poids_ko: Math.round(p.bytes / 1024),
    titre: attr(h, /<title[^>]*>([\s\S]*?)<\/title>/i),
    description: attr(h, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)/i) || attr(h, /<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["']/i),
    h1: attr(h, /<h1[^>]*>([\s\S]*?)<\/h1>/i),
    langue: attr(h, /<html[^>]+lang=["']([^"']+)/i),
    mobile: /<meta[^>]+name=["']viewport["']/i.test(h),
    donnees_structurees: /application\/ld\+json/i.test(h),
    apercu_partage: /property=["']og:(title|image)["']/i.test(h),
    telephone_cliquable: /href=["']tel:/i.test(h),
    formulaire: /<form\b/i.test(h),
    reservation_ou_devis: /(r[ée]serv|rendez-vous|prendre rdv|devis|booking|calendly|planity|doctolib)/i.test(text),
    email_visible: /mailto:/i.test(h),
    reseaux: [...new Set(socials)],
    images: imgs.length, images_sans_alt: imgs.filter(t => !/\balt=["'][^"']+["']/i.test(t)).length,
    mesure_audience: /(googletagmanager|google-analytics|gtag\(|matomo|plausible)/i.test(h),
    cms: /wp-content|wordpress/i.test(h) ? "WordPress" : /wix\.com|wixstatic/i.test(h) ? "Wix" : /shopify/i.test(h) ? "Shopify" : /squarespace/i.test(h) ? "Squarespace" : /webflow/i.test(h) ? "Webflow" : /jimdo/i.test(h) ? "Jimdo" : "",
    extrait: text
  };
}

/* ── Annuaire officiel des entreprises ── */
const EFF = { "00": "0 salarié", "01": "1 ou 2 salariés", "02": "3 à 5 salariés", "03": "6 à 9 salariés", "11": "10 à 19 salariés", "12": "20 à 49 salariés", "21": "50 à 99 salariés", "22": "100 à 199 salariés", "31": "200 à 249 salariés", "32": "250 à 499 salariés", "41": "500 à 999 salariés", "42": "1 000 à 1 999 salariés", "51": "2 000 à 4 999 salariés", "52": "5 000 à 9 999 salariés", "53": "10 000 salariés et plus" };
const SECTIONS = { A: "Agriculture, sylviculture et pêche", B: "Industries extractives", C: "Industrie manufacturière", D: "Énergie", E: "Eau, déchets, dépollution", F: "Construction", G: "Commerce, réparation automobile", H: "Transports et entreposage", I: "Hébergement et restauration", J: "Information et communication", K: "Finance et assurance", L: "Activités immobilières", M: "Activités spécialisées, scientifiques et techniques", N: "Services administratifs et de soutien", O: "Administration publique", P: "Enseignement", Q: "Santé humaine et action sociale", R: "Arts, spectacles et loisirs", S: "Autres activités de services", T: "Activités des ménages", U: "Activités extraterritoriales" };
async function registre(q) {
  const ctl = new AbortController(), timer = setTimeout(() => ctl.abort(), 6000);
  try {
    const r = await fetch("https://recherche-entreprises.api.gouv.fr/search?per_page=3&q=" + encodeURIComponent(q), { signal: ctl.signal, headers: { Accept: "application/json", "User-Agent": UA } });
    if (!r.ok) return null;
    const d = await r.json(), e = (d.results || [])[0]; if (!e) return null;
    const s = e.siege || {};
    return {
      nom: e.nom_complet || e.nom_raison_sociale || "", siren: e.siren || "",
      activite_code: e.activite_principale || "", secteur: SECTIONS[e.section_activite_principale] || "",
      creation: e.date_creation || "", effectif: EFF[e.tranche_effectif_salarie] || "", annee_effectif: e.annee_tranche_effectif_salarie || "",
      commune: s.libelle_commune || "", code_postal: s.code_postal || "", departement: s.departement || "",
      active: e.etat_administratif === "A", etablissements: e.nombre_etablissements_ouverts || null,
      categorie: e.categorie_entreprise || ""
    };
  } catch { return null; } finally { clearTimeout(timer); }
}

export default async function handler(req, res) {
  if (req.method !== "POST") return send(res, 405, { error: "method_not_allowed" });
  const ip = (req.headers["x-forwarded-for"] || "").split(",")[0].trim() || "unknown";
  if (limited(ip)) return send(res, 429, { error: "rate_limited" });
  let b = req.body; if (typeof b === "string") { try { b = JSON.parse(b); } catch { b = {}; } }
  const q = String(b?.q || "").replace(/[\u0000-\u001f<>]/g, " ").trim().slice(0, 120);
  const url = String(b?.url || "").trim().slice(0, 300);
  if (q.length < 2 && !url) return send(res, 400, { error: "empty" });
  const [ent, page] = await Promise.all([q.length >= 2 ? registre(q) : null, url ? fetchPage(url) : null]);
  const site = page && !page.error ? analyse(page) : null;
  return send(res, 200, { entreprise: ent, site, site_erreur: page && page.error ? page.error : null });
}
