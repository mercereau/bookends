/* =========================================================
   1. FORM CONTENT — edit prompts here.
   Each dimension has a 1–5 scale (optional) and one or more prompts.
   IDs are stored with entries, so keep them stable once you have data.
   ========================================================= */
const DIMENSIONS = {
  emotional:     {label:"Emotional",     icon:"💗", color:"#d98b3a"},
  physical:      {label:"Physical",      icon:"💪", color:"#c0604d"},
  spiritual:     {label:"Spiritual",     icon:"🕊️", color:"#8a6bb8"},
  social:        {label:"Social",        icon:"🧑‍🤝‍🧑", color:"#3f8f9b"},
  intellectual:  {label:"Intellectual",  icon:"💡", color:"#4a6fb5"},
  occupational:  {label:"Occupational",  icon:"🗓️", color:"#5d8a4a"},
  environmental: {label:"Environmental", icon:"🌿", color:"#3f8a6a"},
  financial:     {label:"Financial",     icon:"🏦", color:"#b08a2e"},
  community:     {label:"Community",     icon:"🏡", color:"#a0607a"},
  closing:       {label:"Closing",       icon:"⭐", color:"#c99a2e"},
};

/* Color-blind friendly palette (based on Okabe & Ito), used when the Settings preference is on.
   Icons and labels always carry the meaning too, so color is never the only cue. */
const DIM_COLORS_STD = Object.fromEntries(Object.entries(DIMENSIONS).map(([k,d])=>[k,d.color]));
const DIM_COLORS_CVD = {  // chosen so every pair stays distinct under typical vision, deuteranopia, protanopia and tritanopia
  emotional:"#992288", physical:"#993300", spiritual:"#8811cc", social:"#5588cc", intellectual:"#1122ff",
  occupational:"#997744", environmental:"#006655", financial:"#bb7722", community:"#dd3388", closing:"#a87d00",
};
/* Large text: the phone's text size can make the root font much bigger than 16px. Width-based media queries don't see that,
   so mark the page and let CSS stack tight layouts instead of clipping text. */
function applyTextSize(){
  const px=parseFloat(getComputedStyle(document.documentElement).fontSize)||16, w=window.innerWidth/px; // viewport width in root ems
  const de=document.documentElement;
  de.classList.toggle("text-l", w<20);   // e.g. a phone with larger text (about 20px+ on a 390px screen)
  de.classList.toggle("text-xl", w<14);  // accessibility sizes (about 28px+)
}
applyTextSize(); addEventListener("resize",applyTextSize); addEventListener("pageshow",applyTextSize);
document.addEventListener("visibilitychange",()=>{ if(!document.hidden) applyTextSize(); });

function applyColorMode(mode){
  const cvd = mode==="cvd";
  document.documentElement.classList.toggle("cvd", cvd);
  for(const k in DIMENSIONS) DIMENSIONS[k].color = (cvd?DIM_COLORS_CVD:DIM_COLORS_STD)[k];
}
try{ applyColorMode(JSON.parse(localStorage.getItem("ir_prefs")||"{}").colorMode); }catch(e){} // before first paint

const FORMS = {
  morning: {
    title: "Morning Intention", icon: "🌅",
    sections: [
      {dim:"emotional", scale:{id:"emotional_scale", q:"How emotionally balanced do I feel this morning?", low:"Dysregulated", high:"Calm and Grounded"},
        prompts:[{id:"emotional_text", q:"What emotion is most present for me this morning, and how do I plan to support myself through it? If a 5, how do I maintain this emotion?"}]},
      {dim:"physical", scale:{id:"physical_scale", q:"How connected do I feel to my body's needs this morning?", low:"Disconnected", high:"Fully Attuned"},
        prompts:[{id:"physical_text", q:"What specific movement, rest, or nourishment can I offer myself today?"}]},
      {dim:"spiritual", scale:{id:"spiritual_scale", q:"How connected do I feel to my values or a sense of purpose?", low:"Disconnected", high:"Deeply Aligned"},
        prompts:[{id:"spiritual_text", q:"What intention, practice, or ritual will help me feel grounded today?"}]},
      {dim:"social", scale:{id:"social_scale", q:"How connected or supported do I feel in my relationships?", low:"Isolated", high:"Supported and Connected"},
        prompts:[{id:"social_text", q:"How can I show up today in a way that honors healthy connection and boundaries?"}]},
      {dim:"intellectual", scale:{id:"intellectual_scale", q:"How mentally engaged or curious do I feel this morning?", low:"Unfocused", high:"Engaged and Curious"},
        prompts:[{id:"intellectual_text", q:"What is something I can learn, read, or explore that will support my growth today?"}]},
      {dim:"occupational", scale:{id:"occupational_scale", q:"How purposeful or structured does my day feel?", low:"Drifting", high:"Purposeful and Structured"},
        prompts:[{id:"occupational_text", q:"What task, routine, or goal today will help me feel focused and fulfilled?"}]},
      {dim:"environmental", scale:{id:"environmental_scale", q:"How supported do I feel by my space/environment?", low:"Overwhelming", high:"Comforting and Supportive"},
        prompts:[{id:"environmental_text", q:"What is one way I can tidy, adjust, or tend to my environment today?"}]},
      {dim:"financial", scale:{id:"financial_scale", q:"How secure or mindful do I feel about finances today?", low:"Anxious", high:"Mindful and Secure"},
        prompts:[{id:"financial_text", q:"What financial habit or awareness can I carry with me today?"}]},
      {dim:"community",
        prompts:[{id:"community_text", q:"What is one way we can support or uplift our community today — as a group or in how we each show up?"}]},
    ]
  },
  night: {
    title: "Nightly Reflection", icon: "🌙",
    sections: [
      {dim:"emotional", scale:{id:"emotional_scale", q:"How well did I regulate and understand my emotions today?", low:"Overwhelmed", high:"Balanced and Insightful"},
        prompts:[{id:"emotional_text", q:"How did I respond to my emotions today, and what helped me feel regulated?"}]},
      {dim:"physical", scale:{id:"physical_scale", q:"How well did I care for my body's needs today?", low:"Low", high:"Nourished and Cared For"},
        prompts:[{id:"physical_text", q:"What helped me feel strong or rested?"},
                 {id:"sleep_text", q:"What sleep hygiene exercise will I engage in tonight?"}]},
      {dim:"spiritual", scale:{id:"spiritual_scale", q:"How grounded or connected did I feel today?", low:"Disconnected", high:"Grounded and Inspired"},
        prompts:[{id:"spiritual_text", q:"When did I feel most aligned with my values or beliefs today?"}]},
      {dim:"social", scale:{id:"social_scale", q:"How meaningful were my social connections today?", low:"Isolated", high:"Connected and Valued"},
        prompts:[{id:"social_text", q:"What moments of connection or boundary-setting stood out today?"}]},
      {dim:"intellectual", scale:{id:"intellectual_scale", q:"How mentally engaged or stimulated did I feel today?", low:"Low", high:"Inspired and Engaged"},
        prompts:[{id:"intellectual_text", q:"What did I learn, explore, or reflect on today?"}]},
      {dim:"occupational", scale:{id:"occupational_scale", q:"How purposeful did my day feel?", low:"Directionless", high:"Meaningful and Focused"},
        prompts:[{id:"occupational_text", q:"What gave me a sense of accomplishment or purpose today?"}]},
      {dim:"environmental", scale:{id:"environmental_scale", q:"How well did my space support me today?", low:"Distracting", high:"Supportive and Comfortable"},
        prompts:[{id:"environmental_text", q:"What did I notice or change about my environment today?"}]},
      {dim:"financial", scale:{id:"financial_scale", q:"How mindful was I with my finances today?", low:"Avoidant", high:"Mindful and Aligned"},
        prompts:[{id:"financial_text", q:"Did I take any steps toward financial awareness or responsibility today?"}]},
      {dim:"closing",
        prompts:[{id:"proud_text", q:"What's one thing I'm proud of today?"}]},
    ]
  }
};

/* =========================================================
   2. BADGES — add more by appending to this list.
   `test(s)` gets the stats object (see computeStats) and returns
   true when earned. `progress(s)` is optional: returns [current, goal].
   Badges reward showing up, never the ratings themselves.
   ========================================================= */
const BADGES = [
  {id:"first-light",  em:"🌅", name:"First Light",     desc:"Log your first morning intention", test:s=>s.mornings>=1},
  {id:"evening-glow", em:"🌙", name:"Evening Glow",    desc:"Log your first nightly reflection", test:s=>s.nights>=1},
  {id:"full-circle",  em:"⭕", name:"Full Circle",     desc:"Morning and night on the same day", test:s=>s.fullDays>=1},
  {id:"proud-first",  em:"💛", name:"Proud of You",    desc:"Name your first proud moment", test:s=>s.proud>=1},
  {id:"feelings-wheel", em:"🎡", name:"Name It to Tame It", desc:"Use the feelings wheel to name how you feel", test:s=>s.feelings>=1},
  {id:"backup-first", em:"💾", name:"Safe Keeping",   desc:"Download a backup of your entries", test:s=>s.backups>=1},
  {id:"home-screen",  em:"📱", name:"Right at Home",  desc:"Open Bookends from your Home Screen", test:s=>s.homeScreen>=1},
  {id:"share-first",  em:"🤝", name:"In This Together", desc:"Download a summary to share with your provider", test:s=>s.shares>=1},
  {id:"reminder-set", em:"⏰", name:"Friendly Reminder", desc:"Add a check-in reminder to your calendar", test:s=>s.reminders>=1},
  {id:"skill-first",  em:"🧰", name:"Toolbox",       desc:"Open a coping skill", test:s=>s.skills>=1},
  {id:"full-picture", em:"🎯", name:"Full Picture",    desc:"Rate every wellness area in one check-in", test:s=>s.allScales>=1},
  {id:"streak-2",     em:"✨", name:"Two in a Row",    desc:"Check in two days in a row", test:s=>s.longest>=2, progress:s=>[s.longest,2]},
  {id:"entries-5",    em:"🙌", name:"High Five",       desc:"5 total check-ins", test:s=>s.total>=5, progress:s=>[s.total,5]},
  {id:"aff-first",    em:"🌤️", name:"Open Mind",       desc:"Read your first daily affirmation", test:s=>s.affDays>=1},
  {id:"aff-3",        em:"☀️", name:"Sunny Streak",    desc:"Read affirmations 3 days in a row", test:s=>s.affLongest>=3, progress:s=>[s.affLongest,3]},
  {id:"aff-7",        em:"🌞", name:"Week of Light",   desc:"Read affirmations 7 days in a row", test:s=>s.affLongest>=7, progress:s=>[s.affLongest,7]},
  {id:"aff-30",       em:"🌈", name:"Daily Light",     desc:"Read affirmations 30 days in a row", test:s=>s.affLongest>=30, progress:s=>[s.affLongest,30]},
  {id:"aff-50",       em:"📖", name:"Well Read",       desc:"Read affirmations on 50 different days", test:s=>s.affDays>=50, progress:s=>[s.affDays,50]},
  {id:"aff-suggest",  em:"🌱", name:"Gentle Nudges",   desc:"Discover 10 different wellness suggestions", test:s=>s.affSuggest>=10, progress:s=>[s.affSuggest,10]},
  {id:"full-3",       em:"🎩", name:"Hat Trick",       desc:"3 full days with both check-ins", test:s=>s.fullDays>=3, progress:s=>[s.fullDays,3]},
  {id:"streak-3",     em:"🌱", name:"Sprouting",       desc:"3-day logging streak",   test:s=>s.longest>=3,   progress:s=>[s.longest,3]},
  {id:"streak-7",     em:"🌿", name:"Rooted",          desc:"7-day logging streak",   test:s=>s.longest>=7,   progress:s=>[s.longest,7]},
  {id:"streak-14",    em:"🪴", name:"Steady Growth",   desc:"14-day logging streak",  test:s=>s.longest>=14,  progress:s=>[s.longest,14]},
  {id:"streak-30",    em:"🌳", name:"Flourishing",     desc:"30-day logging streak",  test:s=>s.longest>=30,  progress:s=>[s.longest,30]},
  {id:"streak-60",    em:"🏔️", name:"Solid Ground",    desc:"60-day logging streak",  test:s=>s.longest>=60,  progress:s=>[s.longest,60]},
  {id:"streak-90",    em:"🌲", name:"Evergreen",       desc:"90-day logging streak",  test:s=>s.longest>=90,  progress:s=>[s.longest,90]},
  {id:"streak-180",   em:"🌄", name:"Half a Year",     desc:"180-day logging streak", test:s=>s.longest>=180, progress:s=>[s.longest,180]},
  {id:"streak-365",   em:"☀️", name:"Full Orbit",      desc:"365-day logging streak", test:s=>s.longest>=365, progress:s=>[s.longest,365]},
  {id:"bookends",     em:"📖", name:"Bookends",        desc:"7 days in a row with both check-ins", test:s=>s.longestFull>=7, progress:s=>[s.longestFull,7]},
  {id:"welcome-back", em:"🤗", name:"Welcome Back",    desc:"Return after a break of 3+ days. Coming back counts.", test:s=>s.comebacks>=1},
  {id:"early-riser",  em:"🐓", name:"Early Riser",     desc:"5 morning check-ins before 9 AM", test:s=>s.early>=5, progress:s=>[s.early,5]},
  {id:"proud-10",     em:"🏅", name:"Proud Moments",   desc:"Name 10 things you're proud of", test:s=>s.proud>=10, progress:s=>[s.proud,10]},
  {id:"thorough",     em:"🔍", name:"Leave No Stone",  desc:"Answer every question in a check-in", test:s=>s.complete>=1},
  {id:"entries-25",   em:"✍️", name:"Journaler",       desc:"25 total check-ins",  test:s=>s.total>=25,  progress:s=>[s.total,25]},
  {id:"entries-100",  em:"📚", name:"Devoted",         desc:"100 total check-ins", test:s=>s.total>=100, progress:s=>[s.total,100]},
  {id:"holiday-spirit", em:"🎁", name:"Holiday Spirit", desc:"Check in on 5 different holidays", test:s=>s.holidays>=5, progress:s=>[s.holidays,5]},
];

/* ---------- Monthly badges: one per calendar month with enough check-in days ---------- */
const MONTHLY_MIN_DAYS = 15;
const MONTH_EMOJI = ["❄️","💗","🍀","🌷","🌼","☀️","🏖️","🌻","🍎","🍂","🍁","⛄"];

/* ---------- Holiday badges: earned the first time you check in on each holiday ----------
   rule: {m,d} fixed date · {m,wd,n} nth weekday of month (wd 0=Sun, n=-1 last) · {easter:true} */
const HOLIDAYS = [
  {id:"new-year",          em:"🎆", name:"New Year's Day",          rule:{m:1,d:1}},
  {id:"valentines",        em:"💝", name:"Valentine's Day",         rule:{m:2,d:14}},
  {id:"easter",            em:"🐣", name:"Easter",                  rule:{easter:true}},
  {id:"mothers-day",       em:"💐", name:"Mother's Day",            rule:{m:5,wd:0,n:2}},
  {id:"memorial-day",      em:"🎗️", name:"Memorial Day",            rule:{m:5,wd:1,n:-1}},
  {id:"fathers-day",       em:"👔", name:"Father's Day",            rule:{m:6,wd:0,n:3}},
  {id:"independence-day",  em:"🎇", name:"Independence Day",        rule:{m:7,d:4}},
  {id:"labor-day",         em:"🛠️", name:"Labor Day",               rule:{m:9,wd:1,n:1}},
  {id:"mental-health-day", em:"💚", name:"World Mental Health Day", rule:{m:10,d:10}},
  {id:"halloween",         em:"🎃", name:"Halloween",               rule:{m:10,d:31}},
  {id:"veterans-day",      em:"🎖️", name:"Veterans Day",            rule:{m:11,d:11}},
  {id:"thanksgiving",      em:"🦃", name:"Thanksgiving",            rule:{m:11,wd:4,n:4}},
  {id:"christmas-eve",     em:"🕯️", name:"Christmas Eve",           rule:{m:12,d:24}},
  {id:"christmas",         em:"🎄", name:"Christmas",               rule:{m:12,d:25}},
  {id:"new-years-eve",     em:"🥂", name:"New Year's Eve",          rule:{m:12,d:31}},
];

/* =========================================================
   3. STORAGE — swap this layer for your own backend later.
   Interface: list() -> entries[], save(entry), remove(key)
   ========================================================= */
const LS_KEY = "ir_entries_v1";
const LocalStore = {
  kind:"local",
  _read(){ try{ return JSON.parse(localStorage.getItem(LS_KEY)||"{}"); }catch(e){ return {}; } },
  _write(o){ try{ localStorage.setItem(LS_KEY, JSON.stringify(o)); }catch(e){} },
  async list(){ return Object.values(this._read()); },
  async save(e){ const o=this._read(); o[e.key]=e; this._write(o); },
  async remove(k){ const o=this._read(); delete o[k]; this._write(o); },
};
function CloudStore(db, uid){
  const col = db.collection("data/users/"+uid);
  return {
    kind:"cloud",
    async list(){ const s = await col.get(); return s.docs.filter(d=>d.exists).map(d=>({...d.data()})); },
    async save(e){ await withRetry(()=>col.doc(e.key).set(e)); },
    async remove(k){ await withRetry(()=>col.doc(k).delete()); },
  };
}
async function withRetry(fn){
  try{ return await fn(); }
  catch(e){ if(e&&e.code==="unavailable"){ await new Promise(r=>setTimeout(r,400+Math.random()*600)); return fn(); } throw e; }
}
async function pickStore(){
  if(!window.claude || !window.claude.use) return LocalStore;
  const timeout = new Promise(r=>setTimeout(()=>r(null),10000));
  try{
    const [db,user] = await Promise.race([Promise.all([claude.use("db"), claude.use("user")]), timeout.then(()=>[null,null])]);
    if(!db||!user) return LocalStore;
    const uid = await user.id();
    if(!uid) return LocalStore;
    return CloudStore(db, uid);
  }catch(e){ return LocalStore; }
}

/* =========================================================
   4. DATE + STATS HELPERS
   ========================================================= */
const pad=n=>String(n).padStart(2,"0");
const ymd=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const parse=s=>{const [y,m,d]=s.split("-").map(Number);return new Date(y,m-1,d);};
const addDays=(s,n)=>{const d=parse(s);d.setDate(d.getDate()+n);return ymd(d);};
const today=()=>ymd(new Date());
const fmtDate=s=>parse(s).toLocaleDateString(undefined,{weekday:"short",month:"short",day:"numeric"});
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

function allQuestionIds(kind){
  const ids=[]; FORMS[kind].sections.forEach(s=>{ if(s.scale) ids.push(s.scale.id); s.prompts.forEach(p=>ids.push(p.id)); });
  return ids;
}
function isComplete(e){ return allQuestionIds(e.kind).every(id=>{const v=e.answers[id]; return v!==undefined && v!==null && String(v).trim()!=="";}); }

