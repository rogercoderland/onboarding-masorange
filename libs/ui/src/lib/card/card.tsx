import { forwardRef } from 'react';
import { clsx } from 'clsx';
import { cardClasses } from './card.classes';
import type { CardDivProps } from './card.types';
import { CardMedia } from './card-media';
import { CardBadge } from './card-badge';
import { CardHeader } from './card-header';
import { CardBrand } from './card-brand';
import { CardTitle } from './card-title';
import { CardContent } from './card-content';
import { CardActions } from './card-actions';
import './card.css';

const CardRoot = forwardRef<HTMLDivElement, CardDivProps>(function Card(
  { className, children, ...props },
  ref,
) {
  return (
    <div ref={ref} className={clsx(cardClasses.root, className)} {...props}>
      {children}
    </div>
  );
});
CardRoot.displayName = 'Card';

export const Card = Object.assign(CardRoot, {
  Media: CardMedia,
  Badge: CardBadge,
  Header: CardHeader,
  Brand: CardBrand,
  Title: CardTitle,
  Content: CardContent,
  Actions: CardActions,
});
