import type { CmsDevice, CmsPage, CmsRepository } from '@onboarding-nx/cms-domain';
import { GetPageBySlug } from './get-page-by-slug.usecase.js';
import { GetDevices } from './get-devices.usecase.js';
import { GetDeviceBySlug } from './get-device-by-slug.usecase.js';

const device: CmsDevice = {
  slug: 'x',
  name: 'X',
  brand: 'B',
  price: 1,
  images: [],
  specs: [],
  variants: [],
  description: 'd',
};

const page: CmsPage = { title: 'Home', slug: 'home', seo: {}, sections: [] };

const repo: CmsRepository = {
  getPageBySlug: vi.fn(async (slug) => (slug === 'home' ? page : null)),
  getDevices: vi.fn(async () => [device]),
  getDeviceBySlug: vi.fn(async (slug) => (slug === 'x' ? device : null)),
};

describe('cms use cases', () => {
  it('GetPageBySlug delegates to the repository', async () => {
    await expect(new GetPageBySlug(repo).execute('home')).resolves.toBe(page);
    expect(repo.getPageBySlug).toHaveBeenCalledWith('home');
  });

  it('GetDevices delegates to the repository', async () => {
    await expect(new GetDevices(repo).execute()).resolves.toEqual([device]);
  });

  it('GetDeviceBySlug returns null when missing', async () => {
    await expect(new GetDeviceBySlug(repo).execute('nope')).resolves.toBeNull();
  });
});
