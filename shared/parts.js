/* PARTS used by more than one screen */
function emptyState(msg){ return `<div class="empty">${icon('sprout',32)}${msg}</div>`; }
function taskRow(t){
  const c = CATS[t.cat], d = dueInfo(t.due);
  return `<div class="task ${t.done?'done':''}" data-id="${t.id}">
    <button class="check" role="checkbox" aria-checked="${t.done}" data-act="task-toggle" data-id="${t.id}" aria-label="Complete ${esc(t.title)}">${icon('check',18,3)}</button>
    <div class="body"><div class="title">${esc(t.title)}</div>
      <div class="meta">
        <span><i class="dot" style="background:${c.c}"></i>${c.label}</span>
        <span class="prio" data-p="${t.pri}"><span class="bars"><i></i><i></i><i></i></span>${PRI[t.pri]}</span>
        ${t.time?`<span>${icon('clock',13)}${t.time}</span>`:''}
        ${t.due>todayKey()?`<span>${d.label}</span>`:''}
        ${t.est?`<span>${icon('tomato',13)}${t.pomos}/${t.est}</span>`:''}
      </div></div>
    ${t.done ? `<button class="del" data-act="task-delete" data-id="${t.id}" aria-label="Delete task">${icon('trash',18)}</button>`
             : `<button class="play-mini" data-act="focus-on" data-id="${t.id}" aria-label="Focus on ${esc(t.title)}">${icon('play',16)}</button>`}
  </div>`;
}
