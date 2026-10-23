import assert from "node:assert/strict";
import test from "node:test";

import { romanizeReading } from "../src/lib/kanji/romaji.ts";

test("transcrit les hiragana et katakana, les sons composés et consonnes doubles", () => {
  for (const [reading, expected] of [
    ["みず", "MIZU"],
    ["やま", "YAMA"],
    ["かみなり", "KAMINARI"],
    ["シンブン", "SHINBUN"],
    ["キュウ", "KYUU"],
    ["がっこう", "GAKKOU"],
    ["しんよう", "SHIN'YOU"],
    ["ゐ", "WI"],
    ["ゑ", "WE"],
    ["ｽｲ", "SUI"],
  ]) {
    assert.equal(romanizeReading(reading), expected);
  }
});

test("retire les marqueurs KANJIDIC2 sans perdre les okurigana", () => {
  assert.equal(romanizeReading("い.きる"), "IKIRU");
  assert.equal(romanizeReading("ひと-"), "HITO");
  assert.equal(romanizeReading("-がわ"), "GAWA");
});

test("une lecture absente ou inexploitable ne produit pas de prononciation", () => {
  for (const reading of ["", " ", ".-", "水", "eau", "みず水"]) {
    assert.equal(romanizeReading(reading), null);
  }
});
