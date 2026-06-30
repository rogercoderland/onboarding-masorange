'use client';

import { Modal } from '@onboarding-nx/ui';
import { useCart } from './cart-context';
import { CartItem } from './cart-item';
import { CheckoutPanel } from './checkout-panel';
import styles from './cart-drawer.module.css';

/**
 * Right-side cart drawer (CSR). Rendered once, globally, from the root layout;
 * its open state lives in the cart context so any "add to cart" opens it.
 */
export function CartDrawer() {
  const { items, isOpen, closeCart } = useCart();

  return (
    <Modal
      open={isOpen}
      onClose={closeCart}
      side="right"
      title="Tu carrito"
      footer={
        items.length > 0 ? <CheckoutPanel onClose={closeCart} /> : undefined
      }
    >
      {items.length === 0 ? (
        <p className={styles.empty}>Tu carrito está vacío.</p>
      ) : (
        <ul className={styles.list}>
          {items.map((line) => (
            <li key={line.sku}>
              <CartItem line={line} />
            </li>
          ))}
        </ul>
      )}
    </Modal>
  );
}
