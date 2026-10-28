#!/usr/bin/env python3
"""Build fixed, source-traceable Zoonimator data. Network used at build time only.
Missing traits remain null. ADW keyword absence is NOT interpreted as false.
ADW images are copied only when a Creative Commons license is explicitly stated.
"""
import json,re,html,time,hashlib,urllib.request,urllib.parse,concurrent.futures
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]; CACHE=Path('/tmp/zoonimator-sources');CACHE.mkdir(exist_ok=True)
OUT=ROOT/'data';(OUT/'photos').mkdir(parents=True,exist_ok=True)
BASE='https://api.gbif.org/v1/'; ADW='https://animaldiversity.org'
def get(u,binary=False):
 p=CACHE/(hashlib.sha256(u.encode()).hexdigest()+('.bin' if binary else '.txt'))
 if p.exists():return p.read_bytes() if binary else p.read_text()
 for n in range(2):
  try:
   req=urllib.request.Request(u,headers={'User-Agent':'ZoonimatorEducationalDataBuilder/3.0 (source verification)'})
   b=urllib.request.urlopen(req,timeout=25).read();p.write_bytes(b);return b if binary else b.decode()
  except Exception:
   if n==1:return None
   time.sleep(.3)
def text(s):return re.sub(r'\s+',' ',html.unescape(re.sub('<[^>]+>',' ',s))).strip()
def dump(path,x):path.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n')
KEYWORDS={
 'aquatic':'aquatic','saltwater or marine':'marine','freshwater':'freshwater','forest':'forest','rainforest':'rainforest','savanna or grassland':'savanna','desert or dune':'desert','polar':'polar','herbivore':'herbivore','carnivore':'carnivore','omnivore':'omnivore','insectivore':'insectivore','oviparous':'eggs','viviparous':'liveBirth','nocturnal':'nocturnal','diurnal':'diurnal','arboreal':'climbs','fossorial':'burrows','natatorial':'swims','volant':'flies','metamorphosis':'metamorphosis','hibernation':'hibernates','migratory':'migrates','social':'social','solitary':'solitary','venomous':'venomous','poisonous':'poisonous','echolocation':'echolocation','colonial':'colonial','frugivore':'fruit','nectarivore':'nectar','granivore':'seeds','piscivore':'fishDiet','scavenger':'scavenger','filter-feeding':'filterFeeding','terrestrial':'terrestrial'}
TRANSLATE={'mammal':'mammifère','bird':'oiseau','reptile':'reptile (hors oiseaux, pour le jeu)','amphibian':'amphibien','fish':'poisson (regroupement usuel)','insect':'insecte','arachnid':'arachnide','mollusc':'mollusque','crustacean':'crustacé','other':'autre invertébré'}
GROUPS={'Mammalia':'mammal','Aves':'bird','Reptilia':'reptile','Amphibia':'amphibian','Actinopterygii':'fish','Sarcopterygii':'fish','Elasmobranchii':'fish','Holocephali':'fish','Myxini':'fish','Cephalaspidomorphi':'fish','Insecta':'insect','Arachnida':'arachnid','Malacostraca':'crustacean','Branchiopoda':'crustacean','Ostracoda':'crustacean','Maxillopoda':'crustacean'}
FEATURES='vertebrate mammal bird reptile amphibian fish insect arachnid mollusc crustacean domestic farm pet aquatic marine freshwater forest savanna desert polar herbivore carnivore omnivore insectivore eggs liveBirth fur feathers scales shell exoskeleton hooves horns antlers trunk beak wings sixLegs eightLegs flies swims climbs burrows nocturnal ruminant metamorphosis milkFarm'.split()
def base_record(g,name=None,aliases=None):
 sci=g.get('canonicalName') or g.get('scientificName','').split(' Linnaeus')[0]; k=g.get('usageKey') or g.get('key');cl={i:g.get(i) for i in ['kingdom','phylum','class','order','family','genus','species']}
 group='mollusc' if cl['phylum']=='Mollusca' else GROUPS.get(cl['class'],'other')
 src=f'https://www.gbif.org/species/{k}'
 traits={k:None for k in FEATURES}; origins={}
 def add(key,val,source=src,method='classification'):traits[key]=val;origins[key]={'source':source,'method':method}
 # Taxonomic mutually exclusive teaching categories, with clear caveat for reptiles/fish.
 if group!='other':
  for q in TRANSLATE:
   if q!='other':add(q,group==q)
 add('vertebrate',cl['phylum']=='Chordata' and group in ['mammal','bird','reptile','amphibian','fish'])
 if cl['phylum']=='Arthropoda':add('exoskeleton',True)
 if group=='bird':add('feathers',True);add('beak',True);add('eggs',True);add('liveBirth',False)
 elif group!='other':add('feathers',False)
 if group=='mammal':
  if cl['order']=='Monotremata':add('eggs',True);add('liveBirth',False)
  else:add('eggs',False);add('liveBirth',True)
 elif group!='other':add('fur',False)
 if group=='insect':add('sixLegs',True);add('eightLegs',False)
 if group=='arachnid':add('eightLegs',True);add('sixLegs',False)
 if group in ['mammal','bird','reptile','amphibian','fish','mollusc']:add('sixLegs',False);add('eightLegs',False)
 if group in ['bird','fish']:add('hooves',False);add('trunk',False);add('antlers',False)
 names=[n['vernacularName'] for n in g.get('vernacularNames',[]) if n.get('language')=='fra']
 name=name or (names[0] if names else None)
 return {'id':f'gbif-{k}','name':name,'scientificName':sci,'group':TRANSLATE[group],'classification':cl,'aliases':list(dict.fromkeys((aliases or [])+names)),'traits':traits,'traitSources':origins,'facts':[], 'sources':[{'title':'GBIF — classification taxonomique','url':src,'accessed':'2026-10-28'}],'photo':None,'habitat':None,'distribution':None,'diet':None,'reproduction':None,'anatomy':None,'movement':None,'size':None,'domesticStatus':None,'particularities':[],'playable':False,'status':'catalogue taxonomique — enrichissement requis'}
