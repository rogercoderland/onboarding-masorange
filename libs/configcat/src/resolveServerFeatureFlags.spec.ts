import { describe, it, expect } from 'vitest';

import { resolveServerFeatureFlags, getServerFeatureFlagKeys } from './resolveServerFeatureFlags';

const FLAG_DEFINITIONS = {
  showNewFeature: { key: 'show_new_feature', defaultValue: false },
  buttonColor: { key: 'button_color', defaultValue: 'blue' },
  maxItems: { key: 'max_items', defaultValue: 10 },
};

describe('resolveServerFeatureFlags', () => {
  it('returns default values without touching the network when sdkKey is empty', async () => {
    const flags = await resolveServerFeatureFlags({ sdkKey: '', flags: FLAG_DEFINITIONS });

    expect(flags).toEqual({ showNewFeature: false, buttonColor: 'blue', maxItems: 10 });
  });

  it('treats a whitespace-only sdkKey as missing', async () => {
    const flags = await resolveServerFeatureFlags({ sdkKey: '   ', flags: FLAG_DEFINITIONS });

    expect(flags.maxItems).toBe(10);
  });
});

describe('getServerFeatureFlagKeys', () => {
  it('extracts the ConfigCat keys from the definitions', () => {
    expect(getServerFeatureFlagKeys(FLAG_DEFINITIONS)).toEqual([
      'show_new_feature',
      'button_color',
      'max_items',
    ]);
  });
});
