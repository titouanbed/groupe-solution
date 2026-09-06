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
      else msg('Un problème est survenu. Réessayez, ou écrivez-nous à contact@groupsolution.fr.', 'err');
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
      els.dayList.innerHTML = '<div class="bkLoading">Aucun créneau disponible pour le moment.<br>Écrivez-nous à contact@groupsolution.fr.</div>';
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

/* ── CTA multiples : préremplit le sujet du RDV puis l'ancre scrolle vers la prise de rendez-vous ── */
(function(){
  document.querySelectorAll('.entry[data-topic]').forEach(a=>{
    a.addEventListener('click', ()=>{
      const topic = document.getElementById('bkTopic');
      if(topic) topic.value = a.dataset.topic;
    });
  });
})();
