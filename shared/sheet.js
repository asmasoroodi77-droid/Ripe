/* SHEETS — what the three sheets share */
const opt=(act,val,cur,label,extra='')=>`<button type="button" class="opt" data-act="${act}" data-v="${val}" aria-pressed="${cur===val}">${extra}${label}</button>`;
function openSheet(html){ $('#sheet').innerHTML=html; $('#sheet').classList.add('open'); $('#backdrop').classList.add('open'); setTimeout(()=>$('#sheet').querySelector('input')?.focus({preventScroll:true}),350); }
function closeSheet(){ $('#sheet').classList.remove('open'); $('#backdrop').classList.remove('open'); ui.draft=null; }

function openAdd(type){
  ui.draft = {type, title:'', cat:'work', pri:2, due:todayKey(), time:'', est:1,
              icon:'drop', color:'teal', freq:'daily', days:[...FREQ.daily], target:1, remind:'08:00'};
  renderAddSheet(); $('#sheet').classList.add('open'); $('#backdrop').classList.add('open');
  setTimeout(()=>$('#f-title')?.focus({preventScroll:true}),350);
}
function renderAddSheet(){
  const d=ui.draft, isT=d.type==='task';
  $('#sheet').innerHTML = `<div class="grab"></div>
    <div style="display:flex;justify-content:space-between;align-items:center"><h2 class="t-h2" id="sheetTitle">New ${isT?'task':'habit'}</h2>
      <button class="icon-btn" data-act="close-sheet" aria-label="Close">${icon('close',20)}</button></div>
    <div class="seg" role="group" aria-label="Type" style="margin-top:16px">
      <button data-act="d-type" data-v="task" aria-pressed="${isT}">${icon('tasks',16)}Task</button>
      <button data-act="d-type" data-v="habit" aria-pressed="${!isT}">${icon('habits',16)}Habit</button></div>
    <form id="addForm" novalidate>
    <div class="field"><label for="f-title">${isT?'What needs doing?':'Habit name'}</label>
      <input class="input" id="f-title" autocomplete="off" maxlength="60" placeholder="${isT?'e.g. Outline blog post on rituals':'e.g. Meditate 5 minutes'}" value="${esc(d.title)}">
      <div class="err-msg" id="f-err">Give it a name so Toma knows what to cheer for.</div></div>
    ${isT ? newTaskFields(d) : newHabitFields(d)}
    <button class="btn primary block add-submit" type="submit">${icon('plus',20,3)} Add ${isT?'task':'habit'}</button>
    </form>`;
  const f=$('#addForm');
  $('#f-title').addEventListener('input',e=>{ d.title=e.target.value; e.target.classList.remove('err'); $('#f-err').classList.remove('show'); });
  $('#f-time')?.addEventListener('input',e=>d.time=e.target.value);
  $('#f-remind')?.addEventListener('input',e=>d.remind=e.target.value);
  f.addEventListener('submit',e=>{ e.preventDefault(); submitDraft(); });
}
function submitDraft(){
  const d=ui.draft, title=d.title.trim();
  if(!title){ const i=$('#f-title'); i.classList.remove('err'); void i.offsetWidth; i.classList.add('err'); $('#f-err').classList.add('show'); i.focus({preventScroll:true}); return; }
  if(!(d.type==='task' ? submitTask(d,title) : submitHabit(d,title))) return;
  const type=d.type; closeSheet(); renderAll(); go(type==='task'?'tasks':'habits');
}
