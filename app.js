try{navigator.storage&&navigator.storage.persist&&navigator.storage.persist()}catch(e){}
const K='wt1';let S={ex:{},al:{},tpl:[],ses:[]};
try{S=Object.assign(S,JSON.parse(localStorage.getItem(K)||'{}'))}catch(e){}
const save=()=>{try{localStorage.setItem(K,JSON.stringify(S))}catch(e){}pushCloud()};
const $=id=>document.getElementById(id);
const norm=s=>s.toLowerCase().replace(/[^a-z0-9äöüß ]/g,' ').replace(/\s+/g,' ').trim();
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const fmt=v=>v===''||v==null?'':String(v).replace('.',',');
const num=s=>parseFloat(String(s).replace(',','.'));
function parse(txt){
 const L=txt.replace(/[\u00a0\u200b\ufeff]/g,' ').replace(/[\u2010-\u2012]/g,'-').split(/\r\n|[\n\r\u2028\u2029\u0085]/).map(s=>s.trim()).filter(Boolean);
 const w={name:'Workout',notes:[],blocks:[],bad:[]};let b=null,inter=null,circ=null,m;
 const note=(o,s)=>(o.notes=o.notes||[]).push(s);
 for(const l of L){
  if(m=l.match(/^workout\s*:\s*(.+)/i)){w.name=m[1];continue}
  if(m=l.match(/^(?:super|straight)[\s-]*sets?\s*#?(\d+)?\s*[:,.-]?\s*(?:[x×]\s*(\d+)|\(?(\d+)\s*rounds?\)?)(?:\s*rounds?)?\s*(?:\((.*)\))?\s*$/i)){b={t:'ss',title:(/^straight/i.test(l)?'Straight Set ':'Super Set ')+(m[1]||w.blocks.length+1),rounds:+(m[2]||m[3]),ex:[],notes:[]};w.blocks.push(b);continue}
  if(m=l.match(/^timed\s*ladder\s*#?(\d+)\b.*$/i)){b={t:'tb',title:'Timed Ladder '+m[1],rounds:null,iv:'Zeitleiter',ex:[],notes:[]};w.blocks.push(b);continue}
  if(m=l.match(/^pod\s*#?(\d+)\s*:?\s*$/i)){b={t:'ss',title:'POD '+m[1],rounds:null,ex:[],notes:[]};w.blocks.push(b);continue}
  if(m=l.match(/^(?:tabata|circuit)\s*#?(\d+)\s*:?\s*$/i)){b={t:'tb',title:'Tabata '+m[1],rounds:circ,iv:inter,ex:[],notes:[]};w.blocks.push(b);continue}
  if(m=l.match(/^cool\s*-?down\s*:?\s*(.*)/i)){b={t:'cd',title:'Cooldown',text:m[1],ex:[],notes:[]};w.blocks.push(b);continue}
  if(/^rest\b/i.test(l)){b?b.notes.push(l):w.notes.push(l);continue}
  if(!b){
   if(m=l.match(/(\d+)\s*sec\s*on\D+(\d+)\s*sec/i))inter=m[1]+' s / '+m[2]+' s';
   if(m=l.match(/repeat circuit\s*(\d+)/i))circ=+m[1];
   w.notes.push(l);continue}
  if(b.t==='cd'){b.text+=' '+l;continue}
  if(b.t==='tb'&&(m=l.match(/^(\d+)\s*sec\w*\.?\s*[-–—:]?\s*(.+)$/i))){let n=m[2].trim(),x='';const r=n.match(/^(.*?)\s*\(([^)]*(?:sec|each|R\/L)[^)]*)\)\s*$/i);if(r){n=r[1].trim();x=' ('+r[2]+')'}const q=norm(n),f=b.ex.find(e=>norm(e.name)===q);if(f){f.reps+=', '+m[1]+' s'+x}else b.ex.push({name:n,reps:m[1]+' s'+x});continue}
  if(b.t==='tb'&&(m=l.match(/^move\s*\d+\s*[:\-–—]\s*(.+)$/i))){let n=m[1],r=n.match(/^(.*?)\s+rest\b(.*)$/i);if(r){n=r[1];b.notes.push('Rest'+r[2])}b.ex.push({name:n.trim()});continue}
  if(b.t==='ss'){const q=l.replace(/^move\s*\d+\s*[:\-–—]\s*/i,'');m=q.match(/^(.+?)\s*[-–—:]\s*(\d.*)$/)||q.match(/^(.+?)\s+(\d+(?:\s*-\s*\d+)?\s*(?:reps?|wdh\.?)\b.*)$/i);if(m){const k=m[2].match(/^(.*?[\s\d]|)[x×]\s*(\d+)\b/i);b.ex.push({name:m[1].trim(),reps:m[2].trim(),n:k?+k[2]:null})}else if(!/\d/.test(q))b.ex.push({name:q});else w.bad.push(l);continue}
  w.bad.push(l)}
 return w}
const canon=n=>{const k=norm(n);return S.al[k]||k};
function last(k){const Q=[...S.ses].sort((a,b)=>a.d.localeCompare(b.d));for(let i=Q.length-1;i>=0;i--){const a=Q[i].ex[k];if(a){const v=a.filter(x=>x!==null);if(v.length)return v[v.length-1]}}return''}
const hintUp=k=>{const Q=[...S.ses].sort((a,b)=>a.d.localeCompare(b.d)).filter(s=>s.ex[k]),s=Q[Q.length-1];return s&&s.up&&s.up[k]?'<div class="hint">↑ Gewicht steigern (Hinweis vom '+dfmt(s.d)+')</div>':''};
const hasSes=k=>S.ses.some(s=>s.ex[k]);
let W=null;
function exSel(c,bi,ei){const ks=Object.keys(S.ex).sort((a,b)=>S.ex[a].name.localeCompare(S.ex[b].name));if(!ks.length)return'';return '<select data-b="'+bi+'" data-e="'+ei+'" aria-label="Zuordnung zur Übung"><option value="__new__">Neue Übung</option>'+ks.map(k=>'<option value="'+esc(k)+'"'+(k===c?' selected':'')+'>'+esc(S.ex[k].name)+'</option>').join('')+'</select>'}
function showPrev(){
 const el=$('prev');if(!W){el.innerHTML='';return}
 let h='<div class="card"><label class="mute" for="wn">Name des Workouts</label><input class="nm" id="wn" value="'+esc(W.name)+'">'+W.notes.map(n=>'<div class="mute">'+esc(n)+'</div>').join('')+'</div>';
 W.blocks.forEach((b,bi)=>{
  h+='<div class="card"><h2>'+esc(b.title)+'</h2><div class="mute">'+({ss:(b.rounds?b.rounds+' Runden':'Sätze je Übung'),tb:(b.iv||'Intervall unbekannt')+(b.rounds?', Circuit '+b.rounds+'×':''),cd:'ohne Gewicht'}[b.t])+(b.notes.length?' · '+esc(b.notes.join(' · ')):'')+'</div>';
  if(b.t==='cd')h+='<div>'+esc(b.text)+'</div>';
  b.ex.forEach((e,ei)=>{
   const c=canon(e.name);let tag;
   if(S.ex[c])tag='<span class="tag">bekannt'+(hasSes(c)?', zuletzt '+(fmt(last(c))||'Eigengewicht'):'')+'</span>';
   else{const sim=Object.keys(S.ex).find(k=>k.includes(c)||c.includes(k));
    tag=sim?'<span class="tag new">ähnlich zu „'+esc(S.ex[sim].name)+'“ – </span>':'<span class="tag new">neu</span>'}
   h+='<div class="ex">'+esc(e.name)+(e.reps?' <span class="mute">'+esc(e.reps)+'</span>':'')+'<div>'+tag+exSel(c,bi,ei)+'</div></div>'});
  h+='</div>'});
 if(W.bad.length)h+='<div class="card warn"><b>Nicht erkannte Zeilen</b>'+W.bad.map(n=>'<div>'+esc(n)+'</div>').join('')+'<div class="mute">Diese Zeilen werden nicht übernommen. Text anpassen und erneut auslesen.</div></div>';
 h+='<div class="mute">Erkannt: '+W.blocks.length+' Blöcke, '+W.blocks.reduce((a,b)=>a+b.ex.length,0)+' Übungen</div>';if(!W.blocks.length)h+='<div class="card warn"><b>Keine Blöcke erkannt.</b><div class="mute">Erwartet werden Überschriften wie „Super Set 1x3“ oder „Tabata 1“, darunter die Übungen, jeweils eine pro Zeile.</div></div>';h+='<button class="btn" id="sv">Als Vorlage speichern</button>';
 el.innerHTML=h;
 el.querySelectorAll('select').forEach(s=>s.onchange=()=>{W.blocks[s.dataset.b].ex[s.dataset.e].link=s.value});
 $('sv').onclick=()=>{if(!W.blocks.length)return;
  const blocks=W.blocks.map(b=>({...b,ex:b.ex.map(e=>{let k=norm(e.name),L=e.link;if(L==='__new__'){while(S.ex[k])k+=' 2';S.ex[k]={name:e.name}}else if(L){S.al[norm(e.name)]=L;k=L}else if(!S.ex[canon(e.name)]){S.ex[k]={name:e.name}}else k=canon(e.name);return{name:e.name,reps:e.reps,n:e.n,key:k}})}));
  S.tpl.push({id:Date.now(),name:$('wn').value.trim()||W.name,notes:W.notes,blocks});save();
  W=null;$('src').value='';showPrev();tab(1);ses=null;showTrain()}}
$('go').onclick=()=>{W=parse($('src').value);showPrev()};
let ses=null;
function startSes(id){
 const t=S.tpl.find(x=>x.id==id);if(!t){ses=null;return}
 ses={t,up:{},d:new Date().toISOString().slice(0,10),c:t.blocks.map(b=>b.ex.map(e=>{const n=b.t==='ss'?(e.n||b.rounds):b.t==='tb'?1:0;return Array.from({length:n},()=>({v:last(e.key),c:false}))}))}}
function showTrain(msg){
 const el=$('v1');
 if(!S.tpl.length){el.innerHTML='<div class="card">Noch keine Vorlage. Unter „Neues Workout“ einen Text einfügen.'+(msg?'<p>'+msg+'</p>':'')+'</div>';return}
 let h=(msg?'<div class="card" style="border-color:var(--acc)">'+msg+'</div>':'')+'<div class="card"><label class="mute" for="pick">Workout</label><select id="pick"><option value="">Auswählen …</option>'+S.tpl.map(t=>'<option value="'+t.id+'"'+(ses&&ses.t.id==t.id?' selected':'')+'>'+esc(t.name)+'</option>').join('')+'</select></div>';
 if(ses){
  h+='<div class="card"><label class="mute" for="dt">Trainingsdatum</label><input type="date" id="dt" value="'+ses.d+'"></div>';
  if(ses.t.notes.length)h+='<div class="card mute">'+ses.t.notes.map(esc).join('<br>')+'</div>';
  ses.t.blocks.forEach((b,bi)=>{
   h+='<div class="card"><h2>'+esc(b.title)+'</h2><div class="mute">'+({ss:(b.rounds?b.rounds+' Runden':'Sätze je Übung'),tb:(b.iv||'')+(b.rounds?', Circuit '+b.rounds+'×':''),cd:''}[b.t])+(b.notes.length?' · '+esc(b.notes.join(' · ')):'')+'</div>';
   if(b.t==='cd')h+='<div>'+esc(b.text)+'</div>';
   b.ex.forEach((e,ei)=>{
    h+='<div class="ex">'+esc(e.name)+(e.reps?' <span class="mute">'+esc(e.reps)+'</span>':'')+hintUp(e.key)+'<div class="cells">';
    ses.c[bi][ei].forEach((c,ci)=>{h+='<div class="cell'+(c.c?' ok':'')+'" data-p="'+bi+','+ei+','+ci+'"><button data-a="m" aria-label="0,5 kg weniger">−</button><input inputmode="decimal" value="'+fmt(c.v)+'" placeholder="kg" aria-label="Gewicht in kg"><button data-a="p" aria-label="0,5 kg mehr">+</button><button data-a="c" class="chk" aria-label="Bestätigen">✓</button></div>'});
    h+='</div><label class="chkup"><input type="checkbox" data-u="'+esc(e.key)+'"'+(ses.up[e.key]?' checked':'')+'> Gewicht steigern</label><input class="nm xn" data-k="'+esc(e.key)+'" placeholder="Notiz zur Übung" aria-label="Notiz zur Übung '+esc(e.name)+'" value="'+esc((S.ex[e.key]||{}).note||'')+'"></div>'});
   h+='</div>'});
  h+='<div class="card"><label class="mute" for="sn">Notiz zur Einheit</label><textarea id="sn" style="min-height:90px">'+esc(ses.n||'')+'</textarea></div>';h+='<button class="btn" id="fin">Einheit speichern</button><div class="mute">Gespeichert werden nur bestätigte Werte (✓). Ein leeres, bestätigtes Feld zählt als Eigengewicht.</div>';h+=!em?'<button class="btn alt" id="eb">Workout bearbeiten</button>':'<div class="card"><label class="mute" for="rn">Name des Workouts</label><input class="nm" id="rn" value="'+esc(ses.t.name)+'"><div class="row"><button class="btn" id="rb">Umbenennen</button><button class="btn alt" id="ef">Fertig</button><button class="btn alt" id="db">'+(dl?'Wirklich löschen?':'Workout löschen')+'</button></div></div>'}
 el.innerHTML=h;
 $('pick').onchange=e=>{dl=0;em=0;startSes(e.target.value);showTrain()};
 if(!ses)return;
 $('dt').onchange=e=>ses.d=e.target.value;if(!em)$('eb').onclick=()=>{em=1;showTrain()};else{$('ef').onclick=()=>{em=0;dl=0;showTrain()};$('rb').onclick=()=>{const n=$('rn').value.trim();if(n){ses.t.name=n;save();showTrain('Name geändert.')}};$('db').onclick=()=>{if(!dl){dl=1;showTrain();return}S.tpl=S.tpl.filter(t=>t.id!==ses.t.id);save();dl=0;em=0;ses=null;showTrain('Workout gelöscht.')}}
 el.querySelectorAll('[data-u]').forEach(i=>i.onchange=()=>{ses.up[i.dataset.u]=i.checked});el.querySelectorAll('.xn').forEach(i=>i.onchange=()=>{if(S.ex[i.dataset.k]){S.ex[i.dataset.k].note=i.value.trim();save()}});$('sn').oninput=e=>ses.n=e.target.value;const cell=n=>{const p=n.closest('.cell').dataset.p.split(',').map(Number);return{p,arr:ses.c[p[0]][p[1]],i:p[2]}};
 const setV=(arr,i,v)=>{arr[i].v=v;arr[i].c=true;for(let j=i+1;j<arr.length;j++)if(!arr[j].c)arr[j].v=v};
 el.querySelectorAll('.cell').forEach(n=>{
  n.querySelector('input').onchange=e=>{const {arr,i}=cell(n),x=num(e.target.value);setV(arr,i,isNaN(x)?'':Math.max(0,Math.round(x*2)/2));showTrain()};
  n.querySelectorAll('button').forEach(bt=>bt.onclick=()=>{const {arr,i}=cell(n),a=bt.dataset.a;
   if(a==='c'){arr[i].c=!arr[i].c}else{const x=num(arr[i].v)||0;setV(arr,i,Math.max(0,x+(a==='p'?.5:-.5)))}
   showTrain()})});
 $('fin').onclick=()=>{
  const ex={};ses.t.blocks.forEach((b,bi)=>b.ex.forEach((e,ei)=>{const v=ses.c[bi][ei].map(c=>c.c?c.v:null);if(v.some(x=>x!==null))ex[e.key]=(ex[e.key]||[]).concat(v)}));
  if(!Object.keys(ex).length){showTrain('Nichts gespeichert: Bestätige mindestens einen Satz mit ✓ oder tippe ein Gewicht ein.');window.scrollTo(0,0);return}const up={};Object.keys(ses.up).forEach(k=>{if(ses.up[k]&&ex[k])up[k]=1});S.ses.push({d:ses.d,tpl:ses.t.name,ex,n:(ses.n||'').trim(),up});save();ses=null;showTrain('Einheit gespeichert ('+S.ses.length+' insgesamt).')}}
let ed=null,dl=0,em=0;
const dfmt=d=>d.split('-').reverse().join('.');
const vfmt=v=>v===null?'':v===''?'EG':fmt(v);
const exn=k=>S.ex[k]?S.ex[k].name:k;
function table(){const H=['Datum','Workout','Übung','Satz/Runde','Gewicht (kg)','Notiz Einheit','Notiz Übung','Gewicht steigern'],R=[];
 [...S.ses].sort((a,b)=>a.d.localeCompare(b.d)).forEach(s=>Object.keys(s.ex).forEach(k=>s.ex[k].forEach((v,j)=>{if(v!==null)R.push([s.d,s.tpl,exn(k),j+1,v===''?'Eigengewicht':fmt(v),(s.n||'').replace(/\s*\n\s*/g,' '),((S.ex[k]||{}).note||'').replace(/\s*\n\s*/g,' '),s.up&&s.up[k]?'ja':''])})));return{H,R}}
async function doExp(kind){
 const {H,R}=table(),q=s=>/[";\n]/.test(s)?'"'+String(s).replace(/"/g,'""')+'"':s;
 const t=kind==='csv'?[H,...R].map(r=>r.map(q).join(';')).join('\r\n'):'| '+H.join(' | ')+' |\n|'+H.map(()=>' --- |').join('')+'\n'+R.map(r=>'| '+r.map(c=>String(c).replace(/\|/g,'\\|')).join(' | ')+' |').join('\n');
 const f='gewichte-'+new Date().toISOString().slice(0,10)+'.'+kind;
 if(await saveFile(f,(kind==='csv'?'\ufeff':'')+t,kind==='csv'?'text/csv':'text/markdown'))return;
 $('xo').value=t;$('xo').hidden=false}
let pk='';
function progCard(){const ks=Object.keys(S.ex).filter(k=>S.ses.some(s=>s.ex[k]&&s.ex[k].some(v=>typeof v==='number'))).sort((a,b)=>S.ex[a].name.localeCompare(S.ex[b].name));
 if(!ks.length)return'<div class="card"><h2>Gewichtsentwicklung</h2><div class="mute">Noch keine Gewichte gespeichert. Gespeichert werden nur Werte, die in der Trainingsansicht mit ✓ bestätigt oder eingetippt wurden.</div></div>';
 return '<div class="card"><h2>Gewichtsentwicklung</h2><label class="mute" for="px">Übung</label><select id="px">'+ks.map(k=>'<option value="'+esc(k)+'">'+esc(S.ex[k].name)+'</option>').join('')+'</select><div id="pc"></div></div>'}
function initProg(){
 const p=$('px');if(!p)return;if(pk&&[...p.options].some(o=>o.value===pk))p.value=pk;
 const draw=()=>{pk=p.value;const k=pk,
  pts=[...S.ses].sort((a,b)=>a.d.localeCompare(b.d)).map(s=>{const a=(s.ex[k]||[]).filter(v=>typeof v==='number');return a.length?{d:s.d,m:Math.max(...a),a}:null}).filter(Boolean),
  W=320,H=190,L=40,R=14,T=14,B=30,lo0=Math.min(...pts.map(q=>q.m)),hi0=Math.max(...pts.map(q=>q.m)),pad=(hi0-lo0)||1,lo=Math.max(0,lo0-pad*.2),hi=hi0+pad*.2,
  X=i=>pts.length===1?(L+W-R)/2:L+i*(W-L-R)/(pts.length-1),Y=v=>T+(H-T-B)*(1-(v-lo)/(hi-lo)),
  ds=d=>d.slice(8)+'.'+d.slice(5,7)+'.'+d.slice(2,4),tx=(x,y,t,a)=>'<text x="'+x+'" y="'+y+'" text-anchor="'+a+'" font-size="10" fill="var(--mute)">'+t+'</text>';
  let g='';for(let i=0;i<4;i++){const v=lo+(hi-lo)*i/3;g+='<line x1="'+L+'" x2="'+(W-R)+'" y1="'+Y(v)+'" y2="'+Y(v)+'" stroke="var(--line)"/>'+tx(L-6,Y(v)+4,fmt(Math.round(v*10)/10),'end')}
  const li=pts.map((q,i)=>X(i)+','+Y(q.m)).join(' ');
  g+='<polyline points="'+li+'" fill="none" stroke="var(--acc)" stroke-width="2"/>'+pts.map((q,i)=>'<circle cx="'+X(i)+'" cy="'+Y(q.m)+'" r="4" fill="var(--acc)"/>').join('');
  [...new Set([0,Math.floor((pts.length-1)/2),pts.length-1])].forEach(i=>{g+=tx(X(i),H-8,ds(pts[i].d),'middle')});
  const last=pts[pts.length-1],best=pts.reduce((a,q)=>q.m>a.m?q:a,pts[0]);
  $('pc').innerHTML='<svg viewBox="0 0 '+W+' '+H+'" style="width:100%;height:auto;margin-top:12px" role="img" aria-label="Gewichtsentwicklung '+esc(exn(k))+'">'+g+'</svg><div class="mute">Die Linie zeigt das höchste Gewicht je Einheit.</div><div>Letzte Einheit: '+fmt(last.m)+' kg · Höchstwert: '+fmt(best.m)+' kg ('+ds(best.d)+')</div>'+[...pts].reverse().map(q=>'<div class="mute">'+ds(q.d)+': '+q.a.map(fmt).join(' / ')+' kg</div>').join('')};
 p.onchange=draw;draw()}
let imv=0,IM=null;
const ds2=d=>d.slice(8)+'.'+d.slice(5,7)+'.'+d.slice(2,4);
const r5=x=>Math.round(num(x)*2)/2;
function parseCell(s){
 s=s.trim();if(!s)return null;
 if(/^(o\.?\s*gew\.?|ohne\s*gew\w*\.?)$/i.test(s))return{v:null,note:''};
 let fill=0,cnt=0;const nt=[],v=[],t=s.replace(/\(([^)]*)\)/g,(_,x)=>{nt.push(x.trim());return' '});
 t.split(/,(?!\d+\s*kg)/).forEach(g=>{g=g.trim();if(!g)return;let m=g.match(/^(\d+)\s*x\s*(\d+(?:[.,]\d+)?)\s*kg\b\s*(.*)$/i);
  if(m){for(let i=0;i<+m[1];i++)v.push(r5(m[2]));if(m[3].trim())nt.push(m[3].trim());return}
  m=g.match(/^(\d+)\s*x\s*(.+)$/i);if(m){for(let i=0;i<+m[1];i++)v.push('');nt.push(g);return}
  m=g.match(/^(\d+(?:[.,]\d+)?)\s*kg\b\s*(.*)$/i);if(m){v.push(r5(m[1]));fill=1;if(m[2].trim())nt.push(m[2].trim());return}
  nt.push(g)});
 nt.forEach(x=>{if(/^\d+(?:\s*[,/]\s*\d+)+\s*(?:wdh|reps?)/i.test(x))cnt=x.match(/\d+/g).length});return v.length?{v,note:nt.join(', '),fill:fill&&v.length===1,cnt}:null}
function parseMd(txt){
 const rs=txt.replace(/\\\|/g,'\u0001').split(/\r\n|[\n\r\u2028\u2029]/).map(l=>l.trim()).filter(l=>l[0]==='|').map(l=>l.replace(/^\||\|$/g,'').split('|').map(c=>c.replace(/\u0001/g,'|').trim()));
 const hd=rs.shift();if(!hd||hd.length<2)return null;
 const cols=hd.slice(1).map(h=>{const a=h.match(/(\d{1,2})[./](\d{1,2})[./](\d{4}|\d{2})\b/),b=h.match(/\d{4}-\d{2}-\d{2}/),n=h.match(/\(([^)]*)\)\s*(?:\]\])?\s*$/),
  d=a?(a[3].length===2?'20'+a[3]:a[3])+'-'+a[2].padStart(2,'0')+'-'+a[1].padStart(2,'0'):b?b[0]:null,nm=n?n[1].trim():h.replace(/\[\[|\]\]|\|/g,' ').replace(/\d{1,2}[./]\d{1,2}[./]\d{2,4}|\d{4}-\d{2}-\d{2}/g,' ').replace(/\s+/g,' ').trim();
  return{h,d,name:nm,sel:(S.tpl.find(t=>norm(t.name)===norm(nm))||{}).id||'__name__'}});
 const rows=[];rs.forEach(cs=>{if(cs.every(c=>/^:?-{2,}:?$/.test(c))||!cs[0])return;const c=cols.map((_,i)=>parseCell(cs[i+1]||''));if(c.some(Boolean))rows.push({name:cs[0],c})});
 return rows.length?{cols,rows}:null}
function showImp(msg){
 const el=$('v3');let h=msg?'<div class="card" style="border-color:var(--acc)">'+msg+'</div>':'';
 if(!IM){
  el.innerHTML=h+'<div class="card"><h2>Einheiten importieren</h2><div class="mute">Markdown-Tabelle einfügen: erste Spalte die Übung, jede weitere Spalte ein Trainingsdatum, der Workout-Name optional in Klammern.</div><textarea id="imt" style="margin-top:12px"></textarea><div class="row"><button class="btn" id="ima">Tabelle auslesen</button><button class="btn alt" id="imx">Zurück</button></div></div>';
  $('imx').onclick=()=>{imv=0;showHist()};
  $('ima').onclick=()=>{IM=parseMd($('imt').value);showImp(IM?'':'Keine Tabelle erkannt. Die Zeilen müssen mit | beginnen, die erste Zeile enthält die Daten.')};
  return}
 const {cols,rows}=IM,ks=Object.keys(S.ex).sort((a,b)=>S.ex[a].name.localeCompare(S.ex[b].name)),o=(v,t,s)=>'<option value="'+esc(v)+'"'+(s?' selected':'')+'>'+esc(t)+'</option>';
 h+='<div class="card"><h2>Einheiten</h2><div class="mute">Welches Workout gehört zu welchem Datum?</div>'+cols.filter(c=>!c.d).map(c=>'<div class="warn">Kein Datum erkannt, wird nicht importiert: '+esc(c.h)+'</div>').join('')+cols.map((c,i)=>c.d&&rows.some(r=>r.c[i])?'<div class="ex"><b>'+ds2(c.d)+'</b>'+(c.name?' <span class="mute">'+esc(c.name)+'</span>':'')+'<select data-ci="'+i+'" aria-label="Workout">'+o('','Nicht importieren',!c.sel)+o('__name__',c.name?'Name aus Tabelle: '+c.name:'Ohne Workout-Name (Training)',c.sel==='__name__')+S.tpl.map(t=>o(t.id,t.name,c.sel==t.id)).join('')+'</select></div>':'').join('')+'</div>';
 h+='<div class="card"><h2>Übungen</h2><div class="mute">Zuordnung zu den vorhandenen Übungen prüfen.</div>'+rows.map((r,ri)=>{const c=canon(r.name),cur=r.sel!==undefined?r.sel:(S.ex[c]?c:'__new__');
  return '<div class="ex">'+esc(r.name)+'<div class="mute">'+cols.map((cc,i)=>{const x=r.c[i];return x&&cc.d?ds2(cc.d)+': '+(x.v?x.v.map(q=>q===''?'EG':fmt(q)).join(' / ')+' kg':'Eigengewicht')+(x.note?' ['+esc(x.note)+']':''):''}).filter(Boolean).join(' · ')+'</div><select data-ri="'+ri+'" aria-label="Zuordnung zur Übung">'+o('__new__','Neue Übung',cur==='__new__')+o('__skip__','Überspringen',cur==='__skip__')+ks.map(k=>o(k,S.ex[k].name,cur===k)).join('')+'</select></div>'}).join('')+'</div>';
 h+='<div class="row"><button class="btn" id="imi">Importieren</button><button class="btn alt" id="imx">Abbrechen</button></div>';
 el.innerHTML=h;
 el.querySelectorAll('[data-ci]').forEach(s=>s.onchange=()=>{cols[s.dataset.ci].sel=s.value});
 el.querySelectorAll('[data-ri]').forEach(s=>s.onchange=()=>{rows[s.dataset.ri].sel=s.value});
 $('imx').onclick=()=>{IM=null;imv=0;showHist()};
 $('imi').onclick=()=>{try{const kk={},key=ri=>{if(ri in kk)return kk[ri];const r=rows[ri],v=r.sel!==undefined?r.sel:(S.ex[canon(r.name)]?canon(r.name):'__new__');let k=null;
   if(v==='__new__'){k=norm(r.name);while(S.ex[k])k+=' 2';S.ex[k]={name:r.name}}else if(v!=='__skip__'){if(!S.ex[norm(r.name)])S.al[norm(r.name)]=v;k=v}
   return kk[ri]=k};
  let made=0,skip=0,off=0;
  cols.forEach((c,i)=>{if(!c.d)return;if(!c.sel){off++;return}const t=c.sel==='__name__'?null:S.tpl.find(x=>x.id==c.sel),tn=t?t.name:(c.name||'Training');
   if(S.ses.some(s=>s.d===c.d&&s.tpl===tn)){skip++;return}
   const ex={},nt=[];
   rows.forEach((r,ri)=>{const cell=r.c[i];if(!cell)return;const k=key(ri);if(!k)return;let v=cell.v;
    if(!v||cell.fill){let n=cell.cnt||3;if(!cell.cnt&&t)t.blocks.forEach(b=>b.ex.forEach(e=>{if(e.key===k)n=b.t==='ss'?(e.n||b.rounds):1}));v=Array(n).fill(cell.fill?v[0]:'')}
    ex[k]=(ex[k]||[]).concat(v);if(cell.note)nt.push(r.name+': '+cell.note)});
   if(Object.keys(ex).length){S.ses.push({d:c.d,tpl:tn,ex,n:nt.join('\n')});made++}});
  save();IM=null;imv=0;showHist(made+' Einheiten importiert'+(skip?', '+skip+' übersprungen (Datum und Workout schon vorhanden)':'')+(off?', '+off+' ohne Workout-Auswahl nicht importiert':'')+'.')}catch(e){showImp('Fehler beim Import: '+e.message)}}}
let CL=null,CT=0;
const CH=100000,cs=t=>{const e=$('cs');if(e)e.textContent=t};
async function cloudPull(c){const m=await c.doc('meta').get();if(!m.exists)return null;const n=m.data().n||0;let s='';for(let i=0;i<n;i++){const d=await c.doc('p'+i).get();if(!d.exists)return null;s+=d.data().t}return JSON.parse(s)}
async function cloudPush(){const s=JSON.stringify(S),ch=[];let p=0;
 while(p<s.length){let e=Math.min(p+CH,s.length);const k=s.charCodeAt(e-1);if(k>=0xD800&&k<=0xDBFF&&e<s.length)e--;ch.push(s.slice(p,e));p=e}
 const n=ch.length||1,m=await CL.doc('meta').get(),on=m.exists?m.data().n||0:0;
 for(let i=0;i<n;i++)await CL.doc('p'+i).set({t:ch[i]||''});
 await CL.doc('meta').set({n,at:new Date().toISOString()});
 for(let i=n;i<on;i++)await CL.doc('p'+i).delete();
 cs('Im Konto gesichert ✓ '+new Date().toLocaleTimeString('de-DE',{hour:'2-digit',minute:'2-digit'}))}
function pushCloud(){if(!CL)return;clearTimeout(CT);CT=setTimeout(async()=>{try{await cloudPush()}catch(e){cs('Konto-Speicher: Sichern fehlgeschlagen ('+((e&&e.code)||'Fehler')+'). Bitte Backup speichern.')}},700)}
async function cloudInit(){
 try{const db=await claude.use('db'),us=await claude.use('user'),id=us&&await us.id();
  if(!db||!id){cs('Nur lokal gespeichert.');return}
  const c=db.collection('data/users/'+id),R=await cloudPull(c),empty=!S.tpl.length&&!S.ses.length&&!Object.keys(S.ex).length;
  CL=c;
  if(R&&empty){S=Object.assign({ex:{},al:{},tpl:[],ses:[]},R);try{localStorage.setItem(K,JSON.stringify(S))}catch(e){}ses=null;showTrain();cs('Aus dem Konto geladen ✓')}
  else if(R){merge(R);showTrain()}
  else if(!empty)await cloudPush();
  else cs('Konto-Speicher bereit.')}
 catch(e){CL=null;cs('Nur lokal gespeichert.')}}
let BK=null,bc=0;
async function saveFile(f,t,mime){
 try{const d=await claude.use('downloads');if(d){await d.save({filename:f,data:t});return true}}catch(e){if(e&&e.code==='declined')return true}
 try{const fl=new File([t],f,{type:mime});if(navigator.canShare&&navigator.canShare({files:[fl]})){await navigator.share({files:[fl]});return true}}catch(e){if(e&&e.name==='AbortError')return true}
 try{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([t],{type:mime}));a.download=f;document.body.appendChild(a);a.click();a.remove();return true}catch(e){}
 return false}
const cnt=o=>({e:Object.keys(o.ex||{}).length,t:(o.tpl||[]).length,s:(o.ses||[]).length});
function merge(B){let ae=0,at=0,as=0;
 Object.keys(B.ex||{}).forEach(k=>{if(!S.ex[k]){S.ex[k]=B.ex[k];ae++}else if(!S.ex[k].note&&B.ex[k].note)S.ex[k].note=B.ex[k].note});
 Object.keys(B.al||{}).forEach(k=>{if(!(k in S.al)&&!S.ex[k])S.al[k]=B.al[k]});
 (B.tpl||[]).forEach(t=>{if(!S.tpl.some(x=>x.id===t.id)){S.tpl.push(t);at++}});
 const sg=s=>s.d+'|'+s.tpl+'|'+JSON.stringify(s.ex),have=new Set(S.ses.map(sg));
 (B.ses||[]).forEach(s=>{if(!have.has(sg(s))){S.ses.push(s);have.add(sg(s));as++}});
 save();return 'Zusammengeführt: '+ae+' Übungen, '+at+' Workouts und '+as+' Einheiten ergänzt.'}
function showBk(msg){
 bc=0;const el=$('v3'),c=cnt(S);
 let h=(msg?'<div class="card" style="border-color:var(--acc)">'+msg+'</div>':'')+'<div class="card"><h2>Backup speichern</h2><div class="mute">Enthält Workouts, Übungen mit Notizen und alle Einheiten ('+c.t+' Workouts, '+c.e+' Übungen, '+c.s+' Einheiten). Die Datei auf dem anderen Gerät unter „Backup einspielen“ öffnen.</div><button class="btn" id="bks">Backup-Datei speichern</button><textarea id="bkt" hidden readonly aria-label="Backup-Text" style="margin-top:12px"></textarea></div>';
 h+='<div class="card"><h2>Backup einspielen</h2><div class="mute">Backup-Datei wählen oder den Backup-Text einfügen.</div><input type="file" id="bkf" accept=".json,application/json,text/plain" style="margin-top:12px"><textarea id="bki" placeholder="Backup-Text einfügen" style="margin-top:12px"></textarea><button class="btn" id="bkr">Prüfen</button>';
 if(BK){const k=cnt(BK);h+='<div class="ex">Im Backup: '+k.t+' Workouts, '+k.e+' Übungen, '+k.s+' Einheiten.<div class="row"><button class="btn" id="bkm">Zusammenführen</button><button class="btn alt" id="bkp">Alles ersetzen</button></div><div class="mute">Zusammenführen ergänzt fehlende Daten und lässt vorhandene unverändert. Ersetzen überschreibt alle Daten auf diesem Gerät.</div></div>'}
 h+='</div><button class="btn alt" id="bkx">Zurück</button>';
 el.innerHTML=h;
 $('bkx').onclick=()=>{imv=0;BK=null;showHist()};
 $('bks').onclick=async()=>{const t=JSON.stringify({app:'gewichte-tracker',v:1,t:new Date().toISOString(),data:S}),f='gewichte-backup-'+new Date().toISOString().slice(0,10)+'.json';$('bkt').value=t;$('bkt').hidden=false;await saveFile(f,t,'application/json')};
 const rd=t=>{try{const o=JSON.parse(t),d=o&&o.data;if(!d||o.app!=='gewichte-tracker'||!d.ses)throw 0;BK=Object.assign({ex:{},al:{},tpl:[],ses:[]},d);showBk()}catch(e){BK=null;showBk('Das ist kein gültiges Backup.')}};
 $('bkf').onchange=e=>{const fl=e.target.files[0];if(fl)fl.text().then(rd)};
 $('bkr').onclick=()=>rd($('bki').value);
 if(BK){$('bkm').onclick=()=>{const r=merge(BK);BK=null;showBk(r)};
  $('bkp').onclick=()=>{if(!bc){bc=1;$('bkp').textContent='Wirklich ersetzen?';return}S=Object.assign({ex:{},al:{},tpl:[],ses:[]},BK);ses=null;save();BK=null;showBk('Alle Daten ersetzt.')}}}
function showHist(msg){if(imv===2){showBk(msg);return}if(imv){showImp(msg);return}
 const el=$('v3'),m=msg?'<div class="card" style="border-color:var(--acc)">'+msg+'</div>':'';
 if(ed===null){
  const ix=S.ses.map((s,i)=>i).sort((a,b)=>S.ses[b].d.localeCompare(S.ses[a].d)||b-a);
  el.innerHTML=m+(ix.length?progCard()+ix.map(i=>{const s=S.ses[i];return '<div class="card"><h2>'+esc(s.tpl)+'</h2><div class="mute">'+dfmt(s.d)+' · '+Object.keys(s.ex).length+' Übungen</div>'+(s.n?'<div class="note">'+esc(s.n)+'</div>':'')+'<button class="btn alt" data-i="'+i+'">Ansehen und bearbeiten</button></div>'}).join('')+'<div class="card"><h2>Export</h2><div class="mute">Alle Einheiten, eine Zeile pro Satz bzw. Runde.</div><div class="row"><button class="btn" id="xc">CSV</button><button class="btn" id="xm">Markdown-Tabelle</button></div><textarea id="xo" hidden readonly aria-label="Exportierter Text"></textarea></div>':'<div class="card">Noch keine gespeicherten Einheiten.</div>');
  el.insertAdjacentHTML('afterbegin','<div class="row" style="margin:0 0 22px"><button class="btn alt" id="imb">Alte Einheiten importieren</button><button class="btn alt" id="bkb">Backup und Gerätewechsel</button></div>');$('imb').onclick=()=>{imv=1;IM=null;showHist()};$('bkb').onclick=()=>{imv=2;BK=null;showHist()};el.querySelectorAll('[data-i]').forEach(b=>b.onclick=()=>{ed=+b.dataset.i;dl=0;showHist()});
  if(ix.length){$('xc').onclick=()=>doExp('csv');$('xm').onclick=()=>doExp('md');initProg()}
  return}
 const s=S.ses[ed],ks=Object.keys(s.ex);
 let h=m+'<div class="card"><label class="mute" for="ed">Trainingsdatum</label><input type="date" id="ed" value="'+s.d+'"><label class="mute" for="en">Workout</label><input class="nm" id="en" value="'+esc(s.tpl)+'"><label class="mute" for="enn">Notiz zur Einheit</label><textarea id="enn" style="min-height:90px">'+esc(s.n||'')+'</textarea></div>';
 ks.forEach((k,x)=>{h+='<div class="card"><h2>'+esc(exn(k))+'</h2><div class="row">'+s.ex[k].map((v,j)=>'<input class="nm" style="width:78px;text-align:center" data-x="'+x+'" data-j="'+j+'" inputmode="decimal" placeholder="–" value="'+vfmt(v)+'" aria-label="Runde '+(j+1)+'">').join('')+'</div><label class="chkup"><input type="checkbox" data-eu="'+x+'"'+(s.up&&s.up[k]?' checked':'')+'> Gewicht steigern</label></div>'});
 h+='<div class="mute">Leer = nicht erfasst, „EG“ = Eigengewicht, Schritte von 0,5 kg.</div><div class="row"><button class="btn" id="hs">Speichern</button><button class="btn alt" id="hc">Abbrechen</button><button class="btn alt" id="hd">'+(dl?'Wirklich löschen?':'Einheit löschen')+'</button></div>';
 el.innerHTML=h;
 $('hc').onclick=()=>{ed=null;dl=0;showHist()};
 $('hd').onclick=()=>{if(!dl){dl=1;showHist();return}S.ses.splice(ed,1);save();ed=null;dl=0;showHist('Einheit gelöscht.')};
 $('hs').onclick=()=>{el.querySelectorAll('input[data-x]').forEach(i=>{const a=s.ex[ks[i.dataset.x]],j=+i.dataset.j,t=i.value.trim(),n=num(t);a[j]=t===''?null:/^eg$/i.test(t)?'':isNaN(n)?a[j]:Math.round(n*2)/2});s.up={};el.querySelectorAll('[data-eu]').forEach(i=>{if(i.checked)s.up[ks[i.dataset.eu]]=1});s.d=$('ed').value||s.d;s.tpl=$('en').value.trim()||s.tpl;s.n=$('enn').value.trim();save();ed=null;showHist('Einheit aktualisiert.')}}
function tab(n){$('v1').hidden=n!==1;$('v2').hidden=n!==2;$('v3').hidden=n!==3;$('t3').setAttribute('aria-selected',n===3);$('t1').setAttribute('aria-selected',n===1);$('t2').setAttribute('aria-selected',n===2)}
$('t1').onclick=()=>{tab(1);showTrain()};$('t2').onclick=()=>tab(2);$('t3').onclick=()=>{ed=null;dl=0;imv=0;tab(3);showHist()};cloudInit();
showTrain();
