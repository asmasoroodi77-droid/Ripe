/* PROGRESS */
function barChart(values, opts){
  const TODAY=todayIdx();
  const W=310,H=170,pl=4,pb=24,pt=22,bw=26, max=Math.max(opts.goal||0,...values.map(v=>v||0))*1.15||1;
  const step=(W-pl*2)/7, y=v=>H-pb-(v/max)*(H-pb-pt);
  let s=`<svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="${opts.label}">`;
  if(opts.goal){ s+=`<line x1="0" x2="${W}" y1="${y(opts.goal)}" y2="${y(opts.goal)}" stroke="var(--text-2)" stroke-width="1.5" stroke-dasharray="5 5"/>
    <text x="${W}" y="${y(opts.goal)-6}" text-anchor="end" font-size="11" font-weight="800" fill="var(--text-2)">Goal ${opts.goalLbl}</text>`; }
  values.forEach((v,i)=>{
    const x=pl+step*i+(step-bw)/2, fut=i>TODAY, h=Math.max((H-pb)-y(v||0),fut?0:3);
    if(fut) s+=`<rect x="${x}" y="${H-pb-40}" width="${bw}" height="40" rx="8" fill="none" stroke="var(--line)" stroke-opacity=".3" stroke-width="2" stroke-dasharray="4 4"/>`;
    else { s+=`<rect x="${x+3}" y="${y(v)+3}" width="${bw}" height="${h}" rx="8" fill="var(--line)"/>
      <rect x="${x}" y="${y(v)}" width="${bw}" height="${h}" rx="8" fill="${i===TODAY?'var(--coral)':opts.color}" stroke="var(--line)" stroke-width="2.5"/>
      <text x="${x+bw/2}" y="${y(v)-7}" text-anchor="middle" font-size="11" font-weight="800" fill="var(--text)">${opts.fmt(v)}</text>`; }
    s+=`<text x="${x+bw/2}" y="${H-6}" text-anchor="middle" font-size="12" font-weight="${i===TODAY?900:700}" fill="${i===TODAY?'var(--text)':'var(--text-2)'}">${DAYS[i][0]}</text>`;
  });
  return s+'</svg>';
}
/* Habit heatmap — 5 weeks × 7 days, each cell classified into one of five levels */
const HEAT = [
  {label:'None',    range:'0%',      c:'var(--surface-2)', test:v=>v===0},
  {label:'Low',     range:'1–39%',   c:'var(--teal-100)',  test:v=>v<.4},
  {label:'Fair',    range:'40–69%',  c:'#b0c6c0',          test:v=>v<.7},
  {label:'Good',    range:'70–94%',  c:'var(--teal)',      test:v=>v<.95},
  {label:'Perfect', range:'95–100%', c:'#5f817a',          test:()=>true}];
