// Run: node zoonimator3/tests/simulate.mjs [sample size, default 150]
// Fixtures are never added to the zoological catalogue. The oracle is the
// frozen dataset, so these simulations test the engine, NOT biological truth.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {Engine} from '../engine.mjs';
import {QUESTIONS} from '../questions.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const base=JSON.parse(fs.readFileSync(process.env.ZOONIMATOR_DATA_FILE||path.join(root,'data/animals.json'),'utf8'));
const all=Array.isArray(base)?base:base.animals;
let extra=[];const ep=path.join(root,'data/questions-extra.json');if(fs.existsSync(ep))extra=JSON.parse(fs.readFileSync(ep,'utf8'));
const questions=[...QUESTIONS,...extra.filter(q=>!QUESTIONS.some(b=>b.id===q.id))];
const animals=all.filter(a=>a.playable===true);
if(!animals.length)throw new Error('No playable animals; simulations cannot claim success.');
const size=Math.min(animals.length,Math.max(100,Number(process.argv[2])||150));
const normalize=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const requested=['bos taurus','equus caballus','felis catus','canis lupus familiaris','canis familiaris','tursiops truncatus','carcharodon carcharias','ornithorhynchus anatinus','pipistrellus pipistrellus','anax imperator','libellula depressa','anax junius'];
let sample=animals.filter(a=>requested.includes(normalize(a.scientificName)));
const groups=new Map();for(const a of animals){const k=a.group||'unknown';if(!groups.has(k))groups.set(k,[]);groups.get(k).push(a);}
let i=0;while(sample.length<size){let added=0;for(const group of groups.values()){const a=group[i];if(a&&!sample.includes(a)){sample.push(a);added++;if(sample.length===size)break;}}if(!added&&[...groups.values()].every(g=>g.length<=i))break;i++;}
const duplicateBy=key=>{const m=new Map();for(const a of all){const k=normalize(a[key]);if(!k)continue;if(!m.has(k))m.set(k,[]);m.get(k).push(a.id);}return [...m].filter(([,v])=>v.length>1).map(([value,ids])=>({value,ids}));};
const signatures=new Map();for(const a of animals){const signature=questions.map(q=>a.traits?.[q.id]===true?'1':a.traits?.[q.id]===false?'0':'?').join('');if(!signatures.has(signature))signatures.set(signature,[]);signatures.get(signature).push(a.name);}
const audit={total:all.length,playable:animals.length,questionCount:questions.length,duplicateIds:duplicateBy('id'),duplicateNames:duplicateBy('name'),duplicateScientificNames:duplicateBy('scientificName'),missingFrenchNames:all.filter(a=>!a.name?.trim()).map(a=>a.id),missingScientificNames:all.filter(a=>!a.scientificName?.trim()).map(a=>a.id),missingClassification:all.filter(a=>!a.classification||!Object.keys(a.classification).length).map(a=>a.id),withoutReferences:all.filter(a=>!a.sources?.length).map(a=>a.id),photos:all.filter(a=>a.photo?.src).length,photosWithCredits:all.filter(a=>a.photo?.src&&a.photo.credit&&a.photo.license&&a.photo.source).length,indistinguishableProfiles:[...signatures.values()].filter(v=>v.length>1),requiredAnimalsMissing:[['vache','bos taurus'],['cheval','equus caballus'],['chat','felis catus'],['chien','canis lupus familiaris','canis familiaris'],['dauphin','tursiops truncatus'],['requin','carcharodon carcharias'],['chauve-souris','pipistrellus pipistrellus'],['ornithorynque','ornithorhynchus anatinus'],['libellule','anax junius','anax imperator','libellula depressa']].filter(g=>!g.slice(1).some(s=>animals.some(a=>normalize(a.scientificName)===s))).map(g=>g[0])};
const errors=[];
function play(target,scenario){
 const e=new Engine(animals,questions),guesses=[],trace=[];let errorInjected=false,unknownInjected=0,probablyInjected=0;
 for(let iteration=0;iteration<35&&guesses.length<3;iteration++){
  const next=e.next();const proposal=e.proposal()||(!next||e.history.length>=30?e.rank()[0]:null);
  if(proposal){
   const correct=proposal.animal.id===target.id;guesses.push({id:proposal.animal.id,name:proposal.animal.name,confidence:proposal.p,questions:e.history.length,correct,threshold:e.proposal()!==null});
   if(correct)break;
   e.reject(proposal.animal.id);continue;
  }
  if(!next)break;
  if(e.asked.has(next.id)||e.inferred.has(next.id))errors.push({target:target.id,scenario,question:next.id,error:'redundant or deduced question'});
  if(next.family==='diet'&&trace.some(t=>t.family==='diet'))errors.push({target:target.id,scenario,error:'second diet question'});
  const v=target.traits?.[next.id];let answer=v===true?'yes':v===false?'no':'unknown';
  if(scenario==='one_error'&&!errorInjected&&answer!=='unknown'&&e.history.length>=2){answer=answer==='yes'?'no':'yes';errorInjected=true;}
  if(scenario==='unknown_20pct'&&answer!=='unknown'&&e.history.length%5===2){answer='unknown';unknownInjected++;}
  if(scenario==='uncertain_33pct'&&answer!=='unknown'&&e.history.length%3===1){answer=answer==='yes'?'probably':'unlikely';probablyInjected++;}
  trace.push({question:next.id,family:next.family,answer,oracle:v??null});e.answer(next.id,answer);
  if(e.weights.some(w=>!Number.isFinite(w)||w<0))errors.push({target:target.id,scenario,error:'invalid probability'});
  if(!e.rejected.has(target.id)&&!e.rank().some(x=>x.animal.id===target.id))errors.push({target:target.id,scenario,error:'true animal eliminated by answer'});
 }
 return {id:target.id,name:target.name,scientificName:target.scientificName,scenario,questions:e.history.length,firstGuessCorrect:guesses[0]?.correct===true,recoveredWithin3:guesses.some(g=>g.correct),guesses,errorInjected,unknownInjected,probablyInjected,trace};
}
const results=[];for(const scenario of ['clean','one_error','unknown_20pct','uncertain_33pct']){for(const a of sample)results.push(play(a,scenario));console.log('Completed',scenario,sample.length,'animals');}
const quantile=(v,p)=>v.slice().sort((a,b)=>a-b)[Math.floor((v.length-1)*p)]||0;
const summary=Object.fromEntries(['clean','one_error','unknown_20pct','uncertain_33pct'].map(s=>{const r=results.filter(x=>x.scenario===s);return [s,{games:r.length,firstGuessCorrect:r.filter(x=>x.firstGuessCorrect).length,firstGuessRate:r.filter(x=>x.firstGuessCorrect).length/r.length,recoveredWithin3:r.filter(x=>x.recoveredWithin3).length,recoveryRate:r.filter(x=>x.recoveredWithin3).length/r.length,meanQuestions:r.reduce((n,x)=>n+x.questions,0)/r.length,medianQuestions:quantile(r.map(x=>x.questions),.5),p90Questions:quantile(r.map(x=>x.questions),.9),maxQuestions:Math.max(...r.map(x=>x.questions)),injectedErrors:r.filter(x=>x.errorInjected).length}];}));
const report={generatedAt:new Date().toISOString(),method:'Deterministic oracle from the same frozen traits; no claim of independent zoological validation or human play-test. Uniform priors, actual Engine.proposal() threshold; forced uncertain proposal only at no remaining question or 30 questions. At most 3 guesses, each rejected explicitly before continuation.',audit,sampleSize:sample.length,gameCount:results.length,summary,invariantErrors:errors,results};
fs.writeFileSync(path.join(root,'tests/simulation-report.json'),JSON.stringify(report,null,2)+'\n');
const pct=n=>(100*n).toFixed(1)+' %';
let md=`# Zoonimator 3 — rapport de simulation\n\n${all.length} fiches présentes ; ${animals.length} jouables. ${sample.length} animaux distincts testés, ${results.length} parties simulées.\n\n**Limite :** les réponses sont produites depuis la même base que le moteur. Ces tests mesurent la déduction et sa robustesse, pas la véracité biologique ni l’usage par des enfants.\n\n| Scénario | Première proposition correcte | Trouvé en ≤ 3 propositions | Questions moyennes | Médiane | P90 |\n|---|---:|---:|---:|---:|---:|\n`;
for(const [s,r]of Object.entries(summary))md+=`| ${s} | ${r.firstGuessCorrect}/${r.games} (${pct(r.firstGuessRate)}) | ${r.recoveredWithin3}/${r.games} (${pct(r.recoveryRate)}) | ${r.meanQuestions.toFixed(1)} | ${r.medianQuestions} | ${r.p90Questions} |\n`;
md+=`\nLe scénario une erreur inverse la première réponse connue après deux questions. Les autres scénarios rendent une réponse sur cinq inconnue ou une sur trois probable. Une proposition de faible confiance est autorisée uniquement à l’épuisement des questions ou après 30 questions.\n\n## Audit automatique\n\n- Doublons d’identifiants : ${audit.duplicateIds.length}.\n- Doublons de noms scientifiques : ${audit.duplicateScientificNames.length}.\n- Noms français manquants : ${audit.missingFrenchNames.length}.\n- Classifications manquantes : ${audit.missingClassification.length}.\n- Fiches sans références : ${audit.withoutReferences.length}.\n- Photographies : ${audit.photos}, dont ${audit.photosWithCredits} avec les quatre champs src/crédit/licence/source. Ce contrôle de métadonnées n’est pas une validation visuelle.\n- Groupes de profils indiscernables : ${audit.indistinguishableProfiles.length}.\n- Violations des invariants pendant les parties : ${errors.length}.\n\n## Animaux imposés\n\n| Animal | Première proposition correcte, sans erreur | Questions | Avec une erreur, retrouvé en ≤ 3 propositions |\n|---|---:|---:|---:|\n`;
for(const a of sample.filter(a=>requested.includes(normalize(a.scientificName)))){const c=results.find(r=>r.id===a.id&&r.scenario==='clean'),e=results.find(r=>r.id===a.id&&r.scenario==='one_error');md+=`| ${a.name} | ${c.firstGuessCorrect?'oui':'non'} | ${c.questions} | ${e.recoveredWithin3?'oui':'non'} |\n`;}
md+='\nLes traces, propositions, probabilités et profils indiscernables sont conservés dans `simulation-report.json`.\n';
fs.writeFileSync(path.join(root,'tests/report.md'),md);console.log(JSON.stringify({audit:{total:audit.total,playable:audit.playable,indistinguishableProfiles:audit.indistinguishableProfiles.length},summary,invariantErrors:errors.length},null,2));
if(errors.length||audit.duplicateIds.length||audit.missingFrenchNames.length)process.exitCode=1;
