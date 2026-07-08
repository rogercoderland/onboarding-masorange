import {
  contentfulCollectionSchema,
  contentfulEntrySchema,
} from './contentful-response.schema';

describe('contentful response schemas', () => {
  it('accepts a well-formed collection with includes', () => {
    const parsed = contentfulCollectionSchema.safeParse({
      sys: { type: 'Array' },
      total: 1,
      skip: 0,
      limit: 100,
      items: [{ sys: { id: 'x', type: 'Entry' }, fields: { slug: 'home' } }],
      includes: {
        Asset: [
          { sys: { id: 'a1', type: 'Asset' }, fields: { file: { url: '//x' } } },
        ],
      },
    });
    expect(parsed.success).toBe(true);
  });

  it('rejects a malformed collection', () => {
    expect(contentfulCollectionSchema.safeParse({ items: 'nope' }).success).toBe(
      false,
    );
  });

  it('requires sys.id on an entry', () => {
    expect(
      contentfulEntrySchema.safeParse({ sys: { type: 'Entry' }, fields: {} })
        .success,
    ).toBe(false);
  });
});
