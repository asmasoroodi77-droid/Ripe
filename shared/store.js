/* STORE — what the app remembers (in this browser only), dates, and worked-out numbers */
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

/* ---- dates (the real date) ---- */
const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const now = () => new Date();
const dateKey = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const fromKey = k => { const [y,m,d]=k.split('-').map(Number); return new Date(y,m-1,d); };
const addDays = (d,n) => new Date(d.getFullYear(), d.getMonth(), d.getDate()+n);
const todayKey = () => dateKey(now());
const dayIdx = d => (d.getDay()+6)%7;              // Monday = 0
const todayIdx = () => dayIdx(now());
const monday = () => addDays(now(), -todayIdx());
const weekDates = () => DAYS.map((_,i)=>addDays(monday(),i));
/* "Nov 16 – 22" within one month, "Nov 30 – Dec 6" across two */
function weekRange(start){
  const end = new Date(start); end.setDate(start.getDate()+6);
  const m = d => d.toLocaleString('en-US',{month:'short'});
  return m(start)===m(end) ? `${m(start)} ${start.getDate()} – ${end.getDate()}` : `${m(start)} ${start.getDate()} – ${m(end)} ${end.getDate()}`;
}
/* Today, Tomorrow, then the day's name; a Monday reads "Next Mon" as drawn */
function dueInfo(k){
  const d=fromKey(k), en=o=>d.toLocaleDateString('en-US',o);
  if(k<=todayKey()) return {label:'Today'};
  if(k===dateKey(addDays(now(),1))) return {label:'Tomorrow', sub:`${en({weekday:'short'})} ${d.getDate()}`};
  return {label: dayIdx(d)===0 ? 'Next Mon' : en({weekday:'long'}), sub:`${en({month:'short'})} ${d.getDate()}`};
}

/* ---- fixed lists ---- */
const CATS = {work:{label:'Work',c:'var(--honey)'},study:{label:'Study',c:'var(--teal)'},personal:{label:'Personal',c:'var(--rose)'},health:{label:'Health',c:'var(--coral)'}};
const PRI = {1:'High',2:'Medium',3:'Low'};
const MODES = {focus:{label:'Focus',min:25,icon:'tomato'},short:{label:'Short break',min:5,icon:'coffee'},long:{label:'Long break',min:15,icon:'leaf'}};
const HCOL = {teal:'var(--teal)',honey:'var(--honey)',coral:'var(--coral)',rose:'var(--rose)'};
const FREQ = {daily:[1,1,1,1,1,1,1],weekdays:[1,1,1,1,1,0,0]};
const SESSION_GOAL = 4;
const LEVEL_XP = 500;

/* ---- saved state ---- */
const storage = {key:'ripe-prototype-v1'};
let S;
try{ S = JSON.parse(localStorage.getItem(storage.key)) || exampleState(); }catch(e){ S = exampleState(); }
S.timer.running = S.timer.running && S.timer.endAt > Date.now();
function save(){
  dayLog(todayKey()).tasks = todayTasks().filter(t=>t.done).length;
  try{ localStorage.setItem(storage.key, JSON.stringify(S)); }catch(e){}
}
const ui = {screen:'home', taskFilter:'today', statRange:'week', draft:null};
function dayLog(k){ return S.history[k] ||= {focusMin:0, sessions:0, tasks:0}; }
/* Midnight: today's habit counts start again. Nothing else changes. */
function newDay(){
  if(S.day===todayKey()) return false;
  S.day=todayKey(); S.habits.forEach(h=>h.count=0); dayLog(S.day);
  return true;
}

/* ---- worked-out numbers ---- */
const focusMinToday = () => dayLog(todayKey()).focusMin;
const sessionsToday = () => dayLog(todayKey()).sessions;
/* due today, or left over from an earlier day */
const todayTasks = () => S.tasks.filter(t => t.due===todayKey() || (t.due<todayKey() && (!t.done || t.doneOn===todayKey())));
const habitDoneToday = h => h.count >= h.target;
const scheduledToday = h => !!h.days[todayIdx()];
/* Counts back over planned days; a missed one ends it. Rows older than the saved log add the starting number. */
function habitStreak(h){
  let s=0, d = habitDoneToday(h) ? now() : addDays(now(),-1);
  for(; dateKey(d)>=h.start; d=addDays(d,-1)){ if(!h.days[dayIdx(d)]) continue; if(h.log[dateKey(d)]) s++; else return s; }
  return s + h.base;
}
function dayProgress(){
  const tt = todayTasks(), hs = S.habits.filter(scheduledToday);
  const done = tt.filter(t=>t.done).length + hs.filter(habitDoneToday).length + Math.min(sessionsToday(),SESSION_GOAL);
  const total = tt.length + hs.length + SESSION_GOAL;
  return total ? Math.round(done/total*100) : 0;
}
const plannedOn = d => S.habits.filter(h=>h.days[dayIdx(d)] && dateKey(d)>=h.start);
function habitRateOn(d){ const hs=plannedOn(d); return hs.length ? hs.filter(h=>h.log[dateKey(d)]).length/hs.length : 0; }
/* done check-ins ÷ planned check-ins, Monday to today (used on Habits and on Progress) */
function weekRate(){
  let done=0, planned=0;
  weekDates().slice(0,todayIdx()+1).forEach(d=>plannedOn(d).forEach(h=>{ planned++; if(h.log[dateKey(d)]) done++; }));
  return planned ? Math.round(done/planned*100) : 0;
}
const heatRate = d => S.pastRates[dateKey(d)] ?? habitRateOn(d);
const fmt = s => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(Math.floor(s%60)).padStart(2,'0')}`;
const fmtMin = m => m>=60 ? `${Math.floor(m/60)}h ${m%60}m` : `${m}m`;
const weekFocus = () => weekDates().map(d=>S.history[dateKey(d)]?.focusMin||0);
const weekTasks = () => weekDates().map((d,i)=> i===todayIdx() ? todayTasks().filter(t=>t.done).length : S.history[dateKey(d)]?.tasks||0);
