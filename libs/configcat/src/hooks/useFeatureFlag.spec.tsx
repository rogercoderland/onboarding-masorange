import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import type { ReactNode } from 'react';

import { useFeatureFlag, useBooleanFlag, useStringFlag, useNumberFlag } from './useFeatureFlag';
import { useConfigCat } from './useConfigCat';
import { TestConfigCatProvider } from '../testing/TestConfigCatProvider';
import { MockConfigCatClient } from '../testing/MockConfigCatClient';

const FLAGS = {
  show_new_feature: true,
  button_color: 'red',
  max_items: 5,
};

function wrapper({ children }: { children: ReactNode }) {
  return <TestConfigCatProvider flags={FLAGS}>{children}</TestConfigCatProvider>;
}

describe('useFeatureFlag hooks', () => {
  it('useBooleanFlag returns the flag value', () => {
    const { result } = renderHook(() => useBooleanFlag('show_new_feature'), { wrapper });
    expect(result.current).toBe(true);
  });

  it('useStringFlag returns the flag value', () => {
    const { result } = renderHook(() => useStringFlag('button_color', 'blue'), { wrapper });
    expect(result.current).toBe('red');
  });

  it('useNumberFlag returns the flag value', () => {
    const { result } = renderHook(() => useNumberFlag('max_items', 10), { wrapper });
    expect(result.current).toBe(5);
  });

  it('returns the default value when the flag does not exist', () => {
    const { result } = renderHook(() => useFeatureFlag('missing_flag', 'fallback'), { wrapper });
    expect(result.current).toBe('fallback');
  });

  it('returns the default value while the client is not ready', () => {
    const notReadyWrapper = ({ children }: { children: ReactNode }) => (
      <TestConfigCatProvider flags={FLAGS} isReady={false}>
        {children}
      </TestConfigCatProvider>
    );

    const { result } = renderHook(() => useBooleanFlag('show_new_feature'), {
      wrapper: notReadyWrapper,
    });
    expect(result.current).toBe(false);
  });

  it('throws when used outside a ConfigCatProvider', () => {
    expect(() => renderHook(() => useBooleanFlag('show_new_feature'))).toThrow(
      /within a ConfigCatProvider/
    );
  });
});

describe('useConfigCat', () => {
  it('exposes the full context (getAllFlags, setUser, isReady)', () => {
    const client = new MockConfigCatClient(FLAGS);
    const clientWrapper = ({ children }: { children: ReactNode }) => (
      <TestConfigCatProvider client={client}>{children}</TestConfigCatProvider>
    );

    const { result } = renderHook(() => useConfigCat(), { wrapper: clientWrapper });

    expect(result.current.isReady).toBe(true);
    expect(result.current.getAllFlags()).toEqual(FLAGS);
    expect(result.current.user).toBeUndefined();

    act(() => {
      result.current.setUser({ identifier: 'u1', email: 'ana@masorange.com' });
    });

    expect(result.current.user?.email).toBe('ana@masorange.com');
    expect(client.getUser()?.email).toBe('ana@masorange.com');
  });
});
