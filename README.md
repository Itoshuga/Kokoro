# Kokoro

Base Next.js avec App Router, TypeScript en mode strict, Tailwind CSS et ESLint.

Les scripts de développement et de compilation utilisent Webpack, pris en charge
par Next.js, car Turbopack échoue lors de la transformation CSS dans cet
environnement Windows. TypeScript 6 est utilisé pour rester compatible avec le
lint officiel de Next.js.

## Démarrage

Prérequis : Node.js 24 ou version ultérieure et npm. L’import et les tests utilisent
le support TypeScript natif de Node.js, sans dépendance supplémentaire.

```bash
npm ci
npm run dev
```

Ouvrir [localhost:3000](http://localhost:3000).

## Commandes

```bash
npm run lint       # Vérification ESLint
npm run typecheck  # Génération des types Next.js et vérification TypeScript
npm test           # Normalisation, données réelles, recherche, raretés et rōmaji
npm run build      # Compilation pour la production
npm start          # Serveur de production, après compilation
```

## Structure

```text
public/             Ressources statiques
src/
  app/              Pages, layouts et routes
  components/       Composants React réutilisables
  lib/              Utilitaires et configurations
  hooks/            Hooks personnalisés
  types/            Définitions TypeScript partagées
  constants/        Constantes globales
  styles/           Styles globaux et complémentaires
```

L’alias `@/*` pointe vers `src/*`. Les dossiers réservés aux futures fonctionnalités
contiennent uniquement un `.gitkeep` pour être conservés par Git.

La page d’accueil reste un composant serveur : elle affiche le nom Kokoro au centre
de l’écran sur fond blanc cassé. La typographie utilise les polices système, sans
chargement externe. Les métadonnées sont définies dans `src/app/layout.tsx` et les
couleurs globales dans `src/styles/globals.css`.

## Aperçu des cartes

La route `/cards-preview` reprend les cinq cartes et l’inspection du prototype
HTML : reflets holographiques, survol 3D, retournement et navigation circulaire.
Le sélecteur typographique est supprimé. Les glyphes de cartes utilisent toujours
Yuji Boku ; DM Sans et Noto Serif JP conservent les textes du prototype. Les trois
polices WOFF2 sont hébergées dans `public/fonts/`, avec leurs licences, sans requête
Google à la compilation ou à la visite. Le découpage Unicode charge seulement les
sous-ensembles nécessaires au texte affiché, tout en conservant les autres kanjis
pour les futures cartes.

- `src/components/kanji-card/` : `KanjiCard`, `KanjiCardFront`, `KanjiCardBack`,
  `KanjiCardInspector` et leur module CSS isolé.
- `src/types/kanji-card.ts` : données fortement typées, raretés et collection.
- `src/data/demo-kanji-cards.ts` : les cinq cartes locales de démonstration.
- `src/hooks/use-card-tilt.ts` : inclinaison et éclairage, actualisés au plus une
  fois par image ; le tactile est activé dans l’inspecteur et les préférences de
  réduction des animations sont respectées.

L’inspecteur utilise un dialogue modal natif : focus contenu dans la fenêtre,
retour du focus à la fermeture et arrière-plan inerte. Entrée ou Espace active
les boutons, les flèches gauche/droite changent de carte et Échap ferme la fenêtre.
Le verso masqué est également masqué aux technologies d’assistance.

## Catalogue Origin

`/cards` propose la recherche, les filtres combinés, les tris et la pagination de
24 cartes côté serveur. Les paramètres sont conservés dans l’URL. Le formulaire
Next.js fonctionne aussi sans JavaScript ; les saisies ne chargent pas de gros
index dans le navigateur. Les fiches `/cards/origin-u-xxxx` sont rendues à la demande,
sans génération statique des 13 108 caractères. L’inspecteur est chargé à son ouverture.

- `data/kanji/` : 13 108 kanji normalisés, 2 021 cartes publiées, provenance et notice
  CC BY-SA 4.0. Ces fichiers ne sont pas exposés dans `public/`.
- `scripts/import-kanji.ts` : import reproductible du JSON original, non modifié.
- `src/types/kanji.ts`, `src/types/kanji-card.ts`, `src/types/catalogue.ts` : modèles
  linguistiques, cartes et contrats du dépôt séparés.
- `src/lib/kanji/` : validation, normalisation et sélection de l’édition Origin.
- `src/lib/catalogue/` : requêtes, index de recherche, raretés, présentations et dépôt
  fichier réservé au serveur. Le contrat `CatalogueRepository` pourra être implémenté
  avec Supabase, sans changer les composants de cartes.
- `src/constants/origin.ts` : série, seuils de rareté et exceptions manuelles.
- `src/data/kanji-editorial.ts` : traduction française éditoriale de 龍, sans écraser
  la source. Les cinq cartes du prototype gardent leurs raretés et numéros 001–005.
- `src/components/catalogue/`, `src/app/cards/` : interface, pagination et fiches.
- `tests/` : tests natifs Node.js, dont les invariants du référentiel complet.

Le cache serveur charge les JSON une fois par processus et prépare les cinq ordres
de tri ainsi que les chaînes de recherche. Seules les 24 vues de cartes demandées
sont transmises au composant client. Les valeurs manquantes restent explicites ; les
longs libellés sont limités à deux lignes sur la carte, avec leur intégralité sur la
fiche. Le JLPT est présenté comme historique, jamais comme un niveau actuel.

Chaque carte affiche sous le kanji un rōmaji en capitales, calculé côté serveur
avec WanaKana depuis la lecture kun’yomi affichée, ou on’yomi à défaut. La
transcription conserve les okurigana en retirant les marqueurs du dictionnaire.
Les cinq rōmaji du prototype sont préservés ; les lectures source restent intactes.

Pour actualiser les données :

```powershell
npm run data:import -- "C:\chemin\kanji-all.json"
npm test
```

Redémarrer Next.js après un import pour renouveler son cache. Voir la notice dans
`data/kanji/README.md` pour la provenance, la licence et les transformations.
Les fichiers normalisés sont inclus dans le traçage de déploiement Next.js.

Limites de cette étape : dépôt local en lecture seule, une seule édition, aucune
authentification, base Supabase, collection personnelle ou ouverture de booster.
