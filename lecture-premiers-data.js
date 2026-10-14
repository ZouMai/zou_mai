const CATEGORIES = [["Où est-on ?", "Trouve le lieu.", "⌂", "#bae1d5"], ["Que fait-on ?", "Imagine ce qui se passe.", "→", "#c5d9f4"], ["Pourquoi ?", "Trouve la raison.", "?", "#f0db9d"], ["Que ressent-on ?", "Comprends les émotions.", "♡", "#e7c6df"]];
const MISSIONS = [
  {
    "id": "premiers-1",
    "cat": 0,
    "title": "Petite histoire 01",
    "sentences": [
      "Noé enfile son maillot.",
      "Il descend dans le grand bassin."
    ],
    "question": "Où est Noé ?",
    "answers": [
      "À la piscine",
      "À la bibliothèque"
    ],
    "correct": 0,
    "explanation": "Le maillot et le bassin font penser à la piscine.",
    "hints": [
      "Où peut-on nager ?"
    ],
    "evidence": null,
    "level": 1
  },
  {
    "id": "premiers-2",
    "cat": 0,
    "title": "Petite histoire 02",
    "sentences": [
      "Lina choisit un livre.",
      "Elle le rapporte une semaine après."
    ],
    "question": "Où a-t-elle pris ce livre ?",
    "answers": [
      "À la bibliothèque",
      "À la boulangerie"
    ],
    "correct": 0,
    "explanation": "À la bibliothèque, on peut prendre un livre puis le rapporter.",
    "hints": [
      "Dans quel lieu peut-on emprunter un livre ?"
    ],
    "evidence": null,
    "level": 1
  },
  {
    "id": "premiers-3",
    "cat": 0,
    "title": "Petite histoire 03",
    "sentences": [
      "Malo tend la main pour payer.",
      "On lui donne une baguette encore chaude."
    ],
    "question": "Où est Malo ?",
    "answers": [
      "À la boulangerie",
      "À la piscine"
    ],
    "correct": 0,
    "explanation": "Malo achète du pain : il est à la boulangerie.",
    "hints": [
      "Une baguette, c’est du pain."
    ],
    "evidence": null,
    "level": 1
  },
  {
    "id": "premiers-4",
    "cat": 0,
    "title": "Petite histoire 04",
    "sentences": [
      "La salle devient sombre.",
      "Un film apparaît sur le grand écran."
    ],
    "question": "Où est-on ?",
    "answers": [
      "Au cinéma",
      "Au marché"
    ],
    "correct": 0,
    "explanation": "Une salle sombre et un grand écran font penser au cinéma.",
    "hints": [
      "Où va-t-on pour voir un film sur un grand écran ?"
    ],
    "evidence": null,
    "level": 1
  },
  {
    "id": "premiers-5",
    "cat": 0,
    "title": "Petite histoire 05",
    "sentences": [
      "Anna ouvre la bouche.",
      "Une dame examine ses dents avec un petit miroir."
    ],
    "question": "Où est Anna ?",
    "answers": [
      "Chez le dentiste",
      "Chez le coiffeur"
    ],
    "correct": 0,
    "explanation": "Le dentiste examine et soigne les dents.",
    "hints": [
      "Qui regarde les dents ?"
    ],
    "evidence": null,
    "level": 1
  },
  {
    "id": "premiers-6",
    "cat": 1,
    "title": "Petite histoire 06",
    "sentences": [
      "Léo pose deux assiettes sur la table.",
      "Il ajoute les verres."
    ],
    "question": "Que prépare Léo ?",
    "answers": [
      "Un repas",
      "Une course"
    ],
    "correct": 0,
    "explanation": "Les assiettes et les verres servent à manger et à boire.",
    "hints": [
      "À quoi servent les assiettes ?"
    ],
    "evidence": null,
    "level": 1
  },
  {
    "id": "premiers-7",
    "cat": 1,
    "title": "Petite histoire 07",
    "sentences": [
      "Inès pose sa tête sur l’oreiller.",
      "Elle ferme les yeux."
    ],
    "question": "Que va faire Inès ?",
    "answers": [
      "Dormir",
      "Dessiner"
    ],
    "correct": 0,
    "explanation": "L’oreiller et les yeux fermés indiquent qu’elle va dormir.",
    "hints": [
      "Pense à ce que tu fais dans ton lit."
    ],
    "evidence": null,
    "level": 1
  },
  {
    "id": "premiers-8",
    "cat": 1,
    "title": "Petite histoire 08",
    "sentences": [
      "Tom tient un arrosoir.",
      "La terre de ses pots est sèche."
    ],
    "question": "Que va faire Tom ?",
    "answers": [
      "Arroser ses plantes",
      "Ranger ses livres"
    ],
    "correct": 0,
    "explanation": "L’arrosoir sert à donner de l’eau aux plantes. La terre en a besoin.",
    "hints": [
      "Que contient un arrosoir ?"
    ],
    "evidence": null,
    "level": 1
  },
  {
    "id": "premiers-9",
    "cat": 1,
    "title": "Petite histoire 09",
    "sentences": [
      "Mia prend ses ciseaux.",
      "Elle suit le trait sur sa feuille."
    ],
    "question": "Que fait Mia ?",
    "answers": [
      "Elle découpe",
      "Elle colle"
    ],
    "correct": 0,
    "explanation": "Mia utilise les ciseaux pour découper le long du trait.",
    "hints": [
      "À quoi servent les ciseaux ?"
    ],
    "evidence": null,
    "level": 1
  },
  {
    "id": "premiers-10",
    "cat": 1,
    "title": "Petite histoire 10",
    "sentences": [
      "Sami pose une valise près de la porte.",
      "Il vérifie son billet de train."
    ],
    "question": "Que va faire Sami ?",
    "answers": [
      "Partir en voyage",
      "Faire la vaisselle"
    ],
    "correct": 0,
    "explanation": "La valise et le billet indiquent qu’il prépare un voyage.",
    "hints": [
      "À quoi sert un billet de train ?"
    ],
    "evidence": null,
    "level": 1
  },
  {
    "id": "premiers-11",
    "cat": 2,
    "title": "Petite histoire 11",
    "sentences": [
      "Lina souffle sur sa soupe avant de la goûter."
    ],
    "question": "Pourquoi souffle-t-elle ?",
    "answers": [
      "La soupe est trop chaude",
      "La soupe est trop froide"
    ],
    "correct": 0,
    "explanation": "Elle souffle pour refroidir la soupe et ne pas se brûler.",
    "hints": [
      "Quand souffles-tu sur ton repas ?"
    ],
    "evidence": null,
    "level": 1
  },
  {
    "id": "premiers-12",
    "cat": 2,
    "title": "Petite histoire 12",
    "sentences": [
      "Hugo prend une serviette.",
      "Ses cheveux dégoulinent."
    ],
    "question": "Pourquoi prend-il une serviette ?",
    "answers": [
      "Pour se sécher",
      "Pour se réchauffer les mains"
    ],
    "correct": 0,
    "explanation": "Ses cheveux sont mouillés. La serviette permet de les sécher.",
    "hints": [
      "« Dégouliner », c’est laisser couler des gouttes."
    ],
    "evidence": null,
    "level": 1
  },
  {
    "id": "premiers-13",
    "cat": 2,
    "title": "Petite histoire 13",
    "sentences": [
      "Le bébé dort.",
      "Zoé parle tout bas près de lui."
    ],
    "question": "Pourquoi parle-t-elle tout bas ?",
    "answers": [
      "Pour ne pas le réveiller",
      "Pour le faire chanter"
    ],
    "correct": 0,
    "explanation": "Zoé évite le bruit pour laisser le bébé dormir.",
    "hints": [
      "Que pourrait faire un grand bruit ?"
    ],
    "evidence": null,
    "level": 1
  },
  {
    "id": "premiers-14",
    "cat": 2,
    "title": "Petite histoire 14",
    "sentences": [
      "Adam ferme les yeux et se bouche les oreilles.",
      "La perceuse tourne près de lui."
    ],
    "question": "Pourquoi se bouche-t-il les oreilles ?",
    "answers": [
      "Le bruit le gêne",
      "Il a froid aux pieds"
    ],
    "correct": 0,
    "explanation": "Une perceuse fait beaucoup de bruit. Adam essaie de moins l’entendre.",
    "hints": [
      "Écoute le bruit d’une perceuse dans ta tête."
    ],
    "evidence": null,
    "level": 1
  },
  {
    "id": "premiers-15",
    "cat": 2,
    "title": "Petite histoire 15",
    "sentences": [
      "Nora cherche de l’ombre.",
      "Le soleil tape et elle transpire."
    ],
    "question": "Pourquoi cherche-t-elle de l’ombre ?",
    "answers": [
      "Elle a trop chaud",
      "Elle a faim"
    ],
    "correct": 0,
    "explanation": "À l’ombre, Nora sera moins exposée au soleil et aura moins chaud.",
    "hints": [
      "Le soleil chauffe. Que ressent Nora ?"
    ],
    "evidence": null,
    "level": 1
  },
  {
    "id": "premiers-16",
    "cat": 3,
    "title": "Petite histoire 16",
    "sentences": [
      "Éva reçoit le cadeau qu’elle espérait.",
      "Elle saute et sourit."
    ],
    "question": "Comment se sent Éva ?",
    "answers": [
      "Heureuse",
      "Déçue"
    ],
    "correct": 0,
    "explanation": "Le cadeau lui plaît. Ses sourires et ses sauts montrent sa joie.",
    "hints": [
      "Regarde ce que fait son visage."
    ],
    "evidence": null,
    "level": 1
  },
  {
    "id": "premiers-17",
    "cat": 3,
    "title": "Petite histoire 17",
    "sentences": [
      "Noé entend un gros chien grogner.",
      "Il recule derrière son père."
    ],
    "question": "Que ressent Noé ?",
    "answers": [
      "De la peur",
      "De la joie"
    ],
    "correct": 0,
    "explanation": "Il recule et se cache : le grognement du chien lui fait peur.",
    "hints": [
      "Pourquoi cherche-t-il à se cacher ?"
    ],
    "evidence": null,
    "level": 1
  },
  {
    "id": "premiers-18",
    "cat": 3,
    "title": "Petite histoire 18",
    "sentences": [
      "Le dessin de Mia est déchiré.",
      "Elle baisse la tête et pleure."
    ],
    "question": "Comment se sent Mia ?",
    "answers": [
      "Triste",
      "Fière"
    ],
    "correct": 0,
    "explanation": "Son dessin est abîmé et elle pleure : cela lui fait de la peine.",
    "hints": [
      "Les larmes et la tête baissée sont des indices."
    ],
    "evidence": null,
    "level": 1
  },
  {
    "id": "premiers-19",
    "cat": 3,
    "title": "Petite histoire 19",
    "sentences": [
      "Le frère de Tom casse sa tour.",
      "Tom fronce les sourcils et crie."
    ],
    "question": "Que ressent Tom ?",
    "answers": [
      "De la colère",
      "Du soulagement"
    ],
    "correct": 0,
    "explanation": "Tom est fâché : sa tour a été cassée. Son visage et ses cris le montrent.",
    "hints": [
      "Que peut-on ressentir quand quelqu’un casse notre construction ?"
    ],
    "evidence": null,
    "level": 1
  },
  {
    "id": "premiers-20",
    "cat": 3,
    "title": "Petite histoire 20",
    "sentences": [
      "Lina retrouve enfin son chat perdu.",
      "Elle souffle et le serre contre elle."
    ],
    "question": "Comment se sent Lina maintenant ?",
    "answers": [
      "Rassurée",
      "Encore plus inquiète"
    ],
    "correct": 0,
    "explanation": "Elle a retrouvé son chat : son inquiétude diminue. Elle est rassurée.",
    "hints": [
      "Son chat n’est plus perdu. A-t-elle encore autant de souci ?"
    ],
    "evidence": null,
    "level": 1
  }
];
