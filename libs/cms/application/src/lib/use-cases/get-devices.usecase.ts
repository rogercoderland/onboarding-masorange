import type { CmsDevice, CmsRepository } from '@onboarding-nx/cms-domain';

export class GetDevices {
  constructor(private readonly repository: CmsRepository) {}

  execute(): Promise<CmsDevice[]> {
    return this.repository.getDevices();
  }
}
