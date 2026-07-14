export type { CmsDevice as Device } from '@onboarding-nx/cms-domain';

export type CartLine = {
  slug: string;
  name: string;
  price: number;
  image: string;
  color: string;
  storage: string;
  sku: string;
  qty: number;
};
