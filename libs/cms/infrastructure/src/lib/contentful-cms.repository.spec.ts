import type {
  ContentfulClientPort,
  ContentfulCollection,
} from '@onboarding-nx/contentful-domain';
import { ContentfulCmsRepository } from './contentful-cms.repository.js';

const link = (id: string) => ({ sys: { type: 'Link', linkType: 'Entry', id } });
const assetLink = (id: string) => ({
  sys: { type: 'Link', linkType: 'Asset', id },
});
const entry = (id: string, contentType: string, fields: unknown) => ({
  sys: { id, type: 'Entry', contentType: { sys: { id: contentType } } },
  fields,
});
const asset = (id: string, url: string) => ({
  sys: { id, type: 'Asset' },
  fields: { file: { url } },
});

// One `page` linking hero + deviceGrid + featureBanner + footer, with a device
// and two assets side-band under `includes`.
const pageCollection = {
  total: 1,
  skip: 0,
  limit: 1,
  items: [
    entry('page-1', 'page', {
      title: 'Home',
      slug: 'home',
      seoTitle: 'Inicio',
      sections: [link('hero-1'), link('grid-1'), link('feat-1'), link('foot-1')],
    }),
  ],
  includes: {
    Entry: [
      entry('hero-1', 'heroBanner', {
        title: 'El móvil que quieres',
        subtitle: 'Sub',
        ctaLabel: 'Ver catálogo',
        ctaHref: '/dispositivos',
        image: assetLink('img-hero'),
      }),
      entry('grid-1', 'deviceGrid', {
        title: 'Destacados',
        devices: [link('dev-1')],
      }),
      entry('feat-1', 'featureBanner', {
        title: 'Cambia sin líos',
        description: 'Desc',
        ctaLabel: 'Saber más',
        ctaHref: '/x',
      }),
      entry('foot-1', 'footer', {
        columns: [
          { heading: 'Tienda', links: [{ label: 'Dispositivos', href: '/d' }] },
        ],
        legal: '© 2026',
      }),
      entry('dev-1', 'device', {
        slug: 'galaxy-s24',
        name: 'Galaxy S24',
        brand: 'Samsung',
        price: 909,
        images: [assetLink('img-dev')],
        specs: [{ label: 'RAM', value: '8 GB' }],
        variants: [{ color: 'Negro', storage: '256', sku: 's24-blk' }],
        description: 'Compacto y potente',
      }),
    ],
    Asset: [
      asset('img-hero', '//images.ctfassets.net/x/hero.png'),
      asset('img-dev', '//images.ctfassets.net/x/dev.png'),
    ],
  },
} as unknown as ContentfulCollection;

const client = {
  getEntries: vi.fn(async () => pageCollection),
  getEntry: vi.fn(),
} as unknown as ContentfulClientPort;

describe('ContentfulCmsRepository.getPageBySlug', () => {
  it('maps the raw envelope into a clean, ordered CmsPage', async () => {
    const repo = new ContentfulCmsRepository(client);
    const page = await repo.getPageBySlug('home');

    expect(page).not.toBeNull();
    expect(page?.title).toBe('Home');
    expect(page?.seo.title).toBe('Inicio');
    expect(page?.sections.map((s) => s.type)).toEqual([
      'heroBanner',
      'deviceGrid',
      'featureBanner',
      'footer',
    ]);
  });

  it('resolves asset links to absolute https URLs', async () => {
    const page = await new ContentfulCmsRepository(client).getPageBySlug('home');
    const hero = page?.sections.find((s) => s.type === 'heroBanner');
    expect(hero).toMatchObject({
      image: 'https://images.ctfassets.net/x/hero.png',
    });
  });

  it('resolves nested device links inside a deviceGrid', async () => {
    const page = await new ContentfulCmsRepository(client).getPageBySlug('home');
    const grid = page?.sections.find((s) => s.type === 'deviceGrid');
    expect(grid && grid.type === 'deviceGrid' && grid.devices[0]).toMatchObject({
      slug: 'galaxy-s24',
      images: ['https://images.ctfassets.net/x/dev.png'],
    });
  });

  it('returns null when the page is absent', async () => {
    const emptyClient = {
      getEntries: vi.fn(async () => ({ total: 0, skip: 0, limit: 1, items: [] })),
      getEntry: vi.fn(),
    } as unknown as ContentfulClientPort;
    const page = await new ContentfulCmsRepository(emptyClient).getPageBySlug('x');
    expect(page).toBeNull();
  });
});
