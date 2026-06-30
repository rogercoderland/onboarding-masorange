'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { RenderBadge } from '@onboarding-nx/ui';
import { useCart } from '../components/cart-context';
import { CartItem } from '../components/cart-item';
import { CheckoutPanel } from '../components/checkout-panel';
import styles from './carrito.module.css';

export default function CarritoPage() {
  const { items, closeCart } = useCart();
  const [renderedAt, setRenderedAt] = useState<string | null>(null);

  // If the mini-cart drawer was left open, close it — this page IS the cart.
  useEffect(() => {
    closeCart();
  }, [closeCart]);

  useEffect(() => {
    setRenderedAt(new Date().toISOString());
  }, [items]);

  return (
    <div className={styles.page}>
      <header className={styles.head}>
        <h1 className={styles.title}>Tu carrito</h1>
        {renderedAt && (
          <RenderBadge
            type="csr"
            renderedAt={renderedAt}
            strategy="100% cliente · sin caché · localStorage"
          />
        )}
      </header>

      {items.length === 0 ? (
        <p className={styles.empty}>
          Tu carrito está vacío.{' '}
          <Link href="/dispositivos" className={styles.link}>
            Ver dispositivos
          </Link>
        </p>
      ) : (
        <div className={styles.layout}>
          <ul className={styles.list}>
            {items.map((line) => (
              <li key={line.sku}>
                <CartItem line={line} />
              </li>
            ))}
          </ul>
          <aside className={styles.aside}>
            <CheckoutPanel />
          </aside>
        </div>
      )}
    </div>
  );
}
