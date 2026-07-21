'use client';

import Link from 'next/link';
import { useCart } from './cart-context';
import { FeatureBanner } from './feature-banner';
import styles from './header.module.css';

export function Header() {
  const { count } = useCart();

  return (
    <header className={styles.header}>
      <FeatureBanner />
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          Tienda<span className={styles.logoAccent}>·móviles</span>
        </Link>

        <nav className={styles.nav} aria-label="Principal">
          <Link href="/">Inicio</Link>
          <Link href="/dispositivos">Dispositivos</Link>
          <Link href="/buscar">Buscar</Link>
          <Link href="/flags">Flags</Link>
          <Link href="/error-test">Error test</Link>
        </nav>

        <Link
          href="/carrito"
          className={styles.cart}
          aria-label={`Ver carrito (${count} artículos)`}
        >
          <span aria-hidden="true">🛒</span>
          {count > 0 && <span className={styles.count}>{count}</span>}
        </Link>
      </div>
    </header>
  );
}
