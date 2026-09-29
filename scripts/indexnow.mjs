// Notifie Bing, Yandex, Seznam… (protocole IndexNow) des URL nouvelles ou modifiées.
//   node scripts/indexnow.mjs              → toutes les URL du sitemap (après une grosse mise en ligne)
//   node scripts/indexnow.mjs url1 url2 …  → seulement ces URL (ex. les actus du jour)
//   node scripts/indexnow.mjs --files a.html b/index.html → fichiers du dépôt, filtrés sur le sitemap (utilisé par la GitHub Action)
// À lancer APRÈS le déploiement en production. Google n'utilise pas IndexNow (sitemap + Search Console).
import { readFileSync } from 'node:fs';
const KEY = '5e4a6ecbe11abfcf40a8e1f46445fabb';
const HOST = 'www.groupsolution.fr';
const SITEMAP = [...readFileSync(new URL('../sitemap.xml', import.meta.url), 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
let urls = process.argv.slice(2);
if (urls[0] === '--files') {
  // Fichiers → URL publiques ; on ne garde que les pages indexables (présentes dans le sitemap).
  const inMap = new Set(SITEMAP);
  urls = urls.slice(1).map(f => `https://${HOST}/` + f.replace(/(^|\/)index\.html$/, '$1')).filter(u => inMap.has(u));
  if (!urls.length) { console.log('Aucune page indexable modifiée.'); process.exit(0); }
} else if (!urls.length) urls = SITEMAP;
urls = urls.map(u => u.startsWith('http') ? u : 'https://' + HOST + (u.startsWith('/') ? u : '/' + u)).slice(0, 10000);
const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST', headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList: urls })
}).catch(e => ({ ok: false, status: 0, statusText: e.message }));
if (res.ok || res.status === 202) console.log(`✓ IndexNow : ${urls.length} URL transmises (HTTP ${res.status})`);
else { console.log(`✗ IndexNow : HTTP ${res.status} ${res.statusText || ''}`); process.exitCode = 1; }
