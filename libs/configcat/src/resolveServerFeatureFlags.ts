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

export function getServerFeatureFlagKeys<T extends ServerFeatureFlagDefinitions>(
  flags: T
): string[] {
  return Object.values(flags).map((definition) => definition.key);
}

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
