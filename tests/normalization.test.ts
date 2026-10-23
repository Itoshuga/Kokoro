import assert from "node:assert/strict";
import test from "node:test";

import {
  normalizeDictionary,
  normalizeKanji,
} from "../src/lib/kanji/normalization.ts";

const source = {
  kanji: "山",
  unicode: "U+5C71",
  readings: { on: ["サン", "サン"], kun: ["やま"], names: ["さ"] },
  meanings: {
    fr: [" montagne ", "montagne"],
    en: ["mountain"],
    es: ["montaña"],
  },
  strokes: [3, 3],
  grade: 1,
  frequency_rank: 131,
  jlpt_legacy: 4,
  radicals: [{ type: "classical", value: "46" }],
  dictionary_refs: [{ irrelevant: true }],
};

test("normalise sans modifier la source et ne conserve que les champs publics", () => {
  const original = structuredClone(source);
  const result = normalizeKanji(source);
  assert.equal(result.id, "u-5c71");
  assert.deepEqual(result.meanings, { fr: ["montagne"], en: ["mountain"] });
  assert.deepEqual(result.readings, { on: ["サン"], kun: ["やま"] });
  assert.deepEqual(result.strokes, [3]);
  assert.equal("dictionary_refs" in result, false);
  assert.deepEqual(source, original);
});

test("préserve les traductions absentes et les nombres inconnus", () => {
  const result = normalizeKanji({
    ...source,
    meanings: { fr: [], en: [] },
    readings: { on: [], kun: [] },
    grade: null,
    frequency_rank: null,
    jlpt_legacy: null,
  });
  assert.deepEqual(result.meanings, { fr: [], en: [] });
  assert.deepEqual(result.readings, { on: [], kun: [] });
  assert.equal(result.frequencyRank, null);
  assert.equal(result.grade, null);
  assert.equal(result.jlptLegacy, null);
});

test("les identifiants Unicode couvrent les caractères supplémentaires", () => {
  assert.equal(
    normalizeKanji({ ...source, kanji: "𠮷", unicode: "U+20BB7" }).id,
    "u-20bb7",
  );
  assert.throws(
    () => normalizeKanji({ ...source, unicode: "U+6C34" }),
    /Unicode incohérent/,
  );
});

test("refuse les doublons, les comptes incohérents et les nombres invalides", () => {
  assert.throws(
    () =>
      normalizeDictionary({ metadata: { count: 2 }, kanji: [source, source] }),
    /dupliqué/,
  );
  assert.throws(
    () => normalizeDictionary({ metadata: { count: 5 }, kanji: [source] }),
    /nombre d'entrées/,
  );
  assert.throws(
    () => normalizeKanji({ ...source, frequency_rank: -1 }),
    /entier positif/,
  );
});
