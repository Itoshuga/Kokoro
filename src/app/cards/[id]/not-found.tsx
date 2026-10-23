import Link from "next/link";

import styles from "@/components/catalogue/catalogue.module.css";

export default function CardNotFound() {
  return (
    <main className={styles.empty}>
      <span lang="ja">空</span>
      <h1>Carte introuvable</h1>
      <p>Cette carte n’est pas publiée dans l’édition Origin.</p>
      <Link href="/cards">Retour au catalogue →</Link>
    </main>
  );
}
