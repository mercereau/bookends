/* =========================================================
   1. FORM CONTENT — edit prompts here.
   Each dimension has a 1–5 scale (optional) and one or more prompts.
   IDs are stored with entries, so keep them stable once you have data.
   ========================================================= */
const DIMENSIONS = {
  emotional:     {label:"Emotional",     icon:"💛", color:"#d98b3a"},
  physical:      {label:"Physical",      icon:"🏃", color:"#c0604d"},
  spiritual:     {label:"Spiritual",     icon:"🕊️", color:"#8a6bb8"},
  social:        {label:"Social",        icon:"🤝", color:"#3f8f9b"},
  intellectual:  {label:"Intellectual",  icon:"📚", color:"#4a6fb5"},
  occupational:  {label:"Occupational",  icon:"🧭", color:"#5d8a4a"},
  environmental: {label:"Environmental", icon:"🌿", color:"#3f8a6a"},
  financial:     {label:"Financial",     icon:"🪙", color:"#b08a2e"},
  community:     {label:"Community",     icon:"🏡", color:"#a0607a"},
  closing:       {label:"Closing",       icon:"⭐", color:"#c99a2e"},
};

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
  const out={}; const dates=[...new Set(entries.map(e=>e.date).concat(Object.keys(S.affLog||{})))].filter(d=>d<=today()).sort();
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
const S = { affLog:{}, store:null, entries:[], view:"today", form:null, cal:new Date() };
const $app = document.getElementById("app");

function setView(v){ S.view=v; S.form=null; document.querySelectorAll("#tabs button").forEach(b=>b.classList.toggle("on",b.dataset.v===v)); render(); window.scrollTo(0,0); }
document.getElementById("tabs").addEventListener("click",e=>{ const b=e.target.closest("button"); if(b) setView(b.dataset.v); });

function getEntry(date,kind){ return S.entries.find(e=>e.date===date && e.kind===kind); }
function avgRating(e){ const v=Object.entries(e.answers).filter(([k])=>k.endsWith("_scale")).map(([,v])=>+v).filter(Boolean); return v.length?(v.reduce((a,b)=>a+b,0)/v.length):null; }

function render(){
  ({today:renderToday, history:renderHistory, badges:renderBadges, settings:renderSettings})[S.view]();
  if(S.form) renderForm(); else closeSheet();
}

function renderToday(){
  const t=today(), s=computeStats(S.entries), m=getEntry(t,"morning"), n=getEntry(t,"night");
  const h=new Date().getHours(), morningOpen=h<CUTOFF_HOUR;
  document.getElementById("greeting").textContent = h<12?"Good morning. What's your intention today?": h<18?"Good afternoon. Checking in with yourself?":"Good evening. Time to reflect on the day.";
  const earned=earnedBadges(S.entries);
  const days=[...Array(7)].map((_,i)=>addDays(t,i-6));
  $app.innerHTML = `
    <div class="grid stats">
      <div class="card stat streak"><div class="n">${s.current}🔥</div><div class="l">day streak</div></div>
      <div class="card stat"><div class="n">${s.longest}</div><div class="l">longest streak</div></div>
      <div class="card stat"><div class="n">${s.total}</div><div class="l">check-ins</div></div>
      <div class="card stat"><div class="n">${Object.keys(earned).length}🏅</div><div class="l">${Object.keys(earned).length===1?"badge":"badges"} earned</div></div>
    </div>
    ${holidayBannerHTML(earned)}
    ${visitNudgeHTML()}
    ${affirmCardHTML()}
    <div class="grid checkins">
      ${ciCard("morning",m,morningOpen,"Set the tone for your day","Start check-in →",`Morning window closed at ${hourLabel(CUTOFF_HOUR)}`)}
      ${ciCard("night",n,!morningOpen,"Look back on how today went","Start reflection →",`Opens at ${hourLabel(CUTOFF_HOUR)}`)}
    </div>
    <div class="card" style="margin-top:14px">
      <div class="small muted">Last 7 days</div>
      <div class="week">${days.map(d=>`
        <div class="day ${d===t?"today":""}"><span class="dl">${parse(d).toLocaleDateString(undefined,{weekday:"narrow"})}</span>
          <div class="dots"><span class="dot m ${s.byDate[d]?.morning?"on":""}"></span><span class="dot n ${s.byDate[d]?.night?"on":""}"></span></div>
        </div>`).join("")}</div>
      ${nextBadgeHint(s,earned)}
    </div>
    ${storeNote()}
  `;
  $app.querySelectorAll("[data-open]:not([disabled])").forEach(b=>b.onclick=()=>openForm(b.dataset.open,t));
  scheduleWindowFlip();
  bindAffirm();
  const qb=document.getElementById("quickBackup"); if(qb) qb.onclick=downloadBackup;
}
/* Time windows: midnight–noon = morning only, noon–midnight = night only.
   Change CUTOFF_HOUR to move the switch-over (24h clock). */
