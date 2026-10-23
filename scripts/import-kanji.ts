import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile, rename } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { normalizeDictionary } from "../src/lib/kanji/normalization.ts";
import {
  buildOriginCards,
  isOriginEligible,
} from "../src/lib/kanji/origin-import.ts";
import type { KanjiDatasetProvenance } from "../src/types/kanji.ts";
import type { KanjiCard } from "../src/types/kanji-card.ts";

const input = process.argv[2];
if (!input)
  throw new Error('Usage : npm run data:import -- "chemin/kanji-all.json"');
const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const directory = path.join(projectRoot, "data/kanji");
const inputPath = path.resolve(input);
if (inputPath.startsWith(directory + path.sep)) {
  throw new Error(
    "Le fichier source doit être distinct du dossier de données générées.",
  );
}
const sourceBytes = await readFile(inputPath);
const hash = createHash("sha256").update(sourceBytes).digest("hex");
const { entries, metadata } = normalizeDictionary(
  JSON.parse(sourceBytes.toString("utf8")),
);
let previousCards: KanjiCard[] = [];
try {
  previousCards = JSON.parse(
    await readFile(path.join(directory, "cards.json"), "utf8"),
  );
} catch (error) {
  if (!(error instanceof Error && "code" in error && error.code === "ENOENT"))
    throw error;
}
const cards = buildOriginCards(entries, previousCards);
const provenance: KanjiDatasetProvenance = {
  schemaVersion: 1,
  sourceSha256: hash,
  sourceMetadata: metadata,
  attribution:
    "KANJIDIC2 © James William Breen et Electronic Dictionary Research and Development Group (EDRDG)",
  projectUrl: "https://www.edrdg.org/wiki/KANJIDIC_Project.html",
  license: "CC BY-SA 4.0",
  licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
  changes: [
    "Normalisation des identifiants Unicode et sélection des champs publics français/anglais.",
    "Suppression des références de dictionnaires et des autres champs non utilisés ; aucune traduction ajoutée à la source.",
    "Séparation des cartes Origin et des compléments éditoriaux Kokoro.",
  ],
  counts: {
    imported: entries.length,
    withFrench: entries.filter((entry) => entry.meanings.fr.length).length,
    withEnglish: entries.filter((entry) => entry.meanings.en.length).length,
    withoutTranslation: entries.filter(
      (entry) => !entry.meanings.fr.length && !entry.meanings.en.length,
    ).length,
    withFrequency: entries.filter((entry) => entry.frequencyRank !== null)
      .length,
    eligibleOrigin: entries.filter(isOriginEligible).length,
    publishedOrigin: cards.filter((card) => card.status === "published").length,
  },
};
await mkdir(directory, { recursive: true });
for (const [filename, content] of Object.entries({
  "dictionary.json": entries,
  "cards.json": cards,
  "provenance.json": provenance,
})) {
  const output = path.join(directory, filename);
  await writeFile(`${output}.tmp`, JSON.stringify(content) + "\n");
  await rename(`${output}.tmp`, output);
}
if (
  createHash("sha256")
    .update(await readFile(inputPath))
    .digest("hex") !== hash
) {
  throw new Error("Le fichier source a changé pendant l'importation.");
}
console.log(JSON.stringify(provenance.counts, null, 2));
