// Appels (fichier « _ » : pas une route) — une réserve de numéros à appeler, qui ne perd jamais rien.
// Chaque matin, 3 recherches tournantes (Mayotte, Montpellier, une commune voisine) ajoutent des numéros ;
// le bouton « En ajouter 10 / 20 » lance d'autres recherches (tous secteurs, Mayotte et Hérault/Gard).
// Un numéro sans statut reste « à contacter » ; dès qu'un résultat d'appel est noté (même « pas de réponse »),
// il passe dans « déjà contactés », avec son historique.
// Ne garde que les bons prospects pour un premier appel : un numéro, pas de site (ou une simple page Facebook, ou un
// site ancien), une petite structure indépendante (jamais une filiale de groupe), jamais déjà proposée ni déjà suivie.
// Coût maîtrisé : recherche ciblée en mode léger (2 appels Google par combinaison, plafonds de _places.mjs respectés).
import { redis } from "./_guard.mjs";
import { runCible, getCible, cleNom, setSuivi } from "./_cible.mjs";

const ACTIVITES = ["restaurant", "coiffeur", "garage automobile", "plombier", "électricien", "institut de beauté", "maçon", "menuisier", "peintre en bâtiment", "climatisation",
  "paysagiste", "boulangerie", "traiteur", "auto-école", "location de voiture", "serrurier", "carreleur", "couvreur", "nettoyage", "snack", "barbier", "carrosserie", "pressing", "fleuriste",
  "pizzeria", "food truck", "esthéticienne", "onglerie", "salle de sport", "coach sportif", "photographe", "taxi", "déménagement", "vitrier", "chauffagiste", "pisciniste",
  "terrassement", "jardinier", "épicerie", "boucherie", "caviste", "opticien", "toiletteur", "agence immobilière", "location de matériel", "réparation téléphone", "cordonnier",
  "couturière", "tatoueur", "massage bien-être", "gîte", "chambre d'hôtes", "location de bateau", "excursion en bateau"];
// Activités nombreuses partout (pour les petites communes, où un métier rare donnerait une liste vide).
const FORTES = ["restaurant", "coiffeur", "garage automobile", "plombier", "électricien", "institut de beauté", "boulangerie", "snack", "maçon", "paysagiste"];
// Pour le bouton « En ajouter » : la métropole d'abord, puis les grandes villes de l'Hérault et du Gard.
const PLUS_LOIN = ["Sète", "Frontignan", "Lunel", "Béziers", "Agde", "Nîmes", "Alès", "Clermont-l'Hérault", "Lodève", "Ganges", "Palavas-les-Flots", "La Grande-Motte"];
const MONTPELLIER = ["Lattes", "Castelnau-le-Lez", "Pérols", "Saint-Jean-de-Védas", "Juvignac", "Mauguio", "Grabels", "Clapiers", "Jacou", "Le Crès", "Villeneuve-lès-Maguelone", "Fabrègues", "Saint-Clément-de-Rivière"];
const liste = (v, d) => { const l = String(v || "").split(",").map(x => x.trim()).filter(Boolean); return l.length ? l : d; };
const s = (v, n) => String(v ?? "").trim().slice(0, n);
const jourN = (t = Date.now()) => Math.floor(t / 864e5);

// Combinaisons du jour : déterministes (même résultat si on relance le même jour), différentes chaque jour.
// Mayotte (toute l'île) · Montpellier (ville) · une commune de la métropole avec une activité nombreuse.
export function combosDuJour(t = Date.now()) {
  const A = liste(process.env.APPELS_ACTIVITES, ACTIVITES), F = liste(process.env.APPELS_ACTIVITES_FORTES, FORTES), Z = liste(process.env.APPELS_ZONES_34, MONTPELLIER), n = jourN(t);
  return [{ activite: A[n % A.length], zone: "Mayotte" }, { activite: A[(n * 7 + 5) % A.length], zone: "Montpellier" }, { activite: F[(n * 3 + 1) % F.length], zone: Z[n % Z.length] }]
    .slice(0, Math.max(1, Math.min(3, +process.env.APPELS_COMBOS || 3)));
}

export function typeTel(t) {
  const d = String(t || "").replace(/[^\d+]/g, "").replace(/^\+33|^0033/, "0").replace(/^\+262|^00262/, "0");
  if (/^0639/.test(d)) return "portable"; if (/^0269/.test(d)) return "fixe";
  if (/^0[67]/.test(d)) return "portable"; if (/^0[1-5]/.test(d)) return "fixe"; if (/^0[89]/.test(d)) return "standard";
  return "";
}

