/* ═══════════════════════════════════════════════════════════
   « Pourquoi c'est plus accessible qu'on ne l'imagine » — /pourquoi-accessible.html
   L'argument clé de Groupe Solution, expliqué honnêtement : aucun prix, aucun chiffre inventé.
   Lancer : node zones/generate-accessible.mjs
   ═══════════════════════════════════════════════════════════ */
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { HOLDING } from './zones.mjs';
import { head, foot } from './generate-actus.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const url = `${HOLDING}/pourquoi-accessible.html`;
const title = 'Logiciel sur-mesure accessible : pourquoi c’est moins cher';
const desc = 'Un logiciel ou une automatisation sur-mesure coûte souvent bien moins qu’on ne l’imagine. Voici pourquoi, concrètement : IA, socle éprouvé, petits pas.';
const RAISONS = [
  ['L’IA écrit, teste et documente avec nous', 'Une grande partie du temps d’un projet logiciel part dans des tâches répétitives : écrire du code standard, les tests, la documentation, les écrans d’administration. Nous faisons ce travail avec l’aide de l’IA, sous contrôle humain à chaque étape. Le temps passé baisse, et c’est ce temps qui fait le prix.'],
  ['Un socle déjà éprouvé en production', 'Nous ne repartons pas de zéro à chaque projet. Nos briques (connexions aux outils, lecture de documents, agents IA, tableaux de bord, sécurité) font déjà tourner nos propres plateformes en ligne. Votre projet réutilise ce qui marche et ne paie que ce qui est vraiment spécifique à votre métier.'],
  ['On commence par l’essentiel', 'Plutôt qu’un gros projet risqué, on démarre par la brique qui vous fait gagner le plus, livrée vite. Vous voyez le résultat, puis vous décidez de la suite. Dans notre assistant, vous composez vous-même votre projet face à votre budget : l’essentiel d’abord, les options ensuite.'],
  ['On part de vos outils', 'Remplacer un logiciel coûte cher et fatigue les équipes. Nous branchons ce que vous utilisez déjà (agenda, comptabilité, logiciel métier, messagerie) et nous automatisons ce qui se fait encore à la main autour. Moins de migration, moins de formation, moins de coûts cachés.'],
  ['Un interlocuteur direct', 'Vous échangez directement avec Titouan, qui conçoit votre solution : pas de chaîne d’intermédiaires entre votre besoin et ce qui est construit. Ce que vous payez sert à construire votre solution.'],
  ['Une infrastructure payée à l’usage', 'Nos solutions tournent sur des hébergements modernes facturés selon l’usage réel, sans serveur à entretenir. Pour une petite entreprise, cela reste souvent très modeste ; les éventuels coûts mensuels sont annoncés clairement dans le devis.']
];
const FAQ = [
  ['Pourquoi un logiciel sur-mesure peut-il coûter moins cher qu’avant ?', 'Parce que l’IA accélère une grande partie du travail (code standard, tests, documentation) et que nous réutilisons un socle déjà éprouvé en production. Le temps de développement baisse, et c’est lui qui fait l’essentiel du prix.'],
  ['Qu’est-ce qui influence le prix d’un projet ?', 'Le nombre de fonctionnalités, les connexions à vos outils existants, le volume de données, le niveau d’exigence (sécurité, disponibilité) et l’accompagnement souhaité. Tout est chiffré sur devis, gratuitement, après un échange.'],
  ['Moins cher, est-ce moins bien ?', 'Non : la qualité vient de la méthode (tests, sécurité, validation humaine, suivi), pas du nombre de jours facturés. L’IA ne remplace pas la conception ni la relecture ; elle supprime le travail répétitif.'],
  ['Comment connaître le coût de mon projet ?', 'Décrivez votre besoin à notre assistant et indiquez votre budget : vous voyez l’envergure de chaque brique et composez votre projet. Titouan vous envoie ensuite un devis détaillé sous 24 h ouvrées, gratuit et sans engagement.'],
  ['Y a-t-il des coûts cachés ?', 'Non. Les éventuels coûts récurrents (hébergement, abonnement IA, maintenance) sont listés dans le devis, avant tout engagement.']
];
const jsonld = { '@context': 'https://schema.org', '@graph': [
  { '@type': 'Article', headline: 'Pourquoi un logiciel sur-mesure est plus accessible qu’on ne l’imagine', description: desc, url, inLanguage: 'fr-FR', author: { '@type': 'Person', name: 'Titouan Bedos', worksFor: { '@id': HOLDING + '/#org' } }, publisher: { '@id': HOLDING + '/#org' }, datePublished: '2026-09-30', dateModified: new Date().toISOString().slice(0, 10) },
  { '@type': 'FAQPage', mainEntity: FAQ.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
  { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Groupe Solution', item: HOLDING + '/' }, { '@type': 'ListItem', position: 2, name: 'Pourquoi c’est accessible', item: url }] }] };
const CSS = `<style>
.acHero{text-align:center;padding:clamp(44px,7vw,88px) 0 10px}.acHero h1{font-size:clamp(34px,5vw,60px);letter-spacing:-.04em;margin:12px auto 12px;max-width:900px}.acHero h1 i{color:var(--acc)}.acHero p{color:var(--secondary);font-size:18px;max-width:640px;margin:0 auto}
.acGrid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:34px}.acCard{background:#fff;border:1px solid var(--line);border-radius:22px;padding:24px}.acCard span{display:grid;place-items:center;width:40px;height:40px;border-radius:50%;background:var(--ink);color:#fff;font:600 17px var(--serif);margin-bottom:14px}.acCard h2{font-size:20px;margin:0 0 8px;line-height:1.25}.acCard p{margin:0;color:var(--secondary);font-size:15px;line-height:1.65}
.acCmp{margin:40px auto 0;max-width:900px;display:grid;grid-template-columns:1fr 1fr;gap:16px}.acCmp div{border-radius:22px;padding:22px}.acCmp .old{background:#F1EFEA}.acCmp .new{background:var(--ink);color:#fff}.acCmp h3{margin:0 0 10px;font-size:17px}.acCmp ul{margin:0;padding-left:18px;line-height:1.8;font-size:15px}.acCmp .new li::marker{color:#FF8FA3}
.acCta{max-width:900px;margin:36px auto 0;text-align:center;background:linear-gradient(135deg,#FFF5F7,#fff);border:1px solid var(--line);border-radius:26px;padding:30px 22px}.acCta h2{margin:0 0 8px;font-size:clamp(24px,3vw,32px)}.acCta p{color:var(--secondary);margin:0 0 16px}
@media(max-width:900px){.acGrid{grid-template-columns:1fr 1fr}}@media(max-width:600px){.acGrid,.acCmp{grid-template-columns:1fr}}
</style>`;
const body = `
  <div class="wrap crumbs"><a href="index.html">Groupe Solution</a> › <span>Pourquoi c’est accessible</span></div>
  <section class="acHero"><div class="wrap">
    <div class="kicker">Transparence</div>
    <h1>Du sur-mesure, <i>bien plus accessible</i> qu’on ne l’imagine.</h1>
    <p>Un logiciel, une automatisation ou un agent IA taillé pour votre entreprise n’est plus réservé aux grands groupes. Voici pourquoi, concrètement.</p>
  </div></section>
  <section class="sec" style="padding-top:0"><div class="wrap">
    <div class="acGrid">
${RAISONS.map(([h, p], i) => `      <article class="acCard reveal"><span>${i + 1}</span><h2>${h}</h2><p>${p}</p></article>`).join('\n')}
    </div>
    <div class="acCmp reveal">
      <div class="old"><h3>La façon classique</h3><ul><li>Cahier des charges de plusieurs semaines</li><li>Tout développé à la main, de zéro</li><li>Un gros projet d’un coup</li><li>On remplace vos outils</li><li>Des intermédiaires entre vous et le projet</li></ul></div>
      <div class="new"><h3>Notre façon</h3><ul><li>Un échange, puis une proposition claire</li><li>L’IA accélère, l’humain conçoit et valide</li><li>L’essentiel d’abord, livré vite</li><li>On branche vos outils existants</li><li>Un interlocuteur direct : Titouan</li></ul></div>
    </div>
    <div class="acCta reveal"><h2>Voyez ce qui tient dans votre budget.</h2><p>Décrivez votre besoin, indiquez votre budget : vous composez votre projet, sans aucun prix affiché. Devis détaillé sous 24 h ouvrées, gratuit.</p><a class="btn" href="index.html#heroAI">Préparer mon devis →</a> <a class="btn ghost" href="demos/" style="margin-left:6px">Voir les démos</a></div>
    <div class="faqH" style="max-width:900px;margin:44px auto 0">
      <h2 style="text-align:center;margin-bottom:14px">Questions fréquentes</h2>
${FAQ.map(([q, a]) => `      <details><summary>${q}</summary><p>${a}</p></details>`).join('\n')}
    </div>
  </div></section>`;
writeFileSync(join(ROOT, 'pourquoi-accessible.html'), head({ title, desc, url, jsonld, pre: '', ogType: 'article' }).replace('</head>', CSS + '</head>') + body + foot('', 'accessible'), 'utf8');
console.log('✓ pourquoi-accessible.html');
