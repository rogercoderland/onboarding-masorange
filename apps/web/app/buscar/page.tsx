import { Suspense } from 'react';
import Link from 'next/link';
import { RenderBadge } from '@onboarding-nx/ui';
import { DeviceCard } from '@onboarding-nx/cms-presentation';
import { getDevices } from '../lib/cms';
import styles from './buscar.module.css';

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

const MAX_QUERY = 64;

async function SearchResults({ searchParams }: PageProps) {
  const { q = '' } = await searchParams;
  // Server-side validation/sanitization of user input.
  const query = q.trim().slice(0, MAX_QUERY);

  const devices = await getDevices();
  const lower = query.toLowerCase();
  const results = lower
    ? devices.filter(
        (d) =>
          d.name.toLowerCase().includes(lower) ||
          d.brand.toLowerCase().includes(lower),
      )
    : devices;
  const generatedAt = new Date().toISOString();

  return (
    <>
      <div className={styles.badgeRow}>
        <RenderBadge
          type="ssr"
          renderedAt={generatedAt}
          strategy="searchParams · sin caché (por petición)"
        />
      </div>

      <form action="/buscar" method="get" className={styles.form} role="search">
        <input
          key={query}
          type="search"
          name="q"
          defaultValue={query}
          placeholder="Busca por modelo o marca (p. ej. iPhone, Xiaomi)…"
          aria-label="Buscar dispositivos"
          maxLength={MAX_QUERY}
          className={styles.input}
        />
        <button type="submit" className={styles.submit}>
          Buscar
        </button>
        {query !== '' && (
          <Link href="/buscar" className={styles.clear}>
            Limpiar
          </Link>
        )}
      </form>

      {results.length === 0 ? (
        <p className={styles.hint}>
          Sin resultados para <strong>«{query}»</strong>.{' '}
          <Link href="/buscar" className={styles.link}>
            Ver todos los dispositivos
          </Link>
        </p>
      ) : (
        <>
          <p className={styles.count}>
            {query === '' ? (
              <>{results.length} dispositivos</>
            ) : (
              <>
                {results.length} resultado{results.length === 1 ? '' : 's'} para{' '}
                <strong>«{query}»</strong>
              </>
            )}
          </p>
          <div className={styles.grid}>
            {results.map((device) => (
              <DeviceCard key={device.slug} device={device} />
            ))}
          </div>
        </>
      )}
    </>
  );
}

export default function BuscarPage({ searchParams }: PageProps) {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Buscar dispositivos</h1>
      <Suspense fallback={<p className={styles.hint}>Buscando…</p>}>
        <SearchResults searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
