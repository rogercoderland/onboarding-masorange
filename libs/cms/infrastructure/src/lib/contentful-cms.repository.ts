import type {
  CmsDevice,
  CmsPage,
  CmsRepository,
} from '@onboarding-nx/cms-domain';
import type { ContentfulClientPort } from '@onboarding-nx/contentful-domain';
import {
  allDevices,
  deviceBySlug,
  pageBySlug,
} from '@onboarding-nx/contentful-application';
import { createLinkResolver } from '@onboarding-nx/contentful-infrastructure';
import { mapDevice } from './mappers/device.mapper';
import { mapPage } from './mappers/page.mapper';

/**
 * Implements the CMS business port over the raw `contentful` client. Each call
 * fetches the entries (with linked includes), builds a `LinkResolver`, and maps
 * the envelope into the clean domain model. The app depends on `CmsRepository`,
 * not on this class nor on Contentful.
 */
export class ContentfulCmsRepository implements CmsRepository {
  constructor(private readonly client: ContentfulClientPort) {}

  async getPageBySlug(slug: string): Promise<CmsPage | null> {
    const collection = await this.client.getEntries(pageBySlug(slug));
    const resolver = createLinkResolver(collection.includes);
    return mapPage(collection, resolver);
  }

  async getDevices(): Promise<CmsDevice[]> {
    const collection = await this.client.getEntries(allDevices());
    const resolver = createLinkResolver(collection.includes);
    return collection.items
      .map((entry) => mapDevice(entry, resolver))
      .filter((device): device is CmsDevice => device !== null);
  }

  async getDeviceBySlug(slug: string): Promise<CmsDevice | null> {
    const collection = await this.client.getEntries(deviceBySlug(slug));
    const resolver = createLinkResolver(collection.includes);
    const entry = collection.items[0];
    return entry ? mapDevice(entry, resolver) : null;
  }
}
