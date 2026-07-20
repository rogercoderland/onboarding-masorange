'use client';

import { useConfigCatContext } from '../context/ConfigCatProvider';

import type { FeatureFlagValue } from '../types';

export function useFeatureFlag<T extends FeatureFlagValue>(key: string, defaultValue: T): T {
  const { getValue, isReady } = useConfigCatContext();

  if (!isReady) {
    return defaultValue;
  }
  return getValue(key, defaultValue);
}

export function useBooleanFlag(key: string, defaultValue = false): boolean {
  return useFeatureFlag(key, defaultValue);
}

export function useStringFlag(key: string, defaultValue = ''): string {
  return useFeatureFlag(key, defaultValue);
}

export function useNumberFlag(key: string, defaultValue = 0): number {
  return useFeatureFlag(key, defaultValue);
}
