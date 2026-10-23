import type { Kanji, KanjiDatasetProvenance } from "./kanji.ts";
import type { CardRarity, KanjiCard, KanjiCardData } from "./kanji-card.ts";

export const CATALOGUE_SORTS = [
  "number",
  "rarity",
  "frequency",
  "strokes",
  "unicode",
] as const;
export type CatalogueSort = (typeof CATALOGUE_SORTS)[number];

export interface CatalogueQuery {
  readonly q: string;
  readonly rarity: CardRarity | "";
  readonly strokes: number | null;
  readonly grade: number | null;
  readonly jlpt: number | null;
  readonly sort: CatalogueSort;
  readonly page: number;
}

export interface CatalogueEntry {
  readonly kanji: Kanji;
  readonly card: KanjiCard;
}

export interface CataloguePage {
  readonly items: readonly CatalogueEntry[];
  readonly total: number;
  readonly published: number;
  readonly page: number;
  readonly pageSize: number;
  readonly pageCount: number;
}

export interface CatalogueFacets {
  readonly strokes: readonly number[];
  readonly grades: readonly number[];
  readonly jlpt: readonly number[];
}

export interface CatalogueCardItem {
  readonly cardId: string;
  readonly view: KanjiCardData;
}

/** Une implémentation Supabase pourra remplacer le dépôt fichier sans changer les routes. */
export interface CatalogueRepository {
  search(query: CatalogueQuery): Promise<CataloguePage>;
  findCard(id: string): Promise<CatalogueEntry | null>;
  findKanji(id: string): Promise<Kanji | null>;
  facets(): Promise<CatalogueFacets>;
  provenance(): Promise<KanjiDatasetProvenance>;
}
