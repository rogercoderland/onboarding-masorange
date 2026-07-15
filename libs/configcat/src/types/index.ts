/**
 * Value of a feature flag: boolean, string, number or JSON object.
 */
export type FeatureFlagValue = boolean | string | number | object;

/**
 * Record of feature flag keys to their values.
 */
export type FeatureFlags = Record<string, FeatureFlagValue>;

/**
 * User context for targeting rules and personalization.
 */
export interface ConfigCatUser {
  /** Unique identifier for the user */
  identifier: string;
  /** User's email address */
  email?: string;
  /** User's country (ISO code) */
  country?: string;
  /** Custom attributes for targeting rules */
  custom?: Record<string, string>;
}

/**
 * Configuration options shared by the client adapters.
 */
export interface ConfigCatClientOptions {
  /** SDK key from the ConfigCat dashboard */
  sdkKey: string;
  /** Polling interval in seconds (default: 60 CSR, 120 SSR) */
  pollIntervalSeconds?: number;
  /** Fallback values when the remote config is unavailable */
  defaultValues?: FeatureFlags;
  /** Enable debug logging */
  debug?: boolean;
}

/**
 * Context value exposed by ConfigCatProvider.
 */
export interface ConfigCatContextValue {
  /** Get a feature flag value (sync, from the polled cache) */
  getValue: <T extends FeatureFlagValue>(key: string, defaultValue: T) => T;
  /** Get all currently known feature flags (sync, from the polled cache) */
  getAllFlags: () => FeatureFlags;
  /** Set or update the user context (re-evaluates targeting rules) */
  setUser: (user: ConfigCatUser | undefined) => void;
  /** Current user context */
  user: ConfigCatUser | undefined;
  /** Whether the client finished its initial fetch */
  isReady: boolean;
  /** Force refresh flags from the ConfigCat CDN */
  refresh: () => Promise<void>;
}

/**
 * Port for ConfigCat client implementations (hexagonal architecture).
 * Adapters: ConfigCatClientCSR (browser), ConfigCatClientSSR (server),
 * MockConfigCatClient (tests).
 */
export interface IConfigCatClient {
  /** Initialize the client; resolves when flags are available. */
  init(): Promise<void>;

  /** Get a single flag value, optionally evaluated for a user. */
  getValue<T extends FeatureFlagValue>(
    key: string,
    defaultValue: T,
    user?: ConfigCatUser
  ): Promise<T>;

  /** Get a single flag value synchronously from the local cache (after init()). */
  getValueSync<T extends FeatureFlagValue>(key: string, defaultValue: T): T;

  /** Get all flags, optionally evaluated for a user. */
  getAllFlags(user?: ConfigCatUser): Promise<FeatureFlags>;

  /** Get all cached flags synchronously (after init()). */
  getAllFlagsSync(): FeatureFlags;

  /** Force refresh flags from the server. */
  refresh(): Promise<void>;

  /** Set or update the user context. */
  setUser(user: ConfigCatUser | undefined): void;

  /** Get the current user context. */
  getUser(): ConfigCatUser | undefined;

  /** Whether the client is initialized and ready. */
  isReady(): boolean;

  /** Dispose the client and release resources (timers, sockets). */
  dispose(): void;
}
