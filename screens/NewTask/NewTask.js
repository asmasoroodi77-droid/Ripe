/* NEW TASK sheet */
function newTaskFields(d){
  return `
      <div class="field"><span class="flabel">Category</span><div class="opts">${Object.entries(CATS).map(([k,c])=>opt('d-cat',k,d.cat,c.label,`<i class="dot" style="background:${c.c}"></i>`)).join('')}</div></div>
      <div class="field"><span class="flabel">Priority</span><div class="opts">${[1,2,3].map(p=>opt('d-pri',String(p),String(d.pri),PRI[p],`<span class="prio" data-p="${p}"><span class="bars"><i></i><i></i><i></i></span></span>`)).join('')}</div></div>
      <div class="field"><span class="flabel">When</span><div class="opts">${[0,1,2,3].map(n=>dateKey(addDays(now(),n))).map(k=>opt('d-due',k,d.due,dueInfo(k).label,'')).join('')}</div></div>
      <div class="field row2"><div><label for="f-time">Time (optional)</label><input class="input" type="time" id="f-time" value="${d.time}"></div>
        <div><span class="stepper-label">Pomodoros</span>
          <div class="stepper"><button type="button" data-act="d-est" data-v="-1" aria-label="Fewer">−</button><output class="num">${d.est}</output><button type="button" data-act="d-est" data-v="1" aria-label="More">+</button></div></div></div>`;
}
function submitTask(d, title){
  S.tasks.unshift({id:'t'+Date.now(),title,cat:d.cat,pri:+d.pri,due:d.due,time:d.time,est:d.est,pomos:0,done:false,doneOn:null});
  ui.taskFilter = d.due<=todayKey()?'today':'upcoming';
  toast(`${icon('check',18,3)} Added to ${dueInfo(d.due).label}`);
  return true;
}
