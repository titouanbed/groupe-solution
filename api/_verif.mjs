// Vérifications de fiabilité d'une entreprise (fichier « _ » : pas une route), partagées par le radar et la
// prospection ciblée. Sources publiques et officielles :
//  · annuaire officiel des entreprises (recherche-entreprises.api.gouv.fr) : société active, date de création,
//    forme juridique, taille, établissement ouvert ;
//  · BODACC (DILA) : procédure collective (sauvegarde, redressement, liquidation) ou radiation publiée ;
//  · Google Maps (si la clé est présente, appels plafonnés par _places.mjs) : fiche ouverte, téléphone, site.
// Jamais de dirigeant ni de donnée personnelle : seulement l'entreprise.
import { searchText, placesOn } from "./_places.mjs";

const UA = { Accept: "application/json", "User-Agent": "groupsolution.fr (contact@groupsolution.fr)" };
const RE_API = "https://recherche-entreprises.api.gouv.fr/search";
const BODACC = "https://bodacc-datadila.opendatasoft.com/api/explore/v2.1/catalog/datasets/annonces-commerciales/records";
const EFF = { "00": [0, "0 salarié"], "01": [1, "1 ou 2 salariés"], "02": [2, "3 à 5 salariés"], "03": [3, "6 à 9 salariés"], "11": [4, "10 à 19 salariés"], "12": [5, "20 à 49 salariés"], "21": [6, "50 à 99 salariés"], "22": [6, "100 à 199 salariés"], "31": [7, "200 à 249 salariés"], "32": [7, "250 à 499 salariés"], "41": [8, "500 salariés et plus"], "42": [8, "1 000 salariés et plus"], "51": [8, "2 000 salariés et plus"], "52": [8, "5 000 salariés et plus"], "53": [8, "10 000 salariés et plus"] };
// Activités qui ne sont pas de vrais prospects : holdings, sièges, location de biens, marchands de biens, domiciliation.
export const NAF_EXCLU = /^(64\.20|70\.10|68\.20|68\.10|68\.32|82\.11|66\.30|64\.30|94\.|84\.|99\.)/;
export const norm = s => String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, " ").trim();
const FORMES = new Set(["sarl", "sas", "sasu", "eurl", "sa", "sci", "snc", "selarl", "scop", "societe", "ste", "ets", "etablissements", "et", "de", "du", "des", "la", "le", "les", "l", "d"]);
const toks = s => norm(s).split(" ").filter(w => w.length > 1 && !FORMES.has(w));
const mots = s => toks(s).filter(w => w.length > 2);

// Ressemblance entre un nom Google (enseigne) et un nom de l'annuaire, de 0 à 1.
// « Nyamba Club » ↔ « NYAMBA PLONGEE (NYAMBA CLUB) » = 0,9 ; « Nyamba Club » ↔ « NYAMBA AUTO » = 0,4 (rejeté).
export function scoreNom(a, b) {
  const an = toks(a).join(" "), bn = toks(b).join(" "); if (!an || !bn) return 0;
  const ac = an.replace(/ /g, ""), bc = bn.replace(/ /g, ""), ra = norm(a).replace(/ /g, ""), rb = norm(b).replace(/ /g, "");
  if (ac === bc || ra === rb) return 1;
  if (ra.length >= 4 && rb.includes(ra)) return norm(a).includes(" ") || ra.length >= 8 ? 0.9 : 0.7;   // « O' TGR » → « otgr » dans « OTGR (O'TGR) »
  if (ac.length >= 4 && bc.includes(ac)) return an.includes(" ") || ac.length >= 8 ? 0.9 : 0.7;   // un seul mot court (« Lagon ») : prudence
  if (bc.length >= 4 && ac.includes(bc)) return 0.8;
  const ta = new Set(an.split(" ")), tb = new Set(bn.split(" ")), com = [...ta].filter(w => tb.has(w)).length;
  return 0.85 * Math.min(com / ta.size, com / tb.size);
}
export const memeNom = (a, b) => scoreNom(a, b) >= 0.6;
const nomsDe = e => [e.nom_complet, e.nom_raison_sociale, e.sigle, ...(e.siege?.liste_enseignes || []), ...(e.matching_etablissements || []).flatMap(m => m.liste_enseignes || [])].filter(Boolean);
const meilleurScore = (nom, e) => Math.max(0, ...nomsDe(e).map(n => scoreNom(nom, n)));

