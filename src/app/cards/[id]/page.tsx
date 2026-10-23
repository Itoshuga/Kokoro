import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CatalogueCards } from "@/components/catalogue/catalogue-cards";
import styles from "@/components/catalogue/catalogue.module.css";
import { CARD_RARITY_LABELS } from "@/constants/kanji-card";
import { kanjiEditorial } from "@/data/kanji-editorial";
import {
  getKanjiTranslation,
  gradeLabel,
  toKanjiCardView,
} from "@/lib/catalogue/presentation";
import { parseCatalogueQuery } from "@/lib/catalogue/query";
import { catalogueRepository } from "@/lib/catalogue/repository";

export const dynamic = "force-dynamic";
type DetailProps = {
  readonly params: Promise<{ id: string }>;
  readonly searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({
  params,
}: DetailProps): Promise<Metadata> {
  const entry = await catalogueRepository.findCard((await params).id);
  if (!entry) return { title: "Carte introuvable — Kokoro" };
  const translation = getKanjiTranslation(entry.kanji);
  return {
    title: `${entry.kanji.character} — ${translation.meanings[0] ?? "Kanji"} — Kokoro`,
    description: `Lectures et informations linguistiques de ${entry.kanji.character}, carte de l’édition Origin.`,
  };
}

export default async function KanjiDetailPage({
  params,
  searchParams,
}: DetailProps) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const [entry, overview] = await Promise.all([
    catalogueRepository.findCard(id),
    catalogueRepository.search(parseCatalogueQuery({})),
  ]);
  if (!entry) notFound();
  const { kanji, card } = entry;
  const translation = getKanjiTranslation(kanji);
  const editorial = kanjiEditorial[kanji.id];
  const from =
    typeof query.from === "string" &&
    query.from.length <= 1500 &&
    /^\/cards(?:\?[^#]*)?$/.test(query.from)
      ? query.from
      : "/cards";
  return (
    <main className={styles.detail}>
      <Link href={from} className={styles.backLink} prefetch={false}>
        ← Retour au catalogue
      </Link>
      <div className={styles.detailGrid}>
        <section className={styles.cardColumn} aria-label="Carte à inspecter">
          <CatalogueCards
            variant="single"
            items={[
              {
                cardId: card.id,
                view: toKanjiCardView(entry, overview.published),
              },
            ]}
          />
          <p className={styles.cardHint}>
            Cliquez sur la carte pour l’inspecter et la retourner.
          </p>
          <p className={styles.editorialNote}>
            Les exemples, romanisations et récits sont uniquement affichés
            lorsqu’ils ont été fournis par le prototype éditorial.
          </p>
        </section>
        <article className={styles.kanjiInformation}>
          <p className={styles.eyebrow}>
            ORIGIN / № {String(card.collectionNumber).padStart(3, "0")}{" "}
            <span>— {kanji.unicode}</span>
          </p>
          <div className={styles.detailTitle}>
            <span className={styles.detailGlyph} lang="ja">
              {kanji.character}
            </span>
            <div>
              <h1>{translation.meanings[0] ?? "Traduction non renseignée"}</h1>
              <span className={styles.rarityTag}>
                ✧ {CARD_RARITY_LABELS[card.rarity]} · Origin
              </span>
            </div>
          </div>
          {translation.language === "en" && (
            <p className={styles.languageNotice}>
              Signification en anglais — aucune traduction française disponible.
            </p>
          )}
          {translation.editorial && (
            <p className={styles.languageNotice}>
              {editorial.note} Source : {editorial.source}.
            </p>
          )}
          {translation.meanings.length > 1 && (
            <section className={styles.infoSection}>
              <h2>
                Autres significations
                {translation.language === "en" ? " en anglais" : " françaises"}
              </h2>
              <div className={styles.tags}>
                {translation.meanings.slice(1).map((meaning) => (
                  <span key={meaning}>{meaning}</span>
                ))}
              </div>
            </section>
          )}
          {translation.language === "fr" && kanji.meanings.en.length > 0 && (
            <section className={styles.infoSection}>
              <h2>Significations anglaises</h2>
              <p lang="en">{kanji.meanings.en.join(" · ")}</p>
            </section>
          )}
          <div className={styles.readings}>
            <section>
              <h2>
                Lectures on’yomi <span lang="ja">音読み</span>
              </h2>
              {kanji.readings.on.length ? (
                <ul lang="ja">
                  {kanji.readings.on.map((reading) => (
                    <li key={reading}>{reading}</li>
                  ))}
                </ul>
              ) : (
                <p>Non renseignées</p>
              )}
            </section>
            <section>
              <h2>
                Lectures kun’yomi <span lang="ja">訓読み</span>
              </h2>
              {kanji.readings.kun.length ? (
                <ul lang="ja">
                  {kanji.readings.kun.map((reading) => (
                    <li key={reading}>{reading}</li>
                  ))}
                </ul>
              ) : (
                <p>Non renseignées</p>
              )}
            </section>
          </div>
          <dl className={styles.facts}>
            <div>
              <dt>Nombre de traits</dt>
              <dd>
                {kanji.strokes[0] ?? "Non renseigné"}
                {kanji.strokes.length > 1 && (
                  <small className={styles.alternateStrokes}>
                    Autres décomptes signalés :{" "}
                    {kanji.strokes.slice(1).join(" / ")}
                  </small>
                )}
              </dd>
            </div>
            <div>
              <dt>Niveau scolaire japonais</dt>
              <dd>
                {kanji.grade === null
                  ? "Non renseigné"
                  : gradeLabel(kanji.grade)}
              </dd>
            </div>
            <div>
              <dt>Rang de fréquence</dt>
              <dd>
                {kanji.frequencyRank === null
                  ? "Non renseigné"
                  : new Intl.NumberFormat("fr-FR").format(kanji.frequencyRank)}
              </dd>
            </div>
            <div>
              <dt>JLPT historique</dt>
              <dd>
                {kanji.jlptLegacy === null
                  ? "Non renseigné"
                  : `Ancien niveau ${kanji.jlptLegacy}`}
              </dd>
            </div>
          </dl>
          <p className={styles.informationNote}>
            Le rang de fréquence décrit l’usage dans le corpus source. La rareté
            relève de la collection et ne mesure pas la difficulté. Le
            classement JLPT est historique et ne correspond pas aux niveaux
            actuels.
          </p>
        </article>
      </div>
    </main>
  );
}
