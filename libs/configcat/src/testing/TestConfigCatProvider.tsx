'use client';

import { useState, useCallback, useMemo, type ReactNode } from 'react';

import { MockConfigCatClient } from './MockConfigCatClient';
import { ConfigCatContext } from '../context/ConfigCatProvider';

import type {
  ConfigCatContextValue,
  ConfigCatUser,
  FeatureFlagValue,
  FeatureFlags,
} from '../types';

interface TestConfigCatProviderProps {
  client?: MockConfigCatClient;
  flags?: FeatureFlags;
  user?: ConfigCatUser;
  isReady?: boolean;
  children: ReactNode;
}

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
