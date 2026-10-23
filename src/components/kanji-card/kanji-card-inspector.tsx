"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent, MouseEvent, PointerEvent } from "react";

import { useCardTilt } from "@/hooks/use-card-tilt";
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
  const flipButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const gesture = useRef<{
    pointerId: number;
    x: number;
    y: number;
    moved: boolean;
  } | null>(null);
  const hintId = useId();
  const tilt = useCardTilt(holographic, true);
  const card = cards[inspection.index];

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !cards.length) return;

    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    flipButtonRef.current?.focus({ preventScroll: true });
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

  function onKeyDown(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === "Tab") {
      if (event.shiftKey && document.activeElement === flipButtonRef.current) {
        event.preventDefault();
        closeButtonRef.current?.focus();
      } else if (
        !event.shiftKey &&
        document.activeElement === closeButtonRef.current
      ) {
        event.preventDefault();
        flipButtonRef.current?.focus();
      }
      return;
    }
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      const direction = event.key === "ArrowRight" ? 1 : -1;
      setInspection((current) => ({
        index: (current.index + direction + cards.length) % cards.length,
        flipped: false,
      }));
      tilt.onPointerLeave();
    }
  }

  function onPointerDown(event: PointerEvent<HTMLButtonElement>) {
    if (!event.isPrimary || event.button !== 0) return;
    gesture.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      moved: false,
    };
    if (event.pointerType === "touch") {
      event.currentTarget.setPointerCapture(event.pointerId);
    }
  }

  function onPointerMove(event: PointerEvent<HTMLButtonElement>) {
    if (!event.isPrimary) return;
    const start = gesture.current;
    if (
      start?.pointerId === event.pointerId &&
      Math.hypot(event.clientX - start.x, event.clientY - start.y) > 8
    ) {
      start.moved = true;
    }
    tilt.onPointerMove(event);
  }

  function onFlip(event: MouseEvent<HTMLButtonElement>) {
    // Un glissement incline la carte ; seuls un appui ou le clavier la retournent.
    const dragged = event.detail !== 0 && gesture.current?.moved;
    gesture.current = null;
    if (dragged) return;
    setInspection((current) => ({ ...current, flipped: !current.flipped }));
  }

  return (
    <dialog
      ref={dialogRef}
      className={`${styles.overlay} ${styles.inspectionOverlay} ${holographic ? "" : styles.holoOff}`}
      aria-label={`Carte ${card.kanji} — ${card.meaning}`}
      aria-describedby={hintId}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onKeyDown={onKeyDown}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className={styles.inspector}>
        <div
          className={`${styles.flip} ${inspection.flipped ? styles["flip--turned"] : ""}`}
          style={tilt.style}
        >
          <span className={styles.flipTilt}>
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
          </span>
          <button
            ref={flipButtonRef}
            type="button"
            className={styles.flipTrigger}
            aria-pressed={inspection.flipped}
            aria-label={
              inspection.flipped
                ? `Revenir au recto de la carte ${card.meaning}`
                : `Retourner la carte ${card.meaning}`
            }
            onClick={onFlip}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerLeave={tilt.onPointerLeave}
            onPointerUp={(event) => {
              if (event.pointerType === "touch") tilt.onPointerLeave();
            }}
            onPointerCancel={() => {
              gesture.current = null;
              tilt.onPointerLeave();
            }}
          />
        </div>
        <p className={styles.cardTurnHint} id={hintId}>
          Bouge la souris ou le doigt pour l’incliner · touche la carte pour la
          retourner
        </p>
        <span
          className="sr-only"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {card.kanji}, {card.meaning}. Carte {inspection.index + 1} sur{" "}
          {cards.length}.
        </span>
      </div>
      <button
        ref={closeButtonRef}
        type="button"
        className={styles.inspectorClose}
        aria-label="Fermer la carte"
        onClick={onClose}
      >
        <span aria-hidden="true">✕</span>
      </button>
    </dialog>
  );
}
