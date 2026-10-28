#!/usr/bin/env python3
"""Audit shipped data, including photo taxon identity (not just non-empty credits)."""
from import_animals import *
from collections import Counter
a=json.loads((OUT/'animals.json').read_text());removed=[]
for x in a:
 p=x.get('photo')
 if p:
  s=get(p['source'])
  match=re.search(r'Identification\s*</dt>\s*<dd[^>]*>(.*?)</dd>',s or '',re.S)
  identified=text(match.group(1)) if match else ''
  scientific=[x['scientificName'],x.get('seedScientificName','')]
  if not any(n and re.search(r'(?<![A-Za-z])'+re.escape(n)+r'(?![A-Za-z])',identified) for n in scientific):
   removed.append({'animal':x['name'],'photo':p['source'],'identified':identified});x['photo']=None
  else:p['identifiedTaxon']=x['scientificName'];p['identificationVerified']=True
 # Only claim playable when sources contain useful ecological information.
 ecokeys=[k for k,v in x['traits'].items() if v is not None and x.get('traitSources',{}).get(k,{}).get('method') not in ['classification'] and 'GBIF' not in x.get('traitSources',{}).get(k,{}).get('method','')]
 if len(ecokeys)<4:x['playable']=False;x['status']='données encore insuffisantes pour une enquête'
 # Record integrity: the complete taxon name cannot be inferred from partial genus matching.
 if not x.get('classification',{}).get('species'):x['playable']=False
counts=Counter(x['id']for x in a);names=Counter(x['scientificName']for x in a)
assert not any(v>1 for v in counts.values()),'duplicate id'
assert not any(v>1 for v in names.values()),'duplicate scientific name'
assert all(x['name'] and x['classification']['kingdom']=='Animalia' for x in a)
for x in a:
 for k,v in x['traits'].items():
  assert v is None or type(v) is bool
  if v is not None:assert x['traitSources'].get(k,{}).get('source'),(x['name'],k,'unsourced')
 if x.get('photo'):assert (ROOT/x['photo']['src']).exists()
dump(OUT/'animals.json',a)
# Do not ship orphan or mismatched images.
used={x['photo']['src'].split('/')[-1] for x in a if x.get('photo')}
for p in (OUT/'photos').glob('*.jpg'):
 if p.name not in used:p.unlink()
audit={'count':len(a),'playable':sum(x['playable']for x in a),'photos':sum(bool(x['photo'])for x in a),'target':1000,'complete':False,'duplicateIds':0,'duplicateScientificNames':0,'missingFrenchNames':0,'photoTaxonMismatchesRemoved':removed,'collectedAt':'2026-10-28','limitations':['1000 documented playable animals not reached','Biological content requires further independent review','Some accounts are old and may use broader species concepts','Photo metadata identity verified; not all photographs visually reviewed'],'sourcePolicy':'Missing values remain null. Trait provenance stored individually. Photos require explicit Creative Commons license, attribution and matching identification.'}
dump(OUT/'audit.json',audit)
credits=['# Photographies et licences','', 'Chaque photographie conserve sa licence individuelle. Les images CC BY-NC-SA sont utilisables uniquement dans le respect de la clause non commerciale et du partage dans les mêmes conditions. Aucune image n’a été modifiée.','']
for x in a:
 if x.get('photo'):
  p=x['photo'];credits.extend([f"## {x['name']} — {x['scientificName']}",f"- Fichier : `{p['src']}`",f"- Crédit : {p['credit']}",f"- Licence : {p['license']}",f"- Source : {p['source']}",''])
(OUT/'PHOTO-CREDITS.md').write_text('\n'.join(credits))
print(json.dumps({k:v for k,v in audit.items() if k not in ['limitations','sourcePolicy','photoTaxonMismatchesRemoved']}));print('Mismatched photos removed',len(removed))
