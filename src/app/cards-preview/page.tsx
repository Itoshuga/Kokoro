import type { Metadata } from "next";

import { CardsPreview } from "@/components/kanji-card/cards-preview";
import { demoKanjiCards } from "@/data/demo-kanji-cards";

export const metadata: Metadata = {
  title: "Les cinq essences — Kokoro",
  description: "Les cinq cartes de la collection Origin de Kokoro.",
};

export default function CardsPreviewPage() {
  return <CardsPreview cards={demoKanjiCards} />;
}