function runLength(dateSet, end){ let n=0, d=end; while(dateSet.has(d)){ n++; d=addDays(d,-1);} return n; }
function longestRun(dates){ // dates sorted asc unique
  let best=0,cur=0,prev=null;
  for(const d of dates){ cur = (prev && addDays(prev,1)===d) ? cur+1 : 1; best=Math.max(best,cur); prev=d; }
  return best;
}
function easterDate(y){ // Anonymous Gregorian algorithm
  const a=y%19,b=Math.floor(y/100),c=y%100,d=Math.floor(b/4),e=b%4,f=Math.floor((b+8)/25),g=Math.floor((b-f+1)/3),
        h=(19*a+b-d-g+15)%30,i=Math.floor(c/4),k=c%4,l=(32+2*e+2*i-h-k)%7,m=Math.floor((a+11*h+22*l)/451),
        mo=Math.floor((h+l-7*m+114)/31),da=((h+l-7*m+114)%31)+1;
  return new Date(y,mo-1,da);
}
function nthWeekday(y,m,wd,n){
  if(n>0){ const d=new Date(y,m-1,1); d.setDate(1+((wd-d.getDay()+7)%7)+7*(n-1)); return d; }
  const d=new Date(y,m,0); d.setDate(d.getDate()-((d.getDay()-wd+7)%7)); return d;
}
const _holidayCache={};
function holidayMap(y){
  if(_holidayCache[y]) return _holidayCache[y];
  const map={};
  for(const h of HOLIDAYS){ const r=h.rule; const d=r.easter?easterDate(y):r.d?new Date(y,r.m-1,r.d):nthWeekday(y,r.m,r.wd,r.n); (map[ymd(d)] ||= []).push(h); }
  return (_holidayCache[y]=map);
}
const holidaysOn=ds=>holidayMap(+ds.slice(0,4))[ds]||[];

// Badges generated from your data (monthly + holidays). Defined as they're earned.
const DYN_BADGES={};
const badgeList=()=>BADGES.concat(Object.values(DYN_BADGES));
function dynamicBadges(entries, out){
  const days=[...new Set(entries.map(e=>e.date))].filter(d=>d<=today()).sort();
  const byMonth={}; days.forEach(d=>(byMonth[d.slice(0,7)] ||= []).push(d));
  for(const [ym,ds] of Object.entries(byMonth)){
    if(ds.length<MONTHLY_MIN_DAYS) continue;
    const label=parse(ym+"-01").toLocaleDateString(undefined,{month:"long",year:"numeric"}), id="month-"+ym;
    DYN_BADGES[id]={id, em:MONTH_EMOJI[+ym.slice(5)-1], name:label, desc:`Checked in on ${MONTHLY_MIN_DAYS}+ days in ${label}`};
    out[id]=ds[MONTHLY_MIN_DAYS-1];
  }
  for(const d of days) for(const h of holidaysOn(d)){
    const id="holiday-"+h.id; if(out[id]) continue;
    DYN_BADGES[id]={id, em:h.em, name:h.name, desc:`You checked in on ${h.name}. Holidays can be a lot, and you still made time for yourself.`};
    out[id]=d;
  }
}
function monthProgress(){ // this month's progress toward its badge, for "next up" hints
  const ym=today().slice(0,7), n=new Set(S.entries.filter(e=>e.date.startsWith(ym)).map(e=>e.date)).size;
  if(n>=MONTHLY_MIN_DAYS) return null;
  const label=parse(ym+"-01").toLocaleDateString(undefined,{month:"long",year:"numeric"});
  return {b:{em:MONTH_EMOJI[+ym.slice(5)-1],name:label,desc:`Check in on ${MONTHLY_MIN_DAYS} days in ${label}`},c:n,g:MONTHLY_MIN_DAYS,r:n/MONTHLY_MIN_DAYS};
}
function nextUp(s,earned){
  const c=BADGES.filter(b=>!earned[b.id]&&b.progress).map(b=>{const [c,g]=b.progress(s);return {b,c,g,r:c/g};});
  const m=monthProgress(); if(m && m.c>0) c.push(m);
  return c.sort((a,b)=>b.r-a.r)[0];
}
function computeStats(entries, asOf=today()){
  const es = entries.filter(e=>e.date<=asOf);
  const byDate = {};
  es.forEach(e=>{ (byDate[e.date] ||= {})[e.kind]=e; });
  const dates = Object.keys(byDate).sort();
  const fullDates = dates.filter(d=>byDate[d].morning && byDate[d].night);
  const set = new Set(dates);
  const current = set.has(asOf) ? runLength(set, asOf) : runLength(set, addDays(asOf,-1));
  let comebacks=0; for(let i=1;i<dates.length;i++){ const gap=(parse(dates[i])-parse(dates[i-1]))/864e5; if(gap>=4) comebacks++; }
  const early = es.filter(e=>e.kind==="morning" && e.createdAt && ymd(new Date(e.createdAt))===e.date && new Date(e.createdAt).getHours()<9).length;
  return {
    total: es.length,
    mornings: es.filter(e=>e.kind==="morning").length,
    nights: es.filter(e=>e.kind==="night").length,
    fullDays: fullDates.length,
    current, longest: longestRun(dates), longestFull: longestRun(fullDates),
    comebacks, early,
    proud: es.filter(e=>e.kind==="night" && (e.answers.proud_text||"").trim()).length,
    backups: (S.backups||[]).filter(d=>d<=asOf).length,
    shares: (S.shares||[]).filter(d=>d<=asOf).length,
    reminders: Object.values(S.reminders||{}).filter(r=>r?.date && r.date<=asOf).length,
    skills: S.skillDate && S.skillDate<=asOf ? 1 : 0,
    homeScreen: S.homeDate && S.homeDate<=asOf ? 1 : 0,
    feelings: es.filter(e=>Array.isArray(e.answers.emotional_feelings) && e.answers.emotional_feelings.length).length,
    complete: es.filter(isComplete).length,
    holidays: new Set(dates.flatMap(d=>holidaysOn(d).map(h=>h.id))).size,
    allScales: es.filter(e=>FORMS[e.kind].sections.filter(x=>x.scale).every(x=>e.answers[x.scale.id])).length,
    ...affStats(asOf),
    byDate, dates,
  };
}
/* Affirmation reading history: S.affLog = { "YYYY-MM-DD": [ids revealed] } */
function affStats(asOf){
  const days=Object.keys(S.affLog||{}).filter(d=>d<=asOf && S.affLog[d].length).sort();
  const set=new Set(days), types={}; (AFF.data?.affirmations||[]).forEach(a=>types[a.id]=a.type);
  const sugg=new Set(); days.forEach(d=>S.affLog[d].forEach(id=>{ if(types[id]==="suggestion") sugg.add(id); }));
  return { affDays:days.length, affLongest:longestRun(days), affSuggest:sugg.size,
           affCurrent: set.has(asOf)?runLength(set,asOf):runLength(set,addDays(asOf,-1)) };
}
function earnedBadges(entries){
  // returns {badgeId: dateEarned}
  const out={}; const dates=[...new Set(entries.map(e=>e.date).concat(Object.keys(S.affLog||{}),S.backups||[],S.shares||[],Object.values(S.reminders||{}).map(r=>r.date).filter(Boolean),S.homeDate?[S.homeDate]:[],S.skillDate?[S.skillDate]:[]))].filter(d=>d<=today()).sort();
  for(const d of dates){
    const s=computeStats(entries,d);
    for(const b of BADGES) if(!out[b.id] && b.test(s)) out[b.id]=d;
    if(Object.keys(out).length===BADGES.length) break;
  }
  dynamicBadges(entries,out);
  return out;
}

/* =========================================================
   5. APP STATE + RENDERING
   ========================================================= */
const S = { histDay:null, affLog:{}, skillLog:{}, backups:[], homeDate:null, shares:[], reminders:{}, prefs:{affMode:"popup",colorMode:"standard",skillNudge:true,morningStart:5,morningEnd:12,nightStart:17,nightEnd:24}, store:null, entries:[], view:"today", form:null, cal:new Date() };
const $app = document.getElementById("app");

