import type {
  Device,
  FeatureBanner,
  Footer,
  HeroBanner,
  HomeSections,
} from './models';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

type Seed = {
  name: string;
  brand: string;
  price: number;
  badge?: string;
  display: string;
  ram: string;
  storage: string;
  description: string;
};

const SEEDS: Seed[] = [
  // Samsung
  {
    name: 'Galaxy S24 Ultra',
    brand: 'Samsung',
    price: 1329,
    badge: 'Novedad',
    display: '6.8"',
    ram: '12 GB',
    storage: '512 GB',
    description:
      'El tope de gama de Samsung con S Pen integrado, zoom óptico 5x y pantalla Dynamic AMOLED 2X.',
  },
  {
    name: 'Galaxy S24',
    brand: 'Samsung',
    price: 909,
    display: '6.2"',
    ram: '8 GB',
    storage: '256 GB',
    description:
      'Compacto y potente, con Galaxy AI y batería para todo el día.',
  },
  {
    name: 'Galaxy A55',
    brand: 'Samsung',
    price: 479,
    badge: 'Oferta',
    display: '6.6"',
    ram: '8 GB',
    storage: '256 GB',
    description:
      'Gama media premium con cuerpo metálico y pantalla Super AMOLED de 120 Hz.',
  },
  {
    name: 'Galaxy A25',
    brand: 'Samsung',
    price: 299,
    display: '6.5"',
    ram: '6 GB',
    storage: '128 GB',
    description: 'La opción asequible con gran autonomía y pantalla fluida.',
  },
  // Apple
  {
    name: 'iPhone 15 Pro Max',
    brand: 'Apple',
    price: 1469,
    badge: 'Novedad',
    display: '6.7"',
    ram: '8 GB',
    storage: '256 GB',
    description:
      'Chip A17 Pro, chasis de titanio y botón de acción personalizable.',
  },
  {
    name: 'iPhone 15',
    brand: 'Apple',
    price: 959,
    display: '6.1"',
    ram: '6 GB',
    storage: '128 GB',
    description:
      'Dynamic Island, cámara de 48 Mpx y USB-C en un diseño ligero.',
  },
  {
    name: 'iPhone 14',
    brand: 'Apple',
    price: 809,
    badge: 'Oferta',
    display: '6.1"',
    ram: '6 GB',
    storage: '128 GB',
    description: 'Un clásico fiable con excelente rendimiento y gran cámara.',
  },
  {
    name: 'iPhone SE',
    brand: 'Apple',
    price: 559,
    display: '4.7"',
    ram: '4 GB',
    storage: '64 GB',
    description: 'El iPhone más compacto y económico, con Touch ID y chip A15.',
  },
  // Xiaomi
  {
    name: 'Xiaomi 14 Pro',
    brand: 'Xiaomi',
    price: 999,
    badge: 'Novedad',
    display: '6.73"',
    ram: '12 GB',
    storage: '512 GB',
    description:
      'Óptica Leica, carga ultrarrápida de 120 W y pantalla LTPO de 120 Hz.',
  },
  {
    name: 'Xiaomi 14',
    brand: 'Xiaomi',
    price: 869,
    display: '6.36"',
    ram: '12 GB',
    storage: '256 GB',
    description:
      'Flagship compacto con triple cámara Leica y Snapdragon de última generación.',
  },
  {
    name: 'Redmi Note 13 Pro',
    brand: 'Xiaomi',
    price: 349,
    badge: 'Oferta',
    display: '6.67"',
    ram: '8 GB',
    storage: '256 GB',
    description: 'Cámara de 200 Mpx y pantalla AMOLED a un precio imbatible.',
  },
  {
    name: 'Redmi 13C',
    brand: 'Xiaomi',
    price: 159,
    display: '6.74"',
    ram: '4 GB',
    storage: '128 GB',
    description:
      'Lo esencial para el día a día con una gran batería de 5000 mAh.',
  },
  // Google
  {
    name: 'Pixel 8 Pro',
    brand: 'Google',
    price: 1099,
    badge: 'Novedad',
    display: '6.7"',
    ram: '12 GB',
    storage: '256 GB',
    description:
      'La mejor experiencia Android puro con funciones de IA y 7 años de actualizaciones.',
  },
  {
    name: 'Pixel 8',
    brand: 'Google',
    price: 799,
    display: '6.2"',
    ram: '8 GB',
    storage: '128 GB',
    description: 'Cámara excepcional gracias al chip Tensor G3 y Magic Editor.',
  },
  {
    name: 'Pixel 7a',
    brand: 'Google',
    price: 509,
    badge: 'Oferta',
    display: '6.1"',
    ram: '8 GB',
    storage: '128 GB',
    description:
      'La gama media de Google con la cámara de referencia de su categoría.',
  },
  // OnePlus
  {
    name: 'OnePlus 12',
    brand: 'OnePlus',
    price: 969,
    badge: 'Novedad',
    display: '6.82"',
    ram: '16 GB',
    storage: '512 GB',
    description:
      'Pantalla ProXDR, carga SuperVOOC de 100 W y rendimiento de buque insignia.',
  },
  {
    name: 'OnePlus 12R',
    brand: 'OnePlus',
    price: 649,
    display: '6.78"',
    ram: '12 GB',
    storage: '256 GB',
    description:
      'Fluidez extrema y gran batería con un precio muy competitivo.',
  },
  {
    name: 'OnePlus Nord 3',
    brand: 'OnePlus',
    price: 449,
    badge: 'Oferta',
    display: '6.74"',
    ram: '8 GB',
    storage: '128 GB',
    description: 'Gama media con pantalla de 120 Hz y carga rápida de 80 W.',
  },
  {
    name: 'OnePlus Nord CE 3',
    brand: 'OnePlus',
    price: 329,
    display: '6.7"',
    ram: '8 GB',
    storage: '128 GB',
    description:
      'Equilibrio entre precio y prestaciones con autonomía sobrada.',
  },
  {
    name: 'OnePlus Nord N30',
    brand: 'OnePlus',
    price: 279,
    display: '6.72"',
    ram: '8 GB',
    storage: '128 GB',
    description: 'Acceso a la marca con buena pantalla y carga de 50 W.',
  },
];

