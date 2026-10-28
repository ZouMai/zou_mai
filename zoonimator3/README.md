# Zoonimator 3 — version de test, projet encore incomplet

Cette page indépendante ne remplace pas `../zoonimator.html`.

## Ce qui fonctionne

- Deux modes : moteur de déduction et enquête de l’élève.
- Cinq réponses, retour sur la dernière réponse, rejet d’une proposition sans perte des réponses précédentes.
- Scores normalisés, sélection par gain d’information, pénalité de données manquantes, mélange probabiliste autorisant une réponse erronée.
- Déductions explicites et suppression de propriétés aux profils identiques ou opposés ; une seule question générale de régime alimentaire par partie.
- Saisie libre française locale avec gestion de l’ambiguïté, négations demandant reformulation, ligatures/accents/pluriels. Les questions hors lexique ne sont pas inventées.
- Loup bleu original de Zoumaï, explications scientifiques, photographies locales sous licences individuelles, crédits visibles.
- Lecture vocale française, transcription vocale à confirmer avant validation, clavier et tactile complets. Le micro est désactivé si l’API n’existe pas.
- Cache hors ligne facultatif, limité au périmètre `zoonimator3/`. La voix peut dépendre d’Internet.

## État des données et limites bloquantes

La version livrée contient **241 fiches taxonomiques, dont 182 proposées dans les parties, et 72 photographies**. Ces nombres sont calculés depuis les fichiers, pas affichés artificiellement. **Le critère de 1 000 animaux documentés et jouables n’est pas atteint.**

La sélection initiale utilise des noms usuels français. GBIF sert à vérifier l’identité et la classification. Animal Diversity Web (Université du Michigan) documente les traits écologiques. Chaque valeur connue possède une provenance dans `traitSources`. Une absence d’information reste `null` et n’est jamais convertie en `false` simplement parce qu’un mot manque. Certains caractères taxonomiques sont déduits explicitement de la classification. Les dénominations communes larges (ex. « dauphin ») servent d’alias d’une espèce représentative ; elles ne signifient pas que toutes les espèces du groupe sont couvertes.

Les sources peuvent être anciennes. La collecte automatique et les déductions taxonomiques nécessitent encore une revue zoologique indépendante. Le contenu n’est pas déclaré entièrement validé pour une utilisation autonome en classe. Les simulations utilisent la base comme oracle : elles ne valident pas la science ni la compréhension réelle des enfants.

Les photos sont acceptées uniquement avec crédit, licence explicite et identification scientifique concordante. Six associations erronées ont été retirées lors du premier audit. Les photos restantes ne sont pas toutes revues visuellement. Leurs licences CC BY-NC-SA imposent notamment un usage non commercial et le maintien des attributions et conditions de partage ; consulter `data/PHOTO-CREDITS.md`.

Les questions manquent encore de traits morphologiques distinctifs pour certaines espèces proches. Le jeu peut atteindre 30 questions, proposer une piste incertaine, puis reconnaître l’échec après trois propositions refusées. Un score relatif élevé n’est pas une probabilité de succès calibrée. La robustesse à une réponse erronée reste limitée et mesurée séparément.

Le mode enquêteur reconnaît un lexique et des formulations locales, pas tout le français. La reconnaissance vocale réelle, la restitution audio et les permissions doivent encore être testées sur les appareils de la classe. L’affichage étroit a été contrôlé dans un navigateur avec une fenêtre intégrée de 390 pixels, pas sur un téléphone physique.

## Fichiers

| Élément | Fichier |
|---|---|
| Interface | `index.html`, `style.css`, `app.mjs` |
| Déduction | `engine.mjs` |
| Questions, définitions, implications | `questions.mjs`, `data/questions-extra.json` |
| Langage local | `language.mjs` |
| Voix | `voice.mjs` |
| Base fixe | `data/animals.json` |
| Images et droits | `data/photos/`, `data/PHOTO-CREDITS.md` |
| Audit | `data/audit.json` |
| Cache hors ligne | `sw.js` |
| Tests et traces | `tests/unit.test.mjs`, `tests/simulate.mjs`, `tests/report.md`, `tests/simulation-report.json` |

## Reproduire

Depuis la racine du dépôt, avec Python 3 et Node.js :

```sh
python zoonimator3/tools/import_animals.py
python zoonimator3/tools/enrich-reviewed.py
python zoonimator3/tools/audit-data.py
node zoonimator3/tools/enrich-taxonomy.mjs
node --test zoonimator3/tests/unit.test.mjs
node zoonimator3/tests/simulate.mjs 182
node zoonimator3/tools/package-offline.mjs
```

La collecte utilise Internet uniquement à la construction. La partie utilise les JSON et les images statiques. Le script de collecte générale GBIF produit des candidats non validés dans un fichier ignoré : il n’ajoute pas automatiquement des espèces obscures au jeu pour atteindre un quota.

## À terminer avant validation complète

1. Passer de 241 à 1 000 fiches pertinentes, documentées et distinctes, avec contrôle des synonymes et des noms français.
2. Enrichir les 59 fiches non jouables et les caractères inconnus des autres ; vérifier chaque trait, les particularités et les exceptions de sexe, d’âge et de domestication.
3. Réduire le nombre de questions, renforcer les distinctions entre espèces proches et la récupération après une erreur.
4. Compléter les photographies avec des licences adaptées et vérifier visuellement chaque identification.
5. Tester les deux modes avec des élèves, la voix et le hors-ligne sur Chrome Android/Safari iOS/tableau numérique.
6. Ne remplacer l’ancien jeu qu’après validation explicite de cette version.