def section(s,id):
 m=re.search(r'<h2 id="'+id+r'"[^>]*>(.*?)</section>',s,re.S);return m.group(1) if m else ''
def parse_adw(a,s,url):
 t=a['traits'];origins=a['traitSources']; tags={text(x) for x in re.findall(r'<a class="gloss-link[^>]*>(.*?)</a>',s,re.S)}
 def add(k,v,method='ADW structured keyword'):t[k]=v;origins[k]={'source':url,'method':method}
 for k,key in KEYWORDS.items():
  if k in tags:add(key,True)
 # Only mutually exclusive explicit primary diets may negate each other.
 diets=set(KEYWORDS[k] for k in ['herbivore','carnivore','omnivore'] if k in tags)
 if len(diets)==1:
  for key in ['herbivore','carnivore','omnivore']:add(key,key in diets,'ADW primary diet category')
 if 'oviparous' in tags and not ('viviparous' in tags or 'ovoviviparous' in tags):add('liveBirth',False)
 if 'viviparous' in tags and 'oviparous' not in tags:add('eggs',False)
 physical=section(s,'physical_description');measure=[]
 for dt,dd in re.findall(r'<dt[^>]*>(.*?)</dt>\s*<dd[^>]*>(.*?)</dd>',physical,re.S):
  label=text(dt);value=text(dd)
  if label in ['Range mass','Average mass','Range length','Average length']:measure.append({'label':label,'value':value})
 a['size']=measure or None
 for m in measure:
  if m['label'] not in ['Range mass','Average mass']:continue
  nums=re.findall(r'[0-9]+(?:\.[0-9]+)?',m['value']);unit=re.search(r'\b(kg|g|mg)\b',m['value'])
  if not nums or not unit:continue
  vals=[float(n)*{'kg':1,'g':.001,'mg':.000001}[unit.group(1)] for n in nums]
  for threshold,key in [(1,'massOver1kg'),(10,'massOver10kg'),(100,'massOver100kg')]:
   if min(vals)>threshold:add(key,True,'ADW reported mass interval')
   elif max(vals)<threshold:add(key,False,'ADW reported mass interval')
  break
 # Geographic keyword labels retained as sourced values, not automatically negative.
 regions={'nearctic':'Amérique du Nord','neotropical':'Amérique centrale et du Sud','palearctic':'Europe, Afrique du Nord et Asie tempérée','ethiopian':'Afrique subsaharienne','oriental':'Asie du Sud et du Sud-Est','australian':'Australie et régions voisines','antarctica':'Antarctique','oceanic islands':'Îles océaniques','pacific ocean':'Océan Pacifique','atlantic ocean':'Océan Atlantique','indian ocean':'Océan Indien','arctic ocean':'Océan Arctique'}
 a['distribution']=[v for k,v in regions.items() if k in tags] or None
 a['habitat']=[KEYWORDS[k] for k in tags if k in KEYWORDS and KEYWORDS[k] in ['marine','freshwater','forest','rainforest','savanna','desert','polar','terrestrial']] or None
 a['diet']=[k for k in ['herbivore','carnivore','omnivore','insectivore','fruit','nectar','seeds','fishDiet'] if t.get(k) is True] or None
 a['reproduction']=[k for k in ['eggs','liveBirth','metamorphosis'] if t.get(k) is True] or None
 a['movement']=[k for k in ['flies','swims','climbs','burrows'] if t.get(k) is True] or None
 a['sources'].append({'title':'Animal Diversity Web — University of Michigan','url':url,'accessed':'2026-10-28'})
 a['adwKeywords']=sorted(tags)
 a['playable']=True;a['status']='traits documentés — couverture partielle'
 # Three short paraphrased facts derived only from tags; never infer absent info.
 facts=[]
 facts.append('Classification : '+a['group']+'.')
 wording={'herbivore':'Son alimentation est principalement végétale.','carnivore':"Il se nourrit principalement d’autres animaux.",'omnivore':"Il consomme des aliments d’origine animale et végétale.",'eggs':'La reproduction comporte une ponte d’œufs.','liveBirth':'Les petits naissent vivants.','nocturnal':'Il peut être actif la nuit.','flies':'Il se déplace en volant.','swims':'Il se déplace en nageant.','metamorphosis':'Son développement comporte une métamorphose.','hibernates':'Il peut hiberner.','migrates':'Il effectue des migrations.','echolocation':'Il peut utiliser les échos pour se repérer.'}
 for k,v in wording.items():
  if t.get(k) is True:facts.append(v)
 a['facts']=facts[:3]
 # Exact licensed image attribution from its metadata page.
 m=re.search(r'<img[^>]+src="(/collections/[^\"]+/medium\.(?:jpg|png))"',s)
 if m:
  imgurl=ADW+m.group(1); page=imgurl.rsplit('/',1)[0]+'/';ps=get(page)
  if ps:
   lm=re.search(r'href="(https?://creativecommons.org/licenses/[^\"]+)"\s+rel="license"',ps)
   cm=re.search(r'<dd class="metadata--(?:agents|creator|contributors)[^>]*>(.*?)</dd>',ps,re.S)
   # Prefer creator metadata blocks; citation fallback names a real credited contributor.
   citation=re.search(r'<p data-slot="citation"[^>]*>(.*?)</p>',ps,re.S)
   credit=text(citation.group(1)).split('Accessed')[0] if citation else ''
   credit=re.sub(r'^To cite this page:\s*','',credit)
   if lm and credit:
    b=get(imgurl,True)
    if b and b[:2]==b'\xff\xd8':
     fn=a['id']+'.jpg';(OUT/'photos'/fn).write_bytes(b);a['photo']={'src':'data/photos/'+fn,'credit':credit,'license':lm.group(1),'source':page,'downloaded':'2026-10-28','modified':False}
 return a

