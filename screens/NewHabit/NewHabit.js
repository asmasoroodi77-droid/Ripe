/* NEW HABIT sheet */
function newHabitFields(d){
  return `
      <div class="field"><span class="flabel">Icon</span><div class="opts">${['drop','book','leaf','pen','dumbbell','moon','music','sun'].map(i=>`<button type="button" class="icon-opt" data-act="d-icon" data-v="${i}" aria-pressed="${d.icon===i}" aria-label="${i}">${icon(i,22)}</button>`).join('')}</div></div>
      <div class="field"><span class="flabel">Colour</span><div class="opts">${Object.entries(HCOL).map(([k,c])=>`<button type="button" class="swatch" data-act="d-color" data-v="${k}" aria-pressed="${d.color===k}" style="background:${c}" aria-label="${k}"></button>`).join('')}</div></div>
      <div class="field"><span class="flabel">Frequency</span><div class="opts">${[['daily','Daily'],['weekdays','Weekdays'],['custom','Custom']].map(([k,l])=>opt('d-freq',k,d.freq,l,'')).join('')}</div>
        ${d.freq==='custom'?`<div class="daypick">${DAYS.map((dn,i)=>`<button type="button" data-act="d-day" data-v="${i}" aria-pressed="${!!d.days[i]}" aria-label="${dn}">${dn.slice(0,2)}</button>`).join('')}</div>`:''}</div>
      <div class="field row2"><div><span class="stepper-label">Times per day</span>
          <div class="stepper"><button type="button" data-act="d-target" data-v="-1" aria-label="Fewer">−</button><output class="num">${d.target}</output><button type="button" data-act="d-target" data-v="1" aria-label="More">+</button></div></div>
        <div><label for="f-remind">Reminder</label><input class="input" type="time" id="f-remind" value="${d.remind}"></div></div>`;
}
function submitHabit(d, name){
  const days = d.freq==='daily'?[...FREQ.daily]:d.freq==='weekdays'?[...FREQ.weekdays]:d.days.map(Number);
  if(!days.some(Boolean)){ toast('Pick at least one day'); return false; }
  S.habits.push({id:'h'+Date.now(),name,icon:d.icon,color:d.color,days,target:d.target,count:0,log:{},base:0,start:dateKey(monday()),remind:d.remind});
  toast(`${icon('sprout',18)} New habit planted!`); confetti(18);
  return true;
}
