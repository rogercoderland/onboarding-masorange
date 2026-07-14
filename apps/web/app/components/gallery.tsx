'use client';

import { useState } from 'react';
import styles from './gallery.module.css';

export interface GalleryProps {
  images: string[];
  alt: string;
}

export function Gallery({ images, alt }: GalleryProps) {
  const [active, setActive] = useState(0);
  const main = images[active] ?? images[0];

  return (
    <div className={styles.gallery}>
      <div className={styles.main}>
        <img src={main} alt={alt} className={styles.image} />
      </div>

      {images.length > 1 && (
        <div className={styles.thumbs}>
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              aria-label={`Imagen ${i + 1}`}
              aria-pressed={i === active}
              className={[styles.thumb, i === active && styles.active]
                .filter(Boolean)
                .join(' ')}
              onClick={() => setActive(i)}
            >
              <img src={src} alt="" className={styles.image} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
