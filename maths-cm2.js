'use strict';
const $=id=>document.getElementById(id), fmt=n=>n.toLocaleString('fr-FR'),rand=(a,b)=>a+Math.floor(Math.random()*(b-a+1)),pick=a=>a[rand(0,a.length-1)];
const q=(text,answer,why,opts=null,figure='')=>({text,answer:String(answer),why,opts,figure});
function shuffle(a){return a.sort(()=>Math.random()-.5)}
function options(answer,other){return shuffle([...new Set([String(answer),...other.map(String)])]).slice(0,4)}
function numberWords(n){const u=['zéro','un','deux','trois','quatre','cinq','six','sept','huit','neuf','dix','onze','douze','treize','quatorze','quinze','seize'];if(n<17)return u[n];if(n<20)return 'dix-'+u[n-10];if(n<70){let t=Math.floor(n/10),r=n%10,b=['','','vingt','trente','quarante','cinquante','soixante'][t];return b+(r===1?'-et-un':r?'-'+numberWords(r):'')}if(n<80)return 'soixante-'+(n===71?'et-':'')+numberWords(n-60);if(n<100)return 'quatre-vingt'+(n===80?'s':'-'+numberWords(n-80));let h=Math.floor(n/100),r=n%100;return (h===1?'cent':u[h]+'-cent'+(r?'':'s'))+(r?'-'+numberWords(r):'')}
function words(n){let m=Math.floor(n/1000),r=n%1000;return (m?(m===1?'mille':numberWords(m)+'-mille')+(r?'-':''):'')+(r?numberWords(r):'')}
function numberQuestion(){
let n=rand(10001,999999),type=rand(0,5),d=rand(0,5),place=[1,10,100,1000,10000,100000][d],digit=Math.floor(n/place)%10;
if(type===0)return q('Écris en chiffres : '+words(n)+'.',n,'Le nombre est '+fmt(n)+'.');
if(type===1)return q('Écris en lettres : '+fmt(n)+'.',words(n),'On sépare la classe des milliers de celle des unités simples.');
if(type===2)return q('Quel est le chiffre des '+['unités','dizaines','centaines','unités de mille','dizaines de milliers','centaines de milliers'][d]+' dans '+fmt(n)+' ?',digit,'À ce rang, le chiffre est '+digit+'.',options(digit,[rand(0,9),rand(0,9),rand(0,9)]));
if(type===3){let m=rand(10001,999999);return q('Compare '+fmt(n)+' et '+fmt(m)+'.',n>m?'>':n<m?'<':'=','On compare les chiffres de gauche à droite.', ['<','>','=']);}
if(type===4){let terms=[];for(let i=5;i>=0;i--){let p=10**i,c=Math.floor(n/p)%10;if(c)terms.push(fmt(c*p))}return q('Quel nombre correspond à '+terms.join(' + ')+' ?',n,'On additionne les valeurs de chaque chiffre : '+fmt(n)+'.');}
let thousands=Math.floor(n/1000);return q('Combien de milliers entiers contient '+fmt(n)+' ?',thousands,fmt(n)+' = '+thousands+' milliers et '+(n%1000)+' unités simples.');
}
function cells(coords){let set=new Set(coords.map(([x,y])=>x+','+y)),out='<svg class="figure" role="img" aria-label="Figure quadrillée" viewBox="0 0 270 190" width="270" height="190">';for(let y=0;y<5;y++)for(let x=0;x<7;x++)out+=`<rect x="${x*35+12}" y="${y*35+7}" width="35" height="35" fill="${set.has(x+','+y)?'#4caa91':'#fff'}" stroke="#7b9693"/>`;return out+'</svg>'}
function shape(count){let a=[];for(let y=0;y<5;y++)for(let x=0;x<7;x++)if(a.length<count)a.push([x,y]);return cells(a)}
function areaQuestion(){
let t=rand(0,4),a=rand(4,14),b=rand(4,14);
if(t===0)return q('Combien d’unités d’aire mesure la surface verte ?',a,'Chaque carreau vert vaut une unité d’aire.',options(a,[a-1,a+1,a+2]),shape(a));
if(t===1)return q('Quelle figure a la plus grande aire ?','B','On compare le nombre de carreaux, pas la longueur du contour.',['A','B','Même aire'],'<p>Figure A : '+a+' carreaux · Figure B : '+(a+2)+' carreaux.</p>');
if(t===2)return q('Une figure de 8 carreaux est découpée puis réassemblée sans perte. Quelle est sa nouvelle aire ?',8,'Découper et déplacer les morceaux ne change pas l’aire.',options(8,[6,10,16]));
if(t===3)return q('Que mesure le périmètre ?','La longueur du contour','Le périmètre est la longueur du contour ; l’aire est l’étendue de la surface.',['La longueur du contour','L’étendue de la surface','Le nombre de carreaux intérieurs']);
return q('Deux figures de formes différentes peuvent-elles avoir la même aire ?','Oui','Deux figures différentes peuvent contenir le même nombre d’unités d’aire.',['Oui','Non']);
}
function mentalQuestion(){
let t=rand(0,6),a=rand(2,9),b=rand(2,9),n=rand(100,95000);
if(t===0)return q('Calcule : '+a+' × '+b+' = ?',a*b,'On utilise la table de '+a+'.');
if(t===1)return q('Complète : '+a+' × … = '+a*b,b,a*b+' ÷ '+a+' = '+b+'.');
if(t===2)return q('Combien de fois '+a+' dans '+a*b+' ?',b,a*b+' ÷ '+a+' = '+b+'.');
if(t===3){let step=pick([10,100,1000]),v=n+step;return q('Complète la suite : '+fmt(n)+' ; '+fmt(v)+' ; …',v+step,'On ajoute '+fmt(step)+' à chaque étape.');}
if(t===4){let step=pick([10,100,1000]);return q('Calcule : '+fmt(n)+' + '+fmt(step)+' = ?',n+step,'On ajoute '+fmt(step)+' au nombre de départ.');}
if(t===5){let factor=pick([10,100,1000]),base=rand(2,Math.floor(999999/factor));return q('Calcule : '+fmt(base)+' × '+fmt(factor)+' = ?',base*factor,'Multiplier par '+fmt(factor)+' décale les chiffres vers la gauche.');}
let x=rand(10,90),y=rand(2,9);return q('Nombre mystère : je lui ajoute '+y+' et j’obtiens '+(x+y)+'. Quel est-il ?',x,'On calcule '+(x+y)+' − '+y+' = '+x+'.');
}
const generators={nombres:numberQuestion,aires:areaQuestion,mental:mentalQuestion};
let mode=document.body.dataset.game,questions=[],index=0,score=0,answered=false;
function start(){questions=Array.from({length:20},()=>generators[mode]());index=0;score=0;$('intro').classList.add('hidden');$('end').classList.add('hidden');$('play').classList.remove('hidden');render()}
function render(){answered=false;let x=questions[index];$('progress').textContent='Question '+(index+1)+'/20 · Score : '+score;$('question').textContent=x.text;$('figure').innerHTML=x.figure;$('feedback').classList.add('hidden');$('next').classList.add('hidden');$('validate').classList.remove('hidden');let c=$('answer');c.innerHTML='';if(x.opts){let div=document.createElement('div');div.className='choices';x.opts.forEach((o,i)=>{let label=document.createElement('label'),input=document.createElement('input');input.type='radio';input.name='answer';input.value=o;label.append(input,document.createTextNode(' '+o));div.append(label)});c.append(div)}else{let input=document.createElement('input');input.type='text';input.id='response';input.autocomplete='off';input.setAttribute('aria-label','Ta réponse');c.append(input);input.focus()}}
function normalize(s){return String(s).trim().toLocaleLowerCase('fr').replace(/[\u202f\u00a0\s-]/g,'').replace(/[’']/g,'').normalize('NFD').replace(/[\u0300-\u036f]/g,'')}
function validate(){if(answered)return;let x=questions[index],selected=document.querySelector('input[name=answer]:checked'),input=$('response'),v=selected?selected.value:input?input.value:'';if(!v.trim()){alert('Choisis ou écris une réponse.');return}answered=true;let good=normalize(v)===normalize(x.answer);if(good)score++;$('feedback').className='feedback'+(good?'':' bad');$('feedback').textContent=(good?'Bravo ! ':'Pas encore. La réponse attendue est « '+x.answer+' ». ')+x.why;$('validate').classList.add('hidden');$('next').classList.remove('hidden');$('next').textContent=index===19?'Voir mon résultat':'Question suivante';document.querySelectorAll('#answer input').forEach(el=>el.disabled=true)}
function next(){if(index<19){index++;render();return}$('play').classList.add('hidden');$('end').classList.remove('hidden');$('final').textContent=score+'/20';$('summary').textContent=score===20?'Sans faute !': 'Tu peux rejouer pour progresser.';if(score===20)$('celebration').classList.remove('hidden')}
document.addEventListener('DOMContentLoaded',()=>{$('start').onclick=start;$('validate').onclick=validate;$('next').onclick=next;$('again').onclick=start;$('close').onclick=()=>$('celebration').classList.add('hidden');document.addEventListener('keydown',e=>{if(e.key==='Enter'&&!$('play').classList.contains('hidden')){if(!answered)validate();else next()}})});
