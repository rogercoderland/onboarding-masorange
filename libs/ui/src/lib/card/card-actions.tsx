import { forwardRef } from 'react';
import { clsx } from 'clsx';
import { cardClasses } from './card.classes';
import type { CardDivProps } from './card.types';

/** Footer actions region, pinned to the bottom of the card. */
export const CardActions = forwardRef<HTMLDivElement, CardDivProps>(
  function CardActions({ className, children, ...props }, ref) {
    return (
      <div ref={ref} className={clsx(cardClasses.actions, className)} {...props}>
        {children}
      </div>
    );
  },
);
CardActions.displayName = 'CardActions';
