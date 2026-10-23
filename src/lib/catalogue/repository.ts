import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";

import type {
  CatalogueEntry,
  CatalogueRepository,
} from "../../types/catalogue.ts";
import type { Kanji, KanjiDatasetProvenance } from "../../types/kanji.ts";
import type { KanjiCard } from "../../types/kanji-card.ts";
import { createCatalogueIndex } from "./search.ts";

async function loadDataset() {
  const directory = path.join(process.cwd(), "data", "kanji");
  const [dictionary, cards, provenance] = await Promise.all([
    readFile(path.join(directory, "dictionary.json"), "utf8").then(
      (text) => JSON.parse(text) as Kanji[],
    ),
    readFile(path.join(directory, "cards.json"), "utf8").then(
      (text) => JSON.parse(text) as KanjiCard[],
    ),
    readFile(path.join(directory, "provenance.json"), "utf8").then(
      (text) => JSON.parse(text) as KanjiDatasetProvenance,
    ),
  ]);
  const kanjiById = new Map(dictionary.map((kanji) => [kanji.id, kanji]));
  const entries = cards
    .filter((card) => card.status === "published")
    .map((card): CatalogueEntry => {
      const kanji = kanjiById.get(card.kanjiId);
      if (!kanji)
        throw new Error(`Référence de kanji absente : ${card.kanjiId}`);
      return { kanji, card };
    });
  const cardById = new Map(entries.map((entry) => [entry.card.id, entry]));
  const uniqueNumbers = (values: readonly (number | null)[]) =>
    [
      ...new Set(values.filter((value): value is number => value !== null)),
    ].sort((a, b) => a - b);
  return {
    kanjiById,
    cardById,
    index: createCatalogueIndex(entries),
    provenance,
    facets: {
      strokes: uniqueNumbers(
        entries.map(({ kanji }) => kanji.strokes[0] ?? null),
      ),
      grades: uniqueNumbers(entries.map(({ kanji }) => kanji.grade)),
      jlpt: uniqueNumbers(entries.map(({ kanji }) => kanji.jlptLegacy)),
    },
  };
}

let dataset: ReturnType<typeof loadDataset> | undefined;
function getDataset() {
  dataset ??= loadDataset().catch((error) => {
    dataset = undefined;
    throw error;
  });
  return dataset;
}

export const catalogueRepository: CatalogueRepository = {
  async search(query) {
    return (await getDataset()).index.search(query);
  },
  async findCard(id) {
    return (await getDataset()).cardById.get(id.toLowerCase()) ?? null;
  },
  async findKanji(id) {
    return (await getDataset()).kanjiById.get(id.toLowerCase()) ?? null;
  },
  async facets() {
    return (await getDataset()).facets;
  },
  async provenance() {
    return (await getDataset()).provenance;
  },
};
