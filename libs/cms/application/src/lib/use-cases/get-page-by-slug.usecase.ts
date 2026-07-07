import type { CmsPage, CmsRepository } from '@onboarding-nx/cms-domain';

/**
 * ponytail: thin passthrough over the port. It exists to materialise the
 * application layer of the hexagon (the point of the onboarding). Add
 * cross-cutting logic (fallback locale, draft mode, tracing) here if it ever
 * grows beyond a delegation.
 */
export class GetPageBySlug {
  constructor(private readonly repository: CmsRepository) {}

  execute(slug: string): Promise<CmsPage | null> {
    return this.repository.getPageBySlug(slug);
  }
}
