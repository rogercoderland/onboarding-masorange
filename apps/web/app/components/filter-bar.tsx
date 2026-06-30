'use client';

import { useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button, Select } from '@onboarding-nx/ui';
import styles from './filter-bar.module.css';

export type SortOrder = 'relevance' | 'price-asc' | 'price-desc' | 'name';

export interface FilterBarProps {
  brands: string[];
  brand: string;
  order: SortOrder;
}

const ORDER_OPTIONS: { value: SortOrder; label: string }[] = [
  { value: 'relevance', label: 'Relevancia' },
  { value: 'price-asc', label: 'Precio: de menor a mayor' },
  { value: 'price-desc', label: 'Precio: de mayor a menor' },
  { value: 'name', label: 'Nombre (A-Z)' },
];

export function FilterBar({ brands, brand, order }: FilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const update = (key: 'brand' | 'order', value: string) => {
    const next = new URLSearchParams(params.toString());
    if (value === 'all' || value === 'relevance') {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    // Any filter/sort change returns to the first page.
    next.delete('page');
    const query = next.toString();
    startTransition(() => {
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    });
  };

  const hasFilters = brand !== 'all' || order !== 'relevance';

  const brandOptions = [
    { value: 'all', label: 'Todas las marcas' },
    ...brands.map((b) => ({ value: b, label: b })),
  ];

  return (
    <div className={styles.bar} data-pending={isPending || undefined}>
      <div className={styles.field}>
        <Select
          label="Marca"
          options={brandOptions}
          value={brand}
          onValueChange={(value) => update('brand', value)}
        />
      </div>

      <div className={styles.field}>
        <Select
          label="Ordenar por"
          options={ORDER_OPTIONS}
          value={order}
          onValueChange={(value) => update('order', value)}
        />
      </div>

      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          className={styles.clear}
          onClick={() => {
            startTransition(() => {
              router.replace(pathname, { scroll: false });
            });
          }}
        >
          Limpiar filtros
        </Button>
      )}
    </div>
  );
}
