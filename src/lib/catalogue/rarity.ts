import { RARITY_CONFIGURATION } from "../../constants/origin.ts";
import type { RarityConfiguration } from "../../constants/origin.ts";
import type { CardRarity } from "../../types/kanji-card.ts";

export function determineRarity(
  frequencyRank: number | null,
  manualOverride?: CardRarity,
  configuration: RarityConfiguration = RARITY_CONFIGURATION,
): CardRarity {
  if (manualOverride) return manualOverride;
  if (frequencyRank === null) return configuration.missingFrequency;
  return (
    configuration.frequencyBands.find((band) => frequencyRank <= band.maxRank)
      ?.rarity ?? configuration.missingFrequency
  );
}
