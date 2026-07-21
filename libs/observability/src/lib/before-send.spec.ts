import { describe, expect, it } from 'vitest';
import { TransportItemType } from '@grafana/faro-web-sdk';
import type { TransportItem } from '@grafana/faro-web-sdk';
import { createBeforeSend } from './before-send';
import { DEFAULT_IGNORE_ERRORS } from './constants';

function item(type: TransportItemType, payload: unknown): TransportItem {
  return { type, payload, meta: {} } as unknown as TransportItem;
}

describe('createBeforeSend', () => {
  const beforeSend = createBeforeSend(DEFAULT_IGNORE_ERRORS);

  it('drops telemetry about the collector endpoint itself', () => {
    const selfReport = item(TransportItemType.EVENT, {
      url: 'https://faro-collector-prod-eu-west-0.grafana.net/collect/abc',
    });

    expect(beforeSend(selfReport)).toBeNull();
  });

  it('drops telemetry whose attributes name the collector', () => {
    const selfReport = item(TransportItemType.MEASUREMENT, {
      attributes: { name: 'faro-collector fetch' },
    });

    expect(beforeSend(selfReport)).toBeNull();
  });

  it('drops exceptions matching ignoreErrors', () => {
    const ignored = item(TransportItemType.EXCEPTION, {
      value: 'ResizeObserver loop completed with undelivered notifications.',
    });

    expect(beforeSend(ignored)).toBeNull();
  });

  it('keeps a real application exception', () => {
    const real = item(TransportItemType.EXCEPTION, {
      value: 'Cannot read properties of undefined',
    });

    expect(beforeSend(real)).toBe(real);
  });

  it('does not apply ignoreErrors to non-exception items', () => {
    const event = item(TransportItemType.EVENT, {
      value: 'ResizeObserver loop',
    });

    expect(beforeSend(event)).toBe(event);
  });
});
