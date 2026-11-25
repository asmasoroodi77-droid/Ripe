/* ACTIONS — tasks and habits */
function toggleTask(id, el){
  const t=S.tasks.find(x=>x.id===id); if(!t) return;
  t.done=!t.done; t.doneOn=t.done?todayKey():null; const xp = t.pri===1?15:10;
  if(t.done){ addXP(xp); toast(`${icon('check',18,3)} Nice! +${xp} XP`); const r=el?.getBoundingClientRect(); confetti(16, r&&{x:r.left+r.width/2,y:r.top}); checkAchievements(); }
  else addXP(-xp);
  // small delay so the check animation is visible before the row re-flows
  const row = el?.closest('.task'); if(row && t.done){ row.querySelector('.check').setAttribute('aria-checked','true'); setTimeout(renderAll,320); } else renderAll();
}
function tapHabit(id, el){
  const h=S.habits.find(x=>x.id===id); if(!h) return;
  const was=habitDoneToday(h);
  if(was) h.count=0; else h.count++;
  const nowDone=habitDoneToday(h); h.log[todayKey()]=nowDone?1:0;
  if(!was&&nowDone){ addXP(5); toast(`${icon('flame',18)} ${esc(h.name)}: ${habitStreak(h)}-day streak! +5 XP`); const r=el?.getBoundingClientRect(); confetti(14, r&&{x:r.left+r.width/2,y:r.top+r.height/2}); checkAchievements(); }
  else if(was) addXP(-5);
  else toast(`${icon(h.icon,18)} ${h.count}/${h.target} logged`);
  renderAll();
}