// Site : le plus favorable pour nous d'abord. null = site correct, pas un prospect pour un premier appel.
function etat(w) {
  const an = new Date().getFullYear();
  if (!w || w.type === "aucun") return { rang: 3, txt: "Pas de site internet" };
  if (w.type === "reseau") return { rang: 3, txt: `Seulement une page ${String(w.hote || "").split(".")[0]}, pas de vrai site` };
  if (w.type === "erreur") return { rang: 2, txt: "Site indiqué sur Google mais inaccessible" };
  if (w.type !== "site") return null;
  const d = [!w.mobile && "non adapté au téléphone", w.annee && w.annee <= an - 3 && `« © ${w.annee} » en bas de page`, !w.https && "pas de HTTPS"].filter(Boolean);
  return d.length ? { rang: 2, txt: "Site ancien : " + d.join(", ") } : null;
}

// Sélection stricte dans une recherche ciblée. Exporté pour les tests.
export function selection(r, vus) {
  const out = [];
  for (const f of r.fiches || []) {
    const e = etat(f.site), tt = typeTel(f.telephone), reg = f.registre;
    if (!f.telephone || tt === "standard" || !e || f.equipe || f.partiel) continue;
    if (reg?.groupe || (reg?.taille ?? 0) > 4 || (reg?.etablissements ?? 0) > 3) continue;   // filiale, réseau ou structure de plus de 20 salariés
    if (vus.has(f.id) || r.suivi?.[cleNom(f.nom)]) continue;                               // déjà proposé ou déjà dans le suivi
    // Signe d'activité réelle (joignable) : des avis Google, ou une société active à l'annuaire officiel.
    if (!f.avis && !reg) continue;
    const pourquoi = [e.txt];
    if (f.avis) pourquoi.push(`${f.avis} avis Google${f.note != null ? " (" + String(f.note).replace(".", ",") + "★)" : ""} : activité réelle`);
    if (tt === "portable") pourquoi.push("Numéro portable : souvent le gérant en direct");
    if (reg?.depuis) pourquoi.push(`Société active depuis ${reg.depuis.slice(0, 4)}${reg.effectif ? " · " + reg.effectif : ""}`);
    const score = e.rang * 10 + (tt === "portable" ? 3 : 0) + (f.avis >= 3 ? 2 : 0) + (f.note >= 4 ? 1 : 0) + Math.min(f.avis || 0, 50) / 25 + (f.besoin || 0) / 20;
    out.push({ id: f.id, nom: s(f.nom, 120), adresse: s(f.adresse, 160), telephone: s(f.telephone, 30), tel_type: tt, maps: s(f.maps, 300), site: s(f.site?.url, 200),
      note: f.note ?? null, avis: f.avis || 0, pourquoi: pourquoi.slice(0, 4), manques: (f.manques || []).slice(0, 4), accroche: s(f.accroche, 260), offre: s(f.offre, 40), exploitant: s(f.exploitant, 120), score: Math.round(score * 10) / 10 });
  }
  return out.sort((a, b) => b.score - a.score);
}

const VU_JOURS = 90;
const POOL = "appels:pool", MIGRE = "appels:pool:v1", COMBOS_VUS = "appels:combos";
export const STATUTS = ["sans_reponse", "a_rappeler", "pas_decideur", "rdv", "devis", "client", "pas_interesse", "deja_prestataire", "hs"];
const lire = v => { try { return v ? JSON.parse(v) : null; } catch { return null; } };
const telN = t => String(t || "").replace(/\D/g, "").replace(/^(33|262)/, "0");

