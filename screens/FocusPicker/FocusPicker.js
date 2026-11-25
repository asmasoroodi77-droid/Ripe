/* FOCUS ON… sheet */
function openPicker(){
  const open=S.tasks.filter(t=>!t.done);
  openSheet(`<div class="grab"></div><div style="display:flex;justify-content:space-between;align-items:center"><h2 class="t-h2" id="sheetTitle">Focus on…</h2>
    <button class="icon-btn" data-act="close-sheet" aria-label="Close">${icon('close',20)}</button></div><div style="margin-top:18px">
    ${open.map(t=>`<button class="pick-item" data-act="pick" data-id="${t.id}" aria-pressed="${S.timer.taskId===t.id}"><i class="dot" style="background:${CATS[t.cat].c};width:12px;height:12px"></i>
      <span style="flex:1">${esc(t.title)}<br><small class="muted" style="font-weight:600">${dueInfo(t.due).label} · ${PRI[t.pri]} priority</small></span>${t.est?`<small class="num">${t.pomos}/${t.est} ${icon('tomato',14)}</small>`:''}</button>`).join('') || emptyState('No open tasks. Free focus it is!')}</div>`);
}
