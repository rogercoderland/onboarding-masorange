import type { ContentfulLink } from '@onboarding-nx/contentful-domain';
import {
  allDevices,
  deviceBySlug,
  pageBySlug,
  type DeviceFields,
  type PageFields,
} from './queries';

describe('typed queries', () => {
  it('build the expected runtime queries', () => {
    expect(pageBySlug('home')).toMatchObject({
      content_type: 'page',
      'fields.slug': 'home',
      limit: 1,
    });
    expect(allDevices()).toMatchObject({ content_type: 'device' });
    expect(deviceBySlug('iphone-15')).toMatchObject({
      content_type: 'device',
      'fields.slug': 'iphone-15',
    });
  });

  it('resolves codegen descriptors to plain values (compile-time)', () => {
    // Fails to compile if ResolveFields stops unwrapping EntryFieldTypes.*.
    const page: PageFields = { title: 'Home', sections: [] as ContentfulLink[] };
    const device: DeviceFields = { name: 'iPhone 15', price: 999 };
    expect(page.title).toBe('Home');
    expect(device.price).toBe(999);
  });
});
