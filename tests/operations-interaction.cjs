const fs=require('node:fs'),assert=require('node:assert/strict');
const {JSDOM}=require('jsdom');
const html=fs.readFileSync('operations-posees.html','utf8');
let passed=0;
function test(name,fn){try{fn();passed++;console.log('OK',name)}catch(e){console.error('ECHEC',name,e.message);process.exitCode=1}}
function session(op,level,method){
 const dom=new JSDOM(html,{runScripts:'dangerously',url:'https://zoumai.github.io/zou_mai/operations-posees.html'});
 const d=dom.window.document;
 d.querySelector('.opChoice[data-op="'+op+'"]').click();
 d.getElementById('prepLevel').value=String(level);
 if(method)d.querySelector('input[name="prepMethod"][value="'+method+'"]').checked=true;
 d.getElementById('prepStart').click();
 return {d,dom};
}
function write(d,row,text){
 const cells=[...d.querySelectorAll('td[data-k^="'+row+'-"]')];
 const raw=text.replace(',','');
 assert(raw.length<=cells.length);
 const start=cells.length-raw.length;
 for(let i=0;i<raw.length;i++){cells[start+i].dataset.value=raw[i];cells[start+i].textContent=raw[i]}
 if(text.includes(',')){const decimal=text.split(',')[1].length;cells[cells.length-decimal].dataset.comma='true'}
}
function fill(d,wrong){const task=d.getElementById('task').textContent;const nums=[...task.matchAll(/\d+(?:,\d+)?/g)].map(m=>Number(m[0].replace(',','.')));const op=task.includes('＋')?'+':'-';const decimals=Number(d.getElementById('level').value)>=4;const places=decimals?(d.getElementById('level').value==='4'?1:2):0;
 nums.forEach((n,i)=>write(d,'t'+i,n.toFixed(places).replace('.',',')));
 const result=op==='+'?nums.reduce((a,b)=>a+b,0):nums[0]-nums[1];
 write(d,'res',wrong===undefined?result.toFixed(places).replace('.',','):wrong);
 return {nums,result};
}
for(const op of ['+','-'])for(const level of [1,2,3,4,5]){
 test(op+' palier '+level+' pose correcte',()=>{const {d}=session(op,level);fill(d);d.getElementById('check').click();const feedback=d.getElementById('feedback').textContent;assert(!feedback.includes('mal posée'),feedback)});
 test(op+' palier '+level+' erreur de résultat',()=>{const {d}=session(op,level);fill(d,'999999');d.getElementById('check').click();assert(d.getElementById('feedback').classList.contains('error'))});
}
test('virgule manquante',()=>{const {d}=session('+',4);fill(d);const cell=d.querySelector('td[data-k^="res-"][data-comma]');assert(cell);delete cell.dataset.comma;d.getElementById('check').click();assert(d.getElementById('feedback').classList.contains('error'))});
test('changement de méthode',()=>{const {d}=session('-',2,'constant');assert.equal(d.getElementById('method').value,'constant')});
console.log('Tests réussis:',passed);
