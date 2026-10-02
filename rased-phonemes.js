/* RASED · noyau phonologique français
Sources audio IPA: jynbug/wikimedia-phoneme-audio, archive de fichiers Wikimedia Commons.
Le dépôt source conserve les métadonnées/licences. Ne jamais déduire un son de l'orthographe.
*/
const WM="https://raw.githubusercontent.com/jynbug/wikimedia-phoneme-audio/main/audio/";
const WC="https://commons.wikimedia.org/wiki/Special:Redirect/file/";
const P=(id,display,ipa,file,examples,kind="phoneme")=>({id,display,ipa,audioUrl:file?(file.startsWith("http")?file:WM+file):null,examples,kind});
window.RASED_PHONEMES={
 vowels:[
  P("a","a","a",WC+"Open_front_unrounded_vowel.ogg",["ami","chat"]),
  P("i","i","i",WC+"Close_front_unrounded_vowel.ogg",["île","lit"]),
  P("u","u","y",WC+"Close_front_rounded_vowel.ogg",["lune","mur"]),
  P("ou","ou","u",WC+"Close_back_rounded_vowel.ogg",["roue","loup"]),
  P("e","é","e",WC+"Close-mid_front_unrounded_vowel.ogg",["été","clé"]),
  P("schwa","e","ə",null,["menu","le"]),
  P("e_open","è / ai","ɛ",WC+"Open-mid_front_unrounded_vowel.ogg",["père","lait"]),
  P("eu_closed","eu / œu","ø",WC+"Close-mid_front_rounded_vowel.ogg",["feu","nœud"]),
  P("eu_open","eu / œu","œ",WC+"Open-mid_front_rounded_vowel.ogg",["peur","sœur"]),
  P("o","o / au / eau","o",WC+"Close-mid_back_rounded_vowel.ogg",["vélo","eau"]),
  P("o_open","o","ɔ",WC+"Open-mid_back_rounded_vowel.ogg",["sol","porte"]),
  /* Les voyelles nasales françaises restent des cibles IPA distinctes.
     Pas de TTS sur "an/on/in/un": si aucun échantillon validé n'est disponible,
     on joue un mot étalon humain/lexical plutôt qu'un nom de graphème. */
  P("an","an / en","ɑ̃",null,["sans","vent"],"nasal"),
  P("on","on","ɔ̃",null,["pont","monde"],"nasal"),
  P("in","in / ain / ein","ɛ̃",null,["pain","main"],"nasal"),
  P("un","un","œ̃",null,["un","brun"],"nasal")
 ],
 consonants:[
  P("p","p","p","Voiceless_bilabial_plosive.ogg",["papa"]),P("b","b","b","Voiced_bilabial_plosive.ogg",["bébé"]),
  P("t","t","t","Voiceless_alveolar_plosive.ogg",["tapis"]),P("d","d","d","Voiced_alveolar_plosive.ogg",["dame"]),
  P("k","c / k / qu","k","Voiceless_velar_plosive.ogg",["car","kilo","qui"]),P("g","g / gu","ɡ","Voiced_velar_plosive_02.ogg",["gare","guitare"]),
  P("f","f / ph","f","Voiceless_labio-dental_fricative.ogg",["fée","photo"]),P("v","v","v","Voiced_labio-dental_fricative.ogg",["vélo"]),
  P("s","s / ss / c / ç","s","Voiceless_alveolar_sibilant.ogg",["sac","tasse","ciel"]),P("z","z / s","z","Voiced_alveolar_sibilant.ogg",["zéro","rose"]),
  P("ch","ch","ʃ","Voiceless_palato-alveolar_sibilant.ogg",["chat","chou"]),P("j","j / g","ʒ","Voiced_palato-alveolar_sibilant.ogg",["jupe","girafe"]),
  P("m","m","m","Bilabial_nasal.ogg",["maman"]),P("n","n","n","Alveolar_nasal.ogg",["nid"]),
  P("gn","gn","ɲ","Palatal_nasal.ogg",["ligne"]),P("l","l","l","Alveolar_lateral_approximant.ogg",["lune"]),
  P("r","r","ʁ","Voiced_uvular_fricative.ogg",["rue"]),P("y","ill / y","j","Palatal_approximant.ogg",["fille","yaourt"]),
  P("w","ou / w","w","Voiced_labial-velar_approximant.ogg",["oui"]),P("ui","u","ɥ","Voiced_labial-palatal_approximant.ogg",["huit"])
 ]
};
window.RASED_PHONEME_BY_ID=Object.fromEntries([...RASED_PHONEMES.vowels,...RASED_PHONEMES.consonants].map(p=>[p.id,p]));
window.RASED_AUDIO={
 async phoneme(id){
  const p=RASED_PHONEME_BY_ID[id]; if(!p) throw new Error("phonème inconnu: "+id);
  if(!p.audioUrl) return false;
  try{
   const a=new Audio(p.audioUrl);a.preload="auto";await a.play();return true
  }catch(e){
   console.warn("Audio phonème indisponible",id,e);return false
  }
 },
 word(text){const u=new SpeechSynthesisUtterance(text);u.lang="fr-FR";u.rate=.68;speechSynthesis.cancel();speechSynthesis.speak(u)}
};
