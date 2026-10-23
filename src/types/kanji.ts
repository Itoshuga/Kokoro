export interface Kanji {
  readonly id: string;
  readonly character: string;
  readonly unicode: string;
  readonly readings: {
    readonly on: readonly string[];
    readonly kun: readonly string[];
  };
  readonly meanings: {
    readonly fr: readonly string[];
    readonly en: readonly string[];
  };
  readonly strokes: readonly number[];
  readonly grade: number | null;
  readonly frequencyRank: number | null;
  readonly jlptLegacy: number | null;
  readonly radicals: readonly {
    readonly type: string;
    readonly value: string;
  }[];
}

export interface EditorialKanjiMeaning {
  readonly fr: readonly string[];
  readonly source: string;
  readonly note: string;
}

export interface KanjiDatasetProvenance {
  readonly schemaVersion: 1;
  readonly sourceSha256: string;
  readonly sourceMetadata: Readonly<Record<string, unknown>>;
  readonly attribution: string;
  readonly projectUrl: string;
  readonly license: "CC BY-SA 4.0";
  readonly licenseUrl: string;
  readonly changes: readonly string[];
  readonly counts: {
    readonly imported: number;
    readonly withFrench: number;
    readonly withEnglish: number;
    readonly withoutTranslation: number;
    readonly withFrequency: number;
    readonly eligibleOrigin: number;
    readonly publishedOrigin: number;
  };
}
