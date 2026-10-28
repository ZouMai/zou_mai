// Enrichissement reproductible à partir de la classification GBIF déjà importée.
// Aucune caractéristique morphologique n'est inférée d'un nom commun.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const dir=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../data');
const file=process.argv[2]||path.join(dir,'animals.json');
const a=JSON.parse(fs.readFileSync(file,'utf8'));
const groups=[
 ['family','Felidae','felid','Est-ce un félin, comme le chat, le lion ou le tigre ?','félin','felin'],
 ['family','Canidae','canid','Est-ce un canidé, comme le chien, le loup ou le renard ?','canidé','canide'],
 ['family','Equidae','equid','Est-ce un équidé, comme le cheval, l’âne ou le zèbre ?','équidé','equide'],
 ['family','Bovidae','bovid','Est-ce un bovidé, comme la vache, la chèvre ou une antilope ?','bovidé','bovide'],
 ['family','Cervidae','cervid','Est-ce un cervidé, comme le cerf, le chevreuil ou le renne ?','cervidé','cervide'],
 ['family','Ursidae','bear','Appartient-il à la famille des ours ?','ursidé','ours|urside'],
 ['family','Mustelidae','mustelid','Est-ce un mustélidé, comme la loutre, la belette ou le blaireau ?','mustélidé','mustelide'],
 ['family','Hominidae','greatApe','Est-ce un grand singe, comme le chimpanzé, le gorille ou l’orang-outan ?','grand singe','grand singe'],
 ['family','Elephantidae','elephant','Appartient-il à la famille des éléphants ?','éléphantidé','elephantide'],
 ['family','Rhinocerotidae','rhino','Appartient-il à la famille des rhinocéros ?','rhinocérotidé','rhinocerotide'],
 ['family','Suidae','pig','Appartient-il à la famille du porc et du sanglier ?','suidé','suide'],
 ['family','Leporidae','rabbit','Est-il de la famille des lapins et des lièvres ?','léporidé','leporide'],
 ['family','Sciuridae','squirrel','Est-il de la famille des écureuils et des marmottes ?','sciuridé','sciuride'],
 ['family','Delphinidae','dolphin','Est-il de la famille des dauphins océaniques, qui comprend aussi l’orque ?','delphinidé','delphinide'],
 ['family','Phocidae','seal','Est-ce un phoque ?','phocidé','phoque|phocide'],
 ['family','Otariidae','seaLion','Est-ce une otarie ?','otariidé','otarie|otariide'],
 ['order','Primates','primate','Est-ce un primate, comme les singes ou les lémuriens ?','primate','primate'],
 ['order','Rodentia','rodent','Est-ce un rongeur ?','rongeur','rongeur'],
 ['order','Chiroptera','bat','Est-ce une chauve-souris ?','chiroptère','chauve souris|chiroptere'],
 ['family','Anatidae','duck','Est-il de la famille des canards, des oies et des cygnes ?','anatidés','anatide'],
 ['family','Spheniscidae','penguin','Est-ce un manchot ?','sphéniscidés','manchot'],
 ['family','Strigidae','owl','Est-il de la famille des chouettes et hiboux, hors effraies ?','strigidés','strigide'],
 ['family','Accipitridae','raptor','Est-il de la famille des aigles, buses et éperviers ?','accipitridés','accipitride'],
 ['family','Falconidae','falcon','Est-il de la famille des faucons ?','falconidés','falconide'],
 ['family','Picidae','woodpecker','Est-ce un pic, l’oiseau qui frappe les arbres de son bec ?','picidés','picide'],
 ['family','Corvidae','corvid','Est-il de la famille des corbeaux, corneilles et pies ?','corvidés','corvide'],
 ['family','Columbidae','pigeon','Est-il de la famille des pigeons et tourterelles ?','columbidés','columbide'],
 ['family','Phasianidae','pheasant','Est-il de la famille des faisans, perdrix, paons et poules ?','phasianidés','phasianide'],
 ['family','Paridae','tit','Est-ce une mésange ?','paridés','mesange'],
 ['family','Salmonidae','salmon','Est-il de la famille des saumons et des truites ?','salmonidés','salmonide'],
 ['order','Odonata','dragonfly','Ton animal appartient-il au groupe des libellules et des demoiselles ?','odonate','libellule|demoiselle|odonate'],
 ['order','Lepidoptera','butterfly','Est-ce un papillon, de jour ou de nuit ?','lépidoptère','papillon|lepidoptere'],
 ['order','Coleoptera','beetle','Est-ce un coléoptère, comme la coccinelle ou le scarabée ?','coléoptère','coleoptere'],
 ['order','Diptera','fly','Est-ce un diptère, comme la mouche ou le moustique ?','diptère','diptere'],
 ['order','Hymenoptera','hymenopteran','Est-ce un hyménoptère, comme une abeille, une guêpe ou une fourmi ?','hyménoptère','hymenoptere'],
 ['family','Formicidae','ant','Est-ce une fourmi ?','formicidé','fourmi|formicide'],
 ['family','Apidae','bee','Est-il de la famille des abeilles domestiques et des bourdons ?','apidé','apide'],
 ['order','Araneae','spider','Est-ce une araignée ?','aranéide (ordre)','araignee'],
 ['order','Scorpiones','scorpion','Est-ce un scorpion ?','scorpion','scorpion'],
 ['order','Testudines','turtle','Est-ce une tortue ?','chélonien','tortue|chelonien'],
 ['order','Crocodylia','crocodilian','Est-ce un crocodilien, comme un crocodile ou un alligator ?','crocodilien','crocodilien'],
 ['order','Anura','frog','Est-ce une grenouille ou un crapaud ?','anoure','anoure|grenouille|crapaud'],
 ['order','Caudata','salamander','Est-il du groupe des salamandres et des tritons ?','urodèle','urodele'],
 ['class','Cephalopoda','cephalopod','Est-ce un céphalopode, comme une pieuvre, une seiche ou un calmar ?','céphalopode','cephalopode'],
 ['class','Gastropoda','gastropod','Est-ce un gastéropode, comme un escargot ou une limace ?','gastéropode','gasteropode'],
 ['class','Bivalvia','bivalve','Est-ce un bivalve, comme une moule, une huître ou une palourde ?','bivalve','bivalve'],
];
let extras=JSON.parse(fs.readFileSync(path.join(dir,'questions-extra.json'),'utf8')).filter(q=>!q.taxonomic);
for(const [rank,value,id,text,term,pattern]of groups){
 if(!a.some(x=>x.classification?.[rank]===value))continue;
 const matching=a.filter(x=>x.classification?.[rank]===value);const implies={};
 for(const key of ['mammal','bird','reptile','amphibian','fish','insect','arachnid','mollusc','crustacean','vertebrate']){const v=matching[0].traits[key];if(typeof v==='boolean'&&matching.every(x=>x.traits[key]===v))implies[key]=v;}
 extras.push({id,text,term,pattern,implies,family:'taxonomy-'+rank,taxonomic:true,rank,taxon:value,explanation:`Ce critère utilise la classification scientifique (${value}). Un groupe rassemble des animaux apparentés, pas seulement des animaux qui se ressemblent.`});
 for(const x of a){const v=x.classification?.[rank];x.traits[id]=v?v===value:null;if(v)x.traitSources[id]={source:x.sources.find(s=>s.url?.includes('gbif.org'))?.url,method:`GBIF ${rank} equality`};}
}
const level={class:1,order:2,family:3};
for(const q of extras.filter(x=>x.taxonomic)){
 const members=a.filter(x=>x.classification?.[q.rank]===q.taxon);
 for(const ancestor of extras.filter(x=>x.taxonomic&&level[x.rank]<level[q.rank])){
  const values=members.map(x=>x.classification?.[ancestor.rank]);
  if(values.every(Boolean)&&values.every(v=>v===values[0]))q.implies[ancestor.id]=values[0]===ancestor.taxon;
 }
 if(q.implies.mammal===true||q.implies.bird===true){
  for(const key of ['eggs','liveBirth']){const values=members.map(x=>x.traits[key]);if(values.every(v=>typeof v==='boolean'&&v===values[0]))q.implies[key]=values[0];}
 }
}
fs.writeFileSync(file,JSON.stringify(a,null,2));fs.writeFileSync(path.join(dir,'questions-extra.json'),JSON.stringify(extras,null,2));console.log(`Taxonomie : ${extras.filter(q=>q.taxonomic).length} questions ajoutées, ${a.length} fiches.`);
