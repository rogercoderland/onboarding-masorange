import { forwardRef } from 'react';
import { cva } from 'class-variance-authority';
import { clsx } from 'clsx';
import { renderBadgeClasses } from './render-badge.classes';
import type { RenderBadgeProps, RenderType } from './render-badge.types';
import './render-badge.css';

const RENDER_LABELS: Record<RenderType, string> = {
  static: 'STATIC',
  isr: 'ISR',
  dynamic: 'DYNAMIC',
  csr: 'CSR',
};

const badgeVariants = cva(renderBadgeClasses.root, {
  variants: {
    type: {
      static: renderBadgeClasses.static,
      isr: renderBadgeClasses.isr,
      dynamic: renderBadgeClasses.dynamic,
      csr: renderBadgeClasses.csr,
    },
  },
  defaultVariants: {
    type: 'static',
  },
});

export const RenderBadge = forwardRef<HTMLDivElement, RenderBadgeProps>(
  function RenderBadge(
    { type, renderedAt, strategy, className, ...props },
    ref,
  ) {
    return (
      <div
        ref={ref}
        className={clsx(badgeVariants({ type }), className)}
        data-render={type}
        {...props}
      >
        <span className={renderBadgeClasses.dot} aria-hidden="true" />
        <span className={renderBadgeClasses.type}>{RENDER_LABELS[type]}</span>
        <span className={renderBadgeClasses.meta}>
          {strategy && (
            <span className={renderBadgeClasses.strategy}>{strategy}</span>
          )}
          <time className={renderBadgeClasses.time} dateTime={renderedAt}>
            {renderedAt}
          </time>
        </span>
      </div>
    );
  },
);
RenderBadge.displayName = 'RenderBadge';
