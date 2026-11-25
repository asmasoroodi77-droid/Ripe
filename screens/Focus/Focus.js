/* FOCUS */
const RING_R = 138, RING_C = 2*Math.PI*RING_R;
function renderFocus(){
  const T = S.timer, cur = S.tasks.find(t=>t.id===T.taskId);
  const ticks = Array.from({length:60},(_,i)=>{const a=i/60*Math.PI*2, r1=i%5?122:118, r2=128;
    return `<line x1="${150+r1*Math.cos(a)}" y1="${150+r1*Math.sin(a)}" x2="${150+r2*Math.cos(a)}" y2="${150+r2*Math.sin(a)}" stroke="var(--line)" stroke-width="${i%5?1.5:2.5}" stroke-opacity=".35"/>`}).join('');
  const modeColor = T.mode==='focus'?'var(--coral)':T.mode==='short'?'var(--teal)':'var(--honey)';
  $('#screen-focus').innerHTML = `
    <div class="screen-head"><div><div class="t-cap muted">Session ${Math.min(T.cycle+(T.mode==='focus'?1:0),4)} of 4</div>
      <h1 class="t-display" style="margin-top:6px">${T.mode==='focus'?'Deep <span class="hl">focus</span>':'Breathe <span class="hl">out</span>'}</h1></div>
      <button class="icon-btn" data-act="nav" data-to="home" aria-label="Back home">${icon('close',20)}</button></div>
    <div class="seg" role="group" aria-label="Timer mode">${Object.entries(MODES).map(([k,m])=>
      `<button data-act="mode" data-m="${k}" aria-pressed="${T.mode===k}">${icon(m.icon,16)}${k==='focus'?'Focus':k==='short'?'Short':'Long'}</button>`).join('')}</div>
    <div class="timer-wrap ${T.running?'running':''}" id="timerWrap">
      <svg class="ring" viewBox="0 0 300 300" aria-hidden="true">
        <circle cx="150" cy="150" r="${RING_R}" fill="var(--surface)" stroke="var(--line)" stroke-width="2.5"/>
        <g transform="rotate(90 150 150)">${ticks}</g>
        <circle cx="150" cy="150" r="${RING_R}" fill="none" stroke="var(--line)" stroke-width="20" id="ringOutline" stroke-linecap="round" stroke-dasharray="${RING_C}"/>
        <circle cx="150" cy="150" r="${RING_R}" fill="none" stroke="${modeColor}" stroke-width="14" id="ringProg" stroke-linecap="round" stroke-dasharray="${RING_C}"/>
      </svg>
      <div class="timer-face"><div class="t-cap muted">${MODES[T.mode].label}</div>
        <div class="timer-digits" data-live="time" role="timer" aria-live="off">${fmt(T.remaining)}</div>
        <div class="t-sm" style="font-weight:700" data-live="status">${T.running?'Stay with it…':'Ready when you are'}</div></div>
      <div class="timer-mascot">${mascot(T.mode==='focus'?(T.running?'focus':'happy'):'chill')}</div>
    </div>
    <div class="cycle" aria-label="${T.cycle} of 4 focus sessions in this cycle">${[0,1,2,3].map(i=>`<i class="${i<T.cycle?'on':''}"></i>`).join('')}</div>
    <div class="controls">
      <button class="icon-btn" style="width:56px;height:56px;border-radius:18px" data-act="timer-reset" aria-label="Reset timer">${icon('reset',24)}</button>
      <button class="play-xl" data-act="timer-toggle" aria-label="${T.running?'Pause':'Start'}">${icon(T.running?'pause':'play',36)}</button>
      <button class="icon-btn" style="width:56px;height:56px;border-radius:18px" data-act="timer-skip" aria-label="Finish session now">${icon('skip',22)}</button>
    </div>
    <div class="current-task card">
      <div class="h-icon fill-honey" style="width:44px;height:44px">${icon(T.mode==='focus'?'bolt':'coffee',22)}</div>
      <div class="lbl"><div class="t-cap muted">${T.mode==='focus'?'Working on':'Up next'}</div>
        <b>${cur?esc(cur.title):'No task selected'}</b>
        ${cur&&cur.est?`<div class="pomo-count" aria-label="${cur.pomos} of ${cur.est} pomodoros">${Array.from({length:Math.max(cur.est,cur.pomos)},(_,i)=>`<i class="${i<cur.pomos?'on':''}"></i>`).join('')}</div>`:''}</div>
      <button class="icon-btn" data-act="pick-task" aria-label="Change task">${icon('swap',20)}</button>
    </div>
    <p class="t-sm muted" style="text-align:center;margin-top:16px">+25 XP per focus session · long break after 4</p>`;
  updateTimerUI();
}
