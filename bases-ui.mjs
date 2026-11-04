import stages from './bases-data.mjs';
import {Mission} from './bases-engine.mjs';
const $=id=>document.getElementById(id);
const pieceName={p:'pion',n:'cavalier',b:'fou',r:'tour',q:'dame',k:'roi'};
let stage, index, mission, selected, pending, last=[];
let drag=null, blockClick=false;
const board=$('board');
const scores=new Map();
try{for(const item of JSON.parse(localStorage.getItem('zou-bases-stars')||'[]'))scores.set(...item)}catch{}
if(new URLSearchParams(location.search).get('depuis')==='classe')$('back').href='class-echecs.html';
function go(key,i){const hash='#'+key+'/'+(i+1);if(location.hash===hash)load();else location.hash=hash}
function load(){
  const [key,n]=location.hash.slice(1).split('/');
  stage=stages.find(s=>s.key===key)||stages[0];
  index=Math.max(0,Math.min(stage.levels.length-1,(Number(n)||1)-1));
  if(!Number.isInteger(index))index=0;
  endDrag();last=[];mission=new Mission(stage,stage.levels[index]);selected=null;
  $('stage-name').textContent=stage.title;$('sub').textContent=stage.sub;$('goal').textContent=mission.level.goal;
  $('counter').textContent='Problème '+(index+1)+' sur '+stage.levels.length;
  $('status').textContent='';$('next').hidden=true;render();
}
function render(){
  const moves=selected?mission.game.moves({square:selected,verbose:true}):[];
  $('board').replaceChildren();
  for(let r=8;r>=1;r--)for(let f=0;f<8;f++){
    const sq='abcdefgh'[f]+r,p=mission.game.get(sq),b=document.createElement('button');
    const star=mission.targets.has(sq);
    b.dataset.square=sq;b.className='sq '+((r+f)%2?'dark':'light');
    if(!mission.done&&p?.color==='w')b.classList.add('movable');
    if(last.includes(sq))b.classList.add('last');
    if(mission.level.highlightRank===r)b.classList.add('rank-guide');
    if(selected===sq)b.classList.add('selected');
    if(moves.some(m=>m.to===sq))b.classList.add('target');
    if(p?.type==='k' && mission.game.isAttacked(sq,p.color==='w'?'b':'w'))b.classList.add('check');
    b.setAttribute('aria-label',[sq,star?'étoile':'',p&&!star?pieceName[p.type]+' '+(p.color==='w'?'blanc':'noir'):''].filter(Boolean).join(' '));
    if(p && !(star&&p.color==='b'&&mission.key!=='setup'))b.innerHTML='<svg aria-hidden="true"><use href="bases-pieces.svg#'+p.color+p.type.toUpperCase()+'"/></svg>';
    else if(star)b.innerHTML='<svg class="goal-star" viewBox="0 0 100 100" aria-hidden="true"><use href="#goal-star"/></svg>';
    if(r===1)b.insertAdjacentHTML('beforeend','<small class="file">'+sq[0]+'</small>');
    if(f===7)b.insertAdjacentHTML('beforeend','<small class="rank">'+r+'</small>');
    b.onclick=()=>choose(sq);$('board').append(b);
  }
  drawGuides();
  $('steps').replaceChildren();
  stage.levels.forEach((l,i)=>{
    const b=document.createElement('button'),score=scores.get(stage.key+'/'+i);
    b.textContent=i+1;
    if(score){b.className='won';const stars=document.createElement('span');stars.className='rating';stars.textContent='★'.repeat(score);b.append(stars)}
    if(i===index)b.setAttribute('aria-current','step');
    b.setAttribute('aria-label','Problème '+(i+1)+(score?', '+score+' étoiles':''));
    b.onclick=()=>go(stage.key,i);$('steps').append(b);
  });
}
function drawGuides(){
  const layer=$('guides');
  layer.replaceChildren();
  if(mission.count||!mission.level.guides)return;
  const center=s=>[(s.charCodeAt(0)-97)*100+50,(8-Number(s[1]))*100+50];
  for(const [path,color] of mission.level.guides){
    const [x,y]=center(path);
    const stroke=({green:'#277637',red:'#bd3434',yellow:'#ba8400',blue:'#3474aa'})[color]||'#277637';
    const shape=document.createElementNS('http://www.w3.org/2000/svg',path.length===2?'circle':'path');
    if(path.length===2){
      for(const [k,v] of Object.entries({cx:x,cy:y,r:43,fill:'none',stroke,'stroke-width':8}))shape.setAttribute(k,v);
    }else{
      const [tx,ty]=center(path.slice(2)),length=Math.hypot(tx-x,ty-y);
      shape.setAttribute('transform','translate('+x+' '+y+') rotate('+Math.atan2(ty-y,tx-x)*180/Math.PI+')');
      shape.setAttribute('d','M 10 -5 H '+(length-33)+' v -10 L '+(length-8)+' 0 l -25 15 v -10 H 10 Z');
      shape.setAttribute('fill',stroke);
    }
    shape.setAttribute('opacity','.73');layer.append(shape);
  }
}
function endDrag(){
  if(!drag)return;
  drag.icon?.remove();drag.cell.classList.remove('held');drag=null;
}
board.addEventListener('pointerdown',e=>{
  if(!e.isPrimary||e.button!==0)return;
  blockClick=false;
  const cell=e.target.closest('.movable');
  if(cell)drag={cell,sq:cell.dataset.square,id:e.pointerId,x:e.clientX,y:e.clientY};
});
board.addEventListener('pointermove',e=>{
  if(!drag||e.pointerId!==drag.id)return;
  if(!drag.icon){
    if(Math.hypot(e.clientX-drag.x,e.clientY-drag.y)<6)return;
    board.setPointerCapture(e.pointerId);
    selected=drag.sq;render();
    drag.cell=board.querySelector('[data-square="'+drag.sq+'"]');
    drag.icon=drag.cell.querySelector('svg').cloneNode(true);
    drag.icon.setAttribute('class','drag-icon');
    drag.icon.style.width=drag.icon.style.height=drag.cell.offsetWidth+'px';
    document.body.append(drag.icon);drag.cell.classList.add('held');
  }
  drag.icon.style.left=e.clientX+'px';drag.icon.style.top=e.clientY+'px';
});
window.addEventListener('pointerup',e=>{
  if(!drag||e.pointerId!==drag.id)return;
  const moved=!!drag.icon,from=drag.sq;endDrag();
  if(!moved)return;
  blockClick=true;
  const to=document.elementFromPoint(e.clientX,e.clientY)?.closest('#board [data-square]')?.dataset.square;
  if(to&&to!==from)choose(to);
});
window.addEventListener('pointercancel',endDrag);
board.addEventListener('click',e=>{if(blockClick&&e.detail){e.stopImmediatePropagation();blockClick=false}},true);
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
  const previous=mission.count;
  $('status').textContent=mission.play(from,to,promotion);selected=null;
  if(mission.count>previous){last=[from,to];window.ZouChessSound?.move(mission.playedMove)}
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
const chapters=[
  ['Les pièces',['rook','bishop','queen','king','knight','pawn']],
  ['Les fondamentaux',['capture','protection','combat','check1','outOfCheck','checkmate1']],
  ['Les règles spéciales',['setup','castling','enpassant','stalemate']],
  ['Pour aller plus loin',['value','check2']]
];
function openMenu(){
  const list=$('chapters');
  list.replaceChildren();
  let total=0,maximum=0;
  for(const [name,keys] of chapters){
    const heading=document.createElement('h3');
    heading.textContent=name;list.append(heading);
    for(const key of keys){
      const item=stages.find(s=>s.key===key);
      const details=document.createElement('details');
      const summary=document.createElement('summary');
      const title=document.createElement('strong');
      const tally=document.createElement('small');
      const grid=document.createElement('div');
      summary.className='stage-row';grid.className='exercise-grid';
      title.textContent=item.title;
      let earned=0;
      item.levels.forEach((level,i)=>{
        const count=scores.get(key+'/'+i)||0;
        earned+=count;
        const b=document.createElement('button');
        b.textContent=i+1;
        const rating=document.createElement('span');
        rating.textContent='★'.repeat(count)+'☆'.repeat(3-count);
        b.append(rating);
        b.setAttribute('aria-label',item.title+' · exercice '+(i+1)+' · '+count+' étoiles sur 3');
        if(stage===item&&index===i)b.setAttribute('aria-current','step');
        b.onclick=()=>{$('catalog').close();go(key,i)};
        grid.append(b);
      });
      tally.textContent='★ '+earned+' / '+(item.levels.length*3);
      summary.append(title,tally);details.append(summary,grid);list.append(details);
      details.open=item===stage;
      maximum+=item.levels.length*3;total+=earned;
    }
  }
  $('catalog-score').textContent='★ '+total+' / '+maximum+' étoiles récoltées';
  $('catalog').showModal();
}
$('menu-open').onclick=openMenu;
$('menu-close').onclick=()=>$('catalog').close();
$('reset').onclick=load;
$('next').onclick=()=>index+1<stage.levels.length?go(stage.key,index+1):go(stages[stages.indexOf(stage)+1].key,0);
$('sound').hidden=!('speechSynthesis' in window);
$('sound').onclick=()=>{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(mission.level.goal);u.lang='fr-FR';speechSynthesis.speak(u)};
window.addEventListener('hashchange',load);load();

if(!location.hash)openMenu();
