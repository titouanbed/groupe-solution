// Notifie Bing, Yandex, Seznam… (protocole IndexNow) des URL nouvelles ou modifiées.
//   node scripts/indexnow.mjs              → toutes les URL du sitemap (après une grosse mise en ligne)
//   node scripts/indexnow.mjs url1 url2 …  → seulement ces URL (ex. les actus du jour)
// À lancer APRÈS le déploiement en production. Google n'utilise pas IndexNow (sitemap + Search Console).
import { readFileSync } from 'node:fs';
const KEY = '5e4a6ecbe11abfcf40a8e1f46445fabb';
const HOST = 'www.groupsolution.fr';
let urls = process.argv.slice(2);
if (!urls.length) urls = [...readFileSync(new URL('../sitemap.xml', import.meta.url), 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
urls = urls.map(u => u.startsWith('http') ? u : 'https://' + HOST + (u.startsWith('/') ? u : '/' + u)).slice(0, 10000);
const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST', headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList: urls })
}).catch(e => ({ ok: false, status: 0, statusText: e.message }));
console.log(res.ok || res.status === 202 ? `✓ IndexNow : ${urls.length} URL transmises (HTTP ${res.status})` : `✗ IndexNow : HTTP ${res.status} ${res.statusText || ''}`);
