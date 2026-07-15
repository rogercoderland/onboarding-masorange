import { Suspense } from 'react';
import { ServerFlags } from './server-flags';
import { FlagsPanel } from './flags-panel';
import styles from './flags.module.css';

export const metadata = {
  title: 'Feature flags · ConfigCat',
  description:
    'Demo de feature flags con ConfigCat: valores en CSR (AutoPoll) y SSR (por petición), targeting por usuario y panel de debug.',
};

/**
 * Demo page for Unit 5. The static shell prerenders; the server flags
 * section is per-request (see server-flags.tsx) so a dashboard toggle +
 * reload always shows fresh SSR values.
 */
export default function FlagsPage() {
  return (
    <div className={styles.page}>
      <header className={styles.head}>
        <h1 className={styles.title}>Feature flags (ConfigCat)</h1>
        <p className={styles.subtitle}>
          Los mismos flags leídos desde el servidor (por petición) y desde el
          navegador (AutoPoll cada 60 s). Cambia un valor en el dashboard de
          ConfigCat: la sección CSR se actualiza sola; la SSR, al recargar.
        </p>
      </header>

      <Suspense
        fallback={<p className={styles.loading}>Resolviendo flags en el servidor…</p>}
      >
        <ServerFlags />
      </Suspense>

      <FlagsPanel />
    </div>
  );
}
