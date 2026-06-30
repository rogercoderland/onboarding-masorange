import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { RenderBadge } from './render-badge';

const AT = '2026-06-23T10:00:00.000Z';

describe('RenderBadge', () => {
  it('renders the render-type label and timestamp', () => {
    render(<RenderBadge type="static" renderedAt={AT} />);

    expect(screen.getByText('STATIC')).toBeInTheDocument();

    const time = screen.getByText(AT);
    expect(time.tagName).toBe('TIME');
    expect(time).toHaveAttribute('dateTime', AT);
  });

  it('applies the variant class and data attribute for the given type', () => {
    const { container } = render(<RenderBadge type="isr" renderedAt={AT} />);

    const badge = container.querySelector('.render-badge');

    expect(badge).toHaveClass('render-badge--isr');
    expect(badge).toHaveAttribute('data-render', 'isr');
    expect(badge).not.toHaveClass('render-badge--static');
  });

  it('supports the ssr render type', () => {
    const { container } = render(<RenderBadge type="ssr" renderedAt={AT} />);

    expect(screen.getByText('SSR')).toBeInTheDocument();
    const badge = container.querySelector('.render-badge');
    expect(badge).toHaveClass('render-badge--ssr');
    expect(badge).toHaveAttribute('data-render', 'ssr');
  });

  it('shows the strategy only when provided', () => {
    const { rerender } = render(<RenderBadge type="dynamic" renderedAt={AT} />);

    expect(
      document.querySelector('.render-badge__strategy'),
    ).not.toBeInTheDocument();

    rerender(
      <RenderBadge
        type="dynamic"
        renderedAt={AT}
        strategy="cacheLife('hours')"
      />,
    );

    expect(screen.getByText("cacheLife('hours')")).toBeInTheDocument();
  });
});
