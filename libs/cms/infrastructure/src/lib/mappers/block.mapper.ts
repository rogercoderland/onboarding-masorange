import {
  CMS_BLOCK_SCHEMAS,
  isCmsBlockType,
  type CmsBlock,
  type CmsDevice,
} from '@onboarding-nx/cms-domain';
import type { ContentfulEntry } from '@onboarding-nx/contentful-domain';
import type { LinkResolver } from '@onboarding-nx/contentful-infrastructure';
import { mapDevice } from './device.mapper.js';
import { isContentfulLink, resolveAssetUrl } from './links.js';

/** Resolve an array of entry links to their mapped devices, dropping misses. */
function resolveDevices(
  value: unknown,
  resolver: LinkResolver,
): CmsDevice[] {
  return (Array.isArray(value) ? value : [])
    .filter(isContentfulLink)
    .map((link) => resolver.entry(link.sys.id))
    .filter((entry): entry is ContentfulEntry => !!entry)
    .map((entry) => mapDevice(entry, resolver))
    .filter((device): device is CmsDevice => device !== null);
}

/**
 * Raw block entry → discriminated `CmsBlock`, keyed by the Contentful
 * content-type id. Unknown types are skipped with a warning (like the real
 * digital registry) so publishing a new content type never breaks a live page.
 * Each block is Zod-validated per type; an invalid one is dropped.
 */
export function mapBlock(
  entry: ContentfulEntry,
  resolver: LinkResolver,
): CmsBlock | null {
  const type = entry.sys.contentType?.sys.id;
  if (!type || !isCmsBlockType(type)) {
    console.warn('[cms] skipping unsupported block type', type, entry.sys.id);
    return null;
  }

  const fields = entry.fields;
  let candidate: unknown;
  switch (type) {
    case 'heroBanner':
      candidate = {
        type,
        title: fields.title,
        subtitle: fields.subtitle,
        ctaLabel: fields.ctaLabel,
        ctaHref: fields.ctaHref,
        image: resolveAssetUrl(fields.image, resolver),
      };
      break;
    case 'featureBanner':
      candidate = {
        type,
        title: fields.title,
        description: fields.description,
        ctaLabel: fields.ctaLabel,
        ctaHref: fields.ctaHref,
      };
      break;
    case 'deviceGrid':
      candidate = {
        type,
        title: fields.title,
        devices: resolveDevices(fields.devices, resolver),
      };
      break;
    case 'footer':
      candidate = {
        type,
        columns: fields.columns ?? [],
        legal: fields.legal,
      };
      break;
  }

  const result = CMS_BLOCK_SCHEMAS[type].safeParse(candidate);
  if (!result.success) {
    console.warn('[cms] dropping invalid block', type, entry.sys.id);
    return null;
  }
  return result.data;
}
