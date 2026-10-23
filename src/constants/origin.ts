import type { CardRarity } from "../types/kanji-card.ts";

export const ORIGIN_SERIES = {
  id: "origin",
  name: "Origin",
  edition: "01",
} as const;

export interface RarityConfiguration {
  readonly frequencyBands: readonly {
    readonly maxRank: number;
    readonly rarity: CardRarity;
  }[];
  readonly missingFrequency: CardRarity;
}

/** Mécanique de collection ; ces seuils ne mesurent pas la difficulté d'un kanji. */
export const RARITY_CONFIGURATION: RarityConfiguration = {
  frequencyBands: [
    { maxRank: 500, rarity: "common" },
    { maxRank: 1000, rarity: "rare" },
    { maxRank: 1500, rarity: "epic" },
    { maxRank: 2000, rarity: "legendary" },
    { maxRank: Number.MAX_SAFE_INTEGER, rarity: "mythic" },
  ],
  missingFrequency: "common",
};

/** Ces cinq numéros et raretés appartiennent au prototype définitif. */
export const ORIGIN_CARD_OVERRIDES: Readonly<
  Record<string, { readonly number: number; readonly rarity: CardRarity }>
> = {
  "u-5c71": { number: 1, rarity: "common" },
  "u-6c34": { number: 2, rarity: "rare" },
  "u-96f7": { number: 3, rarity: "epic" },
  "u-9f8d": { number: 4, rarity: "legendary" },
  "u-5922": { number: 5, rarity: "mythic" },
};
