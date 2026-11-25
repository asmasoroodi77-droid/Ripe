/* HABITS */
function renderHabits(){
  const hs = S.habits.filter(scheduledToday), done = hs.filter(habitDoneToday).length;
  const TODAY = todayIdx(), wk = weekDates(), rate = weekRate();
  const best = Math.max(...S.habits.map(habitStreak), 0);
  $('#screen-habits').innerHTML = `
    <div class="screen-head"><div><div class="t-cap muted">${weekRange(wk[0])}</div><h1 class="t-display" style="margin-top:6px">Habits<span class="hl">.</span></h1></div>
      <button class="btn coral" data-act="open-add" data-type="habit" style="margin-top:10px">${icon('plus',20,3)} New</button></div>
    <div class="week-strip card">${DAYS.map((d,i)=>`<div class="wday ${i===TODAY?'today':''}">${d}<b>${wk[i].getDate()}</b><span class="pct"><i style="width:${i<=TODAY?habitRateOn(wk[i])*100:0}%"></i></span></div>`).join('')}</div>
    <div class="summary-row">
      <div class="card fill-teal"><b class="num">${done}/${hs.length}</b><small class="t-sm" style="font-weight:700">done today</small></div>
      <div class="card fill-honey" style="transform:rotate(-1.5deg)"><b class="num">${rate}%</b><small class="t-sm" style="font-weight:700">this week</small></div>
      <div class="card fill-rose"><b class="num" style="display:flex;align-items:center;gap:2px">${icon('flame',22)}${best}</b><small class="t-sm" style="font-weight:700">day best streak</small></div>
    </div>
    ${S.habits.map(h=>{
      const d = habitDoneToday(h), sched = scheduledToday(h);
      const freqLbl = h.days.every(Boolean)?'Daily':h.days.join()===FREQ.weekdays.join()?'Weekdays':DAYS.filter((_,i)=>h.days[i]).join(' · ');
      return `<div class="habit-card card" style="--hc:${HCOL[h.color]}">
        <div class="h-icon" style="background:${HCOL[h.color]}">${icon(h.icon,24)}</div>
        <div><div class="h-name">${esc(h.name)}</div>
          <div class="h-sub"><span class="h-flame">${icon('flame',13)}<b>${habitStreak(h)}-day streak</b></span><span>· ${freqLbl}</span></div></div>
        ${sched ? `<button class="h-check" data-act="habit-tap" data-id="${h.id}" data-done="${d}" aria-label="${d?'Undo '+esc(h.name):h.target>1?`Add 1 to ${esc(h.name)}, ${h.count} of ${h.target}`:'Mark '+esc(h.name)+' done'}">${h.target>1&&!d?`<span class="cnt-wrap">${icon('plus',16,3.2)}<span class="cnt num">${h.count}/${h.target}</span></span>`:d?icon('check',24,3):`<span class="ghost">${icon('check',24,3)}</span>`}</button>`
                : `<span class="chip" style="background:var(--surface-2);color:var(--text-2)">Rest day</span>`}
        <div class="h-week">${DAYS.map((dn,i)=>{
          const cls = !h.days[i]?'off':i>TODAY?'future':h.log[dateKey(wk[i])]?'on':'';
          return `<button class="hd ${cls} ${i===TODAY?'today':''}" ${(!h.days[i]||i>TODAY)?'disabled':''} data-act="habit-day" data-id="${h.id}" data-i="${i}" aria-label="${i===TODAY?'Today, ':''}${dn} ${h.log[dateKey(wk[i])]?'done':'not done'}">
            <span>${h.log[dateKey(wk[i])]&&h.days[i]?icon('check',14,3):''}</span>${dn[0]}</button>`}).join('')}</div>
      </div>`}).join('')}
    <p class="t-sm muted" style="text-align:center;margin-top:18px">Tap past days to log what you forgot. Missed days never cost you XP.</p>`;
}
