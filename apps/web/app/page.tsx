import { cacheLife, cacheTag } from 'next/cache';
import { RenderBadge } from '@onboarding-nx/ui';
import { getHomeSections } from './lib/mock-api';
import { CacheTags } from './lib/cache-tags';
import { HeroBanner } from './components/hero-banner';
import { FeatureBanner } from './components/feature-banner';
import { DeviceCard } from './components/device-card';
import styles from './home.module.css';

/**
 * Screen 01 — Home (Static).
 *
 * `'use cache'` + `cacheLife('max')` make this page fully static: the mock data
 * (and its `generatedAt` timestamp) is captured once at build/first-render and
 * then frozen — reloading the page never changes the timestamp. `cacheTag` lets
 * the revalidate API rebuild it on demand. This mirrors the wireframe's
 * "SSG + ISR" annotation, expressed in the Cache Components idiom.
 */
export default async function HomePage() {
  'use cache';
  cacheLife('max');
  cacheTag(CacheTags.homeSections);

  const { sections, generatedAt } = await getHomeSections();

  return (
    <div className={styles.page}>
      <RenderBadge
        type="static"
        renderedAt={generatedAt}
        strategy="use cache · cacheLife('max')"
      />

      <HeroBanner data={sections.hero} />

      <section className={styles.featured}>
        <h2 className={styles.sectionTitle}>Destacados</h2>
        <div className={styles.grid}>
          {sections.featured.map((device, index) => (
            <DeviceCard
              key={device.slug}
              device={device}
              priority={index === 0}
            />
          ))}
        </div>
      </section>

      <FeatureBanner data={sections.feature} />
    </div>
  );
}
