import Link from 'next/link';
import type { Footer as FooterModel } from '../lib/models';
import styles from './footer.module.css';

export function Footer({ data }: { data: FooterModel }) {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.columns}>
          {data.columns.map((column) => (
            <nav
              key={column.heading}
              className={styles.column}
              aria-label={column.heading}
            >
              <h3 className={styles.heading}>{column.heading}</h3>
              <ul className={styles.links}>
                {column.links.map((link) => (
                  <li key={`${column.heading}-${link.label}`}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <p className={styles.legal}>{data.legal}</p>
      </div>
    </footer>
  );
}
