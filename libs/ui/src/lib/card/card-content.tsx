import { forwardRef } from 'react';
import { clsx } from 'clsx';
import { cardClasses } from './card.classes';
import type { CardDivProps } from './card.types';

/** Main content region (price, description, specs…). */
export const CardContent = forwardRef<HTMLDivElement, CardDivProps>(
  function CardContent({ className, children, ...props }, ref) {
    return (
      <div ref={ref} className={clsx(cardClasses.content, className)} {...props}>
        {children}
      </div>
    );
  },
);
CardContent.displayName = 'CardContent';
