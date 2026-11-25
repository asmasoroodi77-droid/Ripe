/* STATE SWITCHER — review only, shown when the address has ?review=1.
   To remove: delete its <script> line in index.html (then this file can go too). */
(function(){
  if(new URLSearchParams(location.search).get('review')!=='1') return;
  storage.key='ripe-prototype-review';            // reviewing never touches a participant's saved data

  function fresh(){ clearInterval(tickId); clearTimeout(toastT); $('#toast').classList.remove('show'); closeSheet();
    document.querySelectorAll('.confetti').forEach(c=>c.remove());
    const theme=S.theme; S=exampleState(); S.theme=theme; ui.taskFilter='today'; ui.statRange='week'; }
  const show = (screen,prep,after) => () => { fresh(); if(prep) prep(); renderAll(); go(screen); if(after) after(); };
  const finishTasks = () => S.tasks.forEach(t=>{ t.done=true; t.doneOn=todayKey(); });
  const finishHabits = () => S.habits.filter(scheduledToday).forEach(h=>{ h.count=h.target; h.log[todayKey()]=1; });
  const run = () => { S.timer.remaining=24*60+57; startTimer(); };
  const mode = m => () => { S.timer.mode=m; S.timer.remaining=MODES[m].min*60; };

  const STATES = [
    ['Home', show('home')],
    ['Home: focusing', show('home',null,run)],
    ['Home: on a break', show('home',mode('short'),startTimer)],
    ['Home: 80% day', show('home',()=>{ finishTasks(); finishHabits(); })],
    ['Home: 100% day', show('home',()=>{ finishTasks(); finishHabits(); dayLog(todayKey()).sessions=4; })],
    ['Home: level-up', show('home',()=>{ S.xp=495; },()=>{ addXP(15); renderAll(); })],
    ['Home: dark or light', ()=>{ fresh(); S.theme=isDark()?'light':'dark'; applyTheme(); renderAll(); go('home'); }],
    ['Tasks: Today', show('tasks')],
    ['Tasks: Upcoming', show('tasks',()=>{ ui.taskFilter='upcoming'; })],
    ['Tasks: Done', show('tasks',()=>{ ui.taskFilter='done'; })],
    ['Tasks: Today empty', show('tasks',finishTasks)],
    ['Tasks: Upcoming empty', show('tasks',()=>{ S.tasks=[]; ui.taskFilter='upcoming'; })],
    ['Tasks: Done empty', show('tasks',()=>{ S.tasks=[]; ui.taskFilter='done'; })],
    ['Focus: ready', show('focus')],
    ['Focus: running', show('focus',null,run)],
    ['Focus: short break', show('focus',mode('short'))],
    ['Focus: long break', show('focus',mode('long'))],
    ['Focus: session done', show('focus',null,()=>{ S.timer.remaining=0; completeSession(); })],
    ['Focus: badge unlocked', show('focus',()=>{ dayLog(todayKey()).sessions=3; S.timer.cycle=3; },()=>{ S.timer.remaining=0; completeSession(); })],
    ['Focus: no task', show('focus',()=>{ S.timer.taskId=null; })],
    ['Habits', show('habits')],
    ['Habits: one done', show('habits',null,()=>tapHabit('h3'))],
    ['Progress: This week', show('stats')],
    ['Progress: Today', show('stats',()=>{ ui.statRange='day'; })],
    ['New task', show('tasks',null,()=>openAdd('task'))],
    ['New task: no name', show('tasks',null,()=>{ openAdd('task'); submitDraft(); })],
    ['New habit', show('habits',null,()=>openAdd('habit'))],
    ['New habit: custom days', show('habits',null,()=>{ openAdd('habit'); ui.draft.freq='custom'; ui.draft.days=[1,0,1,0,1,0,0]; renderAddSheet(); })],
    ['Focus on…', show('focus',null,openPicker)],
    ['Focus on…: no tasks', show('focus',()=>{ S.tasks=[]; S.timer.taskId=null; },openPicker)]
  ];

  const bar=document.createElement('div');
  bar.setAttribute('role','toolbar'); bar.setAttribute('aria-label','Show a state');
  bar.style.cssText='position:fixed;left:50%;bottom:0;transform:translateX(-50%);z-index:99999;max-width:100vw;display:flex;gap:4px;padding:4px;overflow-x:auto;background:#fff;border:1px solid #888;font:12px/1.2 Arial,sans-serif;color:#111';
  STATES.forEach(([name,fn])=>{
    const b=document.createElement('button'); b.type='button'; b.textContent=name;
    b.style.cssText='flex:none;white-space:nowrap;padding:5px 8px;border:1px solid #888;background:#eee;color:#111;font:inherit;border-radius:2px';
    b.addEventListener('click',()=>{ fn(); [...bar.children].forEach(x=>{ x.style.background='#eee'; x.style.textDecoration='none'; x.removeAttribute('aria-pressed'); });
      b.style.background='#cde'; b.style.textDecoration='underline'; b.setAttribute('aria-pressed','true'); });
    bar.appendChild(b);
  });
  document.body.appendChild(bar);
})();