function scrollToHash(){
  const h=decodeURIComponent((location.hash||"").slice(1)); if(!/^about-[a-z-]+$/.test(h)) return false;
  if(S.view!=="about"){ S.view="about"; S.form=null; document.querySelectorAll("#tabs button").forEach(b=>b.classList.toggle("on",b.dataset.v==="about")); render(); }
  const el=document.getElementById(h); if(el){ el.scrollIntoView({behavior:"smooth",block:"start"}); el.classList.remove("flash"); void el.offsetWidth; el.classList.add("flash"); }
  return true;
}
window.addEventListener("hashchange",scrollToHash);
function setView(v){ if(v!=="about" && /^#about-/.test(location.hash)){ try{ history.replaceState(null,"",location.pathname+location.search); }catch(e){} }
  S.view=v; S.form=null; document.querySelectorAll("#tabs button").forEach(b=>b.classList.toggle("on",b.dataset.v===v)); render(); window.scrollTo(0,0); }
document.getElementById("tabs").addEventListener("click",e=>{ const b=e.target.closest("button"); if(b) setView(b.dataset.v); });

function getEntry(date,kind){ return S.entries.find(e=>e.date===date && e.kind===kind); }
function avgRating(e){ const v=Object.entries(e.answers).filter(([k])=>k.endsWith("_scale")).map(([,v])=>+v).filter(Boolean); return v.length?(v.reduce((a,b)=>a+b,0)/v.length):null; }

function render(){
  ({today:renderToday, skills:renderSkills, history:renderHistory, badges:renderBadges, settings:renderSettings, about:renderAbout})[S.view]();
  if(S.view==="today" && pendingCelebration.length && !S.form){ const b=pendingCelebration; pendingCelebration=[]; setTimeout(()=>celebrate(b,computeStats(S.entries)),250); }
  if(S.form) renderForm(); else closeSheet();
}

function renderToday(){
  const t=today(), s=computeStats(S.entries), m=getEntry(t,"morning"), n=getEntry(t,"night");
  const h=new Date().getHours(), morningOpen=isOpen("morning",h), nightOpen=isOpen("night",h);
  document.getElementById("greeting").textContent = h<12?"Good morning. What's your intention today?": h<18?"Good afternoon. Checking in with yourself?":"Good evening. Time to reflect on the day.";
  const earned=earnedBadges(S.entries);
  const days=[...Array(7)].map((_,i)=>addDays(t,i-6));
  $app.innerHTML = `
    <div class="grid stats">
      <div class="card stat streak"><div class="n">${s.current}🔥</div><div class="l">day streak</div></div>
      <div class="card stat"><div class="n">${s.longest}</div><div class="l">longest<span class="hide-sm"> streak</span></div></div>
      <div class="card stat"><div class="n">${s.total}</div><div class="l">check-ins</div></div>
      <button class="card stat stat-link" id="toBadges"><div class="n">${Object.keys(earned).length}🏅</div><div class="l">${Object.keys(earned).length===1?"badge":"badges"}<span class="hide-sm"> earned</span> <span class="go-arrow">→</span></div></button>
    </div>
    ${holidayBannerHTML(earned)}
    ${visitNudgeHTML()}
    ${S.prefs.affMode==="embedded"?affirmCardHTML():affEntryHTML()}
    <div class="grid checkins">
      ${ciCard("morning",m,morningOpen,"Set the tone for your day","Start check-in →",closedMsg("morning"))}
      ${ciCard("night",n,nightOpen,"Look back on how today went","Start reflection →",closedMsg("night"))}
    </div>
    ${skillLinkHTML()}
    <div class="card" style="margin-top:14px">
      <div class="shelf-head"><span class="small muted">Your week on the shelf</span>
        <span class="legend"><span><i style="background:var(--morning)"></i>Morning</span><span><i class="lg-n" style="background:var(--night)"></i>Night</span></span></div>
      ${shelfHTML(days,s,t)}
      ${nextBadgeHint(s,earned)}
    </div>
    ${storeNote()}
  `;
  $app.querySelectorAll("[data-open]:not([disabled])").forEach(b=>b.onclick=()=>openForm(b.dataset.open,t));
  scheduleWindowFlip();
  $app.querySelectorAll(".book[data-d]").forEach(b=>b.onclick=()=>dayPicker(b.dataset.d));
  document.getElementById("toBadges").onclick=()=>setView("badges");
  const ae=document.getElementById("affEntry"); if(ae) ae.onclick=()=>openAffSheet(false);
  if(S.prefs.affMode==="embedded") bindAffirm();
  const qb=document.getElementById("quickBackup"); if(qb) qb.onclick=downloadBackup;
  bindSkillLink();
}
/* Time windows (each person can change these in Settings):
   morning intention: midnight until prefs.morningEnd · nightly reflection: prefs.nightStart until midnight. 24h clock. */
/* Each check-in has its own window: start ≤ hour < end, 1–8 hours long, no overlap, ending by midnight (24). */
const WIN_MIN = 1, WIN_MAX = 8;
function win(kind){ const P=S.prefs; return kind==="morning" ? [P.morningStart,P.morningEnd] : [P.nightStart,P.nightEnd]; }
function isOpen(kind,h=new Date().getHours()){ const [a,b]=win(kind); return h>=a && h<b; }
function closedMsg(kind,h=new Date().getHours()){
  const [a,b]=win(kind); return h<a ? `Opens at ${hourLabel(a)}` : `Closed at ${hourLabel(b)} · back tomorrow`;
}
function fixWindows(p){ // keep every window valid: 1–8 hours, morning before night, night ends by midnight
  const cl=(v,lo,hi)=>Math.min(hi,Math.max(lo,v));
  p.morningStart=cl(p.morningStart,0,22);
  p.morningEnd=cl(p.morningEnd,p.morningStart+WIN_MIN,Math.min(p.morningStart+WIN_MAX,23));
  p.nightStart=cl(p.nightStart,p.morningEnd,23);
  p.nightEnd=cl(p.nightEnd,p.nightStart+WIN_MIN,Math.min(p.nightStart+WIN_MAX,24));
  return p;
}
const hourLabel=h=>h===12?"noon":h%24===0&&h?"midnight":new Date(2000,0,1,h).toLocaleTimeString(undefined,{hour:"numeric"});
function ciCard(kind,entry,open,blurb,cta,closedMsg){
  const F=FORMS[kind];
  if(entry) return `<button class="card ci ${kind} done ${open?"":"past"}" data-open="${kind}">
      <span class="ico">${F.icon}</span><span class="ci-title">${F.title}</span>
      <span class="st">Logged · avg ${avgRating(entry)?.toFixed(1)??"–"}/5</span>
      <span class="go">${open?"Review / edit →":"Review →"}</span></button>`;
  return `<button class="card ci ${kind} ${open?"":"closed"}" data-open="${kind}" ${open?"":"disabled aria-disabled=\"true\""}>
      <span class="ico">${F.icon}</span><span class="ci-title">${F.title}</span>
      <span class="st">${open?blurb:closedMsg}</span>
      ${open?`<span class="go">${cta}</span>`:""}</button>`;
}
// Re-render Today when the clock crosses midnight or the cutoff
let flipTimer=null;
function scheduleWindowFlip(){
  clearTimeout(flipTimer);
  const now=new Date(), next=new Date(now);
  const h=now.getHours(), b=[...win("morning"),...win("night")].filter(x=>x>h&&x<24).sort((a,c)=>a-c)[0];
  if(b!==undefined) next.setHours(b,0,5,0); else { next.setDate(next.getDate()+1); next.setHours(0,0,5,0); }
  flipTimer=setTimeout(()=>{ if(!S.form && S.view==="today") render(); }, next-now);
}
function holidayBannerHTML(earned){
  const hs=holidaysOn(today()); if(!hs.length) return "";
  const h=hs[0], got=earned["holiday-"+h.id] && S.entries.some(e=>e.date===today());
  return `<div class="note holiday">${h.em} <b>Happy ${h.name}.</b> ${got?"You checked in today. Be gentle with yourself and enjoy the day.":"Holidays can be a lot. A few minutes for yourself today earns a holiday badge."}</div>`;
}
/* Last 7 days as books on a shelf, between two bookends. Top of the spine = morning, bottom = night. */
function shelfHTML(days,s,t){
  const books=days.map(d=>{
    const r=s.byDate[d]||{}, m=!!r.morning, n=!!r.night;
    const h=66+(parseInt(d.slice(8),10)*7%4)*6;         // gentle height variety, stable per date
    const name=parse(d).toLocaleDateString(undefined,{weekday:"long",month:"short",day:"numeric"});
    const what=m&&n?"morning and night":m?"morning":n?"night":"no check-ins";
    return `<button class="book ${m||n?"":"empty"} ${d===t?"today":""}" data-d="${d}" style="height:${h}px" aria-label="${name}: ${what}">
        <span class="b-m ${m?"on":""}"></span><span class="b-n ${n?"on":""}"></span></button>`;
  }).join("");
  const labels=days.map(d=>`<span class="${d===t?"today":""}">${parse(d).toLocaleDateString(undefined,{weekday:"narrow"})}</span>`).join("");
  return `<div class="shelf"><span class="bookend l" aria-hidden="true"></span><div class="books">${books}</div><span class="bookend r" aria-hidden="true"></span></div>
    <div class="plank" aria-hidden="true"></div><div class="shelf-days">${labels}</div>`;
}
function nextBadgeHint(s,earned){
  const next = nextUp(s,earned);
  if(!next) return "";
  return `<div class="note">Next up: <b>${next.b.em} ${next.b.name}</b> — ${next.b.desc.toLowerCase()} (${Math.min(next.c,next.g)}/${next.g})</div>`;
}
function storeNote(){
  if(S.store.kind==="cloud") return "";
  const d=lastBackup(), days=d?Math.round((parse(today())-parse(d.slice(0,10)))/864e5):null;
  if(!S.entries.length || (days!==null && days<14)) return "";
  return `<div class="note warn backup-note">Entries are saved in this browser only. ${d?`Your last backup was ${days} days ago.`:"You haven't downloaded a backup yet."} <button class="linkbtn" id="quickBackup">Download backup</button></div>`;
}

/* =========================================================
   DAILY AFFIRMATIONS — content lives in data/affirmations.json.
   Counts are kept per visitor in their own browser (no server):
   how many affirmations they've revealed today and how many
   visits they've made today. Both reset at local midnight.
   ========================================================= */
const AFF_KEY="ir_affirm_v1";
const AFF={data:null};
const AFF_FALLBACK={ settings:{dailyLimit:3,visitNudgeAfter:5},
  affirmations:[{id:"f1",type:"affirmation",text:"Showing up for myself today, in any small way, is enough."},
                {id:"f2",type:"suggestion",text:"Step outside for five minutes and let daylight hit your face."},
                {id:"f3",type:"affirmation",text:"I am allowed to begin again, as many times as I need."}],
  breakReminders:["That's your affirmations for today. Time for a screen break."],
  visitNudges:["You've stopped by quite a few times today. Maybe step away from the screen for a while."] };
async function loadAffirmations(){
  try{ const r=await fetch("data/affirmations.json",{cache:"no-cache"}); if(!r.ok) throw 0; const d=await r.json(); if(!Array.isArray(d.affirmations)||!d.affirmations.length) throw 0; AFF.data=d; }
  catch(e){ AFF.data=AFF_FALLBACK; }
}
function affState(){
  let st=null; try{ st=JSON.parse(localStorage.getItem(AFF_KEY)||"null"); }catch(e){}
  if(!st||st.date!==today()) st={date:today(),shown:[],visits:0};
  return st;
}
function affSave(st){ try{ localStorage.setItem(AFF_KEY,JSON.stringify(st)); }catch(e){} }
function countVisit(){ // once per browser tab per day; reloading the same tab doesn't count again
  try{ if(sessionStorage.getItem("ir_visit")===today()) return; sessionStorage.setItem("ir_visit",today()); }catch(e){}
  const st=affState(); st.visits++; affSave(st);
}
function seeded(str){ let h=1779033703^str.length; for(let i=0;i<str.length;i++){h=Math.imul(h^str.charCodeAt(i),3432918353);h=h<<13|h>>>19;}
  return ()=>{ h=Math.imul(h^h>>>16,2246822507); h=Math.imul(h^h>>>13,3266489909); h^=h>>>16; return (h>>>0)/4294967296; }; }
function dailyOrder(){ // everyone gets the same order on the same day
  const list=AFF.data.affirmations, rnd=seeded("bookends-"+today()), idx=list.map((_,i)=>i);
  for(let i=idx.length-1;i>0;i--){ const j=Math.floor(rnd()*(i+1)); [idx[i],idx[j]]=[idx[j],idx[i]]; }
  return idx.map(i=>list[i]);
}
const pickByDay=(arr,salt=0)=>arr[(parseInt(today().replace(/-/g,""),10)+salt)%arr.length];
function untilTomorrow(){ const n=new Date(), m=new Date(n); m.setHours(24,0,0,0); const mins=Math.round((m-n)/6e4); return mins>=60?`${Math.floor(mins/60)}h ${mins%60}m`:`${mins}m`; }
function affLimit(){ return Math.max(1, +AFF.data.settings?.dailyLimit || 3); }
function visitNudgeHTML(){
  if(!AFF.data) return "";
  const st=affState(), after=+AFF.data.settings?.visitNudgeAfter||0;
  if(!after || st.visits<=after) return "";
  return `<div class="note nudge">🌿 ${esc(pickByDay(AFF.data.visitNudges||AFF_FALLBACK.visitNudges))} <span class="muted">(${st.visits} visits today)</span></div>`;
}
function affirmCardHTML(){
  if(!AFF.data) return "";
  const st=affState(), lim=affLimit(), order=dailyOrder(), n=Math.min(st.shown.length,lim);
  const idx=(AFF.viewIdx!=null && AFF.viewIdx<n) ? AFF.viewIdx : n-1;   // which of today's affirmations is on screen
  const dots=[...Array(lim)].map((_,i)=> i<n
      ? `<button class="aff-dot on ${i===idx?"cur":""}" data-i="${i}" aria-label="Show affirmation ${i+1}" ${i===idx?'aria-current="true"':""}></button>`
      : `<i></i>`).join("");
  const nav = n>1
    ? `<span class="aff-nav"><button class="aff-arrow" data-step="-1" ${idx===0?"disabled":""} aria-label="Previous affirmation">‹</button><span class="aff-dots">${dots}</span><button class="aff-arrow" data-step="1" ${idx===n-1?"disabled":""} aria-label="Next affirmation">›</button></span>`
    : `<span class="aff-dots" role="img" aria-label="${n} of ${lim} today">${dots}</span>`;
  const foot=`<div class="aff-foot">${nav}<span>${n} of ${lim} today · ${st.visits} visit${st.visits===1?"":"s"} today${(()=>{const c=affStats(today()).affCurrent;return c>1?` · ☀️ ${c}-day reading streak`:"";})()}</span></div>`;
  if(n===0) return `<section class="card aff" id="aff">
      <div class="aff-label">🌤️ Today's affirmation</div>
      <p class="aff-hint">A thought for your day is waiting. You get ${lim} a day, then it's time for a screen break.</p>
      <button class="btn" id="affReveal">Reveal today's affirmation</button>${foot}</section>`;
  const a=order[idx%order.length], D=a.area&&DIMENSIONS[a.area];
  const more = n<lim
    ? `<button class="btn ghost" id="affMore">One more <span class="muted">(${lim-n} left)</span></button>`
    : `<div class="aff-break"><b>📵 Time for a tech break</b><p>${esc(pickByDay(AFF.data.breakReminders||AFF_FALLBACK.breakReminders,n))}</p><span class="small muted">New affirmations in ${untilTomorrow()}</span></div>`;
  return `<section class="card aff ${a.type==="suggestion"?"sugg":""}" id="aff">
      <div class="aff-label">${a.type==="suggestion"?"🌱 Wellness suggestion":"🌤️ Today's affirmation"}${D?` <span class="aff-area" style="--dc:${D.color}">${D.icon} ${D.label}</span>`:""}${n>1?` <span class="aff-pos">${idx+1} of ${n}</span>`:""}</div>
      <blockquote class="aff-text">${esc(a.text)}</blockquote>
      ${a.source?.url&&/^https:\/\//.test(a.source.url)?`<a class="aff-src" href="${esc(a.source.url)}" target="_blank" rel="noopener noreferrer">Inspired by ${esc(a.source.name||"source")} ↗</a>`:""}
      ${more}${foot}</section>`;
}
const AFF_META_KEY="meta_affirmations";
/* Days a backup was downloaded (for the Safe Keeping badge). Not part of the backup file itself. */
const BACKUPS_META_KEY="meta_backups";
/* First day Bookends was opened from the Home Screen (installed web app), for the Right at Home badge. */
const HOME_META_KEY="meta_homescreen";
const isHomeScreenApp=()=>{ try{ return navigator.standalone===true || matchMedia("(display-mode: standalone)").matches || matchMedia("(display-mode: fullscreen)").matches; }catch(e){ return false; } };
function noteHomeScreen(){ // returns any badges this newly earns
  if(S.homeDate || !isHomeScreenApp()) return [];
  const before=earnedBadges(S.entries); S.homeDate=today();
  const doc={key:HOME_META_KEY,kind:"meta",date:S.homeDate,updatedAt:new Date().toISOString(),v:1};
  affSaving=affSaving.then(()=>S.store.save(doc)).catch(()=>{});
  const after=earnedBadges(S.entries); return badgeList().filter(b=>after[b.id]&&!before[b.id]);
}
/* Days a provider summary (report or data) was downloaded, for the In This Together badge. */
const SHARES_META_KEY="meta_shares";
function noteShare(){ // records today and celebrates any new badge; returns true if one was shown
  const before=earnedBadges(S.entries);
  if(!(S.shares||[]).includes(today())){ S.shares=[...(S.shares||[]),today()].sort();
    const doc={key:SHARES_META_KEY,kind:"meta",days:S.shares,updatedAt:new Date().toISOString(),v:1};
    affSaving=affSaving.then(()=>S.store.save(doc)).catch(()=>{}); }
  const after=earnedBadges(S.entries), fresh=badgeList().filter(b=>after[b.id]&&!before[b.id]);
  if(fresh.length){ if(!S.form) render(); celebrate(fresh,computeStats(S.entries)); return true; }
  return false;
}
/* Calendar reminders: a repeating daily event (.ics) at the start of a check-in window. No server involved.
   S.reminders = { morning:{hour, date}, night:{hour, date} } remembers what was set, for the status line and the badge. */
const REMINDERS_META_KEY="meta_reminders";
let pendingCelebration=[];   // badges to celebrate the next time the Today screen shows
function icsText(kind){
  const [a,b]=win(kind), now=new Date(), pad=n=>String(n).padStart(2,"0");
  const start=`${today().replace(/-/g,"")}T${pad(a)}0000`;   // floating local time, so it follows the phone's time zone
  const stamp=now.toISOString().replace(/[-:]/g,"").replace(/\.\d+/,"");
  const esc=t=>t.replace(/\\/g,"\\\\").replace(/([,;])/g,"\\$1").replace(/\n/g,"\\n");
  const until=b===24?"midnight":hourLabel(b), url=location.origin.startsWith("http")?location.origin+"/":"https://bookends.day/";
  const title=kind==="morning"?"🌅 Morning intention":"🌙 Nightly reflection";
  const body=kind==="morning"?`Your morning window is open until ${until}. Take a few minutes to set an intention. ${url}`:`Your evening window is open until ${until}. Take a few minutes to look back on today. ${url}`;
  return ["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//Bookends//Reminders//EN","CALSCALE:GREGORIAN","METHOD:PUBLISH",
    "BEGIN:VEVENT",`UID:bookends-${kind}-reminder@bookends.day`,`DTSTAMP:${stamp}`,`DTSTART:${start}`,"DURATION:PT15M","RRULE:FREQ=DAILY",
    `SUMMARY:${esc(title)}`,`DESCRIPTION:${esc(body)}`,`URL:${url}`,"TRANSP:TRANSPARENT",
    "BEGIN:VALARM","ACTION:DISPLAY",`DESCRIPTION:${esc(title)}`,"TRIGGER:PT0M","END:VALARM",
    "END:VEVENT","END:VCALENDAR",""].join("\r\n");
}
async function setReminder(kind){
  const ok=await saveFile(`bookends-${kind}-reminder.ics`, icsText(kind), "text/calendar");
  if(!ok) return;
  const before=earnedBadges(S.entries);
  S.reminders={...(S.reminders||{}), [kind]:{hour:win(kind)[0], date:(S.reminders?.[kind]?.date)||today()}};
  const doc={key:REMINDERS_META_KEY,kind:"meta",reminders:S.reminders,updatedAt:new Date().toISOString(),v:1};
  affSaving=affSaving.then(()=>S.store.save(doc)).catch(()=>{});
  const after=earnedBadges(S.entries), fresh=badgeList().filter(b=>after[b.id]&&!before[b.id]);
  if(fresh.length) pendingCelebration.push(...fresh);
  render();
  toast(`${kind==="morning"?"Morning":"Nightly"} reminder downloaded. Open it to add it to your calendar.`);
}
function reminderStatus(kind){
  const r=S.reminders?.[kind], a=win(kind)[0];
  if(!r) return `Goes off every day at ${hourLabel(a)}, when the window opens.`;
  if(r.hour!==a) return `Your window now opens at ${hourLabel(a)}. Set it again to update, then delete the old ${hourLabel(r.hour)} reminder from your calendar.`;
  return `✓ Set for ${hourLabel(a)}. Tap again if you need to re-add it.`;
}
function saveBackupLog(){ const doc={key:BACKUPS_META_KEY,kind:"meta",days:S.backups,updatedAt:new Date().toISOString(),v:1};
  affSaving=affSaving.then(()=>S.store.save(doc)).catch(()=>{}); }
let affSaving=Promise.resolve();
function saveAffLog(){ // one write at a time; kept with the user's entries (synced on the Claude-hosted copy)
  const doc={key:AFF_META_KEY,kind:"meta",days:S.affLog,updatedAt:new Date().toISOString(),v:1};
  affSaving=affSaving.then(()=>S.store.save(doc)).catch(()=>{});
}
function revealAffirmation(){
  const st=affState(), lim=affLimit(); if(st.shown.length>=lim) return;
  const order=dailyOrder(), id=order[st.shown.length%order.length].id; st.shown.push(id); affSave(st); AFF.viewIdx=null;
  const before=earnedBadges(S.entries);
  const day=today(); S.affLog[day]=[...new Set([...(S.affLog[day]||[]),id])]; saveAffLog();
  const now=earnedBadges(S.entries), fresh=badgeList().filter(b=>now[b.id] && !before[b.id]);
  const el=document.getElementById("aff"); if(el){ el.outerHTML=affirmCardHTML(); document.getElementById("aff").classList.add("aff-in"); bindAffirm(); }
  refreshAffEntry();
  if(!fresh.length) return;
  if(affBg){ affPendingBadges.push(...fresh); return; } // celebrate after the pop-up closes
  setTimeout(()=>{ if(!S.form && S.view==="today"){ const y=scrollY; render(); scrollTo(0,y); } celebrate(fresh,computeStats(S.entries)); },450);
}
let affPendingBadges=[];
function bindAffirm(){
  const r=document.getElementById("affReveal"); if(r) r.onclick=revealAffirmation;
  const m=document.getElementById("affMore"); if(m) m.onclick=revealAffirmation;
  const show=i=>{ AFF.viewIdx=i; const el=document.getElementById("aff"); if(!el) return; el.outerHTML=affirmCardHTML(); document.getElementById("aff").classList.add("aff-in"); bindAffirm(); };
  document.querySelectorAll("#aff .aff-dot[data-i]").forEach(b=>b.onclick=()=>show(+b.dataset.i));
  document.querySelectorAll("#aff .aff-arrow[data-step]").forEach(b=>b.onclick=()=>{
    const st=affState(), n=Math.min(st.shown.length,affLimit()); const cur=(AFF.viewIdx!=null&&AFF.viewIdx<n)?AFF.viewIdx:n-1;
    show(Math.max(0,Math.min(n-1,cur+(+b.dataset.step))));
  });
}

/* Compact row on the Today screen; the affirmation itself opens in a pop-up */
function affEntryHTML(){
  if(!AFF.data || S.prefs.affMode!=="popup") return "";
  const st=affState(), lim=affLimit(), n=Math.min(st.shown.length,lim);
  const sub = n===0 ? "A thought for your day is waiting"
            : n<lim ? `${n} of ${lim} read today · tap for another`
            : "All set for today · tap to see it again";
  return `<button class="card aff-entry ${n>=lim?"done":""}" id="affEntry">
      <span class="ae-ico">🌤️</span>
      <span class="ae-txt"><b>Today's affirmation</b><span class="small muted">${sub}</span></span>
      <span class="ae-go">${n===0?"Open":"View"} →</span></button>`;
}
function refreshAffEntry(){
  const el=document.getElementById("affEntry"); if(!el) return;
  el.outerHTML=affEntryHTML(); const ne=document.getElementById("affEntry"); if(ne) ne.onclick=()=>openAffSheet(false);
}
let affBg=null;
function openAffSheet(autoReveal){
  if(!AFF.data || S.prefs.affMode!=="popup") return;
  AFF.viewIdx=null;
  closeAffSheet(true);
  affBg=document.createElement("div"); affBg.className="sheet-bg aff-bg";
  affBg.innerHTML=`<div class="sheet aff-sheet" role="dialog" aria-modal="true" aria-labelledby="aff-title">
      <div class="sheet-head"><div class="sheet-title"><span class="sheet-ico">🌤️</span><div><h2 id="aff-title">Today's affirmation</h2></div></div>
        <button class="xbtn" id="affClose" aria-label="Close">✕</button></div>
      <div class="sheet-body">${affirmCardHTML()}</div>
      <div class="sheet-foot"><span class="small muted" style="margin-right:auto">Pops up once a day. <button class="linkbtn" id="affPrefs">Change</button></span><button class="btn" id="affDone">Close</button></div>
    </div>`;
  affBg.addEventListener("mousedown",e=>{ if(e.target===affBg) closeAffSheet(); });
  document.body.appendChild(affBg); document.body.classList.add("noscroll");
  affBg.querySelector("#affClose").onclick=affBg.querySelector("#affDone").onclick=()=>closeAffSheet();
  const pr=affBg.querySelector("#affPrefs"); if(pr) pr.onclick=()=>{ closeAffSheet(); setView("settings"); };
  bindAffirm();
  if(autoReveal && affState().shown.length===0) setTimeout(revealAffirmation,350);
}
function closeAffSheet(instant){
  if(!affBg) return; const bg=affBg; affBg=null;
  if(!S.form) document.body.classList.remove("noscroll");
  if(instant) return bg.remove();
  bg.classList.add("closing"); setTimeout(()=>bg.remove(),180);
  if(affPendingBadges.length){
    const fresh=affPendingBadges; affPendingBadges=[];
    setTimeout(()=>{ if(!S.form && S.view==="today"){ const y=scrollY; render(); scrollTo(0,y); } celebrate(fresh,computeStats(S.entries)); },250);
  }
}
document.addEventListener("keydown",e=>{ if(e.key==="Escape" && affBg && !modalEl){ e.preventDefault(); closeAffSheet(); } });
function maybeAutoAffirm(){ // once per day, on the first visit, unless turned off in Settings
  if(!AFF.data || S.prefs.affMode!=="popup" || S.view!=="today" || S.form) return;
  const st=affState(); if(st.autoShown || st.shown.length) return;
  st.autoShown=true; affSave(st);
  setTimeout(()=>openAffSheet(true),700);
}

/* ---------- Preferences (kept with the user's data; synced on the Claude-hosted copy) ---------- */
const PREFS_KEY="meta_prefs";
const DEFAULT_PREFS={affMode:"popup", colorMode:"standard", skillNudge:true, morningStart:5, morningEnd:12, nightStart:17, nightEnd:24};
const AFF_MODES=["off","embedded","popup"];
function normalizePrefs(p){ // also upgrades the earlier on/off switches
  const out={...DEFAULT_PREFS, ...p};
  if(!AFF_MODES.includes(out.affMode)) out.affMode = p.affEnabled===false ? "off" : "popup";
  if(!("affMode" in p) && p.affEnabled===false) out.affMode="off";
  if(!["standard","cvd"].includes(out.colorMode)) out.colorMode="standard";
  out.skillNudge = out.skillNudge!==false;
  for(const k of ["morningStart","morningEnd","nightStart","nightEnd"]) out[k]=Number.isInteger(+out[k])?+out[k]:DEFAULT_PREFS[k];
  fixWindows(out);
  delete out.affEnabled; delete out.affAuto; return out;
}
function savePrefs(){
  try{ localStorage.setItem("ir_prefs",JSON.stringify(S.prefs)); }catch(e){}
  const doc={key:PREFS_KEY,kind:"meta",prefs:S.prefs,updatedAt:new Date().toISOString(),v:1};
  affSaving=affSaving.then(()=>S.store.save(doc)).catch(()=>{});
}

/* ---------- Form: a pop-up window, one wellness area per step ---------- */
let sheetBg=null;
function sheetEl(){
  if(!sheetBg){
    sheetBg=document.createElement("div"); sheetBg.className="sheet-bg";
    sheetBg.innerHTML=`<div class="sheet" role="dialog" aria-modal="true" aria-labelledby="sheet-title"></div>`;
    sheetBg.addEventListener("mousedown",e=>{ if(e.target===sheetBg) requestClose(); });
    document.body.appendChild(sheetBg); document.body.classList.add("noscroll");
  }
  return sheetBg.querySelector(".sheet");
}
function closeSheet(){
  if(!sheetBg) return;
  const bg=sheetBg; sheetBg=null; document.body.classList.remove("noscroll"); document.onkeydown=null;
  bg.classList.add("closing"); setTimeout(()=>bg.remove(),180);
}
function requestClose(){
  if(!S.form) return closeSheet();
  if(S.form.dirty) confirmBox("Discard this check-in?","Your answers haven't been saved yet.","Discard",()=>{S.form=null;render();});
  else { S.form=null; render(); }
}
function openForm(kind,date,step=0){
  const ex=getEntry(date,kind);
  S.form={kind,date,answers:{...(ex?.answers||{})},existing:!!ex,step,dirty:false,readOnly:date<today() || (date===today() && !isOpen(kind)),ideas:{},wheelCore:null,wheelOpen:false}; // locked once its window has closed (and on finished days). A check-in started while open can still be saved after the window closes.
  const F=S.form; F.feel=Array.isArray(F.answers[FEEL_KEY])?[...F.answers[FEEL_KEY]]:[]; F.feelLine=feelLine(F.feel,F.kind);
  renderForm();
}
const hasVal=v=>v!==undefined && v!==null && String(v).trim()!=="";
function sectionIds(sec){ return (sec.scale?[sec.scale.id]:[]).concat(sec.prompts.map(p=>p.id)); }
function goStep(n,dir){
  const F=S.form, N=FORMS[F.kind].sections.length;
  F.step=Math.max(0,Math.min(N-1,n)); F.dir=dir; renderForm();
}
/* ---------- Writing help: hints, tap-to-add ideas (data/suggestions.json) and the feelings wheel ---------- */
const SUG={data:null};
async function loadSuggestions(){
  try{ const r=await fetch("data/suggestions.json",{cache:"no-cache"}); if(!r.ok) throw 0; SUG.data=await r.json(); }
  catch(e){ SUG.data=null; }   // no file, no ideas: the form still works with a plain placeholder
}
const sugFor=(kind,pid)=>SUG.data?.prompts?.[kind]?.[pid]||null;
function pickIdeas(kind,pid,avoid=[]){   // pinned ideas always come first, then a random few
  const sg=sugFor(kind,pid), pinned=sg?.pinned||[], pool=(sg?.ideas||[]).filter(t=>!pinned.includes(t)), n=SUG.data?.settings?.shown||3;
  for(let i=pool.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [pool[i],pool[j]]=[pool[j],pool[i]]; }
  const fresh=pool.filter(t=>!avoid.includes(t));
  return pinned.concat((fresh.length>=n?fresh:pool).slice(0,n));
}
function ideasHTML(F,pid){
  const shown=F.ideas[pid]; if(!shown?.length) return "";
  const val=F.answers[pid]||"";
  return `<div class="ideas" data-for="${pid}"><span class="ideas-label">Ideas</span>${shown.map(t=>{ const on=val.includes(t);
    return `<button type="button" class="idea ${on?"on":""}" data-t="${esc(t)}" aria-pressed="${on}">${on?"✓":"+"} ${esc(t)}</button>`; }).join("")}
    <button type="button" class="idea-more" data-more="${pid}" aria-label="More ideas">↻ More</button></div>`;
}
function addIdea(F,v,t){
  v=v.replace(/\s+$/,""); if(!v) return t;
  const sep = F.feelLine && v===F.feelLine ? "\n" : /[.!?]$/.test(v) ? " " : ". ";
  return v+sep+t;
}
function removeIdea(v,t){
  const i=v.indexOf(t); if(i<0) return v;
  return (v.slice(0,i)+v.slice(i+t.length)).replace(/^[ .]+/,"").replace(/\. *\./g,".").replace(/ {2,}/g," ").replace(/\s+$/,"");
}
/* Feelings wheel: pick up to 3 words; they become the first line of the emotional answer. */
const WHEEL_ID="emotional_text", FEEL_KEY="emotional_feelings";
const wheelData=()=>SUG.data?.feelingsWheel?.groups?.length?SUG.data.feelingsWheel:null;
function feelLine(list,kind){ if(!list.length) return ""; const w=list.length===1?list[0]:list.slice(0,-1).join(", ")+" and "+list[list.length-1]; return kind==="night"?`Today I felt ${w}.`:`Feeling ${w}.`; }
function wheelHTML(F){
  const W=wheelData(), max=W.max||3, G=W.groups, n=G.length, cx=110, cy=110, R=104, r=44;
  const pt=(a,rad)=>[cx+rad*Math.cos(a), cy+rad*Math.sin(a)];
  const wedges=G.map((g,i)=>{
    const a0=-Math.PI/2+i*2*Math.PI/n, a1=a0+2*Math.PI/n, am=(a0+a1)/2, act=F.wheelCore===i;
    const off=act?6:0, dx=off*Math.cos(am), dy=off*Math.sin(am);
    const [x0,y0]=pt(a0,R),[x1,y1]=pt(a1,R),[x2,y2]=pt(a1,r),[x3,y3]=pt(a0,r),[tx,ty]=pt(am,(R+r)/2);
    const picked=G[i].feelings.filter(f=>F.feel.includes(f)).length;
    return `<g class="wedge ${act?"on":""}" data-core="${i}" transform="translate(${dx.toFixed(1)} ${dy.toFixed(1)})" role="button" tabindex="0" aria-label="${esc(g.core)}">
      <path d="M${x0},${y0}A${R},${R} 0 0 1 ${x1},${y1}L${x2},${y2}A${r},${r} 0 0 0 ${x3},${y3}Z" fill="${g.color}"/>
      <text x="${tx}" y="${ty+4}" text-anchor="middle">${esc(g.core)}${picked?" •":""}</text></g>`;
  }).join("");
  const core=F.wheelCore!=null?G[F.wheelCore]:null;
  return `<div class="wheel-wrap">
    <svg class="wheel" viewBox="0 0 220 220" aria-label="Feelings wheel">${wedges}
      <circle cx="${cx}" cy="${cy}" r="${r-4}" class="wheel-hub"/><text x="${cx}" y="${cy-2}" text-anchor="middle" class="hub-n">${F.feel.length}/${max}</text>
      <text x="${cx}" y="${cy+13}" text-anchor="middle" class="hub-t">chosen</text></svg>
    <div class="wheel-side">
      ${core?`<div class="small muted">${esc(core.core)} feelings. Tap up to ${max} that fit.</div>
        <div class="feel-list" style="--fc:${core.color}">${core.feelings.map(f=>`<button type="button" class="feel ${F.feel.includes(f)?"on":""}" data-f="${esc(f)}" aria-pressed="${F.feel.includes(f)}">${esc(f)}</button>`).join("")}</div>`
        :`<div class="small muted">Tap a color on the wheel to see more specific feelings, then pick up to ${max} that fit.</div>`}
      ${F.feel.length?`<div class="feel-chosen">${F.feel.map(f=>`<button type="button" class="feel on" data-f="${esc(f)}" aria-label="Remove ${esc(f)}">${esc(f)} ✕</button>`).join("")}</div>`:""}
    </div></div>`;
}
function renderForm(){
  const F=S.form, def=FORMS[F.kind], N=def.sections.length, sec=def.sections[F.step], D=DIMENSIONS[sec.dim];
  const last=F.step===N-1, $s=sheetEl();
  $s.className=`sheet ${F.kind}`;
  $s.innerHTML = `
    <div class="sheet-head">
      <div class="sheet-title"><span class="sheet-ico">${def.icon}</span>
        <div><h2 id="sheet-title">${def.title}</h2>
        <span class="sheet-date">${F.date===today()?"Today · ":""}${fmtDate(F.date)}${F.readOnly?` · <span class="ro-tag">🔒 Read only</span>`:""}</span></div></div>
      <button class="xbtn" id="back" aria-label="Close">✕</button>
    </div>
    <div class="steps" role="group" aria-label="Steps">${def.sections.map((x,i)=>{const XD=DIMENSIONS[x.dim]; const done=sectionIds(x).some(id=>hasVal(F.answers[id]));
      return `<button class="stepdot ${i===F.step?"cur":""} ${done?"done":""}" style="--dc:${XD.color}" data-step="${i}" title="${XD.label}" aria-label="${XD.label}${done?", answered":""}" ${i===F.step?'aria-current="step"':""}>${XD.icon}</button>`;}).join("")}</div>
    <div class="sheet-body">
      <div class="stepcount">Step ${F.step+1} of ${N}</div>
      <section class="dim step-in ${F.dir==="back"?"from-left":""}" style="--dc:${D.color}">
        <h3><span>${D.icon}</span>${D.label}${sec.dim==="closing"?"":" Wellness"}</h3>
        ${sec.scale?`<div class="q"><label class="qt">${esc(sec.scale.q)}</label>
          <div class="scale" data-id="${sec.scale.id}">${[1,2,3,4,5].map(v=>`<button type="button" data-v="${v}" class="${+F.answers[sec.scale.id]===v?"on":""}" aria-label="${v}" ${F.readOnly?"disabled":""}>${v}</button>`).join("")}</div>
          <div class="anchors"><span>1 = ${esc(sec.scale.low)}</span><span>5 = ${esc(sec.scale.high)}</span></div></div>`:""}
        ${sec.prompts.map(p=>{ const sg=sugFor(F.kind,p.id), wheel=!F.readOnly && p.id===WHEEL_ID && wheelData();
          if(!F.readOnly && sg && !F.ideas[p.id]) F.ideas[p.id]=pickIdeas(F.kind,p.id);
          return `<div class="q"><label class="qt" for="${p.id}">${esc(p.q)}</label>
          ${wheel?`<button type="button" class="wheel-toggle ${F.wheelOpen?"open":""}" aria-expanded="${F.wheelOpen}">🎡 ${F.wheelOpen?"Hide the feelings wheel":"Name it with the feelings wheel"}</button>
            <div class="wheel-panel" ${F.wheelOpen?"":"hidden"}>${F.wheelOpen?wheelHTML(F):""}</div>`:""}
          <textarea id="${p.id}" data-id="${p.id}" placeholder="${F.readOnly?"No answer":esc(sg?.hint?sg.hint+" Or skip.":"Write freely… or skip")}" ${F.readOnly?"readonly":""}>${esc(F.answers[p.id]||"")}</textarea>
          ${F.readOnly?"":ideasHTML(F,p.id)}</div>`; }).join("")}
      </section>
      ${F.existing&&!last&&!F.readOnly?`<div style="text-align:right;margin-top:10px"><button class="linkbtn" id="savenow">Save changes now</button></div>`:""}
    </div>
    <div class="sheet-foot">
      ${F.existing&&last&&!F.readOnly?`<button class="btn danger" id="del" style="margin-right:auto">Delete</button>`:""}
      <button class="btn ghost" id="prev" ${F.step===0?"disabled":""}>← Back</button>
      ${last
        ?(F.readOnly?`<button class="btn" id="roClose">Close</button>`:`<button class="btn" id="save">${F.existing?"Save changes":"Complete ✓"}</button>`)
        :`<button class="btn" id="next">Next: ${DIMENSIONS[def.sections[F.step+1].dim].label} →</button>`}
    </div>`;
  $s.querySelector(".sheet-body").scrollTop=0;
  $s.querySelector(".stepdot.cur")?.scrollIntoView({block:"nearest",inline:"nearest"});
  if(!$s.contains(document.activeElement)) setTimeout(()=>{ if(sheetBg && !$s.contains(document.activeElement)) $s.focus({preventScroll:true}); },0);
  const rc=$s.querySelector("#roClose"); if(rc) rc.onclick=()=>{ S.form=null; render(); };
  const refreshDot=()=>{ if(F.readOnly) return; F.dirty=true; const dot=$s.querySelector(`.stepdot[data-step="${F.step}"]`); dot.classList.toggle("done",sectionIds(sec).some(id=>hasVal(F.answers[id]))); };
  $s.querySelectorAll(".scale").forEach(el=>el.onclick=e=>{
    if(F.readOnly) return;
    const b=e.target.closest("button"); if(!b) return;
    const v=+b.dataset.v; const id=el.dataset.id;
    F.answers[id] = (+F.answers[id]===v)?undefined:v;
    el.querySelectorAll("button").forEach(x=>x.classList.toggle("on",+x.dataset.v===F.answers[id]));
    refreshDot();
  });
  const syncIdeas=pid=>{ const box=$s.querySelector(`.ideas[data-for="${pid}"]`); if(box) box.outerHTML=ideasHTML(F,pid); bindIdeas(); };
  const setText=(pid,v)=>{ const ta=$s.querySelector(`textarea[data-id="${pid}"]`); ta.value=v; F.answers[pid]=v; refreshDot(); syncIdeas(pid); };
  $s.querySelectorAll("textarea").forEach(t=>t.oninput=()=>{F.answers[t.dataset.id]=t.value; refreshDot(); syncIdeas(t.dataset.id); t.focus();});
  function bindIdeas(){
    $s.querySelectorAll(".ideas").forEach(box=>{ const pid=box.dataset.for;
      box.querySelectorAll(".idea").forEach(b=>b.onclick=()=>{ const t=b.dataset.t, v=F.answers[pid]||"";
        setText(pid, v.includes(t)?removeIdea(v,t):addIdea(F,v,t)); });
      box.querySelector(".idea-more").onclick=()=>{ // keep the ideas already added, swap out the rest
        const pinned=sugFor(F.kind,pid)?.pinned||[], n=(SUG.data?.settings?.shown||3)+pinned.length;
        const keep=[...new Set(pinned.concat(F.ideas[pid].filter(t=>(F.answers[pid]||"").includes(t))))];
        F.ideas[pid]=keep.concat(pickIdeas(F.kind,pid,F.ideas[pid]).filter(t=>!keep.includes(t))).slice(0,Math.max(n,keep.length+1)); syncIdeas(pid); };
    });
  }
  bindIdeas();
  // feelings wheel
  const wt=$s.querySelector(".wheel-toggle");
  const drawWheel=()=>{ const panel=$s.querySelector(".wheel-panel"); panel.hidden=!F.wheelOpen; panel.innerHTML=F.wheelOpen?wheelHTML(F):"";
    wt.classList.toggle("open",F.wheelOpen); wt.setAttribute("aria-expanded",F.wheelOpen); wt.textContent=`🎡 ${F.wheelOpen?"Hide the feelings wheel":"Name it with the feelings wheel"}`;
    panel.querySelectorAll(".wedge").forEach(g=>{ const go=()=>{ F.wheelCore=+g.dataset.core; drawWheel(); }; g.onclick=go; g.onkeydown=e=>{ if(e.key==="Enter"||e.key===" "){ e.preventDefault(); go(); } }; });
    panel.querySelectorAll(".feel").forEach(b=>b.onclick=()=>toggleFeel(b.dataset.f)); };
  function toggleFeel(f){
    const max=wheelData().max||3;
    if(F.feel.includes(f)) F.feel=F.feel.filter(x=>x!==f);
    else if(F.feel.length>=max) return toast(`Pick up to ${max}. Tap one you chose to swap it out.`);
    else F.feel=[...F.feel,f];
    const ta=$s.querySelector(`textarea[data-id="${WHEEL_ID}"]`); let v=ta.value;
    if(F.feelLine && v.startsWith(F.feelLine)) v=v.slice(F.feelLine.length).replace(/^[ \n]+/,"");
    F.feelLine=feelLine(F.feel,F.kind);
    F.answers[FEEL_KEY]=F.feel.length?[...F.feel]:undefined;
    setText(WHEEL_ID, F.feelLine?(v?F.feelLine+"\n"+v:F.feelLine):v);
    drawWheel();
  }
  if(wt){ wt.onclick=()=>{ F.wheelOpen=!F.wheelOpen; if(F.wheelOpen&&F.wheelCore==null) F.wheelCore=null; drawWheel(); }; if(F.wheelOpen) drawWheel(); }
  $s.querySelectorAll(".stepdot").forEach(b=>b.onclick=()=>{const n=+b.dataset.step; goStep(n,n<F.step?"back":"fwd");});
  $s.querySelector("#back").onclick=requestClose;
  $s.querySelector("#prev").onclick=()=>goStep(F.step-1,"back");
  const nx=$s.querySelector("#next"); if(nx) nx.onclick=()=>goStep(F.step+1,"fwd");
  const sv=$s.querySelector("#save"); if(sv) sv.onclick=saveForm;
  const sn=$s.querySelector("#savenow"); if(sn) sn.onclick=saveForm;
  const del=$s.querySelector("#del"); if(del) del.onclick=()=>confirmBox("Delete this check-in?","This can't be undone.","Delete",async()=>{
    const key=`${F.date}_${F.kind}`; try{ await S.store.remove(key); }catch(e){ return toast("Couldn't delete — try again."); }
    S.entries=S.entries.filter(e=>e.key!==key); S.form=null; render(); toast("Check-in deleted");
  });
  // keyboard: Esc closes; 1–5 picks a rating when not typing; ←/→ moves between steps
  document.onkeydown = ev=>{
    if(!S.form || modalEl) return;
    if(ev.key==="Escape"){ ev.preventDefault(); return requestClose(); }
    if(ev.target.tagName==="TEXTAREA" || ev.target.tagName==="INPUT") return;
    if(/^[1-5]$/.test(ev.key) && sec.scale && !F.readOnly){ $s.querySelector(`.scale button[data-v="${ev.key}"]`)?.click(); }
    else if(ev.key==="ArrowRight" && !last) goStep(F.step+1,"fwd");
    else if(ev.key==="ArrowLeft" && F.step>0) goStep(F.step-1,"back");
  };
}
async function saveForm(){
  if(S.form?.readOnly) return;
  const F=S.form; const btn=sheetEl().querySelector("#save,#savenow"); btn.disabled=true;
  const answers={}; Object.entries(F.answers).forEach(([k,v])=>{ if(v!==undefined && String(v).trim()!=="") answers[k]=typeof v==="string"?v.trim():v; });
  if(!Object.keys(answers).length){ btn.disabled=false; return toast("Answer at least one question first."); }
  const key=`${F.date}_${F.kind}`; const prev=getEntry(F.date,F.kind); const now=new Date().toISOString();
  const entry={key,date:F.date,kind:F.kind,answers,createdAt:prev?.createdAt||now,updatedAt:now,v:1};
  const before=earnedBadges(S.entries);
  try{ await S.store.save(entry); }
  catch(e){ btn.disabled=false; return toast(e?.code==="quota_exceeded"?"Storage is full — export and clear old data.":"Couldn't save — check your connection and try again."); }
  S.entries=S.entries.filter(e=>e.key!==key).concat(entry);
  const after=earnedBadges(S.entries);
  const fresh=badgeList().filter(b=>after[b.id] && !before[b.id]);
  S.form=null; S.view="today"; document.querySelectorAll("#tabs button").forEach(b=>b.classList.toggle("on",b.dataset.v==="today"));
  render(); window.scrollTo(0,0);
  const s=computeStats(S.entries);
  if(fresh.length){ celebrate(fresh,s); }
  else if(!prev){ confetti(70); winCard(F.kind,s); }
  else toast("Changes saved");
}

/* ---------- Skills: DBT-based coping skills (data/skills.json) ---------- */
const SKILLS={data:null}, SKILLS_META_KEY="meta_skills", SKILL_NUDGE_KEY="ir_skill_nudge_hidden";
let skillBg=null, skillPendingBadges=[];
async function loadSkills(){
  try{ const r=await fetch("data/skills.json",{cache:"no-cache"}); if(!r.ok) throw 0; const d=await r.json(); if(!Array.isArray(d.skills)) throw 0; SKILLS.data=d; }
  catch(e){ SKILLS.data=null; }
}
const skillById=id=>SKILLS.data?.skills.find(x=>x.id===id);
const groupOfSkill=id=>SKILLS.data?.groups.find(g=>g.skills.includes(id));
const CRISIS_LINE=`<p class="small muted skill-crisis">If you're in crisis or thinking about hurting yourself, call or text <b>988</b> (US) any time.</p>`;
function renderSkills(){
  const D=SKILLS.data;
  if(!D){ document.getElementById("app").innerHTML=`<div class="card"><h2>Skills</h2><p class="muted">Skills couldn't load right now. Check your connection and try again.</p>${CRISIS_LINE}</div>`; return; }
  document.getElementById("app").innerHTML=`
    <div class="card skills-intro"><h2>🧰 Skills</h2><p>${esc(D.intro)}</p>${CRISIS_LINE}</div>
    ${D.groups.map(g=>`<section class="skill-group" aria-labelledby="sg-${g.id}">
      <h3 id="sg-${g.id}"><span aria-hidden="true">${g.icon}</span> ${esc(g.title)}</h3>
      <div class="grid skill-grid">${g.skills.map(id=>{ const k=skillById(id); return k?`<button class="card skill-card" data-skill="${k.id}">
        <span class="skill-name">${esc(k.name)}<span class="go" aria-hidden="true">→</span></span><span class="small muted">${esc(k.tagline)}</span></button>`:""; }).join("")}</div>
    </section>`).join("")}
    <div class="card skills-more"><p class="small muted">${esc(D.learnMore.text)}</p>
      <p class="small">${D.learnMore.links.map(l=>`<a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.name)} ↗</a>`).join(" · ")}</p></div>`;
  document.querySelectorAll("[data-skill]").forEach(b=>b.onclick=()=>openSkill(b.dataset.skill));
}
function openSkill(id){
  const k=skillById(id); if(!k) return;
  closeSkill(true);
  const g=groupOfSkill(id), st={i:0, all:false};
  skillBg=document.createElement("div"); skillBg.className="sheet-bg skill-bg";
  skillBg.innerHTML=`<div class="sheet skill-sheet" role="dialog" aria-modal="true" aria-labelledby="skill-title">
      <div class="sheet-head"><div class="sheet-title"><span class="sheet-ico" aria-hidden="true">${g?.icon||"🧰"}</span><div><h2 id="skill-title">${esc(k.name)}</h2><div class="small muted">${esc(k.tagline)}</div></div></div>
        <button class="xbtn" id="skClose" aria-label="Close">✕</button></div>
      <div class="sheet-body" id="skBody"></div>
      <div class="sheet-foot" id="skFoot"></div>
    </div>`;
  skillBg.addEventListener("mousedown",e=>{ if(e.target===skillBg) closeSkill(); });
  document.body.appendChild(skillBg); document.body.classList.add("noscroll");
  skillBg.querySelector("#skClose").onclick=()=>closeSkill();
  const n=k.steps.length;
  const draw=()=>{
    const body=skillBg.querySelector("#skBody"), foot=skillBg.querySelector("#skFoot");
    body.innerHTML=`<p class="skill-when"><b>Use it:</b> ${esc(k.when)}</p>
      ${st.all?`<ol class="skill-steps">${k.steps.map(x=>`<li><span class="skill-key" aria-hidden="true">${esc(x.k)}</span><div><b>${esc(x.t)}</b><p>${esc(x.d)}</p></div></li>`).join("")}</ol>`
        :`<div class="skill-step" aria-live="polite"><div class="skill-step-n small muted">Step ${st.i+1} of ${n}</div>
            <div class="skill-key big" aria-hidden="true">${esc(k.steps[st.i].k)}</div><h3>${esc(k.steps[st.i].t)}</h3><p>${esc(k.steps[st.i].d)}</p>
            <div class="skill-dots" aria-hidden="true">${k.steps.map((_,j)=>`<span class="${j===st.i?"on":""}"></span>`).join("")}</div></div>`}
      <p class="small"><button class="linkbtn" id="skAll">${st.all?"Go one step at a time":"Show all steps at once"}</button></p>
      ${CRISIS_LINE}
      <p class="small muted">${esc(k.origin||"Adapted from DBT.")} Learn more: <a href="${esc(k.source.url)}" target="_blank" rel="noopener">${esc(k.source.name)} ↗</a></p>`;
    foot.innerHTML=st.all?`<button class="btn" id="skDone">Done</button>`
      :`<button class="btn ghost" id="skPrev" ${st.i===0?"disabled":""}>← Back</button><button class="btn" id="skNext">${st.i===n-1?"Done":"Next →"}</button>`;
    body.querySelector("#skAll").onclick=()=>{ st.all=!st.all; draw(); };
    const dn=foot.querySelector("#skDone"); if(dn) dn.onclick=ask;
    const pv=foot.querySelector("#skPrev"); if(pv) pv.onclick=()=>{ if(st.i>0){ st.i--; draw(); } };
    const nx=foot.querySelector("#skNext"); if(nx) nx.onclick=()=>{ if(st.i<n-1){ st.i++; draw(); body.scrollTop=0; } else ask(); };
  };
  // at the end, ask if it helped; the answer goes in today's log
  const ask=()=>{
    const body=skillBg.querySelector("#skBody"), foot=skillBg.querySelector("#skFoot");
    body.innerHTML=`<div class="skill-step skill-ask"><div class="skill-key big" aria-hidden="true">💭</div><h3 id="skAskQ">Did this help?</h3>
        <p class="muted">Your answer goes in today's log, so over time you can see which skills work best for you.</p>
        <div class="skill-rate" role="group" aria-labelledby="skAskQ">
          <button class="btn" data-helped="yes">👍 Yes, it helped</button>
          <button class="btn ghost" data-helped="little">🤏 A little</button>
          <button class="btn ghost" data-helped="no">😐 Not really</button></div></div>`;
    foot.innerHTML=`<button class="btn ghost" id="skSkip">Skip</button>`;
    foot.querySelector("#skSkip").onclick=()=>closeSkill();
    body.querySelectorAll("[data-helped]").forEach(b=>b.onclick=()=>answer(b.dataset.helped));
    body.scrollTop=0; body.querySelector("[data-helped]").focus();
  };
  const answer=h=>{
    rec.helped=h; saveSkillLog();
    const msg={yes:["💛","Glad it helped.","It's in today's log. Come back to it anytime."],
      little:["🌱","A little still counts.","It's in today's log. Skills get stronger the more you practice them."],
      no:["🤍","That's okay.","Not every skill fits every moment. It's in today's log, and there are plenty of others to try."]}[h];
    const body=skillBg.querySelector("#skBody"), foot=skillBg.querySelector("#skFoot");
    body.innerHTML=`<div class="skill-step" aria-live="polite"><div class="skill-key big" aria-hidden="true">${msg[0]}</div><h3>${msg[1]}</h3><p>${msg[2]}</p></div>`;
    foot.innerHTML=(h==="yes"?"":`<button class="btn ghost" id="skOther">Try another skill</button>`)+`<button class="btn" id="skFin">Done</button>`;
    const o=foot.querySelector("#skOther"); if(o) o.onclick=()=>{ closeSkill(); if(S.view!=="skills"){ S.view="skills"; render(); } window.scrollTo(0,0); };
    foot.querySelector("#skFin").onclick=()=>closeSkill(); foot.querySelector("#skFin").focus();
  };
  draw();
  // opening a skill counts as using it: log it now, and the first one earns a badge (shown after the skill closes)
  const before=earnedBadges(S.entries), day=today(), rec={id, at:new Date().toISOString()};
  (S.skillLog[day] ||= []).push(rec);
  if(!S.skillDate) S.skillDate=day;
  saveSkillLog();
  const after=earnedBadges(S.entries); skillPendingBadges=badgeList().filter(b=>after[b.id]&&!before[b.id]);
}
function closeSkill(instant){
  if(!skillBg) return; const bg=skillBg; skillBg=null;
  if(!S.form) document.body.classList.remove("noscroll");
  if(instant) return bg.remove();
  bg.classList.add("closing"); setTimeout(()=>bg.remove(),180);
  if(skillPendingBadges.length){ const fresh=skillPendingBadges; skillPendingBadges=[]; render(); setTimeout(()=>celebrate(fresh,computeStats(S.entries)),260); }
}
/* Skill log: S.skillLog = { "YYYY-MM-DD": [{id, at, helped:"yes"|"little"|"no"}] }. Opening a skill counts as using it. */
const HELPED_LABEL={yes:"Helped",little:"Helped a little",no:"Didn't help this time"};
function saveSkillLog(){
  const doc={key:SKILLS_META_KEY,kind:"meta",date:S.skillDate,log:S.skillLog,updatedAt:new Date().toISOString(),v:2};
  affSaving=affSaving.then(()=>S.store.save(doc)).catch(()=>{});
}
function cleanSkillLog(log){
  const out={}; if(!log||typeof log!=="object") return out;
  for(const [d,list] of Object.entries(log)) if(/^\d{4}-\d{2}-\d{2}$/.test(d)&&Array.isArray(list)){
    const ok=list.filter(r=>r&&typeof r.id==="string").map(r=>({id:r.id,at:String(r.at||""),...(HELPED_LABEL[r.helped]?{helped:r.helped}:{})}));
    if(ok.length) out[d]=ok; }
  return out;
}
function skillsDayHTML(d){
  const list=S.skillLog[d]; if(!list||!list.length) return "";
  const rows=list.map(r=>{ const k=skillById(r.id); const tm=r.at?new Date(r.at):null;
    const time=tm&&!isNaN(tm)?tm.toLocaleTimeString([], {hour:"numeric",minute:"2-digit"}):"";
    return `<li><span class="sk-name">${esc(k?k.name:r.id)}</span><span class="sk-meta muted">${r.helped?HELPED_LABEL[r.helped]:"Used"}${time?" · "+time:""}</span></li>`; }).join("");
  return `<div class="dd-block skills-used"><div class="dd-head"><h3>🧰 Skills I used</h3></div><ul class="sk-used">${rows}</ul></div>`;
}
/* A gentle link on Today. After a low Emotional rating today, it gets a warmer message (can be turned off in Settings). */
function skillLinkHTML(){
  if(!SKILLS.data) return "";
  const t=today(), low=S.prefs.skillNudge && ["morning","night"].some(k=>{ const e=getEntry(t,k); const v=+e?.answers?.emotional_scale; return v && v<=2; });
  let hidden=false; try{ hidden=localStorage.getItem(SKILL_NUDGE_KEY)===t; }catch(e){}
  if(low && !hidden) return `<div class="card skill-nudge"><div><b>Rough day?</b> <span class="muted">A quick coping skill might help.</span></div>
      <div class="skill-nudge-actions"><button class="btn" id="toSkills">🧰 Try a skill</button><button class="linkbtn" id="hideNudge">Not now</button></div></div>`;
  return `<button class="skill-link" id="toSkills">🧰 Feeling overwhelmed? Try a coping skill →</button>`;
}
function bindSkillLink(){
  const b=document.getElementById("toSkills"); if(b) b.onclick=()=>setView("skills");
  const h=document.getElementById("hideNudge"); if(h) h.onclick=()=>{ try{ localStorage.setItem(SKILL_NUDGE_KEY,today()); }catch(e){} render(); };
}