const CUTOFF_HOUR = 12;
const hourLabel=h=>new Date(2000,0,1,h).toLocaleTimeString(undefined,{hour:"numeric"});
function ciCard(kind,entry,open,blurb,cta,closedMsg){
  const F=FORMS[kind];
  if(entry) return `<button class="card ci ${kind} done ${open?"":"past"}" data-open="${kind}">
      <span class="ico">${F.icon}</span><h3>${F.title}</h3>
      <span class="st">Logged · avg ${avgRating(entry)?.toFixed(1)??"–"}/5</span>
      <span class="go">${open?"Review / edit →":"Review →"}</span></button>`;
  return `<button class="card ci ${kind} ${open?"":"closed"}" data-open="${kind}" ${open?"":"disabled aria-disabled=\"true\""}>
      <span class="ico">${F.icon}</span><h3>${F.title}</h3>
      <span class="st">${open?blurb:closedMsg}</span>
      <span class="go">${open?cta:"🔒 Not available now"}</span></button>`;
}
// Re-render Today when the clock crosses midnight or the cutoff
let flipTimer=null;
function scheduleWindowFlip(){
  clearTimeout(flipTimer);
  const now=new Date(), next=new Date(now);
  if(now.getHours()<CUTOFF_HOUR) next.setHours(CUTOFF_HOUR,0,5,0); else { next.setDate(next.getDate()+1); next.setHours(0,0,5,0); }
  flipTimer=setTimeout(()=>{ if(!S.form && S.view==="today") render(); }, next-now);
}
function holidayBannerHTML(earned){
  const hs=holidaysOn(today()); if(!hs.length) return "";
  const h=hs[0], got=earned["holiday-"+h.id] && S.entries.some(e=>e.date===today());
  return `<div class="note holiday">${h.em} <b>Happy ${h.name}.</b> ${got?"You checked in today. Be gentle with yourself and enjoy the day.":"Holidays can be a lot. A few minutes for yourself today earns a holiday badge."}</div>`;
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
  const dots=[...Array(lim)].map((_,i)=>`<i class="${i<n?"on":""}"></i>`).join("");
  const foot=`<div class="aff-foot"><span class="aff-dots" aria-label="${n} of ${lim} today">${dots}</span><span>${n} of ${lim} today · ${st.visits} visit${st.visits===1?"":"s"} today${(()=>{const c=affStats(today()).affCurrent;return c>1?` · ☀️ ${c}-day reading streak`:"";})()}</span></div>`;
  if(n===0) return `<section class="card aff" id="aff">
      <div class="aff-label">🌤️ Today's affirmation</div>
      <p class="aff-hint">A thought for your day is waiting. You get ${lim} a day, then it's time for a screen break.</p>
      <button class="btn" id="affReveal">Reveal today's affirmation</button>${foot}</section>`;
  const a=order[(n-1)%order.length], D=a.area&&DIMENSIONS[a.area];
  const more = n<lim
    ? `<button class="btn ghost" id="affMore">One more <span class="muted">(${lim-n} left)</span></button>`
    : `<div class="aff-break"><b>📵 Time for a tech break</b><p>${esc(pickByDay(AFF.data.breakReminders||AFF_FALLBACK.breakReminders,n))}</p><span class="small muted">New affirmations in ${untilTomorrow()}</span></div>`;
  return `<section class="card aff ${a.type==="suggestion"?"sugg":""}" id="aff">
      <div class="aff-label">${a.type==="suggestion"?"🌱 Wellness suggestion":"🌤️ Today's affirmation"}${D?` <span class="aff-area" style="--dc:${D.color}">${D.icon} ${D.label}</span>`:""}</div>
      <blockquote class="aff-text">${esc(a.text)}</blockquote>
      ${a.source?.url&&/^https:\/\//.test(a.source.url)?`<a class="aff-src" href="${esc(a.source.url)}" target="_blank" rel="noopener noreferrer">Inspired by ${esc(a.source.name||"source")} ↗</a>`:""}
      ${more}${foot}</section>`;
}
const AFF_META_KEY="meta_affirmations";
let affSaving=Promise.resolve();
function saveAffLog(){ // one write at a time; kept with the user's entries (synced on the Claude-hosted copy)
  const doc={key:AFF_META_KEY,kind:"meta",days:S.affLog,updatedAt:new Date().toISOString(),v:1};
  affSaving=affSaving.then(()=>S.store.save(doc)).catch(()=>{});
}
function bindAffirm(){
  const reveal=()=>{ const st=affState(), lim=affLimit(); if(st.shown.length>=lim) return;
    const order=dailyOrder(), id=order[st.shown.length%order.length].id; st.shown.push(id); affSave(st);
    const before=earnedBadges(S.entries);
    const day=today(); S.affLog[day]=[...new Set([...(S.affLog[day]||[]),id])]; saveAffLog();
    const now=earnedBadges(S.entries), fresh=badgeList().filter(b=>now[b.id] && !before[b.id]);
    if(fresh.length) setTimeout(()=>{ if(!S.form && S.view==="today"){ const y=scrollY; render(); scrollTo(0,y); } celebrate(fresh,computeStats(S.entries)); },450);
    const el=document.getElementById("aff"); el.outerHTML=affirmCardHTML(); const ne=document.getElementById("aff"); ne.classList.add("aff-in"); bindAffirm(); };
  const r=document.getElementById("affReveal"); if(r) r.onclick=reveal;
  const m=document.getElementById("affMore"); if(m) m.onclick=reveal;
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
  S.form={kind,date,answers:{...(ex?.answers||{})},existing:!!ex,step,dirty:false};
  renderForm();
}
const hasVal=v=>v!==undefined && v!==null && String(v).trim()!=="";
function sectionIds(sec){ return (sec.scale?[sec.scale.id]:[]).concat(sec.prompts.map(p=>p.id)); }
function goStep(n,dir){
  const F=S.form, N=FORMS[F.kind].sections.length;
  F.step=Math.max(0,Math.min(N-1,n)); F.dir=dir; renderForm();
}
function renderForm(){
  const F=S.form, def=FORMS[F.kind], N=def.sections.length, sec=def.sections[F.step], D=DIMENSIONS[sec.dim];
  const last=F.step===N-1, $s=sheetEl();
  $s.className=`sheet ${F.kind}`;
  $s.innerHTML = `
    <header class="sheet-head">
      <div class="sheet-title"><span class="sheet-ico">${def.icon}</span>
        <div><h2 id="sheet-title">${def.title}</h2>
        <input type="date" class="datepick" id="fdate" value="${F.date}" max="${today()}" aria-label="Check-in date"></div></div>
      <button class="xbtn" id="back" aria-label="Close">✕</button>
    </header>
    <div class="steps" role="tablist">${def.sections.map((x,i)=>{const XD=DIMENSIONS[x.dim]; const done=sectionIds(x).some(id=>hasVal(F.answers[id]));
      return `<button class="stepdot ${i===F.step?"cur":""} ${done?"done":""}" style="--dc:${XD.color}" data-step="${i}" title="${XD.label}" aria-label="${XD.label}">${XD.icon}</button>`;}).join("")}</div>
    <div class="sheet-body">
      <div class="stepcount">Step ${F.step+1} of ${N}</div>
      <section class="dim step-in ${F.dir==="back"?"from-left":""}" style="--dc:${D.color}">
        <h3><span>${D.icon}</span>${D.label}${sec.dim==="closing"?"":" Wellness"}</h3>
        ${sec.scale?`<div class="q"><label class="qt">${esc(sec.scale.q)}</label>
          <div class="scale" data-id="${sec.scale.id}">${[1,2,3,4,5].map(v=>`<button type="button" data-v="${v}" class="${+F.answers[sec.scale.id]===v?"on":""}" aria-label="${v}">${v}</button>`).join("")}</div>
          <div class="anchors"><span>1 = ${esc(sec.scale.low)}</span><span>5 = ${esc(sec.scale.high)}</span></div></div>`:""}
        ${sec.prompts.map(p=>`<div class="q"><label class="qt" for="${p.id}">${esc(p.q)}</label>
          <textarea id="${p.id}" data-id="${p.id}" placeholder="Write freely… or skip">${esc(F.answers[p.id]||"")}</textarea></div>`).join("")}
      </section>
      ${F.existing&&!last?`<div style="text-align:right;margin-top:10px"><button class="linkbtn" id="savenow">Save changes now</button></div>`:""}
    </div>
    <footer class="sheet-foot">
      ${F.existing&&last?`<button class="btn danger" id="del" style="margin-right:auto">Delete</button>`:""}
      <button class="btn ghost" id="prev" ${F.step===0?"disabled":""}>← Back</button>
      ${last
        ?`<button class="btn" id="save">${F.existing?"Save changes":"Complete ✓"}</button>`
        :`<button class="btn" id="next">Next: ${DIMENSIONS[def.sections[F.step+1].dim].label} →</button>`}
    </footer>`;
  $s.querySelector(".sheet-body").scrollTop=0;
  const refreshDot=()=>{ F.dirty=true; const dot=$s.querySelector(`.stepdot[data-step="${F.step}"]`); dot.classList.toggle("done",sectionIds(sec).some(id=>hasVal(F.answers[id]))); };
  $s.querySelectorAll(".scale").forEach(el=>el.onclick=e=>{
    const b=e.target.closest("button"); if(!b) return;
    const v=+b.dataset.v; const id=el.dataset.id;
    F.answers[id] = (+F.answers[id]===v)?undefined:v;
    el.querySelectorAll("button").forEach(x=>x.classList.toggle("on",+x.dataset.v===F.answers[id]));
    refreshDot();
  });
  $s.querySelectorAll("textarea").forEach(t=>t.oninput=()=>{F.answers[t.dataset.id]=t.value; refreshDot();});
  $s.querySelectorAll(".stepdot").forEach(b=>b.onclick=()=>{const n=+b.dataset.step; goStep(n,n<F.step?"back":"fwd");});
  $s.querySelector("#fdate").onchange=e=>{ const d=e.target.value; if(!d||d>today()) return; const keep=F.answers, st=F.step, dirty=F.dirty; openForm(F.kind,d,st); if(!S.form.existing){ S.form.answers=keep; S.form.dirty=dirty; renderForm(); } };
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
    if(/^[1-5]$/.test(ev.key) && sec.scale){ $s.querySelector(`.scale button[data-v="${ev.key}"]`)?.click(); }
    else if(ev.key==="ArrowRight" && !last) goStep(F.step+1,"fwd");
    else if(ev.key==="ArrowLeft" && F.step>0) goStep(F.step-1,"back");
  };
}
async function saveForm(){
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

/* ---------- History ---------- */
function renderHistory(){
  const s=computeStats(S.entries), t=today();
  const c=S.cal, y=c.getFullYear(), mo=c.getMonth();
  const first=new Date(y,mo,1), startPad=first.getDay(), dim=new Date(y,mo+1,0).getDate();
  const cells=[]; for(let i=0;i<startPad;i++) cells.push(`<span></span>`);
  for(let d=1; d<=dim; d++){ const ds=ymd(new Date(y,mo,d)); const r=s.byDate[ds]||{};
    cells.push(`<button class="cell ${ds>t?"future":""} ${ds===t?"today":""}" data-d="${ds}" title="${fmtDate(ds)}" ${ds>t?"disabled":""}><span class="m ${r.morning?"on":""}"></span><span class="n ${r.night?"on":""}"></span></button>`); }
  const list=[...S.entries].sort((a,b)=>(b.date+b.kind).localeCompare(a.date+a.kind)).slice(0,60);
  $app.innerHTML = `
    <div class="card">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
        <button class="back" id="prev">←</button>
        <h2 style="font-size:1.1rem">${c.toLocaleDateString(undefined,{month:"long",year:"numeric"})}</h2>
        <button class="back" id="next">→</button>
      </div>
      <div class="cal">${"SMTWTFS".split("").map(d=>`<span class="h">${d}</span>`).join("")}${cells.join("")}</div>
      <div class="legend"><span><i style="background:var(--morning)"></i>Morning</span><span><i style="background:var(--night)"></i>Night</span><span class="muted">Tap a day to view or fill it in</span></div>
    </div>
    <div class="section-title"><h2>Trends</h2><span class="small muted">last 30 days · 1–5</span></div>
    <div class="card">${trendsHTML()}</div>
    <div class="section-title"><h2>Entries</h2><span class="small muted">${S.entries.length} total</span></div>
    <div>${list.length?list.map(e=>`<button class="entry" data-k="${e.key}"><span class="tag">${FORMS[e.kind].icon}</span><span class="t"><b>${FORMS[e.kind].title}</b><br><span class="small muted">${fmtDate(e.date)}</span></span><span class="avg">${avgRating(e)?.toFixed(1)??"–"}</span></button>`).join(""):`<div class="card muted">No entries yet. Your first check-in will show up here.</div>`}</div>
  `;
  document.getElementById("prev").onclick=()=>{S.cal=new Date(y,mo-1,1);render();};
  document.getElementById("next").onclick=()=>{S.cal=new Date(y,mo+1,1);render();};
  $app.querySelectorAll(".cell[data-d]:not(.future)").forEach(b=>b.onclick=()=>dayPicker(b.dataset.d));
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
      return {svg:`<polyline fill="none" stroke="${kind==="morning"?"var(--morning)":"var(--night)"}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke" points="${xy.join(" ")}"/>`+xy.map(p=>`<circle cx="${p.split(",")[0]}" cy="${p.split(",")[1]}" r="1.4" fill="${kind==="morning"?"var(--morning)":"var(--night)"}"/>`).join(""), vals:pts.map(p=>p[1])};
    };
    const m=line("morning"), n=line("night"); const all=m.vals.concat(n.vals);
    const avg=all.length?(all.reduce((a,b)=>a+b,0)/all.length).toFixed(1):"–";
    return `<div class="trend"><span>${D.icon} ${D.label}</span><svg viewBox="0 0 100 32" preserveAspectRatio="none">${m.svg}${n.svg}</svg><b style="text-align:right">${avg}</b></div>`;
  }).join("") + `<div class="legend"><span><i style="background:var(--morning)"></i>Morning</span><span><i style="background:var(--night)"></i>Night</span></div>`;
}
function dayPicker(d){
  const m=getEntry(d,"morning"), n=getEntry(d,"night");
  modal(`<h2>${fmtDate(d)}</h2><div class="list">
    <div style="cursor:pointer" data-k="morning"><span class="em">🌅</span><span><b>Morning Intention</b><br><span class="small muted">${m?"Logged — tap to view":"Not logged — tap to add"}</span></span></div>
    <div style="cursor:pointer" data-k="night"><span class="em">🌙</span><span><b>Nightly Reflection</b><br><span class="small muted">${n?"Logged — tap to view":"Not logged — tap to add"}</span></span></div>
  </div><button class="btn ghost" data-close>Close</button>`, el=>{
    el.querySelectorAll("[data-k]").forEach(x=>{
      const k=x.dataset.k, locked = d===today() && !getEntry(d,k) && ((k==="morning") !== (new Date().getHours()<CUTOFF_HOUR));
      if(locked){ x.style.opacity=.45; x.style.cursor="not-allowed"; x.querySelector(".small").textContent = k==="morning"?`Closed after ${hourLabel(CUTOFF_HOUR)}`:`Opens at ${hourLabel(CUTOFF_HOUR)}`; return; }
      x.onclick=()=>{closeModal(); openForm(k,d);};
    });
  });
}

