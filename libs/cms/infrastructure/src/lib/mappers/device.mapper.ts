import { cmsDeviceSchema, type CmsDevice } from '@onboarding-nx/cms-domain';
import type { ContentfulEntry } from '@onboarding-nx/contentful-domain';
import type { LinkResolver } from '@onboarding-nx/contentful-infrastructure';
import { isContentfulLink, resolveAssetUrl } from './links';

/**
 * Raw `device` entry → clean `CmsDevice`. Resolves the `images` asset links to
 * absolute URLs; `specs`/`variants` are JSON fields that come back as-is. The
 * assembled object is Zod-validated: a malformed entry yields `null` (dropped)
 * rather than crashing the whole page.
 */
export function mapDevice(
  entry: ContentfulEntry,
  resolver: LinkResolver,
): CmsDevice | null {
  const fields = entry.fields;

  const images = (Array.isArray(fields.images) ? fields.images : [])
    .filter(isContentfulLink)
    .map((link) => resolveAssetUrl(link, resolver))
    .filter((url): url is string => !!url);

  const candidate = {
    slug: fields.slug,
    name: fields.name,
    brand: fields.brand,
    price: fields.price,
    badge: fields.badge,
    images,
    specs: fields.specs ?? [],
    variants: fields.variants ?? [],
    description: fields.description ?? '',
  };

  const result = cmsDeviceSchema.safeParse(candidate);
  if (!result.success) {
    console.warn('[cms] dropping invalid device entry', entry.sys.id);
    return null;
  }
  return result.data;
}
