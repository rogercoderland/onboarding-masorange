import { z } from 'zod';

/**
 * Domain schemas for the CMS. These validate the *mapped* shape — i.e. what the
 * infrastructure mappers produce after resolving Contentful links/assets — so
 * the boundary between "raw Contentful envelope" and "clean domain" is checked
 * at runtime (belt-and-suspenders on top of the envelope validation in the
 * `contentful` lib). Types are inferred from these schemas (single source of
 * truth), see `cms-page.model.ts`.
 */

export const cmsDeviceSchema = z.object({
  slug: z.string(),
  name: z.string(),
  brand: z.string(),
  price: z.number(),
  badge: z.string().optional(),
  images: z.array(z.string()),
  specs: z.array(z.object({ label: z.string(), value: z.string() })),
  variants: z.array(
    z.object({ color: z.string(), storage: z.string(), sku: z.string() }),
  ),
  description: z.string(),
});

export const heroBannerBlockSchema = z.object({
  type: z.literal('heroBanner'),
  title: z.string(),
  subtitle: z.string(),
  ctaLabel: z.string(),
  ctaHref: z.string(),
  image: z.string(),
});

export const featureBannerBlockSchema = z.object({
  type: z.literal('featureBanner'),
  title: z.string(),
  description: z.string(),
  ctaLabel: z.string(),
  ctaHref: z.string(),
});

export const deviceGridBlockSchema = z.object({
  type: z.literal('deviceGrid'),
  title: z.string(),
  devices: z.array(cmsDeviceSchema),
});

export const footerBlockSchema = z.object({
  type: z.literal('footer'),
  columns: z.array(
    z.object({
      heading: z.string(),
      links: z.array(z.object({ label: z.string(), href: z.string() })),
    }),
  ),
  legal: z.string(),
});

export const cmsBlockSchema = z.discriminatedUnion('type', [
  heroBannerBlockSchema,
  featureBannerBlockSchema,
  deviceGridBlockSchema,
  footerBlockSchema,
]);

/** Per-type schema lookup — used by the mapper to validate one block at a time. */
export const CMS_BLOCK_SCHEMAS = {
  heroBanner: heroBannerBlockSchema,
  featureBanner: featureBannerBlockSchema,
  deviceGrid: deviceGridBlockSchema,
  footer: footerBlockSchema,
} as const;

export const cmsPageSchema = z.object({
  title: z.string(),
  slug: z.string(),
  seo: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
  }),
  sections: z.array(cmsBlockSchema),
});
