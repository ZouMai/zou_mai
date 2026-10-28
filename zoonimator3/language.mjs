export const normalize=s=>String(s).replace(/œ/g,'oe').replace(/Œ/g,'OE').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[’']/g,' ').replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim();
export function parseQuestion(text,questions){
 const s=normalize(text);
 if(!s)return {type:'empty'};
 if(/\b(pourquoi|comment|combien|quelle taille|quel poids|quelle couleur|ou vit)\b/.test(s))return {type:'unsupported'};
 if(/\b(ne|n)\b.*\b(pas|jamais|plus)\b|\bsans\b|\bpas\b/.test(s))return {type:'negative'};
 // Specific wording wins over overlapping broad wording ("eau douce").
 const matches=questions.filter(q=>q.pattern&&new RegExp('(?:\\b)(?:'+q.pattern.replace(/\b(hibern|migr|empoisonn|charogn|filtr)\b/g,'$1[a-z]*').replace(/kilo(?![a-z])/g,'kilo(?:gramme)?')+')(?:s|x)?(?:\\b)').test(s));
 const ids=new Set(matches.map(q=>q.id));
 if(ids.has('rainforest'))ids.delete('forest');
 if(ids.has('fishDiet'))ids.delete('fish');
 if(ids.has('colonial'))ids.delete('social');
 if(ids.has('carnivoran'))ids.delete('carnivore');
 if(ids.has('freshwater'))ids.delete('aquatic');
 if(ids.has('insectivore'))ids.delete('insect');
 if(ids.has('omnivore')){ids.delete('herbivore');ids.delete('carnivore');}
 const filtered=matches.filter(q=>ids.has(q.id));
 if(filtered.length===1)return {type:'question',question:filtered[0]};
 return {type:filtered.length?'ambiguous':'unsupported',questions:filtered};
}
export function parseAnswer(text){const s=normalize(text);return {'oui':'yes','non':'no','je ne sais pas':'unknown','je sais pas':'unknown','probablement':'probably','probablement pas':'unlikely','peut etre':'probably'}[s]||null;}
export function guessMatches(text,animal){const s=normalize(text).replace(/^(un |une |le |la |l )/,'');return [animal.name,...animal.aliases||[]].some(n=>normalize(n)===s);}
