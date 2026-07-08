import { cmsPageSchema, type CmsPage } from '@onboarding-nx/cms-domain';
import type {
  ContentfulCollection,
  ContentfulEntry,
} from '@onboarding-nx/contentful-domain';
import type { LinkResolver } from '@onboarding-nx/contentful-infrastructure';
import { mapBlock } from './block.mapper';
import { isContentfulLink } from './links';

/**
 * Raw `page` collection (+ its resolved `includes`) → clean `CmsPage`. The
 * page's `sections` are entry links → resolved and mapped through the block
 * registry; unknown/invalid blocks are dropped. Returns `null` if there's no
 * page or the assembled page fails validation.
 */
export function mapPage(
  collection: ContentfulCollection,
  resolver: LinkResolver,
): CmsPage | null {
  const page = collection.items[0];
  if (!page) return null;

  const fields = page.fields;
  const sections = (Array.isArray(fields.sections) ? fields.sections : [])
    .filter(isContentfulLink)
    .map((link) => resolver.entry(link.sys.id))
    .filter((entry): entry is ContentfulEntry => !!entry)
    .map((entry) => mapBlock(entry, resolver))
    .filter((block) => block !== null);

  const candidate = {
    title: fields.title,
    slug: fields.slug,
    seo: { title: fields.seoTitle, description: fields.seoDescription },
    sections,
  };

  const result = cmsPageSchema.safeParse(candidate);
  if (!result.success) {
    console.warn('[cms] invalid page', fields.slug);
    return null;
  }
  return result.data;
}
