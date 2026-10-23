import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { performance } from "node:perf_hooks";
import test from "node:test";

import { ORIGIN_CARD_OVERRIDES } from "../src/constants/origin.ts";
import { buildOriginCards } from "../src/lib/kanji/origin-import.ts";
import { createCatalogueIndex } from "../src/lib/catalogue/search.ts";
import {
  catalogueHref,
  normalizeSearchText,
  parseCatalogueQuery,
} from "../src/lib/catalogue/query.ts";
import {
  getKanjiTranslation,
  toKanjiCardView,
} from "../src/lib/catalogue/presentation.ts";
import type { Kanji } from "../src/types/kanji.ts";
import type { KanjiCard } from "../src/types/kanji-card.ts";

const dictionary = JSON.parse(
  readFileSync(
    new URL("../data/kanji/dictionary.json", import.meta.url),
    "utf8",
  ),
) as Kanji[];
const cards = JSON.parse(
  readFileSync(new URL("../data/kanji/cards.json", import.meta.url), "utf8"),
) as KanjiCard[];
const kanjiById = new Map(dictionary.map((kanji) => [kanji.id, kanji]));
const entries = cards.map((card) => ({
  card,
  kanji: kanjiById.get(card.kanjiId)!,
}));
const index = createCatalogueIndex(entries);
const search = (q: string) => index.search(parseCatalogueQuery({ q }));

test("le référentiel complet reste distinct de la collection publiée", () => {
  assert.equal(dictionary.length, 13108);
  assert.equal(new Set(dictionary.map((kanji) => kanji.id)).size, 13108);
  assert.equal(
    dictionary.filter((kanji) => kanji.meanings.fr.length).length,
    2066,
  );
  assert.equal(
    dictionary.filter(
      (kanji) => !kanji.meanings.fr.length && !kanji.meanings.en.length,
    ).length,
    2724,
  );
  assert.equal(cards.length, 2021);
  assert.equal(new Set(cards.map((card) => card.id)).size, cards.length);
  assert.equal(
    new Set(cards.map((card) => card.collectionNumber)).size,
    cards.length,
  );
  assert.ok(
    entries.every(({ card, kanji }) => kanji && card.status === "published"),
  );
  const untranslated = dictionary.find(
    (kanji) => !kanji.meanings.fr.length && !kanji.meanings.en.length,
  )!;
  assert.equal(
    cards.some((card) => card.kanjiId === untranslated.id),
    false,
  );
});

test("un nouvel import est idempotent et conserve les numéros et raretés manuelles", () => {
  assert.deepEqual(buildOriginCards(dictionary, cards), cards);
  const target = cards.find((card) => !ORIGIN_CARD_OVERRIDES[card.kanjiId])!;
  const edited = cards.map((card) =>
    card.id === target.id
      ? { ...card, rarity: "mythic" as const, raritySource: "manual" as const }
      : card,
  );
  assert.deepEqual(
    buildOriginCards(dictionary, edited).find((card) => card.id === target.id),
    edited.find((card) => card.id === target.id),
  );
});

test("les cinq cartes du prototype sont publiées et conservent leur rareté", () => {
  for (const [id, override] of Object.entries(ORIGIN_CARD_OVERRIDES)) {
    const card = cards.find((card) => card.kanjiId === id)!;
    assert.equal(card.collectionNumber, override.number);
    assert.equal(card.rarity, override.rarity);
    assert.equal(card.status, "published");
  }
  const dragon = kanjiById.get("u-9f8d")!;
  assert.deepEqual(dragon.meanings.fr, []);
  assert.deepEqual(getKanjiTranslation(dragon), {
    meanings: ["Dragon"],
    language: "fr",
    editorial: true,
  });
});

test("la recherche couvre japonais, français, anglais et Unicode", () => {
  assert.equal(search("山").items[0].kanji.character, "山");
  assert.ok(
    search("MONTAGNE").items.some(({ kanji }) => kanji.character === "山"),
  );
  assert.ok(
    search("mountain").items.some(({ kanji }) => kanji.character === "山"),
  );
  assert.ok(search("サン").items.some(({ kanji }) => kanji.character === "山"));
  assert.ok(search("やま").items.some(({ kanji }) => kanji.character === "山"));
  assert.ok(search("REVE").items.some(({ kanji }) => kanji.character === "夢"));
  for (const query of ["U+9f8d", "9F8D", "0x9f8d", "u-9f8d", "Dragon"]) {
    assert.ok(
      search(query).items.some(({ kanji }) => kanji.character === "龍"),
    );
  }
  assert.equal(normalizeSearchText("RÊVE"), normalizeSearchText("reve"));
  assert.notEqual(normalizeSearchText("が"), normalizeSearchText("か"));
  assert.equal(normalizeSearchText("ガ"), normalizeSearchText("が"));
});

