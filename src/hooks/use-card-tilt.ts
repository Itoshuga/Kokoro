"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties, PointerEvent } from "react";

type CardTiltStyle = CSSProperties & {
  "--rx": string;
  "--ry": string;
  "--mx": string;
  "--my": string;
};

export function useCardTilt(enabled: boolean, allowTouch = false) {
  const [style, setStyle] = useState<CardTiltStyle>();
  const pendingStyle = useRef<CardTiltStyle | undefined>(undefined);
  const frame = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, []);

  function onPointerMove(event: PointerEvent<HTMLButtonElement>) {
    if (
      !enabled ||
      (event.pointerType === "touch" && !allowTouch) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    const x = Math.max(
      0,
      Math.min(1, (event.clientX - bounds.left) / bounds.width),
    );
    const y = Math.max(
      0,
      Math.min(1, (event.clientY - bounds.top) / bounds.height),
    );

    pendingStyle.current = {
      "--rx": `${(0.5 - y) * 13}deg`,
      "--ry": `${(x - 0.5) * 13}deg`,
      "--mx": `${x * 100}%`,
      "--my": `${y * 100}%`,
    };

    if (frame.current === null) {
      frame.current = requestAnimationFrame(() => {
        setStyle(pendingStyle.current);
        frame.current = null;
      });
    }
  }

  function onPointerLeave() {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = null;
    setStyle((current) =>
      current ? { ...current, "--rx": "0deg", "--ry": "0deg" } : undefined,
    );
  }

  return { style: enabled ? style : undefined, onPointerMove, onPointerLeave };
}
