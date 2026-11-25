/* REWARDS — XP, toasts, confetti, badges, chime */
function addXP(n){
  S.xp += n;
  if(S.xp >= LEVEL_XP){ S.xp -= LEVEL_XP; S.level++; S.shadesDay=todayKey(); toast(`${icon('star',18)} Level ${S.level}! Toma put on shades.`, 2600); confetti(40); }
  if(S.xp < 0) S.xp = 0;
}
let toastT;
function toast(html, ms=1800){ const t=$('#toast'); t.innerHTML=html; t.classList.add('show'); clearTimeout(toastT); toastT=setTimeout(()=>t.classList.remove('show'),ms); }
function confetti(n=22, origin){
  if(matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const app=$('#app'), r=app.getBoundingClientRect(), cols=['#f6bd60','#f5cac3','#84a59d','#f28482','#fffaf5'];
  const ox = origin ? origin.x - r.left : r.width/2, oy = origin ? origin.y - r.top : r.height*0.35;
  for(let i=0;i<n;i++){ const c=document.createElement('i'); c.className='confetti'; c.style.background=cols[i%cols.length]; c.style.left=ox+'px'; c.style.top=oy+'px'; app.appendChild(c);
    const a=Math.random()*Math.PI*2, d=60+Math.random()*120;
    c.animate([{transform:'translate(0,0) rotate(0)',opacity:1},{transform:`translate(${Math.cos(a)*d}px,${Math.sin(a)*d+140}px) rotate(${Math.random()*720}deg)`,opacity:0}],{duration:900+Math.random()*500,easing:'cubic-bezier(.2,.7,.4,1)'}).onfinish=()=>c.remove(); }
}
function checkAchievements(){
  const tt=todayTasks(), hs=S.habits.filter(scheduledToday);
  const rules={deep:sessionsToday()>=4, sweep:tt.length&&tt.every(t=>t.done), hero:hs.length&&hs.every(habitDoneToday)};
  const names={deep:'Deep Diver',sweep:'Clean Sweep',hero:'Habit Hero'};
  Object.entries(rules).forEach(([id,ok])=>{ if(ok && !S.unlocked.includes(id)){ S.unlocked.push(id); addXP(50); setTimeout(()=>{toast(`${icon('trophy',18)} Badge unlocked: ${names[id]} · +50 XP`,2600); confetti(36);},700); } });
}
function chime(){ try{ const ac=new (window.AudioContext||window.webkitAudioContext)(); [660,880,1320].forEach((f,i)=>{const o=ac.createOscillator(),g=ac.createGain(); o.frequency.value=f; o.type='sine'; g.gain.setValueAtTime(.0001,ac.currentTime+i*.12); g.gain.exponentialRampToValueAtTime(.18,ac.currentTime+i*.12+.02); g.gain.exponentialRampToValueAtTime(.0001,ac.currentTime+i*.12+.4); o.connect(g).connect(ac.destination); o.start(ac.currentTime+i*.12); o.stop(ac.currentTime+i*.12+.45);}); }catch(e){} }
