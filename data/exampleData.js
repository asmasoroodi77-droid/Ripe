/* EXAMPLE DATA — every made-up example is in this file. Change it here.
   Days are counted from today: 0 = today, 1 = tomorrow; "daysAgo" counts back. */
const LAST_WEEK_NOTE = '+18% vs last week';
const QUOTE = "You don't need a perfect day, just one more tick.";

const EXAMPLE = {
  userName:'Mina', level:7, xp:340, streak:12, unlocked:['first','fire'],
  // index = days ago (0 is today)
  focusMin:[50,125,50,100,75,50,75],
  sessionsToday:2,
  tasksDone:[0,5,3,6,4,3,4],
  catMinutes:{work:190,study:95,personal:40,health:25},
  // share of habits done, Monday to Sunday, for the four weeks before this one
  pastWeeks:[[.8,1,.6,.8,1,.5,.6],[1,.8,.8,.6,.4,.3,.8],[.6,.8,1,1,.8,.6,.4],[1,1,.8,.6,1,.8,.6]],
  tasks:[
    {title:'Draft Q4 product brief',cat:'work',pri:1,inDays:0,time:'10:00',est:3,pomos:2,done:false},
    {title:'Review onboarding flow with Leo',cat:'work',pri:2,inDays:0,time:'13:30',est:1,pomos:0,done:false},
    {title:'Read ch. 4 of Thinking in Systems',cat:'study',pri:3,inDays:0,time:'',est:2,pomos:0,done:false},
    {title:'Book dentist appointment',cat:'health',pri:2,inDays:0,time:'',est:0,pomos:0,done:true},
    {title:'Water the monstera',cat:'personal',pri:3,inDays:0,time:'',est:0,pomos:0,done:true},
    {title:'Prep slides for design critique',cat:'work',pri:1,inDays:1,time:'09:30',est:2,pomos:0,done:false},
    {title:'Call grandma',cat:'personal',pri:2,inDays:1,time:'18:00',est:0,pomos:0,done:false},
    {title:'Spanish lesson 12: past tense',cat:'study',pri:3,inDays:2,time:'',est:1,pomos:0,done:false},
    {title:'Renew gym membership',cat:'health',pri:2,inDays:3,time:'',est:0,pomos:0,done:false},
    {title:'Send invoice to Atelier Nord',cat:'work',pri:1,inDays:4,time:'11:00',est:1,pomos:0,done:false}
  ],
  // days = Monday to Sunday; missed = which planned day back was missed (1 = the last planned day); streak = the streak to start with
  habits:[
    {name:'Drink 8 glasses',icon:'drop',color:'teal',days:[1,1,1,1,1,1,1],target:8,count:5,missed:[],streak:13},
    {name:'Morning pages',icon:'pen',color:'honey',days:[1,1,1,1,1,1,1],target:1,count:1,missed:[2],streak:2},
    {name:'Stretch 10 min',icon:'leaf',color:'coral',days:[1,1,1,1,1,1,1],target:1,count:0,missed:[],streak:25},
    {name:'Read 20 pages',icon:'book',color:'rose',days:[1,1,1,1,1,0,0],target:1,count:0,missed:[3],streak:2},
    {name:'Phone down by 10pm',icon:'moon',color:'teal',days:[1,1,1,1,1,1,1],target:1,count:0,missed:[1],streak:0},
    {name:'Gym session',icon:'dumbbell',color:'honey',days:[1,0,1,0,1,0,0],target:1,count:0,missed:[],streak:8}
  ]
};

/* Places the examples on real dates. Nothing to change below. */
function exampleState(){
  const ago = n => dateKey(addDays(now(),-n)), today = ago(0), history = {}, pastRates = {};
  EXAMPLE.focusMin.forEach((m,n)=>history[ago(n)]={focusMin:m, sessions:n?Math.round(m/25):EXAMPLE.sessionsToday, tasks:EXAMPLE.tasksDone[n]});
  EXAMPLE.pastWeeks.forEach((wk,w)=>wk.forEach((r,i)=>pastRates[dateKey(addDays(monday(),-28+7*w+i))]=r));
  const habits = EXAMPLE.habits.map((e,i)=>{
    const log={}, n0=6;
    let planned=0;
    for(let n=1;n<=n0;n++) if(e.days[dayIdx(addDays(now(),-n))] && !e.missed.includes(++planned)) log[ago(n)]=1;
    const on = e.days[todayIdx()] && e.count>=e.target; if(on) log[today]=1;
    const h={id:'h'+(i+1),name:e.name,icon:e.icon,color:e.color,days:[...e.days],target:e.target,count:e.days[todayIdx()]?e.count:0,log,base:0,start:ago(n0)};
    h.base = Math.max(0, e.missed.length ? 0 : e.streak - Object.keys(log).length);
    return h;
  });
  return {
    day:today, theme:null, userName:EXAMPLE.userName, level:EXAMPLE.level, xp:EXAMPLE.xp, streak:EXAMPLE.streak,
    unlocked:[...EXAMPLE.unlocked], shadesDay:null, history, pastRates, catMinutes:{...EXAMPLE.catMinutes},
    tasks: EXAMPLE.tasks.map(({inDays,...t},i)=>({id:'t'+(i+1),...t,due:ago(-inDays),doneOn:t.done?today:null})),
    habits, timer:{mode:'focus',remaining:25*60,running:false,endAt:0,cycle:2,taskId:'t1'}
  };
}
