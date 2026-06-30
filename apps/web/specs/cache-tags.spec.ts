import { CacheTags } from '../app/lib/cache-tags';

describe('CacheTags', () => {
  it('exposes the static tags used by the cached components', () => {
    expect(CacheTags.devices).toBe('devices');
    expect(CacheTags.homeSections).toBe('home-sections');
  });

  it('builds a per-device tag from a slug', () => {
    expect(CacheTags.device('galaxy-s24-ultra')).toBe('device:galaxy-s24-ultra');
  });
});
