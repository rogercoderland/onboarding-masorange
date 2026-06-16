import { forwardRef } from 'react';
import { cva } from 'class-variance-authority';
import { clsx } from 'clsx';
import { cardClasses } from './card.classes';
import type { CardBadgeProps } from './card.types';

const badgeVariants = cva(cardClasses.badge, {
  variants: {
    variant: {
      solid: cardClasses.badgeSolid,
      outline: cardClasses.badgeOutline,
    },
  },
  defaultVariants: {
    variant: 'solid',
  },
});

/** Floating badge, typically positioned over `CardMedia`. */
export const CardBadge = forwardRef<HTMLSpanElement, CardBadgeProps>(
  function CardBadge({ variant, className, children, ...props }, ref) {
    return (
      <span
        ref={ref}
        className={clsx(badgeVariants({ variant }), className)}
        {...props}
      >
        {children}
      </span>
    );
  },
);
CardBadge.displayName = 'CardBadge';
