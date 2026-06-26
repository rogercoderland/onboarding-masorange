/**
 * Class contract for the `RenderBadge` component (BEM, prefix-free for portability).
 */
export const renderBadgeClasses = {
  root: 'render-badge',
  dot: 'render-badge__dot',
  type: 'render-badge__type',
  meta: 'render-badge__meta',
  strategy: 'render-badge__strategy',
  time: 'render-badge__time',
  static: 'render-badge--static',
  isr: 'render-badge--isr',
  ssr: 'render-badge--ssr',
  dynamic: 'render-badge--dynamic',
  csr: 'render-badge--csr',
} as const;

export type RenderBadgeClassName =
  (typeof renderBadgeClasses)[keyof typeof renderBadgeClasses];
