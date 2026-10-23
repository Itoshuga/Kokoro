import type { Metadata } from "next";
import Link from "next/link";

import { CatalogueCards } from "@/components/catalogue/catalogue-cards";
import { CatalogueFilters } from "@/components/catalogue/catalogue-filters";
import { CataloguePagination } from "@/components/catalogue/catalogue-pagination";
import styles from "@/components/catalogue/catalogue.module.css";
import { catalogueHref, parseCatalogueQuery } from "@/lib/catalogue/query";
import type { CatalogueSearchParams } from "@/lib/catalogue/query";
import { catalogueRepository } from "@/lib/catalogue/repository";
import { toKanjiCardView } from "@/lib/catalogue/presentation";

export const metadata: Metadata = {
  title: "Catalogue — Kokoro",
  description: "Explorez les cartes de kanji de l’édition Origin de Kokoro.",
};
export const dynamic = "force-dynamic";

export default async function CataloguePage({
  searchParams,
}: {
  readonly searchParams: Promise<CatalogueSearchParams>;
}) {
  const query = parseCatalogueQuery(await searchParams);
  const [result, facets, provenance] = await Promise.all([
    catalogueRepository.search(query),
    catalogueRepository.facets(),
    catalogueRepository.provenance(),
  ]);
  const formatter = new Intl.NumberFormat("fr-FR");
  const returnTo = catalogueHref(query, result.page);
  return (
    <main>
      <section className={styles.hero} aria-labelledby="catalogue-title">
        <div>
          <p className={styles.eyebrow}>
            UN SYMBOLE. UN MONDE. / COLLECTION 01
          </p>
          <h1 id="catalogue-title">Catalogue</h1>
          <p className={styles.introduction}>
            Chaque caractère ouvre un monde. Explorez les cinq raretés de
            l’édition Origin.
          </p>
        </div>
        <div className={styles.collectionCount}>
          <strong>{formatter.format(result.published)}</strong>
          <span>cartes Origin publiées</span>
          <small>
            {formatter.format(provenance.counts.imported)} kanji dans le
            référentiel
          </small>
        </div>
      </section>
      <CatalogueFilters query={query} facets={facets} />
      <section className={styles.results} aria-labelledby="results-title">
        <div className={styles.resultsHeader}>
          <h2 id="results-title">
            {formatter.format(result.total)} carte
            {result.total !== 1 ? "s" : ""}
            {query.q ? ` pour « ${query.q} »` : " dans la collection"}
          </h2>
          {result.total > 0 && (
            <p>
              Page {result.page} / {result.pageCount}{" "}
              <span>— {result.pageSize} cartes par page</span>
            </p>
          )}
        </div>
        {result.total > 0 ? (
          <CatalogueCards
            key={returnTo}
            returnTo={returnTo}
            items={result.items.map((entry) => ({
              cardId: entry.card.id,
              view: toKanjiCardView(entry, result.published),
            }))}
          />
        ) : (
          <div className={styles.empty}>
            <span lang="ja">空</span>
            <h3>Aucune carte ne correspond</h3>
            <p>Essayez une autre lecture ou élargissez les filtres.</p>
            <Link href="/cards" prefetch={false}>
              Retrouver toute la collection →
            </Link>
          </div>
        )}
        <CataloguePagination result={result} query={query} />
      </section>
    </main>
  );
}