def one(seed):
 name,sci,aliases=seed.split('\t');aliases=aliases.split(',');u=BASE+'species/match?strict=true&name='+urllib.parse.quote(sci)
 raw=get(u)
 if not raw:return None
 g=json.loads(raw)
 if g.get('matchType')=='NONE' or g.get('rank') not in ['SPECIES','SUBSPECIES']:return None
 # Resolve accepted taxonomy but preserve requested name when accepted matching is subspecies.
 if g.get('status')=='SYNONYM' and g.get('acceptedUsageKey'):
  raw=get(BASE+'species/'+str(g['acceptedUsageKey']))
  if raw:g=json.loads(raw)
 a=base_record(g,name,aliases);a['seedScientificName']=sci
 url=ADW+'/accounts/'+sci.replace(' ','_')+'/'
 s=get(url)
 if s and 'id="food_habits"' in s:a=parse_adw(a,s,url)
 print(name,a['playable'],bool(a['photo']),flush=True)
 return a
if __name__=='__main__':
 seeds=(Path(__file__).with_name('seeds.tsv')).read_text().strip().splitlines()
 animals=[]
 with concurrent.futures.ThreadPoolExecutor(max_workers=6) as ex:
  for a in ex.map(one,seeds):
   if a:animals.append(a)
   if len(animals)%20==0:dump(OUT/'animals-preview.json',animals)
 # Preserve domestic dog as distinct gameplay concept even if taxonomy treats it as a wolf subspecies.
 seen=set();final=[]
 for a in animals:
  if a['id'] in seen:print('DUPLICATE',a['name'],flush=True);continue
  seen.add(a['id']);final.append(a)
 dump(OUT/'animals.json',final)
 dump(OUT/'data-audit.json',{'count':len(final),'playable':sum(a['playable'] for a in final),'photos':sum(bool(a['photo']) for a in final),'target':1000,'complete':False,'collectedAt':'2026-10-28','missing':'Catalogue 1000 espèces et validation exhaustive des traits/photographies non terminés.','sourcePolicy':'Unknown remains null. Missing ADW keywords are not false. Classification traits are explicit rule-based deductions. Image licenses are checked per image.'})
 print('TOTAL',len(final),'PLAYABLE',sum(a['playable'] for a in final),'PHOTOS',sum(bool(a['photo']) for a in final),flush=True)