const BRAND_IMAGE: Record<string, string> = {
  Samsung: '/images/device-1.png',
  Apple: '/images/device-2.png',
  Xiaomi: '/images/device-3.png',
  Google: '/images/device-4.png',
  OnePlus: '/images/device-5.png',
};

const slugify = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const DEVICES: Device[] = SEEDS.map((seed) => {
  const slug = slugify(seed.name);
  return {
    slug,
    name: seed.name,
    brand: seed.brand,
    price: seed.price,
    badge: seed.badge,
    images: [BRAND_IMAGE[seed.brand] ?? '/images/device-1.png'],
    specs: [
      { label: 'Pantalla', value: seed.display },
      { label: 'RAM', value: seed.ram },
      { label: 'Almacenamiento', value: seed.storage },
    ],
    variants: [
      { color: 'Negro', storage: seed.storage, sku: `${slug}-blk` },
      { color: 'Blanco', storage: seed.storage, sku: `${slug}-wht` },
    ],
    description: seed.description,
  };
});

export async function getDevices() {
  await delay(1000); // Simulate network delay
  return {
    devices: DEVICES,
    generatedAt: new Date().toISOString(),
  };
}

export async function getDeviceBySlug(slug: string) {
  await delay(500); // Simulate network delay
  const device = DEVICES.find((d) => d.slug === slug) ?? null;
  return {
    device,
    generatedAt: new Date().toISOString(),
  };
}

/**
 * Slugs prebuilt at build time. These are SSG and the rest will be on demand.
 */
export function getFeaturedSlugs(): string[] {
  return DEVICES.slice(0, 6).map((d) => d.slug);
}

export async function searchDevices(query: string) {
  await delay(400); // Simulate per-request network work.
  const q = query.trim().toLowerCase();
  // Empty query → show the full catalog (the default / "cleared" state).
  const results = q
    ? DEVICES.filter(
        (d) =>
          d.name.toLowerCase().includes(q) || d.brand.toLowerCase().includes(q),
      )
    : DEVICES;
  return {
    query: q,
    results,
    generatedAt: new Date().toISOString(),
  };
}

// --- Marketing / layout content (mocked) -------------------------
const HERO: HeroBanner = {
  title: 'El móvil que quieres, al precio Yoigo',
  subtitle:
    'Descubre nuestra selección de dispositivos con financiación sin intereses.',
  ctaLabel: 'Ver catálogo',
  ctaHref: '/dispositivos',
  image: '/images/hero.png',
};

const FEATURE: FeatureBanner = {
  title: 'Cambia de móvil sin complicaciones',
  description:
    'Entrega tu antiguo dispositivo y ahorra en el nuevo. Recogida gratuita a domicilio.',
  ctaLabel: 'Saber más',
  ctaHref: '/dispositivos',
};

const FOOTER: Footer = {
  columns: [
    {
      heading: 'Tienda',
      links: [
        { label: 'Dispositivos', href: '/dispositivos' },
        { label: 'Ofertas', href: '/dispositivos' },
        { label: 'Carrito', href: '/carrito' },
      ],
    },
    {
      heading: 'Ayuda',
      links: [
        { label: 'Contacto', href: '/' },
        { label: 'Envíos', href: '/' },
        { label: 'Devoluciones', href: '/' },
      ],
    },
    {
      heading: 'Legal',
      links: [
        { label: 'Privacidad', href: '/' },
        { label: 'Cookies', href: '/' },
        { label: 'Términos', href: '/' },
      ],
    },
  ],
  legal: '© 2026 Tienda de dispositivos — Onboarding Digital squad.',
};

export async function getHomeSections(): Promise<{
  sections: HomeSections;
  generatedAt: string;
}> {
  await delay(800);
  return {
    sections: {
      hero: HERO,
      featured: DEVICES.slice(0, 6),
      feature: FEATURE,
      footer: FOOTER,
    },
    generatedAt: new Date().toISOString(),
  };
}

export async function getFooter(): Promise<{
  footer: Footer;
  generatedAt: string;
}> {
  await delay(300);
  return {
    footer: FOOTER,
    generatedAt: new Date().toISOString(),
  };
}
