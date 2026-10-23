import { CARD_RARITY_LABELS } from "@/constants/kanji-card";
import type { KanjiCardData } from "@/types/kanji-card";

import styles from "./kanji-card.module.css";

interface KanjiCardFrontProps {
  readonly card: KanjiCardData;
}

export function KanjiCardFront({ card }: KanjiCardFrontProps) {
  return (
    <span className={styles.face}>
      <span className={styles.innerFrame} aria-hidden="true">
        <span className={`${styles.corner} ${styles["corner--tl"]}`} />
        <span className={`${styles.corner} ${styles["corner--tr"]}`} />
        <span className={`${styles.corner} ${styles["corner--bl"]}`} />
        <span className={`${styles.corner} ${styles["corner--br"]}`} />
      </span>
      <span className={styles.ambient} aria-hidden="true">
        <span className={styles.aura} />
        <span className={styles.cross} />
        <span className={styles.ring} />
        <span className={styles.haloArc} />
        <span className={`${styles.star} ${styles["star--one"]}`} />
        <span className={`${styles.star} ${styles["star--two"]}`} />
        <span className={`${styles.star} ${styles["star--three"]}`} />
        <span className={`${styles.star} ${styles["star--four"]}`} />
        <span className={styles.bigghost} lang="ja">
          {card.kanji}
        </span>
      </span>
      <span className={styles.head}>
        <span className={styles.headLeft}>
          KOKORO <small lang="ja">漢字の世界 / {card.collection.edition}</small>
        </span>
        <span className={styles.diamond} aria-hidden="true">
          ✧
        </span>
      </span>
      <span className={styles.vertical} lang="ja">
        ことばのちから
      </span>
      <span className={styles.kanji} lang="ja">
        {card.kanji}
      </span>
      <span
        className={styles.midtext}
        lang="ja-Latn"
        title={card.romaji ?? undefined}
      >
        {card.romaji}
      </span>
      <span className={styles.bottom}>
        <span className={styles.japanese} lang="ja">
          {card.reading}
        </span>
        <span
          className={`${styles.meaning} ${card.meaning.length > 26 ? styles.clampedText : ""}`}
          title={card.meaning}
        >
          {card.meaning}
        </span>
        <span className={styles.baseline} aria-hidden="true" />
        <span className={styles.cardBottomRow}>
          <span className={styles.rarity}>
            ✧ {CARD_RARITY_LABELS[card.rarity]}
          </span>
          <span className={styles.number}>
            № {card.number} /{" "}
            {String(card.collection.totalCards).padStart(3, "0")}
          </span>
        </span>
      </span>
    </span>
  );
}
