import { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';
import { clsx } from 'clsx';
import { cardClasses } from './card.classes';

/** Card title, rendered as an `<h3>`. */
export const CardTitle = forwardRef<
  HTMLHeadingElement,
  HTMLAttributes<HTMLHeadingElement>
>(function CardTitle({ className, children, ...props }, ref) {
  return (
    <h3 ref={ref} className={clsx(cardClasses.title, className)} {...props}>
      {children}
    </h3>
  );
});
CardTitle.displayName = 'CardTitle';
