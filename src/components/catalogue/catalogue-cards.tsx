"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";

import { KanjiCard } from "@/components/kanji-card/kanji-card";
import type { CatalogueCardItem } from "@/types/catalogue";

import styles from "./catalogue.module.css";

const KanjiCardInspector = dynamic(
  () =>
    import("@/components/kanji-card/kanji-card-inspector").then(
      (module) => module.KanjiCardInspector,
    ),
  { ssr: false },
);

export function CatalogueCards({
  items,
  returnTo = "/cards",
  variant = "grid",
}: {
  readonly items: readonly CatalogueCardItem[];
  readonly returnTo?: string;
  readonly variant?: "grid" | "single";
}) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  return (
    <>
      <div className={variant === "grid" ? styles.grid : styles.singleCard}>
        {items.map((item, index) => (
          <div className={styles.cardSlot} key={item.cardId}>
            <KanjiCard
              card={item.view}
              onInspect={() => setSelectedIndex(index)}
            />
            {variant === "grid" && (
              <Link
                className={styles.cardLink}
                prefetch={false}
                href={`/cards/${item.cardId}?from=${encodeURIComponent(returnTo)}`}
                aria-label={`Voir la fiche de ${item.view.kanji} — ${item.view.meaning}`}
              >
                Voir la fiche <span aria-hidden="true">↗</span>
              </Link>
            )}
          </div>
        ))}
      </div>
      {selectedIndex !== null && (
        <KanjiCardInspector
          cards={items.map((item) => item.view)}
          initialIndex={selectedIndex}
          onClose={() => setSelectedIndex(null)}
        />
      )}
    </>
  );
}
