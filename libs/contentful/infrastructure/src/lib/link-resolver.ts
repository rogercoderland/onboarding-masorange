import type {
  ContentfulAsset,
  ContentfulEntry,
  ContentfulIncludes,
  ContentfulLink,
} from '@onboarding-nx/contentful-domain';

/**
 * The CDA returns linked entries/assets side-band under `includes` when you
 * pass `include=N`. This helper indexes them by id so mappers can turn a
 * `{ sys: { linkType, id } }` link into the real entry/asset.
 *
 * Resolving links is THE fiddly part of Contentful; isolating it here keeps the
 * mappers (cms lib, next chunk) clean.
 */
export interface LinkResolver {
  entry(id: string): ContentfulEntry | undefined;
  asset(id: string): ContentfulAsset | undefined;
  resolve(link: ContentfulLink): ContentfulEntry | ContentfulAsset | undefined;
}

export function createLinkResolver(includes?: ContentfulIncludes): LinkResolver {
  const entries = new Map<string, ContentfulEntry>(
    (includes?.Entry ?? []).map((entry) => [entry.sys.id, entry]),
  );
  const assets = new Map<string, ContentfulAsset>(
    (includes?.Asset ?? []).map((asset) => [asset.sys.id, asset]),
  );

  return {
    entry: (id) => entries.get(id),
    asset: (id) => assets.get(id),
    resolve: (link) =>
      link.sys.linkType === 'Asset'
        ? assets.get(link.sys.id)
        : entries.get(link.sys.id),
  };
}