/* ---------- Badges ---------- */
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
    ${n?`<div class="grid badges" style="margin-top:14px">${got.map(b=>`<div class="card badge"><div class="em">${b.em}</div><h4>${b.name}</h4><p>${b.desc}</p><p class="when">Earned ${fmtDate(earned[b.id])}</p></div>`).join("")}</div>
      <p class="small muted" style="text-align:center;margin-top:18px">More badges appear as you keep checking in. There's no list to finish.</p>`
    :`<div class="card muted" style="margin-top:14px;text-align:center">Your first badge is one check-in or affirmation away.</div>`}`;
}

/* ---------- Data (export / import) ---------- */
/* ---------- Backup export ---------- */
const BACKUP_KEY="ir_last_backup";
const hasData=()=>S.entries.length>0 || Object.keys(S.affLog).length>0;
function backupJSON(){
  const all=[...S.entries].sort((a,b)=>a.key.localeCompare(b.key));
  if(Object.keys(S.affLog).length) all.push({key:AFF_META_KEY,kind:"meta",days:S.affLog,v:1});
  return JSON.stringify(all,null,2);
}
function lastBackup(){ try{ return localStorage.getItem(BACKUP_KEY); }catch(e){ return null; } }
function lastBackupText(){
  const d=lastBackup(); if(!d) return "No backup downloaded yet on this device.";
  const days=Math.round((parse(today())-parse(d.slice(0,10)))/864e5);
  return `Last backup: ${days===0?"today":days===1?"yesterday":days+" days ago"}.`;
}
async function downloadBackup(){
  if(!hasData()) return toast("Nothing to back up yet.");
  const filename=`bookends-backup-${today()}.json`, json=backupJSON();
  const done=()=>{ try{ localStorage.setItem(BACKUP_KEY,new Date().toISOString()); }catch(e){} toast(`Saved ${filename}`); if(!S.form) render(); };
  // Inside Claude, files go through its download prompt; on your own site, a normal browser download.
  const dl = window.claude?.use ? await claude.use("downloads").catch(()=>null) : null;
  if(dl){
    try{ await dl.save({filename,data:json}); return done(); }
    catch(e){ if(e?.code==="declined") return toast("Download cancelled"); if(e?.code==="rate_limited") return toast("A download prompt is already open"); }
  }
  try{
    const url=URL.createObjectURL(new Blob([json],{type:"application/json"}));
    const a=Object.assign(document.createElement("a"),{href:url,download:filename}); document.body.appendChild(a); a.click(); a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),2000); done();
  }catch(e){ toast("Download isn't available here — use Copy JSON instead."); }
}
function renderSettings(){
  $app.innerHTML = `
    <div class="card">
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
    toast(S.entries.length?`Deleted ${n}; some couldn't be removed — try again.`:"All entries deleted"); render();
  });
  document.getElementById("export").onclick=downloadBackup;
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
    toast(`Imported ${n} check-ins${meta?" + affirmation history":""}`); render();
  };
}

/* ---------- UI helpers ---------- */
let modalEl=null;
function modal(html,bind){ closeModal(); modalEl=document.createElement("div"); modalEl.className="modal-bg"; modalEl.innerHTML=`<div class="card modal">${html}</div>`;
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
  const affReady = loadAffirmations();
  S.store = await pickStore();
  await affReady;
  try{ const all = await S.store.list(); const meta=all.find(e=>e.key===AFF_META_KEY);
    S.affLog = (meta&&meta.days&&typeof meta.days==="object")?{...meta.days}:{}; S.entries = all.filter(e=>FORMS[e.kind]); }
  catch(e){ S.entries=[]; toast("Couldn't load your entries — check your connection."); }
  render();
})();
