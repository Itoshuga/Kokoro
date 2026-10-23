import styles from "@/components/catalogue/catalogue.module.css";

export default function CatalogueLoading() {
  return (
    <main className={styles.loading} role="status">
      Chargement des cartes…
    </main>
  );
}
