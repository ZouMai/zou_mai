# Zoonimator 3 — rapport de simulation

241 fiches présentes ; 182 jouables. 182 animaux distincts testés, 728 parties simulées.

**Limite :** les réponses sont produites depuis la même base que le moteur. Ces tests mesurent la déduction et sa robustesse, pas la véracité biologique ni l’usage par des enfants.

| Scénario | Première proposition correcte | Trouvé en ≤ 3 propositions | Questions moyennes | Médiane | P90 |
|---|---:|---:|---:|---:|---:|
| clean | 162/182 (89.0 %) | 181/182 (99.5 %) | 20.2 | 17 | 30 |
| one_error | 86/182 (47.3 %) | 132/182 (72.5 %) | 22.6 | 21 | 30 |
| unknown_20pct | 135/182 (74.2 %) | 171/182 (94.0 %) | 22.8 | 23 | 30 |
| uncertain_33pct | 157/182 (86.3 %) | 180/182 (98.9 %) | 24.3 | 27 | 30 |

Le scénario une erreur inverse la première réponse connue après deux questions. Les autres scénarios rendent une réponse sur cinq inconnue ou une sur trois probable. Une proposition de faible confiance est autorisée uniquement à l’épuisement des questions ou après 30 questions.

## Audit automatique

- Doublons d’identifiants : 0.
- Doublons de noms scientifiques : 0.
- Noms français manquants : 0.
- Classifications manquantes : 0.
- Fiches sans références : 0.
- Photographies : 72, dont 72 avec les quatre champs src/crédit/licence/source. Ce contrôle de métadonnées n’est pas une validation visuelle.
- Groupes de profils indiscernables : 0.
- Violations des invariants pendant les parties : 0.

## Animaux imposés

| Animal | Première proposition correcte, sans erreur | Questions | Avec une erreur, retrouvé en ≤ 3 propositions |
|---|---:|---:|---:|
| Vache | oui | 16 | oui |
| Cheval | oui | 17 | oui |
| Chat domestique | oui | 16 | non |
| Chien domestique | oui | 20 | oui |
| Grand dauphin | oui | 15 | oui |
| Requin blanc | oui | 18 | oui |
| Pipistrelle commune | oui | 16 | oui |
| Ornithorynque | oui | 19 | non |
| Anax de juin | oui | 18 | oui |

Les traces, propositions, probabilités et profils indiscernables sont conservés dans `simulation-report.json`.
