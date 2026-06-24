import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@onboarding-nx/ui';
import type { Device } from '../lib/models';
import { formatPrice } from '../lib/format';
import styles from './device-card.module.css';

export interface DeviceCardProps {
  device: Device;
  priority?: boolean;
}

export function DeviceCard({ device, priority = false }: DeviceCardProps) {
  const href = `/dispositivos/${device.slug}`;

  return (
    <Card className={styles.card}>
      <Card.Media className={styles.media}>
        {device.badge && <Card.Badge>{device.badge}</Card.Badge>}
        <Link href={href} className={styles.mediaLink} aria-label={device.name}>
          <Image
            src={device.images[0]}
            alt={device.name}
            fill
            sizes="(max-width: 640px) 50vw, 280px"
            className={styles.image}
            priority={priority}
          />
        </Link>
      </Card.Media>

      <Card.Header>
        <Card.Brand>{device.brand}</Card.Brand>
        <Card.Title>
          <Link href={href} className={styles.titleLink}>
            {device.name}
          </Link>
        </Card.Title>
      </Card.Header>

      <Card.Content>
        <p className={styles.price}>{formatPrice(device.price)}</p>
      </Card.Content>

      <Card.Actions>
        <Link href={href} className={styles.cta}>
          Ver detalles →
        </Link>
      </Card.Actions>
    </Card>
  );
}
