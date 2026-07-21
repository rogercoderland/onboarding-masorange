import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ObservabilityProvider } from './provider';

const initializeFaro = vi.hoisted(() => vi.fn());

vi.mock('@grafana/faro-web-sdk', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@grafana/faro-web-sdk')>()),
  initializeFaro,
}));

afterEach(() => {
  vi.clearAllMocks();
  vi.restoreAllMocks();
});

describe('ObservabilityProvider', () => {
  it('warns and skips initialization when no collector URL is configured', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    render(
      <ObservabilityProvider config={{ collectorUrl: '', appName: 'demo' }}>
        <p>app</p>
      </ObservabilityProvider>,
    );

    expect(initializeFaro).not.toHaveBeenCalled();
    expect(warn).toHaveBeenCalledTimes(1);
    expect(screen.getByText('app')).toBeInTheDocument();
  });

  it('initializes Faro once with the app metadata', () => {
    const { rerender } = render(
      <ObservabilityProvider
        config={{
          collectorUrl: 'https://collector.test/collect/key',
          appName: 'demo',
          environment: 'test',
          version: '1.2.3',
        }}
      >
        <p>app</p>
      </ObservabilityProvider>,
    );

    rerender(
      <ObservabilityProvider
        config={{
          collectorUrl: 'https://collector.test/collect/key',
          appName: 'demo',
          environment: 'test',
          version: '1.2.3',
        }}
      >
        <p>app</p>
      </ObservabilityProvider>,
    );

    expect(initializeFaro).toHaveBeenCalledTimes(1);
    expect(initializeFaro.mock.calls[0][0]).toMatchObject({
      url: 'https://collector.test/collect/key',
      paused: false,
      app: { name: 'demo', environment: 'test', version: '1.2.3' },
    });
  });

  it('starts paused when observability is explicitly disabled', () => {
    render(
      <ObservabilityProvider
        config={{
          collectorUrl: 'https://collector.test/collect/key',
          appName: 'demo',
          enabled: false,
        }}
      >
        <p>app</p>
      </ObservabilityProvider>,
    );

    expect(initializeFaro.mock.calls[0][0]).toMatchObject({ paused: true });
  });

  it('does not crash the app if the SDK throws on init', () => {
    initializeFaro.mockImplementationOnce(() => {
      throw new Error('sdk exploded');
    });
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    render(
      <ObservabilityProvider
        config={{
          collectorUrl: 'https://collector.test/collect/key',
          appName: 'demo',
        }}
      >
        <p>app</p>
      </ObservabilityProvider>,
    );

    expect(screen.getByText('app')).toBeInTheDocument();
    expect(error).toHaveBeenCalled();
  });
});
