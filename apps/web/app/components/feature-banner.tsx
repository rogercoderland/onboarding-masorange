'use client';

import Link from 'next/link';
import { useBooleanFlag } from '@onboarding-nx/configcat';
import styles from './feature-banner.module.css';

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
