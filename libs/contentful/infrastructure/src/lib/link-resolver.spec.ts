import type { ContentfulIncludes } from '@onboarding-nx/contentful-domain';
import { createLinkResolver } from './link-resolver.js';

const includes = {
  Entry: [{ sys: { id: 'e1', type: 'Entry' }, fields: { name: 'grid' } }],
  Asset: [
    { sys: { id: 'a1', type: 'Asset' }, fields: { file: { url: '//img.png' } } },
  ],
} as unknown as ContentfulIncludes;

describe('createLinkResolver', () => {
  it('resolves entry and asset links by id', () => {
    const resolver = createLinkResolver(includes);

    expect(resolver.entry('e1')?.fields).toEqual({ name: 'grid' });
    expect(resolver.asset('a1')?.fields.file?.url).toBe('//img.png');
    expect(
      resolver.resolve({ sys: { type: 'Link', linkType: 'Asset', id: 'a1' } }),
    ).toBe(includes.Asset?.[0]);
  });

  it('returns undefined for unknown or missing includes', () => {
    expect(
      createLinkResolver(includes).resolve({
        sys: { type: 'Link', linkType: 'Entry', id: 'nope' },
      }),
    ).toBeUndefined();
    expect(createLinkResolver(undefined).entry('x')).toBeUndefined();
  });
});