// Recherche de quelques combinaisons en parallèle, puis sélection stricte des nouveaux numéros (jamais en double).
async function chercher(combos, parCombo, dejaPool) {
  const deja = new Set(dejaPool), items = [], bilan = [];
  // En parallèle : tient dans la durée maximale d'une fonction (300 s).
  const res = await Promise.all(combos.map(c => runCible({ ...c, pages: 1, leger: true }).catch(e => ({ erreur: e?.message || "erreur" }))));
  for (const [k, c] of combos.entries()) {
    const r = res[k];
    if (r.erreur) { bilan.push({ ...c, erreur: s(r.erreur, 160) }); continue; }
    const full = r.cache ? r : (await getCible(r.id)) || r;
    const ids = (full.fiches || []).map(f => f.id);
    const vu = ids.length ? await redis(ids.map(id => ["GET", "appels:vu:" + id])) : [];
    const vus = new Set(ids.filter((id, i) => vu[i]));
    // Une même entreprise peut sortir dans deux recherches : une seule fois (par fiche et par numéro).
    const sel = selection(full, vus).filter(x => { const t = telN(x.telephone); if (deja.has(x.id) || deja.has(t)) return false; deja.add(x.id); deja.add(t); return true; })
      .slice(0, parCombo).map(x => ({ ...x, cibleId: full.id, activite: c.activite, zone: c.zone }));
    items.push(...sel);
    bilan.push({ ...c, cibleId: full.id, trouves: full.stats?.trouves ?? (full.fiches || []).length, retenus: sel.length });
  }
  return { items: items.sort((a, b) => b.score - a.score), bilan };
}

async function lirePool() {
  await migrer();
  const [a] = await redis([["HGETALL", POOL]]);
  const out = [];
  for (let k = 0; k + 1 < (a || []).length; k += 2) { const x = lire(a[k + 1]); if (x) out.push(x); }
  return out;
}
async function ajouterAuPool(items, origine) {
  if (!items.length) return;
  const now = new Date().toISOString(), cmds = [];
  for (const x of items) {
    cmds.push(["HSET", POOL, x.id, JSON.stringify({ ...x, ajoute: now, origine })], ["SET", "appels:vu:" + x.id, now.slice(0, 10), "EX", VU_JOURS * 86400]);
  }
  await redis(cmds);
}

// Reprise des listes « appels du jour » déjà proposées (et de leur suivi) : rien ne disparaît.
async function migrer() {
  const [ok] = await redis([["GET", MIGRE]]); if (ok) return;
  const dates = Array.from({ length: 31 }, (_, i) => new Date(Date.now() - i * 864e5).toISOString().slice(0, 10));
  const jours = await redis(dates.map(d => ["GET", "appels:jour:" + d]));
  const [deja] = await redis([["HKEYS", POOL]]), connus = new Set(deja || []), items = [];
  jours.forEach((v, i) => { const r = lire(v); for (const x of r?.items || []) if (!connus.has(x.id)) { connus.add(x.id); items.push({ ...x, ajoute: dates[i] + "T05:00:00.000Z", origine: "appels du jour" }); } });
  const cibles = {};
  for (const id of new Set(items.map(x => x.cibleId).filter(Boolean))) cibles[id] = await getCible(id).catch(() => null);
  const cmds = [];
  for (const x of items) {
    const sv = cibles[x.cibleId]?.suivi?.[cleNom(x.nom)];
    // Ancien bouton « Pas de réponse » = « à rappeler » + note « Pas de réponse » : on le range sous son vrai nom.
    const st = sv?.statut === "a_rappeler" && /pas de r[ée]ponse/i.test(sv.note || "") ? "sans_reponse" : sv?.statut === "ferme" ? "hs" : sv?.statut;
    if (sv && st && st !== "a_appeler" && STATUTS.includes(st)) x.suivi = { statut: st, essais: sv.essais || 0, note: sv.note || "", maj: sv.maj || x.ajoute, historique: [] };
    cmds.push(["HSET", POOL, x.id, JSON.stringify(x)]);
  }
  cmds.push(["SET", MIGRE, new Date().toISOString()]);
  await redis(cmds);
}

// Tous les numéros : à contacter (sans statut) et déjà contactés (tout statut, même « pas de réponse »).
export async function getAppels() {
  const all = await lirePool();
  const aContacter = all.filter(x => !x.suivi?.statut).sort((a, b) => (b.ajoute || "").slice(0, 10).localeCompare((a.ajoute || "").slice(0, 10)) || b.score - a.score);
  const contactes = all.filter(x => x.suivi?.statut).sort((a, b) => String(b.suivi.maj || "").localeCompare(String(a.suivi.maj || "")));
  const [last] = await redis([["GET", "cron:last:appels"]]);
  return { aContacter, contactes, dernier: lire(last) };
}

