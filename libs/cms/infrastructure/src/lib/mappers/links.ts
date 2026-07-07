import type { ContentfulLink } from '@onboarding-nx/contentful-domain';
import type { LinkResolver } from '@onboarding-nx/contentful-infrastructure';

/** Runtime guard for a Contentful link object `{ sys: { id, linkType } }`. */
export function isContentfulLink(value: unknown): value is ContentfulLink {
  return (
    !!value &&
    typeof value === 'object' &&
    'sys' in value &&
    typeof (value as { sys?: { id?: unknown } }).sys?.id === 'string'
  );
}

/**
 * Resolve an asset link to an absolute URL. The CDA returns protocol-relative
 * URLs (`//images.ctfassets.net/...`), so we prefix `https:`.
 */
export function resolveAssetUrl(
  value: unknown,
  resolver: LinkResolver,
): string | undefined {
  if (!isContentfulLink(value)) return undefined;
  const url = resolver.asset(value.sys.id)?.fields.file?.url;
  return url ? `https:${url}` : undefined;
}
