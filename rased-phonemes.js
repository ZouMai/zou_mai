/* RASED · référentiel phonologique français
   display = graphème montré ; ipa = phonème cible ; tts = secours de synthèse, jamais utilisé comme vérité phonologique.
   Pour la production: déposer un enregistrement humain dans audio/phonemes/<audio>.mp3. */
window.RASED_PHONEMES = {
  vowels: [
    {id:"a",display:"a",ipa:"a",audio:"a",examples:["ami","chat"]},
    {id:"i",display:"i",ipa:"i",audio:"i",examples:["île","lit"]},
    {id:"u",display:"u",ipa:"y",audio:"u",examples:["lune","mur"]},
    {id:"ou",display:"ou",ipa:"u",audio:"ou",examples:["roue","loup"]},
    {id:"e",display:"é",ipa:"e",audio:"e-ferme",examples:["été","clé"]},
    {id:"e_open",display:"è",ipa:"ɛ",audio:"e-ouvert",examples:["père","sel"]},
    {id:"eu_closed",display:"eu",ipa:"ø",audio:"eu-ferme",examples:["feu","deux"]},
    {id:"eu_open",display:"eu",ipa:"œ",audio:"eu-ouvert",examples:["peur","sœur"]},
    {id:"o",display:"o",ipa:"o",audio:"o-ferme",examples:["eau","vélo"]},
    {id:"o_open",display:"o",ipa:"ɔ",audio:"o-ouvert",examples:["sol","porte"]},
    {id:"an",display:"an",ipa:"ɑ̃",audio:"an",examples:["sans","vent"]},
    {id:"on",display:"on",ipa:"ɔ̃",audio:"on",examples:["pont","monde"]},
    {id:"in",display:"in",ipa:"ɛ̃",audio:"in",examples:["pain","main"]},
    {id:"un",display:"un",ipa:"œ̃",audio:"un",examples:["un","brun"]}
  ],
  consonants: [
    {id:"p",display:"p",ipa:"p",audio:"p",examples:["papa"]},{id:"b",display:"b",ipa:"b",audio:"b",examples:["bébé"]},
    {id:"t",display:"t",ipa:"t",audio:"t",examples:["tapis"]},{id:"d",display:"d",ipa:"d",audio:"d",examples:["dame"]},
    {id:"k",display:"c / k / qu",ipa:"k",audio:"k",examples:["car","kilo","qui"]},{id:"g",display:"g",ipa:"ɡ",audio:"g",examples:["gare"]},
    {id:"f",display:"f / ph",ipa:"f",audio:"f",examples:["fée","photo"]},{id:"v",display:"v",ipa:"v",audio:"v",examples:["vélo"]},
    {id:"s",display:"s / ss / c",ipa:"s",audio:"s",examples:["sac","tasse","ciel"]},{id:"z",display:"z / s",ipa:"z",audio:"z",examples:["zéro","rose"]},
    {id:"ch",display:"ch",ipa:"ʃ",audio:"ch",examples:["chat","chou"]},{id:"j",display:"j / g",ipa:"ʒ",audio:"j",examples:["jupe","girafe"]},
    {id:"m",display:"m",ipa:"m",audio:"m",examples:["maman"]},{id:"n",display:"n",ipa:"n",audio:"n",examples:["nid"]},
    {id:"gn",display:"gn",ipa:"ɲ",audio:"gn",examples:["ligne"]},{id:"l",display:"l",ipa:"l",audio:"l",examples:["lune"]},
    {id:"r",display:"r",ipa:"ʁ",audio:"r",examples:["rue"]},{id:"y",display:"ill / y",ipa:"j",audio:"yod",examples:["fille","yaourt"]},
    {id:"w",display:"ou / w",ipa:"w",audio:"w",examples:["oui"]},{id:"ui",display:"u",ipa:"ɥ",audio:"ui",examples:["huit"]}
  ]
};
window.RASED_PHONEME_BY_ID = Object.fromEntries([...window.RASED_PHONEMES.vowels,...window.RASED_PHONEMES.consonants].map(p=>[p.id,p]));
