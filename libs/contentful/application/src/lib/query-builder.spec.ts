import { entriesByType, entryBySlug } from './query-builder.js';

describe('query-builder', () => {
  it('builds a by-type query with a default include depth', () => {
    expect(entriesByType('device')).toEqual({
      content_type: 'device',
      include: 2,
    });
  });

  it('builds a by-slug query limited to one entry', () => {
    expect(entryBySlug('page', 'home')).toEqual({
      content_type: 'page',
      'fields.slug': 'home',
      limit: 1,
      include: 2,
    });
  });

  it('lets overrides win', () => {
    expect(entriesByType('device', { include: 0, limit: 10 })).toMatchObject({
      include: 0,
      limit: 10,
    });
  });
});
