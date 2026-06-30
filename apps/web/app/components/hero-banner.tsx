import Image from 'next/image';
import Link from 'next/link';
import type { HeroBanner as HeroBannerModel } from '../lib/models';
import styles from './hero-banner.module.css';

export function HeroBanner({ data }: { data: HeroBannerModel }) {
  return (
    <section className={styles.hero}>
      <div className={styles.copy}>
        <h1 className={styles.title}>{data.title}</h1>
        <p className={styles.subtitle}>{data.subtitle}</p>
        <Link href={data.ctaHref} className={styles.cta}>
          {data.ctaLabel}
        </Link>
      </div>

      <div className={styles.media}>
        <Image
          src={data.image}
          alt=""
          aria-hidden="true"
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className={styles.image}
        />
      </div>
    </section>
  );
}
