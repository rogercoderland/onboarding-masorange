'use client';

import Image from 'next/image';
import { useCart } from './cart-context';
import { formatPrice } from '../lib/format';
import type { CartLine } from '../lib/models';
import styles from './cart-item.module.css';

export interface CartItemProps {
  line: CartLine;
}

/** A single cart line with quantity stepper and remove control. */
export function CartItem({ line }: CartItemProps) {
  const { setQty, removeItem } = useCart();

  return (
    <div className={styles.item}>
      <div className={styles.media}>
        <Image
          src={line.image}
          alt={line.name}
          fill
          sizes="64px"
          className={styles.image}
        />
      </div>

      <div className={styles.info}>
        <p className={styles.name}>{line.name}</p>
        <p className={styles.variant}>
          {line.color} · {line.storage}
        </p>
        <p className={styles.price}>{formatPrice(line.price)}</p>
      </div>

      <div className={styles.controls}>
        <div className={styles.qty}>
          <button
            type="button"
            aria-label="Restar unidad"
            onClick={() => setQty(line.sku, line.qty - 1)}
          >
            −
          </button>
          <span aria-live="polite">{line.qty}</span>
          <button
            type="button"
            aria-label="Sumar unidad"
            onClick={() => setQty(line.sku, line.qty + 1)}
          >
            +
          </button>
        </div>
        <button
          type="button"
          className={styles.remove}
          onClick={() => removeItem(line.sku)}
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}
