import { render, screen } from '@testing-library/react';
import type { CmsBlock, CmsPage } from '@onboarding-nx/cms-domain';
import { renderBlock } from './render-block';

const page: CmsPage = {
  title: 'Home',
  slug: 'home',
  seo: {},
  sections: [
    {
      type: 'heroBanner',
      title: 'El móvil que quieres',
      subtitle: 'Con financiación',
      ctaLabel: 'Ver catálogo',
      ctaHref: '/dispositivos',
      image: 'https://images.ctfassets.net/x/hero.png',
    },
    {
      type: 'deviceGrid',
      title: 'Destacados',
      devices: [
        {
          slug: 'galaxy-s24',
          name: 'Galaxy S24',
          brand: 'Samsung',
          price: 909,
          images: ['https://images.ctfassets.net/x/dev.png'],
          specs: [],
          variants: [],
          description: 'd',
        },
      ],
    },
    {
      type: 'featureBanner',
      title: 'Cambia sin líos',
      description: 'Recogida gratuita',
      ctaLabel: 'Saber más',
      ctaHref: '/x',
    },
    {
      type: 'footer',
      columns: [
        { heading: 'Tienda', links: [{ label: 'Dispositivos', href: '/d' }] },
      ],
      legal: '© 2026',
    },
  ],
};

describe('renderBlock (block registry)', () => {
  it('renders every section type from a CmsPage', () => {
    render(<>{page.sections.map(renderBlock)}</>);

    expect(screen.getByText('El móvil que quieres')).toBeInTheDocument();
    expect(screen.getByText('Destacados')).toBeInTheDocument();
    expect(screen.getByText('Galaxy S24')).toBeInTheDocument();
    expect(screen.getByText('Cambia sin líos')).toBeInTheDocument();
    expect(screen.getByText('© 2026')).toBeInTheDocument();
  });

  it('renders the hero CTA as a link to its href', () => {
    render(<>{renderBlock(page.sections[0])}</>);
    expect(screen.getByRole('link', { name: 'Ver catálogo' })).toHaveAttribute(
      'href',
      '/dispositivos',
    );
  });

  it('returns null for an unsupported block type (no throw)', () => {
    const unknown = { type: 'carousel' } as unknown as CmsBlock;
    expect(renderBlock(unknown)).toBeNull();
  });
});
