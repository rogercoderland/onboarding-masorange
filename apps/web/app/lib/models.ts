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

/** Top promotional banner on the Home screen. */
export type HeroBanner = {
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  image: string;
};

/** Secondary marketing strip below the device grid. */
export type FeatureBanner = {
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
};

/** Site footer model. */
export type Footer = {
  columns: {
    heading: string;
    links: { label: string; href: string }[];
  }[];
  legal: string;
};

export type HomeSections = {
  hero: HeroBanner;
  featured: Device[];
  feature: FeatureBanner;
  footer: Footer;
};

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
