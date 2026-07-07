import type { FooterBlock } from '@onboarding-nx/cms-domain';
import styles from './footer.module.css';

export function Footer({ block }: { block: FooterBlock }) {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.columns}>
          {block.columns.map((column) => (
            <nav
              key={column.heading}
              className={styles.column}
              aria-label={column.heading}
            >
              <h3 className={styles.heading}>{column.heading}</h3>
              <ul className={styles.links}>
                {column.links.map((link) => (
                  <li key={`${column.heading}-${link.label}`}>
                    <a href={link.href}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <p className={styles.legal}>{block.legal}</p>
      </div>
    </footer>
  );
}
