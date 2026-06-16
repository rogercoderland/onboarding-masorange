import { forwardRef } from 'react';
import { clsx } from 'clsx';
import { cardClasses } from './card.classes';
import type { CardMediaProps } from './card.types';

/** Media slot. Renders an `<img>` when `src` is set, otherwise the placeholder. */
export const CardMedia = forwardRef<HTMLDivElement, CardMediaProps>(
  function CardMedia(
    { src, alt = '', imgProps, className, children, ...props },
    ref,
  ) {
    return (
      <div ref={ref} className={clsx(cardClasses.media, className)} {...props}>
        {src && (
          <img className={cardClasses.image} src={src} alt={alt} {...imgProps} />
        )}
        {children}
      </div>
    );
  },
);
CardMedia.displayName = 'CardMedia';
