import type { ReactNode } from "react";

import { CatalogueHeader } from "@/components/catalogue/catalogue-header";
import { DataAttribution } from "@/components/catalogue/data-attribution";
import styles from "@/components/catalogue/catalogue.module.css";
import { catalogueRepository } from "@/lib/catalogue/repository";

export default async function CardsLayout({
  children,
}: {
  readonly children: ReactNode;
}) {
  const provenance = await catalogueRepository.provenance();
  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <CatalogueHeader />
        {children}
        <DataAttribution provenance={provenance} />
      </div>
    </div>
  );
}
