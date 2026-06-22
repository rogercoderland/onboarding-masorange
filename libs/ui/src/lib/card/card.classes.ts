/**
 * Class contract for the generic `Card` compound component
 * (BEM, prefix-free for portability).
 */
export const cardClasses = {
  root: 'card',
  media: 'card__media',
  image: 'card__image',
  badge: 'card__badge',
  badgeSolid: 'card__badge--solid',
  badgeOutline: 'card__badge--outline',
  header: 'card__header',
  brand: 'card__brand',
  title: 'card__title',
  content: 'card__content',
  actions: 'card__actions',
} as const;

export type CardClassName = (typeof cardClasses)[keyof typeof cardClasses];
