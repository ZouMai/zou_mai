import stages from './bases-data.mjs';
import {Mission} from './bases-engine.mjs';
const $=id=>document.getElementById(id);
const pieceName={p:'pion',n:'cavalier',b:'fou',r:'tour',q:'dame',k:'roi'};
let stage, index, mission, selected, pending;
const scores=new Map();
try{for(const item of JSON.parse(localStorage.getItem('zou-bases-stars')||'[]'))scores.set(...item)}catch{}
if(new URLSearchParams(location.search).get('depuis')==='classe')$('back').href='class-echecs.html';
stages.forEach((s,i)=>$('stage').add(new Option('Étape '+(i+1)+' · '+s.title,s.key)));
function go(key,i){const hash='#'+key+'/'+(i+1);if(location.hash===hash)load();else location.hash=hash}
function load(){
  const [key,n]=location.hash.slice(1).split('/');
  stage=stages.find(s=>s.key===key)||stages[0];
  index=Math.max(0,Math.min(stage.levels.length-1,(Number(n)||1)-1));
  if(!Number.isInteger(index))index=0;
  mission=new Mission(stage,stage.levels[index]);selected=null;
  $('stage').value=stage.key;$('sub').textContent=stage.sub;$('goal').textContent=mission.level.goal;
  $('status').textContent='';$('next').hidden=true;render();
}
function render(){
  const moves=selected?mission.game.moves({square:selected,verbose:true}):[];
  $('board').replaceChildren();
  for(let r=8;r>=1;r--)for(let f=0;f<8;f++){
    const sq='abcdefgh'[f]+r,p=mission.game.get(sq),b=document.createElement('button');
    const star=mission.targets.has(sq);
    b.dataset.square=sq;b.className='sq '+((r+f)%2?'dark':'light');
    if(selected===sq)b.classList.add('selected');
    if(moves.some(m=>m.to===sq))b.classList.add('target');
    if(p?.type==='k' && mission.game.isAttacked(sq,p.color==='w'?'b':'w'))b.classList.add('check');
    b.setAttribute('aria-label',[sq,star?'étoile':'',p&&!star?pieceName[p.type]+' '+(p.color==='w'?'blanc':'noir'):''].filter(Boolean).join(' '));
    if(p && !(star&&p.color==='b'&&mission.key!=='setup'))b.innerHTML='<svg aria-hidden="true"><use href="bases-pieces.svg#'+p.color+p.type.toUpperCase()+'"/></svg>';
    else if(star)b.innerHTML='<span class="star">★</span>';
    if(r===1)b.insertAdjacentHTML('beforeend','<small class="file">'+sq[0]+'</small>');
    if(f===7)b.insertAdjacentHTML('beforeend','<small class="rank">'+r+'</small>');
    b.onclick=()=>choose(sq);$('board').append(b);
  }
  $('steps').replaceChildren();
  stage.levels.forEach((l,i)=>{
    const b=document.createElement('button'),score=scores.get(stage.key+'/'+i);
    b.textContent=score?'★'.repeat(score):i+1;if(score)b.className='won';
    if(i===index)b.setAttribute('aria-current','step');
    b.setAttribute('aria-label','Problème '+(i+1)+(score?', '+score+' étoiles':''));
    b.onclick=()=>go(stage.key,i);$('steps').append(b);
  });
}
function choose(sq){
  if(mission.done)return;
  if(selected){
    const possible=mission.game.moves({square:selected,verbose:true}).filter(m=>m.to===sq && m.captured!=='k');
    if(possible.length){
      if(possible.some(m=>m.promotion)){pending=[selected,sq];$('promotion').showModal();return}
      play(selected,sq);return;
    }
  }
  selected=mission.game.get(sq)?.color==='w'&&sq!==selected?sq:null;render();
}
function play(from,to,promotion){
  $('status').textContent=mission.play(from,to,promotion);selected=null;
  if(mission.done){
    const k=stage.key+'/'+index;
    scores.set(k,Math.max(scores.get(k)||0,Math.max(1,3-Math.max(0,mission.count-mission.level.par))));
    try{localStorage.setItem('zou-bases-stars',JSON.stringify([...scores]))}catch{}
    $('next').hidden=false;
    $('next').textContent=index===stage.levels.length-1?'Étape suivante →':'Problème suivant →';
    if(index===stage.levels.length-1 && stage===stages.at(-1)){$('next').hidden=true;$('status').textContent='Bravo, tu as terminé la dernière étape !'}
  }
  render();
}
for(const t of ['q','r','b','n']){
  const b=document.createElement('button');b.textContent=pieceName[t];
  b.onclick=()=>{$('promotion').close();play(...pending,t)};$('choices').append(b);
}
$('stage').onchange=e=>go(e.target.value,0);
$('reset').onclick=load;
$('next').onclick=()=>index+1<stage.levels.length?go(stage.key,index+1):go(stages[stages.indexOf(stage)+1].key,0);
$('sound').hidden=!('speechSynthesis' in window);
$('sound').onclick=()=>{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(mission.level.goal);u.lang='fr-FR';speechSynthesis.speak(u)};
window.addEventListener('hashchange',load);load();
