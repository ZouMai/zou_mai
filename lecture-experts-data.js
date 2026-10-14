const CATEGORIES = [["Gavroche, un refuge", "Victor Hugo · La générosité derrière les mots", "I", "#b9d6e0"], ["Blanquette, un choix", "Alphonse Daudet · Un conflit intérieur", "II", "#d7dca9"], ["Une ficelle, un soupçon", "Guy de Maupassant · Les pièges du jugement", "III", "#d5c5ec"], ["Le costume invisible", "H. C. Andersen · La force du regard des autres", "IV", "#ebc994"], ["Alice et la petite porte", "Lewis Carroll · La logique de l’étrange", "V", "#e5b8c4"], ["Le secret de Silver", "R. L. Stevenson · Apparences et suspense", "VI", "#a9d3bd"]];
const MISSIONS = [
  {
    "id": "expert-0-0",
    "cat": 0,
    "title": "Les Misérables",
    "sentences": [
      "Sous la pluie, deux petits garçons sortent de chez un barbier qui vient de les chasser. Ils ne savent pas où dormir. Gavroche, qui vit lui-même dans la rue, les rejoint et les interroge. Au lieu de prendre un air grave, il se moque gentiment de leurs larmes, comme si leur problème était facile à résoudre.",
      "Il leur achète du pain et les conduit vers la place de la Bastille. Il connaît là un immense éléphant de plâtre, un monument abandonné dont le ventre creux lui sert de logement. Pour atteindre son refuge, il faut franchir une palissade et se hisser dans l’obscurité.",
      "Gavroche présente ce logis misérable avec l’assurance d’un propriétaire fier de sa maison. Ses plaisanteries transforment presque l’expédition en jeu. Pourtant, à l’intérieur, les bruits des rats effraient les petits visiteurs : ce palais n’a rien d’un endroit confortable.",
      "Au moment de dormir, Gavroche prend la main du plus jeune. L’enfant serre cette main et se rassure. Dehors, les patrouilles passent sans découvrir les trois enfants ; la grande silhouette immobile les protège de la pluie et des regards."
    ],
    "question": "Quels deux gestes montrent que Gavroche protège les enfants malgré son ton moqueur ?",
    "answers": [
      "Il leur procure de la nourriture et les rassure au moment de dormir.",
      "Il leur promet une maison confortable et demande au barbier de les reprendre.",
      "Il les cache pour que personne ne puisse les retrouver, puis les laisse seuls.",
      "Il leur apprend à rire du danger sans leur apporter d’aide concrète."
    ],
    "correct": 0,
    "explanation": "Le pain répond à leur faim ; la main tendue apaise leur peur. Ses gestes révèlent une sollicitude que son ton goguenard dissimule.",
    "hints": [
      "Distingue la manière de parler des actions accomplies.",
      "Cherche d’abord la nourriture, puis le geste qui rassure."
    ],
    "evidence": [
      1,
      3
    ],
    "proofSets": [
      [
        1,
        3
      ]
    ],
    "proofInstruction": "Sélectionne les deux passages : celui où il nourrit les enfants et celui où il les rassure.",
    "level": 1,
    "book": {
      "author": "Victor Hugo",
      "work": "Les Misérables",
      "origin": "France · Roman",
      "source": "https://fr.wikisource.org/wiki/Les_Mis%C3%A9rables_(1908)/Tome_4/Livre_6/02",
      "edition": "Quatrième partie, livre VI, chapitre II.",
      "glossary": "Goguenard : qui plaisante avec une pointe de moquerie. Une palissade : une clôture de planches.",
      "text": [
        "Sous la pluie, deux petits garçons sortent de chez un barbier qui vient de les chasser. Ils ne savent pas où dormir. Gavroche, qui vit lui-même dans la rue, les rejoint et les interroge. Au lieu de prendre un air grave, il se moque gentiment de leurs larmes, comme si leur problème était facile à résoudre.",
        "Il leur achète du pain et les conduit vers la place de la Bastille. Il connaît là un immense éléphant de plâtre, un monument abandonné dont le ventre creux lui sert de logement. Pour atteindre son refuge, il faut franchir une palissade et se hisser dans l’obscurité.",
        "Gavroche présente ce logis misérable avec l’assurance d’un propriétaire fier de sa maison. Ses plaisanteries transforment presque l’expédition en jeu. Pourtant, à l’intérieur, les bruits des rats effraient les petits visiteurs : ce palais n’a rien d’un endroit confortable.",
        "Au moment de dormir, Gavroche prend la main du plus jeune. L’enfant serre cette main et se rassure. Dehors, les patrouilles passent sans découvrir les trois enfants ; la grande silhouette immobile les protège de la pluie et des regards."
      ]
    },
    "step": 1
  },
  {
    "id": "expert-0-1",
    "cat": 0,
    "title": "Les Misérables",
    "sentences": [
      "Sous la pluie, deux petits garçons sortent de chez un barbier qui vient de les chasser. Ils ne savent pas où dormir. Gavroche, qui vit lui-même dans la rue, les rejoint et les interroge. Au lieu de prendre un air grave, il se moque gentiment de leurs larmes, comme si leur problème était facile à résoudre.",
      "Il leur achète du pain et les conduit vers la place de la Bastille. Il connaît là un immense éléphant de plâtre, un monument abandonné dont le ventre creux lui sert de logement. Pour atteindre son refuge, il faut franchir une palissade et se hisser dans l’obscurité.",
      "Gavroche présente ce logis misérable avec l’assurance d’un propriétaire fier de sa maison. Ses plaisanteries transforment presque l’expédition en jeu. Pourtant, à l’intérieur, les bruits des rats effraient les petits visiteurs : ce palais n’a rien d’un endroit confortable.",
      "Au moment de dormir, Gavroche prend la main du plus jeune. L’enfant serre cette main et se rassure. Dehors, les patrouilles passent sans découvrir les trois enfants ; la grande silhouette immobile les protège de la pluie et des regards."
    ],
    "question": "Pourquoi l’expression « ce palais » ne doit-elle pas être comprise au sens propre ?",
    "answers": [
      "Elle souligne avec humour l’écart entre la fierté de Gavroche et la misère du refuge.",
      "Elle révèle qu’un véritable souverain habite à l’intérieur de l’éléphant.",
      "Elle prouve que les enfants se sont trompés de bâtiment.",
      "Elle indique que Gavroche possède assez d’argent pour rénover le monument."
    ],
    "correct": 0,
    "explanation": "Le refuge est sombre et peuplé de rats. L’appeler palais montre comment Gavroche transforme, par son attitude, un abri misérable en lieu d’accueil.",
    "hints": [
      "Compare le mot « palais » avec les détails matériels.",
      "Les rats et l’inconfort s’accordent-ils avec l’idée d’un palais ?"
    ],
    "evidence": null,
    "proofSets": null,
    "proofInstruction": "",
    "level": 2,
    "book": {
      "author": "Victor Hugo",
      "work": "Les Misérables",
      "origin": "France · Roman",
      "source": "https://fr.wikisource.org/wiki/Les_Mis%C3%A9rables_(1908)/Tome_4/Livre_6/02",
      "edition": "Quatrième partie, livre VI, chapitre II.",
      "glossary": "Goguenard : qui plaisante avec une pointe de moquerie. Une palissade : une clôture de planches.",
      "text": [
        "Sous la pluie, deux petits garçons sortent de chez un barbier qui vient de les chasser. Ils ne savent pas où dormir. Gavroche, qui vit lui-même dans la rue, les rejoint et les interroge. Au lieu de prendre un air grave, il se moque gentiment de leurs larmes, comme si leur problème était facile à résoudre.",
        "Il leur achète du pain et les conduit vers la place de la Bastille. Il connaît là un immense éléphant de plâtre, un monument abandonné dont le ventre creux lui sert de logement. Pour atteindre son refuge, il faut franchir une palissade et se hisser dans l’obscurité.",
        "Gavroche présente ce logis misérable avec l’assurance d’un propriétaire fier de sa maison. Ses plaisanteries transforment presque l’expédition en jeu. Pourtant, à l’intérieur, les bruits des rats effraient les petits visiteurs : ce palais n’a rien d’un endroit confortable.",
        "Au moment de dormir, Gavroche prend la main du plus jeune. L’enfant serre cette main et se rassure. Dehors, les patrouilles passent sans découvrir les trois enfants ; la grande silhouette immobile les protège de la pluie et des regards."
      ]
    },
    "step": 2
  },
  {
    "id": "expert-0-2",
    "cat": 0,
    "title": "Les Misérables",
    "sentences": [
      "Sous la pluie, deux petits garçons sortent de chez un barbier qui vient de les chasser. Ils ne savent pas où dormir. Gavroche, qui vit lui-même dans la rue, les rejoint et les interroge. Au lieu de prendre un air grave, il se moque gentiment de leurs larmes, comme si leur problème était facile à résoudre.",
      "Il leur achète du pain et les conduit vers la place de la Bastille. Il connaît là un immense éléphant de plâtre, un monument abandonné dont le ventre creux lui sert de logement. Pour atteindre son refuge, il faut franchir une palissade et se hisser dans l’obscurité.",
      "Gavroche présente ce logis misérable avec l’assurance d’un propriétaire fier de sa maison. Ses plaisanteries transforment presque l’expédition en jeu. Pourtant, à l’intérieur, les bruits des rats effraient les petits visiteurs : ce palais n’a rien d’un endroit confortable.",
      "Au moment de dormir, Gavroche prend la main du plus jeune. L’enfant serre cette main et se rassure. Dehors, les patrouilles passent sans découvrir les trois enfants ; la grande silhouette immobile les protège de la pluie et des regards."
    ],
    "question": "Quelle interprétation du rôle de l’éléphant est la mieux soutenue ?",
    "answers": [
      "Un monument abandonné devient protecteur, alors qu’un adulte a repoussé les enfants.",
      "Le monument représente un danger plus important que la rue pour tous les enfants.",
      "Le monument prouve que les autorités ont organisé un accueil confortable.",
      "Le monument aide surtout Gavroche à montrer sa richesse aux autres enfants."
    ],
    "correct": 0,
    "explanation": "Le barbier chasse les petits ; le monument les abrite. Ce contraste invite à réfléchir à l’accueil que les êtres humains leur refusent.",
    "hints": [
      "Compare l’accueil chez le barbier et celui dans le refuge.",
      "Qui repousse les enfants ? Qu’est-ce qui leur offre un abri ?"
    ],
    "evidence": null,
    "proofSets": null,
    "proofInstruction": "",
    "level": 3,
    "book": {
      "author": "Victor Hugo",
      "work": "Les Misérables",
      "origin": "France · Roman",
      "source": "https://fr.wikisource.org/wiki/Les_Mis%C3%A9rables_(1908)/Tome_4/Livre_6/02",
      "edition": "Quatrième partie, livre VI, chapitre II.",
      "glossary": "Goguenard : qui plaisante avec une pointe de moquerie. Une palissade : une clôture de planches.",
      "text": [
        "Sous la pluie, deux petits garçons sortent de chez un barbier qui vient de les chasser. Ils ne savent pas où dormir. Gavroche, qui vit lui-même dans la rue, les rejoint et les interroge. Au lieu de prendre un air grave, il se moque gentiment de leurs larmes, comme si leur problème était facile à résoudre.",
        "Il leur achète du pain et les conduit vers la place de la Bastille. Il connaît là un immense éléphant de plâtre, un monument abandonné dont le ventre creux lui sert de logement. Pour atteindre son refuge, il faut franchir une palissade et se hisser dans l’obscurité.",
        "Gavroche présente ce logis misérable avec l’assurance d’un propriétaire fier de sa maison. Ses plaisanteries transforment presque l’expédition en jeu. Pourtant, à l’intérieur, les bruits des rats effraient les petits visiteurs : ce palais n’a rien d’un endroit confortable.",
        "Au moment de dormir, Gavroche prend la main du plus jeune. L’enfant serre cette main et se rassure. Dehors, les patrouilles passent sans découvrir les trois enfants ; la grande silhouette immobile les protège de la pluie et des regards."
      ]
    },
    "step": 3
  },
  {
    "id": "expert-1-0",
    "cat": 1,
    "title": "La Chèvre de monsieur Seguin",
    "sentences": [
      "Toute la journée, Blanquette a couru dans la montagne. Chez monsieur Seguin, elle avait de l’herbe et des soins, mais une corde l’attachait à son pieu. Ici, aucun lien ne l’arrête. Elle goûte les plantes, bondit parmi les rochers et découvre des espaces qu’elle ne pouvait qu’imaginer depuis son enclos.",
      "Le soir descend. Dans la vallée, les troupeaux rentrent ; les clochettes s’éloignent. Un hurlement rappelle soudain à Blanquette le danger qu’elle avait oublié pendant ses courses. La montagne si accueillante lui paraît désormais bien différente.",
      "Au loin, monsieur Seguin sonne de la trompe pour la faire revenir. La chèvre hésite : elle voudrait retrouver un abri. Mais elle revoit aussi la corde, le pieu et les limites du clos. Après cette journée, elle ne se sent plus capable de reprendre sa vie attachée.",
      "Lorsque le loup apparaît, elle ne croit pas pouvoir le vaincre. Elle décide pourtant de lui résister jusqu’à l’aube, comme une autre chèvre dont elle connaît l’histoire. Le combat dure toute la nuit. Au matin, épuisée, Blanquette est vaincue et mangée."
    ],
    "question": "Entre quelles aspirations Blanquette hésite-t-elle au moment où la trompe sonne ?",
    "answers": [
      "Retrouver la sécurité et conserver sa liberté.",
      "Trouver de quoi manger et gagner une course.",
      "Rester avec son troupeau et obéir au loup.",
      "Se reposer dans la montagne et rencontrer une autre chèvre."
    ],
    "correct": 0,
    "explanation": "Elle désire l’abri, mais la corde lui rappelle l’enfermement. Son choix oppose deux besoins réels, et non un simple oubli du danger.",
    "hints": [
      "Repère ce qu’elle apprécie le jour et ce qu’elle souhaite le soir.",
      "Croise le premier passage avec son hésitation au son de la trompe."
    ],
    "evidence": [
      0,
      2
    ],
    "proofSets": [
      [
        0,
        2
      ]
    ],
    "proofInstruction": "Sélectionne le passage qui décrit sa liberté et celui où elle hésite à retrouver l’abri.",
    "level": 1,
    "book": {
      "author": "Alphonse Daudet",
      "work": "La Chèvre de monsieur Seguin",
      "origin": "France · Récit",
      "source": "https://fr.wikisource.org/wiki/Lettres_de_mon_moulin/La_ch%C3%A8vre_de_monsieur_Seguin",
      "edition": "Lettres de mon moulin. Adaptation de l’épisode de la montagne.",
      "glossary": "Le clos : un terrain entouré d’une clôture. Une trompe : un instrument à vent qui sert ici à appeler.",
      "text": [
        "Toute la journée, Blanquette a couru dans la montagne. Chez monsieur Seguin, elle avait de l’herbe et des soins, mais une corde l’attachait à son pieu. Ici, aucun lien ne l’arrête. Elle goûte les plantes, bondit parmi les rochers et découvre des espaces qu’elle ne pouvait qu’imaginer depuis son enclos.",
        "Le soir descend. Dans la vallée, les troupeaux rentrent ; les clochettes s’éloignent. Un hurlement rappelle soudain à Blanquette le danger qu’elle avait oublié pendant ses courses. La montagne si accueillante lui paraît désormais bien différente.",
        "Au loin, monsieur Seguin sonne de la trompe pour la faire revenir. La chèvre hésite : elle voudrait retrouver un abri. Mais elle revoit aussi la corde, le pieu et les limites du clos. Après cette journée, elle ne se sent plus capable de reprendre sa vie attachée.",
        "Lorsque le loup apparaît, elle ne croit pas pouvoir le vaincre. Elle décide pourtant de lui résister jusqu’à l’aube, comme une autre chèvre dont elle connaît l’histoire. Le combat dure toute la nuit. Au matin, épuisée, Blanquette est vaincue et mangée."
      ]
    },
    "step": 1
  },
  {
    "id": "expert-1-1",
    "cat": 1,
    "title": "La Chèvre de monsieur Seguin",
    "sentences": [
      "Toute la journée, Blanquette a couru dans la montagne. Chez monsieur Seguin, elle avait de l’herbe et des soins, mais une corde l’attachait à son pieu. Ici, aucun lien ne l’arrête. Elle goûte les plantes, bondit parmi les rochers et découvre des espaces qu’elle ne pouvait qu’imaginer depuis son enclos.",
      "Le soir descend. Dans la vallée, les troupeaux rentrent ; les clochettes s’éloignent. Un hurlement rappelle soudain à Blanquette le danger qu’elle avait oublié pendant ses courses. La montagne si accueillante lui paraît désormais bien différente.",
      "Au loin, monsieur Seguin sonne de la trompe pour la faire revenir. La chèvre hésite : elle voudrait retrouver un abri. Mais elle revoit aussi la corde, le pieu et les limites du clos. Après cette journée, elle ne se sent plus capable de reprendre sa vie attachée.",
      "Lorsque le loup apparaît, elle ne croit pas pouvoir le vaincre. Elle décide pourtant de lui résister jusqu’à l’aube, comme une autre chèvre dont elle connaît l’histoire. Le combat dure toute la nuit. Au matin, épuisée, Blanquette est vaincue et mangée."
    ],
    "question": "Pourquoi la décision de combattre n’est-elle pas la preuve qu’elle croit pouvoir gagner ?",
    "answers": [
      "Elle cherche à résister jusqu’à l’aube, tout en pensant ne pas pouvoir vaincre le loup.",
      "Elle sait que monsieur Seguin arrivera avant le lever du jour.",
      "Elle a découvert que le loup a peur de la lumière de la lune.",
      "Elle pense que le combat fera revenir les troupeaux de la vallée."
    ],
    "correct": 0,
    "explanation": "Son objectif est de tenir, pas de tuer le loup. Il faut distinguer le courage d’agir et la certitude de réussir.",
    "hints": [
      "Le texte nomme son objectif précis.",
      "Compare « vaincre » et « résister jusqu’à l’aube »."
    ],
    "evidence": null,
    "proofSets": null,
    "proofInstruction": "",
    "level": 2,
    "book": {
      "author": "Alphonse Daudet",
      "work": "La Chèvre de monsieur Seguin",
      "origin": "France · Récit",
      "source": "https://fr.wikisource.org/wiki/Lettres_de_mon_moulin/La_ch%C3%A8vre_de_monsieur_Seguin",
      "edition": "Lettres de mon moulin. Adaptation de l’épisode de la montagne.",
      "glossary": "Le clos : un terrain entouré d’une clôture. Une trompe : un instrument à vent qui sert ici à appeler.",
      "text": [
        "Toute la journée, Blanquette a couru dans la montagne. Chez monsieur Seguin, elle avait de l’herbe et des soins, mais une corde l’attachait à son pieu. Ici, aucun lien ne l’arrête. Elle goûte les plantes, bondit parmi les rochers et découvre des espaces qu’elle ne pouvait qu’imaginer depuis son enclos.",
        "Le soir descend. Dans la vallée, les troupeaux rentrent ; les clochettes s’éloignent. Un hurlement rappelle soudain à Blanquette le danger qu’elle avait oublié pendant ses courses. La montagne si accueillante lui paraît désormais bien différente.",
        "Au loin, monsieur Seguin sonne de la trompe pour la faire revenir. La chèvre hésite : elle voudrait retrouver un abri. Mais elle revoit aussi la corde, le pieu et les limites du clos. Après cette journée, elle ne se sent plus capable de reprendre sa vie attachée.",
        "Lorsque le loup apparaît, elle ne croit pas pouvoir le vaincre. Elle décide pourtant de lui résister jusqu’à l’aube, comme une autre chèvre dont elle connaît l’histoire. Le combat dure toute la nuit. Au matin, épuisée, Blanquette est vaincue et mangée."
      ]
    },
    "step": 2
  },
  {
    "id": "expert-1-2",
    "cat": 1,
    "title": "La Chèvre de monsieur Seguin",
    "sentences": [
      "Toute la journée, Blanquette a couru dans la montagne. Chez monsieur Seguin, elle avait de l’herbe et des soins, mais une corde l’attachait à son pieu. Ici, aucun lien ne l’arrête. Elle goûte les plantes, bondit parmi les rochers et découvre des espaces qu’elle ne pouvait qu’imaginer depuis son enclos.",
      "Le soir descend. Dans la vallée, les troupeaux rentrent ; les clochettes s’éloignent. Un hurlement rappelle soudain à Blanquette le danger qu’elle avait oublié pendant ses courses. La montagne si accueillante lui paraît désormais bien différente.",
      "Au loin, monsieur Seguin sonne de la trompe pour la faire revenir. La chèvre hésite : elle voudrait retrouver un abri. Mais elle revoit aussi la corde, le pieu et les limites du clos. Après cette journée, elle ne se sent plus capable de reprendre sa vie attachée.",
      "Lorsque le loup apparaît, elle ne croit pas pouvoir le vaincre. Elle décide pourtant de lui résister jusqu’à l’aube, comme une autre chèvre dont elle connaît l’histoire. Le combat dure toute la nuit. Au matin, épuisée, Blanquette est vaincue et mangée."
    ],
    "question": "Quel résumé conserve le mieux la complexité de son choix ?",
    "answers": [
      "Elle découvre la liberté, redoute le danger, mais refuse de retrouver une vie attachée.",
      "Elle quitte un maître cruel parce qu’il ne lui donne jamais à manger.",
      "Elle oublie définitivement l’existence du loup et continue à jouer jusqu’au matin.",
      "Elle décide de rentrer, mais monsieur Seguin lui interdit l’accès à son enclos."
    ],
    "correct": 0,
    "explanation": "Le texte évoque les soins reçus, le plaisir de la liberté et l’hésitation du soir. Une lecture précise garde ensemble ces éléments.",
    "hints": [
      "Écarte les résumés qui inventent une cruauté ou un refus de monsieur Seguin.",
      "Blanquette n’est ni privée de soins ni inconsciente du danger au moment du choix."
    ],
    "evidence": null,
    "proofSets": null,
    "proofInstruction": "",
    "level": 3,
    "book": {
      "author": "Alphonse Daudet",
      "work": "La Chèvre de monsieur Seguin",
      "origin": "France · Récit",
      "source": "https://fr.wikisource.org/wiki/Lettres_de_mon_moulin/La_ch%C3%A8vre_de_monsieur_Seguin",
      "edition": "Lettres de mon moulin. Adaptation de l’épisode de la montagne.",
      "glossary": "Le clos : un terrain entouré d’une clôture. Une trompe : un instrument à vent qui sert ici à appeler.",
      "text": [
        "Toute la journée, Blanquette a couru dans la montagne. Chez monsieur Seguin, elle avait de l’herbe et des soins, mais une corde l’attachait à son pieu. Ici, aucun lien ne l’arrête. Elle goûte les plantes, bondit parmi les rochers et découvre des espaces qu’elle ne pouvait qu’imaginer depuis son enclos.",
        "Le soir descend. Dans la vallée, les troupeaux rentrent ; les clochettes s’éloignent. Un hurlement rappelle soudain à Blanquette le danger qu’elle avait oublié pendant ses courses. La montagne si accueillante lui paraît désormais bien différente.",
        "Au loin, monsieur Seguin sonne de la trompe pour la faire revenir. La chèvre hésite : elle voudrait retrouver un abri. Mais elle revoit aussi la corde, le pieu et les limites du clos. Après cette journée, elle ne se sent plus capable de reprendre sa vie attachée.",
        "Lorsque le loup apparaît, elle ne croit pas pouvoir le vaincre. Elle décide pourtant de lui résister jusqu’à l’aube, comme une autre chèvre dont elle connaît l’histoire. Le combat dure toute la nuit. Au matin, épuisée, Blanquette est vaincue et mangée."
      ]
    },
    "step": 3
  },
  {
    "id": "expert-2-0",
    "cat": 2,
    "title": "La Ficelle",
    "sentences": [
      "Sur le chemin du marché, maître Hauchecorne aperçoit un petit morceau de ficelle. Économe, il se baisse pour le ramasser. En se relevant, il remarque que Malandain, un homme avec qui il s’est disputé, l’observe. Gêné d’être vu occupé à une si petite économie, il cache sa trouvaille.",
      "Plus tard, on annonce la perte d’un portefeuille. Malandain affirme avoir vu Hauchecorne ramasser l’objet. Convoqué devant le maire, Hauchecorne montre sa ficelle et proteste. Les gens écoutent son récit, mais beaucoup sourient : ce petit bout de corde leur semble une excuse trop commode.",
      "Le lendemain, un autre homme rapporte le portefeuille, qu’il a trouvé sur la route. Hauchecorne pense enfin pouvoir convaincre tout le monde. Il raconte partout cette nouvelle, persuadé que la découverte du véritable objet va faire disparaître l’accusation.",
      "Mais certains imaginent maintenant qu’il a fait rendre le portefeuille par un complice. Plus Hauchecorne ajoute de détails pour prouver son innocence, plus ils trouvent son histoire préparée. Il s’épuise à se défendre contre un soupçon que chaque explication semble renforcer."
    ],
    "question": "Pourquoi le geste de Hauchecorne peut-il être mal interprété par Malandain ?",
    "answers": [
      "Il cache par gêne une ficelle, mais ce geste peut ressembler à celui de quelqu’un qui dissimule un objet volé.",
      "Il prend le portefeuille en croyant qu’il appartient à Malandain.",
      "Il cache la ficelle parce qu’il sait déjà qu’un portefeuille a disparu.",
      "Il ramasse volontairement un objet devant Malandain pour le provoquer."
    ],
    "correct": 0,
    "explanation": "Le lecteur connaît le motif du geste ; Malandain ne voit que l’action. L’annonce de la perte donne ensuite une signification trompeuse à cette action.",
    "hints": [
      "Distingue ce que voit Malandain de ce que sait le lecteur.",
      "Compare la gêne racontée au début et l’accusation qui suit."
    ],
    "evidence": [
      0,
      1
    ],
    "proofSets": [
      [
        0,
        1
      ]
    ],
    "proofInstruction": "Sélectionne le passage qui explique le geste et celui qui montre son interprétation par Malandain.",
    "level": 1,
    "book": {
      "author": "Guy de Maupassant",
      "work": "La Ficelle",
      "origin": "France · Nouvelle",
      "source": "https://fr.wikisource.org/wiki/La_Ficelle",
      "edition": "Nouvelle publiée en 1883. Adaptation centrée sur la naissance du soupçon.",
      "glossary": "Économe : qui évite de gaspiller. Un soupçon : l’idée qu’une personne pourrait être coupable, sans certitude.",
      "text": [
        "Sur le chemin du marché, maître Hauchecorne aperçoit un petit morceau de ficelle. Économe, il se baisse pour le ramasser. En se relevant, il remarque que Malandain, un homme avec qui il s’est disputé, l’observe. Gêné d’être vu occupé à une si petite économie, il cache sa trouvaille.",
        "Plus tard, on annonce la perte d’un portefeuille. Malandain affirme avoir vu Hauchecorne ramasser l’objet. Convoqué devant le maire, Hauchecorne montre sa ficelle et proteste. Les gens écoutent son récit, mais beaucoup sourient : ce petit bout de corde leur semble une excuse trop commode.",
        "Le lendemain, un autre homme rapporte le portefeuille, qu’il a trouvé sur la route. Hauchecorne pense enfin pouvoir convaincre tout le monde. Il raconte partout cette nouvelle, persuadé que la découverte du véritable objet va faire disparaître l’accusation.",
        "Mais certains imaginent maintenant qu’il a fait rendre le portefeuille par un complice. Plus Hauchecorne ajoute de détails pour prouver son innocence, plus ils trouvent son histoire préparée. Il s’épuise à se défendre contre un soupçon que chaque explication semble renforcer."
      ]
    },
    "step": 1
  },
  {
    "id": "expert-2-1",
    "cat": 2,
    "title": "La Ficelle",
    "sentences": [
      "Sur le chemin du marché, maître Hauchecorne aperçoit un petit morceau de ficelle. Économe, il se baisse pour le ramasser. En se relevant, il remarque que Malandain, un homme avec qui il s’est disputé, l’observe. Gêné d’être vu occupé à une si petite économie, il cache sa trouvaille.",
      "Plus tard, on annonce la perte d’un portefeuille. Malandain affirme avoir vu Hauchecorne ramasser l’objet. Convoqué devant le maire, Hauchecorne montre sa ficelle et proteste. Les gens écoutent son récit, mais beaucoup sourient : ce petit bout de corde leur semble une excuse trop commode.",
      "Le lendemain, un autre homme rapporte le portefeuille, qu’il a trouvé sur la route. Hauchecorne pense enfin pouvoir convaincre tout le monde. Il raconte partout cette nouvelle, persuadé que la découverte du véritable objet va faire disparaître l’accusation.",
      "Mais certains imaginent maintenant qu’il a fait rendre le portefeuille par un complice. Plus Hauchecorne ajoute de détails pour prouver son innocence, plus ils trouvent son histoire préparée. Il s’épuise à se défendre contre un soupçon que chaque explication semble renforcer."
    ],
    "question": "Que révèle la réaction des villageois après le retour du portefeuille ?",
    "answers": [
      "Ils préfèrent imaginer un complice plutôt que remettre en question leur soupçon.",
      "Ils disposent enfin d’un témoignage direct prouvant un vol commis à deux.",
      "Ils reconnaissent aussitôt qu’ils se sont trompés sur Hauchecorne.",
      "Ils oublient la ficelle et accusent uniquement l’homme qui a rapporté l’objet."
    ],
    "correct": 0,
    "explanation": "La nouvelle hypothèse sauve leur accusation sans apporter de preuve. Ils adaptent leur récit à leur croyance au lieu de réexaminer celle-ci.",
    "hints": [
      "Le retour du portefeuille aurait pu changer leur jugement.",
      "Quel nouveau personnage supposé leur permet de conserver le soupçon ?"
    ],
    "evidence": null,
    "proofSets": null,
    "proofInstruction": "",
    "level": 2,
    "book": {
      "author": "Guy de Maupassant",
      "work": "La Ficelle",
      "origin": "France · Nouvelle",
      "source": "https://fr.wikisource.org/wiki/La_Ficelle",
      "edition": "Nouvelle publiée en 1883. Adaptation centrée sur la naissance du soupçon.",
      "glossary": "Économe : qui évite de gaspiller. Un soupçon : l’idée qu’une personne pourrait être coupable, sans certitude.",
      "text": [
        "Sur le chemin du marché, maître Hauchecorne aperçoit un petit morceau de ficelle. Économe, il se baisse pour le ramasser. En se relevant, il remarque que Malandain, un homme avec qui il s’est disputé, l’observe. Gêné d’être vu occupé à une si petite économie, il cache sa trouvaille.",
        "Plus tard, on annonce la perte d’un portefeuille. Malandain affirme avoir vu Hauchecorne ramasser l’objet. Convoqué devant le maire, Hauchecorne montre sa ficelle et proteste. Les gens écoutent son récit, mais beaucoup sourient : ce petit bout de corde leur semble une excuse trop commode.",
        "Le lendemain, un autre homme rapporte le portefeuille, qu’il a trouvé sur la route. Hauchecorne pense enfin pouvoir convaincre tout le monde. Il raconte partout cette nouvelle, persuadé que la découverte du véritable objet va faire disparaître l’accusation.",
        "Mais certains imaginent maintenant qu’il a fait rendre le portefeuille par un complice. Plus Hauchecorne ajoute de détails pour prouver son innocence, plus ils trouvent son histoire préparée. Il s’épuise à se défendre contre un soupçon que chaque explication semble renforcer."
      ]
    },
    "step": 2
  },
  {
    "id": "expert-2-2",
    "cat": 2,
    "title": "La Ficelle",
    "sentences": [
      "Sur le chemin du marché, maître Hauchecorne aperçoit un petit morceau de ficelle. Économe, il se baisse pour le ramasser. En se relevant, il remarque que Malandain, un homme avec qui il s’est disputé, l’observe. Gêné d’être vu occupé à une si petite économie, il cache sa trouvaille.",
      "Plus tard, on annonce la perte d’un portefeuille. Malandain affirme avoir vu Hauchecorne ramasser l’objet. Convoqué devant le maire, Hauchecorne montre sa ficelle et proteste. Les gens écoutent son récit, mais beaucoup sourient : ce petit bout de corde leur semble une excuse trop commode.",
      "Le lendemain, un autre homme rapporte le portefeuille, qu’il a trouvé sur la route. Hauchecorne pense enfin pouvoir convaincre tout le monde. Il raconte partout cette nouvelle, persuadé que la découverte du véritable objet va faire disparaître l’accusation.",
      "Mais certains imaginent maintenant qu’il a fait rendre le portefeuille par un complice. Plus Hauchecorne ajoute de détails pour prouver son innocence, plus ils trouvent son histoire préparée. Il s’épuise à se défendre contre un soupçon que chaque explication semble renforcer."
    ],
    "question": "Quel effet produit la dernière phrase de cette adaptation ?",
    "answers": [
      "Elle montre un piège : les efforts pour se défendre nourrissent l’accusation.",
      "Elle confirme que le narrateur vient de découvrir la culpabilité de Hauchecorne.",
      "Elle annonce que les villageois ont accepté ses explications.",
      "Elle indique que Hauchecorne ne se soucie plus du jugement des autres."
    ],
    "correct": 0,
    "explanation": "Le lecteur sait qu’il a ramassé une ficelle. L’insistance, qui devait convaincre, devient suspecte : c’est le mécanisme injuste du récit.",
    "hints": [
      "Une défense plus détaillée devrait normalement aider.",
      "Ici, quel effet inverse produit-elle ?"
    ],
    "evidence": null,
    "proofSets": null,
    "proofInstruction": "",
    "level": 3,
    "book": {
      "author": "Guy de Maupassant",
      "work": "La Ficelle",
      "origin": "France · Nouvelle",
      "source": "https://fr.wikisource.org/wiki/La_Ficelle",
      "edition": "Nouvelle publiée en 1883. Adaptation centrée sur la naissance du soupçon.",
      "glossary": "Économe : qui évite de gaspiller. Un soupçon : l’idée qu’une personne pourrait être coupable, sans certitude.",
      "text": [
        "Sur le chemin du marché, maître Hauchecorne aperçoit un petit morceau de ficelle. Économe, il se baisse pour le ramasser. En se relevant, il remarque que Malandain, un homme avec qui il s’est disputé, l’observe. Gêné d’être vu occupé à une si petite économie, il cache sa trouvaille.",
        "Plus tard, on annonce la perte d’un portefeuille. Malandain affirme avoir vu Hauchecorne ramasser l’objet. Convoqué devant le maire, Hauchecorne montre sa ficelle et proteste. Les gens écoutent son récit, mais beaucoup sourient : ce petit bout de corde leur semble une excuse trop commode.",
        "Le lendemain, un autre homme rapporte le portefeuille, qu’il a trouvé sur la route. Hauchecorne pense enfin pouvoir convaincre tout le monde. Il raconte partout cette nouvelle, persuadé que la découverte du véritable objet va faire disparaître l’accusation.",
        "Mais certains imaginent maintenant qu’il a fait rendre le portefeuille par un complice. Plus Hauchecorne ajoute de détails pour prouver son innocence, plus ils trouvent son histoire préparée. Il s’épuise à se défendre contre un soupçon que chaque explication semble renforcer."
      ]
    },
    "step": 3
  },
  {
    "id": "expert-3-0",
    "cat": 3,
    "title": "Les Habits neufs de l’empereur",
    "sentences": [
      "Deux imposteurs proposent à un empereur une étoffe extraordinaire. Ils prétendent qu’elle demeure invisible aux personnes stupides ou incapables d’exercer leur métier. L’empereur les paie ; les hommes installent des métiers à tisser vides et font semblant de travailler avec application.",
      "Un ministre vient examiner le tissu. Il ne voit rien. Au lieu de penser que les tisserands le trompent, il s’inquiète : avouer ce qu’il voit pourrait le faire passer pour un incapable. Il décrit donc avec enthousiasme les couleurs d’une étoffe qui n’existe pas.",
      "L’empereur se rend à son tour à l’atelier. Lui aussi ne voit rien ; lui aussi félicite les artisans. Le jour du défilé, les courtisans font semblant de porter la traîne de son costume invisible. Dans la foule, chacun admire à haute voix les vêtements que personne ne distingue.",
      "Un enfant dit simplement que l’empereur n’a pas d’habit. Ses mots circulent, d’abord à voix basse, puis ouvertement. Le souverain soupçonne que la foule a raison ; pourtant, il continue de marcher avec dignité. Les courtisans continuent, eux aussi, de porter la traîne imaginaire."
    ],
    "question": "Quel mécanisme pousse le ministre à admirer une étoffe qu’il ne voit pas ?",
    "answers": [
      "Les imposteurs associent l’absence de vision à l’incapacité, et le ministre veut protéger sa réputation.",
      "Les imposteurs lui montrent un tissu véritable qu’il reconnaît mal à cause de la lumière.",
      "L’empereur lui ordonne de mentir avant qu’il entre dans l’atelier.",
      "Le ministre a reçu une part de l’argent et participe dès le début à l’escroquerie."
    ],
    "correct": 0,
    "explanation": "Le piège repose sur la peur d’être jugé. Le ministre n’a pas besoin d’être complice des imposteurs pour entretenir leur mensonge.",
    "hints": [
      "Relie la prétendue propriété du tissu à la peur du ministre.",
      "Cherche la règle inventée, puis ce que le ministre craint d’avouer."
    ],
    "evidence": [
      0,
      1
    ],
    "proofSets": [
      [
        0,
        1
      ]
    ],
    "proofInstruction": "Sélectionne le passage qui présente la ruse et celui qui montre la peur du ministre.",
    "level": 1,
    "book": {
      "author": "Hans Christian Andersen",
      "work": "Les Habits neufs de l’empereur",
      "origin": "Danemark · Conte",
      "source": "https://fr.wikisource.org/wiki/Contes_d%E2%80%99Andersen/Les_Habits_neufs_du_Grand-Duc",
      "edition": "Source consultée : traduction de David Soldi, 1876, intitulée Les Habits neufs du Grand-Duc. Le souverain est ici appelé empereur.",
      "glossary": "Un imposteur : une personne qui trompe les autres sur ce qu’elle est ou sait faire. Un courtisan : une personne de l’entourage du souverain.",
      "text": [
        "Deux imposteurs proposent à un empereur une étoffe extraordinaire. Ils prétendent qu’elle demeure invisible aux personnes stupides ou incapables d’exercer leur métier. L’empereur les paie ; les hommes installent des métiers à tisser vides et font semblant de travailler avec application.",
        "Un ministre vient examiner le tissu. Il ne voit rien. Au lieu de penser que les tisserands le trompent, il s’inquiète : avouer ce qu’il voit pourrait le faire passer pour un incapable. Il décrit donc avec enthousiasme les couleurs d’une étoffe qui n’existe pas.",
        "L’empereur se rend à son tour à l’atelier. Lui aussi ne voit rien ; lui aussi félicite les artisans. Le jour du défilé, les courtisans font semblant de porter la traîne de son costume invisible. Dans la foule, chacun admire à haute voix les vêtements que personne ne distingue.",
        "Un enfant dit simplement que l’empereur n’a pas d’habit. Ses mots circulent, d’abord à voix basse, puis ouvertement. Le souverain soupçonne que la foule a raison ; pourtant, il continue de marcher avec dignité. Les courtisans continuent, eux aussi, de porter la traîne imaginaire."
      ]
    },
    "step": 1
  },
  {
    "id": "expert-3-1",
    "cat": 3,
    "title": "Les Habits neufs de l’empereur",
    "sentences": [
      "Deux imposteurs proposent à un empereur une étoffe extraordinaire. Ils prétendent qu’elle demeure invisible aux personnes stupides ou incapables d’exercer leur métier. L’empereur les paie ; les hommes installent des métiers à tisser vides et font semblant de travailler avec application.",
      "Un ministre vient examiner le tissu. Il ne voit rien. Au lieu de penser que les tisserands le trompent, il s’inquiète : avouer ce qu’il voit pourrait le faire passer pour un incapable. Il décrit donc avec enthousiasme les couleurs d’une étoffe qui n’existe pas.",
      "L’empereur se rend à son tour à l’atelier. Lui aussi ne voit rien ; lui aussi félicite les artisans. Le jour du défilé, les courtisans font semblant de porter la traîne de son costume invisible. Dans la foule, chacun admire à haute voix les vêtements que personne ne distingue.",
      "Un enfant dit simplement que l’empereur n’a pas d’habit. Ses mots circulent, d’abord à voix basse, puis ouvertement. Le souverain soupçonne que la foule a raison ; pourtant, il continue de marcher avec dignité. Les courtisans continuent, eux aussi, de porter la traîne imaginaire."
    ],
    "question": "Qu’apporte l’intervention de l’enfant ?",
    "answers": [
      "Une parole publique qui permet aux autres de dire enfin ce qu’ils constatent.",
      "Un pouvoir qui fait disparaître le tissu aux yeux des adultes.",
      "Une preuve que seuls les enfants sont capables de voir cette étoffe.",
      "Un ordre qui oblige les courtisans à arrêter le défilé immédiatement."
    ],
    "correct": 0,
    "explanation": "L’enfant ne change pas la réalité matérielle : il rompt le silence. La vérité déjà visible devient dicible.",
    "hints": [
      "L’étoffe existe-t-elle avant que l’enfant parle ?",
      "Ce qui change est la parole de la foule, pas le costume."
    ],
    "evidence": null,
    "proofSets": null,
    "proofInstruction": "",
    "level": 2,
    "book": {
      "author": "Hans Christian Andersen",
      "work": "Les Habits neufs de l’empereur",
      "origin": "Danemark · Conte",
      "source": "https://fr.wikisource.org/wiki/Contes_d%E2%80%99Andersen/Les_Habits_neufs_du_Grand-Duc",
      "edition": "Source consultée : traduction de David Soldi, 1876, intitulée Les Habits neufs du Grand-Duc. Le souverain est ici appelé empereur.",
      "glossary": "Un imposteur : une personne qui trompe les autres sur ce qu’elle est ou sait faire. Un courtisan : une personne de l’entourage du souverain.",
      "text": [
        "Deux imposteurs proposent à un empereur une étoffe extraordinaire. Ils prétendent qu’elle demeure invisible aux personnes stupides ou incapables d’exercer leur métier. L’empereur les paie ; les hommes installent des métiers à tisser vides et font semblant de travailler avec application.",
        "Un ministre vient examiner le tissu. Il ne voit rien. Au lieu de penser que les tisserands le trompent, il s’inquiète : avouer ce qu’il voit pourrait le faire passer pour un incapable. Il décrit donc avec enthousiasme les couleurs d’une étoffe qui n’existe pas.",
        "L’empereur se rend à son tour à l’atelier. Lui aussi ne voit rien ; lui aussi félicite les artisans. Le jour du défilé, les courtisans font semblant de porter la traîne de son costume invisible. Dans la foule, chacun admire à haute voix les vêtements que personne ne distingue.",
        "Un enfant dit simplement que l’empereur n’a pas d’habit. Ses mots circulent, d’abord à voix basse, puis ouvertement. Le souverain soupçonne que la foule a raison ; pourtant, il continue de marcher avec dignité. Les courtisans continuent, eux aussi, de porter la traîne imaginaire."
      ]
    },
    "step": 2
  },
  {
    "id": "expert-3-2",
    "cat": 3,
    "title": "Les Habits neufs de l’empereur",
    "sentences": [
      "Deux imposteurs proposent à un empereur une étoffe extraordinaire. Ils prétendent qu’elle demeure invisible aux personnes stupides ou incapables d’exercer leur métier. L’empereur les paie ; les hommes installent des métiers à tisser vides et font semblant de travailler avec application.",
      "Un ministre vient examiner le tissu. Il ne voit rien. Au lieu de penser que les tisserands le trompent, il s’inquiète : avouer ce qu’il voit pourrait le faire passer pour un incapable. Il décrit donc avec enthousiasme les couleurs d’une étoffe qui n’existe pas.",
      "L’empereur se rend à son tour à l’atelier. Lui aussi ne voit rien ; lui aussi félicite les artisans. Le jour du défilé, les courtisans font semblant de porter la traîne de son costume invisible. Dans la foule, chacun admire à haute voix les vêtements que personne ne distingue.",
      "Un enfant dit simplement que l’empereur n’a pas d’habit. Ses mots circulent, d’abord à voix basse, puis ouvertement. Le souverain soupçonne que la foule a raison ; pourtant, il continue de marcher avec dignité. Les courtisans continuent, eux aussi, de porter la traîne imaginaire."
    ],
    "question": "Pourquoi la poursuite du défilé rend-elle la fin ironique ?",
    "answers": [
      "L’empereur cherche à préserver sa dignité tout en prolongeant une situation qui le ridiculise.",
      "L’empereur a prouvé qu’il était le seul à porter un costume véritable.",
      "L’empereur obéit à l’enfant qui lui a demandé de continuer.",
      "L’empereur ignore totalement que la foule a commencé à parler."
    ],
    "correct": 0,
    "explanation": "Il soupçonne la vérité, mais continue à sauver les apparences. Le maintien de la cérémonie rend le décalage encore plus visible.",
    "hints": [
      "Compare ce qu’il commence à comprendre et ce qu’il continue à faire.",
      "Rester solennel suffit-il à rendre réel un habit imaginaire ?"
    ],
    "evidence": null,
    "proofSets": null,
    "proofInstruction": "",
    "level": 3,
    "book": {
      "author": "Hans Christian Andersen",
      "work": "Les Habits neufs de l’empereur",
      "origin": "Danemark · Conte",
      "source": "https://fr.wikisource.org/wiki/Contes_d%E2%80%99Andersen/Les_Habits_neufs_du_Grand-Duc",
      "edition": "Source consultée : traduction de David Soldi, 1876, intitulée Les Habits neufs du Grand-Duc. Le souverain est ici appelé empereur.",
      "glossary": "Un imposteur : une personne qui trompe les autres sur ce qu’elle est ou sait faire. Un courtisan : une personne de l’entourage du souverain.",
      "text": [
        "Deux imposteurs proposent à un empereur une étoffe extraordinaire. Ils prétendent qu’elle demeure invisible aux personnes stupides ou incapables d’exercer leur métier. L’empereur les paie ; les hommes installent des métiers à tisser vides et font semblant de travailler avec application.",
        "Un ministre vient examiner le tissu. Il ne voit rien. Au lieu de penser que les tisserands le trompent, il s’inquiète : avouer ce qu’il voit pourrait le faire passer pour un incapable. Il décrit donc avec enthousiasme les couleurs d’une étoffe qui n’existe pas.",
        "L’empereur se rend à son tour à l’atelier. Lui aussi ne voit rien ; lui aussi félicite les artisans. Le jour du défilé, les courtisans font semblant de porter la traîne de son costume invisible. Dans la foule, chacun admire à haute voix les vêtements que personne ne distingue.",
        "Un enfant dit simplement que l’empereur n’a pas d’habit. Ses mots circulent, d’abord à voix basse, puis ouvertement. Le souverain soupçonne que la foule a raison ; pourtant, il continue de marcher avec dignité. Les courtisans continuent, eux aussi, de porter la traîne imaginaire."
      ]
    },
    "step": 3
  },
  {
    "id": "expert-4-0",
    "cat": 4,
    "title": "Alice au pays des merveilles",
    "sentences": [
      "Après avoir suivi un lapin, Alice arrive dans une salle où toutes les portes sont fermées. Une petite clé d’or lui permet d’ouvrir une porte minuscule. Derrière, elle aperçoit un jardin merveilleux. Elle voudrait le rejoindre, mais sa tête ne passe même pas par l’ouverture.",
      "Alice retourne vers une table de verre. Elle y trouve une bouteille portant une invitation à boire. Elle cherche d’abord une indication de poison. N’en voyant pas, elle goûte le liquide, puis le boit. Son corps se met à diminuer, comme un télescope dont les parties rentreraient les unes dans les autres.",
      "À présent assez petite, Alice se réjouit : elle va enfin entrer dans le jardin. Mais la porte est refermée et la clé est restée sur la table. Elle essaie de grimper le long d’un pied ; le verre est trop glissant. Lorsqu’elle était grande, la clé était accessible et le passage trop étroit. Maintenant, c’est l’inverse.",
      "Alice pleure, puis se donne elle-même des conseils, comme si une autre personne pouvait la gronder et l’encourager. Au pied de la table, elle découvre un gâteau. Dans ce monde où les objets modifient la taille des enfants, elle espère encore qu’une nouvelle transformation résoudra son problème."
    ],
    "question": "En quoi le changement de taille crée-t-il un paradoxe pour Alice ?",
    "answers": [
      "Il résout le problème du passage mais rend la clé inaccessible.",
      "Il rend à la fois la porte plus petite et la table plus grande.",
      "Il lui permet d’atteindre la clé mais l’empêche de voir le jardin.",
      "Il ouvre toutes les portes de la salle sauf celle du jardin."
    ],
    "correct": 0,
    "explanation": "Sa taille devient adaptée à la porte, mais plus à la table. Une solution à un obstacle en produit donc un autre.",
    "hints": [
      "Compare les possibilités d’Alice avant et après sa transformation.",
      "Repère le premier obstacle, puis le nouveau."
    ],
    "evidence": [
      0,
      2
    ],
    "proofSets": [
      [
        0,
        2
      ]
    ],
    "proofInstruction": "Sélectionne le passage du premier obstacle et celui qui présente le nouvel obstacle.",
    "level": 1,
    "book": {
      "author": "Lewis Carroll",
      "work": "Alice au pays des merveilles",
      "origin": "Angleterre · Roman",
      "source": "https://fr.wikisource.org/wiki/Alice_au_pays_des_merveilles/1",
      "edition": "Chapitre I. Source consultée : traduction d’Henri Bué, 1869.",
      "glossary": "Se rétracter : devenir plus court en rentrant ses parties les unes dans les autres. Un télescope : un instrument pour observer au loin.",
      "text": [
        "Après avoir suivi un lapin, Alice arrive dans une salle où toutes les portes sont fermées. Une petite clé d’or lui permet d’ouvrir une porte minuscule. Derrière, elle aperçoit un jardin merveilleux. Elle voudrait le rejoindre, mais sa tête ne passe même pas par l’ouverture.",
        "Alice retourne vers une table de verre. Elle y trouve une bouteille portant une invitation à boire. Elle cherche d’abord une indication de poison. N’en voyant pas, elle goûte le liquide, puis le boit. Son corps se met à diminuer, comme un télescope dont les parties rentreraient les unes dans les autres.",
        "À présent assez petite, Alice se réjouit : elle va enfin entrer dans le jardin. Mais la porte est refermée et la clé est restée sur la table. Elle essaie de grimper le long d’un pied ; le verre est trop glissant. Lorsqu’elle était grande, la clé était accessible et le passage trop étroit. Maintenant, c’est l’inverse.",
        "Alice pleure, puis se donne elle-même des conseils, comme si une autre personne pouvait la gronder et l’encourager. Au pied de la table, elle découvre un gâteau. Dans ce monde où les objets modifient la taille des enfants, elle espère encore qu’une nouvelle transformation résoudra son problème."
      ]
    },
    "step": 1
  },
  {
    "id": "expert-4-1",
    "cat": 4,
    "title": "Alice au pays des merveilles",
    "sentences": [
      "Après avoir suivi un lapin, Alice arrive dans une salle où toutes les portes sont fermées. Une petite clé d’or lui permet d’ouvrir une porte minuscule. Derrière, elle aperçoit un jardin merveilleux. Elle voudrait le rejoindre, mais sa tête ne passe même pas par l’ouverture.",
      "Alice retourne vers une table de verre. Elle y trouve une bouteille portant une invitation à boire. Elle cherche d’abord une indication de poison. N’en voyant pas, elle goûte le liquide, puis le boit. Son corps se met à diminuer, comme un télescope dont les parties rentreraient les unes dans les autres.",
      "À présent assez petite, Alice se réjouit : elle va enfin entrer dans le jardin. Mais la porte est refermée et la clé est restée sur la table. Elle essaie de grimper le long d’un pied ; le verre est trop glissant. Lorsqu’elle était grande, la clé était accessible et le passage trop étroit. Maintenant, c’est l’inverse.",
      "Alice pleure, puis se donne elle-même des conseils, comme si une autre personne pouvait la gronder et l’encourager. Au pied de la table, elle découvre un gâteau. Dans ce monde où les objets modifient la taille des enfants, elle espère encore qu’une nouvelle transformation résoudra son problème."
    ],
    "question": "Quelle conclusion sur la prudence d’Alice est la plus juste ?",
    "answers": [
      "Elle essaie d’être prudente, mais l’absence du mot « poison » ne garantit pas que le liquide est sans danger.",
      "Elle possède une preuve suffisante que tout liquide sans cette étiquette est sans danger.",
      "Elle boit sans regarder la bouteille et sans réfléchir un seul instant.",
      "Elle connaît à l’avance l’effet exact de la bouteille sur sa taille."
    ],
    "correct": 0,
    "explanation": "Elle vérifie quelque chose, mais sa vérification est insuffisante. Un lecteur peut comprendre son raisonnement sans le considérer comme valable.",
    "hints": [
      "Sépare l’intention de vérifier de la valeur de cette vérification.",
      "Ne pas lire un avertissement prouve-t-il qu’aucun danger n’existe ?"
    ],
    "evidence": null,
    "proofSets": null,
    "proofInstruction": "",
    "level": 2,
    "book": {
      "author": "Lewis Carroll",
      "work": "Alice au pays des merveilles",
      "origin": "Angleterre · Roman",
      "source": "https://fr.wikisource.org/wiki/Alice_au_pays_des_merveilles/1",
      "edition": "Chapitre I. Source consultée : traduction d’Henri Bué, 1869.",
      "glossary": "Se rétracter : devenir plus court en rentrant ses parties les unes dans les autres. Un télescope : un instrument pour observer au loin.",
      "text": [
        "Après avoir suivi un lapin, Alice arrive dans une salle où toutes les portes sont fermées. Une petite clé d’or lui permet d’ouvrir une porte minuscule. Derrière, elle aperçoit un jardin merveilleux. Elle voudrait le rejoindre, mais sa tête ne passe même pas par l’ouverture.",
        "Alice retourne vers une table de verre. Elle y trouve une bouteille portant une invitation à boire. Elle cherche d’abord une indication de poison. N’en voyant pas, elle goûte le liquide, puis le boit. Son corps se met à diminuer, comme un télescope dont les parties rentreraient les unes dans les autres.",
        "À présent assez petite, Alice se réjouit : elle va enfin entrer dans le jardin. Mais la porte est refermée et la clé est restée sur la table. Elle essaie de grimper le long d’un pied ; le verre est trop glissant. Lorsqu’elle était grande, la clé était accessible et le passage trop étroit. Maintenant, c’est l’inverse.",
        "Alice pleure, puis se donne elle-même des conseils, comme si une autre personne pouvait la gronder et l’encourager. Au pied de la table, elle découvre un gâteau. Dans ce monde où les objets modifient la taille des enfants, elle espère encore qu’une nouvelle transformation résoudra son problème."
      ]
    },
    "step": 2
  },
  {
    "id": "expert-4-2",
    "cat": 4,
    "title": "Alice au pays des merveilles",
    "sentences": [
      "Après avoir suivi un lapin, Alice arrive dans une salle où toutes les portes sont fermées. Une petite clé d’or lui permet d’ouvrir une porte minuscule. Derrière, elle aperçoit un jardin merveilleux. Elle voudrait le rejoindre, mais sa tête ne passe même pas par l’ouverture.",
      "Alice retourne vers une table de verre. Elle y trouve une bouteille portant une invitation à boire. Elle cherche d’abord une indication de poison. N’en voyant pas, elle goûte le liquide, puis le boit. Son corps se met à diminuer, comme un télescope dont les parties rentreraient les unes dans les autres.",
      "À présent assez petite, Alice se réjouit : elle va enfin entrer dans le jardin. Mais la porte est refermée et la clé est restée sur la table. Elle essaie de grimper le long d’un pied ; le verre est trop glissant. Lorsqu’elle était grande, la clé était accessible et le passage trop étroit. Maintenant, c’est l’inverse.",
      "Alice pleure, puis se donne elle-même des conseils, comme si une autre personne pouvait la gronder et l’encourager. Au pied de la table, elle découvre un gâteau. Dans ce monde où les objets modifient la taille des enfants, elle espère encore qu’une nouvelle transformation résoudra son problème."
    ],
    "question": "Quel effet produit le fait qu’Alice se conseille elle-même ?",
    "answers": [
      "Il montre son effort pour se maîtriser tout en créant un dialogue intérieur amusant.",
      "Il révèle qu’une deuxième Alice est réellement cachée sous la table.",
      "Il prouve que le narrateur ne sait pas quel personnage est dans la salle.",
      "Il annonce qu’Alice a trouvé un adulte capable de lui ouvrir la porte."
    ],
    "correct": 0,
    "explanation": "Le texte compare ses conseils à ceux d’une autre personne sans faire apparaître cette personne. Le dialogue intérieur souligne à la fois son désarroi et son énergie.",
    "hints": [
      "Observe l’expression « comme si ».",
      "Une comparaison ne prouve pas qu’un autre personnage existe."
    ],
    "evidence": null,
    "proofSets": null,
    "proofInstruction": "",
    "level": 3,
    "book": {
      "author": "Lewis Carroll",
      "work": "Alice au pays des merveilles",
      "origin": "Angleterre · Roman",
      "source": "https://fr.wikisource.org/wiki/Alice_au_pays_des_merveilles/1",
      "edition": "Chapitre I. Source consultée : traduction d’Henri Bué, 1869.",
      "glossary": "Se rétracter : devenir plus court en rentrant ses parties les unes dans les autres. Un télescope : un instrument pour observer au loin.",
      "text": [
        "Après avoir suivi un lapin, Alice arrive dans une salle où toutes les portes sont fermées. Une petite clé d’or lui permet d’ouvrir une porte minuscule. Derrière, elle aperçoit un jardin merveilleux. Elle voudrait le rejoindre, mais sa tête ne passe même pas par l’ouverture.",
        "Alice retourne vers une table de verre. Elle y trouve une bouteille portant une invitation à boire. Elle cherche d’abord une indication de poison. N’en voyant pas, elle goûte le liquide, puis le boit. Son corps se met à diminuer, comme un télescope dont les parties rentreraient les unes dans les autres.",
        "À présent assez petite, Alice se réjouit : elle va enfin entrer dans le jardin. Mais la porte est refermée et la clé est restée sur la table. Elle essaie de grimper le long d’un pied ; le verre est trop glissant. Lorsqu’elle était grande, la clé était accessible et le passage trop étroit. Maintenant, c’est l’inverse.",
        "Alice pleure, puis se donne elle-même des conseils, comme si une autre personne pouvait la gronder et l’encourager. Au pied de la table, elle découvre un gâteau. Dans ce monde où les objets modifient la taille des enfants, elle espère encore qu’une nouvelle transformation résoudra son problème."
      ]
    },
    "step": 3
  },
  {
    "id": "expert-5-0",
    "cat": 5,
    "title": "L’Île au trésor",
    "sentences": [
      "J’étais caché dans le tonneau de pommes quand j’entendis Silver parler à un jeune marin. Jusqu’alors, le cuisinier m’avait paru un ami bienveillant. Il m’avait souvent félicité pour mon intelligence. À présent, il adressait exactement les mêmes compliments à celui qu’il voulait entraîner dans son projet.",
      "En écoutant, je compris que Silver avait navigué avec des pirates et préparait une mutinerie. Il ne voulait pas agir tout de suite : mieux valait laisser les hommes du capitaine conduire le navire et trouver le trésor. Sa patience n’avait donc rien de rassurant. Il attendait seulement que ses compagnons n’aient plus besoin d’eux.",
      "Soudain, Silver demanda au jeune marin de lui apporter une pomme. Je me raidis au fond du tonneau. Une seconde plus tôt, cette cachette me permettait de découvrir leur secret ; maintenant, un simple geste pouvait révéler ma présence. J’entendis le garçon se lever.",
      "Un autre marin proposa alors d’aller chercher à boire plutôt que des pommes. Le garçon changea de direction. Je restai immobile, soulagé sans être en sécurité. Ceux qui parlaient près de moi ignoraient toujours qu’un témoin connaissait leur projet ; il me faudrait sortir sans leur apprendre ce que je savais."
    ],
    "question": "Pourquoi Jim reconsidère-t-il la gentillesse de Silver ?",
    "answers": [
      "Les compliments répétés et le projet de mutinerie suggèrent une stratégie pour gagner la confiance des autres.",
      "Silver ne lui a jamais adressé la parole avant cette conversation.",
      "Le jeune marin explique que Jim a inventé tous les compliments.",
      "Silver avoue directement à Jim qu’il ne l’a jamais apprécié."
    ],
    "correct": 0,
    "explanation": "Jim rapproche deux indices : des flatteries utilisées avec plusieurs personnes et un projet caché. Il réinterprète alors son expérience passée.",
    "hints": [
      "Compare le souvenir de Jim à ce qu’il découvre en écoutant.",
      "Les compliments ont-ils nécessairement le sens qu’il leur donnait avant ?"
    ],
    "evidence": [
      0,
      1
    ],
    "proofSets": [
      [
        0,
        1
      ]
    ],
    "proofInstruction": "Sélectionne le passage des compliments et celui qui révèle le projet caché.",
    "level": 1,
    "book": {
      "author": "Robert Louis Stevenson",
      "work": "L’Île au trésor",
      "origin": "Écosse · Roman d’aventures",
      "source": "https://fr.wikisource.org/wiki/L%E2%80%99%C3%8Ele_au_tr%C3%A9sor_(trad._Laurie)/Chapitre_11",
      "edition": "Chapitre XI. Source consultée : traduction d’André Laurie, édition Hetzel, 1911. Adaptation à la première personne, racontée par Jim.",
      "glossary": "Une mutinerie : une révolte contre le commandement d’un navire. Flatter : faire des compliments pour plaire ou obtenir quelque chose.",
      "text": [
        "J’étais caché dans le tonneau de pommes quand j’entendis Silver parler à un jeune marin. Jusqu’alors, le cuisinier m’avait paru un ami bienveillant. Il m’avait souvent félicité pour mon intelligence. À présent, il adressait exactement les mêmes compliments à celui qu’il voulait entraîner dans son projet.",
        "En écoutant, je compris que Silver avait navigué avec des pirates et préparait une mutinerie. Il ne voulait pas agir tout de suite : mieux valait laisser les hommes du capitaine conduire le navire et trouver le trésor. Sa patience n’avait donc rien de rassurant. Il attendait seulement que ses compagnons n’aient plus besoin d’eux.",
        "Soudain, Silver demanda au jeune marin de lui apporter une pomme. Je me raidis au fond du tonneau. Une seconde plus tôt, cette cachette me permettait de découvrir leur secret ; maintenant, un simple geste pouvait révéler ma présence. J’entendis le garçon se lever.",
        "Un autre marin proposa alors d’aller chercher à boire plutôt que des pommes. Le garçon changea de direction. Je restai immobile, soulagé sans être en sécurité. Ceux qui parlaient près de moi ignoraient toujours qu’un témoin connaissait leur projet ; il me faudrait sortir sans leur apprendre ce que je savais."
      ]
    },
    "step": 1
  },
  {
    "id": "expert-5-1",
    "cat": 5,
    "title": "L’Île au trésor",
    "sentences": [
      "J’étais caché dans le tonneau de pommes quand j’entendis Silver parler à un jeune marin. Jusqu’alors, le cuisinier m’avait paru un ami bienveillant. Il m’avait souvent félicité pour mon intelligence. À présent, il adressait exactement les mêmes compliments à celui qu’il voulait entraîner dans son projet.",
      "En écoutant, je compris que Silver avait navigué avec des pirates et préparait une mutinerie. Il ne voulait pas agir tout de suite : mieux valait laisser les hommes du capitaine conduire le navire et trouver le trésor. Sa patience n’avait donc rien de rassurant. Il attendait seulement que ses compagnons n’aient plus besoin d’eux.",
      "Soudain, Silver demanda au jeune marin de lui apporter une pomme. Je me raidis au fond du tonneau. Une seconde plus tôt, cette cachette me permettait de découvrir leur secret ; maintenant, un simple geste pouvait révéler ma présence. J’entendis le garçon se lever.",
      "Un autre marin proposa alors d’aller chercher à boire plutôt que des pommes. Le garçon changea de direction. Je restai immobile, soulagé sans être en sécurité. Ceux qui parlaient près de moi ignoraient toujours qu’un témoin connaissait leur projet ; il me faudrait sortir sans leur apprendre ce que je savais."
    ],
    "question": "Pourquoi une simple demande de pomme crée-t-elle du suspense ?",
    "answers": [
      "Le lecteur sait que Jim est dans le tonneau, alors que les hommes qui parlent l’ignorent.",
      "Le lecteur sait que les pommes sont empoisonnées, contrairement à Jim.",
      "Jim ignore qu’il est caché dans un tonneau contenant des pommes.",
      "Silver vient de découvrir Jim et lui demande de sortir devant les autres."
    ],
    "correct": 0,
    "explanation": "Le danger vient d’une différence d’information. Le lecteur imagine la découverte imminente de Jim, sans savoir si elle aura lieu.",
    "hints": [
      "Qui connaît la cachette de Jim ?",
      "Le geste serait banal si le tonneau n’abritait pas un témoin."
    ],
    "evidence": null,
    "proofSets": null,
    "proofInstruction": "",
    "level": 2,
    "book": {
      "author": "Robert Louis Stevenson",
      "work": "L’Île au trésor",
      "origin": "Écosse · Roman d’aventures",
      "source": "https://fr.wikisource.org/wiki/L%E2%80%99%C3%8Ele_au_tr%C3%A9sor_(trad._Laurie)/Chapitre_11",
      "edition": "Chapitre XI. Source consultée : traduction d’André Laurie, édition Hetzel, 1911. Adaptation à la première personne, racontée par Jim.",
      "glossary": "Une mutinerie : une révolte contre le commandement d’un navire. Flatter : faire des compliments pour plaire ou obtenir quelque chose.",
      "text": [
        "J’étais caché dans le tonneau de pommes quand j’entendis Silver parler à un jeune marin. Jusqu’alors, le cuisinier m’avait paru un ami bienveillant. Il m’avait souvent félicité pour mon intelligence. À présent, il adressait exactement les mêmes compliments à celui qu’il voulait entraîner dans son projet.",
        "En écoutant, je compris que Silver avait navigué avec des pirates et préparait une mutinerie. Il ne voulait pas agir tout de suite : mieux valait laisser les hommes du capitaine conduire le navire et trouver le trésor. Sa patience n’avait donc rien de rassurant. Il attendait seulement que ses compagnons n’aient plus besoin d’eux.",
        "Soudain, Silver demanda au jeune marin de lui apporter une pomme. Je me raidis au fond du tonneau. Une seconde plus tôt, cette cachette me permettait de découvrir leur secret ; maintenant, un simple geste pouvait révéler ma présence. J’entendis le garçon se lever.",
        "Un autre marin proposa alors d’aller chercher à boire plutôt que des pommes. Le garçon changea de direction. Je restai immobile, soulagé sans être en sécurité. Ceux qui parlaient près de moi ignoraient toujours qu’un témoin connaissait leur projet ; il me faudrait sortir sans leur apprendre ce que je savais."
      ]
    },
    "step": 2
  },
  {
    "id": "expert-5-2",
    "cat": 5,
    "title": "L’Île au trésor",
    "sentences": [
      "J’étais caché dans le tonneau de pommes quand j’entendis Silver parler à un jeune marin. Jusqu’alors, le cuisinier m’avait paru un ami bienveillant. Il m’avait souvent félicité pour mon intelligence. À présent, il adressait exactement les mêmes compliments à celui qu’il voulait entraîner dans son projet.",
      "En écoutant, je compris que Silver avait navigué avec des pirates et préparait une mutinerie. Il ne voulait pas agir tout de suite : mieux valait laisser les hommes du capitaine conduire le navire et trouver le trésor. Sa patience n’avait donc rien de rassurant. Il attendait seulement que ses compagnons n’aient plus besoin d’eux.",
      "Soudain, Silver demanda au jeune marin de lui apporter une pomme. Je me raidis au fond du tonneau. Une seconde plus tôt, cette cachette me permettait de découvrir leur secret ; maintenant, un simple geste pouvait révéler ma présence. J’entendis le garçon se lever.",
      "Un autre marin proposa alors d’aller chercher à boire plutôt que des pommes. Le garçon changea de direction. Je restai immobile, soulagé sans être en sécurité. Ceux qui parlaient près de moi ignoraient toujours qu’un témoin connaissait leur projet ; il me faudrait sortir sans leur apprendre ce que je savais."
    ],
    "question": "Que peut-on affirmer à la fin, sans inventer la suite ?",
    "answers": [
      "Jim a évité une découverte immédiate, mais doit encore sortir et transmettre ce qu’il sait.",
      "Jim est déjà sorti et a prévenu le capitaine sans être vu.",
      "Silver a abandonné son projet en comprenant que Jim l’écoutait.",
      "Tous les marins du navire ont rejoint les mutins."
    ],
    "correct": 0,
    "explanation": "L’adaptation s’arrête avant la sortie. Un bon lecteur distingue ce qui est établi, ce qui reste à accomplir et ce qu’il imagine.",
    "hints": [
      "Relis les derniers verbes : l’action est-elle accomplie ou encore à venir ?",
      "« Il me faudrait sortir » ne veut pas dire « je suis sorti »."
    ],
    "evidence": null,
    "proofSets": null,
    "proofInstruction": "",
    "level": 3,
    "book": {
      "author": "Robert Louis Stevenson",
      "work": "L’Île au trésor",
      "origin": "Écosse · Roman d’aventures",
      "source": "https://fr.wikisource.org/wiki/L%E2%80%99%C3%8Ele_au_tr%C3%A9sor_(trad._Laurie)/Chapitre_11",
      "edition": "Chapitre XI. Source consultée : traduction d’André Laurie, édition Hetzel, 1911. Adaptation à la première personne, racontée par Jim.",
      "glossary": "Une mutinerie : une révolte contre le commandement d’un navire. Flatter : faire des compliments pour plaire ou obtenir quelque chose.",
      "text": [
        "J’étais caché dans le tonneau de pommes quand j’entendis Silver parler à un jeune marin. Jusqu’alors, le cuisinier m’avait paru un ami bienveillant. Il m’avait souvent félicité pour mon intelligence. À présent, il adressait exactement les mêmes compliments à celui qu’il voulait entraîner dans son projet.",
        "En écoutant, je compris que Silver avait navigué avec des pirates et préparait une mutinerie. Il ne voulait pas agir tout de suite : mieux valait laisser les hommes du capitaine conduire le navire et trouver le trésor. Sa patience n’avait donc rien de rassurant. Il attendait seulement que ses compagnons n’aient plus besoin d’eux.",
        "Soudain, Silver demanda au jeune marin de lui apporter une pomme. Je me raidis au fond du tonneau. Une seconde plus tôt, cette cachette me permettait de découvrir leur secret ; maintenant, un simple geste pouvait révéler ma présence. J’entendis le garçon se lever.",
        "Un autre marin proposa alors d’aller chercher à boire plutôt que des pommes. Le garçon changea de direction. Je restai immobile, soulagé sans être en sécurité. Ceux qui parlaient près de moi ignoraient toujours qu’un témoin connaissait leur projet ; il me faudrait sortir sans leur apprendre ce que je savais."
      ]
    },
    "step": 3
  }
];
