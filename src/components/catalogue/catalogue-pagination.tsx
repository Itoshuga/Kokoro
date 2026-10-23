import Link from "next/link";

import { catalogueHref } from "@/lib/catalogue/query";
import type { CataloguePage, CatalogueQuery } from "@/types/catalogue";

import styles from "./catalogue.module.css";

export function CataloguePagination({
  result,
  query,
}: {
  readonly result: CataloguePage;
  readonly query: CatalogueQuery;
}) {
  if (result.pageCount <= 1) return null;
  const pages = [
    ...new Set([
      1,
      result.page - 1,
      result.page,
      result.page + 1,
      result.pageCount,
    ]),
  ]
    .filter((page) => page >= 1 && page <= result.pageCount)
    .sort((a, b) => a - b);
  return (
    <nav className={styles.pagination} aria-label="Pagination du catalogue">
      {result.page > 1 ? (
        <Link
          prefetch={false}
          href={catalogueHref(query, result.page - 1)}
          aria-label="Page précédente"
        >
          ← <span>Précédente</span>
        </Link>
      ) : (
        <span className={styles.disabled} aria-disabled="true">
          ← <span>Précédente</span>
        </span>
      )}
      <div className={styles.pageNumbers}>
        {pages.map((page, index) => (
          <span key={page}>
            {index > 0 && page - pages[index - 1] > 1 && (
              <span className={styles.ellipsis} aria-hidden="true">
                …
              </span>
            )}
            {page === result.page ? (
              <span
                className={styles.currentPage}
                aria-current="page"
                aria-label={`Page ${page}`}
              >
                {page}
              </span>
            ) : (
              <Link
                prefetch={false}
                href={catalogueHref(query, page)}
                aria-label={`Page ${page}`}
              >
                {page}
              </Link>
            )}
          </span>
        ))}
      </div>
      {result.page < result.pageCount ? (
        <Link
          prefetch={false}
          href={catalogueHref(query, result.page + 1)}
          aria-label="Page suivante"
        >
          <span>Suivante</span> →
        </Link>
      ) : (
        <span className={styles.disabled} aria-disabled="true">
          <span>Suivante</span> →
        </span>
      )}
    </nav>
  );
}
