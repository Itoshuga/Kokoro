import { CARD_RARITY_LABELS } from "@/constants/kanji-card";
import type { KanjiCardData } from "@/types/kanji-card";

import styles from "./kanji-card.module.css";

interface KanjiCardBackProps {
  readonly card: KanjiCardData;
  readonly ariaHidden?: boolean;
}

export function KanjiCardBack({
  card,
  ariaHidden = false,
}: KanjiCardBackProps) {
  return (
    <span
      className={`${styles.flipBack} ${styles[`card--${card.rarity}`]}`}
      aria-hidden={ariaHidden}
    >
      <span className={styles.backDecoration} aria-hidden="true" lang="ja">
        {card.kanji}
      </span>
      <span className={styles.backHeader}>
        <span>
          KOKORO <small lang="ja">言葉の記録</small>
        </span>
        <span>№ {card.number}</span>
      </span>
      <span className={styles.backGlyph} lang="ja">
        {card.kanji}
      </span>
      <span
        className={`${styles.backTitle} ${card.meaning.length > 26 ? styles.clampedText : ""}`}
        title={card.meaning}
      >
        {card.meaning}
      </span>
      <span className={styles.backRom} lang="ja-Latn" aria-hidden={!card.romaji}>
        {card.romaji ?? "\u00a0"}
      </span>
      <span className={styles.backDivider} aria-hidden="true" />
      <span className={styles.backData}>
        <span className={styles.backField}>
          <span>
            LECTURE ON / <span lang="ja">音読み</span>
          </span>
          <b
            className={card.onyomi.length > 18 ? styles.clampedText : undefined}
            title={card.onyomi}
          >
            {card.onyomi || "—"}
          </b>
        </span>
        <span className={styles.backField}>
          <span>
            LECTURE KUN / <span lang="ja">訓読み</span>
          </span>
          <b
            className={
              card.kunyomi.length > 18 ? styles.clampedText : undefined
            }
            title={card.kunyomi}
          >
            {card.kunyomi || "—"}
          </b>
        </span>
        <span className={styles.backField}>
          <span>
            EXEMPLE / <span lang="ja">用例</span>
          </span>
          <b title={card.example ? undefined : "Aucun exemple fourni"}>
            {card.example ?? "—"}
          </b>
        </span>
        <span className={styles.backField}>
          <span>SIGNIFICATION</span>
          <b>{card.exampleMeaning ?? "—"}</b>
        </span>
      </span>
      <span className={styles.backLore}>
        {card.lore ? `« ${card.lore} »` : "Aucun récit éditorial."}
      </span>
      <span className={styles.backFooter}>
        <span>✧ {CARD_RARITY_LABELS[card.rarity]}</span>
        <span>
          {card.collection.name} · {card.collection.edition}/
          {String(card.collection.totalCards).padStart(2, "0")}
        </span>
      </span>
    </span>
  );
}
