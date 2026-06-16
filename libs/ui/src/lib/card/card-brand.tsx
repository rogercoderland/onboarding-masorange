import { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';
import { clsx } from 'clsx';
import { cardClasses } from './card.classes';

/** Eyebrow / brand label rendered above the title. */
export const CardBrand = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(function CardBrand({ className, children, ...props }, ref) {
  return (
    <p ref={ref} className={clsx(cardClasses.brand, className)} {...props}>
      {children}
    </p>
  );
});
CardBrand.displayName = 'CardBrand';
