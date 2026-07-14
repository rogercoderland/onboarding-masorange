import {
  getContentfulConfigFromEnv,
  ContentfulHttpAdapter,
} from '@onboarding-nx/contentful-infrastructure';
import { ContentfulCmsRepository } from '@onboarding-nx/cms-infrastructure';
import {
  GetPageBySlug,
  GetDevices,
  GetDeviceBySlug,
} from '@onboarding-nx/cms-application';
import type { CmsRepository } from '@onboarding-nx/cms-domain';

let repository: CmsRepository | undefined;
function cms(): CmsRepository {
  return (repository ??= new ContentfulCmsRepository(
    new ContentfulHttpAdapter(getContentfulConfigFromEnv()),
  ));
}

export const getPage = (slug: string) => new GetPageBySlug(cms()).execute(slug);
export const getDevices = () => new GetDevices(cms()).execute();
export const getDevice = (slug: string) =>
  new GetDeviceBySlug(cms()).execute(slug);