test("filtres combinés, tri et pagination sont appliqués sur le serveur", () => {
  const result = index.search(
    parseCatalogueQuery({
      q: "montagne",
      rarity: "common",
      strokes: "3",
      grade: "1",
      jlpt: "4",
    }),
  );
  assert.deepEqual(
    result.items.map(({ kanji }) => kanji.character),
    ["山"],
  );
  const first = index.search(parseCatalogueQuery({}));
  const second = index.search(parseCatalogueQuery({ page: "2" }));
  assert.equal(first.items.length, 24);
  assert.equal(first.pageCount, 85);
  assert.equal(
    new Set([...first.items, ...second.items].map(({ card }) => card.id)).size,
    48,
  );
  assert.equal(index.search(parseCatalogueQuery({ page: "9999" })).page, 85);
  assert.equal(search("aucunresultatimpossible").total, 0);
  const sorted = index.search(parseCatalogueQuery({ sort: "frequency" }));
  assert.ok(
    sorted.items.every(
      (entry, i, list) =>
        !i || entry.kanji.frequencyRank! >= list[i - 1].kanji.frequencyRank!,
    ),
  );
});

test("les paramètres invalides sont neutralisés et les liens conservent les filtres", () => {
  const query = parseCatalogueQuery({
    page: "-5",
    rarity: "__proto__",
    strokes: "Infinity",
    grade: "7",
    jlpt: "5",
    sort: "invalide",
    q: [" RÊVE ", "ignoré"],
  });
  assert.deepEqual(query, {
    page: 1,
    q: "RÊVE",
    rarity: "",
    strokes: null,
    grade: null,
    jlpt: null,
    sort: "number",
  });
  const href = catalogueHref(
    parseCatalogueQuery({ q: "夢", rarity: "mythic", sort: "strokes" }),
    2,
  );
  assert.ok(
    href.includes("rarity=mythic") &&
      href.includes("sort=strokes") &&
      href.includes("page=2"),
  );
});

test("les traits utilisent le décompte principal et les cartes non publiées sont exclues", () => {
  const sample = entries.find(
    ({ kanji }) =>
      kanji.strokes.length > 1 && kanji.strokes[0] !== kanji.strokes[1],
  )!;
  const isolated = createCatalogueIndex([sample]);
  assert.equal(
    isolated.search(
      parseCatalogueQuery({ strokes: String(sample.kanji.strokes[0]) }),
    ).total,
    1,
  );
  assert.equal(
    isolated.search(
      parseCatalogueQuery({ strokes: String(sample.kanji.strokes[1]) }),
    ).total,
    0,
  );
  const drafts = createCatalogueIndex([
    { ...sample, card: { ...sample.card, status: "draft" } },
  ]);
  assert.equal(drafts.search(parseCatalogueQuery({})).total, 0);
});

test("l'affichage n'invente ni traduction, ni romanisation, ni exemple", () => {
  const unknown = dictionary.find(
    (kanji) => !kanji.meanings.fr.length && !kanji.meanings.en.length,
  )!;
  assert.equal(getKanjiTranslation(unknown).language, null);
  const english = dictionary.find(
    (kanji) =>
      !kanji.meanings.fr.length &&
      kanji.meanings.en.length &&
      kanji.id !== "u-9f8d",
  )!;
  assert.equal(getKanjiTranslation(english).language, "en");
  const entry = entries.find(
    ({ kanji }) => !"山水雷龍夢".includes(kanji.character),
  )!;
  const view = toKanjiCardView(entry, cards.length);
  assert.equal(view.romaji, null);
  assert.equal(view.example, null);
  assert.equal(view.exampleMeaning, null);
  assert.equal(view.lore, null);
});

test("mesure des recherches sur les 2 021 cartes, sans payload du dictionnaire", (t) => {
  const timings: number[] = [];
  for (let i = 0; i < 100; i++) {
    const start = performance.now();
    index.search(
      parseCatalogueQuery({
        q: ["", "rêve", "eau", "やま", "U+5C71"][i % 5],
        sort: ["number", "frequency", "unicode"][i % 3],
        page: "2",
      }),
    );
    timings.push(performance.now() - start);
  }
  timings.sort((a, b) => a - b);
  t.diagnostic(
    `Recherche serveur : médiane ${timings[50].toFixed(2)} ms ; p95 ${timings[95].toFixed(2)} ms.`,
  );
  const payload = JSON.stringify(
    index
      .search(parseCatalogueQuery({}))
      .items.map((entry) => toKanjiCardView(entry, cards.length)),
  );
  assert.equal(JSON.parse(payload).length, 24);
  assert.ok(Buffer.byteLength(payload) < 50000);
});
