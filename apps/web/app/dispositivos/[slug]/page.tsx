import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cacheLife, cacheTag } from 'next/cache';
import { RenderBadge } from '@onboarding-nx/ui';
import { getDevice, getDevices } from '../../lib/cms';
import { CacheTags } from '../../lib/cache-tags';
import { formatPrice } from '../../lib/format';
import { Gallery } from '../../components/gallery';
import { BuyBox } from '../../components/buy-box';
import { RefreshDeviceForm } from '../../components/refresh-device-form';
import { refreshDevice } from './actions';
import styles from './pdp.module.css';

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getCachedDevice(slug: string) {
  'use cache';
  cacheLife('hours');
  cacheTag(CacheTags.device(slug));
  return { device: await getDevice(slug), generatedAt: new Date().toISOString() };
}

export async function generateStaticParams() {
  const devices = await getDevices();
  return devices.map((device) => ({ slug: device.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { device } = await getCachedDevice(slug);
  if (!device) return { title: 'Dispositivo no encontrado' };
  return {
    title: `${device.name} — Tienda de dispositivos`,
    description: device.description,
  };
}

export default async function DevicePage({ params }: PageProps) {
  const { slug } = await params;
  const { device, generatedAt } = await getCachedDevice(slug);

  if (!device) notFound();

  return (
    <article className={styles.pdp}>
      <RenderBadge
        type="dynamic"
        renderedAt={generatedAt}
        strategy="use cache · cacheTag('device:slug') · cacheLife('hours')"
      />

      <div className={styles.layout}>
        <Gallery images={device.images} alt={device.name} />

        <div className={styles.info}>
          <p className={styles.brand}>{device.brand}</p>
          <h1 className={styles.name}>{device.name}</h1>
          <p className={styles.price}>{formatPrice(device.price)}</p>

          <ul className={styles.keySpecs}>
            {device.specs.map((spec) => (
              <li key={spec.label}>
                <span className={styles.specLabel}>{spec.label}</span>
                <span className={styles.specValue}>{spec.value}</span>
              </li>
            ))}
          </ul>

          <BuyBox device={device} />
        </div>
      </div>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Descripción</h2>
        <p className={styles.description}>{device.description}</p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Especificaciones</h2>
        <table className={styles.specsTable}>
          <tbody>
            {device.specs.map((spec) => (
              <tr key={spec.label}>
                <th scope="row">{spec.label}</th>
                <td>{spec.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Administración</h2>
        <p className={styles.adminHint}>
          Fuerza una revalidación on-demand de esta ficha. Tras enviarla, el
          timestamp de arriba salta — y solo el de este dispositivo.
        </p>
        <RefreshDeviceForm action={refreshDevice} slug={device.slug} />
      </section>
    </article>
  );
}
