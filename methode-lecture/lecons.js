// graphie, repère oral, pictogramme, distracteurs oraux, lecture graduée, encodage, texte
const periods = [
  ["Les premiers assemblages", [
    ["a","avion","✈️","lune,lit","a","a"],
    ["i","île","🏝️","avion,robot","i a","i"],
    ["l","lune","🌙","avion,sac","la li al il","la"],
    ["o","robot","🤖","lit,lune","lo ol","lo"],
    ["s","salade","🥗","lune,robot","sa si so / sol silo","sol"],
    ["u","usine","🏭","avion,lit","lu su ul us","lu"],
    ["m","moto","🏍️","lune,sac","ma mi mo mu am im / ami mari","ami","Lili a lu."],
    ["f","fusée","🚀","moto,lune","fa fi fo fu af if / fil lama","fil"],
    ["r","rat","🐀","lune,lit","ra ri ro ru ar ir or / sari","sari"],
    ["é","éléphant","🐘","lune,lit","lé mé fé ré sé / salé fumé","salé","Sam a salé."],
  ]],
  ["Des mots et des phrases", [
    ["e","melon","🍈","moto,lit","le me se re fe / farine mule lune","lune","Mila a lu."],
    ["p","panda","🐼","ballon,rat","pa pi po pu pé ap ip / pirate pile","pile","Le pirate a ri."],
    ["t","tortue","🐢","panda,ballon","ta ti to tu té at it / tomate tir","tomate","Papa a pelé la tomate."],
    ["b","ballon","🎈","panda,tortue","ba bi bo bu bé ab ib / bol robe","robe","Mila a lavé la robe."],
    ["d","dé","🎲","tortue,ballon","da di do du dé ad id / dé date","date","Ali a tiré le dé."],
    ["n","nid","🪺","moto,lit","na ni no nu né / canapé narine","narine","Nina a dormi sur le canapé."],
    ["è","flèche","🎯","fusée,tortue","lè mè rè pè / mère père","mère","Sa mère a ri."],
    ["ê","tête","🙂","lit,fusée","rê tê pê / tête fête","fête","Papa prépare la fête."],
    ["v","vélo","🚲","fusée,ballon","va vi vo vu vé / vélo navire","vélo","Nina a réparé le vélo."],
  ]],
  ["Deux lettres, un son", [
    ["ch","chat","🐱","salade,fusée","cha chi cho chu ach / riche chéri","riche","Nina a lavé la niche."],
    ["ou","ours","🐻","lune,lit","lou mou rou chou pour / boule soupe","soupe","Papa a préparé la soupe."],
    ["on","pont","🌉","lit,lune","lon mon ron bon ton / mouton salon","salon","Nina a vu le mouton."],
    ["an","panda","🐼","pont,lit","lan man ran pan tan / panda","panda"],
    ["en","dent","🦷","lit,robot","len ven ren den / tente pente","tente","Papa monte la tente."],
    ["in","lapin","🐇","pont,dent","lin pin vin tin / lapin patin","patin","Le lapin a bondi."],
    ["oi","étoile","⭐","ours,lit","loi moi roi toi poi / poire voile","poire","Nina a lavé la poire."],
    ["gn","montagne","⛰️","moto,chat","gna gni gno / ligne vigne","ligne","Ali a lu la ligne."],
    ["c","carotte","🥕","domino,ballon","ca co cu ac oc / canard cube","cube","Nina lave le cube."],
    ["g","gomme","🧽","carotte,domino","ga go gu ag og / gomme regarde","gomme","Ali gomme la date."],
  ]],
  ["De nouvelles façons d’écrire les sons", [
    ["ai","lait","🥛","lit,robot","lai mai rai pai / laine","laine","Nina a sali la laine."],
    ["ei","reine","👑","lit,robot","rei nei pei / reine peine","reine","La reine a lavé sa robe."],
    ["au","jaune","🟡","tortue,lit","lau mau rau tau / taupe jaune","taupe","Nina a vu la taupe."],
    ["eau","bateau","⛵","tortue,lit","beau teau peau veau / bateau chapeau","bateau","Nina a vu le bateau."],
    ["j","jupe","👗","chat,carotte","ja ji jo ju / jupe jolie","jupe","Nina a lavé sa jupe."],
    ["z","zèbre","🦓","salade,chat","za zi zo zu / zèbre zéro","zéro","Ali a vu le zéro."],
    ["ss","tasse","☕","zèbre,jupe","assa issa osse / tasse classe","tasse","Nina a posé la tasse."],
    ["s entre voyelles","rose","🌹","tasse,chat","asa isi oso / rose valise","valise","La robe rose va sur la valise."],
    ["qu","quatre","4️⃣","ballon,domino","qua qui quo / quatre masque","masque","Le masque a roulé."],
    ["ç","garçon","👦","zèbre,chat","ça ço çu / garçon leçon","leçon","Le garçon a relu la leçon."],
  ]],
  ["Lire des mots plus variés", [
    ["c devant e, i","citron","🍋","carotte,zèbre","ce ci cé / citron ficelle","ficelle","Ali tire sur la ficelle."],
    ["g devant e, i","girafe","🦒","gomme,chat","ge gi gé / girafe genou","girafe","La girafe remue la tête."],
    ["gu","guitare","🎸","girafe,chat","gue gui / guitare bague","guitare","Nina a sorti la guitare."],
    ["ge devant a, o","pigeon","🕊️","gomme,chat","gea geo / pigeon orangeade","pigeon","Le pigeon tourne autour du bateau."],
    ["oin","foin","🌾","pont,étoile","loin moin poin / foin","foin","Le canard marche loin."],
    ["eu","feu","🔥","lune,ours","feu jeu peu / jeu bleu","bleu","Ali pose le cube bleu."],
    ["œu","cœur","❤️","ours,lune","cœur / cœur","cœur","Ali a dessiné le cœur."],
    ["br","brosse","🪥","bol,rose","bra bri bro bru / brosse branche","brosse","Nina brosse sa robe."],
    ["tr","trompette","🎺","tasse,rose","tra tri tro tru / trace trou","trace","Ali trace la date."],
    ["pl","plume","🪶","panda,lune","pla pli plo plu / plume place","plume","La plume tombe sur le lit."],
    ["ain","pain","🍞","pont,dent","main pain bain / main bain","bain","Nina prépare le bain."],
    ["ein","peinture","🎨","pont,dent","pein tein / peinture ceinture","ceinture","Ali a sali sa ceinture."],
    ["ui","huit","8️⃣","lune,ours","lui nui pui / nuit pluie","pluie","La pluie tombe."],
    ["ill","fille","👧","lune,lit","ille aille ouille / fille bille","bille","La bille roule."],
    ["y","yaourt","🥛","lune,ours","ya yo you / yaourt yoga","yoga","Papa a préparé le yaourt."],
    ["k","kiwi","🥝","girafe,domino","ka ki ko / kilo kiwi","kiwi","Ali coupe le kiwi."],
    ["ph","phare","💡","vélo,domino","pha phi pho / phare photo","photo","Nina a préparé la photo."],
    ["h muet","hibou","🦉","vélo,domino","ha hi ho / habit hibou","hibou","Le hibou a vu la lune."],
  ]]
];

