'use strict';
// Chaque # est un carreau entier ; a et b sont des demi-carreaux triangulaires.
const SHAPES={
  m5:['###...','##....'], a6:['##....','##....','##....'], b6:['###...','###...'],
  c6:['####..','.#....','.#....'], n7:['####..','###...'],
  d8:['###...','###...','##....'], e8:['####..','####..'],
  f8:['##....','##....','##....','##....'],
  o9:['####..','####..','#.....'], g10:['####..','####..','##....'],
  h10:['#####.','#####.'], p11:['#####.','#####.','#.....'],
  i12:['###...','###...','###...','###...'], j12:['####..','####..','####..'],
  k14:['#####.','#####.','####..'], l15:['#####.','#####.','#####.'],
  q6:['###...','##a...','..b...'], r8:['####..','###a..','...b..']
};
const smallTriangles=id=>SHAPES[id].join('').split('').reduce((sum,c)=>sum+(c==='#'?2:c==='a'||c==='b'?1:0),0);
const area=(id,ch)=>smallTriangles(id)/(ch.unit==='twoSquares'?4:2);
const CHALLENGES=[
  {type:'count',ids:['m5']},{type:'count',ids:['a6']},
  {type:'compare',ids:['m5','a6','n7'],goal:'largest'},
  {type:'equal',ids:['a6','n7','b6','e8']},
  {type:'order',ids:['m5','a6','n7']},
  {type:'count',ids:['e8'],unit:'twoSquares'},
  {type:'compare',ids:['d8','e8'],goal:'tie',unit:'twoSquares'},
  {type:'count',ids:['q6'],unit:'twoTriangles'},
  {type:'order',ids:['a6','d8','g10'],unit:'twoSquares'},
  {type:'equal',ids:['e8','g10','f8','k14'],unit:'twoSquares'},
  {type:'count',ids:['r8'],unit:'twoTriangles'},
  {type:'compare',ids:['q6','a6'],goal:'tie',unit:'twoTriangles'},
  {type:'order',ids:['n7','m5','r8','q6'],unit:'twoTriangles'},
  {type:'equal',ids:['q6','n7','c6','d8'],unit:'twoTriangles'},
  {type:'count',ids:['o9']},
  {type:'compare',ids:['i12','h10'],goal:'smallest'},
  {type:'order',ids:['o9','p11','g10','i12']},
  {type:'count',ids:['k14'],unit:'twoSquares'},
  {type:'equal',ids:['i12','p11','k14','j12']},
  {type:'order',ids:['k14','e8','g10','o9']}
];
const $=id=>document.getElementById(id);
const letters='ABCDE';
const label=i=>'figure '+letters[i];
let index=0,score=0,selection=[],answered=false;
function drawing(id,indexInQuestion,triangles=false){
  const rows=SHAPES[id],fill=['#20a486','#ee9052','#6c77ce','#db6d97'][indexInQuestion%4];
  let svg=`<svg viewBox="0 0 168 144" role="img" aria-label="Figure coloriée sur un quadrillage de ${triangles?'triangles':'carreaux'} égaux">`;
  for(let y=0;y<5;y++)for(let x=0;x<6;x++){
    const c=rows[y]?.[x]||'.',left=x*24+12,top=y*24+12;
    svg+=`<rect x="${left}" y="${top}" width="24" height="24" fill="#fff" stroke="#b8c9c1" stroke-width="1"/>`;
    if(c==='#')svg+=`<rect x="${left+1}" y="${top+1}" width="22" height="22" fill="${fill}"/>`;
    if(c==='a')svg+=`<path d="M${left+1} ${top+1} L${left+23} ${top+1} L${left+1} ${top+23} Z" fill="${fill}"/>`;
    if(c==='b')svg+=`<path d="M${left+23} ${top+1} L${left+23} ${top+23} L${left+1} ${top+23} Z" fill="${fill}"/>`;
    if(triangles)svg+=`<path d="M${left} ${top+24} L${left+24} ${top}" fill="none" stroke="#708a80" stroke-width="1"/>`;
  }
  return svg+'</svg>';
}
function result(ch){
  const sizes=ch.ids.map(id=>area(id,ch));
  if(ch.type==='count')return String(sizes[0]);
  if(ch.type==='equal')return letters[sizes.findIndex((n,i)=>i>0&&n===sizes[0])];
  if(ch.type==='order')return ch.ids.map((_,i)=>i).sort((a,b)=>sizes[a]-sizes[b]).map(i=>letters[i]).join('');
  if(ch.goal==='tie')return 'Même aire';
  return letters[sizes.indexOf(ch.goal==='largest'?Math.max(...sizes):Math.min(...sizes))];
}
function unitReference(ch){
  const unit=ch.unit||'square';
  const icon=unit==='twoSquares'?'<rect x="2" y="3" width="23" height="23"/><rect x="25" y="3" width="23" height="23"/>':unit==='twoTriangles'?'<rect x="2" y="3" width="26" height="26"/><path d="M2 29 L28 3" fill="none" stroke="#124a3b" stroke-width="2"/>':'<rect x="2" y="3" width="26" height="26"/>';
  const text=unit==='twoSquares'?'1 unité d’aire = 2 petits carreaux':unit==='twoTriangles'?'1 unité d’aire = 2 petits triangles':'1 unité d’aire = 1 carreau';
  $('unit').innerHTML=`<svg viewBox="0 0 52 32" aria-hidden="true" focusable="false" fill="#61bb92" stroke="#124a3b" stroke-width="2">${icon}</svg><strong>${text}</strong>`;
}
function render(){
  const ch=CHALLENGES[index];answered=false;selection=[];
  $('progress').textContent=`Défi ${index+1} / ${CHALLENGES.length} · ${score} point${score>1?'s':''}`;
  $('meter-fill').style.width=(index/CHALLENGES.length*100)+'%';
  const titles={count:'Mesurer une aire',compare:'Comparer des aires',equal:'Même aire, autre forme',order:'Classer des aires'};
  $('task-kind').textContent=titles[ch.type];
  const prompts={count:'Quelle est l’aire de cette figure ?',compare:ch.goal==='tie'?'Compare les deux figures.':'Quelle figure a l’aire '+(ch.goal==='largest'?'la plus grande':'la plus petite')+' ?',equal:'Quelle figure a la même aire que la figure A ?',order:'Range les figures de la plus petite aire à la plus grande.'};
  $('question').textContent=prompts[ch.type];
  $('instruction').textContent=ch.type==='order'?'Touche les figures une par une dans l’ordre croissant.':ch.type==='equal'?'La forme peut changer : compare les figures avec la même unité.':ch.type==='count'?'Compte les parties colorées, puis regroupe-les selon l’unité indiquée.':'Observe les surfaces colorées, puis réponds.';
  unitReference(ch);
  $('figures').replaceChildren();
  ch.ids.forEach((id,i)=>{
    const card=document.createElement(ch.type==='order'||ch.type==='equal'&&i>0?'button':'div');
    card.className='area-card'+(ch.type==='equal'&&i===0?' reference':'')+(card.tagName==='BUTTON'?' selectable':'');
    if(card.tagName==='BUTTON'){card.type='button';card.setAttribute('aria-pressed','false');card.addEventListener('click',()=>select(i))}
    const title=document.createElement('strong');title.textContent=letters[i];
    card.append(title);
    card.insertAdjacentHTML('beforeend',drawing(id,i,ch.unit==='twoTriangles'));
    $('figures').append(card);
  });
  $('answer').replaceChildren();
  if(ch.type==='count'){
    const labelEl=document.createElement('label');labelEl.htmlFor='response';labelEl.textContent='Aire en unités :';
    const input=document.createElement('input');input.id='response';input.type='number';input.min='0';input.step='1';input.inputMode='numeric';
    $('answer').append(labelEl,input);
  }else if(ch.type==='compare'){
    const options=document.createElement('div');options.className='area-options';
    const values=ch.goal==='tie'?['A','B','Même aire']:ch.ids.map((_,i)=>letters[i]);
    values.forEach(value=>{const button=document.createElement('button');button.type='button';button.textContent=value==='Même aire'?'Elles ont la même aire':label(letters.indexOf(value));button.dataset.value=value;button.setAttribute('aria-pressed','false');button.addEventListener('click',()=>{selection=[value];options.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b===button)))});options.append(button)});
    $('answer').append(options);
  }else if(ch.type==='order'){
    const p=document.createElement('p');p.id='selected-order';p.className='selected-order';p.setAttribute('aria-live','polite');$('answer').append(p);updateSelection();
  }
  $('undo').classList.toggle('hidden',ch.type!=='order');$('undo').disabled=true;
  $('validate').classList.remove('hidden');$('next').classList.add('hidden');$('feedback').classList.add('hidden');
}
function select(i){
  if(answered)return;
  const ch=CHALLENGES[index];
  if(ch.type==='equal')selection=[letters[i]];
  else if(!selection.includes(letters[i]))selection.push(letters[i]);
  updateSelection();
}
function updateSelection(){
  const ch=CHALLENGES[index];
  [...$('figures').children].forEach((card,i)=>{
    const rank=selection.indexOf(letters[i]);card.classList.toggle('selected',rank>=0);
    if(card.tagName==='BUTTON')card.setAttribute('aria-pressed',String(rank>=0));
    card.querySelector('.rank')?.remove();
    if(rank>=0&&ch.type==='order'){const badge=document.createElement('span');badge.className='rank';badge.textContent=String(rank+1);card.append(badge)}
  });
  if(ch.type==='order'){$('selected-order').textContent=selection.length?'Ton classement : '+selection.join(' → '):'Touche la première figure.';$('undo').disabled=!selection.length}
}
function validate(){
  if(answered)return;
  const ch=CHALLENGES[index],value=ch.type==='count'?$('response').value.trim():ch.type==='order'?selection.join(''):selection[0];
  if(!value||ch.type==='order'&&selection.length!==ch.ids.length){$('feedback').className='feedback bad';$('feedback').textContent=ch.type==='order'?'Classe toutes les figures avant de vérifier.':'Choisis une réponse avant de vérifier.';return}
  answered=true;
  const expected=result(ch),correct=value===expected;
  if(correct)score++;
  const f=$('feedback');f.replaceChildren();
  const heading=document.createElement('strong');heading.textContent=correct?'Bravo, tu as bien observé !':'Regarde les aires pour comprendre :';f.append(heading);
  const detail=document.createElement('p');
  detail.textContent=ch.ids.map((id,i)=>`${letters[i]} : ${area(id,ch)} ${area(id,ch)===1?'unité':'unités'} d’aire`).join(' · ')+'.';f.append(detail);
  const explanation=document.createElement('p');
  explanation.textContent=ch.unit==='twoSquares'?'Regroupe les petits carreaux par deux : chaque paire vaut une unité d’aire.':ch.unit==='twoTriangles'?'Regroupe les petits triangles par deux : chaque paire vaut une unité d’aire.':ch.type==='order'?`L’ordre croissant est ${expected.split('').join(' → ')}.`:ch.type==='equal'?'Des formes différentes peuvent couvrir le même nombre de carreaux.':'On compare les surfaces couvertes avec le même carreau unité, quelle que soit la forme du contour.';
  if(ch.type==='order'&&ch.unit)explanation.textContent+=` L’ordre croissant est ${expected.split('').join(' → ')}.`;
  f.append(explanation);f.className='feedback'+(correct?'':' bad');
  [...$('figures').children].forEach((card,i)=>{const measure=document.createElement('span');measure.className='measurement';measure.textContent=`${area(ch.ids[i],ch)} unités d’aire`;card.append(measure);if(card.tagName==='BUTTON')card.disabled=true});
  $('answer').querySelectorAll('input,button').forEach(el=>el.disabled=true);
  $('undo').classList.add('hidden');$('validate').classList.add('hidden');$('next').classList.remove('hidden');$('next').textContent=index===CHALLENGES.length-1?'Voir mon résultat':'Défi suivant →';
}
function start(){index=0;score=0;$('intro').classList.add('hidden');$('end').classList.add('hidden');$('celebration').classList.add('hidden');$('play').classList.remove('hidden');render()}
function next(){if(index<CHALLENGES.length-1){index++;render();return}$('play').classList.add('hidden');$('end').classList.remove('hidden');$('final').textContent=`${score} / ${CHALLENGES.length}`;$('summary').textContent=score===CHALLENGES.length?'Toutes les aires ont été bien comparées !':'Tu peux rejouer pour observer les figures à ton rythme.';if(score===CHALLENGES.length)$('celebration').classList.remove('hidden')}
document.addEventListener('DOMContentLoaded',()=>{
  $('start').addEventListener('click',start);$('again').addEventListener('click',start);$('validate').addEventListener('click',validate);$('next').addEventListener('click',next);
  $('undo').addEventListener('click',()=>{selection.pop();updateSelection()});$('close').addEventListener('click',()=>$('celebration').classList.add('hidden'));
  $('answer').addEventListener('keydown',event=>{if(event.key==='Enter'&&event.target.id==='response'){event.preventDefault();validate()}});
});
