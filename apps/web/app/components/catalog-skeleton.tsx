import styles from './catalog-skeleton.module.css';

export function CatalogSkeleton() {
  return (
    <div className={styles.skeleton} aria-hidden="true">
      <div className={styles.bar} />
      <div className={styles.grid}>
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className={styles.card} />
        ))}
      </div>
    </div>
  );
}
