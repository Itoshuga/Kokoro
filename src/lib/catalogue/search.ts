import { kanjiEditorial } from "../../data/kanji-editorial.ts";
import type {
  CatalogueEntry,
  CataloguePage,
  CatalogueQuery,
  CatalogueSort,
} from "../../types/catalogue.ts";
import { CATALOGUE_SORTS } from "../../types/catalogue.ts";
import { normalizeSearchText } from "./query.ts";

export const CATALOGUE_PAGE_SIZE = 24;
const RARITY_ORDER = { common: 0, rare: 1, epic: 2, legendary: 3, mythic: 4 };

interface IndexedEntry {
  readonly entry: CatalogueEntry;
  readonly searchText: string;
  readonly codePoint: number;
  readonly strokes: number;
}

export function createCatalogueIndex(entries: readonly CatalogueEntry[]) {
  const indexed: IndexedEntry[] = entries
    .filter(({ card }) => card.status === "published")
    .map((entry) => {
      const { kanji } = entry;
      const hex = kanji.unicode.slice(2);
      const readings = [...kanji.readings.on, ...kanji.readings.kun];
      return {
        entry,
        codePoint: kanji.character.codePointAt(0)!,
        strokes: kanji.strokes[0] ?? Number.MAX_SAFE_INTEGER,
        searchText: normalizeSearchText(
          [
            kanji.character,
            kanji.unicode,
            kanji.id,
            hex,
            `0x${hex}`,
            `u${hex}`,
            ...kanji.meanings.fr,
            ...kanji.meanings.en,
            ...(kanjiEditorial[kanji.id]?.fr ?? []),
            ...readings,
            ...readings.map((reading) => reading.replace(/[.-]/g, "")),
          ].join("\n"),
        ),
      };
    });
  const sorters: Record<
    CatalogueSort,
    (a: IndexedEntry, b: IndexedEntry) => number
  > = {
    number: (a, b) =>
      a.entry.card.collectionNumber - b.entry.card.collectionNumber,
    rarity: (a, b) =>
      RARITY_ORDER[a.entry.card.rarity] - RARITY_ORDER[b.entry.card.rarity],
    frequency: (a, b) =>
      (a.entry.kanji.frequencyRank ?? Number.MAX_SAFE_INTEGER) -
      (b.entry.kanji.frequencyRank ?? Number.MAX_SAFE_INTEGER),
    strokes: (a, b) => a.strokes - b.strokes,
    unicode: (a, b) => a.codePoint - b.codePoint,
  };
  const orders = Object.fromEntries(
    CATALOGUE_SORTS.map((sort) => [
      sort,
      [...indexed].sort((a, b) => sorters[sort](a, b) || sorters.number(a, b)),
    ]),
  ) as Record<CatalogueSort, IndexedEntry[]>;

  return {
    search(query: CatalogueQuery): CataloguePage {
      const terms = normalizeSearchText(query.q).split(/\s+/).filter(Boolean);
      const matches = orders[query.sort].filter(
        ({ entry: { kanji, card }, searchText }) =>
          (!query.rarity || card.rarity === query.rarity) &&
          (query.strokes === null || kanji.strokes[0] === query.strokes) &&
          (query.grade === null || kanji.grade === query.grade) &&
          (query.jlpt === null || kanji.jlptLegacy === query.jlpt) &&
          terms.every((term) => searchText.includes(term)),
      );
      const pageCount = Math.max(
        1,
        Math.ceil(matches.length / CATALOGUE_PAGE_SIZE),
      );
      const page = Math.min(query.page, pageCount);
      return {
        items: matches
          .slice((page - 1) * CATALOGUE_PAGE_SIZE, page * CATALOGUE_PAGE_SIZE)
          .map(({ entry }) => entry),
        total: matches.length,
        published: indexed.length,
        page,
        pageCount,
        pageSize: CATALOGUE_PAGE_SIZE,
      };
    },
  };
}
