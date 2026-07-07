import {
  cmsBlockSchema,
  cmsDeviceSchema,
  heroBannerBlockSchema,
} from './cms-block.schema.js';

describe('cms block schemas', () => {
  it('parses a valid hero banner block', () => {
    const parsed = heroBannerBlockSchema.parse({
      type: 'heroBanner',
      title: 'Hola',
      subtitle: 'Sub',
      ctaLabel: 'Ver',
      ctaHref: '/x',
      image: 'https://images.ctfassets.net/x.png',
    });
    expect(parsed.title).toBe('Hola');
  });

  it('rejects a block missing required fields', () => {
    const result = heroBannerBlockSchema.safeParse({
      type: 'heroBanner',
      title: 'Hola',
    });
    expect(result.success).toBe(false);
  });

  it('discriminates the union by type', () => {
    const parsed = cmsBlockSchema.parse({
      type: 'featureBanner',
      title: 'T',
      description: 'D',
      ctaLabel: 'C',
      ctaHref: '/h',
    });
    expect(parsed.type).toBe('featureBanner');
  });

  it('rejects an unknown block type', () => {
    const result = cmsBlockSchema.safeParse({ type: 'carousel', title: 'x' });
    expect(result.success).toBe(false);
  });

  it('validates device shape (specs/variants)', () => {
    const result = cmsDeviceSchema.safeParse({
      slug: 's',
      name: 'n',
      brand: 'b',
      price: 10,
      images: [],
      specs: [{ label: 'RAM', value: '8' }],
      variants: [{ color: 'Negro', storage: '128', sku: 'x' }],
      description: 'd',
    });
    expect(result.success).toBe(true);
  });
});
