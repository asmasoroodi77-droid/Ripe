/* MAIN — draws the screens, lets them hand over to each other, and answers clicks */
function renderAll(){
  const f=document.activeElement, sel=f && f.dataset && f.dataset.act
    ? `[data-act="${f.dataset.act}"]`+['id','to','f','m','r','i','type'].map(k=>f.dataset[k]!==undefined?`[data-${k}="${f.dataset[k]}"]`:'').join('') : null;
  const scope=f && f.closest('.screen');
  const row=$('.habit-row'), left=row?row.scrollLeft:0;
  renderHome(); renderTasks(); renderFocus(); renderHabits(); renderStats(); syncNav(); save();
  if($('.habit-row')) $('.habit-row').scrollLeft=left;
  if(sel && scope) scope.querySelector(sel)?.focus({preventScroll:true});   // keyboard users keep their place
}
function syncNav(){
  document.querySelectorAll('.nav [data-to]').forEach(b=> b.dataset.to===ui.screen ? b.setAttribute('aria-current','page') : b.removeAttribute('aria-current'));
  $('#app').dataset.screen = ui.screen; $('#app').dataset.mode = S.timer.mode;
}
function go(screen){
  ui.screen = screen;
  document.querySelectorAll('.screen').forEach(s=>s.classList.toggle('active', s.id==='screen-'+screen));
  $('#screen-'+screen).scrollTop = 0;
  syncNav();
}

document.addEventListener('click', e=>{
  const el=e.target.closest('[data-act]'); if(!el || el.disabled) return;
  const a=el.dataset.act, id=el.dataset.id, d=ui.draft;
  switch(a){
    case 'nav': go(el.dataset.to); break;
    case 'theme': S.theme = isDark()?'light':'dark'; applyTheme(); renderAll(); break;
    case 'task-toggle': toggleTask(id, el); break;
    case 'task-delete': S.tasks=S.tasks.filter(t=>t.id!==id); toast(`${icon('trash',18)} Task removed`); renderAll(); break;
    case 'task-filter': ui.taskFilter=el.dataset.f; renderTasks(); break;
    case 'see-tasks': ui.taskFilter=el.dataset.f; renderTasks(); go('tasks'); break;
    case 'habit-tap': tapHabit(id, el); break;
    case 'habit-day': { const h=S.habits.find(x=>x.id===id), i=+el.dataset.i;
      if(i===todayIdx()){ tapHabit(id, el); break; }   // today's box does the same as the big button
      const k=dateKey(weekDates()[i]); h.log[k]=h.log[k]?0:1; renderAll(); break; }
    case 'focus-on': { const T=S.timer; T.taskId=id; if(T.mode!=='focus'){ setMode('focus'); } go('focus'); if(!T.running) startTimer(); else renderAll(); break; }
    case 'home-play': S.timer.running ? pauseTimer() : (startTimer(), go('focus')); break;
    case 'timer-toggle': S.timer.running ? pauseTimer() : startTimer(); break;
    case 'timer-reset': resetTimer(); break;
    case 'timer-skip': S.timer.remaining=0; completeSession(); break;
    case 'mode': setMode(el.dataset.m); break;
    case 'pick-task': openPicker(); break;
    case 'pick': S.timer.taskId=id; closeSheet(); renderAll(); toast(`${icon('bolt',18)} Focus task switched`); break;
    case 'stat-range': ui.statRange=el.dataset.r; renderStats(); break;
    case 'open-add': openAdd(el.dataset.type); break;
    case 'close-sheet': closeSheet(); break;
    case 'reset-demo':
      if(el.dataset.armed!=='1'){ el.dataset.armed='1'; el.textContent='Tap again to erase your progress'; setTimeout(()=>{ if(el.isConnected){ el.dataset.armed=''; el.textContent='Reset demo data'; } },3000); break; }
      clearInterval(tickId); { const th=S.theme; S=exampleState(); S.theme=th; } applyTheme(); renderAll(); go('home'); toast('Demo data restored'); break;
    // draft (add sheet) controls
    case 'd-type': d.type=el.dataset.v; renderAddSheet(); break;
    case 'd-cat': d.cat=el.dataset.v; renderAddSheet(); break;
    case 'd-pri': d.pri=+el.dataset.v; renderAddSheet(); break;
    case 'd-due': d.due=el.dataset.v; renderAddSheet(); break;
    case 'd-est': d.est=Math.min(8,Math.max(0,d.est+ +el.dataset.v)); renderAddSheet(); break;
    case 'd-icon': d.icon=el.dataset.v; renderAddSheet(); break;
    case 'd-color': d.color=el.dataset.v; renderAddSheet(); break;
    case 'd-freq': d.freq=el.dataset.v; if(d.freq==='custom') d.days=[1,0,1,0,1,0,0]; renderAddSheet(); break;
    case 'd-day': d.days[+el.dataset.v]=d.days[+el.dataset.v]?0:1; renderAddSheet(); break;
    case 'd-target': d.target=Math.min(12,Math.max(1,d.target+ +el.dataset.v)); renderAddSheet(); break;
  }
});
document.addEventListener('keydown', e=>{
  if(e.key==='Escape' && $('#sheet').classList.contains('open')) closeSheet();
  if(e.code==='Space' && ui.screen==='focus' && !$('#sheet').classList.contains('open') && !/INPUT|BUTTON/.test(document.activeElement.tagName)){ e.preventDefault(); S.timer.running?pauseTimer():startTimer(); }
});

function isDark(){ const t=document.documentElement.dataset.theme; return t ? t==='dark' : matchMedia('(prefers-color-scheme: dark)').matches; }
function applyTheme(){ if(S.theme) document.documentElement.dataset.theme=S.theme; const m=document.querySelector('meta[name="theme-color"]'); if(m) m.content = isDark()?'#1f1a18':'#f7ede2'; }


/* START */
document.querySelectorAll('[data-icon]').forEach(el=>el.innerHTML=icon(el.dataset.icon, +el.dataset.size||22));
applyTheme(); newDay(); renderAll(); go('home');
if(S.timer.running) loop();
setInterval(()=>{ if(newDay()) renderAll(); }, 15000);
