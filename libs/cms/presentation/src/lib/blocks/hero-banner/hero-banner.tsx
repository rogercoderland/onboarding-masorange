import type { HeroBannerBlock } from '@onboarding-nx/cms-domain';
import styles from './hero-banner.module.css';

/**
 * Dumb, framework-agnostic hero block. Uses semantic `<a>`/`<img>` so the lib
 * stays reusable in any React app (Next or Vite). A Next app can wrap it with
 * `next/image`/`next/link` at the composition layer.
 */
export function HeroBanner({ block }: { block: HeroBannerBlock }) {
  return (
    <section className={styles.hero}>
      <div className={styles.copy}>
        <h1 className={styles.title}>{block.title}</h1>
        <p className={styles.subtitle}>{block.subtitle}</p>
        <a href={block.ctaHref} className={styles.cta}>
          {block.ctaLabel}
        </a>
      </div>

      <div className={styles.media}>
        <img
          src={block.image}
          alt=""
          aria-hidden="true"
          className={styles.image}
        />
      </div>
    </section>
  );
}
