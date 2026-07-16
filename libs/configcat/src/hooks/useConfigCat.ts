'use client';

import { useConfigCatContext } from '../context/ConfigCatProvider';

import type { ConfigCatContextValue } from '../types';

export function useConfigCat(): ConfigCatContextValue {
  return useConfigCatContext();
}
