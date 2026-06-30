'use client';

import { useCart } from './cart-context';
import { formatPrice } from '../lib/format';
import styles from './cart-summary.module.css';

/** Derived totals. Shipping is free in this demo, so total === subtotal. */
export function CartSummary() {
  const { subtotal } = useCart();

  return (
    <dl className={styles.summary}>
      <div className={styles.row}>
        <dt>Subtotal</dt>
        <dd>{formatPrice(subtotal)}</dd>
      </div>
      <div className={styles.row}>
        <dt>Envío</dt>
        <dd>Gratis</dd>
      </div>
      <div className={`${styles.row} ${styles.total}`}>
        <dt>Total</dt>
        <dd>{formatPrice(subtotal)}</dd>
      </div>
    </dl>
  );
}
