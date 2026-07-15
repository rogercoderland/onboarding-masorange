'use client';

import Link from 'next/link';
import { useBooleanFlag } from '@onboarding-nx/configcat';
import styles from './feature-banner.module.css';

/**
 * Promo strip controlled by the `show_new_feature` boolean flag: toggling it
 * in the ConfigCat dashboard shows/hides the banner without a deploy (the
 * canonical feature-flag use case). Targeting demo: the dashboard rule turns
 * it on only for @masorange.com users (set the identity in /flags).
 */
export function FeatureBanner() {
  const showNewFeature = useBooleanFlag('show_new_feature');

  if (!showNewFeature) return null;

  return (
    <div className={styles.banner} role="status">
      <span aria-hidden="true">✨</span> Novedad: prueba nuestro comparador de
      dispositivos en{' '}
      <Link href="/dispositivos" className={styles.link}>
        Dispositivos
      </Link>
    </div>
  );
}
