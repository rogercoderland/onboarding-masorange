'use client';

import { useEffect, useState } from 'react';
import { Button, RenderBadge } from '@onboarding-nx/ui';
import {
  useBooleanFlag,
  useStringFlag,
  useNumberFlag,
  useConfigCat,
  type ConfigCatUser,
} from '@onboarding-nx/configcat';
import styles from './flags.module.css';

/** Demo identities to exercise the targeting rule on `show_new_feature`. */
const DEMO_USERS: Array<{ label: string; user: ConfigCatUser | undefined }> = [
  { label: 'Anónimo', user: undefined },
  {
    label: 'ana@masorange.com',
    user: { identifier: 'ana', email: 'ana@masorange.com' },
  },
  {
    label: 'bob@example.com',
    user: { identifier: 'bob', email: 'bob@example.com' },
  },
];

/**
 * Client section of the demo: live flag values via the three typed hooks,
 * a user selector to demo targeting, and a collapsible debug panel (extra).
 */
export function FlagsPanel() {
  const { getAllFlags, setUser, user, isReady, refresh } = useConfigCat();
  const showNewFeature = useBooleanFlag('show_new_feature');
  const buttonColor = useStringFlag('button_color', 'blue');
  const maxItems = useNumberFlag('max_items', 10);

  const [renderedAt, setRenderedAt] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    setRenderedAt(new Date().toISOString());
  }, [showNewFeature, buttonColor, maxItems, user]);

  const allFlags = getAllFlags();

  return (
    <section className={styles.section} aria-labelledby="csr-flags">
      <div className={styles.sectionHead}>
        <h2 id="csr-flags" className={styles.sectionTitle}>
          Navegador (CSR)
        </h2>
        {renderedAt && (
          <RenderBadge
            type="csr"
            renderedAt={renderedAt}
            strategy="AutoPoll 60s · configcat-js"
          />
        )}
      </div>

      {!isReady && <p className={styles.loading}>Inicializando ConfigCat…</p>}

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Flag</th>
            <th>Hook</th>
            <th>Valor</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>show_new_feature</code></td>
            <td><code>useBooleanFlag</code></td>
            <td><code>{String(showNewFeature)}</code></td>
            <td>
              <span className={showNewFeature ? styles.on : styles.off}>
                {showNewFeature ? 'ON' : 'OFF'}
              </span>
            </td>
          </tr>
          <tr>
            <td><code>button_color</code></td>
            <td><code>useStringFlag</code></td>
            <td><code>{buttonColor}</code></td>
            <td>
              <span
                className={styles.swatch}
                style={{ backgroundColor: buttonColor }}
                aria-label={`Color ${buttonColor}`}
              />
            </td>
          </tr>
          <tr>
            <td><code>max_items</code></td>
            <td><code>useNumberFlag</code></td>
            <td><code>{maxItems}</code></td>
            <td>—</td>
          </tr>
        </tbody>
      </table>

      <div className={styles.targeting}>
        <h3 className={styles.subheading}>User targeting</h3>
        <p className={styles.hint}>
          Elige una identidad y observa <code>show_new_feature</code>: la regla
          del dashboard lo enciende solo para emails <code>@masorange.com</code>.
        </p>
        <div className={styles.userRow} role="group" aria-label="Identidad de usuario">
          {DEMO_USERS.map(({ label, user: demoUser }) => {
            const isActive = (user?.identifier ?? '') === (demoUser?.identifier ?? '');
            return (
              <Button
                key={label}
                size="sm"
                variant={isActive ? 'primary' : 'secondary'}
                aria-pressed={isActive}
                onClick={() => setUser(demoUser)}
              >
                {label}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Extra: debug panel — native <details>, no extra state needed */}
      <details className={styles.debug}>
        <summary className={styles.debugSummary}>Debug panel</summary>
        <dl className={styles.debugGrid}>
          <dt>isReady</dt>
          <dd><code>{String(isReady)}</code></dd>
          <dt>Usuario actual</dt>
          <dd>
            <code>{user ? JSON.stringify(user) : 'sin contexto (anónimo)'}</code>
          </dd>
          <dt>getAllFlags()</dt>
          <dd>
            <pre className={styles.debugJson}>
              {JSON.stringify(allFlags, null, 2)}
            </pre>
          </dd>
        </dl>
        <Button
          size="sm"
          variant="ghost"
          loading={refreshing}
          onClick={async () => {
            setRefreshing(true);
            try {
              await refresh();
            } finally {
              setRefreshing(false);
            }
          }}
        >
          Refrescar flags ahora
        </Button>
      </details>
    </section>
  );
}
