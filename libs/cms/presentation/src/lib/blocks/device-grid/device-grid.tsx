import type { DeviceGridBlock } from '@onboarding-nx/cms-domain';
import { DeviceCard } from './device-card';
import styles from './device-grid.module.css';

export function DeviceGrid({ block }: { block: DeviceGridBlock }) {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>{block.title}</h2>
      <div className={styles.grid}>
        {block.devices.map((device) => (
          <DeviceCard key={device.slug} device={device} />
        ))}
      </div>
    </section>
  );
}
