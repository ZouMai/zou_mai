'use strict';
// Coordonnées en petits carreaux. Les aires sont déduites des figures, jamais saisies séparément.
const AREA_SHAPES={
  r24:{kind:'polygon',points:[[1,1],[7,1],[7,5],[1,5]]},
  p24:{kind:'polygon',points:[[3,1],[9,1],[7,5],[1,5]],method:'slideTriangle'},
  t20:{kind:'polygon',points:[[1,5],[9,5],[5,0]]},
  c24:{kind:'polygon',points:[[1,1],[9,1],[9,5],[1,5],[1,4],[5,4],[5,2],[1,2]]},
  t14:{kind:'polygon',points:[[1,5],[8,5],[1,1]],method:'doubleTriangle'},
  curve40:{kind:'curve',base:[1,1,8,5],method:'slideSemicircle'},
  trap42:{kind:'polygon',points:[[4,1],[8,1],[11,7],[1,7]],method:'slideTrapezoid'},
  dia24:{kind:'polygon',points:[[6,1],[10,4],[6,7],[2,4]],method:'diamondBox'},
  p48:{kind:'polygon',points:[[3,1],[11,1],[9,7],[1,7]]},
  t30:{kind:'polygon',points:[[1,7],[11,7],[6,1]]},
  trap20:{kind:'polygon',points:[[3,1],[7,1],[8,5],[2,5]],method:'slideTrapezoid'},
  dia18:{kind:'polygon',points:[[5,1],[8,4],[5,7],[2,4]],method:'diamondBox'},
  ring36:{kind:'cutout',outer:[[1,1],[9,1],[9,7],[1,7]],holes:[[[3,2],[6,2],[6,6],[3,6]]]},
  t15a:{kind:'polygon',points:[[1,6],[11,6],[3,3]]},
  t15b:{kind:'polygon',points:[[1,6],[11,6],[8,3]]},
  l42:{kind:'polygon',points:[[1,1],[10,1],[10,7],[1,7],[1,5],[4,5],[4,1]]},
  p32:{kind:'polygon',points:[[2,1],[10,1],[8,5],[0,5]]},
  trap32:{kind:'polygon',points:[[4,1],[10,1],[11,5],[1,5]]},
  conc32:{kind:'polygon',points:[[1,1],[9,1],[9,7],[1,7],[1,6],[5,6],[5,2],[1,2]]},
  t24:{kind:'polygon',points:[[1,7],[9,7],[1,1]],method:'doubleTriangle'},
  r32:{kind:'polygon',points:[[1,1],[9,1],[9,5],[1,5]]},
  r40:{kind:'polygon',points:[[1,1],[9,1],[9,6],[1,6]]},
  r48:{kind:'polygon',points:[[1,1],[9,1],[9,7],[1,7]]},
  cut26:{kind:'cutout',outer:[[1,1],[9,1],[9,6],[1,6]],holes:[[[2,2],[4,2],[4,6],[2,6]],[[5,2],[8,2],[8,4],[5,4]]]},
  mosaicA:{kind:'tiles',rows:['..#...#.....','...#.#......','..#####.....','.##.#.##....','.########...','.#.#..#.#...','.########...','..##..##....']},
  mosaicB:{kind:'tiles',rows:['##..##.##...','..######....','..#..#..#...','.########...','.#.#..#.#...','.########...','..###.###...','..##...#....']},
  mosaicC:{kind:'tiles',rows:['..##..##....','.########...','.#..##..#...','.########...','..#....#....','..##..##....']},
  mosaicTriangles:{kind:'tiles',triangles:true,rows:['..#..#......','..####......','.#a##b#.....','.######.....','..#..#......','..a..b......']}
};
// Dix situations distinctes. Chaque comparaison partage la même unité.
const AREA_ITEMS=[
  {kind:'multi',figures:['r24','p24','t20','c24'],unit:1,excludeReference:true,prompt:'Quelles figures ont exactement la même aire que A ?',solution:'B et D. Le parallélogramme et la figure à creux peuvent être réarrangés pour couvrir les 24 carreaux du rectangle A.'},
  {kind:'number',figures:['t14'],unit:1,prompt:'Quelle est l’aire de ce grand triangle rectangle ?',solution:'Imagine le même triangle tourné pour compléter un rectangle de 7 sur 4 carreaux. Le triangle représente la moitié de 28, soit 14 unités.'},
  {kind:'number',figures:['p24'],unit:1,prompt:'Coupe mentalement la pointe gauche et place-la à droite. Quelle aire obtiens-tu ?',solution:'La pointe se déplace vers la droite : la figure devient un rectangle de 6 sur 4 carreaux, soit 24 unités.'},
  {kind:'number',figures:['curve40'],unit:1,prompt:'La bosse arrondie et le creux sont identiques. Quelle est l’aire de la figure ?',solution:'Déplace le demi-cercle de droite dans le creux de gauche. Tu retrouves un rectangle de 8 sur 5 carreaux, soit 40 unités.'},
  {kind:'choice',figures:['mosaicA','mosaicB'],unit:1,goal:'largest',prompt:'Quel personnage demandera le plus de peinture colorée ?',solution:'Compte les cases colorées et regroupe les petites parties : une silhouette plus large n’est pas nécessairement la plus grande surface.'},
  {kind:'number',figures:['trap20'],unit:1,prompt:'Quelle est l’aire du trapèze ? Essaie de déplacer ses deux pointes.',solution:'Les deux pointes peuvent compléter la partie centrale. On obtient un rectangle de 5 sur 4 carreaux, soit 20 unités.'},
  {kind:'number',figures:['dia18'],unit:1,prompt:'Combien d’unités couvre ce losange incliné ?',solution:'Complète le rectangle qui l’entoure : il mesure 6 carreaux sur 6. Le losange en occupe la moitié, soit 18 unités.'},
  {kind:'number',figures:['ring36'],unit:1,prompt:'Quelle surface reste colorée autour du trou blanc ?',solution:'Le grand rectangle couvre 8 × 6 = 48 carreaux. Le trou en occupe 3 × 4 = 12. Il reste 36 unités.'},
  {kind:'order',figures:['trap42','dia24','p48','t30'],unit:2,prompt:'Range ces quatre surfaces de la plus petite à la plus grande aire.',solution:'B (12 u) → D (15 u) → A (21 u) → C (24 u). Une unité correspond à deux petits carreaux.'},
  {kind:'number',figures:['mosaicTriangles'],unit:'trianglePair',prompt:'Deux petits triangles forment une unité. Quelle est l’aire colorée ?',solution:'Regroupe les demi-carreaux triangulaires deux par deux, puis compte avec l’unité indiquée.'}
];
