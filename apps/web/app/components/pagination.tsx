'use client';

import { useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@onboarding-nx/ui';
import styles from './pagination.module.css';

export interface PaginationProps {
  page: number;
  totalPages: number;
}

export function Pagination({ page, totalPages }: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [isPending, startTransition] = useTransition();

  if (totalPages <= 1) return null;

  const goTo = (target: number) => {
    const next = new URLSearchParams(params.toString());
    if (target <= 1) {
      next.delete('page');
    } else {
      next.set('page', String(target));
    }
    const query = next.toString();
    startTransition(() => {
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    });
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav
      className={styles.pagination}
      aria-label="Paginación"
      data-pending={isPending || undefined}
    >
      <Button
        variant="ghost"
        size="sm"
        disabled={page <= 1}
        onClick={() => goTo(page - 1)}
      >
        ← Anterior
      </Button>

      <ul className={styles.pages}>
        {pages.map((p) => (
          <li key={p}>
            <Button
              variant={p === page ? 'primary' : 'ghost'}
              size="sm"
              aria-current={p === page ? 'page' : undefined}
              onClick={() => goTo(p)}
            >
              {p}
            </Button>
          </li>
        ))}
      </ul>

      <Button
        variant="ghost"
        size="sm"
        disabled={page >= totalPages}
        onClick={() => goTo(page + 1)}
      >
        Siguiente →
      </Button>
    </nav>
  );
}
