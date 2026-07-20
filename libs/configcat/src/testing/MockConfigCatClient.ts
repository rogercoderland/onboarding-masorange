import type { IConfigCatClient, FeatureFlagValue, FeatureFlags, ConfigCatUser } from '../types';

export class MockConfigCatClient implements IConfigCatClient {
  private flags: FeatureFlags;
  private user: ConfigCatUser | undefined;
  private ready = true;
  private initCalled = false;

  constructor(flags: FeatureFlags = {}) {
    this.flags = { ...flags };
  }

  async init(): Promise<void> {
    this.initCalled = true;
    this.ready = true;
  }

  async getValue<T extends FeatureFlagValue>(key: string, defaultValue: T): Promise<T> {
    return this.getValueSync(key, defaultValue);
  }

  getValueSync<T extends FeatureFlagValue>(key: string, defaultValue: T): T {
    if (key in this.flags) {
      return this.flags[key] as T;
    }
    return defaultValue;
  }

  async getAllFlags(): Promise<FeatureFlags> {
    return { ...this.flags };
  }

  getAllFlagsSync(): FeatureFlags {
    return { ...this.flags };
  }

  async refresh(): Promise<void> {
    return;
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
    this.ready = false;
  }

  setFlag(key: string, value: FeatureFlagValue): void {
    this.flags[key] = value;
  }

  setFlags(flags: FeatureFlags): void {
    this.flags = { ...this.flags, ...flags };
  }

  clearFlags(): void {
    this.flags = {};
  }

  wasInitCalled(): boolean {
    return this.initCalled;
  }

  setReady(ready: boolean): void {
    this.ready = ready;
  }
}

export function createMockConfigCatClient(flags: FeatureFlags = {}): MockConfigCatClient {
  return new MockConfigCatClient(flags);
}
