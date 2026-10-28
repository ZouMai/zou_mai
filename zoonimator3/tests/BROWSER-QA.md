# Contrôle navigateur — 28 octobre 2026

Contrôle manuel dans Chrome, sur la page locale servie par l’environnement de prévisualisation.

- Chargement des modules et de la base : 182 animaux jouables, 241 fiches affichées.
- Changement de mode par bouton : validé.
- Mode enquêteur, saisie « Est-ce qu’il pond des œufs ? » : réponse canonique et historique affichés.
- Formulation hors domaine : demande de reformulation, aucune réponse inventée.
- Révélation : nom, données et crédits visibles. Ce contrôle a détecté une association photo/espèce erronée provenant de la source ; l’audit de taxon a été renforcé et 6 images retirées avant livraison.
- Mode déduction : réponse tactile « Non » puis nouvelle question, compteur et retour en arrière visibles.
- Largeur étroite : page dans un iframe de 390 × 844 ; largeur utile et largeur du document toutes deux 375 pixels après correction d’un débordement décoratif. Boutons de réponse sur deux colonnes, question et définition lisibles.
- Aucun test sur téléphone physique. Aucun test réel de transcription du microphone ni d’écoute audio. Détection de support et alternative clavier implémentées.
- Installation du service worker et fonctionnement complètement déconnecté à vérifier sur l’hébergement HTTPS : non déclarés validés par cette prévisualisation HTTP.

Ces contrôles ne remplacent pas une séance de test avec les élèves ni une revue zoologique des fiches.

## Correctif du 28 octobre 2026 — exclusions et confirmation

29 tests automatisés passent (`node --test zoonimator3/tests/*.test.mjs`). Le banc DOM minimal charge les vrais gestionnaires de app.mjs et vérifie la confirmation par bouton, Entrée et transcription vocale simulée, puis l’absence de nouvelle question après victoire. Ce test ne remplace pas une vérification du microphone réel ni un test visuel de navigateur.

Après confirmation de mammifère, les autres groupes et leurs sous-groupes sont exclus des questions. Les propriétés partagées restent possibles (nage, vol, ponte, bec, écailles). Les probabilités des candidats restent souples pour conserver la possibilité de récupérer une erreur. Les questions de groupe sont explicitement présentées comme telles, notamment les libellules et demoiselles.

728 simulations relancées : sans erreur, 162/182 premières propositions correctes, 181/182 en trois propositions, moyenne 20,2 questions. Avec une erreur : 132/182 retrouvés en trois propositions. Ces mesures utilisent les fiches du jeu comme oracle et ne valident pas la qualité zoologique.
