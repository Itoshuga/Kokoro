import {
  ORIGIN_CARD_OVERRIDES,
  ORIGIN_SERIES,
} from "../../constants/origin.ts";
import type { Kanji } from "../../types/kanji.ts";
import type { KanjiCard } from "../../types/kanji-card.ts";
import { determineRarity } from "../catalogue/rarity.ts";

export function isOriginEligible(kanji: Kanji): boolean {
  return kanji.meanings.fr.length > 0 && kanji.frequencyRank !== null;
}

export function buildOriginCards(
  dictionary: readonly Kanji[],
  previousCards: readonly KanjiCard[] = [],
): KanjiCard[] {
  const previous = new Map(
    previousCards
      .filter((card) => card.seriesId === ORIGIN_SERIES.id)
      .map((card) => [card.kanjiId, card]),
  );
  const usedNumbers = new Set<number>();
  const selected = dictionary.filter(
    (kanji) => isOriginEligible(kanji) || ORIGIN_CARD_OVERRIDES[kanji.id],
  );
  const selectedIds = new Set(selected.map((kanji) => kanji.id));
  for (const id of Object.keys(ORIGIN_CARD_OVERRIDES)) {
    if (!selectedIds.has(id))
      throw new Error(`La carte de démonstration ${id} manque dans la source.`);
  }

  let nextNumber = Math.max(
    5,
    ...previousCards.map((card) => card.collectionNumber),
  );
  const cards = selected.map((kanji): KanjiCard => {
    const override = ORIGIN_CARD_OVERRIDES[kanji.id];
    const existing = previous.get(kanji.id);
    const collectionNumber =
      override?.number ?? existing?.collectionNumber ?? ++nextNumber;
    if (usedNumbers.has(collectionNumber))
      throw new Error(`Numéro Origin dupliqué : ${collectionNumber}.`);
    usedNumbers.add(collectionNumber);
    const manualRarity =
      override?.rarity ??
      (existing?.raritySource === "manual" ? existing.rarity : undefined);
    return {
      id: `${ORIGIN_SERIES.id}-${kanji.id}`,
      kanjiId: kanji.id,
      seriesId: ORIGIN_SERIES.id,
      collectionNumber,
      rarity: determineRarity(kanji.frequencyRank, manualRarity),
      raritySource: manualRarity
        ? "manual"
        : kanji.frequencyRank === null
          ? "fallback"
          : "frequency",
      status: existing?.status ?? "published",
    };
  });
  return cards.sort((a, b) => a.collectionNumber - b.collectionNumber);
}
