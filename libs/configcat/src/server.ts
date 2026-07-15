// Server entry point (SSR): Server Components and Route Handlers.
// Import as: import { ... } from '@onboarding-nx/configcat/server'
// This entry point does NOT import React nor the CSR client.

export type {
  FeatureFlagValue,
  FeatureFlags,
  ConfigCatUser,
  ConfigCatClientOptions,
  IConfigCatClient,
} from './types';
export type {
  ServerFeatureFlagDefinition,
  ServerFeatureFlagDefinitions,
  ResolvedServerFeatureFlags,
} from './resolveServerFeatureFlags';

export { ConfigCatClientSSR, createConfigCatClientSSR } from './client/ConfigCatClientSSR';
export { getServerFeatureFlagKeys, resolveServerFeatureFlags } from './resolveServerFeatureFlags';
