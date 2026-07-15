import { describe, it, expect } from 'vitest';

import { MockConfigCatClient, createMockConfigCatClient } from './MockConfigCatClient';

describe('MockConfigCatClient', () => {
  it('returns configured flag values with their type', async () => {
    const client = new MockConfigCatClient({
      show_new_feature: true,
      button_color: 'red',
      max_items: 5,
    });

    expect(client.getValueSync('show_new_feature', false)).toBe(true);
    expect(client.getValueSync('button_color', 'blue')).toBe('red');
    expect(client.getValueSync('max_items', 10)).toBe(5);
    await expect(client.getValue('max_items', 10)).resolves.toBe(5);
  });

  it('falls back to the default value for unknown flags', () => {
    const client = createMockConfigCatClient();

    expect(client.getValueSync('missing_flag', 'fallback')).toBe('fallback');
  });

  it('supports setFlag, setFlags and clearFlags', async () => {
    const client = createMockConfigCatClient({ a: 1 });

    client.setFlag('b', true);
    client.setFlags({ c: 'x' });
    await expect(client.getAllFlags()).resolves.toEqual({ a: 1, b: true, c: 'x' });
    expect(client.getAllFlagsSync()).toEqual({ a: 1, b: true, c: 'x' });

    client.clearFlags();
    expect(client.getAllFlagsSync()).toEqual({});
  });

  it('tracks init, ready state and user context', async () => {
    const client = createMockConfigCatClient();

    expect(client.wasInitCalled()).toBe(false);
    await client.init();
    expect(client.wasInitCalled()).toBe(true);
    expect(client.isReady()).toBe(true);

    client.setUser({ identifier: 'u1', email: 'ana@masorange.com' });
    expect(client.getUser()?.email).toBe('ana@masorange.com');

    client.dispose();
    expect(client.isReady()).toBe(false);
  });
});
