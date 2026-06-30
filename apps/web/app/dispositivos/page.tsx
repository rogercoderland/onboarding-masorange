import { Suspense } from 'react';
import { cacheLife, cacheTag } from 'next/cache';
import { RenderBadge } from '@onboarding-nx/ui';
import { getDevices } from '../lib/mock-api';
import { CacheTags } from '../lib/cache-tags';
import { Catalog } from '../components/catalog';
import { CatalogSkeleton } from '../components/catalog-skeleton';
import styles from './dispositivos.module.css';

/**
 * Cached catalog dataset (ISR). The `'use cache'` scope freezes the device list
 * and its `generatedAt` timestamp into a cache entry tagged `devices`
 */
async function getCatalog() {
  'use cache';
  cacheLife('catalog');
  cacheTag(CacheTags.devices);
  return getDevices();
}

export default async function CatalogoPage() {
  const { devices, generatedAt } = await getCatalog();

  return (
    <div className={styles.page}>
      <header className={styles.head}>
        <div>
          <h1 className={styles.title}>Dispositivos</h1>
          <p className={styles.subtitle}>
            {devices.length} modelos disponibles
          </p>
        </div>
        <RenderBadge
          type="isr"
          renderedAt={generatedAt}
          strategy="use cache · cacheLife('catalog')"
        />
      </header>

      <Suspense fallback={<CatalogSkeleton />}>
        <Catalog devices={devices} />
      </Suspense>
    </div>
  );
}
