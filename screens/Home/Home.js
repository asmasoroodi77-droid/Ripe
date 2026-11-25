/* HOME */
function renderHome(){
  const tt = todayTasks(), open = tt.filter(t=>!t.done), doneN = tt.length-open.length;
  const hs = S.habits.filter(scheduledToday), hDone = hs.filter(habitDoneToday).length;
  const p = dayProgress(), T = S.timer, cur = S.tasks.find(t=>t.id===T.taskId);
  const mood = T.running && T.mode==='focus' ? 'focus' : (p>=80 || S.shadesDay===todayKey()) ? 'cool' : 'happy';
  $('#screen-home').innerHTML = `
    <div class="topbar">
      <div class="t-cap muted topdate">${now().toLocaleDateString('en-GB',{weekday:'long'})}<br>${now().toLocaleDateString('en-GB',{day:'numeric',month:'long'})}</div>
      <div class="wordmark" aria-label="Ripe">Ripe<span>.</span></div>
      <button class="icon-btn" data-act="theme" aria-label="Toggle dark mode">${icon(isDark()?'sun':'moon',20)}</button>
    </div>
    <h1 class="t-h2" style="margin-top:18px">Hi ${esc(S.userName)}, let's make today <span class="hl">juicy.</span></h1>

    <div class="hero card" style="margin-top:28px">
      <div class="streak-sticker">${icon('flame',16)} ${S.streak}-day streak</div>
      <div class="t-cap">Today's progress</div>
      <div class="big num" aria-label="${p} percent">${p}<span style="font-size:32px">%</span></div>
      <div class="t-sm" style="font-weight:700">${p>=100?'Everything done. Take a bow!':p>=60?'Nearly ripe. Keep rolling.':'Warming up nicely.'}</div>
      <div class="lvl">
        <div style="display:flex;justify-content:space-between;font-size:12px;font-weight:800;margin-bottom:5px"><span>Level ${S.level}</span><span class="num">${S.xp}/${LEVEL_XP} XP</span></div>
        <div class="bar" role="progressbar" aria-valuenow="${S.xp}" aria-valuemax="${LEVEL_XP}" aria-label="Level progress"><i style="width:${S.xp/LEVEL_XP*100}%"></i></div>
      </div>
      <div class="mascot">${mascot(mood)}</div>
    </div>

    <div class="mini-stats">
      <div class="mini-stat card fill-rose"><b class="num">${doneN}/${tt.length}</b><small>Tasks</small></div>
      <div class="mini-stat card fill-teal" style="transform:rotate(1deg)"><b class="num">${hDone}/${hs.length}</b><small>Habits</small></div>
      <div class="mini-stat card"><b class="num">${sessionsToday()}/${SESSION_GOAL}</b><small>Focus runs</small></div>
    </div>

    <div class="focus-card card">
      <span class="deco"></span>
      <div class="ft">
        <div class="t-cap">${T.running ? (T.mode==='focus'?'Focusing now':'On a break') : 'Focus sprint'}</div>
        <div class="time num" data-live="time">${fmt(T.remaining)}</div>
        <div class="task-name">${cur && T.mode==='focus' ? '→ '+esc(cur.title) : MODES[T.mode].label}</div>
      </div>
      <button class="big-play" data-act="home-play" aria-label="${T.running?'Pause timer':'Start timer'}">${icon(T.running?'pause':'play',28)}</button>
    </div>

    <div class="section-head"><h2 class="t-h3">Today's tasks</h2>${
      open.length ? `<button class="link" data-act="see-tasks" data-f="today">${open.length>3?`See all ${open.length}`:'All tasks'}</button>`
      : doneN ? `<button class="link" data-act="see-tasks" data-f="done">View ${doneN} done</button>` : ''}</div>
    ${open.length ? open.slice(0,3).map(taskRow).join('') : emptyState('Inbox zero for today. Toma is impressed.')}

    <div class="section-head"><h2 class="t-h3">Daily habits</h2><button class="link" data-act="nav" data-to="habits">Track</button></div>
    <div class="habit-row">${hs.map(habitToken).join('')}
      <button class="token" data-act="open-add" data-type="habit" aria-label="Add habit"><span class="ring"><span class="face" style="border-style:dashed">${icon('plus',24)}</span></span><span class="lbl">New</span></button>
    </div>

    <div class="quote card"><div style="width:52px;flex:none">${mascot('chill')}</div>
      <p>"${QUOTE}"</p></div>`;
}
function habitToken(h){
  const pct = Math.min(h.count/h.target,1), C=2*Math.PI*31;
  return `<button class="token" data-act="habit-tap" data-id="${h.id}" data-done="${habitDoneToday(h)}" style="--hc:${HCOL[h.color]}" aria-label="${esc(h.name)}, ${h.count} of ${h.target}">
    <span class="ring"><svg class="r" viewBox="0 0 68 68"><circle cx="34" cy="34" r="31" fill="none" stroke="var(--line)" stroke-opacity=".12" stroke-width="5"/>
      <circle cx="34" cy="34" r="31" fill="none" stroke="${HCOL[h.color]}" stroke-width="5" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C*(1-pct)}" transform="rotate(-90 34 34)" style="transition:stroke-dashoffset .5s"/></svg>
      <span class="face">${icon(habitDoneToday(h)?'check':h.icon,24)}</span></span>
    <span class="lbl">${esc(h.name)}</span><span class="st">${icon('flame',11)}${habitStreak(h)}${h.target>1?` · ${h.count}/${h.target}`:''}</span></button>`;
}
