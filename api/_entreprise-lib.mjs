// Bibliothèque partagée (fichier « _ » : pas une route) : fiche publique d'une entreprise (annuaire
// officiel, sans les dirigeants) et lecture sécurisée de la page d'accueil d'un site.
// Utilisée par /api/entreprise (formulaire « Analyser mon entreprise ») et par /api/assistant (outils de l'IA).
import dns from "node:dns/promises";
import net from "node:net";
import http from "node:http";
import https from "node:https";

const UA = "Mozilla/5.0 (compatible; GroupeSolutionBot/1.0; +https://www.groupsolution.fr/lab/coulisses.html)";
const MAX_BYTES = 300_000, TIMEOUT = 6000, DEADLINE = 12000;

/* ── Adresses autorisées : uniquement des serveurs publics ── */
const BL = new net.BlockList();
[["0.0.0.0", 8], ["10.0.0.0", 8], ["100.64.0.0", 10], ["127.0.0.0", 8], ["169.254.0.0", 16], ["172.16.0.0", 12], ["192.0.0.0", 24], ["192.0.2.0", 24], ["192.168.0.0", 16], ["198.18.0.0", 15], ["198.51.100.0", 24], ["203.0.113.0", 24], ["224.0.0.0", 3]].forEach(([a, p]) => BL.addSubnet(a, p, "ipv4"));
[["::", 96], ["64:ff9b::", 96], ["64:ff9b:1::", 48], ["100::", 64], ["2001:db8::", 32], ["2002::", 16], ["fc00::", 7], ["fe80::", 10], ["fec0::", 10], ["ff00::", 8]].forEach(([a, p]) => BL.addSubnet(a, p, "ipv6"));
BL.addAddress("::1", "ipv6"); // les adresses ::ffff:a.b.c.d sont comparées aux règles IPv4 par BlockList
const isPublicIP = ip => net.isIP(ip) === 4 ? !BL.check(ip, "ipv4") : net.isIP(ip) === 6 ? !BL.check(ip, "ipv6") : false;

// Résolution DNS vérifiée AU MOMENT de la connexion (pas de « DNS rebinding » entre contrôle et requête).
function safeLookup(host, opts, cb) {
  const t = setTimeout(() => cb(new Error("dns timeout")), 3000);
  dns.lookup(host, { all: true, verbatim: true }).then(as => {
    clearTimeout(t);
    if (!as.length || !as.every(a => isPublicIP(a.address))) return cb(new Error("adresse non publique"));
    if (opts && opts.all) return cb(null, as);
    cb(null, as[0].address, as[0].family);
  }, e => { clearTimeout(t); cb(e); });
}

