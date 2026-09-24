'use strict';
const $=id=>document.getElementById(id);
const LETTERS='ABCDE';
const COLORS=['#21a486','#ed9250','#7971cd','#dc668e','#4d9ec5'];
const SIZE=20;
let index=0,score=0,selection=[],answered=false;

function polygonArea(points){return Math.abs(points.reduce((sum,[x,y],i)=>{const [nx,ny]=points[(i+1)%points.length];return sum+x*ny-nx*y},0))/2}
function smallSquareArea(id){
  const s=AREA_SHAPES[id];
  if(s.kind==='polygon')return polygonArea(s.points);
  if(s.kind==='cutout')return polygonArea(s.outer)-s.holes.reduce((sum,p)=>sum+polygonArea(p),0);
  if(s.kind==='curve')return s.base[2]*s.base[3]; // Les deux demi-cercles identiques se compensent.
  return [...s.rows.join('')].reduce((sum,c)=>sum+(c==='#'?1:c==='a'||c==='b'?.5:0),0);
}
function area(id,item){return smallSquareArea(id)/(item.unit===2?2:1)}
function expected(item){
  const sizes=item.figures.map(id=>area(id,item));
  if(item.kind==='number')return String(sizes[0]);
  if(item.kind==='multi')return item.figures.map((_,i)=>i).filter(i=>!(i===0&&item.excludeReference)&&sizes[i]===sizes[0]).map(i=>LETTERS[i]).join('');
  if(item.kind==='order')return item.figures.map((_,i)=>i).sort((a,b)=>sizes[a]-sizes[b]).map(i=>LETTERS[i]).join('');
  if(item.answer)return item.answer;
  if(item.goal==='equalToA')return LETTERS[sizes.findIndex((n,i)=>i>0&&n===sizes[0])];
  return LETTERS[sizes.indexOf(item.goal==='largest'?Math.max(...sizes):Math.min(...sizes))];
}
function poly(points){return points.map(([x,y])=>`${x*SIZE},${y*SIZE}`).join(' ')}
function path(points){return 'M'+points.map(([x,y])=>`${x*SIZE} ${y*SIZE}`).join('L')+'Z'}
function grid(width=12,height=8,triangles=false){
  let lines='<g class="area-gridlines" fill="none" stroke="#9cc9df" stroke-width=".8" pointer-events="none">';
  for(let x=0;x<=width;x++)lines+=`<path d="M${x*SIZE} 0V${height*SIZE}"/>`;
  for(let y=0;y<=height;y++)lines+=`<path d="M0 ${y*SIZE}H${width*SIZE}"/>`;
  if(triangles)for(let y=0;y<height;y++)for(let x=0;x<width;x++)lines+=`<path d="M${x*SIZE} ${(y+1)*SIZE}L${(x+1)*SIZE} ${y*SIZE}"/>`;
  return lines+'</g>';
}
function curvePath(){return 'M20 20 H180 V30 A40 40 0 0 1 180 110 V120 H20 V110 A40 40 0 0 0 20 30 Z'}
function shapeBody(id,color){
  const s=AREA_SHAPES[id];
  if(s.kind==='polygon')return `<polygon points="${poly(s.points)}" fill="${color}" fill-opacity=".8" stroke="${color}" stroke-width="2.3"/>`;
  if(s.kind==='cutout')return `<path d="${path(s.outer)}${s.holes.map(path).join('')}" fill="${color}" fill-opacity=".8" fill-rule="evenodd" stroke="${color}" stroke-width="2.3"/>`;
  if(s.kind==='curve')return `<path d="${curvePath()}" fill="${color}" fill-opacity=".8" stroke="${color}" stroke-width="2.3"/>`;
  let out='';
  s.rows.forEach((row,y)=>[...row].forEach((cell,x)=>{
    const a=x*SIZE,b=y*SIZE;
    if(cell==='#')out+=`<rect x="${a}" y="${b}" width="${SIZE}" height="${SIZE}" fill="${color}"/>`;
    if(cell==='a')out+=`<path d="M${a} ${b}L${a+SIZE} ${b}L${a} ${b+SIZE}Z" fill="${color}"/>`;
    if(cell==='b')out+=`<path d="M${a+SIZE} ${b}L${a+SIZE} ${b+SIZE}L${a} ${b+SIZE}Z" fill="${color}"/>`;
  }));
  return out;
}
function drawing(id,color){
  const s=AREA_SHAPES[id],w=s.kind==='tiles'?12:12,h=s.kind==='tiles'?Math.max(8,s.rows.length):8;
  return `<svg viewBox="0 0 ${w*SIZE} ${h*SIZE}" role="img" aria-label="Surface colorée sur quadrillage, figure à mesurer">${shapeBody(id,color)}${grid(w,h,s.triangles)}</svg>`;
}
function unitReference(item){
  const pair=item.unit===2,tri=item.unit==='trianglePair';
  const icon=pair?'<rect x="2" y="3" width="23" height="23"/><rect x="25" y="3" width="23" height="23"/>':tri?'<rect x="2" y="3" width="26" height="26"/><path d="M2 29L28 3" fill="none" stroke="#124a3b" stroke-width="2"/>':'<rect x="2" y="3" width="26" height="26"/>';
  $('unit').innerHTML=`<svg viewBox="0 0 52 32" aria-hidden="true" focusable="false" fill="#61bb92" stroke="#124a3b" stroke-width="2">${icon}</svg><strong>${pair?'2 petits carreaux = 1 u':tri?'2 petits triangles = 1 u':'1 carreau = 1 u'}</strong>`;
}
function updateSelection(){
  const item=AREA_ITEMS[index];
  [...$('figures').children].forEach((card,i)=>{
    const rank=selection.indexOf(LETTERS[i]);card.classList.toggle('selected',rank>=0);
    if(card.tagName==='BUTTON')card.setAttribute('aria-pressed',String(rank>=0));
    card.querySelector('.rank')?.remove();
    if(rank>=0&&item.kind==='order'){const badge=document.createElement('span');badge.className='rank';badge.textContent=String(rank+1);card.append(badge)}
  });
  if(item.kind==='order')$('selected-order').textContent=selection.length?'Ton ordre : '+selection.join(' → '):'Touche la figure qui a la plus petite aire.';
  if(item.kind==='multi')$('selected-order').textContent=selection.length?'Figures choisies : '+selection.join(', '):'Tu peux choisir plusieurs figures.';
  $('undo').disabled=!selection.length;
}
function select(i){
  if(answered)return;
  const item=AREA_ITEMS[index],letter=LETTERS[i];
  if(item.kind==='order'){if(!selection.includes(letter))selection.push(letter)}
  else if(item.kind==='multi'){selection=selection.includes(letter)?selection.filter(x=>x!==letter):[...selection,letter]}
  else selection=[letter];
  updateSelection();
}
function render(){
  const item=AREA_ITEMS[index];answered=false;selection=[];
  $('progress').textContent=`Défi ${index+1} / ${AREA_ITEMS.length} · Score : ${score}`;
  $('meter-fill').style.width=(index/AREA_ITEMS.length*100)+'%';
  $('task-kind').textContent=({number:'Mesurer',choice:'Comparer et raisonner',multi:'Retrouver plusieurs figures',order:'Classer'})[item.kind];
  $('question').textContent=item.prompt;
  $('instruction').textContent=item.kind==='order'?'Touche les figures dans l’ordre. Tu peux effacer ton dernier choix.':item.kind==='multi'?'Touche toutes les figures qui conviennent ; plusieurs réponses sont possibles.':item.kind==='number'?'Observe la figure et écris son aire avec l’unité indiquée.':'Observe les figures et choisis ta réponse.';
  unitReference(item);$('figures').replaceChildren();$('answer').replaceChildren();
  item.figures.forEach((id,i)=>{
    const clickable=(item.kind==='multi'&&!(i===0&&item.excludeReference))||item.kind==='order'||item.kind==='choice'&&!item.options;
    const card=document.createElement(clickable?'button':'div');card.className='area-card'+(clickable?' selectable':'')+(i===0&&item.excludeReference?' reference':'');
    if(clickable){card.type='button';card.setAttribute('aria-pressed','false');card.addEventListener('click',()=>select(i))}
    const label=document.createElement('strong');label.textContent=LETTERS[i];card.append(label);card.insertAdjacentHTML('beforeend',drawing(id,COLORS[i]));$('figures').append(card);
  });
  if(item.kind==='number'){
    const label=document.createElement('label');label.htmlFor='response';label.textContent='Aire en unités :';
    const input=document.createElement('input');input.id='response';input.type='number';input.min='0';input.step='1';input.inputMode='numeric';$('answer').append(label,input);
  }else if(item.options){
    const choices=document.createElement('div');choices.className='area-options';
    item.options.forEach(value=>{const button=document.createElement('button');button.type='button';button.textContent=value;button.setAttribute('aria-pressed','false');button.addEventListener('click',()=>{selection=[value];choices.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b===button)))});choices.append(button)});$('answer').append(choices);
  }else if(item.kind==='order'||item.kind==='multi'){
    const p=document.createElement('p');p.id='selected-order';p.className='selected-order';p.setAttribute('aria-live','polite');$('answer').append(p);updateSelection();
  }
  $('undo').classList.toggle('hidden',item.kind!=='order');$('undo').disabled=true;
  $('validate').classList.remove('hidden');$('next').classList.add('hidden');$('feedback').className='feedback hidden';$('feedback').replaceChildren();
}
function methodVisual(id){
  const shape=AREA_SHAPES[id],color='#218e75';if(!shape.method)return '';
  const outer='<rect x="0" y="0" width="240" height="160" fill="white"/>';
  let pieces='',text='';
  if(shape.method==='doubleTriangle'){
    const xs=shape.points.map(p=>p[0]),ys=shape.points.map(p=>p[1]);const x=Math.min(...xs),y=Math.min(...ys),w=Math.max(...xs)-x,h=Math.max(...ys)-y,cx=(x+w/2)*SIZE,cy=(y+h/2)*SIZE;
    const spin=`<animateTransform attributeName="transform" type="rotate" from="0 ${cx} ${cy}" to="180 ${cx} ${cy}" dur="1.2s" begin="0s" fill="freeze"/>`;
    pieces=`<rect x="${x*SIZE}" y="${y*SIZE}" width="${w*SIZE}" height="${h*SIZE}" fill="none" stroke="#b45326" stroke-width="2" stroke-dasharray="5 4"/>${shapeBody(id,color)}<polygon points="${poly(shape.points)}" fill="#f2a944" fill-opacity=".75" stroke="#ad6020" stroke-width="2">${spin}</polygon>`;
    text='Un second triangle identique complète le rectangle.';
  }else if(shape.method==='slideTriangle'){
    pieces=`<rect x="60" y="20" width="120" height="80" fill="none" stroke="#b45326" stroke-width="2" stroke-dasharray="5 4"/><polygon points="60,20 180,20 140,100 60,100" fill="${color}" fill-opacity=".75" stroke="${color}" stroke-width="2"/><polygon points="20,100 60,20 60,100" fill="#f2a944" stroke="#ad6020" stroke-width="2"><animateTransform attributeName="transform" type="translate" from="0 0" to="120 0" dur="1.2s" begin="0s" fill="freeze"/></polygon>`;
    text='La pointe de gauche glisse dans le vide à droite.';
  }else if(shape.method==='slideSemicircle'){
    pieces=`<rect x="20" y="20" width="160" height="100" fill="none" stroke="#b45326" stroke-width="2" stroke-dasharray="5 4"/><path d="M20 20H180V120H20V110A40 40 0 0 0 20 30Z" fill="${color}" fill-opacity=".75" stroke="${color}" stroke-width="2"/><path d="M180 30A40 40 0 0 1 180 110Z" fill="#f2a944" stroke="#ad6020" stroke-width="2"><animateTransform attributeName="transform" type="translate" from="0 0" to="-160 0" dur="1.2s" begin="0s" fill="freeze"/></path>`;
    text='Le demi-cercle de droite remplit exactement le creux de gauche.';
  }else if(shape.method==='slideTrapezoid'){
    const [[leftTop,top],[rightTop],[rightBottom,bottom],[leftBottom]]=shape.points;
    const dx=(leftBottom-rightTop)*SIZE;
    const fixed=[[leftBottom,bottom],[leftTop,top],[rightTop,top],[rightTop,bottom]];
    const moving=[[rightTop,top],[rightBottom,bottom],[rightTop,bottom]];
    pieces=`<rect x="${leftBottom*SIZE}" y="${top*SIZE}" width="${(rightTop-leftBottom)*SIZE}" height="${(bottom-top)*SIZE}" fill="none" stroke="#b45326" stroke-width="2" stroke-dasharray="5 4"/><polygon points="${poly(fixed)}" fill="${color}" fill-opacity=".75" stroke="${color}" stroke-width="2"/><g><animateTransform attributeName="transform" type="translate" from="0 0" to="${dx} ${(top+bottom)*SIZE}" dur="1.2s" begin="0s" fill="freeze"/><g><animateTransform attributeName="transform" type="scale" from="1 1" to="1 -1" dur="1.2s" begin="0s" fill="freeze"/><polygon points="${poly(moving)}" fill="#f2a944" stroke="#ad6020" stroke-width="2"/></g></g>`;
    text='La pointe de droite se retourne, puis rejoint celle de gauche pour former une bande rectangulaire.';
  }else if(shape.method==='diamondBox'){
    const xs=shape.points.map(p=>p[0]),ys=shape.points.map(p=>p[1]);const x=Math.min(...xs),y=Math.min(...ys),w=Math.max(...xs)-x,h=Math.max(...ys)-y;
    pieces=`${shapeBody(id,color)}<rect x="${x*SIZE}" y="${y*SIZE}" width="${w*SIZE}" height="${h*SIZE}" fill="none" stroke="#b45326" stroke-width="2" stroke-dasharray="5 4"/>`;
    text='Les quatre pointes blanches se rassemblent en une seconde moitié du rectangle.';
  }
  return `<div class="method-demo"><p>${text}</p><svg viewBox="0 0 240 160" role="img" aria-label="Correction visuelle : ${text}">${outer}${pieces}${grid()}</svg><button type="button" class="replay-method">Revoir le déplacement ↻</button></div>`;
}
function validate(){
  if(answered)return;
  const item=AREA_ITEMS[index];let value;
  if(item.kind==='number')value=$('response').value.trim();
  else if(item.kind==='multi')value=[...selection].sort().join('');
  else value=item.kind==='order'?selection.join(''):selection[0];
  if(!value||item.kind==='order'&&selection.length!==item.figures.length){$('feedback').className='feedback bad';$('feedback').textContent=item.kind==='order'?'Classe toutes les figures avant de vérifier.':'Choisis ou écris une réponse avant de vérifier.';return}
  const answer=expected(item),good=value===answer;answered=true;if(good)score++;
  const f=$('feedback');f.replaceChildren();f.className='feedback'+(good?'':' bad');
  const title=document.createElement('strong');title.textContent=good?'Bravo, ton raisonnement fonctionne !':'Regarde comment retrouver la réponse :';f.append(title);
  const detail=document.createElement('p');detail.textContent=item.figures.map((id,i)=>`${LETTERS[i]} : ${area(id,item)} u`).join(' · ');f.append(detail);
  const explanation=document.createElement('p');explanation.textContent=item.solution;f.append(explanation);
  if(item.kind==='order'){const order=document.createElement('p');order.textContent='Ordre attendu : '+answer.split('').join(' → ');f.append(order)}
  const demo=methodVisual(item.figures[0]);if(demo){const holder=document.createElement('div');holder.innerHTML=demo;f.append(holder);holder.addEventListener('click',event=>{if(event.target.closest('.replay-method'))holder.innerHTML=methodVisual(item.figures[0])})}
  [...$('figures').children].forEach((card,i)=>{const measure=document.createElement('span');measure.className='measurement';measure.textContent=`${area(item.figures[i],item)} u`;card.append(measure);if(card.tagName==='BUTTON')card.disabled=true});
  $('answer').querySelectorAll('input,button').forEach(el=>el.disabled=true);
  $('undo').classList.add('hidden');$('validate').classList.add('hidden');$('next').classList.remove('hidden');$('next').textContent=index===AREA_ITEMS.length-1?'Voir mon résultat':'Défi suivant →';
  f.scrollIntoView({behavior:'smooth',block:'nearest'});
}
function start(){index=0;score=0;$('intro').classList.add('hidden');$('end').classList.add('hidden');$('celebration').classList.add('hidden');$('play').classList.remove('hidden');render()}
function next(){if(index<AREA_ITEMS.length-1){index++;render();$('play').scrollIntoView({behavior:'smooth',block:'start'});return}$('play').classList.add('hidden');$('end').classList.remove('hidden');$('final').textContent=`${score} / ${AREA_ITEMS.length}`;$('summary').textContent=score===AREA_ITEMS.length?'Tu as réussi tous les défis d’aires !':'Tu peux rejouer pour essayer d’autres raisonnements.';if(typeof window.zoumaiTrackResult==='function')window.zoumaiTrackResult('Jardin des aires M2',score,AREA_ITEMS.length);if(score===AREA_ITEMS.length)$('celebration').classList.remove('hidden')}
document.addEventListener('DOMContentLoaded',()=>{
  $('start').addEventListener('click',start);$('again').addEventListener('click',start);$('validate').addEventListener('click',validate);$('next').addEventListener('click',next);
  $('undo').addEventListener('click',()=>{selection.pop();updateSelection()});$('close').addEventListener('click',()=>$('celebration').classList.add('hidden'));
  $('answer').addEventListener('keydown',event=>{if(event.key==='Enter'&&event.target.id==='response'){event.preventDefault();validate()}});
});
