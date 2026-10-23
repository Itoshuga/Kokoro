# Données linguistiques de Kokoro

Ce dossier contient des données dérivées de **KANJIDIC2**, © James William Breen
et Electronic Dictionary Research and Development Group (EDRDG), sous
[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).
Les données dérivées redistribuées dans ce dossier conservent cette licence.
Cette notice ne change pas la licence du code de l’application ni celle des polices.

- [Projet et documentation KANJIDIC2](https://www.edrdg.org/wiki/KANJIDIC_Project.html)
- [Conditions et attribution EDRDG](https://www.edrdg.org/edrdg/licence.html)

## Source et transformations

Le JSON source `kanji-all.json`, exporté de KANJIDIC2 le 23 octobre 2026, reste hors
de ce dossier et n’est jamais modifié. Son empreinte SHA-256, toutes ses métadonnées
de provenance, sa version et ses notes sont conservées dans `provenance.json`.

`dictionary.json` conserve les 13 108 caractères et leurs identifiants Unicode,
lectures on/kun, significations françaises et anglaises, listes de nombres de
traits, niveau scolaire, fréquence, ancien niveau JLPT et références de radicaux.
Les autres langues, lectures de noms/autres langues, références de dictionnaires,
variantes graphiques et codes de recherche non utilisés sont retirés. Les tableaux
vides et valeurs `null` restent explicites. Les données SKIP étaient déjà omises
de la source fournie et ne sont pas ajoutées.

Pour les traits, le premier nombre est le décompte accepté selon KANJIDIC2. Les
nombres suivants sont des mécomptes courants signalés par la source : ils sont
conservés, mais ne servent pas au filtre ou au tri principal.

`cards.json` contient uniquement les cartes de l’édition Origin. Les 2 020 entrées
avec français et fréquence sont sélectionnées, ainsi que 龍, conservé du prototype :
**2 021 cartes publiées**. Les autres caractères restent dans le dictionnaire.

Les traductions éditoriales sont séparées dans `src/data/kanji-editorial.ts`.
En particulier, « Dragon » ne remplace jamais la liste française vide de 龍 dans
le dictionnaire. Les exemples et récits des cinq cartes existantes restent des
éléments éditoriaux du prototype ; aucun n’est généré pour les autres.

Le rōmaji est calculé à l’affichage côté serveur avec WanaKana, à partir de la
première lecture kun’yomi disponible, ou de la première on’yomi à défaut. Les
points d’okurigana et tirets d’affixe sont retirés pour la transcription, sans
modifier les lectures du dictionnaire. Les rōmaji éditoriaux des cinq cartes du
prototype restent prioritaires. Aucune prononciation n’est déduite d’un kanji
sans lecture renseignée. Un kanji peut avoir plusieurs lectures : le rōmaji
affiché en représente une, sans prétendre correspondre à tous ses emplois.

## Mise à jour reproductible

Avec Node.js 24 ou ultérieur, depuis la racine du projet :

```powershell
npm run data:import -- "C:\chemin\kanji-all.json"
npm test
```

L’import remplace les fichiers générés, refuse les doublons et vérifie les comptes
source. Les numéros des cartes existantes, leurs raretés manuelles et leur statut
sont préservés. Les nouvelles cartes reçoivent des numéros supplémentaires ; les
identifiants `origin-u-xxxx` ne dépendent pas du numéro ni de l’ordre d’import.
Après un nouvel import, redémarrer les serveurs Next.js pour renouveler leur cache.

Les cinq numéros/raretés de démonstration sont réservés dans
`src/constants/origin.ts`. Ce fichier centralise aussi les seuils de rareté et les
exceptions de sélection. Une fréquence inconnue ne donne pas une rareté mythique.

L’actualisation de la source reste une opération explicite, sans tâche automatique.
Consulter les conditions EDRDG liées ci-dessus lors des mises à jour et distributions.
