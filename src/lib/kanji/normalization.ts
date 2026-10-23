import type { Kanji } from "../../types/kanji.ts";

type JsonObject = Record<string, unknown>;

function object(value: unknown, field: string): JsonObject {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${field} doit être un objet.`);
  }
  return value as JsonObject;
}

function strings(value: unknown, field: string): string[] {
  if (value === null || value === undefined) return [];
  if (
    !Array.isArray(value) ||
    value.some((entry) => typeof entry !== "string")
  ) {
    throw new Error(`${field} doit être une liste de textes.`);
  }
  return [
    ...new Set(
      (value as string[]).map((entry) => entry.trim()).filter(Boolean),
    ),
  ];
}

function nullableInteger(value: unknown, field: string): number | null {
  if (value === null || value === undefined) return null;
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 1) {
    throw new Error(`${field} doit être un entier positif ou null.`);
  }
  return value;
}

export function normalizeKanji(value: unknown): Kanji {
  const row = object(value, "kanji");
  if (typeof row.kanji !== "string" || [...row.kanji].length !== 1) {
    throw new Error("Chaque entrée doit contenir un seul caractère Unicode.");
  }
  const codePoint = row.kanji.codePointAt(0)!;
  const hex = codePoint.toString(16).toUpperCase().padStart(4, "0");
  if (
    typeof row.unicode !== "string" ||
    row.unicode.toUpperCase() !== `U+${hex}`
  ) {
    throw new Error(`Unicode incohérent pour ${row.kanji}.`);
  }
  const readings = object(row.readings, "readings");
  const meanings = object(row.meanings, "meanings");
  if (!Array.isArray(row.strokes))
    throw new Error("strokes doit être une liste.");
  const strokes = [
    ...new Set(
      row.strokes.map((stroke) => {
        const result = nullableInteger(stroke, "strokes");
        if (result === null)
          throw new Error("Un nombre de traits ne peut pas être null.");
        return result;
      }),
    ),
  ];
  if (!Array.isArray(row.radicals))
    throw new Error("radicals doit être une liste.");
  const radicals = row.radicals.map((value) => {
    const radical = object(value, "radical");
    if (typeof radical.type !== "string" || typeof radical.value !== "string") {
      throw new Error("Référence de radical invalide.");
    }
    return { type: radical.type, value: radical.value };
  });
  return {
    id: `u-${hex.toLowerCase()}`,
    character: row.kanji,
    unicode: `U+${hex}`,
    readings: {
      on: strings(readings.on, "readings.on"),
      kun: strings(readings.kun, "readings.kun"),
    },
    meanings: {
      fr: strings(meanings.fr, "meanings.fr"),
      en: strings(meanings.en, "meanings.en"),
    },
    strokes,
    grade: nullableInteger(row.grade, "grade"),
    frequencyRank: nullableInteger(row.frequency_rank, "frequency_rank"),
    jlptLegacy: nullableInteger(row.jlpt_legacy, "jlpt_legacy"),
    radicals,
  };
}

export function normalizeDictionary(value: unknown) {
  const source = object(value, "document");
  const metadata = object(source.metadata, "metadata");
  if (!Array.isArray(source.kanji))
    throw new Error("La liste kanji est absente.");
  const entries = source.kanji.map(normalizeKanji);
  const ids = new Set<string>();
  for (const entry of entries) {
    if (ids.has(entry.id))
      throw new Error(`Kanji dupliqué : ${entry.unicode}.`);
    ids.add(entry.id);
  }
  if (typeof metadata.count === "number" && metadata.count !== entries.length) {
    throw new Error("Le nombre d'entrées diffère des métadonnées source.");
  }
  entries.sort(
    (a, b) => a.character.codePointAt(0)! - b.character.codePointAt(0)!,
  );
  return { metadata, entries };
}
