// Parcours visiteur dans un vrai navigateur (téléphone + ordinateur) : aucune erreur JavaScript,
// aucun débordement horizontal, éléments essentiels présents et utilisables. Lancé par l'entretien du matin.
// Usage : node scripts/parcours.mjs [https://www.groupsolution.fr]
const BASE = (process.argv[2] || 'https://www.groupsolution.fr').replace(/\/$/, '');
let pw;
for (const p of ['playwright', '/opt/node22/lib/node_modules/playwright/index.mjs']) { try { pw = await import(p); break; } catch {} }
if (!pw) { console.log('Playwright absent : parcours non vérifié.'); process.exit(0); }
const PAGES = [
  ['/', ['#aiBox', '#aiInput', 'a[href^="tel:"]', '#contact', '#nlForm', '#pourvous', '#faq']],
  ['/realisations.html', ['h1', 'a[href^="tel:"], a[href*="echanger"]']],
  ['/demos/', ['h1']],
  ['/echanger.html', ['h1', 'form, a[href^="tel:"]']],
  ['/services/', ['h1']],
  ['/lab/actus/', ['h1']],
  ['/pourquoi-accessible.html', ['h1']],
  ['/etat.html', ['h1']],
  ['/newsletter.html', ['h1']]
];
const b = await pw.chromium.launch();
const pb = [];
for (const [nom, opts] of [['téléphone', { ...pw.devices['iPhone 13'] }], ['ordinateur', { viewport: { width: 1366, height: 900 } }]]) {
  const ctx = await b.newContext({ ...opts, reducedMotion: 'reduce' });
  for (const [path, sel] of PAGES) {
    const p = await ctx.newPage(), errs = [];
    p.on('pageerror', e => errs.push(e.message));
    p.on('response', r => { if (r.status() >= 400 && r.url().startsWith(BASE) && !/\/api\//.test(r.url())) errs.push(`${r.status()} ${r.url().slice(BASE.length)}`); });
    try {
      const r = await p.goto(BASE + path, { waitUntil: 'load', timeout: 25000 });
      if (!r || r.status() >= 400) { pb.push(`${nom} ${path} : réponse ${r && r.status()}`); await p.close(); continue; }
      await p.waitForTimeout(1200);
      for (const s of sel) if (!(await p.$(s))) pb.push(`${nom} ${path} : élément manquant ${s}`);
      const over = await p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      if (over > 2) pb.push(`${nom} ${path} : la page déborde de ${over}px en largeur`);
      if (path === '/') {
        // Le chat doit rester utilisable : on écrit sans envoyer (aucun appel à l'IA).
        await p.fill('#aiInput', 'Test entretien');
        if ((await p.inputValue('#aiInput')) !== 'Test entretien') pb.push(`${nom} / : impossible d'écrire dans le chat`);
      }
      errs.forEach(e => pb.push(`${nom} ${path} : ${e}`));
    } catch (e) { pb.push(`${nom} ${path} : ${e.message.split('\n')[0]}`); }
    await p.close();
  }
  await ctx.close();
}
await b.close();
if (pb.length) { console.log('✗ Parcours visiteur : ' + pb.length + ' problème(s)\n  · ' + [...new Set(pb)].join('\n  · ')); process.exit(1); }
console.log(`✓ Parcours visiteur : ${PAGES.length} pages × 2 écrans sans erreur.`);
