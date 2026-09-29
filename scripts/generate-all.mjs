// Régénère tout le site dans le bon ordre : npm run generate  (ajouter --art pour les illustrations)
// ⚠️ Ne pas renommer en « build » : Vercel exécuterait ce script au déploiement.
import { execSync } from 'node:child_process';
const run = c => { console.log('→ ' + c); execSync(c, { stdio: 'inherit' }); };
const steps = [
  process.argv.includes('--art') && 'node zones/generate-art.mjs',
  'node zones/generate-montpellier.mjs',
  'node zones/generate-montpellier-plus.mjs',
  'node zones/generate-automatisation.mjs',
  'node zones/generate-services.mjs',
  'node zones/generate-guides.mjs',
  'node zones/generate-veille.mjs',
  'node zones/generate-actus.mjs',
  'node zones/generate-editorial.mjs',
  'node zones/generate-outils.mjs',
  'node zones/generate-lab.mjs',
  'node zones/generate-implantations.mjs',
  'git add -A',
  'node zones/generate-plan.mjs',
  'node zones/generate-search-index.mjs',
  'git add -A',
  'node zones/generate-sitemap.mjs'
].filter(Boolean);
steps.forEach(run);
console.log('✓ Site régénéré.');
