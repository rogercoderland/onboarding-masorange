import { forwardRef } from 'react';
import { clsx } from 'clsx';
import { cardClasses } from './card.classes';
import type { CardDivProps } from './card.types';

/** Header region, usually holding `CardBrand` + `CardTitle`. */
export const CardHeader = forwardRef<HTMLDivElement, CardDivProps>(
  function CardHeader({ className, children, ...props }, ref) {
    return (
      <div ref={ref} className={clsx(cardClasses.header, className)} {...props}>
        {children}
      </div>
    );
  },
);
CardHeader.displayName = 'CardHeader';
