import type { GetEntriesQuery } from '@onboarding-nx/contentful-domain';

/**
 * Small, framework-free helpers to build CDA queries. Keeping query shapes here
 * (application layer) means components/mappers never hand-roll Contentful query
 * params — they ask for "the page with this slug" and get a typed query.
 */

const DEFAULT_INCLUDE = 2;

export function entriesByType(
  contentType: string,
  overrides: Partial<GetEntriesQuery> = {},
): GetEntriesQuery {
  return { content_type: contentType, include: DEFAULT_INCLUDE, ...overrides };
}

export function entryBySlug(
  contentType: string,
  slug: string,
  overrides: Partial<GetEntriesQuery> = {},
): GetEntriesQuery {
  return {
    content_type: contentType,
    'fields.slug': slug,
    limit: 1,
    include: DEFAULT_INCLUDE,
    ...overrides,
  };
}
