const CATEGORIES = [["Repérer les indices", "Retrouver une information précise.", "◎", "#73d9cf"], ["Lire entre les lignes", "Déduire ce que le texte ne dit pas.", "✧", "#c0a5ff"], ["Suivre les personnages", "Comprendre qui est désigné.", "↔", "#f4a4c3"], ["Comprendre les mots", "S’appuyer sur le contexte.", "Aa", "#f5cd81"], ["Reconstituer l’histoire", "Relier les événements et leurs causes.", "↶", "#98baff"], ["Saisir l’essentiel", "Relier les idées pour comprendre.", "◈", "#abd79a"]];
const MISSIONS = [
  {
    "id": "0-0",
    "cat": 0,
    "title": "Le colis mystérieux",
    "sentences": [
      "La bibliothécaire reçoit trois cartons lundi.",
      "Les livres sur les volcans sont dans le carton bleu, posé sous le bureau.",
      "Le carton rouge contient des romans et le vert des atlas."
    ],
    "question": "Où sont rangés les livres sur les volcans ?",
    "answers": [
      "Dans le carton bleu",
      "Dans le carton rouge",
      "Dans le carton vert"
    ],
    "correct": 0,
    "explanation": "Le texte indique directement le carton bleu. Les atlas sont dans un autre carton.",
    "hints": [
      "Cherche le nom du sujet des livres.",
      "Relis la phrase qui contient « volcans »."
    ],
    "evidence": [
      1
    ],
    "level": 1
  },
  {
    "id": "0-1",
    "cat": 0,
    "title": "Rendez-vous au musée",
    "sentences": [
      "La visite du musée commence à 10 h.",
      "Le groupe se retrouve à 9 h 30 devant la mairie, puis rejoint le musée à pied.",
      "Le retour est prévu à midi."
    ],
    "question": "À quelle heure faut-il être devant la mairie ?",
    "answers": [
      "À 9 h 30",
      "À 10 h",
      "À midi"
    ],
    "correct": 0,
    "explanation": "Il faut distinguer l’heure du rendez-vous de celle du début de la visite.",
    "hints": [
      "Il y a trois horaires, mais ils ne correspondent pas au même moment.",
      "Cherche « se retrouve »."
    ],
    "evidence": [
      1
    ],
    "level": 1
  },
  {
    "id": "0-2",
    "cat": 0,
    "title": "Le refuge des oiseaux",
    "sentences": [
      "Au refuge, les oiseaux blessés sont installés dans une pièce calme.",
      "Les visiteurs peuvent observer les animaux du jardin le mercredi.",
      "La pièce de soins reste réservée aux soigneurs, même ce jour-là."
    ],
    "question": "Quel endroit reste inaccessible aux visiteurs le mercredi ?",
    "answers": [
      "La pièce de soins",
      "Le jardin",
      "Tout le refuge"
    ],
    "correct": 0,
    "explanation": "Même le mercredi, seuls les soigneurs accèdent à la pièce de soins.",
    "hints": [
      "Fais attention à la restriction qui reste valable.",
      "Relis la dernière phrase et le mot « réservée »."
    ],
    "evidence": [
      2
    ],
    "level": 2
  },
  {
    "id": "0-3",
    "cat": 0,
    "title": "La serre de l’école",
    "sentences": [
      "Les CM1 arrosent les semis le lundi et le jeudi.",
      "Les CM2 prennent le relais le mardi et le vendredi.",
      "Cette semaine, vendredi étant férié, les CM2 arroseront exceptionnellement le mercredi."
    ],
    "question": "Cette semaine, quels jours les CM2 arrosent-ils ?",
    "answers": [
      "Mardi et mercredi",
      "Mardi et vendredi",
      "Lundi et jeudi"
    ],
    "correct": 0,
    "explanation": "Le mardi est maintenu ; seul le vendredi est remplacé par le mercredi.",
    "hints": [
      "Distingue l’organisation habituelle de l’exception.",
      "Le changement ne concerne qu’un des deux jours."
    ],
    "evidence": null,
    "level": 2
  },
  {
    "id": "0-4",
    "cat": 0,
    "title": "Le carnet d’expédition",
    "sentences": [
      "Avant le départ, chacun reçoit une gourde et une carte.",
      "Les jumelles sont prêtées uniquement aux responsables d’observation.",
      "Tous les participants, sauf ceux qui possèdent déjà un carnet, reçoivent aussi un cahier de terrain.",
      "Nina a son propre carnet et sera responsable d’observation."
    ],
    "question": "Que reçoit Nina ?",
    "answers": [
      "Une gourde, une carte et des jumelles",
      "Une gourde, une carte et un cahier",
      "Une carte, des jumelles et un cahier"
    ],
    "correct": 0,
    "explanation": "Nina reçoit le matériel commun et les jumelles liées à son rôle. Elle a déjà un carnet : elle ne reçoit pas de cahier.",
    "hints": [
      "Croise les règles de distribution avec les deux informations sur Nina.",
      "Elle appartient au groupe des observateurs, mais pas au groupe qui a besoin d’un carnet."
    ],
    "evidence": null,
    "level": 3
  },
  {
    "id": "1-0",
    "cat": 1,
    "title": "Le rideau rouge",
    "sentences": [
      "Dans les coulisses, Sam répète sa première réplique.",
      "Il entend le public s’installer derrière le rideau rouge.",
      "Un signal retentit : il entre en scène."
    ],
    "question": "Où se trouve probablement Sam ?",
    "answers": [
      "Dans un théâtre",
      "Dans une salle de cinéma, parmi les spectateurs",
      "Dans une bibliothèque"
    ],
    "correct": 0,
    "explanation": "Les coulisses, la réplique et l’entrée en scène indiquent une représentation théâtrale.",
    "hints": [
      "Relie les mots qui décrivent ce que fait Sam.",
      "Sam joue un rôle devant un public."
    ],
    "evidence": null,
    "level": 1
  },
  {
    "id": "1-1",
    "cat": 1,
    "title": "La place vide",
    "sentences": [
      "Au déjeuner, Zoé a posé deux assiettes.",
      "À quinze heures, elle regarde encore par la fenêtre.",
      "Face à elle, le repas de son frère a refroidi."
    ],
    "question": "Que comprend-on ?",
    "answers": [
      "Son frère n’est probablement pas encore arrivé",
      "Son frère a déjà terminé son repas",
      "Zoé prépare le petit déjeuner"
    ],
    "correct": 0,
    "explanation": "L’assiette intacte et froide, ainsi que l’attente à la fenêtre, suggèrent un retard.",
    "hints": [
      "Observe le repas et l’attitude de Zoé.",
      "Si le repas attend toujours, que peut-on supposer sur l’arrivée du frère ?"
    ],
    "evidence": null,
    "level": 1
  },
  {
    "id": "1-2",
    "cat": 1,
    "title": "Le paquet froissé",
    "sentences": [
      "Lina regarde les morceaux du vase au pied de la table.",
      "Elle entend une clé tourner dans la serrure.",
      "Elle pousse aussitôt les morceaux derrière un carton."
    ],
    "question": "Pourquoi Lina agit-elle ainsi, probablement ?",
    "answers": [
      "Elle veut cacher le vase cassé à la personne qui arrive",
      "Elle prépare le vase pour y mettre des fleurs",
      "Elle souhaite montrer les morceaux à la personne qui arrive"
    ],
    "correct": 0,
    "explanation": "Le geste de cacher les morceaux juste au moment de l’arrivée suggère qu’elle veut dissimuler la casse. On ne sait pas qui a cassé le vase.",
    "hints": [
      "Relie le bruit de la clé au geste de Lina.",
      "Elle cache les morceaux au lieu de les montrer."
    ],
    "evidence": [
      2
    ],
    "level": 2
  },
  {
    "id": "1-3",
    "cat": 1,
    "title": "Le grand plongeon",
    "sentences": [
      "Noé s’approche du bord du bassin, puis recule.",
      "Il serre la main du moniteur et fixe longtemps l’eau.",
      "Enfin, il souffle et saute."
    ],
    "question": "Quelle émotion Noé semble-t-il surmonter ?",
    "answers": [
      "La peur",
      "La colère contre le moniteur",
      "La déception d’avoir déjà sauté"
    ],
    "correct": 0,
    "explanation": "Son recul et son besoin de tenir la main du moniteur suggèrent une appréhension avant le saut.",
    "hints": [
      "Observe les gestes avant le saut.",
      "Pourquoi pourrait-on reculer au bord d’un bassin ?"
    ],
    "evidence": null,
    "level": 2
  },
  {
    "id": "1-4",
    "cat": 1,
    "title": "Un drôle de compliment",
    "sentences": [
      "Après avoir promis de ranger, Tom a laissé ses affaires partout.",
      "Sa sœur ouvre la porte, observe le sol couvert de vêtements et soupire.",
      "« Quel magnifique rangement ! » dit-elle en levant les yeux au ciel."
    ],
    "question": "Que veut-elle faire comprendre ?",
    "answers": [
      "Que Tom n’a pas tenu sa promesse de ranger",
      "Qu’elle admire vraiment la chambre",
      "Qu’elle veut emprunter les vêtements"
    ],
    "correct": 0,
    "explanation": "Ses paroles disent le contraire de ce qu’elle pense : le soupir et le désordre révèlent l’ironie.",
    "hints": [
      "Les paroles correspondent-elles à ce que la sœur voit ?",
      "Compare « magnifique rangement » avec le sol couvert de vêtements."
    ],
    "evidence": null,
    "level": 3
  },
  {
    "id": "2-0",
    "cat": 2,
    "title": "Le livre prêté",
    "sentences": [
      "Maya prête un roman à Jules.",
      "Il le glisse dans son sac avant de la remercier."
    ],
    "question": "Qui désigne « Il » ?",
    "answers": [
      "Jules",
      "Maya",
      "Le roman"
    ],
    "correct": 0,
    "explanation": "Jules est celui qui reçoit le livre, le range et remercie Maya.",
    "hints": [
      "Cherche la personne qui reçoit le roman.",
      "Remplace « Il » par chaque prénom."
    ],
    "evidence": [
      0
    ],
    "level": 1
  },
  {
    "id": "2-1",
    "cat": 2,
    "title": "Le chat du voisin",
    "sentences": [
      "Un chat roux attend devant la porte.",
      "L’animal miaule lorsque Lou arrive.",
      "Elle lui apporte un bol d’eau."
    ],
    "question": "Qui désigne « lui » ?",
    "answers": [
      "Le chat",
      "Lou",
      "Le voisin"
    ],
    "correct": 0,
    "explanation": "Lou apporte l’eau au chat. « L’animal » et « lui » désignent ce même chat.",
    "hints": [
      "Demande-toi qui reçoit le bol.",
      "Remplace « lui » par « au chat »."
    ],
    "evidence": null,
    "level": 1
  },
  {
    "id": "2-2",
    "cat": 2,
    "title": "Deux exploratrices",
    "sentences": [
      "Sarah rejoint Inès près du sentier.",
      "Cette dernière tient la carte, tandis que Sarah porte la boussole.",
      "Les deux exploratrices cherchent un passage."
    ],
    "question": "Qui tient la carte ?",
    "answers": [
      "Inès",
      "Sarah",
      "Les deux filles ensemble"
    ],
    "correct": 0,
    "explanation": "« Cette dernière » reprend la dernière personne nommée : Inès.",
    "hints": [
      "L’expression indique la dernière personne citée.",
      "Relis l’ordre des prénoms dans la première phrase."
    ],
    "evidence": [
      0
    ],
    "level": 2
  },
  {
    "id": "2-3",
    "cat": 2,
    "title": "Le trésor des jardiniers",
    "sentences": [
      "Les élèves récoltent des tomates et des radis.",
      "Ils lavent les légumes, puis les déposent dans une cagette.",
      "Le gardien leur ouvre la remise."
    ],
    "question": "Que désigne « les » dans « les déposent » ?",
    "answers": [
      "Les légumes",
      "Les élèves",
      "Les cagettes"
    ],
    "correct": 0,
    "explanation": "Ce sont les légumes qui sont lavés et déposés. « Ils » désigne les élèves ; « leur » aussi.",
    "hints": [
      "Quel élément peut être déposé dans une cagette ?",
      "Cherche le groupe de mots repris juste avant « puis »."
    ],
    "evidence": [
      1
    ],
    "level": 2
  },
  {
    "id": "2-4",
    "cat": 2,
    "title": "Le message transmis",
    "sentences": [
      "Éva confie à Lila une enveloppe pour son grand-père.",
      "« Je la lui donnerai demain », promet Lila.",
      "Éva remercie son amie avant de partir."
    ],
    "question": "Dans la promesse de Lila, que désignent « la » et « lui » ?",
    "answers": [
      "« la » : l’enveloppe ; « lui » : le grand-père",
      "« la » : Éva ; « lui » : l’enveloppe",
      "« la » : Lila ; « lui » : le grand-père"
    ],
    "correct": 0,
    "explanation": "Lila donnera l’enveloppe au grand-père : « la » remplace l’objet et « lui » son destinataire.",
    "hints": [
      "Distingue ce qui est donné de la personne qui le reçoit.",
      "Reformule : « Je donnerai … à … demain »."
    ],
    "evidence": [
      0
    ],
    "level": 3
  },
  {
    "id": "3-0",
    "cat": 3,
    "title": "Un repas frugal",
    "sentences": [
      "Après la promenade, les marcheurs prennent un repas frugal.",
      "Une tranche de pain et quelques noix leur suffisent.",
      "Ils repartent sans avoir préparé de grand festin."
    ],
    "question": "Que signifie « frugal » ici ?",
    "answers": [
      "Simple et peu abondant",
      "Très copieux",
      "Difficile à transporter"
    ],
    "correct": 0,
    "explanation": "La petite quantité de nourriture et l’absence de festin éclairent le sens de « frugal ».",
    "hints": [
      "Observe ce que les marcheurs mangent.",
      "Est-ce un grand repas ou un repas modeste ?"
    ],
    "evidence": [
      1
    ],
    "level": 1
  },
  {
    "id": "3-1",
    "cat": 3,
    "title": "La cabane vétuste",
    "sentences": [
      "La cabane est vétuste.",
      "Des planches pourries se détachent et le toit laisse passer la pluie.",
      "Personne ne l’a réparée depuis des années."
    ],
    "question": "Que signifie « vétuste » ?",
    "answers": [
      "Vieille et abîmée",
      "Neuve et solide",
      "Petite mais confortable"
    ],
    "correct": 0,
    "explanation": "Les planches pourries et les années sans réparation décrivent une construction usée par le temps.",
    "hints": [
      "Regarde l’état des matériaux.",
      "Le mot décrit l’âge et le mauvais état de la cabane."
    ],
    "evidence": null,
    "level": 1
  },
  {
    "id": "3-2",
    "cat": 3,
    "title": "La réponse évasive",
    "sentences": [
      "« As-tu terminé la maquette ? » demande Yanis.",
      "« J’ai travaillé dessus… Il reste quelques petits trucs… On verra », répond Léa.",
      "Yanis trouve sa réponse évasive."
    ],
    "question": "Une réponse « évasive » est une réponse…",
    "answers": [
      "Qui évite de répondre clairement",
      "Qui donne tous les détails",
      "Qui est prononcée en criant"
    ],
    "correct": 0,
    "explanation": "Léa ne dit pas clairement si la maquette est terminée. Rien n’indique qu’elle crie.",
    "hints": [
      "Yanis obtient-il un oui ou un non clair ?",
      "Observe les hésitations et l’absence de réponse précise."
    ],
    "evidence": [
      1
    ],
    "level": 2
  },
  {
    "id": "3-3",
    "cat": 3,
    "title": "Le sentier escarpé",
    "sentences": [
      "Le sentier devient escarpé.",
      "Pour continuer, les randonneurs doivent grimper sur une pente raide et s’aider des mains.",
      "Ils avancent lentement."
    ],
    "question": "Quel mot pourrait remplacer « escarpé » ?",
    "answers": [
      "Abrupt",
      "Plat",
      "Ombragé"
    ],
    "correct": 0,
    "explanation": "La pente raide et la nécessité de grimper montrent que le sentier est abrupt.",
    "hints": [
      "Cherche une description du relief.",
      "Le mot parle de la pente, pas de l’ombre."
    ],
    "evidence": [
      1
    ],
    "level": 2
  },
  {
    "id": "3-4",
    "cat": 3,
    "title": "Une décision provisoire",
    "sentences": [
      "La cour sera fermée demain, annonce la directrice.",
      "Cette décision est provisoire : après l’inspection du grand arbre, les élèves pourront peut-être y retourner dès jeudi.",
      "En attendant, les récréations auront lieu dans le jardin."
    ],
    "question": "Que signifie « provisoire » ?",
    "answers": [
      "Qui s’applique en attendant une décision ou une situation nouvelle",
      "Qui ne pourra jamais changer",
      "Qui a été prise sans prévenir personne"
    ],
    "correct": 0,
    "explanation": "La fermeture vaut pour le moment ; l’inspection pourra permettre de la lever. « Provisoire » ne garantit pas une réouverture jeudi.",
    "hints": [
      "Cherche ce qui peut faire évoluer la décision.",
      "Les expressions « après l’inspection » et « en attendant » sont utiles."
    ],
    "evidence": null,
    "level": 3
  },
  {
    "id": "4-0",
    "cat": 4,
    "title": "Le cerf-volant",
    "sentences": [
      "Nina assemble les baguettes, puis fixe la toile.",
      "Une fois la ficelle attachée, elle court dans le pré.",
      "Le cerf-volant s’élève."
    ],
    "question": "Que fait Nina juste avant de courir ?",
    "answers": [
      "Elle attache la ficelle",
      "Elle assemble les baguettes",
      "Elle fixe la toile"
    ],
    "correct": 0,
    "explanation": "La ficelle est attachée après la toile et juste avant la course.",
    "hints": [
      "Suis les étapes dans l’ordre.",
      "Observe « Une fois… »."
    ],
    "evidence": [
      1
    ],
    "level": 1
  },
  {
    "id": "4-1",
    "cat": 4,
    "title": "Le terrain fermé",
    "sentences": [
      "La pluie a inondé le terrain pendant la nuit.",
      "Au matin, l’entraîneuse annule le match.",
      "L’équipe s’entraîne dans le gymnase."
    ],
    "question": "Pourquoi le match est-il annulé ?",
    "answers": [
      "Parce que le terrain est inondé",
      "Parce que l’équipe a déjà joué",
      "Parce que le gymnase est fermé"
    ],
    "correct": 0,
    "explanation": "L’inondation du terrain explique l’annulation ; l’entraînement au gymnase en est une conséquence.",
    "hints": [
      "Cherche l’événement qui rend le terrain inutilisable.",
      "La cause est racontée avant la décision."
    ],
    "evidence": [
      0
    ],
    "level": 1
  },
  {
    "id": "4-2",
    "cat": 4,
    "title": "Le retour en arrière",
    "sentences": [
      "Quand Amir arrive à l’école, son affiche est enfin sèche.",
      "La veille, il l’avait peinte puis laissée près de la fenêtre.",
      "Il peut maintenant la présenter."
    ],
    "question": "Quel événement s’est produit en premier ?",
    "answers": [
      "Amir a peint son affiche",
      "Amir est arrivé à l’école",
      "Amir a présenté son affiche"
    ],
    "correct": 0,
    "explanation": "« La veille » renvoie au jour précédent : l’ordre du récit n’est pas l’ordre des événements.",
    "hints": [
      "Repère le changement de jour.",
      "La deuxième phrase raconte un événement plus ancien."
    ],
    "evidence": [
      1
    ],
    "level": 2
  },
  {
    "id": "4-3",
    "cat": 4,
    "title": "La panne de réveil",
    "sentences": [
      "Le réveil de Jade n’a pas sonné.",
      "Elle part donc plus tard et manque son bus.",
      "Elle rejoint l’école à pied et arrive après le début de la classe."
    ],
    "question": "Quelle chaîne explique son retard ?",
    "answers": [
      "Réveil silencieux → départ tardif → bus manqué → trajet à pied",
      "Bus manqué → réveil silencieux → départ tardif → trajet à pied",
      "Trajet à pied → départ tardif → réveil silencieux → bus manqué"
    ],
    "correct": 0,
    "explanation": "Le réveil est la première cause. Chaque événement entraîne le suivant.",
    "hints": [
      "Commence par ce qui déclenche les autres événements.",
      "Le mot « donc » relie le réveil au départ tardif."
    ],
    "evidence": null,
    "level": 2
  },
  {
    "id": "4-4",
    "cat": 4,
    "title": "Le spectacle sauvé",
    "sentences": [
      "Le public applaudit lorsque le rideau se lève enfin.",
      "Une heure plus tôt, la lampe principale était tombée en panne.",
      "Après plusieurs essais inutiles, la technicienne avait installé une lampe de secours.",
      "Les comédiens avaient alors pu gagner la scène."
    ],
    "question": "Quel est l’ordre réel des événements ?",
    "answers": [
      "Panne → essais → lampe de secours → entrée des comédiens → applaudissements",
      "Applaudissements → panne → essais → entrée → lampe de secours",
      "Panne → lampe de secours → essais → applaudissements → entrée"
    ],
    "correct": 0,
    "explanation": "Le récit commence par la fin, puis revient une heure en arrière. « Après » et « alors » permettent de reconstruire la suite.",
    "hints": [
      "Le premier événement raconté n’est pas le plus ancien.",
      "Pars de « Une heure plus tôt » et suis les actions jusqu’au lever de rideau."
    ],
    "evidence": null,
    "level": 3
  },
  {
    "id": "5-0",
    "cat": 5,
    "title": "Le jardin partagé",
    "sentences": [
      "Sur un terrain abandonné, les habitants installent des carrés de culture.",
      "Les plus âgés montrent aux enfants comment semer.",
      "À la fin de l’été, tous partagent les légumes récoltés."
    ],
    "question": "Quel titre correspond à l’ensemble du texte ?",
    "answers": [
      "Un jardin qui rassemble",
      "La recette de la soupe",
      "Une ville sans habitants"
    ],
    "correct": 0,
    "explanation": "Le texte présente un projet de jardinage collectif, de sa création au partage de la récolte.",
    "hints": [
      "Cherche ce qui relie les trois phrases.",
      "Le jardin fait agir ensemble plusieurs générations."
    ],
    "evidence": null,
    "level": 1
  },
  {
    "id": "5-1",
    "cat": 5,
    "title": "Une seconde vie",
    "sentences": [
      "Au lieu de jeter les livres abîmés, la classe organise un atelier.",
      "Les élèves recollent les pages et renforcent les couvertures.",
      "Les livres réparés rejoignent le coin lecture."
    ],
    "question": "Quel est le meilleur résumé ?",
    "answers": [
      "La classe répare des livres pour pouvoir les utiliser à nouveau",
      "La classe achète de nouveaux livres pour remplacer les anciens",
      "La classe apprend à écrire un roman"
    ],
    "correct": 0,
    "explanation": "Le résumé conserve le problème, l’action et le résultat, sans ajouter un achat absent du texte.",
    "hints": [
      "Que fait la classe du début à la fin ?",
      "Distingue réparer un livre et en acheter un."
    ],
    "evidence": null,
    "level": 1
  },
  {
    "id": "5-2",
    "cat": 5,
    "title": "Le pont de papier",
    "sentences": [
      "Le premier pont de papier d’Aya s’effondre sous une petite voiture.",
      "Aya plie alors la feuille en accordéon et recommence.",
      "Cette fois, le pont supporte la voiture.",
      "Elle note la nouvelle forme dans son carnet."
    ],
    "question": "Quelle idée est surtout illustrée ?",
    "answers": [
      "On peut améliorer une construction en la testant et en la modifiant",
      "Une feuille supporte toujours n’importe quel poids",
      "Il suffit de recommencer exactement la même chose"
    ],
    "correct": 0,
    "explanation": "Aya ne recommence pas à l’identique : elle change la forme du papier après un essai.",
    "hints": [
      "Quelle différence y a-t-il entre les deux essais ?",
      "Le changement de pliage permet une amélioration."
    ],
    "evidence": null,
    "level": 2
  },
  {
    "id": "5-3",
    "cat": 5,
    "title": "Des lumières dans la nuit",
    "sentences": [
      "Dans la rue, les lampadaires restent allumés toute la nuit.",
      "La commune expérimente leur extinction à certaines heures dans quelques quartiers.",
      "Elle veut réduire la consommation d’électricité tout en étudiant les besoins des habitants.",
      "Un bilan sera réalisé après trois mois."
    ],
    "question": "Quelle phrase résume fidèlement le projet ?",
    "answers": [
      "La commune teste une extinction partielle et en évaluera les effets",
      "La commune supprime définitivement tous ses lampadaires",
      "La commune a déjà démontré que tous les habitants préfèrent le noir"
    ],
    "correct": 0,
    "explanation": "Il s’agit d’une expérimentation limitée dans le temps et dans l’espace, dont le bilan reste à faire.",
    "hints": [
      "Attention aux mots « tous », « définitivement » et « déjà ».",
      "Le texte parle d’un test, pas d’une conclusion acquise."
    ],
    "evidence": null,
    "level": 2
  },
  {
    "id": "5-4",
    "cat": 5,
    "title": "La victoire inattendue",
    "sentences": [
      "Pour la course d’orientation, Léo veut partir seul et très vite.",
      "Mais il se trompe de chemin dès la première balise.",
      "Il accepte alors de lire la carte avec ses camarades : l’un repère le nord, une autre compare les sentiers.",
      "Le groupe atteint l’arrivée sans terminer premier.",
      "Léo propose pourtant de refaire équipe la prochaine fois."
    ],
    "question": "Qu’a probablement compris Léo ?",
    "answers": [
      "Coopérer peut aider à réussir, même sans finir premier",
      "La carte est inutile quand on court vite",
      "Une équipe n’a de valeur que si elle gagne"
    ],
    "correct": 0,
    "explanation": "Sa proposition finale montre qu’il a reconnu l’intérêt du travail collectif malgré l’absence de première place.",
    "hints": [
      "Compare l’attitude de Léo au début et à la fin.",
      "Il veut désormais refaire équipe : qu’est-ce qui a changé ?"
    ],
    "evidence": null,
    "level": 3
  }
];
