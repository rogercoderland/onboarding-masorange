import type { HTMLAttributes } from 'react';

export const RENDER_TYPES = ['static', 'isr', 'dynamic', 'csr'] as const;

export type RenderType = (typeof RENDER_TYPES)[number];

export interface RenderBadgeProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
  /** Rendering strategy the surrounding markup was produced with. */
  type: RenderType;
  /** ISO timestamp captured when the data/markup was generated. */
  renderedAt: string;
  /** Optional caching detail, e.g. "cacheLife('max')". */
  strategy?: string;
  /** Custom className appended to the variant classes. */
  className?: string;
}
