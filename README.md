# Kokoro

Base Next.js avec App Router, TypeScript en mode strict, Tailwind CSS et ESLint.

Les scripts de développement et de compilation utilisent Webpack, pris en charge
par Next.js, car Turbopack échoue lors de la transformation CSS dans cet
environnement Windows. TypeScript 6 est utilisé pour rester compatible avec le
lint officiel de Next.js.

## Démarrage

Prérequis : Node.js 20.9 ou version ultérieure et npm.

```bash
npm ci
npm run dev
```

Ouvrir [localhost:3000](http://localhost:3000).

## Commandes

```bash
npm run lint       # Vérification ESLint
npm run typecheck  # Génération des types Next.js et vérification TypeScript
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
  fois par image et désactivés sur écran tactile ou avec les animations réduites.

L’inspecteur utilise un dialogue modal natif : focus contenu dans la fenêtre,
retour du focus à la fermeture et arrière-plan inerte. Entrée ou Espace active
les boutons, les flèches gauche/droite changent de carte et Échap ferme la fenêtre.
Le verso masqué est également masqué aux technologies d’assistance.
