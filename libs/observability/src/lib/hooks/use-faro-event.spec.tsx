import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { LogLevel } from '@grafana/faro-web-sdk';
import { clearMockFaro, mockFaroApi } from '../../testing';
import { useFaroEvent } from './use-faro-event';

afterEach(() => {
  clearMockFaro();
  vi.restoreAllMocks();
});

describe('useFaroEvent', () => {
  it('does not throw and warns when Faro is not initialized', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const { result } = renderHook(() => useFaroEvent());

    expect(result.current.isFaroReady()).toBe(false);
    expect(() => result.current.pushError(new Error('boom'))).not.toThrow();
    expect(warn).toHaveBeenCalledTimes(1);
  });

  it('pushes errors with skipDedupe so explicit calls are never deduped', () => {
    const api = mockFaroApi();
    const { result } = renderHook(() => useFaroEvent());
    const error = new Error('boom');

    result.current.pushError(error, { type: 'manual' });

    expect(api.pushError.calls).toHaveLength(1);
    expect(api.pushError.calls[0][0]).toBe(error);
    expect(api.pushError.calls[0][1]).toMatchObject({
      type: 'manual',
      skipDedupe: true,
    });
  });

  it('stringifies event attributes and puts skipDedupe in the 4th argument', () => {
    const api = mockFaroApi();
    const { result } = renderHook(() => useFaroEvent());

    result.current.pushEvent('demo', { count: 3, ok: true }, 'click');

    const [name, attributes, domain, options] = api.pushEvent.calls[0];
    expect(name).toBe('demo');
    expect(attributes).toEqual({
      count: '3',
      ok: 'true',
      event_type: 'click',
    });
    expect(domain).toBeUndefined();
    expect(options).toEqual({ skipDedupe: true });
  });

  it('pushes logs at the requested level', () => {
    const api = mockFaroApi();
    const { result } = renderHook(() => useFaroEvent());

    result.current.pushLog(['algo raro'], LogLevel.WARN);

    expect(api.pushLog.calls[0][0]).toEqual(['algo raro']);
    expect(api.pushLog.calls[0][1]).toMatchObject({
      level: LogLevel.WARN,
      skipDedupe: true,
    });
  });

  it('maps setUser(undefined) to resetUser', () => {
    const api = mockFaroApi();
    const { result } = renderHook(() => useFaroEvent());

    result.current.setUser({ id: '42' });
    result.current.setUser(undefined);

    expect(api.setUser.calls[0][0]).toEqual({ id: '42' });
    expect(api.resetUser.calls).toHaveLength(1);
  });
});