const oralPictures = {
  lune:"🌙", lit:"🛏️", avion:"✈️", robot:"🤖", sac:"🎒", moto:"🏍️",
  rat:"🐀", ballon:"🎈", panda:"🐼", tortue:"🐢", fusée:"🚀", salade:"🥗",
  ours:"🐻", pont:"🌉", dent:"🦷", chat:"🐱", domino:"🎲", carotte:"🥕",
  zèbre:"🦓", jupe:"👗", tasse:"☕", gomme:"🧽", girafe:"🦒", étoile:"⭐",
  bol:"🥣", rose:"🌹",
  île:"🏝️", vélo:"🚲", serpent:"🐍", porte:"🚪", tête:"🙂", pêche:"🍑",
  poule:"🐔", étoile:"⭐", fraise:"🍓", banane:"🍌", raisin:"🍇", phare:"💡",
  pain:"🍞", yaourt:"🥛", soleil:"☀️", kiwi:"🥝", hibou:"🦉", huit:"8️⃣"
};

// Mot oral différent de l’image attendue, pour faire écouter le son plutôt que le sens.
const oralModels = {
  "a":"arbre", "i":"image", "l":"lapin", "o":"vélo", "s":"serpent",
  "u":"mule", "m":"maman", "f":"fourmi", "r":"raisin", "é":"école",
  "e":"renard", "p":"poire", "t":"tambour", "b":"bébé", "d":"dauphin",
  "n":"nuage", "è":"père", "ê":"fête", "v":"valise", "ch":"chou",
  "ou":"poule", "on":"mouton", "an":"gant", "en":"vent", "in":"sapin",
  "oi":"poire", "gn":"ligne", "c":"cochon", "g":"gare", "ai":"aile",
  "ei":"neige", "au":"chaud", "eau":"chapeau", "j":"jardin", "z":"zéro",
  "ss":"serpent", "s entre voyelles":"zéro", "qu":"cochon", "ç":"serpent",
  "oin":"coin", "eu":"jeu", "œu":"sœur", "ain":"main", "ein":"main",
  "ui":"pluie", "ill":"bille", "y":"yoga", "k":"cochon", "ph":"fourmi"
};

const modelPictures = {
  arbre:"🌳", image:"🖼️", lapin:"🐇", vélo:"🚲", serpent:"🐍", mule:"🐴",
  maman:"👩", fourmi:"🐜", raisin:"🍇", école:"🏫", renard:"🦊", poire:"🍐",
  tambour:"🥁", bébé:"👶", dauphin:"🐬", nuage:"☁️", père:"👨", fête:"🎉",
  valise:"🧳", chou:"🥬", poule:"🐔", mouton:"🐑", gant:"🧤", vent:"🌬️",
  sapin:"🌲", ligne:"➖", cochon:"🐖", gare:"🚉", aile:"🪽", neige:"❄️",
  chaud:"🥵", chapeau:"👒", jardin:"🌻", zéro:"0️⃣", coin:"📐", jeu:"🎲",
  sœur:"👧", main:"✋", pluie:"🌧️", bille:"🔵", yoga:"🧘",
  pirate:"🏴‍☠️", farine:"🌾"
};