async function getJson(url, tries = 2) {
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(url, { signal: AbortSignal.timeout(9000), headers: UA });
      if (r.status === 429 || r.status >= 500) { await new Promise(z => setTimeout(z, 700 * (i + 1))); continue; }
      if (!r.ok) return { erreur: r.status };
      return await r.json();
    } catch (e) { if (i === tries - 1) return { erreur: e?.name || "reseau" }; }
  }
  return { erreur: "indisponible" };
}

// Lecture détaillée d'un résultat de l'annuaire (sans les dirigeants).
function lireRegistre(e) {
  const s = e.siege || {}, c = e.complements || {}, eff = EFF[e.tranche_effectif_salarie] || null;
  const ei = !!c.est_entrepreneur_individuel || /^1/.test(String(e.nature_juridique || ""));
  return {
    siren: e.siren || "", nom: ei ? "" : (e.nom_complet || e.nom_raison_sociale || ""), enseignes: (s.liste_enseignes || []).filter(Boolean),
    individuelle: ei, association: !!c.est_association || /^92/.test(String(e.nature_juridique || "")),
    nature: String(e.nature_juridique || ""), categorie: e.categorie_entreprise || "", naf: e.activite_principale || s.activite_principale || "",
    creation: e.date_creation || s.date_creation || "", fermeture: e.date_fermeture || s.date_fermeture || "",
    actif: e.etat_administratif === "A" && (!s.etat_administratif || s.etat_administratif === "A"),
    effectif: eff ? eff[1] : "", taille: eff ? eff[0] : null, etablissements: e.nombre_etablissements_ouverts ?? null,
    commune: s.libelle_commune || "", cp: s.code_postal || "", dep: s.departement || "",
    ca: (() => { const f = e.finances || {}; const y = Object.keys(f).sort().pop(); return y && f[y]?.ca ? { annee: y, ca: f[y].ca } : null; })(),
    // Filiale d'un groupe : un des dirigeants est une société (on ne lit que ce type, jamais les noms de personnes).
    groupe: (e.dirigeants || []).some(d => d && d.type_dirigeant === "personne morale") || ["GE", "ETI"].includes(e.categorie_entreprise || "")
  };
}

// Une société précise, par son SIREN. null = introuvable (pas encore indexée) ; { erreur } = service indisponible.
export async function registreSiren(siren) {
  if (!/^\d{9}$/.test(siren)) return null;
  const d = await getJson(`${RE_API}?q=${siren}&per_page=1&page=1`);
  if (d.erreur) return { erreur: d.erreur };
  const e = (d.results || []).find(x => x.siren === siren);
  return e ? lireRegistre(e) : null;
}

// Recherche par nom (enseigne Google) : code postal puis département, nom en mots puis nom compact (« O' TGR » → « otgr »).
// Une société ACTIVE ressemblante (score ≥ 0,6) passe toujours avant une société fermée, même au nom identique :
// un club repris garde souvent son nom, l'ancienne société est dissoute et la nouvelle est active (cas Nyamba).
export async function registreNom(nom, { cp = "", dep = "" } = {}) {
  const m = mots(nom), q1 = m.slice(0, 5).join(" "), q2 = norm(nom).replace(/ /g, "");
  const qs = [...new Set([q1, q2].filter(q => q.length >= 3))]; if (!qs.length) return null;
  const filtres = [cp ? `&code_postal=${encodeURIComponent(cp)}` : "", dep ? `&departement=${encodeURIComponent(dep)}` : ""].filter(Boolean);
  let erreur = null, actif = null, sa = 0, ferme = null, sf = 0;
  for (const f of filtres.length ? filtres : [""]) {
    for (const q of qs) {
      const d = await getJson(`${RE_API}?q=${encodeURIComponent(q)}${f}&per_page=10&page=1`);
      if (d.erreur) { erreur = d.erreur; continue; }
      for (const e of d.results || []) {
        const sc = meilleurScore(nom, e), ok = e.etat_administratif === "A";
        if (ok && sc > sa) { sa = sc; actif = e; } else if (!ok && sc > sf) { sf = sc; ferme = e; }
      }
    }
    if (actif && sa >= 0.9) break;
  }
  if (actif && sa >= 0.6) return { ...lireRegistre(actif), score: Math.min(1, Math.round(sa * 100) / 100) };
  if (ferme && sf >= 0.6) return { ...lireRegistre(ferme), score: Math.min(1, Math.round(sf * 100) / 100) };
  return erreur ? { erreur } : null;
}

