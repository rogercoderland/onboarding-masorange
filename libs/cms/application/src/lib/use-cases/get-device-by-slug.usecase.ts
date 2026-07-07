import type { CmsDevice, CmsRepository } from '@onboarding-nx/cms-domain';

export class GetDeviceBySlug {
  constructor(private readonly repository: CmsRepository) {}

  execute(slug: string): Promise<CmsDevice | null> {
    return this.repository.getDeviceBySlug(slug);
  }
}
