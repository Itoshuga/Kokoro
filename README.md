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
