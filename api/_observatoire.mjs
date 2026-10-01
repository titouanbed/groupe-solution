// Observatoire du numérique local — compteurs ANONYMES alimentés par les analyses faites dans le chat
// (fiche de l'annuaire officiel + lecture du site) et par les comparaisons Google Maps.
// Rien d'identifiant n'est conservé : seulement des totaux par territoire, par secteur et par métier.
// Chaque entreprise (ou fiche Google) n'est comptée qu'une fois (empreinte non réversible).
// Un chiffre n'est publié qu'à partir d'un échantillon suffisant (SEUIL), sinon la page dit « collecte en cours ».
import { createHash } from "node:crypto";
import { redis, UPSTASH } from "./_guard.mjs";

export const SEUIL = 20;          // entreprises analysées avant de publier un territoire ou un secteur
export const SEUIL_METIER = 12;   // fiches Google avant de publier un métier
const empreinte = s => createHash("sha256").update("gs-obs|" + s).digest("hex").slice(0, 16);

const DEPS = { "34": "Hérault", "30": "Gard", "976": "Mayotte", "974": "La Réunion", "971": "Guadeloupe", "972": "Martinique", "973": "Guyane", "988": "Nouvelle-Calédonie", "987": "Polynésie française" };
export const territoire = (dep, cp) => {
  const d = String(dep || "").trim() || (String(cp || "").startsWith("97") || String(cp || "").startsWith("98") ? String(cp).slice(0, 3) : String(cp || "").slice(0, 2));
  return DEPS[d] || (d ? "Autres départements" : "");
};
const norm = s => String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 50);

// Une analyse du chat : e = fiche annuaire, s = lecture du site (ou null si aucun site trouvé).
export async function obsAnalyse(e, s) {
  if (!UPSTASH || !e?.siren) return;
  const zone = territoire(e.departement, e.code_postal); if (!zone) return;
  try {
    const [neuf] = await redis([["SADD", "obs:vus", empreinte("siren:" + e.siren)]]);
    if (!neuf) return;
    const champs = { n: 1, site: s ? 1 : 0, https: s?.https ? 1 : 0, mobile: s?.mobile ? 1 : 0, contact: s && (s.reservation_ou_devis || s.formulaire) ? 1 : 0, reseaux: s?.reseaux?.length ? 1 : 0, google: s?.description ? 1 : 0, rapide: s && s.temps_ms > 0 && s.temps_ms < 2500 ? 1 : 0 };
    const cles = ["obs:t", "obs:z:" + zone]; if (e.secteur) cles.push("obs:s:" + e.secteur);
    const cmds = [];
    for (const k of cles) for (const [f, v] of Object.entries(champs)) if (v) cmds.push(["HINCRBY", k, f, v]);
    cmds.push(["SADD", "obs:zones", zone]); if (e.secteur) cmds.push(["SADD", "obs:secteurs", e.secteur]);
    await redis(cmds);
  } catch {}
}

// Une comparaison Google : chaque fiche (l'entreprise et ses concurrents) compte une fois par métier.
export async function obsGoogle(metier, fiches) {
  if (!UPSTASH || !metier || !fiches?.length) return;
  const m = String(metier).slice(0, 60), k = "obs:g:" + norm(m);
  try {
    const neufs = await redis(fiches.map(f => ["SADD", "obs:gvus", empreinte("g:" + f.id)]));
    const cmds = [];
    fiches.forEach((f, i) => {
      if (!neufs[i]) return;
      cmds.push(["HINCRBY", k, "n", 1], ["HINCRBY", k, "avis", f.avis || 0]);
      if (f.note != null) cmds.push(["HINCRBY", k, "notes", Math.round(f.note * 10)], ["HINCRBY", k, "nn", 1]);
      if (f.site) cmds.push(["HINCRBY", k, "site", 1]);
    });
    if (cmds.length) await redis([...cmds, ["HSET", k, "nom", m], ["SADD", "obs:metiers", k]]);
  } catch {}
}

const hash = a => { const o = {}; for (let i = 0; i + 1 < (a || []).length; i += 2) o[a[i]] = isNaN(+a[i + 1]) ? a[i + 1] : +a[i + 1]; return o; };
const pct = (x, n) => Math.round(100 * (x || 0) / n);
const indic = h => ({ n: h.n, site: pct(h.site, h.n), https: h.site ? pct(h.https, h.site) : 0, mobile: h.site ? pct(h.mobile, h.site) : 0, contact: h.site ? pct(h.contact, h.site) : 0, reseaux: h.site ? pct(h.reseaux, h.site) : 0, google: h.site ? pct(h.google, h.site) : 0, rapide: h.site ? pct(h.rapide, h.site) : 0 });

export async function obsPublic() {
  if (!UPSTASH) return { n: 0, seuil: SEUIL, zones: [], secteurs: [], metiers: [] };
  const [t, zs, ss, ms] = await redis([["HGETALL", "obs:t"], ["SMEMBERS", "obs:zones"], ["SMEMBERS", "obs:secteurs"], ["SMEMBERS", "obs:metiers"]]);
  const zl = zs || [], sl = ss || [], ml = (ms || []).slice(0, 200);
  const all = await redis([...zl.map(z => ["HGETALL", "obs:z:" + z]), ...sl.map(s => ["HGETALL", "obs:s:" + s]), ...ml.map(m => ["HGETALL", m])].concat([["PING"]]));
  const tot = hash(t), n = tot.n || 0;
  const zones = zl.map((z, i) => ({ nom: z, ...hash(all[i]) })).filter(x => x.n >= SEUIL).map(x => ({ nom: x.nom, ...indic(x) })).sort((a, b) => b.n - a.n);
  const secteurs = sl.map((s, i) => ({ nom: s, ...hash(all[zl.length + i]) })).filter(x => x.n >= SEUIL).map(x => ({ nom: x.nom, ...indic(x) })).sort((a, b) => b.n - a.n);
  const metiers = ml.map((m, i) => hash(all[zl.length + sl.length + i])).filter(x => x.n >= SEUIL_METIER)
    .map(x => ({ nom: x.nom, n: x.n, avis: Math.round(x.avis / x.n), note: x.nn ? Math.round(x.notes / x.nn) / 10 : null, site: pct(x.site, x.n) })).sort((a, b) => b.n - a.n).slice(0, 24);
  return { n, seuil: SEUIL, global: n >= SEUIL ? indic(tot) : null, zones, secteurs, metiers, maj: new Date().toISOString() };
}