// Résultat d'un appel. statut vide = remettre « à contacter ». Le suivi de la prospection ciblée est tenu à jour aussi.
export async function setAppel(id, { statut, note }) {
  id = s(id, 200);
  const [v] = await redis([["HGET", POOL, id]]); const x = lire(v); if (!x) return null;
  const now = new Date().toISOString(), o = x.suivi || { essais: 0, historique: [] };
  if (statut && !STATUTS.includes(statut)) return null;
  if (!statut) { delete x.suivi; }
  else {
    if (statut === "sans_reponse") o.essais = (o.essais || 0) + 1;
    o.statut = statut; o.maj = now;
    if (note != null && String(note).trim()) o.note = s(note, 400);
    o.historique = [...(o.historique || []), { statut, date: now, ...(note && String(note).trim() ? { note: s(note, 200) } : {}) }].slice(-20);
    x.suivi = o;
  }
  await redis([["HSET", POOL, id, JSON.stringify(x)]]);
  if (x.cibleId) await setSuivi(x.cibleId, { nom: x.nom, statut: statut || "a_appeler", note: note || "", telephone: x.telephone, essai: statut === "sans_reponse" }).catch(() => null);
  return x;
}

// Chaque matin : les 3 recherches du jour, ajoutées à la réserve.
export async function runAppelsDuJour({ force = false } = {}) {
  const date = new Date().toISOString().slice(0, 10), cle = "appels:jour:" + date;
  if (!force) { const [v] = await redis([["GET", cle]]); if (v) { const r = lire(v); if (r) return { ...r, cache: true }; } }
  const pool = await lirePool(), combos = combosDuJour();
  const { items, bilan } = await chercher(combos, 4, pool.flatMap(x => [x.id, telN(x.telephone)]));
  await ajouterAuPool(items, "appels du jour");
  await redis([["SET", cle, JSON.stringify({ date, combos: bilan, items }), "EX", 30 * 86400], ["SET", "appels:dernier", date], ...combos.map(c => ["HSET", COMBOS_VUS, c.activite + "|" + c.zone, date])]);
  return { date, combos: bilan, items };
}

// Combinaisons pas encore cherchées depuis 30 jours, mélangées de façon stable : 1 sur 3 à Mayotte.
function combosEnPlus(n, vus) {
  const A = liste(process.env.APPELS_ACTIVITES, ACTIVITES), Z = ["Montpellier", ...liste(process.env.APPELS_ZONES_34, MONTPELLIER), ...PLUS_LOIN];
  const h = t => { let x = 2166136261; for (const ch of t) x = Math.imul(x ^ ch.charCodeAt(0), 16777619) >>> 0; return x; };
  const libre = c => { const d = vus[c.activite + "|" + c.zone]; return !d || (Date.now() - Date.parse(d)) / 864e5 > 30; };
  const may = A.map(a => ({ activite: a, zone: "Mayotte" })).filter(libre), met = A.flatMap(a => Z.map((z, i) => ({ activite: a, zone: z, rang: i }))).filter(libre);
  const sel = (l, seed) => l.map(c => ({ c, k: h(seed + c.activite + c.zone) })).sort((a, b) => a.k - b.k).map(x => x.c);
  const jour = String(jourN()), M = sel(may, jour), T = sel(met.filter(c => c.rang < 8), jour).concat(sel(met.filter(c => c.rang >= 8), jour));
  const out = [];
  // Activités différentes dans un même lot : plus de matière, moins de doublons.
  const prises = new Set();
  while (out.length < n && (M.length || T.length)) {
    const src = out.length % 3 === 0 && M.length ? M : T.length ? T : M;
    const c = src.shift(); if (!c) break;
    if (prises.has(c.activite) && (M.length + T.length) > n) continue;
    prises.add(c.activite); out.push({ activite: c.activite, zone: c.zone });
  }
  return out;
}

// Bouton « En ajouter 10 / 20 » : autant de recherches que nécessaire (6 au plus par clic, 2 appels Google chacune).
export async function ajouterAppels({ n = 10 } = {}) {
  n = Math.max(5, Math.min(20, +n || 10));
  const pool = await lirePool(), [v] = await redis([["HGETALL", COMBOS_VUS]]), vus = {};
  for (let k = 0; k + 1 < (v || []).length; k += 2) vus[v[k]] = v[k + 1];
  const combos = combosEnPlus(Math.min(6, Math.ceil(n / 3) + 1), vus);
  const { items, bilan } = await chercher(combos, 6, pool.flatMap(x => [x.id, telN(x.telephone)]));
  const garde = items.slice(0, n);
  await ajouterAuPool(garde, "ajout manuel");
  const date = new Date().toISOString().slice(0, 10);
  if (combos.length) await redis(combos.map(c => ["HSET", COMBOS_VUS, c.activite + "|" + c.zone, date]));
  return { ajoutes: garde.length, combos: bilan, ...(await getAppels()) };
}