const heatLevel = v => HEAT.find(l=>l.test(v));
function shortRange(start){
  const end=new Date(start); end.setDate(start.getDate()+6);
  const m=d=>d.toLocaleString('en-US',{month:'short'});
  return m(start)===m(end) ? `${m(start)} ${start.getDate()}–${end.getDate()}` : `${m(start)} ${start.getDate()}–${m(end)} ${end.getDate()}`;
}
function heatRows(){
  return [4,3,2,1,0].map(back=>{
    const start=addDays(monday(),-7*back), cur=back===0;
    const cells=DAYS.map((_,i)=>{ const d=addDays(start,i); return dateKey(d)>todayKey() ? -1 : heatRate(d); });
    const past=cells.filter(v=>v>=0);
    return {cells, label:cur?'This week':shortRange(start), avg: cur ? weekRate() : Math.round(past.reduce((a,b)=>a+b,0)/past.length*100)};
  });
}
function heatmap(rows){
  const TODAY=todayIdx();
  const cs=30,g=6,lw=78,rw=44,top=22, W=lw+cs*7+g*6+rw, H=top+cs*5+g*4;
  let s=`<svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="Habit consistency for the last five weeks, by day">`;
  DAYS.forEach((d,ci)=>{ s+=`<text x="${lw+ci*(cs+g)+cs/2}" y="12" text-anchor="middle" font-size="11" font-weight="${ci===TODAY?900:700}" fill="${ci===TODAY?'var(--text)':'var(--text-2)'}">${d[0]}</text>`; });
  s+=`<text x="${W}" y="12" text-anchor="end" font-size="10" font-weight="800" fill="var(--text-2)">AVG</text>`;
  rows.forEach((row,ri)=>{ const y=top+ri*(cs+g), cur=ri===rows.length-1;
    s+=`<text x="0" y="${y+cs/2+4}" font-size="11" font-weight="${cur?900:700}" fill="${cur?'var(--text)':'var(--text-2)'}">${row.label}</text>`;
    row.cells.forEach((v,ci)=>{ const x=lw+ci*(cs+g);
      if(v<0){ s+=`<rect x="${x+1}" y="${y+1}" width="${cs-2}" height="${cs-2}" rx="8" fill="none" stroke="var(--line)" stroke-opacity=".25" stroke-width="2" stroke-dasharray="3 3"/>`; return; }
      const L=heatLevel(v);
      s+=`<rect x="${x+1}" y="${y+1}" width="${cs-2}" height="${cs-2}" rx="8" fill="${L.c}" stroke="var(--line)" stroke-width="2"><title>${DAYS[ci]} · ${Math.round(v*100)}% (${L.label})</title></rect>`;
      if(L.label==='Perfect') s+=`<path d="M${x+9} ${y+15.5}l4 4 8-8" fill="none" stroke="#fffaf5" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>`;
      if(cur&&ci===TODAY) s+=`<rect x="${x-2}" y="${y-2}" width="${cs+4}" height="${cs+4}" rx="10" fill="none" stroke="var(--coral)" stroke-width="2.5"/>`;
    });
    s+=`<text x="${W}" y="${y+cs/2+5}" text-anchor="end" font-size="13" font-weight="900" fill="var(--text)" class="num">${row.avg}%</text>`;
  });
  return s+'</svg>';
}
function renderStats(){
  const wf=weekFocus(), wt=weekTasks(), r=ui.statRange, TODAY=todayIdx();
  const focusMin = r==='week'? wf.reduce((a,b)=>a+(b||0),0) : focusMinToday();
  const sessions = r==='week'? Math.round(wf.reduce((a,b)=>a+(b||0),0)/25) : sessionsToday();
  const tasksDone = r==='week'? wt.reduce((a,b)=>a+(b||0),0) : wt[TODAY];
  const habitPct = r==='week'? weekRate() : Math.round(habitRateOn(now())*100);
  const cm=S.catMinutes, ctot=Object.values(cm).reduce((a,b)=>a+b,0);
  const ach=[
    {id:'first',name:'First Bloom',desc:'Finish a focus run',ic:'sprout',c:'var(--teal)'},
    {id:'fire',name:'On Fire',desc:'7-day streak',ic:'flame',c:'var(--coral)'},
    {id:'deep',name:'Deep Diver',desc:'4 focus runs in a day',ic:'bolt',c:'var(--honey)',prog:`${Math.min(sessionsToday(),4)}/4`},
    {id:'sweep',name:'Clean Sweep',desc:"Clear today's tasks",ic:'check',c:'var(--rose)'},
    {id:'hero',name:'Habit Hero',desc:'All habits in a day',ic:'star',c:'var(--teal)'},
    {id:'month',name:'Month Strong',desc:'30-day streak',ic:'trophy',c:'var(--honey)',prog:`${S.streak}/30`}];
  $('#screen-stats').innerHTML = `
    <div class="screen-head"><div><div class="t-cap muted">Level ${S.level} · ${S.xp} XP</div><h1 class="t-display" style="margin-top:6px">Progress<span class="hl">.</span></h1></div></div>
    <div class="seg" role="group" aria-label="Range" style="margin-bottom:16px">
      <button data-act="stat-range" data-r="day" aria-pressed="${r==='day'}">Today</button><button data-act="stat-range" data-r="week" aria-pressed="${r==='week'}">This week</button></div>
    <div class="tiles">
      <div class="tile fill-coral"><div class="t-cap">${icon('timer',14)}Focus time</div><b class="num">${fmtMin(focusMin)}</b><small>${r==='week'?LAST_WEEK_NOTE:'Goal: 1h 40m'}</small></div>
      <div class="tile fill-honey" style="transform:rotate(1deg)"><div class="t-cap">${icon('tomato',14)}Sessions</div><b class="num">${sessions}</b><small>${r==='week'?'pomodoros completed':'of 4 planned'}</small></div>
      <div class="tile fill-teal" style="transform:rotate(-1deg)"><div class="t-cap">${icon('check',14)}Tasks done</div><b class="num">${tasksDone}</b><small>${r==='week'?`avg ${(tasksDone/(TODAY+1)).toFixed(1)} per day`:`${todayTasks().length-tasksDone} still open`}</small></div>
      <div class="tile fill-rose"><div class="t-cap">${icon('habits',14)}Habit rate</div><b class="num">${habitPct}%</b><small>${r==='week'?'consistency so far':'of today\'s habits'}</small></div>
    </div>
    <div class="chart-card card"><h3 class="t-h4">Focus minutes <span class="t-sm muted">Mon–Sun</span></h3>
      ${barChart(wf,{label:'Focus minutes per day this week',goal:100,goalLbl:'100m',color:'var(--honey)',fmt:v=>v})}
      <div class="legend"><span><i class="dot" style="background:var(--honey)"></i>Past days</span><span><i class="dot" style="background:var(--coral)"></i>Today (live)</span></div></div>
    <div class="chart-card card"><h3 class="t-h4">Tasks completed <span class="t-sm muted">per day</span></h3>
      ${barChart(wt,{label:'Tasks completed per day this week',color:'var(--teal)',fmt:v=>v})}</div>
    ${(()=>{ const rows=heatRows();
      return `<div class="chart-card card"><h3 class="t-h4">Habit consistency <span class="t-sm muted">last 5 weeks</span></h3>
      <div style="margin-top:12px">${heatmap(rows)}</div>
      <div class="heat-legend">${HEAT.map(l=>`<span><i style="background:${l.c}"></i><b>${l.label}</b><small>${l.range}</small></span>`).join('')}</div></div>`; })()}
    <div class="chart-card card"><h3 class="t-h4">Where focus went <span class="t-sm muted">${fmtMin(ctot)}</span></h3>
      <div class="stack">${Object.entries(cm).map(([k,v])=>`<i style="width:${v/ctot*100}%;background:${CATS[k].c}" title="${CATS[k].label}"></i>`).join('')}</div>
      <div class="legend">${Object.entries(cm).map(([k,v])=>`<span><i class="dot" style="background:${CATS[k].c}"></i>${CATS[k].label} <b style="color:var(--text)">${Math.round(v/ctot*100)}%</b></span>`).join('')}</div></div>
    <div class="section-head"><h2 class="t-h3">Achievements</h2><span class="t-sm muted">${S.unlocked.length}/${ach.length}</span></div>
    <div class="badges">${ach.map(a=>{const on=S.unlocked.includes(a.id);
      return `<div class="badge ${on?'':'locked'}"><span class="medal" style="background:${a.c}">${icon(a.ic,22)}</span><b>${a.name}</b><small>${on?a.desc:(a.prog?a.prog+' · ':'')+a.desc}</small></div>`}).join('')}</div>
    <div style="text-align:center;margin-top:28px"><button class="link muted" data-act="reset-demo">Reset demo data</button></div>`;
}
