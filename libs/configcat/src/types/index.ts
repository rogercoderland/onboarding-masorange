export type FeatureFlagValue = boolean | string | number | object;

export type FeatureFlags = Record<string, FeatureFlagValue>;

export interface ConfigCatUser {
  identifier: string;
  email?: string;
  country?: string;
  custom?: Record<string, string>;
}

export interface ConfigCatClientOptions {
  sdkKey: string;
  pollIntervalSeconds?: number;
  defaultValues?: FeatureFlags;
  debug?: boolean;
}

export interface ConfigCatContextValue {
  getValue: <T extends FeatureFlagValue>(key: string, defaultValue: T) => T;
  getAllFlags: () => FeatureFlags;
  setUser: (user: ConfigCatUser | undefined) => void;
  user: ConfigCatUser | undefined;
  isReady: boolean;
  refresh: () => Promise<void>;
}

export interface IConfigCatClient {
  init(): Promise<void>;
  getValue<T extends FeatureFlagValue>(
    key: string,
    defaultValue: T,
    user?: ConfigCatUser,
  ): Promise<T>;
  getValueSync<T extends FeatureFlagValue>(key: string, defaultValue: T): T;
  getAllFlags(user?: ConfigCatUser): Promise<FeatureFlags>;
  getAllFlagsSync(): FeatureFlags;
  refresh(): Promise<void>;
  setUser(user: ConfigCatUser | undefined): void;
  getUser(): ConfigCatUser | undefined;
  isReady(): boolean;
  dispose(): void;
}
