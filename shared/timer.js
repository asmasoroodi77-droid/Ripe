/* TIMER */
function updateTimerUI(){
  const T=S.timer, total=MODES[T.mode].min*60, pct=1-T.remaining/total;
  document.querySelectorAll('[data-live="time"]').forEach(el=>el.textContent=fmt(T.remaining));
  const p=$('#ringProg'), o=$('#ringOutline');
  if(p){ const off = RING_C*(1-pct); p.style.strokeDashoffset=off; o.style.strokeDashoffset=off; o.style.opacity=pct>0.001?1:0; p.style.opacity=pct>0.001?1:0; }
  const nav=$('.nav-focus'); nav.classList.toggle('running',T.running); $('#navMini').textContent=fmt(T.remaining);
  document.title = T.running ? `${fmt(T.remaining)} · ${MODES[T.mode].label} — Ripe` : 'Ripe';
}

let tickId=null;
function startTimer(){ const T=S.timer; T.running=true; T.endAt=Date.now()+T.remaining*1000; loop(); renderAll(); }
function pauseTimer(){ const T=S.timer; T.running=false; T.remaining=Math.max(0,Math.ceil((T.endAt-Date.now())/1000)); clearInterval(tickId); renderAll(); }
function resetTimer(){ const T=S.timer; T.running=false; clearInterval(tickId); T.remaining=MODES[T.mode].min*60; renderAll(); }
function setMode(m){ const T=S.timer; if(T.running) clearInterval(tickId); T.mode=m; T.running=false; T.remaining=MODES[m].min*60; renderAll(); }
function loop(){ clearInterval(tickId); tickId=setInterval(()=>{ const T=S.timer; if(!T.running) return clearInterval(tickId);
  T.remaining=Math.max(0,Math.ceil((T.endAt-Date.now())/1000)); updateTimerUI(); if(T.remaining<=0) completeSession(); },250); }
function completeSession(){
  const T=S.timer; clearInterval(tickId); T.running=false; chime();
  if(T.mode==='focus'){
    const mins = MODES.focus.min; const day=dayLog(todayKey()); day.focusMin+=mins; day.sessions++; T.cycle=Math.min(T.cycle+1,4);
    const t=S.tasks.find(x=>x.id===T.taskId); if(t){ t.pomos++; S.catMinutes[t.cat]=(S.catMinutes[t.cat]||0)+mins; }
    addXP(25); confetti(40); toast(`${icon('tomato',18)} Session done! +25 XP · time for a break`,2400);
    if(!S.unlocked.includes('first')) S.unlocked.push('first');
    T.mode = T.cycle>=4 ? 'long' : 'short';
    checkAchievements();
  } else {
    if(T.mode==='long') T.cycle=0;
    toast(`${icon('bolt',18)} Break's over. Ready for another round?`,2200); T.mode='focus';
  }
  T.remaining=MODES[T.mode].min*60; renderAll();
}
