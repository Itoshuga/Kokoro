import { isKana, isRomaji, toRomaji } from "wanakana";

/** Transcrit une lecture fournie, sans déduire une prononciation du kanji seul. */
export function romanizeReading(reading: string): string | null {
  // KANJIDIC2 marque les okurigana par un point et les affixes par un tiret.
  const kana = reading.normalize("NFKC").replace(/[.-]/g, "").trim();
  if (!kana || !isKana(kana)) return null;

  const romaji = toRomaji(kana);
  return isRomaji(romaji) ? romaji.toUpperCase() : null;
}
