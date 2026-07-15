'use client';

import { useConfigCatContext } from '../context/ConfigCatProvider';

import type { FeatureFlagValue } from '../types';

/**
 * Get a single feature flag value, reactively: the component re-renders
 * when the flag changes (polling, refresh or user change).
 *
 * @example
 * ```tsx
 * const showNewFeature = useFeatureFlag('show_new_feature', false);
 * const buttonColor = useFeatureFlag('button_color', 'blue');
 * const maxItems = useFeatureFlag('max_items', 10);
 * ```
 */
export function useFeatureFlag<T extends FeatureFlagValue>(key: string, defaultValue: T): T {
  const { getValue, isReady } = useConfigCatContext();

  if (!isReady) {
    return defaultValue;
  }
  return getValue(key, defaultValue);
}

/** Boolean flag convenience wrapper (default: false). */
export function useBooleanFlag(key: string, defaultValue = false): boolean {
  return useFeatureFlag(key, defaultValue);
}

/** String flag convenience wrapper (default: ''). */
export function useStringFlag(key: string, defaultValue = ''): string {
  return useFeatureFlag(key, defaultValue);
}

/** Number flag convenience wrapper (default: 0). */
export function useNumberFlag(key: string, defaultValue = 0): number {
  return useFeatureFlag(key, defaultValue);
}
