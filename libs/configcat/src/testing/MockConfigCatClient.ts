import type { IConfigCatClient, FeatureFlagValue, FeatureFlags, ConfigCatUser } from '../types';

/**
 * Mock adapter of the IConfigCatClient port for tests: no network, flags
 * are whatever you set. This is the payoff of the hexagonal port — tests
 * exercise the real Provider/hooks against a fake client.
 *
 * @example
 * ```tsx
 * const mockClient = new MockConfigCatClient({ show_new_feature: true });
 * render(
 *   <TestConfigCatProvider client={mockClient}>
 *     <MyComponent />
 *   </TestConfigCatProvider>
 * );
 * ```
 */
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
    // No-op for mock
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

  // --- Test utilities ---

  /** Set a single flag value. */
  setFlag(key: string, value: FeatureFlagValue): void {
    this.flags[key] = value;
  }

  /** Merge multiple flags at once. */
  setFlags(flags: FeatureFlags): void {
    this.flags = { ...this.flags, ...flags };
  }

  /** Remove all flags. */
  clearFlags(): void {
    this.flags = {};
  }

  /** Whether init() was called. */
  wasInitCalled(): boolean {
    return this.initCalled;
  }

  /** Simulate a not-ready client. */
  setReady(ready: boolean): void {
    this.ready = ready;
  }
}

export function createMockConfigCatClient(flags: FeatureFlags = {}): MockConfigCatClient {
  return new MockConfigCatClient(flags);
}
