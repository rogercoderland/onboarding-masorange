import type { FeatureBannerBlock } from '@onboarding-nx/cms-domain';
import styles from './feature-banner.module.css';

export function FeatureBanner({ block }: { block: FeatureBannerBlock }) {
  return (
    <section className={styles.banner}>
      <div className={styles.copy}>
        <h2 className={styles.title}>{block.title}</h2>
        <p className={styles.description}>{block.description}</p>
      </div>
      <a href={block.ctaHref} className={styles.cta}>
        {block.ctaLabel}
      </a>
    </section>
  );
}
