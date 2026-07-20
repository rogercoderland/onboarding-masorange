'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';

import { createConfigCatClientCSR, type ConfigCatClientCSR } from '../client/ConfigCatClientCSR';

import type {
  ConfigCatContextValue,
  ConfigCatUser,
  FeatureFlagValue,
  FeatureFlags,
} from '../types';

export interface ConfigCatProviderProps {
  sdkKey: string;
  pollIntervalSeconds?: number;
  user?: ConfigCatUser;
  defaultValues?: FeatureFlags;
  debug?: boolean;
  children: ReactNode;
}

const ConfigCatContext = createContext<ConfigCatContextValue | null>(null);

export function ConfigCatProvider({
  sdkKey,
  pollIntervalSeconds = 60,
  user: initialUser,
  defaultValues,
  debug = false,
  children,
}: ConfigCatProviderProps) {
  const [client, setClient] = useState<ConfigCatClientCSR | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [user, setUser] = useState<ConfigCatUser | undefined>(initialUser);
  const [updateTrigger, setUpdateTrigger] = useState(0);

  const hasValidSdkKey = Boolean(sdkKey && sdkKey.trim().length > 0);

  useEffect(() => {
    if (!hasValidSdkKey) {
      console.warn(
        '[ConfigCat] No SDK key provided. Feature flags will return default values only. ' +
          'Set NEXT_PUBLIC_CONFIGCAT_SDK_KEY to enable remote feature flags.'
      );
      setIsReady(true);
      return;
    }

    const configCatClient = createConfigCatClientCSR({
      sdkKey,
      pollIntervalSeconds,
      defaultValues,
      debug,
    });

    configCatClient.setOnFlagsChanged(() => {
      setUpdateTrigger((prev) => prev + 1);
    });

    configCatClient.init().then(() => {
      setClient(configCatClient);
      setIsReady(true);
    });

    return () => {
      configCatClient.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sdkKey, hasValidSdkKey, pollIntervalSeconds, debug]);

  useEffect(() => {
    if (client) {
      client.setUser(user);
      setUpdateTrigger((prev) => prev + 1);
    }
  }, [client, user]);

  const getValue = useCallback(
    <T extends FeatureFlagValue>(key: string, defaultValue: T): T => {
      if (!client) {
        return (defaultValues?.[key] as T) ?? defaultValue;
      }
      return client.getValueSync(key, defaultValue);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [client, defaultValues, updateTrigger]
  );

  const getAllFlags = useCallback((): FeatureFlags => {
    if (!client) {
      return defaultValues ?? {};
    }
    return client.getAllFlagsSync();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client, defaultValues, updateTrigger]);

  const refresh = useCallback(async (): Promise<void> => {
    if (client) {
      await client.refresh();
      setUpdateTrigger((prev) => prev + 1);
    }
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

export function useConfigCatContext(): ConfigCatContextValue {
  const context = useContext(ConfigCatContext);

  if (!context) {
    throw new Error(
      'useConfigCatContext must be used within a ConfigCatProvider. ' +
        'Make sure to wrap your application with <ConfigCatProvider>.'
    );
  }

  return context;
}

export { ConfigCatContext };
