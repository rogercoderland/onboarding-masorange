import type { CmsDevice, CmsPage } from '../models/cms-page.model';

/**
 * Driven port: the business view of the CMS. The app depends on this, not on
 * Contentful. `cms-infrastructure` implements it over the `contentful` client.
 */
export interface CmsRepository {
  getPageBySlug(slug: string): Promise<CmsPage | null>;
  getDevices(): Promise<CmsDevice[]>;
  getDeviceBySlug(slug: string): Promise<CmsDevice | null>;
}
