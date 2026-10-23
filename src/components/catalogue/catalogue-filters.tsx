import Form from "next/form";
import Link from "next/link";

import { CARD_RARITY_LABELS } from "@/constants/kanji-card";
import { catalogueHref } from "@/lib/catalogue/query";
import { gradeLabel } from "@/lib/catalogue/presentation";
import type { CatalogueFacets, CatalogueQuery } from "@/types/catalogue";

import styles from "./catalogue.module.css";

export function CatalogueFilters({
  query,
  facets,
}: {
  readonly query: CatalogueQuery;
  readonly facets: CatalogueFacets;
}) {
  return (
    <Form
      action="/cards"
      prefetch={false}
      className={styles.filters}
      key={catalogueHref(query)}
    >
      <label className={styles.searchLabel} htmlFor="catalogue-search">
        Rechercher dans la collection
      </label>
      <div className={styles.searchBar}>
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="10.5" cy="10.5" r="6.5" />
          <path d="m16 16 4 4" />
        </svg>
        <input
          id="catalogue-search"
          type="search"
          name="q"
          defaultValue={query.q}
          maxLength={120}
          placeholder="Kanji, sens, lecture ou Unicode…"
          autoComplete="off"
          aria-describedby="search-help"
        />
        <button type="submit">
          Rechercher <span aria-hidden="true">↗</span>
        </button>
      </div>
      <p id="search-help" className={styles.searchHelp}>
        En japonais, français ou anglais. Casse et accents latins indifférents.
      </p>
      <div className={styles.filterRow}>
        <label>
          Rareté
          <select name="rarity" defaultValue={query.rarity}>
            <option value="">Toutes les raretés</option>
            {Object.entries(CARD_RARITY_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Nombre de traits
          <select name="strokes" defaultValue={query.strokes ?? ""}>
            <option value="">Tous les nombres</option>
            {facets.strokes.map((value) => (
              <option key={value} value={value}>
                {value} trait{value > 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </label>
        <label>
          Niveau scolaire japonais
          <select name="grade" defaultValue={query.grade ?? ""}>
            <option value="">Tous les niveaux</option>
            {facets.grades.map((value) => (
              <option key={value} value={value}>
                {gradeLabel(value)}
              </option>
            ))}
          </select>
        </label>
        <label>
          JLPT historique
          <select name="jlpt" defaultValue={query.jlpt ?? ""}>
            <option value="">Tous les anciens niveaux</option>
            {facets.jlpt.map((value) => (
              <option key={value} value={value}>
                Ancien niveau {value}
              </option>
            ))}
          </select>
        </label>
        <label>
          Trier par
          <select name="sort" defaultValue={query.sort}>
            <option value="number">Numéro de collection</option>
            <option value="rarity">Rareté croissante</option>
            <option value="frequency">Fréquence d’utilisation</option>
            <option value="strokes">Nombre de traits</option>
            <option value="unicode">Ordre Unicode</option>
          </select>
        </label>
      </div>
      <div className={styles.filterActions}>
        <p>
          La rareté ne mesure pas la difficulté d’un kanji. Le JLPT indiqué est
          un classement historique.
        </p>
        <div>
          <Link href="/cards" prefetch={false}>
            Réinitialiser
          </Link>
          <button type="submit">Appliquer les filtres</button>
        </div>
      </div>
    </Form>
  );
}
