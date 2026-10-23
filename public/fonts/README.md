# Polices des cartes Kokoro

Copies WOFF2 des polices du prototype, distribuées sous SIL Open Font License 1.1.
La licence de chaque famille est conservée dans son dossier.

| Famille | Paquet source | Version |
| --- | --- | --- |
| Yuji Boku | `@fontsource/yuji-boku` | 5.3.1 |
| Noto Serif JP | `@fontsource-variable/noto-serif-jp` | 5.3.1 |
| DM Sans | `@fontsource-variable/dm-sans` | 5.3.0 |

Sources : [Fontsource](https://github.com/fontsource/fontsource) et
[Google Fonts](https://github.com/google/fonts).

Les déclarations dans `src/styles/kanji-card-fonts.css` conservent les plages
Unicode pour charger uniquement les fichiers nécessaires. Noto Serif JP et DM
Sans sont variables ; Yuji Boku utilise exclusivement sa graisse 400.
