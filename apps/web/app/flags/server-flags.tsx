import { connection } from 'next/server';
import { RenderBadge } from '@onboarding-nx/ui';
import { resolveServerFeatureFlags } from '@onboarding-nx/configcat/server';
import styles from './flags.module.css';

export const SERVER_FLAG_DEFINITIONS = {
  showNewFeature: { key: 'show_new_feature', defaultValue: false },
  buttonColor: { key: 'button_color', defaultValue: 'blue' },
  maxItems: { key: 'max_items', defaultValue: 10 },
} as const;

export async function ServerFlags() {
  await connection();

  const flags = await resolveServerFeatureFlags({
    sdkKey: process.env.CONFIGCAT_SDK_KEY ?? '',
    flags: SERVER_FLAG_DEFINITIONS,
  });
  const renderedAt = new Date().toISOString();

  return (
    <section className={styles.section} aria-labelledby="ssr-flags">
      <div className={styles.sectionHead}>
        <h2 id="ssr-flags" className={styles.sectionTitle}>
          Servidor (SSR)
        </h2>
        <RenderBadge
          type="ssr"
          renderedAt={renderedAt}
          strategy="connection() · por petición · configcat-js-ssr"
        />
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Flag</th>
            <th>Tipo</th>
            <th>Valor</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>show_new_feature</code>
            </td>
            <td>boolean</td>
            <td>
              <code>{String(flags.showNewFeature)}</code>
            </td>
            <td>
              <span className={flags.showNewFeature ? styles.on : styles.off}>
                {flags.showNewFeature ? 'ON' : 'OFF'}
              </span>
            </td>
          </tr>
          <tr>
            <td>
              <code>button_color</code>
            </td>
            <td>string</td>
            <td>
              <code>{flags.buttonColor}</code>
            </td>
            <td>
              <span
                className={styles.swatch}
                style={{ backgroundColor: flags.buttonColor }}
                aria-label={`Color ${flags.buttonColor}`}
              />
            </td>
          </tr>
          <tr>
            <td>
              <code>max_items</code>
            </td>
            <td>number</td>
            <td>
              <code>{flags.maxItems}</code>
            </td>
            <td>—</td>
          </tr>
        </tbody>
      </table>
    </section>
  );
}
