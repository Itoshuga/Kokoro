export type CardRarity = "common" | "rare" | "epic" | "legendary" | "mythic";

export interface KanjiCardCollection {
  readonly name: string;
  readonly edition: string;
  readonly totalCards: number;
}

export interface KanjiCardData {
  readonly id: string;
  readonly kanji: string;
  readonly meaning: string;
  readonly romaji: string;
  readonly rarity: CardRarity;
  readonly number: string;
  readonly reading: string;
  readonly onyomi: string;
  readonly kunyomi: string;
  readonly example: string;
  readonly exampleMeaning: string;
  readonly lore: string;
  readonly collection: KanjiCardCollection;
}
