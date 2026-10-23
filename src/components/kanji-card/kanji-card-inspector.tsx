"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent } from "react";

import { CARD_RARITY_LABELS } from "@/constants/kanji-card";
import type { KanjiCardData } from "@/types/kanji-card";

import { KanjiCardBack } from "./kanji-card-back";
import { KanjiCardFront } from "./kanji-card-front";
import styles from "./kanji-card.module.css";

interface KanjiCardInspectorProps {
  readonly cards: readonly KanjiCardData[];
  readonly initialIndex: number;
  readonly onClose: () => void;
  readonly holographic?: boolean;
}

export function KanjiCardInspector({
  cards,
  initialIndex,
  onClose,
  holographic = true,
}: KanjiCardInspectorProps) {
  const [inspection, setInspection] = useState({
    index: initialIndex,
    flipped: false,
  });
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const nextButtonRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const card = cards[inspection.index];

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !cards.length) return;

    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";

    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) {
        previousFocus.focus({ preventScroll: true });
      }
    };
  }, [cards.length]);

  if (!card) return null;

  function navigate(direction: -1 | 1) {
    setInspection((current) => ({
      index: (current.index + direction + cards.length) % cards.length,
      flipped: false,
    }));
  }

  function flip() {
    setInspection((current) => ({ ...current, flipped: !current.flipped }));
  }

  function onKeyDown(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === "Tab") {
      if (event.shiftKey && document.activeElement === closeButtonRef.current) {
        event.preventDefault();
        nextButtonRef.current?.focus();
      } else if (
        !event.shiftKey &&
        document.activeElement === nextButtonRef.current
      ) {
        event.preventDefault();
        closeButtonRef.current?.focus();
      }
      return;
    }
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      navigate(event.key === "ArrowRight" ? 1 : -1);
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className={`${styles.overlay} ${styles.inspectionOverlay} ${holographic ? "" : styles.holoOff}`}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onKeyDown={onKeyDown}
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className={`${styles.inspector} ${styles[`inspector--${card.rarity}`]}`}
      >
        <header className={styles.inspectorHead}>
          <div className={styles.inspectorBrand}>
            <span className={styles.inspectorSymbol} lang="ja">
              心
            </span>
            <span>
              KOKORO <small>CARTE / INSPECTION</small>
            </span>
          </div>
          <button
            ref={closeButtonRef}
            className={styles.inspectorClose}
            type="button"
            aria-label="Fermer"
            onClick={onClose}
          >
            ✕
          </button>
        </header>
        <div className={styles.inspectorBody}>
          <div className={styles.inspectorCardArea}>
            <div
              className={`${styles.flip} ${inspection.flipped ? styles["flip--turned"] : ""}`}
            >
              <span className={styles.flipInner}>
                <span
                  className={styles.flipFront}
                  aria-hidden={inspection.flipped}
                >
                  <span
                    className={`${styles.card} ${styles[`card--${card.rarity}`]} ${styles["card--large"]}`}
                  >
                    <KanjiCardFront card={card} />
                  </span>
                </span>
                <KanjiCardBack card={card} ariaHidden={!inspection.flipped} />
              </span>
              <button
                type="button"
                className={styles.flipTrigger}
                aria-pressed={inspection.flipped}
                aria-label={
                  inspection.flipped
                    ? `Revenir au recto de la carte ${card.meaning}`
                    : `Retourner la carte ${card.meaning}`
                }
                onClick={flip}
              />
            </div>
            <div className={styles.cardTurnHint}>
              <span aria-hidden="true">⟳</span>
              <span>
                {inspection.flipped
                  ? "Cliquez pour voir le recto"
                  : "Cliquez sur la carte pour découvrir le verso"}
              </span>
            </div>
          </div>
          <aside className={styles.inspectorSide}>
            <div className={styles.inspectorKicker}>
              COLLECTION {card.collection.name} <span> / {card.number}</span>
            </div>
            <div className={styles.inspectorEyebrow}>INSPECTION DE CARTE</div>
            <h2 id={titleId}>
              {card.meaning}
              <span className={styles.inspectorGlyph} lang="ja">
                {card.kanji}
              </span>
            </h2>
            <p className={styles.inspectorRom} aria-hidden={!card.romaji}>
              {card.romaji ?? "\u00a0"}
            </p>
            <span className={styles.inspectorRarity}>
              ✧ {CARD_RARITY_LABELS[card.rarity]}
            </span>
            <div className={styles.inspectorRule} aria-hidden="true" />
            <p className={styles.inspectorDescription}>
              {card.lore
                ? "Observez les détails de la carte, puis retournez-la pour découvrir les lectures et l’histoire du kanji."
                : "Observez les détails de la carte, puis retournez-la pour découvrir les lectures du kanji."}
            </p>
            <button
              className={styles.inspectorAction}
              type="button"
              onClick={flip}
            >
              <span aria-hidden="true">⟳</span>
              <span>
                {inspection.flipped ? "Revenir au recto" : "Retourner la carte"}
              </span>
              <span aria-hidden="true">↗</span>
            </button>
            <div className={styles.inspectorNavigation}>
              <button
                type="button"
                aria-label="Carte précédente"
                onClick={() => navigate(-1)}
              >
                ←
              </button>
              <span role="status" aria-live="polite" aria-atomic="true">
                <span className="sr-only">Carte </span>
                {String(inspection.index + 1).padStart(2, "0")} <b>/</b>{" "}
                {String(cards.length).padStart(2, "0")}
              </span>
              <button
                ref={nextButtonRef}
                type="button"
                aria-label="Carte suivante"
                onClick={() => navigate(1)}
              >
                →
              </button>
            </div>
            <p className={styles.inspectorShortcuts}>
              ← → changer de carte · Échap fermer
            </p>
          </aside>
        </div>
      </div>
    </dialog>
  );
}
