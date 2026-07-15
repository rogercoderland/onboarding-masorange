'use client';

import { useState, useCallback, useMemo, type ReactNode } from 'react';

import { MockConfigCatClient } from './MockConfigCatClient';
// The SAME context as the real provider, so hooks work unchanged in tests
import { ConfigCatContext } from '../context/ConfigCatProvider';

import type {
  ConfigCatContextValue,
  ConfigCatUser,
  FeatureFlagValue,
  FeatureFlags,
} from '../types';

interface TestConfigCatProviderProps {
  /** Pre-configured mock client (for fine-grained control) */
  client?: MockConfigCatClient;
  /** Shorthand: pass flag values directly instead of a client */
  flags?: FeatureFlags;
  /** Initial user context */
  user?: ConfigCatUser;
  /** Whether the client is ready immediately (default: true) */
  isReady?: boolean;
  /** Children components */
  children: ReactNode;
}

/**
 * Drop-in test replacement for ConfigCatProvider backed by a
 * MockConfigCatClient. No network, no polling.
 *
 * @example
 * ```tsx
 * render(
 *   <TestConfigCatProvider flags={{ show_new_feature: true }}>
 *     <MyComponent />
 *   </TestConfigCatProvider>
 * );
 * ```
 */
export function TestConfigCatProvider({
  client: providedClient,
  flags = {},
  user: initialUser,
  isReady = true,
  children,
}: TestConfigCatProviderProps) {
  const client = useMemo(
    () => providedClient ?? new MockConfigCatClient(flags),
    [providedClient, flags]
  );

  const [user, setUser] = useState<ConfigCatUser | undefined>(initialUser);

  client.setUser(user);
  client.setReady(isReady);

  const getValue = useCallback(
    <T extends FeatureFlagValue>(key: string, defaultValue: T): T => {
      if (!isReady) {
        return defaultValue;
      }
      return client.getValueSync(key, defaultValue);
    },
    [client, isReady]
  );

  const getAllFlags = useCallback((): FeatureFlags => {
    return client.getAllFlagsSync();
  }, [client]);

  const refresh = useCallback(async (): Promise<void> => {
    await client.refresh();
  }, [client]);

  const handleSetUser = useCallback((newUser: ConfigCatUser | undefined) => {
    setUser(newUser);
  }, []);

  const contextValue = useMemo<ConfigCatContextValue>(
    () => ({
      getValue,
      getAllFlags,
      setUser: handleSetUser,
      user,
      isReady,
      refresh,
    }),
    [getValue, getAllFlags, handleSetUser, user, isReady, refresh]
  );

  return <ConfigCatContext.Provider value={contextValue}>{children}</ConfigCatContext.Provider>;
}
