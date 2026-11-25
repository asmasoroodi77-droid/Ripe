/* TASKS */
function renderTasks(){
  const f = ui.taskFilter;
  const today = S.tasks.filter(t=>t.due<=todayKey()&&!t.done).sort((a,b)=>a.pri-b.pri);
  const up = S.tasks.filter(t=>t.due>todayKey()&&!t.done);
  const done = S.tasks.filter(t=>t.done);
  let body='';
  if(f==='today') body = today.length ? today.map(taskRow).join('') : emptyState('All clear for today. Plan tomorrow?');
  if(f==='upcoming'){
    const groups = {}; up.forEach(t=>(groups[t.due] ||= []).push(t));
    body = Object.keys(groups).sort().map(k=>`
      <div class="t-cap tasks-group"><span class="chip fill-honey">${dueInfo(k).label}</span><span class="muted">${dueInfo(k).sub||''}</span></div>
      ${groups[k].sort((a,b)=>a.pri-b.pri).map(taskRow).join('')}`).join('') || emptyState('Nothing scheduled ahead.');
  }
  if(f==='done') body = done.length ? done.map(taskRow).join('') : emptyState('Completed tasks will land here.');
  const tt = todayTasks(), pct = tt.length? Math.round(tt.filter(t=>t.done).length/tt.length*100):0;
  $('#screen-tasks').innerHTML = `
    <div class="screen-head"><div><div class="t-cap muted">${tt.filter(t=>t.done).length} of ${tt.length} done today</div><h1 class="t-display" style="margin-top:6px">Tasks<span class="hl">.</span></h1></div>
      <button class="btn coral" data-act="open-add" data-type="task" style="margin-top:10px">${icon('plus',20,3)} Add</button></div>
    <div class="bar tasks-bar" role="progressbar" aria-valuenow="${pct}" aria-label="Today's task progress"><i style="width:${pct}%"></i></div>
    <div class="seg" role="group" aria-label="Filter tasks">
      ${[['today','Today',today.length],['upcoming','Upcoming',up.length],['done','Done',done.length]].map(([k,l,n])=>
        `<button data-act="task-filter" data-f="${k}" aria-pressed="${f===k}">${l}<span class="count">${n}</span></button>`).join('')}
    </div>
    <div class="tasks-list">${body}</div>`;
}
