#!/usr/bin/env python3
"""Collect sourced French taxon candidates. This catalogue is NOT playable by default."""
from import_animals import *
CLASSES={'mammals':359,'birds':212,'reptiles':358,'amphibians':131,'fish':204,'insects':216,'arachnids':367,'molluscs':52,'crustaceans':229}
def page(arg):
 group,key,offset=arg
 u=BASE+'species/search?rank=SPECIES&highertaxon_key='+str(key)+'&status=ACCEPTED&datasetKey=d7dddbf4-2cf0-4f39-9b2a-bb099caae36c&limit=100&offset='+str(offset)
 s=get(u)
 if not s:return []
 results=[]
 for g in json.loads(s).get('results',[]):
  if g.get('extinct') or g.get('kingdom')!='Animalia' or g.get('taxonomicStatus')!='ACCEPTED':continue
  fr=[n['vernacularName'] for n in g.get('vernacularNames',[]) if n.get('language')=='fra']
  if not fr:continue
  # Exclude names identical to scientific labels, overt codes, and very short names.
  fr=[n for n in fr if len(n)>3 and n.lower()!=g.get('canonicalName','').lower() and not re.search(r'\d',n)]
  if not fr:continue
  a=base_record(g,fr[0],fr);a['catalogueGroup']=group;results.append(a)
 print(group,offset,len(results),flush=True);return results
if __name__=='__main__':
 jobs=[(group,key,offset) for group,key in CLASSES.items() for offset in range(0,1400,100)]
 with concurrent.futures.ThreadPoolExecutor(max_workers=4) as ex:results=[a for batch in ex.map(page,jobs) for a in batch]
 seen=set();names=set();genusCounts={};final=[]
 for a in results:
  if a['id'] in seen or a['name'].casefold() in names:continue
  gen=a['classification']['genus'];genusCounts.setdefault(gen,0)
  if genusCounts[gen]>=3:continue
  seen.add(a['id']);names.add(a['name'].casefold());genusCounts[gen]+=1;final.append(a)
 dump(OUT/'catalogue-candidates.json',final)
 print('CATALOGUE CANDIDATES',len(final),flush=True)
