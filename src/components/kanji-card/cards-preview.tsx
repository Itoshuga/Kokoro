"use client";

import { useState } from "react";

import type { KanjiCardData } from "@/types/kanji-card";

import { KanjiCard } from "./kanji-card";
import { KanjiCardInspector } from "./kanji-card-inspector";
import styles from "./kanji-card.module.css";

interface CardsPreviewProps {
  readonly cards: readonly KanjiCardData[];
}

export function CardsPreview({ cards }: CardsPreviewProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [holographic, setHolographic] = useState(true);

  return (
    <main className={`${styles.page} ${holographic ? "" : styles.holoOff}`}>
      <div className={styles.shell}>
        <header className={styles.navbar}>
          <div className={styles.brand}>
            <div className={styles.brandMark} lang="ja">
              心
            </div>
            <div>
              <div className={styles.brandMain}>KOKORO</div>
              <div className={styles.brandSub}>KANJI CARD ATELIER</div>
            </div>
          </div>
          <div className={styles.navMid}>
            <span>Collection</span>
            <span>Les raretés</span>
            <span>Le codex</span>
          </div>
          <div className={styles.navSide}>
            <b>●</b> DESIGN LAB / 01
          </div>
        </header>
        <section className={styles.hero}>
          <div className={styles.overline}>第一章 — CHAPITRE I</div>
          <h1>
            Un symbole. <em>Un monde.</em>
          </h1>
          <p className={styles.subtitle}>
            L’art des kanjis, réinventé en cartes de collection.
          </p>
        </section>
        <div className={styles.sectionTop}>
          <div className={styles.series}>
            <span>01 / 05</span>
            <div>
              LES CINQ ESSENCES <small>— COLLECTION ORIGIN</small>
            </div>
          </div>
          <div className={styles.tools}>
            <span className={styles.help}>
              CLIQUEZ POUR INSPECTER · CLIQUEZ ENCORE POUR RETOURNER
            </span>
            <button
              className={styles.toggle}
              type="button"
              aria-pressed={holographic}
              onClick={() => setHolographic((current) => !current)}
            >
              <span className={styles.switch} aria-hidden="true">
                <i />
              </span>
              Reflets holo
            </button>
          </div>
        </div>
        <section
          className={styles.grid}
          aria-label="Cinq cartes kanji, une par rareté"
        >
          {cards.map((card, index) => (
            <KanjiCard
              key={card.id}
              card={card}
              holographic={holographic}
              onInspect={() => setSelectedIndex(index)}
            />
          ))}
        </section>
        <footer className={styles.bottomBar}>
          <span>
            © KOKORO CARD ATELIER <b>— CONCEPT / COLLECTION 001</b>
          </span>
          <span className={styles.bottomKanji} lang="ja">
            一文字、一世界。
          </span>
          <span>CONÇU POUR LES CURIEUX DU JAPON</span>
        </footer>
      </div>
      {selectedIndex !== null && (
        <KanjiCardInspector
          cards={cards}
          initialIndex={selectedIndex}
          holographic={holographic}
          onClose={() => setSelectedIndex(null)}
        />
      )}
    </main>
  );
}
