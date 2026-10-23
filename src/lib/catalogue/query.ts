import { CATALOGUE_SORTS } from "../../types/catalogue.ts";
import type { CatalogueQuery } from "../../types/catalogue.ts";
import { CARD_RARITY_LABELS } from "../../constants/kanji-card.ts";

export type CatalogueSearchParams = Record<
  string,
  string | string[] | undefined
>;

export function parseCatalogueQuery(
  params: CatalogueSearchParams,
): CatalogueQuery {
  const first = (key: string) =>
    Array.isArray(params[key]) ? (params[key][0] ?? "") : (params[key] ?? "");
  const integer = (key: string, max: number): number | null => {
    const text = first(key);
    if (!/^\d+$/.test(text)) return null;
    const value = Number(text);
    return Number.isSafeInteger(value) && value >= 1 && value <= max
      ? value
      : null;
  };
  const rarity = first("rarity");
  const sort = first("sort");
  const grade = integer("grade", 10);
  return {
    q: first("q").trim().slice(0, 120),
    rarity: Object.hasOwn(CARD_RARITY_LABELS, rarity)
      ? (rarity as CatalogueQuery["rarity"])
      : "",
    strokes: integer("strokes", 64),
    grade: grade !== 7 ? grade : null,
    jlpt: integer("jlpt", 4),
    sort: CATALOGUE_SORTS.includes(sort as CatalogueQuery["sort"])
      ? (sort as CatalogueQuery["sort"])
      : "number",
    page: integer("page", Number.MAX_SAFE_INTEGER) ?? 1,
  };
}

export function catalogueHref(query: CatalogueQuery, page = 1): string {
  const params = new URLSearchParams();
  if (query.q) params.set("q", query.q);
  if (query.rarity) params.set("rarity", query.rarity);
  if (query.strokes !== null) params.set("strokes", String(query.strokes));
  if (query.grade !== null) params.set("grade", String(query.grade));
  if (query.jlpt !== null) params.set("jlpt", String(query.jlpt));
  if (query.sort !== "number") params.set("sort", query.sort);
  if (page > 1) params.set("page", String(page));
  return `/cards${params.size ? `?${params}` : ""}`;
}

/** Conserve les marques japonaises (が ≠ か), mais retire les accents latins. */
export function normalizeSearchText(value: string): string {
  return value
    .normalize("NFKC")
    .toLowerCase()
    .normalize("NFD")
    .replace(/([\p{Script=Latin}])\p{M}+/gu, "$1")
    .normalize("NFC")
    .replace(/[\u30a1-\u30f6]/g, (character) =>
      String.fromCharCode(character.charCodeAt(0) - 0x60),
    );
}
