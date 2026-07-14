'use client';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { DeviceCard } from '@onboarding-nx/cms-presentation';
import type { Device } from '../lib/models';
import { FilterBar, type SortOrder } from './filter-bar';
import { Pagination } from './pagination';
import styles from './catalog.module.css';

export interface CatalogProps {
  devices: Device[];
}

const PAGE_SIZE = 8;

const sorters: Record<SortOrder, (a: Device, b: Device) => number> = {
  relevance: () => 0,
  'price-asc': (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
  name: (a, b) => a.name.localeCompare(b.name, 'es'),
};

/**
 * Client island for the Catálogo screen
 */
export function Catalog({ devices }: CatalogProps) {
  const params = useSearchParams();
  const brand = params.get('brand') ?? 'all';
  const order = (params.get('order') as SortOrder) ?? 'relevance';
  const page = Math.max(1, Number(params.get('page')) || 1);

  const brands = useMemo(
    () => Array.from(new Set(devices.map((d) => d.brand))).sort(),
    [devices],
  );

  const filtered = useMemo(() => {
    const list = devices.filter((d) => brand === 'all' || d.brand === brand);
    const sort = sorters[order] ?? sorters.relevance;
    return [...list].sort(sort);
  }, [devices, brand, order]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const visible = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  return (
    <div className={styles.catalog}>
      <FilterBar brands={brands} brand={brand} order={order} />

      {visible.length === 0 ? (
        <p className={styles.empty}>
          No hay dispositivos que coincidan con el filtro.
        </p>
      ) : (
        <div className={styles.grid}>
          {visible.map((device) => (
            <DeviceCard key={device.slug} device={device} />
          ))}
        </div>
      )}

      <Pagination page={safePage} totalPages={totalPages} />
    </div>
  );
}
