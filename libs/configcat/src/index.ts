// Main entry point (CSR): browser / React components.
// Import as: import { ... } from '@onboarding-nx/configcat'

export type {
  FeatureFlagValue,
  FeatureFlags,
  ConfigCatUser,
  ConfigCatClientOptions,
  ConfigCatContextValue,
  IConfigCatClient,
} from './types';

export { ConfigCatClientCSR, createConfigCatClientCSR } from './client/ConfigCatClientCSR';

export {
  ConfigCatProvider,
  useConfigCatContext,
  ConfigCatContext,
  type ConfigCatProviderProps,
} from './context';

export { useConfigCat, useFeatureFlag, useBooleanFlag, useStringFlag, useNumberFlag } from './hooks';
