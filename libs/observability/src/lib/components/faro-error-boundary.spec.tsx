import { afterEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { clearMockFaro, mockFaroApi } from '../../testing';
import { FaroErrorBoundary } from './faro-error-boundary';

function Boom(): never {
  throw new Error('render explosion');
}

afterEach(() => {
  clearMockFaro();
  vi.restoreAllMocks();
});

describe('FaroErrorBoundary', () => {
  it('renders children when nothing throws', () => {
    render(
      <FaroErrorBoundary>
        <p>contenido</p>
      </FaroErrorBoundary>,
    );

    expect(screen.getByText('contenido')).toBeInTheDocument();
  });

  it('shows the fallback and reports the error to Faro once', () => {
    const api = mockFaroApi();
    vi.spyOn(console, 'error').mockImplementation(() => undefined);

    render(
      <FaroErrorBoundary>
        <Boom />
      </FaroErrorBoundary>,
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(api.pushError.calls).toHaveLength(1);
    expect(api.pushError.calls[0][1]).toMatchObject({
      type: 'react_error_boundary',
      skipDedupe: true,
    });
  });

  it('recovers when the fallback reset button is pressed', () => {
    mockFaroApi();
    vi.spyOn(console, 'error').mockImplementation(() => undefined);

    function Flaky({ crash }: { crash: boolean }) {
      if (crash) throw new Error('render explosion');
      return <p>recuperado</p>;
    }

    const { rerender } = render(
      <FaroErrorBoundary>
        <Flaky crash />
      </FaroErrorBoundary>,
    );

    rerender(
      <FaroErrorBoundary>
        <Flaky crash={false} />
      </FaroErrorBoundary>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Reintentar' }));

    expect(screen.getByText('recuperado')).toBeInTheDocument();
  });

  it('survives a throwing onError callback', () => {
    mockFaroApi();
    vi.spyOn(console, 'error').mockImplementation(() => undefined);

    expect(() =>
      render(
        <FaroErrorBoundary
          onError={() => {
            throw new Error('bad callback');
          }}
        >
          <Boom />
        </FaroErrorBoundary>,
      ),
    ).not.toThrow();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
});