/* ---------- History ---------- */
function showDayInHistory(d){
  S.histDay=d; S.cal=new Date(+d.slice(0,4),+d.slice(5,7)-1,1); setView("history");
  setTimeout(()=>document.getElementById("dayDetail")?.scrollIntoView({behavior:"smooth",block:"start"}),50);
}
function dayDetailHTML(d){
  const isToday=d===today(), ents=["morning","night"].map(k=>[k,getEntry(d,k)]);
  const parts=ents.map(([k,e])=>{
    if(!e) return "";
    const rows=sectionsWithAnswers(e).filter(x=>x.rating||x.notes.length).map(x=>{
      const D=DIMENSIONS[x.sec.dim];
      return `<li style="--dc:${D.color}"><div class="dd-row"><span class="dd-area">${D.icon} ${x.sec.dim==="closing"?"Proud of":D.label}</span>${x.rating?dots(x.rating):""}</div>
        ${x.notes.map(n=>`<div class="dd-q">${esc(n.q)}</div><div class="dd-a">${esc(n.a)}</div>`).join("")}</li>`;
    }).join("");
    return `<div class="dd-block ${k}"><div class="dd-head"><h3>${FORMS[k].icon} ${FORMS[k].title}</h3><button class="linkbtn" data-open-k="${k}">Open</button></div>
      ${rows?`<ul class="dd-list">${rows}</ul>`:`<p class="muted small">Checked in, no answers recorded.</p>`}</div>`;
  }).join("");
  const none=!ents.some(([,e])=>e), sk=skillsDayHTML(d);
  return `<section class="card day-detail" id="dayDetail">
      <div class="dd-top"><h2>${isToday?"Today · ":""}${fmtDate(d)}</h2><button class="xbtn" id="ddClose" aria-label="Close day">✕</button></div>
      ${none&&!sk?`<p class="muted">${isToday?"Nothing logged yet today.":"No check-ins this day. That's okay. There's always tomorrow."}</p>`:parts+sk}
    </section>`;
}
function renderHistory(){
  const s=computeStats(S.entries), t=today();
  const c=S.cal, y=c.getFullYear(), mo=c.getMonth();
  const first=new Date(y,mo,1), startPad=first.getDay(), dim=new Date(y,mo+1,0).getDate();
  const cells=[]; for(let i=0;i<startPad;i++) cells.push(`<span></span>`);
  for(let d=1; d<=dim; d++){ const ds=ymd(new Date(y,mo,d)); const r=s.byDate[ds]||{};
    cells.push(`<button class="cell ${ds>t?"future":""} ${ds===t?"today":""} ${ds===S.histDay?"sel":""}" data-d="${ds}" title="${fmtDate(ds)}" ${ds>t?"disabled":""}><span class="m ${r.morning?"on":""}"></span><span class="n ${r.night?"on":""}"></span></button>`); }
  const list=[...S.entries].sort((a,b)=>(b.date+b.kind).localeCompare(a.date+a.kind)).slice(0,60);
  $app.innerHTML = `
    ${S.histDay?dayDetailHTML(S.histDay):""}
    <div class="card" ${S.histDay?'style="margin-top:14px"':""}>
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
        <button class="back" id="prev">←</button>
        <h2 style="font-size:1.1rem">${c.toLocaleDateString(undefined,{month:"long",year:"numeric"})}</h2>
        <button class="back" id="next">→</button>
      </div>
      <div class="cal">${"SMTWTFS".split("").map(d=>`<span class="h">${d}</span>`).join("")}${cells.join("")}</div>
      <div class="legend"><span><i style="background:var(--morning)"></i>Morning</span><span><i class="lg-n" style="background:var(--night)"></i>Night</span><span class="muted">Tap a day to see everything you wrote</span></div>
    </div>
    <div class="section-title"><h2>Trends</h2><span class="small muted">last 30 days · 1–5</span></div>
    <div class="card">${trendsHTML()}</div>
    <div class="section-title"><h2>Entries</h2><span class="small muted">${S.entries.length} total</span></div>
    <div>${list.length?list.map(e=>`<button class="entry" data-k="${e.key}"><span class="tag">${FORMS[e.kind].icon}</span><span class="t"><b>${FORMS[e.kind].title}</b><br><span class="small muted">${fmtDate(e.date)}</span></span><span class="avg">${avgRating(e)?.toFixed(1)??"–"}</span></button>`).join(""):`<div class="card muted">No entries yet. Your first check-in will show up here.</div>`}</div>
  `;
  document.getElementById("prev").onclick=()=>{S.cal=new Date(y,mo-1,1);render();};
  document.getElementById("next").onclick=()=>{S.cal=new Date(y,mo+1,1);render();};
  $app.querySelectorAll(".cell[data-d]:not(.future)").forEach(b=>b.onclick=()=>{ S.histDay=b.dataset.d; render(); document.getElementById("dayDetail")?.scrollIntoView({behavior:"smooth",block:"start"}); });
  const ddc=document.getElementById("ddClose"); if(ddc) ddc.onclick=()=>{ S.histDay=null; render(); };
  $app.querySelectorAll(".day-detail [data-open-k]").forEach(b=>b.onclick=()=>openForm(b.dataset.openK,S.histDay));
  $app.querySelectorAll(".entry").forEach(b=>b.onclick=()=>{const e=S.entries.find(x=>x.key===b.dataset.k); openForm(e.kind,e.date);});
}
function trendsHTML(){
  const t=today(), days=[...Array(30)].map((_,i)=>addDays(t,i-29));
  const dims=Object.keys(DIMENSIONS).filter(k=>FORMS.morning.sections.concat(FORMS.night.sections).some(s=>s.dim===k && s.scale));
  if(!S.entries.length) return `<div class="muted small">Trends appear once you've logged a few check-ins.</div>`;
  return dims.map(k=>{
    const D=DIMENSIONS[k], id=k+"_scale";
    const line=kind=>{ const pts=days.map((d,i)=>{const e=getEntry(d,kind); const v=e?.answers[id]; return v?[i,+v]:null;}).filter(Boolean);
      if(!pts.length) return {svg:"",vals:[]};
      const xy=pts.map(([i,v])=>`${(i/29*100).toFixed(1)},${(30-(v-1)/4*26-2).toFixed(1)}`);
      return {svg:`<polyline class="ln-${kind}" fill="none" stroke="${kind==="morning"?"var(--morning)":"var(--night)"}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke" points="${xy.join(" ")}"/>`+xy.map(p=>`<circle cx="${p.split(",")[0]}" cy="${p.split(",")[1]}" r="1.4" fill="${kind==="morning"?"var(--morning)":"var(--night)"}"/>`).join(""), vals:pts.map(p=>p[1])};
    };
    const m=line("morning"), n=line("night"); const all=m.vals.concat(n.vals);
    const avg=all.length?(all.reduce((a,b)=>a+b,0)/all.length).toFixed(1):"–";
    return `<div class="trend"><span>${D.icon} ${D.label}</span><svg viewBox="0 0 100 32" preserveAspectRatio="none">${m.svg}${n.svg}</svg><b style="text-align:right">${avg}</b></div>`;
  }).join("") + `<div class="legend"><span><i style="background:var(--morning)"></i>Morning</span><span><i class="lg-n" style="background:var(--night)"></i>Night</span></div>`;
}
/* ---------- Day view: the day's highlights and notes ---------- */
const NOTE_BONUS=1.5; // a section with a written note outranks the same score without one
function sectionsWithAnswers(e){
  return FORMS[e.kind].sections.map(sec=>{
    const rating=sec.scale?+e.answers[sec.scale.id]||0:0;
    const notes=sec.prompts.map(p=>({q:p.q,a:(e.answers[p.id]||"").trim()})).filter(x=>x.a && !/^n\/?a$/i.test(x.a));
    return {sec,rating,notes};
  });
}
function highlightOf(e){
  let best=null;
  for(const x of sectionsWithAnswers(e)){
    if(!x.rating && !x.notes.length) continue;
    const score=(x.sec.scale ? x.rating : (x.notes.length?3.5:0)) + (x.notes.length?NOTE_BONUS:0);
    const len=x.notes.reduce((n,y)=>n+y.a.length,0);
    if(!best || score>best.score || (score===best.score && len>best.len)) best={...x,score,len};
  }
  return best;
}
function dots(r){ return `<span class="rdots" aria-label="${r} of 5">${[1,2,3,4,5].map(i=>`<i class="${i<=r?"on":""}"></i>`).join("")}</span>`; }
function highlightHTML(kind,h){
  if(!h) return "";
  const D=DIMENSIONS[h.sec.dim], F=FORMS[kind];
  const anchor=h.sec.scale&&h.rating ? (h.rating>=4?h.sec.scale.high:h.rating<=2?h.sec.scale.low:"") : "";
  return `<div class="hl ${kind}" style="--dc:${D.color}">
      <div class="hl-top"><span class="hl-kind">${F.icon} ${kind==="morning"?"Morning highlight":"Evening highlight"}</span>
        ${h.rating?dots(h.rating):""}</div>
      <div class="hl-area">${D.icon} ${h.sec.dim==="closing"?"Proud of":D.label}${anchor?` <span class="muted">· ${esc(anchor)}</span>`:""}</div>
      ${h.notes.map(n=>`<blockquote>${esc(n.a)}</blockquote>`).join("")}
    </div>`;
}
function dayBadgesHTML(d){
  const earned=earnedBadges(S.entries), got=badgeList().filter(b=>earned[b.id]===d);
  if(!got.length) return "";
  return `<div class="day-badges"><h4>🏅 Badges earned this day</h4><div class="mini-badges">${got.map(b=>
    `<button class="mini-badge" data-b="${esc(b.id)}" data-name="${esc(b.name)}" data-desc="${esc(b.desc)}" aria-label="${esc(b.name)}: ${esc(b.desc)}. Open badges.">
       <span class="mb-em">${b.em}</span></button>`).join("")}</div></div>`;
}
/* Small floating tooltip, positioned against the viewport so scroll areas never clip it */
let tipEl=null;
function showTip(target,title,text){
  if(!tipEl){ tipEl=document.createElement("div"); tipEl.className="float-tip"; tipEl.setAttribute("role","tooltip"); document.body.appendChild(tipEl); }
  tipEl.innerHTML=`<b>${esc(title)}</b>${esc(text)}`; tipEl.classList.add("show");
  const r=target.getBoundingClientRect(), t=tipEl.getBoundingClientRect(), pad=8;
  let left=r.left+r.width/2-t.width/2; left=Math.max(pad,Math.min(innerWidth-t.width-pad,left));
  let top=r.top-t.height-10, below=false; if(top<pad){ top=r.bottom+10; below=true; }
  tipEl.style.left=left+"px"; tipEl.style.top=top+"px";
  tipEl.style.setProperty("--ax",(r.left+r.width/2-left)+"px"); tipEl.classList.toggle("below",below);
}
function hideTip(){ if(tipEl) tipEl.classList.remove("show"); }
let dayBg=null;
function closeDaySheet(){ hideTip(); if(!dayBg) return; const bg=dayBg; dayBg=null; if(!S.form&&!affBg) document.body.classList.remove("noscroll"); bg.classList.add("closing"); setTimeout(()=>bg.remove(),180); }
document.addEventListener("keydown",e=>{ if(e.key==="Escape" && dayBg && !modalEl){ e.preventDefault(); closeDaySheet(); } });
function dayPicker(d){ openDaySheet(d); }
function openDaySheet(d){
  if(dayBg){ dayBg.remove(); dayBg=null; }
  const isToday=d===today(), ents=["morning","night"].map(k=>getEntry(d,k));
  const [m,n]=ents, any=m||n;
  let body="";
  if(any){
    const hm=m&&highlightOf(m), hn=n&&highlightOf(n);
    const proud=n&&(n.answers.proud_text||"").trim();
    body+=`<div class="hls">${highlightHTML("morning",hm)}${highlightHTML("night",hn)}</div>`;
    if(proud && !(hn && hn.sec.dim==="closing")) body+=`<div class="proud">⭐ <b>Proud of:</b> ${esc(proud)}</div>`;
    if(!hm && !hn && !proud) body=`<p class="muted">Checked in, no notes this time. Showing up counts.</p>`;
    body+=skillsDayHTML(d);
    body+=dayBadgesHTML(d);
    body+=`<button class="linkbtn full-link" id="dayFull">See the full day in History →</button>`;
  } else {
    body= (isToday ? `<p class="muted">Nothing logged yet today.</p>` : `<p class="muted">No check-ins this day. That's okay. There's always tomorrow.</p>`)+skillsDayHTML(d);
  }
  const btns=["morning","night"].map(k=>{
    const e=getEntry(d,k), F=FORMS[k];
    if(e) return `<button class="btn ghost" data-open-k="${k}">${F.icon} View ${k==="morning"?"intention":"reflection"}</button>`;
    if(isToday && isOpen(k)) return `<button class="btn" data-open-k="${k}">${F.icon} Start ${k==="morning"?"intention":"reflection"}</button>`;
    return "";
  }).join("");
  dayBg=document.createElement("div"); dayBg.className="sheet-bg day-bg";
  dayBg.innerHTML=`<div class="sheet day-sheet" role="dialog" aria-modal="true" aria-labelledby="day-title">
      <div class="sheet-head"><div class="sheet-title"><span class="sheet-ico">📖</span><div><h2 id="day-title">${isToday?"Today":fmtDate(d)}</h2>
        <span class="sheet-date">${isToday?fmtDate(d):(m&&n?"Morning and night":m?"Morning intention":n?"Nightly reflection":"No check-ins")}</span></div></div>
        <button class="xbtn" id="dayClose" aria-label="Close">✕</button></div>
      <div class="sheet-body">${body}</div>
      <div class="sheet-foot">${btns}<button class="btn ${btns?"ghost":""}" id="dayDone">Close</button></div></div>`;
  dayBg.addEventListener("mousedown",e=>{ if(e.target===dayBg) closeDaySheet(); });
  document.body.appendChild(dayBg); document.body.classList.add("noscroll");
  dayBg.querySelector("#dayClose").onclick=dayBg.querySelector("#dayDone").onclick=closeDaySheet;
  dayBg.querySelectorAll("[data-open-k]").forEach(bt=>bt.onclick=()=>{ const k=bt.dataset.openK; dayBg.remove(); dayBg=null; openForm(k,d); });
  const full=dayBg.querySelector("#dayFull"); if(full) full.onclick=()=>{ closeDaySheet(); showDayInHistory(d); };
  dayBg.querySelectorAll(".mini-badge[data-b]").forEach(bt=>{
    bt.onclick=()=>{ hideTip(); closeDaySheet(); S.focusBadge=bt.dataset.b; setView("badges"); };
    bt.onmouseenter=bt.onfocus=()=>showTip(bt, bt.dataset.name, bt.dataset.desc);
    bt.onmouseleave=bt.onblur=hideTip;
  });
}

