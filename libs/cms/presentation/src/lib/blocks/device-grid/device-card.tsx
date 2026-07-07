import { Card } from '@onboarding-nx/ui';
import type { CmsDevice } from '@onboarding-nx/cms-domain';
import styles from './device-card.module.css';

const priceFormatter = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
});

export function DeviceCard({ device }: { device: CmsDevice }) {
  const href = `/dispositivos/${device.slug}`;

  return (
    <Card className={styles.card}>
      <Card.Media className={styles.media}>
        {device.badge && <Card.Badge>{device.badge}</Card.Badge>}
        <a href={href} className={styles.mediaLink} aria-label={device.name}>
          <img
            src={device.images[0] ?? ''}
            alt={device.name}
            className={styles.image}
          />
        </a>
      </Card.Media>

      <Card.Header>
        <Card.Brand>{device.brand}</Card.Brand>
        <Card.Title>
          <a href={href} className={styles.titleLink}>
            {device.name}
          </a>
        </Card.Title>
      </Card.Header>

      <Card.Content>
        <p className={styles.price}>{priceFormatter.format(device.price)}</p>
      </Card.Content>

      <Card.Actions>
        <a href={href} className={styles.cta}>
          Ver detalles →
        </a>
      </Card.Actions>
    </Card>
  );
}
