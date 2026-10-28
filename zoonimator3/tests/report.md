# Zoonimator 3 — rapport de simulation

241 fiches présentes ; 182 jouables. 182 animaux distincts testés, 728 parties simulées.

**Limite :** les réponses sont produites depuis la même base que le moteur. Ces tests mesurent la déduction et sa robustesse, pas la véracité biologique ni l’usage par des enfants.

| Scénario | Première proposition correcte | Trouvé en ≤ 3 propositions | Questions moyennes | Médiane | P90 |
|---|---:|---:|---:|---:|---:|
| clean | 162/182 (89.0 %) | 181/182 (99.5 %) | 22.2 | 20 | 30 |
| one_error | 91/182 (50.0 %) | 131/182 (72.0 %) | 25.8 | 27 | 30 |
| unknown_20pct | 139/182 (76.4 %) | 167/182 (91.8 %) | 24.7 | 26 | 30 |
| uncertain_33pct | 157/182 (86.3 %) | 180/182 (98.9 %) | 26.0 | 30 | 30 |

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
| Chat domestique | oui | 19 | non |
| Chien domestique | oui | 23 | oui |
| Grand dauphin | oui | 18 | oui |
| Requin blanc | oui | 23 | oui |
| Pipistrelle commune | oui | 18 | oui |
| Ornithorynque | oui | 20 | oui |
| Anax de juin | oui | 17 | oui |

Les traces, propositions, probabilités et profils indiscernables sont conservés dans `simulation-report.json`.
