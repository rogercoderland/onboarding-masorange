'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@onboarding-nx/ui';
import { useStringFlag } from '@onboarding-nx/configcat';
import { useCart } from './cart-context';
import { CartSummary } from './cart-summary';
import styles from './checkout-panel.module.css';

export interface CheckoutPanelProps {
  /** When provided, renders a "keep shopping" button (used inside the drawer). */
  onClose?: () => void;
}

/**
 * Summary + checkout. There is no real backend, so "Tramitar pedido" empties the
 * cart and shows a confirmation (demo). Shared by the drawer and the /carrito page.
 */
export function CheckoutPanel({ onClose }: CheckoutPanelProps) {
  const { items, clear } = useCart();
  const [done, setDone] = useState(false);
  const buttonColor = useStringFlag('button_color', '');

  if (done && items.length === 0) {
    return (
      <p className={styles.success}>✓ ¡Gracias por tu compra! (demo)</p>
    );
  }

  return (
    <div className={styles.panel}>
      <CartSummary />
      <Button
        variant="primary"
        size="lg"
        disabled={items.length === 0}
        style={buttonColor ? { background: buttonColor } : undefined}
        onClick={() => {
          clear();
          setDone(true);
        }}
      >
        Tramitar pedido
      </Button>
      {/* Only rendered inside the drawer (mini-cart) — links to the full page. */}
      {onClose && (
        <>
          <Link href="/carrito" className={styles.viewCart} onClick={onClose}>
            Ver carrito completo →
          </Link>
          <Button variant="ghost" onClick={onClose}>
            Seguir comprando
          </Button>
        </>
      )}
    </div>
  );
}
