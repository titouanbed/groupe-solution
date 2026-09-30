/* ═══════════════════════════════════════════════════════════
   « État du site » — /etat.html : le résultat public de l'entretien automatique de chaque nuit
   (pages, formulaires et e-mails, assistant, publications, tâches automatiques), sans détail technique.
   Lancer : node zones/generate-etat.mjs
   ═══════════════════════════════════════════════════════════ */
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { HOLDING } from './zones.mjs';
import { head, foot } from './generate-actus.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const url = `${HOLDING}/etat.html`;
const title = 'État du site : vérifié automatiquement chaque nuit';
const desc = 'Chaque nuit, groupsolution.fr vérifie ses pages, ses formulaires, ses e-mails, son assistant et ses publications, corrige ce qui peut l’être et affiche ici le résultat.';
const jsonld = { '@context': 'https://schema.org', '@type': 'WebPage', name: 'État du site', description: desc, url, inLanguage: 'fr-FR', publisher: { '@id': HOLDING + '/#org' } };
const CSS = `<style>
.etH{text-align:center;padding:clamp(44px,7vw,88px) 0 10px}.etH h1{font-size:clamp(34px,5vw,58px);letter-spacing:-.04em;margin:12px auto}.etH p{color:var(--secondary);font-size:17px;max-width:620px;margin:0 auto}
.etBox{max-width:760px;margin:34px auto 0;border-top:1px solid var(--line2)}.etRow{display:flex;justify-content:space-between;align-items:center;gap:14px;padding:18px 2px;border-bottom:1px solid var(--line2);font:500 19px var(--serif)}
.etSt{display:inline-flex;align-items:center;gap:8px;font:700 14px var(--sans)}.etSt::before{content:"";width:9px;height:9px;border-radius:50%;background:#1F7A4C}.etSt.wa::before{background:#B7791F}.etSt.ko::before{background:#E61E4D}
.etMaj{max-width:760px;margin:16px auto 0;color:var(--muted);font-size:14px;text-align:center}
.etHow{max-width:760px;margin:48px auto 0}.etHow h2{font-size:clamp(24px,3vw,32px);margin:0 0 12px}.etHow li{margin:0 0 8px;color:var(--secondary);line-height:1.65}
</style>`;
const body = `
  <div class="wrap crumbs"><a href="index.html">Groupe Solution</a> › <span>État du site</span></div>
  <section class="etH"><div class="wrap"><div class="kicker">Entretien automatique</div><h1>État du site</h1><p>Chaque nuit, le site se vérifie lui-même, répare ce qui peut l’être et nous alerte pour le reste. Voici le dernier résultat.</p></div></section>
  <section class="sec" style="padding-top:0"><div class="wrap">
    <div class="etBox" id="etBox"><div class="etRow"><span>Chargement…</span></div></div>
    <p class="etMaj" id="etMaj"></p>
    <div class="etHow">
      <h2>Ce qui est vérifié</h2>
      <ul>
        <li><b>Site</b> : les pages clés et un échantillon tiré au hasard dans le plan du site répondent et ont leurs balises.</li>
        <li><b>E-mails</b> : la configuration d’envoi est valide ; les confirmations bloquées sont renvoyées automatiquement. Vos demandes sont enregistrées avant tout envoi : aucune n’est perdue.</li>
        <li><b>Publication</b> : les actus du jour sont bien publiées.</li>
        <li><b>Services</b> : l’assistant IA et les registres publics qu’il consulte sont joignables.</li>
        <li><b>Automatismes</b> : les tâches planifiées (veille des nouvelles entreprises, newsletter du lundi) se sont exécutées.</li>
      </ul>
      <p style="margin-top:18px">Chaque semaine, un contrôle qualité complet parcourt aussi toutes les pages (liens, données structurées, questions fréquentes). Une anomalie ? Écrivez à <a href="mailto:contact@groupsolution.fr">contact@groupsolution.fr</a>.</p>
    </div>
  </div></section>
  <script>(function(){var L={ok:'Opérationnel',wa:'À surveiller',ko:'Incident en cours'};fetch('/api/devis?etat=1').then(function(r){return r.ok?r.json():null;}).then(function(j){var b=document.getElementById('etBox');if(!j||!j.groupes||!j.groupes.length){b.innerHTML='<div class="etRow"><span>Premier contrôle à venir</span><span class="etSt wa">En attente</span></div>';return;}b.innerHTML=j.groupes.map(function(g){return '<div class="etRow"><span>'+g.nom+'</span><span class="etSt '+g.niveau+'">'+L[g.niveau]+'</span></div>';}).join('');document.getElementById('etMaj').textContent='Dernière vérification : '+new Date(j.maj).toLocaleString('fr-FR',{dateStyle:'long',timeStyle:'short'});}).catch(function(){document.getElementById('etBox').innerHTML='<div class="etRow"><span>État indisponible pour le moment</span></div>';});})();</script>`;
writeFileSync(join(ROOT, 'etat.html'), head({ title, desc, url, jsonld, pre: '', ogType: 'website' }).replace('</head>', CSS + '</head>') + body + foot('', 'etat'), 'utf8');
console.log('✓ etat.html');
