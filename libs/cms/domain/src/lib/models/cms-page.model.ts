import type { z } from 'zod';
import type {
  cmsBlockSchema,
  cmsDeviceSchema,
  cmsPageSchema,
  deviceGridBlockSchema,
  featureBannerBlockSchema,
  footerBlockSchema,
  heroBannerBlockSchema,
} from '../schemas/cms-block.schema.js';

/**
 * The block types a `page` can compose, in Contentful content-type id form.
 * Adding a block = add its id here + a schema in `cms-block.schema.ts` + a
 * component in `cms-presentation`'s registry. The registry's `satisfies` check
 * makes the last step non-optional.
 */
export const CMS_BLOCK_TYPES = [
  'heroBanner',
  'featureBanner',
  'deviceGrid',
  'footer',
] as const;

export type CmsBlockType = (typeof CMS_BLOCK_TYPES)[number];

export const isCmsBlockType = (type: string): type is CmsBlockType =>
  (CMS_BLOCK_TYPES as readonly string[]).includes(type);

// Types are inferred from the Zod schemas (single source of truth).
export type CmsDevice = z.infer<typeof cmsDeviceSchema>;
export type HeroBannerBlock = z.infer<typeof heroBannerBlockSchema>;
export type FeatureBannerBlock = z.infer<typeof featureBannerBlockSchema>;
export type DeviceGridBlock = z.infer<typeof deviceGridBlockSchema>;
export type FooterBlock = z.infer<typeof footerBlockSchema>;
export type CmsBlock = z.infer<typeof cmsBlockSchema>;
export type CmsPage = z.infer<typeof cmsPageSchema>;
