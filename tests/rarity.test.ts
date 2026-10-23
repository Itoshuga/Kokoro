import assert from "node:assert/strict";
import test from "node:test";

import { determineRarity } from "../src/lib/catalogue/rarity.ts";

test("les seuils de fréquence sont déterministes et respectent les bornes", () => {
  for (const [rank, expected] of [
    [1, "common"],
    [500, "common"],
    [501, "rare"],
    [1000, "rare"],
    [1001, "epic"],
    [1501, "legendary"],
    [2001, "mythic"],
  ] as const) {
    assert.equal(determineRarity(rank), expected);
    assert.equal(determineRarity(rank), determineRarity(rank));
  }
});

test("une fréquence inconnue n'est pas assimilée à une rareté mythique", () => {
  assert.equal(determineRarity(null), "common");
  assert.equal(determineRarity(null, "legendary"), "legendary");
  assert.equal(determineRarity(1, "mythic"), "mythic");
});

test("la configuration peut être remplacée sans changer l'algorithme", () => {
  assert.equal(
    determineRarity(300, undefined, {
      frequencyBands: [{ maxRank: 1000, rarity: "epic" }],
      missingFrequency: "rare",
    }),
    "epic",
  );
  assert.equal(
    determineRarity(null, undefined, {
      frequencyBands: [],
      missingFrequency: "rare",
    }),
    "rare",
  );
});
