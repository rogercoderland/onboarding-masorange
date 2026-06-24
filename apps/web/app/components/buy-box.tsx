'use client';

import { useState } from 'react';
import { Button } from '@onboarding-nx/ui';
import type { Device } from '../lib/models';
import { useCart } from './cart-context';
import styles from './buy-box.module.css';

export interface BuyBoxProps {
  device: Device;
}

export function BuyBox({ device }: BuyBoxProps) {
  const [index, setIndex] = useState(0);
  const variant = device.variants[index];
  const { addItem } = useCart();

  return (
    <div className={styles.box}>
      <fieldset className={styles.variants}>
        <legend className={styles.legend}>Color</legend>
        <div className={styles.options}>
          {device.variants.map((v, i) => (
            <button
              key={v.sku}
              type="button"
              aria-pressed={i === index}
              className={[styles.option, i === index && styles.selected]
                .filter(Boolean)
                .join(' ')}
              onClick={() => setIndex(i)}
            >
              {v.color}
            </button>
          ))}
        </div>
      </fieldset>

      <p className={styles.sku}>
        {variant.storage} · SKU {variant.sku}
      </p>

      <Button
        variant="primary"
        size="lg"
        className={styles.add}
        onClick={() => addItem(device, variant)}
      >
        Añadir al carrito
      </Button>
    </div>
  );
}
