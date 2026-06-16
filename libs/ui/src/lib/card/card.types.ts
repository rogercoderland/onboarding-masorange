import type { HTMLAttributes, ImgHTMLAttributes } from 'react';

export const CARD_BADGE_VARIANTS = ['solid', 'outline'] as const;
export type CardBadgeVariant = (typeof CARD_BADGE_VARIANTS)[number];

export type CardDivProps = HTMLAttributes<HTMLDivElement>;

export interface CardMediaProps extends CardDivProps {
  /** When provided, renders an `<img>` as the media. */
  src?: string;
  alt?: string;
  /** Props forwarded to the rendered `<img>` (e.g. loading, sizes). */
  imgProps?: ImgHTMLAttributes<HTMLImageElement>;
}

export interface CardBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Visual emphasis. `solid` = filled, `outline` = bordered pill. @default 'solid' */
  variant?: CardBadgeVariant;
}