/* ---------- Badges ---------- */
function focusBadgeAfterRender(){
  if(!S.focusBadge) return; const el=document.getElementById("badge-"+S.focusBadge); S.focusBadge=null;
  if(el) setTimeout(()=>el.scrollIntoView({behavior:"smooth",block:"center"}),40);
}
function renderBadges(){
  // Only earned badges are shown, newest first: no totals or locked slots to "complete".
  const earned=earnedBadges(S.entries), n=Object.keys(earned).length;
  const got=badgeList().filter(x=>earned[x.id]).sort((x,y)=>earned[y.id].localeCompare(earned[x.id]));
  $app.innerHTML = `
    <div class="card" style="display:flex;gap:16px;align-items:center">
      <div style="font-size:2.4rem">🏅</div>
      <div><h2 style="font-size:1.2rem">${n?`You've earned ${n} ${n===1?"badge":"badges"}`:"Your badges will show up here"}</h2>
      <div class="small muted">${n?"Every one of these is a time you showed up for yourself. ":""}Badges reward showing up, never your ratings. A hard day logged honestly counts just as much.</div></div>
    </div>
    ${n?`<div class="grid badges" style="margin-top:14px">${got.map(b=>`<div class="card badge ${S.focusBadge===b.id?"focus":""}" id="badge-${esc(b.id)}"><div class="em">${b.em}</div><h3>${b.name}</h3><p>${b.desc}</p><p class="when">Earned ${fmtDate(earned[b.id])}</p></div>`).join("")}</div>
      <p class="small muted" style="text-align:center;margin-top:18px">More badges appear as you keep checking in. There's no list to finish.</p>`
    :`<div class="card muted" style="margin-top:14px;text-align:center">Your first badge is one check-in or affirmation away.</div>`}`;
  focusBadgeAfterRender();
}

/* ---------- Data (export / import) ---------- */
/* ---------- About ---------- */
const ABOUT_SECTIONS=[["about-note","A quick note"],["about-why","Why I made this"],["about-name","Why \"Bookends\"?"],["about-how","How it works"],["about-homescreen","Add to Home Screen"],["about-privacy","Your privacy"],["about-free","Free, on purpose"],["about-providers","For providers"],["about-sharing","Sharing with your provider"],["about-source","Open source"]];
function renderAbout(){
  const privacy = S.store.kind==="cloud"
    ? "Your check-ins are saved to your own private space. Only you can read them. Nobody else who opens this page can see them."
    : "Your check-ins never leave this device. There's no account and no server storing them, so nobody else can read them, including me. That also means if you clear your browser data, they're gone, so use the <b>Settings</b> tab to download a backup now and then.";
  $app.innerHTML = `
    <article class="about">
      <nav class="card about-toc" aria-label="On this page"><span class="small muted">On this page</span>
        <div class="toc-links">${ABOUT_SECTIONS.map(([id,t])=>`<a href="#${id}">${t}</a>`).join("")}</div></nav>
      <section class="card about-care" id="about-note">
        <h2 class="sec">A quick note<a class="anchor" href="#about-note" aria-label="Link to this section">#</a></h2>
        <p>Bookends is a self-care tool. It's not therapy or medical care. If you're having a hard time, please reach out to a professional or someone you trust. In the US, you can call or text <b>988</b> any time to reach the Suicide &amp; Crisis Lifeline.</p>
      </section>
      <section class="card about-hero" id="about-why">
        <svg class="mark" viewBox="60 50 120 120" aria-hidden="true">
          <path d="M90 62H70V158H90" fill="none" stroke="var(--morning)" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M150 62H170V158H150" fill="none" stroke="var(--night)" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M120 80A30 30 0 0 0 120 140Z" fill="var(--morning)"/><path d="M120 80A30 30 0 0 1 120 140Z" fill="var(--night)"/>
        </svg>
        <h2>Why I made this<a class="anchor" href="#about-why" aria-label="Link to this section">#</a></h2>
        <p>A while back I started doing two short check-ins every day. One in the morning to set an intention, and one at night to look back on how the day actually went. A few quick questions for each part of my life: how I'm feeling, how my body's doing, the people around me, my work, my space, my money, and what gives me purpose.</p>
        <p>It sounds simple. It helped a lot.</p>
        <p>I was doing it on paper, and I kept losing track of the sheets. So I built Bookends: the same check-ins, a place to keep them, and a few badges to make showing up feel good. If it helps you even a little, that's a win.</p>
      </section>

      <section class="card about-name" id="about-name">
        <h2 class="sec">Why "Bookends"?<a class="anchor" href="#about-name" aria-label="Link to this section">#</a></h2>
        <p>A morning intention and a nightly reflection hold the day between them, like bookends on a shelf. Whatever happens in the middle, you start with purpose and end with honesty.</p>
      </section>

      <section class="card about-how" id="about-how">
        <h2 class="sec">How it works<a class="anchor" href="#about-how" aria-label="Link to this section">#</a></h2>
        <ul>
          <li><b>🌅 Morning intention</b> is open from ${hourLabel(win("morning")[0])} to ${hourLabel(win("morning")[1])}. <b>🌙 Nightly reflection</b> is open from ${hourLabel(win("night")[0])} to ${hourLabel(win("night")[1])}. You can change both windows in <b>Settings</b>.</li>
          <li><b>🧰 Skills</b> has short coping skills, like STOP, DEAR MAN, "catch it, check it, change it," a self-compassion break and the 5-4-3-2-1 grounding exercise, for when feelings start to run high. They draw on DBT, CBT, ACT, mindfulness and self-compassion. They're reminders, not therapy.</li>
          <li>Each check-in walks through the eight areas of wellness, one at a time. Rate each one from 1 to 5 and write as much or as little as you want. Skipping is fine.</li>
          <li><b>Check-ins are for today.</b> You can look back on past days, but you can't fill them in afterward. If you miss a day, that's okay. There's always tomorrow. No guilt, no shame.</li>
          <li><b>Badges reward showing up, never your ratings.</b> A hard day logged honestly counts just as much as a great one. There's no list to finish.</li>
          <li><b>Daily affirmations:</b> you get three a day, then a nudge to put the phone down. That's on purpose. The goal is to live your day, not stare at this page. Choose how they show up, or turn them off, in <b>Settings</b>.</li>
        </ul>
        <p class="small muted">The eight areas come from <a href="https://www.samhsa.gov/wellness-initiative/eight-dimensions-wellness" target="_blank" rel="noopener noreferrer">SAMHSA's Eight Dimensions of Wellness</a>. The affirmations are inspired by guidance from public health and mental health organizations, and each one links to its source.</p>
      </section>

      <section class="card about-home" id="about-homescreen">
        <h2 class="sec">Add Bookends to your Home Screen<a class="anchor" href="#about-homescreen" aria-label="Link to this section">#</a></h2>
        <p>Bookends works great as a Home Screen icon. It opens like an app, without the browser bar, and it's one tap away when it's time to check in.</p>
        <div class="howto">
          <div class="howto-col">
            <h3>📱 iPhone or iPad (Safari)</h3>
            <ol>
              <li>Open <b>bookends.day</b> in Safari.</li>
              <li>Tap the <b>Share</b> button. On iOS 26, tap the <b>•••</b> next to the address bar first, then <b>Share</b>. On older versions, it's the square with an arrow in the toolbar.</li>
              <li>Scroll down and tap <b>Add to Home Screen</b> (you may need to tap <b>View More</b>).</li>
              <li>Leave <b>Open as Web App</b> on, then tap <b>Add</b>.</li>
            </ol>
          </div>
          <div class="howto-col">
            <h3>🤖 Android (Chrome)</h3>
            <ol>
              <li>Open <b>bookends.day</b> in Chrome.</li>
              <li>Tap the <b>⋮</b> menu in the top-right corner.</li>
              <li>Tap <b>Add to Home screen</b> or <b>Install app</b>.</li>
              <li>Tap <b>Install</b> (or <b>Add</b>) to confirm.</li>
            </ol>
          </div>
        </div>
        <p class="small muted"><b>Heads up for iPhone:</b> the Home Screen app keeps its own storage, separate from Safari. If you've already been checking in from Safari, download a backup in <b>Settings</b> first, then restore it in the Home Screen app. Adding Bookends to your Home Screen also keeps Safari from clearing your entries if you haven't visited in a while.</p>
        <p class="small muted">Opening Bookends from your Home Screen for the first time earns a little badge, too. 📱</p>
      </section>

      <section class="card about-privacy" id="about-privacy">
        <h2 class="sec">Your privacy<a class="anchor" href="#about-privacy" aria-label="Link to this section">#</a></h2>
        <p>${privacy}</p>
      </section>

      <section class="card about-free" id="about-free">
        <h2 class="sec">Free, on purpose<a class="anchor" href="#about-free" aria-label="Link to this section">#</a></h2>
        <p>Bookends is free. No ads, no premium tier, and nothing to sell you.</p>
        <p>The check-ins that helped me were simple: a sheet of paper and a few good questions that someone took the time to share. That kind of help shouldn't come with a price tag. Hard stretches often come with tight budgets, and reaching for support is already hard enough without a paywall in the way.</p>
        <p>So it's free, and it's going to stay that way. If it helps you, pass it on to someone who might need it too. That's the only payment I'm looking for.</p>
      </section>

      <section class="card about-pro" id="about-providers">
        <h2 class="sec">For mental health providers<a class="anchor" href="#about-providers" aria-label="Link to this section">#</a></h2>
        <p>If you work with clients and think Bookends could help, please share it. It's free, and there's nothing to sign up for.</p>
        <ul>
          <li><b>Sharing it is easy:</b> send your clients to <b>bookends.day</b>. It works in any browser on a phone or computer. On a phone, they can <a href="#about-homescreen">add it to their Home Screen</a> so it opens like an app.</li>
          <li><b>It fits their routine:</b> clients can set their own morning and evening check-in windows, and choose how affirmations show up (or turn them off), in <b>Settings</b>.</li>
          <li><b>It's private by design:</b> ${S.store.kind==="cloud"?"each person's check-ins are private to them. There's no way for you, or me, to see anyone's entries.":"Bookends doesn't collect or store anyone's check-ins. Entries stay on the client's own device, so there's no account for you to manage and nothing on my end to access."}</li>
          <li><b>Clients choose what to share:</b> they can make a printable summary for you anytime (see below).</li>
          <li><b>It's a self-care tool, not a clinical one.</b> Bookends doesn't monitor entries or send alerts to anyone, so it's not a substitute for your own check-ins or a safety plan.</li>
        </ul>
      </section>

      <section class="card about-share" id="about-sharing">
        <h2 class="sec">Sharing your check-ins with your provider<a class="anchor" href="#about-sharing" aria-label="Link to this section">#</a></h2>
        <p>Your check-ins are private. Nothing is shared unless you decide to share it.</p>
        <ol>
          <li>Go to <b>Settings</b> and find <b>Share with your provider</b>.</li>
          <li>Pick a time period (7, 14, 30, or 90 days) and choose whether to include your written notes or just your ratings.</li>
          <li>Tap <b>Download as Report (HTML)</b> for a simple page with charts you can open, print, or save as a PDF. If your provider would rather have the raw numbers, tap <b>Download as Data (JSON)</b> instead.</li>
          <li>Share it the way you and your provider prefer: show it during a session, bring a printed copy, or upload it through your provider's secure patient portal.</li>
        </ol>
        <p class="small muted">Tip: regular email and text messages aren't very private. If your provider has a secure portal, use that instead. You can also just open <b>History</b> together and walk through a day.</p>
      </section>

      <section class="card about-source" id="about-source">
        <h2 class="sec">Open source<a class="anchor" href="#about-source" aria-label="Link to this section">#</a></h2>
        <p>Bookends is open source. You can read every line of code, see exactly how your entries are stored, or suggest an idea or report a bug.</p>
        <p><a class="btn ghost src-link" href="https://github.com/mercereau/bookends" target="_blank" rel="noopener">View Bookends on GitHub ↗</a></p>
      </section>
    </article>`;
}

/* ---------- Backup export ---------- */
const BACKUP_KEY="ir_last_backup";
const hasData=()=>S.entries.length>0 || Object.keys(S.affLog).length>0 || Object.keys(S.skillLog).length>0;
function backupJSON(){
  const all=[...S.entries].sort((a,b)=>a.key.localeCompare(b.key));
  if(Object.keys(S.affLog).length) all.push({key:AFF_META_KEY,kind:"meta",days:S.affLog,v:1});
  if(Object.keys(S.skillLog).length) all.push({key:SKILLS_META_KEY,kind:"meta",date:S.skillDate,log:S.skillLog,v:2});
  return JSON.stringify(all,null,2);
}
function lastBackup(){ try{ return localStorage.getItem(BACKUP_KEY); }catch(e){ return null; } }
function lastBackupText(){
  const d=lastBackup(); if(!d) return "No backup downloaded yet on this device.";
  const days=Math.round((parse(today())-parse(d.slice(0,10)))/864e5);
  return `Last backup: ${days===0?"today":days===1?"yesterday":days+" days ago"}.`;
}
/* Save a file: through Claude's download prompt when hosted there, otherwise a normal browser download. */
async function saveFile(filename,data,mime){
  const dl = window.claude?.use ? await claude.use("downloads").catch(()=>null) : null;
  if(dl){
    try{ await dl.save({filename,data}); return true; }
    catch(e){ if(e?.code==="declined"){ toast("Download cancelled"); return false; } if(e?.code==="rate_limited"){ toast("A download prompt is already open"); return false; } }
  }
  try{
    const url=URL.createObjectURL(new Blob([data],{type:mime}));
    const a=Object.assign(document.createElement("a"),{href:url,download:filename}); document.body.appendChild(a); a.click(); a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),2000); return true;
  }catch(e){ toast("Download isn't available here."); return false; }
}

/* ---------- Provider summary: a readable, printable page the client chooses to share ---------- */
function providerSummaryHTML(days, withNotes){
  const end=today(), start=addDays(end,-(days-1));
  const ents=S.entries.filter(e=>e.date>=start && e.date<=end).sort((a,b)=>(a.date+a.kind).localeCompare(b.date+b.kind));
  const dates=[...new Set(ents.map(e=>e.date))];
  const range=[...Array(days)].map((_,i)=>addDays(start,i));
  const dims=Object.keys(DIMENSIONS).filter(k=>FORMS.morning.sections.concat(FORMS.night.sections).some(x=>x.dim===k&&x.scale));
  const AM="#d98b3a", PM="#4a5b9b", GRID="#e6ddd0", INK="#23302a", MUTED="#6b7570";
  const e2=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const val=(d,kind,dim)=>{ const e=getEntry(d,kind); return e?(+e.answers[dim+"_scale"]||null):null; };
  const avgOf=(kind,dim)=>{ const v=ents.filter(e=>e.kind===kind).map(e=>+e.answers[dim+"_scale"]).filter(Boolean); return v.length?v.reduce((a,b)=>a+b,0)/v.length:null; };
  const short=d=>parse(d).toLocaleDateString(undefined,{month:"short",day:"numeric"});

  // 1) Check-in calendar strip: top half = morning, bottom half = night
  const W=700, cw=Math.min(36,(W-10)/days), gap=cw>8?2:1, ch=34;
  const strip=`<svg viewBox="0 0 ${W} ${ch+22}" width="100%" role="img" aria-label="Check-ins per day: top half morning, bottom half night">
    ${range.map((d,i)=>{ const x=i*cw, m=!!getEntry(d,"morning"), n=!!getEntry(d,"night");
      return `<g><title>${e2(short(d))}: ${m&&n?"morning and night":m?"morning":n?"night":"no check-in"}</title>
        <rect x="${x}" y="0" width="${cw-gap}" height="${ch/2-1}" rx="2" fill="${m?AM:"none"}" stroke="${m?AM:GRID}"/>
        <rect x="${x}" y="${ch/2}" width="${cw-gap}" height="${ch/2-1}" rx="2" fill="${n?PM:"none"}" stroke="${n?PM:GRID}"/></g>`; }).join("")}
    <text x="0" y="${ch+16}" font-size="11" fill="${MUTED}">${e2(short(start))}</text>
    <text x="${W}" y="${ch+16}" font-size="11" fill="${MUTED}" text-anchor="end">${e2(short(end))}</text></svg>`;

  // 2) Average per area: paired horizontal bars on a 1–5 scale
  const rowH=34, LW=120, BW=W-LW-40, sx=v=>LW+((v-1)/4)*BW;   // bars start at 1, the bottom of the scale
  const bars=`<svg viewBox="0 0 ${W} ${dims.length*rowH+26}" width="100%" role="img" aria-label="Average rating per wellness area, morning and night">
    ${[1,2,3,4,5].map(t=>`<line x1="${sx(t)}" x2="${sx(t)}" y1="0" y2="${dims.length*rowH}" stroke="${GRID}"/><text x="${sx(t)}" y="${dims.length*rowH+16}" font-size="11" fill="${MUTED}" text-anchor="middle">${t}</text>`).join("")}
    ${dims.map((k,i)=>{ const y=i*rowH, m=avgOf("morning",k), n=avgOf("night",k);
      const bar=(v,yy,col,lab)=> v==null?`<text x="${LW+4}" y="${yy+9}" font-size="10" fill="${MUTED}">no ${lab} ratings</text>`
        :`<rect x="${LW}" y="${yy}" width="${Math.max(2,sx(v)-LW)}" height="11" rx="3" fill="${col}"><title>${lab}: ${v.toFixed(1)}</title></rect><text x="${sx(v)+5}" y="${yy+9.5}" font-size="10" fill="${MUTED}">${v.toFixed(1)}</text>`;
      return `<text x="0" y="${y+17}" font-size="13" font-weight="600" fill="${INK}">${e2(DIMENSIONS[k].label)}</text>${bar(m,y+5,AM,"morning")}${bar(n,y+18,PM,"night")}`; }).join("")}</svg>`;

  // 3) Trend per area: small line charts, morning and night
  const TW=330, TH=92, px=26, py=10, tx=i=>px+(days===1?0:i/(days-1))*(TW-px-8), ty=v=>py+(5-v)/4*(TH-py-18);
  const line=(k,kind,col)=>{ const pts=range.map((d,i)=>{ const v=val(d,kind,k); return v?[tx(i),ty(v)]:null; }).filter(Boolean);
    if(!pts.length) return ""; return `<polyline fill="none" stroke="${col}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" points="${pts.map(p=>p.join(",")).join(" ")}"/>`+pts.map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="2.6" fill="${col}"/>`).join(""); };
  const trends=dims.map(k=>`<figure class="trend"><figcaption>${e2(DIMENSIONS[k].label)}</figcaption>
    <svg viewBox="0 0 ${TW} ${TH}" width="100%" role="img" aria-label="${e2(DIMENSIONS[k].label)} ratings over time">
      ${[1,3,5].map(t=>`<line x1="${px}" x2="${TW-8}" y1="${ty(t)}" y2="${ty(t)}" stroke="${GRID}" ${t===3?'stroke-dasharray="3 3"':""}/><text x="${px-6}" y="${ty(t)+4}" font-size="10" fill="${MUTED}" text-anchor="end">${t}</text>`).join("")}
      ${line(k,"morning",AM)}${line(k,"night",PM)}
      <text x="${px}" y="${TH-2}" font-size="9.5" fill="${MUTED}">${e2(short(start))}</text><text x="${TW-8}" y="${TH-2}" font-size="9.5" fill="${MUTED}" text-anchor="end">${e2(short(end))}</text>
    </svg></figure>`).join("");

  // 4) Day by day with a five-block meter for each rating
  const meter=(r,col)=>`<span class="meter" title="${r} of 5">${[1,2,3,4,5].map(i=>`<i style="background:${i<=r?col:"#eee"}"></i>`).join("")}</span>`;
  const dayBlocks=[...dates].reverse().map(d=>{
    const parts=["morning","night"].map(k=>{
      const e=getEntry(d,k); if(!e) return "";
      const col=k==="morning"?AM:PM;
      const rows=sectionsWithAnswers(e).filter(x=>x.rating||(withNotes&&x.notes.length)).map(x=>{
        const D=DIMENSIONS[x.sec.dim], label=x.sec.dim==="closing"?"Proud of":D.label;
        return `<tr><td class="a">${label}</td><td class="r">${x.rating?meter(x.rating,col):""}</td><td>${withNotes?x.notes.map(n=>e2(n.a)).join("<br>"):""}</td></tr>`;
      }).join("");
      return rows?`<h4><span class="dot" style="background:${col}"></span>${k==="morning"?"Morning intention":"Nightly reflection"}</h4><table>${rows}</table>`:"";
    }).join("");
    return `<section><h3>${e2(fmtDate(d))}</h3>${parts}</section>`;
  }).join("");

  const nM=ents.filter(e=>e.kind==="morning").length, nN=ents.filter(e=>e.kind==="night").length;
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Bookends check-in summary · ${e2(fmtDate(start))} to ${e2(fmtDate(end))}</title>
<style>body{font:15px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;color:${INK};max-width:760px;margin:24px auto;padding:0 16px}
h1{font-size:1.4rem;margin:0}h2{font-size:1.1rem;margin:28px 0 10px;border-bottom:1px solid #ddd;padding-bottom:4px}h3{font-size:1rem;margin:18px 0 4px}
h4{font-size:.85rem;margin:8px 0 4px;color:${MUTED};text-transform:uppercase;letter-spacing:.03em;display:flex;align-items:center;gap:6px}
.meta{color:${MUTED};font-size:.85rem}.note{background:#f6f1e9;border-radius:8px;padding:10px 12px;font-size:.85rem;margin:14px 0}
.legend{display:flex;gap:16px;font-size:.85rem;color:${MUTED};margin:4px 0 10px}.legend i,.dot{display:inline-block;width:11px;height:11px;border-radius:3px;margin-right:5px;vertical-align:-1px}
.trends{display:grid;grid-template-columns:1fr 1fr;gap:6px 18px}.trend{margin:0}.trend figcaption{font-size:.85rem;font-weight:600;margin-bottom:-2px}
table{border-collapse:collapse;width:100%;margin-bottom:6px}td{border-top:1px solid #eee;padding:5px 6px;vertical-align:top}td.a{width:120px;font-weight:600}td.r{width:96px}
.meter{display:inline-flex;gap:2px;vertical-align:middle}.meter i{width:14px;height:10px;border-radius:2px;display:inline-block}
@media(max-width:560px){.trends{grid-template-columns:1fr}}
@media print{.note{border:1px solid #ccc}section,figure{break-inside:avoid}*{-webkit-print-color-adjust:exact;print-color-adjust:exact}}</style></head><body>
<h1>Bookends check-in summary</h1>
<div class="meta">${e2(fmtDate(start))} to ${e2(fmtDate(end))} (${days} days) · created ${e2(new Date().toLocaleString())}</div>
<div class="note">Shared by the person who wrote it. Bookends doesn't send or store this summary anywhere. Ratings are on a 1 to 5 scale, where 5 is the most positive end of each scale.${withNotes?"":" Written notes were left out by choice."}</div>
<div class="legend"><span><i style="background:${AM}"></i>Morning intention</span><span><i style="background:${PM}"></i>Nightly reflection</span></div>
<h2>Check-ins</h2>
<p style="margin:0 0 6px">Checked in on <b>${dates.length}</b> of ${days} days · ${nM} morning intention${nM===1?"":"s"} · ${nN} nightly reflection${nN===1?"":"s"}</p>
${strip}
<h2>Average by wellness area</h2>${bars}
<h2>Trends over time</h2><div class="trends">${trends}</div>
<h2>Day by day</h2>${dayBlocks||"<p>No check-ins in this range.</p>"}
</body></html>`;
}
/* Same period and notes choice as the report, as structured data a provider's tools can read. */
function providerSummaryJSON(days, withNotes){
  const end=today(), start=addDays(end,-(days-1));
  const ents=S.entries.filter(e=>e.date>=start && e.date<=end);
  const dates=[...new Set(ents.map(e=>e.date))].sort();
  const areaLabel=dim=>dim==="closing"?"Proud of":(DIMENSIONS[dim]?.label||dim);
  const questions={};
  for(const k of ["morning","night"]){
    questions[k]={};
    for(const sec of FORMS[k].sections){
      if(sec.scale) questions[k][sec.scale.id]={area:areaLabel(sec.dim),type:"rating",question:sec.scale.q,low:sec.scale.low,high:sec.scale.high};
      if(withNotes) for(const pr of sec.prompts||[]) questions[k][pr.id]={area:areaLabel(sec.dim),type:"note",question:pr.q};
      if(withNotes && sec.dim==="emotional") questions[k][FEEL_KEY]={area:areaLabel(sec.dim),type:"feelings",question:"Feelings picked from the feelings wheel (up to 3)"};
    }
  }
  const averages={};
  for(const k of ["morning","night"]) for(const sec of FORMS[k].sections){ if(!sec.scale) continue;
    const v=ents.filter(e=>e.kind===k).map(e=>+e.answers[sec.scale.id]).filter(Boolean);
    (averages[sec.dim] ||= {area:areaLabel(sec.dim)})[k]=v.length?Math.round(v.reduce((a,b)=>a+b,0)/v.length*100)/100:null; }
  const dayList=dates.map(d=>{
    const out={date:d};
    for(const k of ["morning","night"]){
      const e=getEntry(d,k); if(!e) continue;
      const ratings={}, notes={};
      for(const sec of FORMS[k].sections){
        if(sec.scale){ const r=+e.answers[sec.scale.id]; if(r) ratings[sec.scale.id]=r; }
        if(withNotes) for(const pr of sec.prompts||[]){ const t=String(e.answers[pr.id]||"").trim(); if(t) notes[pr.id]=t; }
        if(withNotes && sec.dim==="emotional" && Array.isArray(e.answers[FEEL_KEY]) && e.answers[FEEL_KEY].length) notes[FEEL_KEY]=[...e.answers[FEEL_KEY]];
      }
      out[k]=withNotes?{ratings,notes}:{ratings};
    }
    return out;
  });
  return JSON.stringify({
    source:"Bookends (bookends.day)", format:"bookends-provider-summary", version:1,
    created:new Date().toISOString(),
    period:{start,end,days}, includesNotes:withNotes,
    scale:{min:1,max:5,description:"5 is the most positive end of each scale"},
    summary:{daysCheckedIn:dates.length, morningIntentions:ents.filter(e=>e.kind==="morning").length, nightlyReflections:ents.filter(e=>e.kind==="night").length, averages},
    questions, days:dayList
  },null,2);
}
async function downloadProviderData(days,withNotes){
  if(!S.entries.length) return toast("No check-ins to share yet.");
  const ok=await saveFile(`bookends-summary-${today()}.json`, providerSummaryJSON(days,withNotes), "application/json");
  if(ok && !noteShare()) toast("Data saved. You decide who sees it.");
}
async function downloadProviderSummary(days,withNotes){
  if(!S.entries.length) return toast("No check-ins to share yet.");
  const ok=await saveFile(`bookends-summary-${today()}.html`, providerSummaryHTML(days,withNotes), "text/html");
  if(ok && !noteShare()) toast("Summary saved. You decide who sees it.");
}

async function downloadBackup(){
  if(!hasData()) return toast("Nothing to back up yet.");
  const filename=`bookends-backup-${today()}.json`, json=backupJSON();
  if(await saveFile(filename,json,"application/json")){
    try{ localStorage.setItem(BACKUP_KEY,new Date().toISOString()); }catch(e){}
    const before=earnedBadges(S.entries);
    if(!(S.backups||[]).includes(today())){ S.backups=[...(S.backups||[]),today()].sort(); saveBackupLog(); }
    const after=earnedBadges(S.entries), fresh=badgeList().filter(b=>after[b.id]&&!before[b.id]);
    if(!S.form) render();
    if(fresh.length) celebrate(fresh,computeStats(S.entries)); else toast(`Saved ${filename}`);
  }
}
const hourOptions=(lo,hi,sel)=>{ let o=""; for(let h=lo;h<=hi;h++) o+=`<option value="${h}" ${h===sel?"selected":""}>${h===24?"Midnight":h===12?"Noon":hourLabel(h)}</option>`; return o; };
function renderSettings(){
  const P=S.prefs;
  $app.innerHTML = `
    <div class="card">
      <h2 style="font-size:1.15rem">Preferences</h2>
      <div class="pref-label"><b>Check-in windows</b><span class="small muted">When each check-in is open. Each window can be 1 to 8 hours.</span></div>
      <div class="times">
        <div class="time-row"><span>🌅 Morning intention</span>
          <span class="range"><select id="pMS" aria-label="Morning opens">${hourOptions(0,22,P.morningStart)}</select><span class="muted">to</span>
          <select id="pME" aria-label="Morning closes">${hourOptions(P.morningStart+1,Math.min(P.morningStart+8,23),P.morningEnd)}</select></span></div>
        <div class="time-row"><span>🌙 Nightly reflection</span>
          <span class="range"><select id="pNS" aria-label="Night opens">${hourOptions(P.morningEnd,23,P.nightStart)}</select><span class="muted">to</span>
          <select id="pNE" aria-label="Night closes">${hourOptions(P.nightStart+1,Math.min(P.nightStart+8,24),P.nightEnd)}</select></span></div>
      </div>
      <div class="pref-label" style="margin-top:18px"><b>Daily affirmations</b><span class="small muted">Choose how they show up.</span></div>
      <div class="choices" role="radiogroup" aria-label="Daily affirmations">
        ${[["off","🚫","Off","No affirmations."],["embedded","📌","On the Today screen","Shown right on the main page."],["popup","🌤️","Pop-up","Opens once a day on your first visit. A small row on the Today screen reopens it."]]
          .map(([v,ic,t,d])=>`<label class="choice ${P.affMode===v?"on":""}"><input type="radio" name="affMode" value="${v}" ${P.affMode===v?"checked":""}><span class="c-ic">${ic}</span><span class="c-t"><b>${t}</b><span class="small muted">${d}</span></span></label>`).join("")}
      </div>
      <div class="pref-label" style="margin-top:18px"><b>Skills</b></div>
      <label class="pref" style="border-top:0;padding:4px 2px"><span><b>Suggest a skill on rough days</b><span class="small muted">After a low Emotional rating, Today shows a gentle link to the Skills tab.</span></span><input type="checkbox" class="switch" id="pSkill" ${P.skillNudge?"checked":""}></label>
      <div class="pref-label" style="margin-top:18px"><b>Display</b></div>
      <label class="pref" style="border-top:0;padding:4px 2px"><span><b>Color-blind friendly colors</b><span class="small muted">Uses colors that are easier to tell apart with color vision differences, and adds patterns and check marks where color shows meaning.</span></span><input type="checkbox" class="switch" id="pCvd" ${P.colorMode==="cvd"?"checked":""}></label>
    </div>`+`
    <div class="card" style="margin-top:14px" id="reminderCard">
      <h2 style="font-size:1.15rem">Reminders</h2>
      <p class="small muted">Add a daily reminder to your calendar app. It goes off when each check-in window opens. Nothing is sent anywhere: you download a calendar file and your phone handles the rest.</p>
      <div class="rem-list">
        ${["morning","night"].map(k=>`<div class="rem-row"><button class="btn ${S.reminders?.[k]&&S.reminders[k].hour===win(k)[0]?"ghost":""}" id="rem-${k}">${k==="morning"?"🌅 Set Morning reminder":"🌙 Set Nightly reminder"}</button>
          <span class="small muted">${reminderStatus(k)}</span></div>`).join("")}
      </div>
      <p class="small muted" style="margin-top:10px">On iPhone, open the downloaded file and tap <b>Add to Calendar</b>. If you change your check-in windows later, set the reminder again.</p>
    </div>
    <div class="card" style="margin-top:14px" id="shareCard">
      <h2 style="font-size:1.15rem">Share with your provider</h2>
      <p class="small muted">Make a simple, printable summary of your check-ins, with charts of your ratings over time, to share with a therapist or counselor. Nothing is sent anywhere. You download it and decide who sees it.</p>
      <div class="share-opts">
        <label class="time-row"><span>Time period</span><select id="shDays">${[7,14,30,90].map(n=>`<option value="${n}" ${n===14?"selected":""}>Last ${n} days</option>`).join("")}</select></label>
        <label class="pref" style="border-top:0;padding:4px 2px"><span><b>Include my written notes</b><span class="small muted">Turn off to share ratings only.</span></span><input type="checkbox" class="switch" id="shNotes" checked></label>
      </div>
      <div class="actions" style="justify-content:flex-start"><button class="btn" id="shGo" ${S.entries.length?"":"disabled"}>⬇ Download as Report (HTML)</button><button class="btn ghost" id="shJson" ${S.entries.length?"":"disabled"}>⬇ Download as Data (JSON)</button></div>
      <p class="small muted" style="margin-top:8px">The report is easy to read and print. The data file has the same ratings and notes (if included), as structured data that your provider's software can read.</p>
    </div>
    <div class="card" style="margin-top:14px">
      <h2 style="font-size:1.15rem">Where your entries live</h2>
      <p class="small muted">${S.store.kind==="cloud"
        ?"Saved to your private space in this page's store. Only you can read them — not the page's owner or anyone it's shared with."
        :"Saved in this browser only. Clearing site data or switching devices will lose them, so export a backup now and then."}</p>
    </div>
    <div class="card" style="margin-top:14px">
      <h2 style="font-size:1.15rem">Back up</h2>
      <p class="small muted">Save all ${S.entries.length} check-ins${Object.keys(S.affLog).length?` and ${Object.keys(S.affLog).length} days of affirmation history`:""} as a file you can keep somewhere safe and restore below. ${lastBackupText()}</p>
      <div class="actions" style="justify-content:flex-start"><button class="btn" id="export" ${hasData()?"":"disabled"}>⬇ Download backup</button><button class="btn ghost" id="copy" ${hasData()?"":"disabled"}>Copy JSON</button></div>
    </div>
    <div class="card" style="margin-top:14px">
      <h2 style="font-size:1.15rem">Restore / import</h2>
      <p class="small muted">Paste a JSON backup. Entries with the same date and type are replaced.</p>
      <textarea id="imp" placeholder='[{"key":"2026-11-20_morning", ...}]' style="min-height:110px;font-family:ui-monospace,monospace;font-size:.8rem"></textarea>
      <div class="actions" style="justify-content:flex-start"><label class="btn ghost" style="cursor:pointer">Choose file…<input type="file" id="impfile" accept=".json,application/json" hidden></label><button class="btn" id="doimp">Import</button></div>
    </div>
    <div class="card" style="margin-top:14px">
      <h2 style="font-size:1.15rem">Start over</h2>
      <p class="small muted">Permanently delete all ${S.entries.length} entries and badges. Back up first if you want to keep them.</p>
      <div class="actions" style="justify-content:flex-start"><button class="btn danger" id="wipe" ${hasData()?"":"disabled"}>Delete all entries</button></div>
    </div>`;
  document.getElementById("impfile").onchange=async e=>{ const f=e.target.files[0]; if(!f) return; document.getElementById("imp").value=await f.text(); document.getElementById("doimp").click(); };
  document.getElementById("wipe").onclick=()=>confirmBox("Delete everything?",`All ${S.entries.length} check-ins and your badges will be gone. This can't be undone.`,"Delete all",async()=>{
    let n=0; for(const e of [...S.entries]){ try{ await S.store.remove(e.key); S.entries=S.entries.filter(x=>x.key!==e.key); n++; }catch(err){ break; } }
    try{ await affSaving; await S.store.remove(AFF_META_KEY); S.affLog={}; }catch(err){}
    try{ await S.store.remove(BACKUPS_META_KEY); S.backups=[]; }catch(err){}
    try{ await S.store.remove(HOME_META_KEY); S.homeDate=null; }catch(err){}
    try{ await S.store.remove(SKILLS_META_KEY); S.skillDate=null; S.skillLog={}; }catch(err){}
    try{ await S.store.remove(SHARES_META_KEY); S.shares=[]; }catch(err){}
    try{ await S.store.remove(REMINDERS_META_KEY); S.reminders={}; }catch(err){}
    toast(S.entries.length?`Deleted ${n}; some couldn't be removed — try again.`:"All entries deleted"); render();
  });
  const setWin=(key,kind)=>e=>{ S.prefs[key]=+e.target.value; fixWindows(S.prefs); savePrefs(); render();
    const [a,b]=win(kind); toast(`${kind==="morning"?"Morning intention":"Nightly reflection"}: ${hourLabel(a)} to ${hourLabel(b)}`); };
  document.getElementById("pMS").onchange=setWin("morningStart","morning");
  document.getElementById("pME").onchange=setWin("morningEnd","morning");
  document.getElementById("pNS").onchange=setWin("nightStart","night");
  document.getElementById("pNE").onchange=setWin("nightEnd","night");
  ["morning","night"].forEach(k=>document.getElementById(`rem-${k}`).onclick=()=>setReminder(k));
  document.getElementById("pSkill").onchange=e=>{ S.prefs.skillNudge=e.target.checked; savePrefs(); };
  document.getElementById("pCvd").onchange=e=>{
    S.prefs.colorMode=e.target.checked?"cvd":"standard"; applyColorMode(S.prefs.colorMode); savePrefs(); render();
    toast(e.target.checked?"Color-blind friendly colors on":"Standard colors on");
  };
  document.querySelectorAll('input[name="affMode"]').forEach(r=>r.onchange=()=>{
    S.prefs.affMode=r.value; savePrefs(); render();
    toast({off:"Daily affirmations turned off",embedded:"Affirmations will show on the Today screen",popup:"Affirmations will pop up once a day"}[r.value]);
  });
  document.getElementById("export").onclick=downloadBackup;
  document.getElementById("shGo").onclick=()=>downloadProviderSummary(+document.getElementById("shDays").value, document.getElementById("shNotes").checked);
  document.getElementById("shJson").onclick=()=>downloadProviderData(+document.getElementById("shDays").value, document.getElementById("shNotes").checked);
  document.getElementById("copy").onclick=async()=>{
    const json=backupJSON();
    try{ await navigator.clipboard.writeText(json); toast("Copied to clipboard"); }
    catch(e){ const t=document.getElementById("imp"); t.value=json; t.select(); toast("Couldn't copy automatically — it's selected below, copy it manually"); }
  };
  document.getElementById("doimp").onclick=async()=>{
    let arr; try{ arr=JSON.parse(document.getElementById("imp").value); if(!Array.isArray(arr)) throw 0; }catch(e){ return toast("That doesn't look like a valid backup."); }
    const ok=arr.filter(e=>e&&/^\d{4}-\d{2}-\d{2}$/.test(e.date)&&FORMS[e.kind]&&e.answers&&typeof e.answers==="object")
      .map(e=>({key:`${e.date}_${e.kind}`,date:e.date,kind:e.kind,answers:e.answers,createdAt:e.createdAt||new Date().toISOString(),updatedAt:new Date().toISOString(),v:1}));
    let n=0; for(const e of ok){ try{ await S.store.save(e); S.entries=S.entries.filter(x=>x.key!==e.key).concat(e); n++; }catch(err){ break; } }
    const meta=arr.find(e=>e&&e.key===AFF_META_KEY&&e.days&&typeof e.days==="object");
    if(meta){ for(const [d,ids] of Object.entries(meta.days)) if(/^\d{4}-\d{2}-\d{2}$/.test(d)&&Array.isArray(ids)) S.affLog[d]=[...new Set([...(S.affLog[d]||[]),...ids.map(String)])]; saveAffLog(); await affSaving; }
    const skm=arr.find(e=>e&&e.key===SKILLS_META_KEY&&e.log&&typeof e.log==="object");
    if(skm){ const inc=cleanSkillLog(skm.log);
      for(const [d,list] of Object.entries(inc)){ const have=new Set((S.skillLog[d]||[]).map(r=>r.id+r.at)); S.skillLog[d]=(S.skillLog[d]||[]).concat(list.filter(r=>!have.has(r.id+r.at))); }
      if(!S.skillDate||(/^\d{4}-\d{2}-\d{2}$/.test(skm.date||"")&&skm.date<S.skillDate)) S.skillDate=/^\d{4}-\d{2}-\d{2}$/.test(skm.date||"")?skm.date:(Object.keys(inc).sort()[0]||S.skillDate);
      saveSkillLog(); await affSaving; }
    toast(`Imported ${n} check-ins${meta?" + affirmation history":""}${skm?" + skills log":""}`); render();
  };
}

/* ---------- Dialog focus: move focus into any pop-up that opens, keep Tab inside it, Esc closes it, and focus returns afterwards ---------- */
(function(){
  let returnTo=null, returnSel=null;
  const selFor=el=>!el||el===document.body?null:el.id?"#"+CSS.escape(el.id):el.dataset?.open?`[data-open="${el.dataset.open}"]`:el.dataset?.v?`#tabs [data-v="${el.dataset.v}"]`:null;
  const isDlgBg=n=>n.nodeType===1 && (n.classList.contains("modal-bg")||n.classList.contains("sheet-bg"));
  const topDialog=()=>{ const ds=[...document.querySelectorAll(".sheet-bg:not(.closing) .sheet, .modal-bg .modal")]; return ds[ds.length-1]||null; };
  new MutationObserver(muts=>{
    for(const m of muts){
      m.addedNodes.forEach(n=>{ if(!isDlgBg(n)) return;
        if(document.querySelectorAll(".sheet-bg,.modal-bg").length===1){ returnTo=document.activeElement; returnSel=selFor(returnTo); }
        const d=n.querySelector(".sheet,.modal"); if(!d) return;
        d.setAttribute("tabindex","-1"); if(!d.getAttribute("role")) d.setAttribute("role","dialog"); d.setAttribute("aria-modal","true");
        setTimeout(()=>{ if(!d.contains(document.activeElement)) d.focus({preventScroll:true}); },30);
      });
      m.removedNodes.forEach(n=>{ if(!isDlgBg(n)) return;
        const t=topDialog();
        if(t) t.focus({preventScroll:true});
        else { const el=returnTo && document.body.contains(returnTo) ? returnTo : returnSel && document.querySelector(returnSel); if(el) el.focus({preventScroll:true}); }
        if(!t){ returnTo=null; returnSel=null; }
      });
    }
  }).observe(document.body,{childList:true});
  document.addEventListener("keydown",e=>{
    const d=topDialog(); if(!d) return;
    if(e.key==="Escape"){
      if(modalEl && d.closest(".modal-bg")){ e.preventDefault(); closeModal(); }
      else if(affBg && d.closest(".aff-bg")){ e.preventDefault(); closeAffSheet(); }
      else if(dayBg && d.closest(".sheet-bg")===dayBg){ e.preventDefault(); closeDaySheet(); }
      else if(skillBg && d.closest(".sheet-bg")===skillBg){ e.preventDefault(); closeSkill(); }
      return; // the check-in form handles its own Esc
    }
    if(e.key!=="Tab") return;
    const f=[...d.querySelectorAll('button:not([disabled]),[href],input:not([disabled]),select:not([disabled]),textarea,[tabindex]:not([tabindex="-1"])')].filter(x=>x.offsetParent!==null);
    if(!f.length){ e.preventDefault(); return; }
    const first=f[0], last=f[f.length-1];
    if(e.shiftKey && (document.activeElement===first||document.activeElement===d)){ e.preventDefault(); last.focus(); }
    else if(!e.shiftKey && document.activeElement===last){ e.preventDefault(); first.focus(); }
  });
})();

/* ---------- UI helpers ---------- */
let modalEl=null;
function modal(html,bind){ closeModal(); modalEl=document.createElement("div"); modalEl.className="modal-bg"; modalEl.innerHTML=`<div class="card modal" role="dialog" aria-modal="true">${html}</div>`;
  const mh=modalEl.querySelector("h2"); if(mh){ mh.id="modal-title"; modalEl.firstElementChild.setAttribute("aria-labelledby","modal-title"); }
  modalEl.onclick=e=>{ if(e.target===modalEl||e.target.closest("[data-close]")) closeModal(); }; document.body.appendChild(modalEl); bind&&bind(modalEl); }
function closeModal(){ modalEl?.remove(); modalEl=null; }
function confirmBox(title,body,label,fn){ modal(`<h2>${title}</h2><p class="muted">${body}</p><div class="actions" style="justify-content:center"><button class="btn ghost" data-close>Cancel</button><button class="btn" id="ok" style="background:var(--danger)">${label}</button></div>`,el=>{el.querySelector("#ok").onclick=()=>{closeModal();fn();};}); }
/* Encouragement shown after every new check-in. Add lines freely. */
const AFFIRMATIONS = {
  morning: ["You showed up for yourself this morning. That matters.","Intention set. You're already ahead of the day.",
            "Checking in is a skill, and you just practiced it.","A grounded start. Nicely done.","You gave yourself a few honest minutes. Well done."],
  night:   ["You closed the day with care. That's a win.","Reflection done. Rest well tonight.",
            "Looking back honestly takes courage. Good work.","Another day, bookended. Proud of you.","You made space to notice your day. That counts."],
};
function winCard(kind,s){
  const earned=earnedBadges(S.entries);
  const next=nextUp(s,earned);
  const lines=AFFIRMATIONS[kind]; const msg=lines[(s.total+new Date().getDate())%lines.length];
  const full=s.byDate[today()]?.morning && s.byDate[today()]?.night;
  document.querySelectorAll(".win").forEach(w=>w.remove());
  const w=document.createElement("div"); w.className="win card"; w.setAttribute("role","status");
  w.innerHTML=`<div class="win-em">${kind==="morning"?"🌅":"🌙"}</div><div><b>${msg}</b>
    <div class="small muted">🔥 ${s.current}-day streak${full?" · both check-ins today ⭕":""}${next?` · next: ${next.b.em} ${next.b.name} (${Math.min(next.c,next.g)}/${next.g})`:""}</div></div>`;
  w.onclick=()=>w.remove(); document.body.appendChild(w); setTimeout(()=>w.remove(),6000);
}
function toast(msg){ document.querySelectorAll(".toast").forEach(t=>t.remove()); const t=document.createElement("div"); t.className="toast"; t.textContent=msg; document.body.appendChild(t); setTimeout(()=>t.remove(),3200); }
function celebrate(badges,s){
  confetti(160);
  modal(`<div class="big">${badges[0].em}</div><h2>${badges.length>1?"New badges!":"Badge unlocked!"}</h2>
    <p class="muted">${s.current>0?`You're on a ${s.current}-day check-in streak. `:""}Keep showing up for yourself.</p>
    <div class="list">${badges.map(b=>`<div><span class="em">${b.em}</span><span><b>${b.name}</b><br><span class="small muted">${b.desc}</span></span></div>`).join("")}</div>
    <button class="btn" data-close>Thanks!</button>`);
}
function confetti(count){
  if(matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const c=document.getElementById("confetti"), x=c.getContext("2d"); c.width=innerWidth; c.height=innerHeight;
  const cols=["#d98b3a","#4a5b9b","#2f6b52","#c99a2e","#c0604d","#8a6bb8"];
  const ps=[...Array(count)].map(()=>({x:c.width/2+(Math.random()-.5)*120,y:c.height*.35,vx:(Math.random()-.5)*12,vy:-Math.random()*12-4,r:Math.random()*6+3,c:cols[Math.random()*cols.length|0],a:Math.random()*6,va:(Math.random()-.5)*.3}));
  let f=0; (function step(){ x.clearRect(0,0,c.width,c.height); ps.forEach(p=>{p.vy+=.35;p.vx*=.99;p.x+=p.vx;p.y+=p.vy;p.a+=p.va; x.save();x.translate(p.x,p.y);x.rotate(p.a);x.fillStyle=p.c;x.fillRect(-p.r/2,-p.r/2,p.r,p.r*.6);x.restore();});
    if(++f<140) requestAnimationFrame(step); else x.clearRect(0,0,c.width,c.height); })();
}

/* ---------- Boot ---------- */
(async function boot(){
  countVisit();
  const affReady = Promise.all([loadAffirmations(), loadSuggestions(), loadSkills()]);
  S.store = await pickStore();
  await affReady;
  try{ const all = await S.store.list(); const meta=all.find(e=>e.key===AFF_META_KEY);
    S.affLog = (meta&&meta.days&&typeof meta.days==="object")?{...meta.days}:{}; S.entries = all.filter(e=>FORMS[e.kind]);
    const sk=all.find(e=>e.key===SKILLS_META_KEY); S.skillDate=/^\d{4}-\d{2}-\d{2}$/.test(sk?.date||"")?sk.date:null; S.skillLog=cleanSkillLog(sk?.log);
    const hm=all.find(e=>e.key===HOME_META_KEY); S.homeDate=/^\d{4}-\d{2}-\d{2}$/.test(hm?.date||"")?hm.date:null;
    const rm=all.find(e=>e.key===REMINDERS_META_KEY); S.reminders=(rm?.reminders&&typeof rm.reminders==="object")?rm.reminders:{};
    const sh=all.find(e=>e.key===SHARES_META_KEY); S.shares=Array.isArray(sh?.days)?sh.days.filter(d=>/^\d{4}-\d{2}-\d{2}$/.test(d)):[];
    const bk=all.find(e=>e.key===BACKUPS_META_KEY); S.backups=Array.isArray(bk?.days)?bk.days.filter(d=>/^\d{4}-\d{2}-\d{2}$/.test(d)):[];
    const p=all.find(e=>e.key===PREFS_KEY); let lp=null; try{ lp=JSON.parse(localStorage.getItem("ir_prefs")||"null"); }catch(e){}
    S.prefs=normalizePrefs({...(lp||{}), ...((p&&p.prefs)||{})}); applyColorMode(S.prefs.colorMode); }
  catch(e){ S.entries=[]; toast("Couldn't load your entries — check your connection."); }
  if(/^#about-/.test(location.hash)){ S.view="about"; document.querySelectorAll("#tabs button").forEach(b=>b.classList.toggle("on",b.dataset.v==="about")); }
  render();
  const homeFresh=noteHomeScreen();
  if(homeFresh.length){ render(); setTimeout(()=>celebrate(homeFresh,computeStats(S.entries)),400); } // affirmation pop-up waits until next visit
  else if(S.view==="about") setTimeout(scrollToHash,60); else maybeAutoAffirm();
})();
