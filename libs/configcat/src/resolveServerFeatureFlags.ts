import { createConfigCatClientSSR } from './client/ConfigCatClientSSR';

import type { ConfigCatUser, FeatureFlagValue } from './types';

export interface ServerFeatureFlagDefinition<T extends FeatureFlagValue = FeatureFlagValue> {
  key: string;
  defaultValue: T;
}

export type ServerFeatureFlagDefinitions = Record<string, ServerFeatureFlagDefinition>;

export type ResolvedServerFeatureFlags<T extends ServerFeatureFlagDefinitions> = {
  [K in keyof T]: T[K] extends ServerFeatureFlagDefinition<infer U> ? U : never;
};

interface ResolveServerFeatureFlagsOptions<T extends ServerFeatureFlagDefinitions> {
  sdkKey: string;
  flags: T;
  /** Optional user context so targeting rules also apply server-side */
  user?: ConfigCatUser;
}

function getDefaultFlags<T extends ServerFeatureFlagDefinitions>(
  flags: T
): ResolvedServerFeatureFlags<T> {
  const flagEntries = Object.entries(flags) as Array<[keyof T, T[keyof T]]>;

  return Object.fromEntries(
    flagEntries.map(([name, definition]) => [name, definition.defaultValue])
  ) as ResolvedServerFeatureFlags<T>;
}

/** Extract the ConfigCat keys of a flag definition map (useful for cache tags). */
export function getServerFeatureFlagKeys<T extends ServerFeatureFlagDefinitions>(
  flags: T
): string[] {
  return Object.values(flags).map((definition) => definition.key);
}

/**
 * Resolve a typed map of feature flags on the server with an ephemeral SSR
 * client: init (one fetch) → read all values → dispose. Designed for
 * per-request usage in Server Components and Route Handlers.
 *
 * Fail-soft: with an empty `sdkKey` it returns the default values.
 *
 * @example
 * ```ts
 * const flags = await resolveServerFeatureFlags({
 *   sdkKey: process.env.CONFIGCAT_SDK_KEY ?? '',
 *   flags: {
 *     showNewFeature: { key: 'show_new_feature', defaultValue: false },
 *     maxItems: { key: 'max_items', defaultValue: 10 },
 *   },
 * });
 * flags.showNewFeature; // boolean
 * ```
 */
export async function resolveServerFeatureFlags<T extends ServerFeatureFlagDefinitions>({
  sdkKey,
  flags,
  user,
}: ResolveServerFeatureFlagsOptions<T>): Promise<ResolvedServerFeatureFlags<T>> {
  if (!sdkKey || sdkKey.trim().length === 0) {
    return getDefaultFlags(flags);
  }

  const client = createConfigCatClientSSR({ sdkKey });
  const flagEntries = Object.entries(flags) as Array<[keyof T, T[keyof T]]>;

  try {
    await client.init();

    const resolvedEntries = await Promise.all(
      flagEntries.map(async ([name, definition]) => [
        name,
        await client.getValue(definition.key, definition.defaultValue, user),
      ])
    );

    return Object.fromEntries(resolvedEntries) as ResolvedServerFeatureFlags<T>;
  } finally {
    client.dispose();
  }
}
