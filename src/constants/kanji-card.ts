import type { CardRarity } from "@/types/kanji-card";

export const CARD_RARITY_LABELS = {
  common: "Commune",
  rare: "Rare",
  epic: "Épique",
  legendary: "Légendaire",
  mythic: "Mythique",
} as const satisfies Readonly<Record<CardRarity, string>>;
