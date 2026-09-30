// Contrôle du site en production (lancé par la GitHub Action après chaque mise en ligne).
// N'échoue que si une page clé ou la clé IndexNow est inaccessible ; l'état de l'assistant IA
// et du formulaire (variables Vercel) est affiché pour information.
const SITE = 'https://www.groupsolution.fr';
let fail = 0;
const get = async (path, want) => {
  const r = await fetch(SITE + path, { redirect: 'follow' }).catch(e => ({ ok: false, status: 0, text: async () => e.message }));
  const t = r.ok ? await r.text() : '';
  const ok = r.ok && (!want || t.includes(want));
  if (!ok) fail++;
  console.log(`${ok ? '✓' : '✗'} ${path} (HTTP ${r.status})`);
};
await get('/', 'Groupe Solution');
await get('/services/', 'services');
await get('/automatisation/', 'Automatisation');
await get('/montpellier/site-internet-montpellier.html');
await get('/sitemap.xml', '<urlset');
await get('/5e4a6ecbe11abfcf40a8e1f46445fabb.txt', '5e4a6ecbe11abfcf40a8e1f46445fabb');

const post = async (path, body) => {
  const r = await fetch(SITE + path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).catch(() => null);
  return r ? { s: r.status, j: await r.json().catch(() => ({})) } : { s: 0, j: {} };
};
// Assistant : 503 = ANTHROPIC_API_KEY absente (mode gratuit local actif), 200 = IA active.
const a = await post('/api/assistant', { q: 'Bonjour, que faites-vous ?' });
console.log(a.s === 200 ? '✓ Assistant IA actif (ANTHROPIC_API_KEY OK)' : a.s === 503 ? 'ℹ️ Assistant IA : ANTHROPIC_API_KEY absente ou invalide → mode recherche gratuit' : `⚠️ Assistant IA : HTTP ${a.s} ${JSON.stringify(a.j)}`);
// Formulaire : le pot de miel répond 200 sans envoyer d'e-mail si Brevo est configuré ; 503 sinon.
const l = await post('/api/lead', { _gotcha: 'controle-automatique' });
console.log(l.s === 200 ? '✓ Formulaires via Brevo configurés (BREVO_API_KEY + LEAD_FROM)' : l.s === 503 ? 'ℹ️ Formulaires : BREVO_API_KEY ou LEAD_FROM manquante → repli Formspree (50 demandes/mois)' : `⚠️ Formulaires : HTTP ${l.s}`);
// Votes « Le pouls » : 200 = base Upstash connectée, 503 = pas encore connectée (widget masqué).
const v = await fetch(SITE + '/api/vote?ids=actu-controle-auto').then(r => r.status).catch(() => 0);
console.log(v === 200 ? '✓ Votes « Le pouls » actifs (base Upstash connectée)' : v === 503 ? 'ℹ️ Votes : base Upstash non connectée → widget masqué' : `⚠️ Votes : HTTP ${v}`);
if (fail) { console.log(`✗ ${fail} contrôle(s) en échec`); process.exit(1); }
