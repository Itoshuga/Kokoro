import Link from "next/link";

import styles from "./catalogue.module.css";

export function CatalogueHeader() {
  return (
    <header className={styles.header}>
      <Link href="/" className={styles.brand} aria-label="Kokoro — accueil">
        <span className={styles.brandMark} lang="ja">
          心
        </span>
        <span>
          <strong>KOKORO</strong>
          <small>KANJI CARD ATELIER</small>
        </span>
      </Link>
      <nav className={styles.navigation} aria-label="Navigation principale">
        <Link href="/cards" prefetch={false}>
          Catalogue
        </Link>
        <Link href="/cards-preview" prefetch={false}>
          L’atelier
        </Link>
      </nav>
      <span className={styles.edition}>COLLECTION ORIGIN / 01</span>
    </header>
  );
}
