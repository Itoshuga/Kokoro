import type { EditorialKanjiMeaning } from "../types/kanji.ts";

/** Compléments éditoriaux séparés : ne modifient jamais le dictionnaire source. */
export const kanjiEditorial: Readonly<Record<string, EditorialKanjiMeaning>> = {
  "u-9f8d": {
    fr: ["Dragon"],
    source: "Prototype Kokoro — étape 2",
    note: "Traduction française éditoriale du prototype ; absente de KANJIDIC2.",
  },
};
