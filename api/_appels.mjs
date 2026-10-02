// « Appels du jour » (fichier « _ » : pas une route) — chaque matin, une courte liste de numéros à appeler en priorité.
// Rotation quotidienne activité × zone : une recherche à Mayotte, deux dans la métropole de Montpellier (réglable).
// Ne garde que les bons prospects pour un premier appel : un numéro, pas de site (ou une simple page Facebook, ou un
// site ancien), une petite structure indépendante (jamais une filiale de groupe), jamais déjà proposée ni déjà suivie.
// Coût maîtrisé : recherche ciblée en mode léger (2 appels Google par combinaison, plafonds de _places.mjs respectés).
import { redis } from "./_guard.mjs";
import { runCible, getCible, cleNom } from "./_cible.mjs";

const ACTIVITES = ["restaurant", "coiffeur", "garage automobile", "plombier", "électricien", "institut de beauté", "maçon", "menuisier", "peintre en bâtiment", "climatisation",
  "paysagiste", "boulangerie", "traiteur", "auto-école", "location de voiture", "serrurier", "carreleur", "couvreur", "nettoyage", "snack", "barbier", "carrosserie", "pressing", "fleuriste"];
// Activités nombreuses partout (pour les petites communes, où un métier rare donnerait une liste vide).
const FORTES = ["restaurant", "coiffeur", "garage automobile", "plombier", "électricien", "institut de beauté", "boulangerie", "snack", "maçon", "paysagiste"];
const MONTPELLIER = ["Lattes", "Castelnau-le-Lez", "Pérols", "Saint-Jean-de-Védas", "Juvignac", "Mauguio", "Grabels", "Clapiers", "Jacou", "Le Crès", "Villeneuve-lès-Maguelone", "Fabrègues", "Saint-Clément-de-Rivière"];
const liste = (v, d) => { const l = String(v || "").split(",").map(x => x.trim()).filter(Boolean); return l.length ? l : d; };
const s = (v, n) => String(v ?? "").trim().slice(0, n);
const jourN = (t = Date.now()) => Math.floor(t / 864e5);
const VU_JOURS = 90;

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

export async function runAppelsDuJour({ force = false, parCombo = 4 } = {}) {
  const date = new Date().toISOString().slice(0, 10), cle = "appels:jour:" + date;
  if (!force) { const [v] = await redis([["GET", cle]]); if (v) { try { return { ...JSON.parse(v), cache: true }; } catch {} } }
  const combos = combosDuJour(), bilan = [];
  // Relance le même jour : on garde les numéros déjà proposés ce matin et on n'ajoute que des nouveaux.
  const [prev] = await redis([["GET", cle]]); let items = []; try { items = prev ? JSON.parse(prev).items || [] : []; } catch {}
  const deja = new Set(items.flatMap(x => [x.id, x.telephone.replace(/\D/g, "")]));
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
    const sel = selection(full, vus).filter(x => { const t = x.telephone.replace(/\D/g, ""); if (deja.has(x.id) || deja.has(t)) return false; deja.add(x.id); deja.add(t); return true; })
      .slice(0, parCombo).map(x => ({ ...x, cibleId: full.id, activite: c.activite, zone: c.zone }));
    items.push(...sel);
    bilan.push({ ...c, cibleId: full.id, trouves: full.stats?.trouves ?? (full.fiches || []).length, retenus: sel.length });
  }
  items.sort((a, b) => b.score - a.score);
  const out = { date, combos: bilan, items };
  const cmds = [["SET", cle, JSON.stringify(out), "EX", 30 * 86400], ["SET", "appels:dernier", date]];
  for (const x of items) cmds.push(["SET", "appels:vu:" + x.id, date, "EX", VU_JOURS * 86400]);
  await redis(cmds);
  return out;
}

// Dernière liste (aujourd'hui, sinon la plus récente), avec l'état de suivi à jour de chaque établissement.
export async function getAppels(date) {
  if (!date) { const [d] = await redis([["GET", "appels:dernier"]]); date = d || new Date().toISOString().slice(0, 10); }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  const [v] = await redis([["GET", "appels:jour:" + date]]); if (!v) return { date, items: [], combos: [] };
  const r = JSON.parse(v);
  const cibles = {};
  for (const id of new Set(r.items.map(x => x.cibleId))) cibles[id] = await getCible(id).catch(() => null);
  r.items.forEach(x => { const sv = cibles[x.cibleId]?.suivi?.[cleNom(x.nom)]; if (sv) x.suivi = sv; });
  return r;
}
