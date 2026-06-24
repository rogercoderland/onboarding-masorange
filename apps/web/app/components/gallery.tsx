'use client';

import { useState } from 'react';
import Image from 'next/image';
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
        <Image
          src={main}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 480px"
          priority
          className={styles.image}
        />
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
              <Image
                src={src}
                alt=""
                fill
                sizes="64px"
                className={styles.image}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
