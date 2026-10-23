import type { KanjiDatasetProvenance } from "@/types/kanji";

import styles from "./catalogue.module.css";

export function DataAttribution({
  provenance,
}: {
  readonly provenance: KanjiDatasetProvenance;
}) {
  return (
    <footer className={styles.footer}>
      <p>
        Données linguistiques :{" "}
        <a href={provenance.projectUrl}>KANJIDIC2 / EDRDG</a>, © James William
        Breen et EDRDG. <a href={provenance.licenseUrl}>{provenance.license}</a>
        .
      </p>
      <p>
        Données normalisées pour Kokoro ; compléments éditoriaux identifiés
        séparément.{" "}
        <a href="https://www.edrdg.org/edrdg/licence.html">
          Conditions et attribution
        </a>
        .
      </p>
    </footer>
  );
}
