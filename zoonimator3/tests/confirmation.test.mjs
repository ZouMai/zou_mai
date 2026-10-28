import test from 'node:test';
import assert from 'node:assert/strict';
// Minimal DOM harness: exercises the real app event handlers, not a copy.
class Element{
 constructor(tag='div'){this.tag=tag;this.children=[];this.value='';this.classList={add(){},remove(){},toggle(){}};}
 append(...items){this.children.push(...items);}
 replaceChildren(...items){this.children=items;}
 setAttribute(){} focus(){} addEventListener(){}
 get textContent(){return this.text||'';} set textContent(t){this.text=t;}
}
const nodes=new Map();globalThis.document={getElementById:id=>{if(!nodes.has(id))nodes.set(id,new Element());return nodes.get(id);},createElement:t=>new Element(t),createTextNode:t=>({textContent:t}),body:new Element()};
const animal={id:'dragonfly',name:'Anax de juin',scientificName:'Anax junius',playable:true,traits:{},facts:[],sources:[]};
globalThis.fetch=async url=>({ok:true,json:async()=>url.includes('animals')?[animal]:[]});
let recognition;globalThis.SpeechRecognition=class {constructor(){recognition=this;}start(){}abort(){}};
await import('../app.mjs');
const node=id=>nodes.get(id);
function find(text,e=node('stage')){if(e.textContent===text)return e;for(const c of e.children||[]){const found=find(text,c);if(found)return found;}}
for(const channel of ['button','keyboard','voice-transcript'])test('confirmation finale par '+channel+' termine la partie et ignore les entrées suivantes',()=>{
 node('restart').onclick();assert.ok(find('Je pense que tu as choisi : Anax de juin !'));
 assert.equal(node('voiceArea').hidden,false);
 if(channel==='button')find('Oui, tu as trouvé !').onclick();
 else if(channel==='keyboard'){node('transcript').value='oui';node('transcript').onkeydown({key:'Enter'});}
 else {node('microphone').onclick();recognition.onresult({results:[[{transcript:'Oui !'}]]});assert.equal(node('transcript').value,'Oui !');node('sendVoice').onclick();}
 assert.ok(find('MYSTÈRE RÉSOLU'));assert.equal(node('voiceArea').hidden,true);
 node('transcript').value='non';node('sendVoice').onclick();assert.ok(find('MYSTÈRE RÉSOLU'));
});