function checkURL(raw) {
  let u;
  try { u = new URL(/^https?:\/\//i.test(raw) ? raw : "https://" + raw); } catch { return null; }
  if (!["http:", "https:"].includes(u.protocol) || u.username || u.password) return null;
  if (u.port && !["80", "443"].includes(u.port)) return null;
  const host = u.hostname.toLowerCase();
  if (net.isIP(host.replace(/^\[|\]$/g, "")) || !/^[a-z0-9.-]+\.(?:[a-z]{2,}|xn--[a-z0-9-]{2,})$/.test(host) || /(^|\.)(localhost|internal|local|lan|home|corp)$/.test(host)) return null;
  return u;
}

function get(u, want = /html/i, max = MAX_BYTES) {
  return new Promise(resolve => {
    const lib = u.protocol === "https:" ? https : http;
    const req = lib.get(u, { lookup: safeLookup, timeout: TIMEOUT, headers: { "User-Agent": UA, Accept: want.source.includes("image") ? "image/*" : "text/html,application/xhtml+xml", "Accept-Encoding": "identity" } }, r => {
      const status = r.statusCode || 0, type = String(r.headers["content-type"] || "");
      if ([301, 302, 303, 307, 308].includes(status) || status < 200 || status >= 300 || !want.test(type)) { r.resume(); req.destroy(); return resolve({ status, location: r.headers.location, type }); }
      const chunks = []; let size = 0;
      r.on("data", c => { size += c.length; if (size > max) { req.destroy(); resolve({ status, type, body: Buffer.concat(chunks), size, cut: true }); } else chunks.push(c); });
      r.on("end", () => resolve({ status, type, body: Buffer.concat(chunks), size }));
      r.on("error", () => resolve({ status, type, body: Buffer.concat(chunks), size }));
    });
    req.on("timeout", () => { req.destroy(); resolve({ error: "site trop lent" }); });
    req.on("error", e => resolve({ error: /non publique/.test(e.message) ? "adresse non publique" : "site injoignable" }));
  });
}

async function fetchPage(raw) {
  let u = checkURL(raw); if (!u) return { error: "adresse non valide ou non publique" };
  const t0 = Date.now();
  for (let hop = 0; hop < 4; hop++) {
    if (Date.now() - t0 > DEADLINE) return { error: "site trop lent" };
    const r = await get(u);
    if (r.error) return r;
    if ([301, 302, 303, 307, 308].includes(r.status)) {
      let next; try { next = new URL(String(r.location || ""), u).href; } catch { return { error: "redirection invalide" }; }
      u = checkURL(next); if (!u) return { error: "redirection vers une adresse non valide" };
      continue;
    }
    if (!r.body) return { error: `réponse ${r.status}` };
    const cs = (r.type.match(/charset=([\w-]+)/i) || [])[1] || (r.body.subarray(0, 2048).toString("latin1").match(/<meta[^>]{0,200}charset=["']?([\w-]+)/i) || [])[1] || "utf-8";
    let html; try { html = new TextDecoder(cs.toLowerCase()).decode(r.body); } catch { html = r.body.toString("utf8"); }
    return { url: u.href, https: u.protocol === "https:", ms: Date.now() - t0, bytes: r.size, html };
  }
  return { error: "trop de redirections" };
}

// Image publique (aperçu d'un site : og:image), mêmes protections que les pages. Retourne un data URL.
async function fetchImage(raw) {
  let u = checkURL(raw); if (!u) return null;
  for (let hop = 0; hop < 4; hop++) {
    const r = await get(u, /^image\/(jpeg|png|webp)/i, 3_000_000);
    if (r.error) return null;
    if ([301, 302, 303, 307, 308].includes(r.status)) { try { u = checkURL(new URL(String(r.location || ""), u).href); } catch { return null; } if (!u) return null; continue; }
    if (!r.body || r.cut) return null;
    return `data:${r.type.split(";")[0].trim().toLowerCase()};base64,${r.body.toString("base64")}`;
  }
  return null;
}

/* ── Lecture de la page (ce que voit un internaute) ── */
const strip = s => String(s || "").replace(/<[^>]{0,2000}>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&#39;|&rsquo;/g, "’").replace(/&quot;/g, '"').replace(/\s+/g, " ").trim();
const attr = (html, re) => { const m = html.match(re); return m ? strip(m[1]).slice(0, 300) : ""; };
// Retire <script>, <style>, <noscript> sans expression régulière (aucun risque de lenteur sur du HTML piégé).
function dropBlocks(h) {
  const low = h.toLowerCase(); let out = "", i = 0;
  for (;;) {
    let j = -1, tag = "";
    for (const t of ["script", "style", "noscript"]) { const k = low.indexOf("<" + t, i); if (k >= 0 && (j < 0 || k < j)) { j = k; tag = t; } }
    if (j < 0) return out + h.slice(i);
    out += h.slice(i, j) + " ";
    const e = low.indexOf("</" + tag, j); if (e < 0) return out;
    const g = low.indexOf(">", e); i = g < 0 ? low.length : g + 1;
  }
}
function analyse(p) {
  const h = p.html.slice(0, MAX_BYTES), body = dropBlocks(h);
  const imgs = h.match(/<img\b[^>]{0,1000}>/gi) || [];
  const socials = [...h.matchAll(/https?:\/\/(?:www\.|[a-z]{2}\.)?(facebook|instagram|linkedin|tiktok|youtube|x|twitter|pinterest)\.(?:com|fr)\//gi)].map(m => m[1].toLowerCase());
  const text = strip(body).slice(0, 1600);
  return {
    url: p.url, https: p.https, temps_ms: p.ms, poids_ko: Math.round(p.bytes / 1024),
    titre: attr(h, /<title[^>]{0,200}>([^<]{0,300})/i),
    description: attr(h, /<meta[^>]{0,500}?name=["']description["'][^>]{0,500}?content=["']([^"']{0,500})/i) || attr(h, /<meta[^>]{0,500}?content=["']([^"']{0,500})["'][^>]{0,500}?name=["']description["']/i),
    h1: attr(h, /<h1[^>]{0,300}>([\s\S]{0,400}?)<\/h1>/i),
    langue: attr(h, /<html[^>]{0,500}?lang=["']([^"']{1,20})/i),
    mobile: /<meta[^>]{0,300}?name=["']viewport["']/i.test(h),
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
const fiche = e => {
  const s = e.siege || {};
  return {
    nom: e.nom_complet || e.nom_raison_sociale || "", siren: e.siren || "",
    activite_code: e.activite_principale || "", secteur: SECTIONS[e.section_activite_principale] || "",
    creation: e.date_creation || "", effectif: EFF[e.tranche_effectif_salarie] || "", annee_effectif: e.annee_tranche_effectif_salarie || "",
    commune: s.libelle_commune || "", code_postal: s.code_postal || "", departement: s.departement || "",
    active: e.etat_administratif === "A", etablissements: e.nombre_etablissements_ouverts || null,
    categorie: e.categorie_entreprise || ""
  };
};
// Annuaire officiel (recherche-entreprises.api.gouv.fr, sans clé). Renvoie jusqu'à 3 entreprises
// (la première est la plus pertinente). Un SIREN/SIRET est accepté avec ou sans espaces.
// Deux tentatives, erreurs journalisées dans les logs Vercel pour diagnostic.
export async function registreListe(q, { commune = "" } = {}) {
  let query = String(q || "").trim();
  const digits = query.replace(/[\s.]/g, "");
  if (/^\d{9}$|^\d{14}$/.test(digits)) query = digits.slice(0, 9);
  else if (commune) query = `${query} ${commune}`.trim();
  if (query.length < 3) return [];
  const url = "https://recherche-entreprises.api.gouv.fr/search?per_page=3&page=1&q=" + encodeURIComponent(query);
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const r = await fetch(url, { signal: AbortSignal.timeout(8000), headers: { Accept: "application/json", "User-Agent": "groupsolution.fr (contact@groupsolution.fr)" } });
      if (r.status === 429 || r.status >= 500) { console.error("registre: HTTP", r.status); await new Promise(z => setTimeout(z, 600)); continue; }
      if (!r.ok) { console.error("registre: HTTP", r.status, (await r.text().catch(() => "")).slice(0, 200)); return []; }
      const d = await r.json();
      return (d.results || []).slice(0, 3).map(fiche);
    } catch (e) { console.error("registre:", e?.name || e?.message); }
  }
  return [];
}
export async function registre(q) { return (await registreListe(q))[0] || null; }

export { fetchPage, fetchImage, analyse, checkURL };
