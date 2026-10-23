export type CardRarity = "common" | "rare" | "epic" | "legendary" | "mythic";

/** Modèle de collection, indépendant des informations linguistiques. */
export interface KanjiCard {
  readonly id: string;
  readonly kanjiId: string;
  readonly seriesId: string;
  readonly collectionNumber: number;
  readonly rarity: CardRarity;
  readonly raritySource: "frequency" | "manual" | "fallback";
  readonly status: "published" | "draft";
}

export interface KanjiCardCollection {
  readonly name: string;
  readonly edition: string;
  readonly totalCards: number;
}

/** Vue d'affichage assemblée à partir d'un Kanji, d'une carte et de l'éditorial. */
export interface KanjiCardData {
  readonly id: string;
  readonly kanji: string;
  readonly meaning: string;
  readonly romaji: string | null;
  readonly rarity: CardRarity;
  readonly number: string;
  readonly reading: string;
  readonly onyomi: string;
  readonly kunyomi: string;
  readonly example: string | null;
  readonly exampleMeaning: string | null;
  readonly lore: string | null;
  readonly collection: KanjiCardCollection;
}
