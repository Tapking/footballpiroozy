const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const STORE_KEY = 'piroozyFootball_v1';
const rarityOrder = ['استاندارد','متوسط','حماسی','لجند','اسطوره'];
const iranianNames = [
 ['علیرضا بیرانوند','دروازه‌بان','GK','پرسپولیس',78],['حسین حسینی','دروازه‌بان','GK','استقلال',74],['پیام نیازمند','دروازه‌بان','GK','سپاهان',73],
 ['شجاع خلیل‌زاده','مدافع','CB','تراکتور',75],['مرتضی پورعلی‌گنجی','مدافع','CB','پرسپولیس',75],['رامین رضاییان','مدافع','RB','استقلال',76],['میلاد محمدی','مدافع','LB','پرسپولیس',73],['صادق محرمی','مدافع','RB','دینامو زاگرب',72],
 ['سعید عزت‌اللهی','هافبک','CM','شباب الاهلی',76],['احمد نوراللهی','هافبک','CM','الوحده',77],['مهدی ترابی','هافبک','AM','تراکتور',78],['امید ابراهیمی','هافبک','DM','الشمال',73],['سامان قدوس','هافبک','AM','برنتفورد',77],
 ['مهدی طارمی','مهاجم','ST','اینتر',82],['سردار آزمون','مهاجم','ST','شباب الاهلی',80],['علیرضا جهانبخش','مهاجم','RW','هیرنفین',76],['کریم انصاری‌فرد','مهاجم','ST','آریس',73],['وحید امیری','مهاجم','LW','پرسپولیس',72],
 ['علی کریمی','هافبک','CM','کایسری‌اسپور',74],['محمد محبی','مهاجم','RW','روستوف',75],['شهریار مغانلو','مهاجم','ST','سپاهان',76],['مهدی قایدی','مهاجم','LW','اتحاد کلباء',79],['امیرحسین حسین‌زاده','مهاجم','ST','تراکتور',73]
];
const worldNames = [
 ['Kylian Mbappé','مهاجم','ST','Real Madrid',91],['Erling Haaland','مهاجم','ST','Manchester City',91],['Jude Bellingham','هافبک','CM','Real Madrid',90],['Vinícius Júnior','مهاجم','LW','Real Madrid',90],
 ['Mohamed Salah','مهاجم','RW','Liverpool',89],['Kevin De Bruyne','هافبک','CM','Manchester City',90],['Harry Kane','مهاجم','ST','Bayern Munich',90],['Lautaro Martínez','مهاجم','ST','Inter',88],
 ['Rodri','هافبک','DM','Manchester City',91],['Lamine Yamal','مهاجم','RW','Barcelona',85],['Bukayo Saka','مهاجم','RW','Arsenal',87],['Virgil van Dijk','مدافع','CB','Liverpool',89],
 ['Alisson Becker','دروازه‌بان','GK','Liverpool',89],['Thibaut Courtois','دروازه‌بان','GK','Real Madrid',89],['Pedri','هافبک','CM','Barcelona',86],['Federico Valverde','هافبک','CM','Real Madrid',88],
 ['Rafael Leão','مهاجم','LW','Milan',86],['Son Heung-min','مهاجم','LW','Tottenham',87],['Antoine Griezmann','مهاجم','CF','Atlético Madrid',88],['Robert Lewandowski','مهاجم','ST','Barcelona',89],
 ['William Saliba','مدافع','CB','Arsenal',86],['Rúben Dias','مدافع','CB','Manchester City',88],['Achraf Hakimi','مدافع','RB','PSG',86],['Ederson','دروازه‌بان','GK','Manchester City',88]
];
const clubs = {
 'لیگ ایران':['پرسپولیس','استقلال','سپاهان','تراکتور','فولاد','گل‌گهر','ذوب‌آهن','ملوان','آلومینیوم اراک','شمس‌آذر','مس رفسنجان','خیبر خرم‌آباد','چادرملو','نساجی','پیکان','استقلال خوزستان'],
 'لیگ انگلیس':['Manchester City','Arsenal','Liverpool','Chelsea','Manchester United','Tottenham','Newcastle United','Aston Villa','West Ham','Brighton','Everton','Wolves','Fulham','Brentford','Crystal Palace','Nottingham Forest'],
 'لالیگا':['Real Madrid','Barcelona','Atlético Madrid','Girona','Athletic Club','Real Sociedad','Villarreal','Valencia','Sevilla','Real Betis','Getafe','Osasuna','Mallorca','Celta Vigo','Rayo Vallecano','Las Palmas'],
 'سری آ ایتالیا':['Inter','Milan','Juventus','Napoli','Roma','Lazio','Atalanta','Bologna','Fiorentina','Torino','Udinese','Genoa','Monza','Lecce','Cagliari','Parma'],
 'بوندس‌لیگا':['Bayern Munich','Borussia Dortmund','Bayer Leverkusen','RB Leipzig','Stuttgart','Eintracht Frankfurt','Freiburg','Hoffenheim','Wolfsburg','Werder Bremen','Mainz','Augsburg','Union Berlin','Bochum','Heidenheim','Mönchengladbach'],
 'لیگ فرانسه':['PSG','Marseille','Monaco','Lyon','Lille','Nice','Lens','Rennes','Strasbourg','Nantes','Toulouse','Montpellier','Reims','Brest','Auxerre','Saint-Étienne'],
 'لیگ قهرمانان':['Real Madrid','Manchester City','Bayern Munich','Barcelona','Liverpool','Inter','PSG','Arsenal','Borussia Dortmund','Juventus','Atlético Madrid','Benfica','Porto','Ajax','Celtic','Galatasaray']
};
const emojiByPos = {GK:'🧤',CB:'🛡️',RB:'🏃',LB:'🏃',DM:'🧠',CM:'🎯',AM:'✨',RW:'⚡',LW:'⚡',ST:'⚽',CF:'🔥'};
let state, selectedPlayer = null, marketRarity = 'همه';
function defaultState(){
 const pool = [];
 let id=1;
 iranianNames.forEach(([name,role,pos,club,rating],i)=>pool.push({id:id++,name,role,pos,club,rating,rarity:i===13||i===14?'حماسی':i%5===0?'متوسط':'استاندارد',iranian:true,owned:false}));
 worldNames.forEach(([name,role,pos,club,rating],i)=>pool.push({id:id++,name,role,pos,club,rating,rarity:i<7?'حماسی':i%4===0?'لجند':i%3===0?'متوسط':'استاندارد',iranian:false,owned:false}));
 const legends = [['Zinedine Zidane','هافبک','AM','فرانسه',97],['Pelé','مهاجم','ST','برزیل',99],['Diego Maradona','هافبک','AM','آرژانتین',98],['Johan Cruyff','مهاجم','CF','هلند',97],['Ronaldo Nazário','مهاجم','ST','برزیل',97],['Paolo Maldini','مدافع','CB','ایتالیا',96],['Ronaldinho','مهاجم','LW','برزیل',96],['Franco Baresi','مدافع','CB','ایتالیا',95]];
 legends.forEach(([name,role,pos,club,rating],i)=>pool.push({id:id++,name,role,pos,club,rating,rarity:'اسطوره',iranian:false,owned:false}));
 // Generate a 15,000-entry sample catalogue. Generated entries are placeholders, not official player records.
 const first=['Alex','Mateo','Lucas','Noah','Leo','Daniel','Marco','Omar','Yuki','Adam','Nico','Rayan','Arman','Reza','Ali','Sina','Amir','Ehsan'];
 const last=['Silva','Costa','Garcia','Rossi','Novak','Hassan','Karimi','Moradi','Jensen','Kovac','Martin','Santos','Rahimi','Azizi','Brown','Lee'];
 const positions=[['مهاجم','ST'],['هافبک','CM'],['مدافع','CB'],['دروازه‌بان','GK'],['مهاجم','LW'],['هافبک','AM']];
 const allClubs=Object.values(clubs).flat();
 for(let n=pool.length;n<15000;n++){
   const p=positions[n%positions.length], rating=55+(n*17%37);
   pool.push({id:id++,name:first[n%first.length]+' '+last[Math.floor(n/3)%last.length]+' '+(Math.floor(n/31)%80+1),role:p[0],pos:p[1],club:allClubs[n%allClubs.length],rating,rarity:rating>=88?'حماسی':rating>=80?'لجند':rating>=70?'متوسط':'استاندارد',iranian:false,owned:false,generated:true});
 }
 const starterIds = pool.filter(p=>p.iranian).slice(0,18).map(p=>p.id);
 starterIds.forEach(id=>{const p=pool.find(x=>x.id===id);p.owned=true;});
 const starters=starterIds.slice(0,11), bench=starterIds.slice(11,18);
 return {pool,starters,bench,coins:1200,cash:25000000,clubName:'باشگاه پیروزی من',logo:'',stadium:1,league:'لیگ ایران',week:1,played:0,wins:0,losses:0,draws:0,season:1,openingClaimed:false,dailyDate:'',weeklyClaims:[],missionProgress:{matches:0,signings:0,upgrades:0},lastResult:null,table:{}};
}
function load(){try{const raw=localStorage.getItem(STORE_KEY);if(raw){const s=JSON.parse(raw);if(s.pool&&s.starters&&s.bench)return s;}}catch(e){}return defaultState();}
state=load();
function save(){try{localStorage.setItem(STORE_KEY,JSON.stringify(state));}catch(e){toast('ذخیره‌سازی پر شده؛ تصویر لوگو را کوچک‌تر انتخاب کن.');}}
function fmt(n){return Math.floor(n).toLocaleString('en-US');}
function toast(msg){const el=$('#toast');el.textContent=msg;el.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove('show'),2600);}
function getPlayer(id){return state.pool.find(p=>p.id===id);}
function ownedPlayers(){return [...state.starters,...state.bench].map(getPlayer).filter(Boolean);}
function power(){const arr=state.starters.map(getPlayer).filter(Boolean);return arr.length?Math.round(arr.reduce((a,p)=>a+p.rating,0)/arr.length):0;}
function playerPrice(p){let base=p.rating*p.rating*1400;if(p.rarity==='لجند')base*=3.2;if(p.rarity==='حماسی')base*=1.8;if(p.rarity==='متوسط')base*=1.2;return Math.max(100000,Math.round(base/100000)*100000);}
function playerSellPrice(p){let multiplier=p.rarity==='اسطوره'?2.5:p.rarity==='لجند'?3.2:p.rarity==='حماسی'?1.8:p.rarity==='متوسط'?1.2:1;return Math.max(50000,Math.floor((p.rating*p.rating*1400*multiplier*0.6)/50000)*50000);}
function card(p,zone='market'){
 const el=document.createElement('div');el.className=`player-card rarity-${p.rarity}${selectedPlayer===p.id?' selected':''}`;
 el.innerHTML=`<span class="rating">${p.rating}</span><span class="position">${p.pos}</span><div class="player-photo">${emojiByPos[p.pos]||'⚽'}</div><strong title="${escapeHtml(p.name)}">${escapeHtml(p.name)}</strong><div class="club">${escapeHtml(p.club)}</div><span class="rarity">${p.rarity}</span>`;
 if(zone==='bench'||zone==='starter'){el.classList.add('bench-card');el.addEventListener('click',()=>selectForSwap(p.id));}
 if(zone==='market'){const price=playerPrice(p);const b=document.createElement('button');b.className='primary full';b.textContent='خرید '+fmt(price);b.addEventListener('click',()=>buyPlayer(p.id));el.appendChild(b);}
 if(zone==='sell'){const isStarter=state.starters.includes(p.id);const price=playerSellPrice(p);const b=document.createElement('button');b.className=(isStarter?'secondary':'danger')+' full';b.textContent=isStarter?'تعویض با ذخیره برای فروش':('فروش · '+fmt(price));b.disabled=isStarter;b.title=isStarter?'برای جلوگیری از ناقص شدن ترکیب، ابتدا با ذخیره تعویض کن.':'';if(!isStarter)b.addEventListener('click',()=>sellPlayer(p.id));el.appendChild(b);const meta=document.createElement('small');meta.className='sell-status';meta.textContent=isStarter?'ترکیب اصلی':'قیمت فروش';el.appendChild(meta);}
 if(zone==='result'){el.style.cursor='default';}
 return el;
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function renderHome(){
 $('#clubTitle').textContent=state.clubName;$('#coins').textContent=fmt(state.coins);$('#cash').textContent=fmt(state.cash);
 $('#teamPower').textContent=power();$('#playerCount').textContent=ownedPlayers().length;$('#stadiumLevel').textContent=state.stadium;$('#leagueName').textContent=state.league;
 if(state.logo){$('#clubLogo').src=state.logo;$('#clubLogo').classList.remove('hidden');$('#logoPlaceholder').classList.add('hidden');}else{$('#clubLogo').classList.add('hidden');$('#logoPlaceholder').classList.remove('hidden');}
}
function renderTeam(){
 const formation=$('#formation');formation.innerHTML='';
 // Football pitch in a classic 4-3-3: forwards, midfielders, defenders, goalkeeper.
 const order=[9,10,11,6,7,8,2,3,4,5,0];
 state.starters.forEach((id,i)=>{const p=getPlayer(id);if(!p)return;const c=card(p,'starter');c.classList.add('pitch-player');c.style.gridColumn=String((i%4)+1);c.style.gridRow=String(i<3?1:i<6?2:i<10?3:4);if(i===0)c.style.gridColumn='2';if(i===1)c.style.gridColumn='3';if(i===2)c.style.gridColumn='4';if(i===3)c.style.gridColumn='1';if(i===4)c.style.gridColumn='2';if(i===5)c.style.gridColumn='4';if(i===6)c.style.gridColumn='1';if(i===7)c.style.gridColumn='2';if(i===8)c.style.gridColumn='3';if(i===9)c.style.gridColumn='4';if(i===10){c.style.gridColumn='2 / span 2';c.style.gridRow='4';}formation.appendChild(c);});
 const bench=$('#bench');bench.innerHTML='';state.bench.forEach(id=>{const p=getPlayer(id);if(p)bench.appendChild(card(p,'bench'));});
}
function selectForSwap(id){
 if(selectedPlayer===null){selectedPlayer=id;toast('حالا بازیکن دوم را انتخاب کن.');renderTeam();return;}
 if(selectedPlayer===id){selectedPlayer=null;renderTeam();return;}
 const aStarter=state.starters.includes(selectedPlayer),bStarter=state.starters.includes(id);
 const arrA=aStarter?state.starters:state.bench,arrB=bStarter?state.starters:state.bench;
 const ia=arrA.indexOf(selectedPlayer),ib=arrB.indexOf(id);
 if(ia<0||ib<0){selectedPlayer=null;return;}
 arrA[ia]=id;arrB[ib]=selectedPlayer;selectedPlayer=null;save();renderAll();toast('تعویض بازیکنان انجام شد.');
}
function renderMarket(){
 const search=($('#marketSearch').value||'').trim().toLowerCase();
 const owned=new Set(ownedPlayers().map(p=>p.id));
 const candidates=state.pool.filter(p=>!p.owned&&!owned.has(p.id)&&p.rarity!=='اسطوره'&&(marketRarity==='همه'||p.rarity===marketRarity)&&(!search||(p.name+' '+p.club).toLowerCase().includes(search)));
 const area=$('#marketPlayers');area.innerHTML='';
 candidates.sort((a,b)=>b.rating-a.rating).slice(0,72).forEach(p=>area.appendChild(card(p,'market')));
 if(!area.children.length)area.innerHTML='<p class="muted">بازیکنی با این جست‌وجو پیدا نشد.</p>';
}
function buyPlayer(id){
 const p=getPlayer(id);if(!p||p.owned||p.rarity==='اسطوره')return;
 const price=playerPrice(p);if(state.cash<price){toast('پول کافی نداری. مسابقه بده و جایزه بگیر.');return;}
 if(ownedPlayers().length>=100){toast('ظرفیت باشگاه در این نسخه ۱۰۰ بازیکن است.');return;}
 state.cash-=price;p.owned=true;
 if(state.starters.length<11)state.starters.push(id);else state.bench.push(id);
 state.missionProgress.signings++;save();renderAll();toast(p.name+' به باشگاه اضافه شد.');
}
function renderSell(){
 const area=$('#sellPlayers');if(!area)return;area.innerHTML='';
 const players=ownedPlayers().slice().sort((a,b)=>Number(state.starters.includes(a.id))-Number(state.starters.includes(b.id)) || b.rating-a.rating);
 players.forEach(p=>area.appendChild(card(p,'sell')));
 if(!players.length)area.innerHTML='<p class="muted">بازیکنی برای فروش نداری.</p>';
}
function sellPlayer(id){
 const p=getPlayer(id);if(!p||(!state.starters.includes(id)&&!state.bench.includes(id)))return;
 if(state.starters.includes(id)){toast('برای حفظ ترکیب، ابتدا این بازیکن را با یک ذخیره تعویض کن.');return;}
 const price=playerSellPrice(p);
 if(!confirm('بازیکن «'+p.name+'» با قیمت '+fmt(price)+' پول فروخته شود؟ این کار قابل بازگشت نیست.'))return;
 state.bench=state.bench.filter(pid=>pid!==id);p.owned=false;state.cash+=price;save();renderAll();renderSell();toast(p.name+' فروخته شد؛ '+fmt(price)+' پول دریافت کردی.');
}
function weightedRarity(opening=false){
 if(opening)return Math.random()<.12?'حماسی':Math.random()<.35?'متوسط':'استاندارد';
 const r=Math.random();if(r<.008)return 'اسطوره';if(r<.045)return 'لجند';if(r<.15)return 'حماسی';if(r<.48)return 'متوسط';return 'استاندارد';
}
function openPack(count,opening=false){
 if(opening&&state.openingClaimed){toast('پک افتتاحیه قبلاً دریافت شده است.');return;}
 if(!opening&&state.coins<900){toast('کوین کافی نداری.');return;}
 if(!opening)state.coins-=900;else state.openingClaimed=true;
 const results=[];
 for(let i=0;i<count;i++){
   let candidates=state.pool.filter(p=>!p.owned && !ownedPlayers().some(o=>o.id===p.id) && (opening?p.iranian:p.rarity===weightedRarity(false)));
   if(opening)candidates=state.pool.filter(p=>p.iranian&&!p.owned&&!ownedPlayers().some(o=>o.id===p.id)&&p.rarity!=='اسطوره');
   // Fallback prevents empty packs when the desired rarity has no available sample.
   if(!candidates.length)candidates=state.pool.filter(p=>!p.owned&&!ownedPlayers().some(o=>o.id===p.id)&&p.rarity!=='اسطوره');
   if(!candidates.length)break;
   const p=candidates[Math.floor(Math.random()*candidates.length)];p.owned=true;results.push(p);
   if(state.starters.length<11)state.starters.push(p.id);else state.bench.push(p.id);
 }
 save();renderAll();
 const area=$('#packResults');area.innerHTML='';results.slice(0,100).forEach(p=>area.appendChild(card(p,'result')));
 toast(results.length+' بازیکن به باشگاه اضافه شد.');
}
function renderLeague(){
 const teams=clubs[state.league]||clubs['لیگ ایران'];const opp=teams[(state.week-1)%teams.length];$('#nextOpponent').textContent=opp;$('#matchMeta').textContent=`فصل ${state.season} · هفته ${Math.min(state.week,teams.length)} · ورزشگاه خانگی`;
 const table=teams.map((name,i)=>{const t=state.table[state.league+'|'+name]||{pts:0,p:0,w:0,d:0,l:0};return {name,...t,me:name===state.clubName};});
 // User's club is added as a separate entry if not already a real team.
 if(!teams.includes(state.clubName)){const t=state.table[state.league+'|__ME__']||{pts:state.wins*3+state.draws,p:state.played,w:state.wins,d:state.draws,l:state.losses};table.push({name:state.clubName,...t,me:true});}
 table.sort((a,b)=>b.pts-a.pts||b.w-a.w);
 $('#leagueTable').innerHTML='<div class="league-row head"><span>#</span><span>تیم</span><span>بازی</span><span>تفاضل</span><span>امتیاز</span></div>'+table.map((t,i)=>`<div class="league-row ${t.me?'me':''}"><span>${i+1}</span><b>${escapeHtml(t.name)}</b><span>${t.p||0}</span><span>${(t.w||0)-(t.l||0)}</span><span>${t.pts||0}</span></div>`).join('');
}
function playMatch(){
 if(state.week>16){toast('فصل تمام شده؛ دکمه شروع فصل جدید را بزن.');return;}
 const arr=state.starters.map(getPlayer).filter(Boolean);const strength=arr.reduce((s,p)=>s+p.rating,0)/Math.max(1,arr.length)+state.stadium*1.1;
 const oppNames=clubs[state.league]||clubs['لیگ ایران'];const opp=oppNames[(state.week-1)%oppNames.length];
 const oppPower=70+((state.week*13)%14);let myGoals=0,oppGoals=0;
 for(let i=0;i<5;i++){if(Math.random()*100<strength*.48)myGoals++;if(Math.random()*100<oppPower*.44)oppGoals++;}
 state.played++;state.missionProgress.matches++;state.week++;
 let resultText='';
 state.coins+=1; // Every completed match grants exactly 1 coin.
 let cashReward=10000, coinReward=1;
 if(myGoals>oppGoals){state.wins++;state.cash+=100000;state.coins+=100;coinReward+=100;cashReward=100000;resultText='برد';}
 else if(myGoals<oppGoals){state.losses++;state.cash+=10000;cashReward=10000;resultText='باخت';}
 else{state.draws++;state.cash+=25000;cashReward=25000;resultText='مساوی';}
 const myKey=state.league+'|__ME__';const my=state.table[myKey]||{pts:0,p:0,w:0,d:0,l:0};my.p++;my.w+=myGoals>oppGoals?1:0;my.l+=myGoals<oppGoals?1:0;my.d+=myGoals===oppGoals?1:0;my.pts+=myGoals>oppGoals?3:myGoals===oppGoals?1:0;state.table[myKey]=my;
 const opKey=state.league+'|'+opp;const op=state.table[opKey]||{pts:0,p:0,w:0,d:0,l:0};op.p++;op.w+=oppGoals>myGoals?1:0;op.l+=oppGoals<myGoals?1:0;op.d+=oppGoals===myGoals?1:0;op.pts+=oppGoals>myGoals?3:oppGoals===myGoals?1:0;state.table[opKey]=op;
 state.lastResult={myGoals,oppGoals,opp,resultText};save();renderAll();
 const area=$('#matchArea');area.classList.remove('hidden');area.innerHTML=`<div class="match-score">${myGoals} - ${oppGoals}</div><h3 style="text-align:center">${escapeHtml(state.clubName)} × ${escapeHtml(opp)}</h3><p style="text-align:center;color:var(--lime)">${resultText} · ${fmt(cashReward)} پول بازی + ${fmt(coinReward)} کوین</p><div class="match-log">گزارش مسابقه: بازی به‌صورت شبیه‌سازی خودکار اجرا شد. قدرت تیم شما ${Math.round(strength)} و قدرت حریف ${oppPower} بود.</div><button class="secondary full" id="closeMatch">پایان بازی</button>`;
 $('#closeMatch').addEventListener('click',()=>{$('#matchArea').classList.add('hidden');toast('مسابقه ثبت و ذخیره شد.');});
 if(state.week>16)toast('فصل تمام شد! می‌توانی فصل جدید را شروع کنی.');
}
function startNewSeason(){state.season++;state.week=1;state.played=0;state.wins=0;state.losses=0;state.draws=0;state.table={};save();renderAll();$('#matchArea').classList.add('hidden');toast('فصل جدید شروع شد!');}
function renderAnalysis(){
 const p=power();$('#analysisPower').textContent=p;$('#analysisVerdict').textContent=p>=85?'مدعی قهرمانی':p>=75?'تیم رقابتی':'نیاز به تقویت ترکیب';$('#analysisText').textContent=p>=85?'ترکیب قدرتمندی داری؛ با تعویض درست و ارتقای ورزشگاه ادامه بده.':p>=75?'چند خرید هدفمند و تمرین می‌تواند تیمت را بهتر کند.':'بازیکن جذب کن، تمرین بده و ترکیب اصلی را بهینه کن.';
 const positions=['دروازه‌بان','مدافع','هافبک','مهاجم'];$('#analysisBars').innerHTML=positions.map(role=>{const ps=state.starters.map(getPlayer).filter(p=>p&&p.role===role);const val=ps.length?Math.round(ps.reduce((a,p)=>a+p.rating,0)/ps.length):0;return `<div class="bar-row"><div class="bar-label"><span>${role}</span><b>${val}</b></div><div class="bar"><i style="width:${val}%"></i></div></div>`;}).join('');
 $('#stadiumCost').textContent='هزینه: '+fmt(state.stadium*5000000)+' پول';$('#upgradePlayerCost').textContent='هزینه: 1,000,000 پول';
 const select=$('#upgradePlayer');select.innerHTML=ownedPlayers().map(p=>`<option value="${p.id}">${escapeHtml(p.name)} · ${p.rating}</option>`).join('');
}
const missions=[
 {id:'matches',title:'مسابقه‌باز',desc:'۳ مسابقه انجام بده',goal:3,reward:250,unit:'مسابقه'},
 {id:'signings',title:'مدیر نقل‌وانتقالات',desc:'۲ بازیکن جذب کن',goal:2,reward:200,unit:'بازیکن'},
 {id:'upgrades',title:'باشگاه رو به رشد',desc:'۱ ارتقا انجام بده',goal:1,reward:150,unit:'ارتقا'}
];
function renderMissions(){
 const day=new Date().toISOString().slice(0,10);
 $('#dailyReward').disabled=state.dailyDate===day;$('#dailyReward').textContent=state.dailyDate===day?'جایزه امروز دریافت شد':'دریافت ۱۰۰ کوین';
 $('#missionsList').innerHTML=missions.map(m=>{const prog=Math.min(state.missionProgress[m.id]||0,m.goal),claimed=state.weeklyClaims.includes(m.id);return `<div class="mission"><div class="mission-top"><b>${m.title}</b><b>🪙 ${m.reward}</b></div><p>${m.desc} · ${prog}/${m.goal}</p><div class="mission-progress"><i style="width:${prog/m.goal*100}%"></i></div><button data-mission="${m.id}" ${claimed||prog<m.goal?'disabled':''}>${claimed?'دریافت شد':prog<m.goal?'در حال انجام':'دریافت جایزه'}</button></div>`;}).join('');
 $$('[data-mission]').forEach(b=>b.addEventListener('click',()=>{const m=missions.find(x=>x.id===b.dataset.mission);if(!m||state.weeklyClaims.includes(m.id)||(state.missionProgress[m.id]||0)<m.goal)return;state.weeklyClaims.push(m.id);state.coins+=m.reward;save();renderAll();toast('جایزه مأموریت دریافت شد.');}));
}
function renderAll(){renderHome();renderTeam();renderMarket();renderSell();renderLeague();renderAnalysis();renderMissions();}
function showPage(name){$$('.page').forEach(p=>p.classList.toggle('active',p.id===name));$$('[data-page]').forEach(b=>b.classList.toggle('active',b.dataset.page===name));if(name==='market')renderMarket();if(name==='team')renderTeam();if(name==='sell')renderSell();window.scrollTo({top:0,behavior:'smooth'});}
$$('[data-page]').forEach(b=>b.addEventListener('click',()=>showPage(b.dataset.page)));
$('#openingPack').addEventListener('click',()=>openPack(3,true));$('#pack10').addEventListener('click',()=>openPack(10,false));$('#pack100').addEventListener('click',()=>openPack(100,false));
$('#marketSearch').addEventListener('input',renderMarket);
$$('[data-rarity]').forEach(b=>b.addEventListener('click',()=>{marketRarity=b.dataset.rarity;$$('[data-rarity]').forEach(x=>x.classList.toggle('active',x===b));renderMarket();}));
$('#leagueSelect').addEventListener('change',e=>{state.league=e.target.value;state.week=1;save();renderAll();});
$('#playMatch').addEventListener('click',playMatch);$('#newSeason').addEventListener('click',startNewSeason);
$('#upgradeStadium').addEventListener('click',()=>{const cost=state.stadium*5000000;if(state.cash<cost){toast('پول کافی نیست.');return;}state.cash-=cost;state.stadium++;state.missionProgress.upgrades++;save();renderAll();toast('ورزشگاه ارتقا یافت!');});
$('#upgradePlayerBtn').addEventListener('click',()=>{const id=Number($('#upgradePlayer').value),p=getPlayer(id);if(!p)return;if(state.cash<1000000){toast('پول کافی نیست.');return;}if(p.rating>=99){toast('قدرت این بازیکن به حداکثر رسیده.');return;}state.cash-=1000000;p.rating++;state.missionProgress.upgrades++;save();renderAll();toast(p.name+' یک امتیاز قوی‌تر شد.');});
$('#dailyReward').addEventListener('click',()=>{const day=new Date().toISOString().slice(0,10);if(state.dailyDate===day){toast('جایزه امروز را قبلاً گرفته‌ای.');return;}state.dailyDate=day;state.coins+=100;save();renderAll();toast('۱۰۰ کوین دریافت شد!');});
$('#editClub').addEventListener('click',()=>{showPage('settings');$('#clubNameInput').focus();});
$('#saveClub').addEventListener('click',()=>{const name=$('#clubNameInput').value.trim();if(name)state.clubName=name;save();renderAll();toast('اطلاعات باشگاه ذخیره شد.');});
$('#clubNameInput').value=state.clubName;
$('#logoInput').addEventListener('change',e=>{const f=e.target.files&&e.target.files[0];if(!f)return;if(f.size>1500000){toast('لطفاً تصویر زیر ۱٫۵ مگابایت انتخاب کن.');e.target.value='';return;}const reader=new FileReader();reader.onload=()=>{state.logo=reader.result;save();renderHome();toast('لوگو انتخاب شد؛ ذخیره را بزن.');};reader.readAsDataURL(f);});
$('#remitButton').addEventListener('click',()=>window.open('https://reymit.ir/xgame17','_blank','noopener'));
$('#resetGame').addEventListener('click',()=>{if(confirm('همه اطلاعات ذخیره‌شده پاک شود؟')){localStorage.removeItem(STORE_KEY);state=defaultState();save();renderAll();showPage('home');toast('بازی از ابتدا شروع شد.');}});
$('#leagueSelect').value=state.league;
renderAll();
