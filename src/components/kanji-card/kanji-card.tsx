"use client";

import { CARD_RARITY_LABELS } from "@/constants/kanji-card";
import { useCardTilt } from "@/hooks/use-card-tilt";
import type { KanjiCardData } from "@/types/kanji-card";

import { KanjiCardFront } from "./kanji-card-front";
import styles from "./kanji-card.module.css";

interface KanjiCardProps {
  readonly card: KanjiCardData;
  readonly onInspect: (card: KanjiCardData) => void;
  readonly holographic?: boolean;
}

export function KanjiCard({
  card,
  onInspect,
  holographic = true,
}: KanjiCardProps) {
  const tilt = useCardTilt(holographic);

  return (
    <article
      className={`${styles.cardUnit} ${styles[`cardUnit--${card.rarity}`]} ${holographic ? "" : styles.holoOff}`}
    >
      <button
        type="button"
        className={`${styles.card} ${styles[`card--${card.rarity}`]}`}
        aria-label={`Ouvrir la carte ${card.kanji}, ${card.meaning}, rareté ${CARD_RARITY_LABELS[card.rarity]}`}
        onClick={() => onInspect(card)}
        {...tilt}
      >
        <KanjiCardFront card={card} />
      </button>
      <div className={styles.under}>
        <span className={styles.underName}>
          <span className={styles.rarityDot} aria-hidden="true" />
          {CARD_RARITY_LABELS[card.rarity]}
        </span>
        <span className={styles.underId}>#{card.number}</span>
      </div>
    </article>
  );
}
