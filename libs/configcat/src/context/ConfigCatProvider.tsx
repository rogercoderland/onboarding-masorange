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
  /** SDK key from the ConfigCat dashboard */
  sdkKey: string;
  /** Polling interval in seconds (default: 60) */
  pollIntervalSeconds?: number;
  /** Initial user context for targeting */
  user?: ConfigCatUser;
  /** Fallback values when the remote config is unavailable */
  defaultValues?: FeatureFlags;
  /** Enable debug logging */
  debug?: boolean;
  /** Children components */
  children: ReactNode;
}

const ConfigCatContext = createContext<ConfigCatContextValue | null>(null);

/**
 * Provider that initializes the CSR ConfigCat client and exposes flags to
 * the React tree. Place it at the root of the app (layout.tsx).
 *
 * Fail-soft by design: with an empty `sdkKey` the app still renders and
 * every flag resolves to its default value (the SDK key is public, but we
 * never want a missing env var to take the site down).
 *
 * @example
 * ```tsx
 * <ConfigCatProvider sdkKey={process.env.NEXT_PUBLIC_CONFIGCAT_SDK_KEY ?? ''}>
 *   <App />
 * </ConfigCatProvider>
 * ```
 */
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
  // Increments whenever flags may have changed, so consumers re-render
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

    // AutoPoll updates the client cache in the background; without this
    // subscription React would never re-render on dashboard toggles.
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
    // defaultValues is intentionally excluded: it is a config-time constant
    // and would re-create the client on every render if passed inline.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sdkKey, hasValidSdkKey, pollIntervalSeconds, debug]);

  // Push user changes into the client so targeting rules re-evaluate
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
    // updateTrigger invalidates the callback when the cache changes
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

/**
 * Access the ConfigCat context. Must be used within a ConfigCatProvider.
 */
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
