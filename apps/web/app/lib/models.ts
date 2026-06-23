export type Device = {
  slug: string;
  name: string;
  brand: string;
  price: number;
  badge?: string;
  images: string[];
  specs: {
    label: string;
    value: string;
  }[];
  variants: {
    color: string;
    storage: string;
    sku: string;
  }[];
  description: string;
};
