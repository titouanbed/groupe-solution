/* ═══════════════════════════════════════════════════════════
   Groupe Solution — logique des composants de contact partagés
   (RDV Google Calendar, diagnostic scripté, CTA multiples)
   ═══════════════════════════════════════════════════════════ */

/* ── Prise de rendez-vous : réel (Vercel Function) ou démonstration (local / non configuré) ── */
(function(){
  const $ = id => document.getElementById(id);
  const els = {
    notice:$('bkNotice'), dayList:$('bkDayList'), timeList:$('bkTimeList'), recap:$('bkRecap'),
    form:$('bkForm'), name:$('bkName'), email:$('bkEmail'), topic:$('bkTopic'), submit:$('bkSubmit'),
    msg:$('bkMsg'), panel:document.querySelector('.bookingPanel')
  };
  if(!els.form) return;
  const state = { demo:false, days:[], day:null, slot:null };
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const msg = (t, cls) => { els.msg.textContent = t; els.msg.className = 'bkMsg' + (cls ? ' ' + cls : ''); };

  function demoSlots(){
    const out = [], times = ['09:00','10:00','11:00','14:00','15:00','16:00'], now = new Date();
    let added = 0;
    for(let d=1; d<=12 && added<5; d++){
      const day = new Date(now); day.setDate(now.getDate()+d);
      const wd = day.getDay(); if(wd===0||wd===6) continue;
      added++;
      const dayKey = day.toISOString().slice(0,10);
      const dayLabel = cap(day.toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long'}));
      times.forEach(t=>{ const [h,m]=t.split(':').map(Number); const s=new Date(day); s.setHours(h,m,0,0);
        out.push({ start:s.toISOString(), dayKey, dayLabel, time:t }); });
    }
    return out;
  }

  async function load(){
    try{
      const r = await fetch('/api/availability', { headers:{ Accept:'application/json' } });
      if(r.ok){ const d = await r.json();
        if(d.configured) return { demo:false, slots:d.slots||[] };
        return { demo:true, slots:demoSlots() };
      }
    }catch(_){}
    return { demo:true, slots:demoSlots() };
  }

  function group(slots){
    const map = new Map();
    slots.forEach(s=>{ if(!map.has(s.dayKey)) map.set(s.dayKey,{ dayKey:s.dayKey, dayLabel:s.dayLabel, slots:[] }); map.get(s.dayKey).slots.push(s); });
    return [...map.values()];
  }

  function renderDays(){
    els.dayList.innerHTML = '';
    state.days.forEach(day=>{
      const b = document.createElement('button'); b.type='button'; b.className='bkDay';
      b.setAttribute('aria-selected', state.day===day ? 'true':'false');
      const n = day.slots.length;
      b.innerHTML = `<span class="d">${day.dayLabel}</span><span class="c">${n} créneau${n>1?'x':''}</span>`;
      b.addEventListener('click', ()=>selectDay(day));
      els.dayList.appendChild(b);
    });
  }
  function renderTimes(){
    els.timeList.innerHTML = '';
    if(!state.day){ els.timeList.innerHTML = '<p class="bkHint">Sélectionnez d’abord une date.</p>'; return; }
    state.day.slots.forEach(s=>{
      const b = document.createElement('button'); b.type='button'; b.className='bkTime';
      b.setAttribute('aria-selected', state.slot===s ? 'true':'false');
      b.textContent = s.time;
      b.addEventListener('click', ()=>selectSlot(s));
      els.timeList.appendChild(b);
    });
  }
  function selectDay(day){ state.day = day; state.slot = null; renderDays(); renderTimes(); updateRecap(); }
  function selectSlot(s){ state.slot = s; renderTimes(); updateRecap(); }
  function updateRecap(){
    if(state.slot){ els.recap.hidden=false; els.recap.innerHTML = `<span>Créneau choisi</span><b>${state.day.dayLabel} · ${state.slot.time}</b>`; }
    else els.recap.hidden = true;
    els.submit.disabled = !state.slot;
  }

  function confirmView(data){
    const d = new Date(data.start);
    const when = cap(d.toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long'})) + ' à ' +
      d.toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'});
    els.panel.innerHTML = `<div class="bkConfirm"><div class="ic">✓</div><h3>C’est noté.</h3>` +
      `<p>Votre rendez-vous de 30 minutes est confirmé. L’invitation arrive par email` +
      `${data.meetLink ? ', avec le lien de visioconférence' : ''}.</p><div class="det">${when}</div></div>`;
  }

  els.form.addEventListener('submit', async e=>{
    e.preventDefault();
    const name = els.name.value.trim(), email = els.email.value.trim(), topic = els.topic.value.trim();
    if(!state.slot){ msg('Choisissez un créneau.', 'err'); return; }
    if(name.length < 2){ msg('Indiquez votre nom.', 'err'); els.name.focus(); return; }
    if(!EMAIL.test(email)){ msg('Adresse email invalide.', 'err'); els.email.focus(); return; }
    if(state.demo){ msg('Démonstration : aucun rendez-vous réel n’est créé tant que Google Calendar n’est pas connecté.', 'err'); return; }
    els.submit.disabled = true; els.submit.textContent = 'Confirmation…'; msg('', '');
    try{
      const r = await fetch('/api/book', { method:'POST', headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify({ start:state.slot.start, name, email, topic }) });
      const data = await r.json().catch(()=>({}));
      if(r.ok && data.ok){ confirmView(data); return; }
      if(r.status === 409){ msg('Ce créneau vient d’être pris. Choisissez-en un autre.', 'err'); init(); }
      else msg('Un problème est survenu. Réessayez, ou écrivez-nous à contact@groupe-solution.example.', 'err');
    }catch(_){ msg('Connexion impossible. Réessayez dans un instant.', 'err'); }
    finally{ els.submit.disabled = false; els.submit.textContent = 'Confirmer le rendez-vous'; }
  });

  async function init(){
    const { demo, slots } = await load();
    state.demo = demo; state.day = null; state.slot = null;
    if(demo){ els.notice.hidden = false;
      els.notice.innerHTML = '<b>Démonstration avec données fictives.</b> Les créneaux ci-dessous sont des exemples — la prise de rendez-vous réelle s’activera une fois Google Calendar connecté.'; }
    else els.notice.hidden = true;
    state.days = group(slots);
    if(!state.days.length){
      els.dayList.innerHTML = '<div class="bkLoading">Aucun créneau disponible pour le moment.<br>Écrivez-nous à contact@groupe-solution.example.</div>';
      els.timeList.innerHTML = ''; return;
    }
    renderDays(); selectDay(state.days[0]);
  }

  const section = document.getElementById('rendez-vous');
  if('IntersectionObserver' in window && section){
    const io = new IntersectionObserver((entries, obs)=>{
      entries.forEach(e=>{ if(e.isIntersecting){ obs.disconnect(); init(); } });
    }, { rootMargin: '400px 0px' });
    io.observe(section);
  } else { init(); }
})();

/* ── Diagnostic scripté : questionnaire étape par étape, conclusion prudente (pas d'IA, pas de chiffres inventés) ── */
(function(){
  const inner = document.getElementById('diagInner');
  const bar = document.getElementById('diagProgress');
  if(!inner) return;

  const Q = [
    { key:'secteur', q:'Quel est votre secteur ?', type:'text', ph:'Ex : travaux, assurance, formation…' },
    { key:'volume',  q:'Quel volume de dossiers traitez-vous ?', type:'opt',
      options:['Quelques dizaines par mois','Des centaines par mois','Des milliers par mois','Cela varie fortement'] },
    { key:'etape',   q:'Quelle étape vous prend le plus de temps ?', type:'opt',
      options:['Qualifier les demandes','Chercher / sourcer','Relancer','Mettre en forme les dossiers','Trier et prioriser'] },
    { key:'remu',    q:'Comment êtes-vous rémunéré ?', type:'opt',
      options:['Au dossier traité','À la commission','À l’abonnement','Au forfait','À la performance'] },
    { key:'double',  q:'Que se passerait-il si vous traitiez deux fois plus de dossiers ?', type:'opt',
      options:['Il faudrait embaucher','Je ne pourrais pas suivre','Je refuserais des demandes','Ce serait ingérable à la main'] },
  ];
  const ETAPE = {
    'Qualifier les demandes':'la qualification',
    'Chercher / sourcer':'la recherche',
    'Relancer':'les relances',
    'Mettre en forme les dossiers':'la mise en forme des dossiers',
    'Trier et prioriser':'le tri et la priorisation',
  };
  const esc = s => String(s==null?'':s).replace(/[<>&]/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;'}[c]));
  const answers = {}; let i = 0;
  const canNext = q => q.type==='text' ? !!(answers[q.key]||'').trim() : !!answers[q.key];

  function render(){
    if(i >= Q.length) return renderResult();
    const q = Q[i];
    bar.style.width = (i / Q.length * 100) + '%';
    const body = q.type==='text'
      ? `<input class="diagInput" id="diagText" placeholder="${esc(q.ph)}" autocomplete="off">`
      : `<div class="diagOptions">` + q.options.map(o =>
          `<button type="button" class="diagOpt" data-val="${esc(o)}" aria-selected="${answers[q.key]===o?'true':'false'}">${esc(o)}</button>`).join('') + `</div>`;
    inner.innerHTML =
      `<div class="diagStep">Question ${i+1} / ${Q.length}</div>` +
      `<h3 class="diagQ">${esc(q.q)}</h3>` + body +
      `<div class="diagNav"><button type="button" class="diagBack" id="diagBack" ${i===0?'disabled':''}>← Retour</button>` +
      `<button type="button" class="btn diagNext" id="diagNext" ${canNext(q)?'':'disabled'}>${i===Q.length-1?'Voir le diagnostic':'Continuer'}</button></div>`;
    wire(q);
  }

  function wire(q){
    const next = document.getElementById('diagNext'), back = document.getElementById('diagBack');
    if(q.type==='text'){
      const inp = document.getElementById('diagText');
      inp.value = answers[q.key] || '';
      inp.addEventListener('input', ()=>{ answers[q.key] = inp.value; next.disabled = !canNext(q); });
      inp.addEventListener('keydown', e=>{ if(e.key==='Enter' && canNext(q)){ e.preventDefault(); i++; render(); } });
      setTimeout(()=>inp.focus(), 30);
    } else {
      inner.querySelectorAll('.diagOpt').forEach(b => b.addEventListener('click', ()=>{
        answers[q.key] = b.dataset.val;
        inner.querySelectorAll('.diagOpt').forEach(x => x.setAttribute('aria-selected', x===b?'true':'false'));
        next.disabled = false;
      }));
    }
    next.addEventListener('click', ()=>{ if(canNext(q)){ i++; render(); } });
    back.addEventListener('click', ()=>{ if(i>0){ i--; render(); } });
  }

  function renderResult(){
    bar.style.width = '100%';
    const sec = (answers.secteur||'votre activité').trim();
    const etape = ETAPE[answers.etape] || 'la qualification';
    const axes = [...new Set([etape, 'le rapprochement', 'les relances'])];
    const focus = axes.length > 1 ? axes.slice(0,-1).join(', ') + ' et ' + axes.slice(-1) : axes[0];
    const row = (k,v) => `<div><span>${k}</span><b>${esc(v||'—')}</b></div>`;
    inner.innerHTML =
      `<div class="diagResult">` +
        `<div class="diagStep">Lecture indicative</div>` +
        `<p class="diagLead">Il semble que <b>${esc(sec)}</b> pourrait se prêter à l’automatisation du volume — en particulier sur ${focus}. Cela mériterait d’en parler.</p>` +
        `<div class="diagRecap">` + row('Secteur', sec) + row('Volume', answers.volume) +
          row('Étape la plus lourde', answers.etape) + row('Rémunération', answers.remu) + row('Si volume ×2', answers.double) + `</div>` +
        `<button type="button" class="btn" id="diagCta">J’ai un processus à automatiser →</button>` +
        `<p class="diagDisclaimer">Lecture indicative composée à partir de vos réponses — ni une analyse automatisée, ni un engagement. Le mieux reste d’en discuter.</p>` +
      `</div>`;
    document.getElementById('diagCta').addEventListener('click', ()=>{
      const topic = document.getElementById('bkTopic');
      if(topic) topic.value = `Processus à automatiser — ${sec} (via diagnostic)`;
      const rdv = document.getElementById('rendez-vous');
      if(rdv) rdv.scrollIntoView({ behavior:'smooth' });
    });
  }

  render();
})();

/* ── CTA multiples : préremplit le sujet du RDV puis l'ancre scrolle vers la prise de rendez-vous ── */
(function(){
  document.querySelectorAll('.entry[data-topic]').forEach(a=>{
    a.addEventListener('click', ()=>{
      const topic = document.getElementById('bkTopic');
      if(topic) topic.value = a.dataset.topic;
    });
  });
})();