// SIREN valide ? (clé de Luhn) — évite de prendre un numéro de téléphone pour un SIREN.
export function sirenValide(n) {
  if (!/^\d{9}$/.test(n)) return false;
  let t = 0; for (let i = 0; i < 9; i++) { let d = +n[8 - i]; if (i % 2) { d *= 2; if (d > 9) d -= 9; } t += d; }
  return t % 10 === 0;
}
// SIREN publié sur une page (mentions légales) : « SIRET 123 456 789 00012 », « RCS Mamoudzou 123 456 789 »…
export function sirenDansPage(html) {
  const txt = String(html || "").replace(/<[^>]+>/g, " ").replace(/&nbsp;|&#160;/g, " ");
  for (const m of txt.matchAll(/(?:siret|siren|rcs|n°\s*d'immatriculation)[^0-9]{0,60}((?:\d[\s. ]?){9,14})/gi)) {
    const d = m[1].replace(/\D/g, "").slice(0, 9); if (sirenValide(d)) return d;
  }
  return "";
}

// Annonces BODACC défavorables publiées pour ce SIREN (procédure collective, radiation).
export async function bodaccAlertes(siren) {
  if (!/^\d{9}$/.test(siren)) return { ok: false };
  const sp = siren.replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3");
  const fam = `(familleavis="collective" or familleavis="radiation")`;
  for (const w of [`(search(registre, "${siren}") or search(registre, "${sp}")) and ${fam}`, `"${sp}" and ${fam}`]) {
    const d = await getJson(`${BODACC}?where=${encodeURIComponent(w)}&limit=10&order_by=${encodeURIComponent("dateparution desc")}`, 1);
    if (d.erreur) continue;
    const alertes = (d.results || []).filter(r => JSON.stringify(r.registre || "").replace(/\D/g, "").includes(siren))
      .map(r => ({ famille: r.familleavis_lib || r.familleavis || "", date: r.dateparution || "", detail: String(r.jugement && (typeof r.jugement === "string" ? r.jugement : JSON.stringify(r.jugement))).match(/nature"?\s*:\s*"([^"]+)/)?.[1] || "" }));
    return { ok: true, alertes };
  }
  return { ok: false };
}

const MASK = "places.id,places.displayName,places.formattedAddress,places.businessStatus,places.nationalPhoneNumber,places.websiteUri,places.rating,places.userRatingCount,places.googleMapsUri,places.primaryTypeDisplayName";
// La fiche Google Maps de l'entreprise (nom + commune), seulement si les noms correspondent vraiment.
export async function googleFiche(nom, commune) {
  if (!placesOn() || !nom) return null;
  const l = await searchText({ textQuery: `${nom} ${commune || ""}`.trim(), maxResultCount: 3 }, MASK);
  if (!l) return null;
  const p = l.find(x => memeNom(x.displayName?.text, nom));
  return p ? lireGoogle(p) : { absent: true };
}
export const lireGoogle = p => ({
  id: p.id, nom: p.displayName?.text || "", adresse: p.formattedAddress || "", statut: p.businessStatus || "",
  ouvert: !p.businessStatus || p.businessStatus === "OPERATIONAL", telephone: p.nationalPhoneNumber || "", site: p.websiteUri || "",
  note: typeof p.rating === "number" ? p.rating : null, avis: p.userRatingCount || 0, maps: p.googleMapsUri || "", type: p.primaryTypeDisplayName?.text || "",
  photos: (p.photos || []).length
});
export const joursDepuis = d => { const t = Date.parse(d); return isNaN(t) ? null : Math.floor((Date.now() - t) / 86400e3); };
