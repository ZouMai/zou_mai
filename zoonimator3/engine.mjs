import {IMPLIES} from './questions.mjs';
const entropy=p=>p<=0||p>=1?0:-p*Math.log2(p)-(1-p)*Math.log2(1-p);
export const ANSWERS={yes:1,no:0,probably:.75,unlikely:.25,unknown:.5};
export class Engine {
 constructor(animals,questions){this.animals=animals;this.questions=questions;this.history=[];this.rejected=new Set();this.recompute();}
 recompute(){
  this.asked=new Set();this.inferred=new Map();this.usedFamilies=new Set();
  // A mixture over the hypotheses "no error" and "one answer was mistaken".
  // No answer ever gives an animal zero likelihood.
  this.weights=this.animals.map(a=>{
   let terms=this.history.map(h=>{
    const trait=a.traits[h.id],r=ANSWERS[h.answer];
    if(trait!==true&&trait!==false||r===.5)return .5;
    return .12+.76*(trait?r:1-r);
   });
   let log=terms.reduce((s,p)=>s+Math.log(p),0);
   const informed=this.history.map((h,i)=>({h,i})).filter(({h})=>ANSWERS[h.answer]!==.5);
   let correction=0;
   for(const {i} of informed)correction+=(1-terms[i])/terms[i];
   const mixture=.75+(informed.length?.25*correction/informed.length:0.25);
   return this.rejected.has(a.id)?-Infinity:log+Math.log(mixture);
  });
  for(const h of this.history){
   this.asked.add(h.id);
   const q=this.questions.find(q=>q.id===h.id);
   // Avoid successive reformulations of diet, even after a negative answer.
   if(q?.family==='diet')this.usedFamilies.add('diet');
   if(h.answer==='yes'||h.answer==='no'){
    const pending=[[h.id,h.answer==='yes']],seen=new Set();
    while(pending.length){const [key,val]=pending.pop();if(seen.has(key))continue;seen.add(key);
     this.inferred.set(key,val);
     for(const [k,v]of Object.entries(IMPLIES[key]?.[val?'yes':'no']||{}))pending.push([k,v]);
     const meta=this.questions.find(x=>x.id===key);
     if(val&&meta?.taxonomic){
      for(const sibling of this.questions.filter(x=>x.taxonomic&&x.rank===meta.rank&&x.id!==key))pending.push([sibling.id,false]);
      for(const [k,v]of Object.entries(meta.implies||{}))pending.push([k,v]);
     }
    }
   }
  }
  // A taxon whose documented ancestors contradict an established answer is already ruled out as a question.
  for(const q of this.questions.filter(x=>x.taxonomic)){
   if(Object.entries(q.implies||{}).some(([key,val])=>this.inferred.has(key)&&this.inferred.get(key)!==val))this.inferred.set(q.id,false);
  }
  let max=Math.max(...this.weights);
  this.weights=this.weights.map(x=>Number.isFinite(max)?Math.exp(x-max):0);
  const sum=this.weights.reduce((a,b)=>a+b,0);
  this.weights=this.weights.map(x=>sum?x/sum:0);
 }
 rank(){return this.animals.map((animal,i)=>({animal,p:this.weights[i]})).filter(x=>x.p>0).sort((a,b)=>b.p-a.p);}
 next(){
  let best=null;
  const signatures=this.history.filter(h=>h.answer!=='unknown').map(h=>this.animals.map(a=>a.traits[h.id]===true?'1':a.traits[h.id]===false?'0':'?').join(''));

  for(const q of this.questions){
   if(this.asked.has(q.id)||this.inferred.has(q.id)||this.usedFamilies.has(q.family))continue;
   const signature=this.animals.map(a=>a.traits[q.id]===true?'1':a.traits[q.id]===false?'0':'?').join('');
   if(signatures.includes(signature))continue;
   if(!signature.includes('?')&&signatures.some(s=>!s.includes('?')&&s===signature.replace(/[01]/g,c=>c==='1'?'0':'1')))continue;
   let prediction=0,expected=0,known=0,yes=0,no=0;
   for(let i=0;i<this.animals.length;i++){
    const v=this.animals[i].traits[q.id],w=this.weights[i];
    const p=v===true?.88:v===false?.12:.5;
    prediction+=w*p;expected+=w*entropy(p);
    if(v===true){yes+=w;known+=w;}else if(v===false){no+=w;known+=w;}
   }
   // A documented trait can provide evidence even when other fiches are incomplete.
   // Coverage penalizes missing information; missing is never a negative answer.
   if(known<.20)continue;
   const gain=(entropy(prediction)-expected)*known;
   if(!best||gain>best.gain+1e-12)best={...q,gain,coverage:known};
  }
  return best&&best.gain>.001?best:null;
 }
 answer(id,answer){
  if(!Object.hasOwn(ANSWERS,answer)||!this.questions.some(q=>q.id===id)||this.asked.has(id))throw new Error('Réponse invalide ou question déjà posée.');
  this.history.push({id,answer});this.recompute();
 }
 undo(){this.history.pop();this.recompute();}
 reject(id){this.rejected.add(id);this.recompute();}
 proposal(){const r=this.rank();if(!r.length)return null;
  const n=this.history.filter(h=>h.answer!=='unknown').length;
  if(n>=5&&r[0].p>=.85&&r[0].p/Math.max(r[1]?.p||0,1e-12)>=5)return r[0];
  return null;
 }
 evidence(animal){return this.history.filter(h=>h.answer!=='unknown'&&animal.traits[h.id]!=null).map(h=>({question:this.questions.find(q=>q.id===h.id),answer:h.answer,value:animal.traits[h.id],matches:(ANSWERS[h.answer]>.5)===animal.traits[h.id]}));}
}
