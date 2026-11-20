// Découpage oral de mots illustrés. Chaque bloc contient la syllabe telle qu’on l’entend.
const syllableCards = [
  ["moto","🏍️",["mo","to"]],
  ["vélo","🚲",["vé","lo"]],
  ["panda","🐼",["pan","da"]],
  ["tortue","🐢",["tor","tu"]],
  ["ballon","🎈",["ba","lon"]],
  ["robot","🤖",["ro","bo"]],
  ["lapin","🐇",["la","pin"]],
  ["renard","🦊",["re","nar"]],
  ["bateau","⛵",["ba","to"]],
  ["chapeau","👒",["cha","po"]],
  ["girafe","🦒",["gi","raf"]],
  ["éléphant","🐘",["é","lé","fan"]],
  ["carotte","🥕",["ca","rot"]],
  ["dauphin","🐬",["do","fin"]],
  ["pirate","🏴‍☠️",["pi","rat"]]
];

const blockSounds = {
  a:"a",i:"i",o:"o",u:"y",é:"e",è:"ɛ",ê:"ɛ",e:"ə",
  l:"l",s:"s",m:"m",f:"f",r:"ʁ",p:"p",t:"t",b:"b",d:"d",n:"n",v:"v",
  ch:"ʃ",ou:"u",on:"ɔ̃",an:"ɑ̃",en:"ɑ̃",in:"ɛ̃",gn:"ɲ",c:"k",g:"ɡ",
  ai:"ɛ",ei:"ɛ",au:"o",eau:"o",j:"ʒ",z:"z",ss:"s",qu:"k",ç:"s",
  gu:"ɡ",ge:"ʒ",oin:"wɛ̃",eu:"ø",œu:"œ",ain:"ɛ̃",ein:"ɛ̃",
  ill:"j",y:"j",k:"k",ph:"f",oi:"wa",ui:"ɥi"
};
function soundBlocks(text, graph) {
  const compound = /^(eau|oin|ain|ein|ouille|aille|ille|ch|gn|ph|ss|qu|ou|oi|ui|ai|ei|au|an|en|in|on|eu|œu)/u;
  const blocks = [];
  for (let cursor = 0; cursor < text.length;) {
    const rest = text.slice(cursor);
    let token = rest.match(compound)?.[0] || rest[0];
    if (graph === "gu" && rest.startsWith("gu")) token = "gu";
    if (graph === "ge devant a, o" && rest.startsWith("ge")) token = "ge";
    let sound = blockSounds[token];
    if (token === "c" && /^[eéi]/u.test(rest.slice(1))) sound = "s";
    if (token === "g" && /^[eéi]/u.test(rest.slice(1))) sound = "ʒ";
    if (token === "s" && graph === "s entre voyelles") sound = "z";
    if (token === "o" && /^(ol|or|oc|og)$/u.test(rest)) sound = "ɔ";
    if (token === "ouille" || token === "aille" || token === "ille") {
      const vowel = token.slice(0,-4);
      blocks.push({token:vowel,sound:blockSounds[vowel]});
      blocks.push({token:"ille",sound:"j"});
      cursor += token.length;
      continue;
    }
    if (token === "e" && rest === "e" && cursor && graph === "s entre voyelles") sound = null;
    if (token === "h") sound = null;
    blocks.push({token,sound});
    cursor += token.length;
  }
  return blocks;
}
