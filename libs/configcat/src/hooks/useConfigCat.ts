'use client';

import { useConfigCatContext } from '../context/ConfigCatProvider';

import type { ConfigCatContextValue } from '../types';

/**
 * Access the full ConfigCat context: `getValue`, `getAllFlags`, `setUser`,
 * `user`, `isReady` and `refresh`.
 *
 * @example
 * ```tsx
 * const { setUser, isReady, refresh } = useConfigCat();
 * ```
 */
export function useConfigCat(): ConfigCatContextValue {
  return useConfigCatContext();
}
