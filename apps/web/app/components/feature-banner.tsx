import Link from 'next/link';
import type { FeatureBanner as FeatureBannerModel } from '../lib/models';
import styles from './feature-banner.module.css';

export function FeatureBanner({ data }: { data: FeatureBannerModel }) {
  return (
    <section className={styles.banner}>
      <div className={styles.copy}>
        <h2 className={styles.title}>{data.title}</h2>
        <p className={styles.description}>{data.description}</p>
      </div>
      <Link href={data.ctaHref} className={styles.cta}>
        {data.ctaLabel}
      </Link>
    </section>
  );
}
