import * as configcat from 'configcat-js-ssr';

import type {
  IConfigCatClient,
  FeatureFlagValue,
  FeatureFlags,
  ConfigCatUser,
  ConfigCatClientOptions,
} from '../types';

export class ConfigCatClientSSR implements IConfigCatClient {
  private client: configcat.IConfigCatClient | null = null;
  private options: ConfigCatClientOptions;
  private user: ConfigCatUser | undefined;
  private ready = false;
  private cachedFlags: FeatureFlags = {};

  constructor(options: ConfigCatClientOptions) {
    this.options = {
      pollIntervalSeconds: 120,
      debug: false,
      ...options,
    };
  }

  async init(): Promise<void> {
    if (this.client) {
      return;
    }

    const logger = this.options.debug
      ? configcat.createConsoleLogger(configcat.LogLevel.Info)
      : configcat.createConsoleLogger(configcat.LogLevel.Off);

    this.client = configcat.getClient(this.options.sdkKey, configcat.PollingMode.ManualPoll, {
      logger,
    });

    await this.client.forceRefreshAsync();
    this.ready = true;
    await this.updateCachedFlags();
  }

  private async updateCachedFlags(): Promise<void> {
    if (!this.client) return;

    try {
      const allDetails = await this.client.getAllValueDetailsAsync(
        this.toConfigCatUser(this.user)
      );
      const flags: FeatureFlags = {};

      for (const detail of allDetails) {
        if (detail.value !== undefined && detail.value !== null) {
          flags[detail.key] = detail.value;
        }
      }

      this.cachedFlags = flags;
    } catch (error) {
      if (this.options.debug) {
        console.warn('ConfigCat SSR: Failed to update cached flags', error);
      }
    }
  }

  private toConfigCatUser(user?: ConfigCatUser): configcat.User | undefined {
    if (!user) return undefined;

    return new configcat.User(user.identifier, user.email, user.country, user.custom);
  }

  async getValue<T extends FeatureFlagValue>(
    key: string,
    defaultValue: T,
    user?: ConfigCatUser
  ): Promise<T> {
    if (!this.client) {
      return (this.options.defaultValues?.[key] as T) ?? defaultValue;
    }

    const value = await this.client.getValueAsync(
      key,
      defaultValue as unknown as string | boolean | number,
      this.toConfigCatUser(user ?? this.user)
    );

    return value as unknown as T;
  }

  getValueSync<T extends FeatureFlagValue>(key: string, defaultValue: T): T {
    if (key in this.cachedFlags) {
      return this.cachedFlags[key] as T;
    }
    return (this.options.defaultValues?.[key] as T) ?? defaultValue;
  }

  async getAllFlags(user?: ConfigCatUser): Promise<FeatureFlags> {
    if (!this.client) {
      return this.options.defaultValues ?? {};
    }

    try {
      const allDetails = await this.client.getAllValueDetailsAsync(
        this.toConfigCatUser(user ?? this.user)
      );
      const flags: FeatureFlags = {};

      for (const detail of allDetails) {
        if (detail.value !== undefined && detail.value !== null) {
          flags[detail.key] = detail.value;
        }
      }

      return flags;
    } catch (error) {
      if (this.options.debug) {
        console.warn('ConfigCat SSR: Failed to get all flags', error);
      }
      return this.options.defaultValues ?? {};
    }
  }

  getAllFlagsSync(): FeatureFlags {
    return { ...this.cachedFlags };
  }

  async refresh(): Promise<void> {
    if (!this.client) return;
    await this.client.forceRefreshAsync();
    await this.updateCachedFlags();
  }

  setUser(user: ConfigCatUser | undefined): void {
    this.user = user;
  }

  getUser(): ConfigCatUser | undefined {
    return this.user;
  }

  isReady(): boolean {
    return this.ready;
  }

  dispose(): void {
    if (this.client) {
      this.client.dispose();
      this.client = null;
      this.ready = false;
      this.cachedFlags = {};
    }
  }
}

export function createConfigCatClientSSR(options: ConfigCatClientOptions): IConfigCatClient {
  return new ConfigCatClientSSR(options);
}
