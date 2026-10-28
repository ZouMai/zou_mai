#!/usr/bin/env python3
"""Explicit, reviewed facts. Unknown is never converted to false by keyword absence."""
from import_animals import *
a=json.loads((OUT/'animals.json').read_text())
# ADW account sections read on 2026-10-28. Values below describe the species,
# with breed/sex exceptions left unknown where a yes/no would mislead.
reviewed={
'Bos taurus':({'domestic':True,'farm':True,'fur':True,'horns':True},'Bos_taurus','physical_description'),
'Equus caballus':({'domestic':True,'farm':True,'fur':True,'hooves':True},'Equus_caballus','physical_description'),
'Capra hircus':({'domestic':True,'farm':True,'fur':True,'horns':True},'Capra_hircus','physical_description'),
'Ovis aries':({'domestic':True,'farm':True,'fur':True},'Ovis_aries','physical_description'),
'Felis catus':({'domestic':True,'pet':True,'fur':True,'retractableClaws':True},'Felis_catus','physical_description'),
'Ornithorhynchus anatinus':({'fur':True,'beak':True,'aquatic':True,'freshwater':True,'webbedFeet':True},'Ornithorhynchus_anatinus','physical_description'),
}
for x in a:
 if x['traits'].get('fur') is True and x.get('traitSources',{}).get('fur',{}).get('method')=='classification':
  x['traits']['fur']=None;x['traitSources'].pop('fur',None)
 if x['scientificName'] in reviewed:
  traits,slug,sectionid=reviewed[x['scientificName']]
  for k,v in traits.items():x['traits'][k]=v;x['traitSources'][k]={'source':ADW+'/accounts/'+slug+'/#'+sectionid,'method':'manually reviewed account, 2026-10-28'}
  if traits.get('domestic') is True:x['domesticStatus']='domestique'
 if x['name']=='Chien domestique':
  url=ADW+'/accounts/Canis_lupus_familiaris/';s=get(url)
  if s:
   x=parse_adw(x,s,url)
   for k in ['domestic','pet']:
    x['traits'][k]=True;x['traitSources'][k]={'source':url+'#physical_description','method':'manually reviewed account, 2026-10-28'}
   x['domesticStatus']='domestique'
for x in a:
 if x['scientificName'] in ['Bos taurus','Capra hircus']:
  for key,sectionid in [('ruminant','food_habits'),('milkFarm','economic_importance_positive')]:
   x['traits'][key]=True;x['traitSources'][key]={'source':ADW+'/accounts/'+x['scientificName'].replace(' ','_')+'/#'+sectionid,'method':'manually reviewed account, 2026-10-28'}
# Anax junius has a documented, accessible account; do not attach its traits to Libellula depressa.
if not any(x['scientificName']=='Anax junius' for x in a):
 x=one('Anax de juin\tAnax junius\tanax de juin,libellule')
 if x:
  for k in ['flies','wings']:
   x['traits'][k]=True;x['traitSources'][k]={'source':ADW+'/accounts/Anax_junius/#physical_description','method':'manually reviewed account, 2026-10-28'}
  a.append(x)
# Remove ambiguous domestic label for a record describing wild boar as a species.
for x in a:
 if x['scientificName']=='Sus scrofa':x['name']='Sanglier';x['aliases']=['sanglier']
dump(OUT/'animals.json',a)
extra=json.loads((OUT/'questions-extra.json').read_text());ids={q['id']for q in extra}
for q in [dict(id='retractableClaws',text='Possède-t-il des griffes rétractiles ?',family='anatomy',term='griffes rétractiles',pattern='griffe.*retractile',explanation='Des griffes qui peuvent rentrer dans une gaine protectrice.'),dict(id='webbedFeet',text='Possède-t-il des pattes palmées ?',family='anatomy',term='pattes palmées',pattern='patte.*palmee',explanation='Une membrane relie les doigts et facilite la nage.')]:
 if q['id']not in ids:extra.append(q)
dump(OUT/'questions-extra.json',extra)
print('Reviewed',len(a),'animals')
