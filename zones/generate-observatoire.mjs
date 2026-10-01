/* ═══════════════════════════════════════════════════════════
   « Observatoire du numérique local » — /observatoire.html : part des entreprises qui ont un site,
   adapté au téléphone, avec prise de contact en ligne… par territoire et par secteur, plus les avis Google
   par métier. Chiffres anonymes, mis à jour en continu par /api/observatoire (voir api/_observatoire.mjs).
   Lancer : node zones/generate-observatoire.mjs
   ═══════════════════════════════════════════════════════════ */
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { HOLDING } from './zones.mjs';
import { head, foot } from './generate-actus.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const url = `${HOLDING}/observatoire.html`;
const title = 'Observatoire du numérique des entreprises locales';
const desc = 'Combien d’entreprises de l’Hérault, du Gard, de Mayotte et d’outre-mer ont un site adapté au téléphone, un contact en ligne, des avis Google ? Chiffres anonymes, mis à jour en continu.';
const FAQ = [
  ['D’où viennent ces chiffres ?', 'Des analyses gratuites lancées par les entreprises elles-mêmes dans l’assistant de groupsolution.fr : fiche de l’annuaire officiel des entreprises, lecture de la page d’accueil de leur site, et fiches publiques Google Maps quand une comparaison est demandée. Seuls des totaux sont conservés.'],
  ['Les chiffres sont-ils représentatifs ?', 'Non, et nous le disons : l’échantillon est composé des entreprises qui ont choisi de se faire analyser, pas d’un tirage au hasard. Les tendances restent parlantes, mais ce n’est pas un sondage statistique.'],
  ['Mon entreprise est-elle identifiable ?', 'Non. Aucun nom, aucune adresse, aucun numéro n’est conservé pour l’observatoire : seulement des compteurs par territoire, par grand secteur et par métier. Un chiffre n’est publié qu’à partir de vingt entreprises.'],
  ['Comment faire analyser mon entreprise ?', 'Écrivez le nom de votre entreprise et sa ville dans l’assistant de la page d’accueil : l’analyse prend une trentaine de secondes, elle est gratuite et sans inscription.']
];
const jsonld = { '@context': 'https://schema.org', '@graph': [
  { '@type': 'WebPage', name: title, description: desc, url, inLanguage: 'fr-FR', publisher: { '@id': HOLDING + '/#org' }, about: ['Transformation numérique', 'Petites entreprises', 'Hérault', 'Gard', 'Mayotte', 'Outre-mer'] },
  { '@type': 'FAQPage', mainEntity: FAQ.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
  { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Groupe Solution', item: HOLDING + '/' }, { '@type': 'ListItem', position: 2, name: 'Observatoire', item: url }] }
] };
const CSS = `<style>
.obH{text-align:center;padding:clamp(44px,7vw,88px) 0 6px}.obH h1{font-size:clamp(34px,5.2vw,60px);letter-spacing:-.04em;margin:12px auto;max-width:900px}.obH p{color:var(--secondary);font-size:17.5px;max-width:640px;margin:0 auto}
.obLive{display:inline-flex;align-items:center;gap:8px;font:700 13px var(--sans);color:var(--secondary)}.obLive::before{content:"";width:8px;height:8px;border-radius:50%;background:#1F7A4C;box-shadow:0 0 0 4px rgba(31,122,76,.15)}
.obBig{display:flex;justify-content:center;align-items:baseline;gap:12px;margin:30px 0 4px}.obBig b{font:500 clamp(54px,9vw,96px)/1 var(--serif);letter-spacing:-.05em}.obBig span{color:var(--secondary);font-size:16px;max-width:200px;text-align:left;line-height:1.4}
.obWrap{max-width:860px;margin:0 auto}
.obGrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:14px;margin-top:26px}
.obCard{background:#fff;border:1px solid var(--line);border-radius:18px;padding:18px 20px}.obCard small{display:block;font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--muted)}.obCard b{display:block;font:500 42px/1.1 var(--serif);letter-spacing:-.04em;margin:8px 0 4px}.obCard p{margin:0;font-size:14px;color:var(--secondary);line-height:1.5}
.obBar{height:6px;border-radius:99px;background:var(--line);margin-top:12px;overflow:hidden}.obBar i{display:block;height:100%;border-radius:99px;background:var(--ink)}
.obTab{width:100%;border-collapse:collapse;margin-top:16px;font-size:15px}.obTab th,.obTab td{padding:12px 10px;border-bottom:1px solid var(--line);text-align:right}.obTab th:first-child,.obTab td:first-child{text-align:left}.obTab thead th{font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:var(--muted);font-weight:800}
.obSec{margin-top:54px}.obSec h2{font-size:clamp(26px,3.4vw,36px);margin:0 0 6px;letter-spacing:-.03em}.obSec>p{color:var(--secondary);margin:0}
.obWait{margin-top:26px;border:1.5px dashed var(--line2);border-radius:18px;padding:22px;text-align:center;color:var(--secondary)}.obWait b{color:var(--ink)}
.obCta{margin-top:54px;background:var(--ink);color:#fff;border-radius:24px;padding:clamp(24px,4vw,40px);text-align:center}.obCta h2{color:#fff;font-size:clamp(24px,3.2vw,34px);margin:0 0 8px}.obCta p{color:#CFCBC1;margin:0 auto 18px;max-width:520px}.obCta a{display:inline-flex;align-items:center;min-height:48px;padding:0 22px;border-radius:999px;background:#E61E4D;color:#fff;font-weight:800;text-decoration:none}
.obMeth{margin-top:54px}.obMeth h2{font-size:clamp(24px,3vw,32px);margin:0 0 12px}.obMeth li{margin:0 0 8px;color:var(--secondary);line-height:1.65}
.obFaq{margin-top:44px}.obFaq details{border-top:1px solid var(--line);padding:14px 0}.obFaq summary{cursor:pointer;font-weight:700}.obFaq p{color:var(--secondary);margin:8px 0 0;line-height:1.65}
@media(max-width:640px){.obTab{font-size:13.5px}.obTab th,.obTab td{padding:10px 6px}.obTab .hm{display:none}.obCard b{font-size:36px}.obBig span{font-size:14px}}
</style>`;
const IND = [['site', 'ont un site internet trouvé', 'Entreprises pour lesquelles un site officiel a été trouvé et lu.'], ['mobile', 'des sites sont adaptés au téléphone', 'Le site déclare un affichage pensé pour le mobile.'], ['contact', 'des sites permettent de prendre contact', 'Formulaire, demande de devis, réservation ou rendez-vous en ligne.'], ['https', 'des sites sont sécurisés', 'Connexion chiffrée (cadenas HTTPS).'], ['google', 'des sites ont une description pour Google', 'Le texte qui s’affiche sous le titre dans les résultats de recherche.'], ['reseaux', 'des sites renvoient vers les réseaux sociaux', 'Lien vers Facebook, Instagram, LinkedIn, TikTok…'], ['rapide', 'des sites s’affichent en moins de 2,5 s', 'Temps de réponse de la page d’accueil mesuré lors de l’analyse.']];
const body = `
  <div class="wrap crumbs"><a href="index.html">Groupe Solution</a> › <span>Observatoire</span></div>
  <section class="obH"><div class="wrap"><span class="obLive">Mis à jour en continu</span><h1>Observatoire du numérique des entreprises locales</h1><p>Site, téléphone, contact en ligne, avis Google : où en sont vraiment les entreprises de l’Hérault, du Gard, de Mayotte et d’outre-mer ? Les chiffres se construisent à partir des analyses gratuites faites sur ce site, sans jamais garder de nom.</p>
    <div class="obBig"><b id="obN">…</b><span>entreprises analysées à ce jour</span></div></div></section>
  <section class="sec" style="padding-top:0"><div class="wrap obWrap">
    <div id="obGlobal"></div>
    <div class="obSec"><h2>Par territoire</h2><p>Un territoire apparaît dès que vingt entreprises y ont été analysées.</p><div id="obZones"></div></div>
    <div class="obSec"><h2>Par secteur d’activité</h2><p>Grands secteurs de l’annuaire officiel des entreprises.</p><div id="obSect"></div></div>
    <div class="obSec"><h2>Avis Google par métier</h2><p>Moyennes calculées sur les fiches publiques Google Maps relevées lors des comparaisons entre concurrents.</p><div id="obMet"></div></div>
    <div class="obCta"><h2>Et votre entreprise, où se situe-t-elle ?</h2><p>Écrivez son nom et sa ville : en 30 secondes, vous voyez son site, sa fiche et ses 3 concurrents les plus proches. Gratuit, sans inscription.</p><a href="/#heroAI">Analyser mon entreprise</a></div>
    <div class="obMeth"><h2>Méthode</h2><ul>
      <li><b>Source</b> : l’annuaire officiel des entreprises (recherche-entreprises.api.gouv.fr), la lecture automatique de la page d’accueil du site officiel, et les fiches publiques Google Maps lors des comparaisons.</li>
      <li><b>Échantillon</b> : les entreprises qui ont lancé elles-mêmes une analyse sur groupsolution.fr. Chacune n’est comptée qu’une fois, à sa première analyse. Ce n’est pas un sondage représentatif.</li>
      <li><b>Anonymat</b> : seuls des totaux sont conservés (par territoire, grand secteur, métier). Un chiffre n’est publié qu’à partir de vingt entreprises (douze fiches pour un métier).</li>
      <li><b>Lecture</b> : « site internet trouvé » signifie qu’un site officiel a été identifié et lu ; une entreprise peut avoir un site que l’analyse n’a pas trouvé. Les autres pourcentages portent sur les entreprises qui ont un site.</li>
    </ul></div>
    <div class="obFaq"><h2 style="font-size:clamp(24px,3vw,32px);margin:0 0 6px">Questions fréquentes</h2>${FAQ.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join('')}</div>
  </div></section>
  <script>(function(){
    var IND=${JSON.stringify(IND)};
    function esc(t){return String(t==null?'':t).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
    function nb(n){return Number(n||0).toLocaleString('fr-FR');}
    function wait(n,s){return '<div class="obWait"><b>Collecte en cours</b> · '+(n?nb(n)+' entreprise'+(n>1?'s':'')+' analysée'+(n>1?'s':'')+' pour l’instant. ':'')+'Les premiers chiffres s’afficheront dès '+s+'.</div>';}
    function tab(rows,first){if(!rows.length)return '';return '<table class="obTab"><thead><tr><th>'+first+'</th><th class="hm">Analysées</th><th>Ont un site</th><th>Mobile</th><th>Contact en ligne</th></tr></thead><tbody>'+rows.map(function(r){return '<tr><td>'+esc(r.nom)+'</td><td class="hm">'+nb(r.n)+'</td><td>'+r.site+' %</td><td>'+r.mobile+' %</td><td>'+r.contact+' %</td></tr>';}).join('')+'</tbody></table>';}
    fetch('/api/observatoire').then(function(r){return r.ok?r.json():null;}).then(function(d){
      if(!d)throw 0; document.getElementById('obN').textContent=nb(d.n);
      var g=document.getElementById('obGlobal');
      g.innerHTML=d.global?'<div class="obGrid">'+IND.map(function(x){var v=d.global[x[0]];return '<div class="obCard"><small>'+(x[0]==='site'?'Sur '+nb(d.n)+' entreprises':'Parmi celles qui ont un site')+'</small><b>'+v+' %</b><p><strong>'+x[1]+'</strong>. '+x[2]+'</p><div class="obBar"><i style="width:'+v+'%"></i></div></div>';}).join('')+'</div>':wait(d.n,d.seuil+' entreprises analysées');
      document.getElementById('obZones').innerHTML=d.zones.length?tab(d.zones,'Territoire'):wait(0,d.seuil+' entreprises analysées sur un même territoire');
      document.getElementById('obSect').innerHTML=d.secteurs.length?tab(d.secteurs,'Secteur'):wait(0,d.seuil+' entreprises analysées dans un même secteur');
      document.getElementById('obMet').innerHTML=d.metiers.length?'<table class="obTab"><thead><tr><th>Métier</th><th class="hm">Fiches</th><th>Avis en moyenne</th><th>Note</th><th>Avec site</th></tr></thead><tbody>'+d.metiers.map(function(m){return '<tr><td>'+esc(m.nom)+'</td><td class="hm">'+nb(m.n)+'</td><td>'+nb(m.avis)+'</td><td>'+(m.note==null?'–':String(m.note).replace('.',',')+' ★')+'</td><td>'+m.site+' %</td></tr>';}).join('')+'</tbody></table>':wait(0,'12 fiches Google relevées pour un même métier');
    }).catch(function(){document.getElementById('obN').textContent='–';document.getElementById('obGlobal').innerHTML='<div class="obWait">Chiffres momentanément indisponibles.</div>';});
  })();</script>`;
writeFileSync(join(ROOT, 'observatoire.html'), head({ title, desc, url, jsonld, pre: '', ogType: 'website' }).replace('</head>', CSS + '</head>') + body + foot('', 'observatoire'), 'utf8');
console.log('✓ observatoire.html');
