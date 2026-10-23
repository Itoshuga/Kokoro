import { demoKanjiCards } from "../../data/demo-kanji-cards.ts";
import { kanjiEditorial } from "../../data/kanji-editorial.ts";
import { ORIGIN_SERIES } from "../../constants/origin.ts";
import type { CatalogueEntry } from "../../types/catalogue.ts";
import type { Kanji } from "../../types/kanji.ts";
import type { KanjiCardData } from "../../types/kanji-card.ts";
import { romanizeReading } from "../kanji/romaji.ts";

export function getKanjiTranslation(kanji: Kanji) {
  if (kanji.meanings.fr.length)
    return {
      meanings: kanji.meanings.fr,
      language: "fr",
      editorial: false,
    } as const;
  const editorial = kanjiEditorial[kanji.id];
  if (editorial?.fr.length)
    return { meanings: editorial.fr, language: "fr", editorial: true } as const;
  if (kanji.meanings.en.length)
    return {
      meanings: kanji.meanings.en,
      language: "en",
      editorial: false,
    } as const;
  return {
    meanings: [] as readonly string[],
    language: null,
    editorial: false,
  } as const;
}

function shortReadings(readings: readonly string[]): string {
  return readings.slice(0, 3).join(" · ") + (readings.length > 3 ? " …" : "");
}

export function toKanjiCardView(
  { kanji, card }: CatalogueEntry,
  publishedCount: number,
): KanjiCardData {
  const demo = demoKanjiCards.find((entry) => entry.kanji === kanji.character);
  const translation = getKanjiTranslation(kanji);
  const reading =
    demo?.reading ?? kanji.readings.kun[0] ?? kanji.readings.on[0] ?? "";
  return {
    id: card.id,
    kanji: kanji.character,
    meaning:
      demo?.meaning ?? translation.meanings[0] ?? "Traduction non renseignée",
    romaji: demo?.romaji ?? romanizeReading(reading),
    rarity: card.rarity,
    number: String(card.collectionNumber).padStart(3, "0"),
    reading,
    onyomi: demo?.onyomi ?? shortReadings(kanji.readings.on),
    kunyomi: demo?.kunyomi ?? shortReadings(kanji.readings.kun),
    example: demo?.example ?? null,
    exampleMeaning: demo?.exampleMeaning ?? null,
    lore: demo?.lore ?? null,
    collection: {
      name: ORIGIN_SERIES.name.toUpperCase(),
      edition: ORIGIN_SERIES.edition,
      totalCards: publishedCount,
    },
  };
}

export function gradeLabel(grade: number): string {
  if (grade <= 6) return `Primaire — année ${grade}`;
  if (grade === 8) return "Secondaire — kanji jōyō";
  if (grade === 9) return "Noms propres — jinmeiyō";
  if (grade === 10) return "Variante pour les noms propres";
  return `Niveau ${grade}`;
}
