import type { Device } from './models';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const DEVICES: Device[] = Array.from({ length: 20 }, (_, i) => ({
  slug: `device-${i + 1}`,
  name: `Device ${i + 1}`,
  brand: `Brand ${(i % 5) + 1}`,
  price: 199 + ((i * 50) % 800),
  badge: i % 2 === 0 ? 'New' : 'Sale',
  images: [`/images/device-${(i % 5) + 1}.png`],
  specs: [
    { label: 'Display', value: `${4 + (i % 3)} inches` },
    { label: 'RAM', value: `${4 + (i % 4) * 2} GB` },
    { label: 'Storage', value: `${64 * (1 + (i % 4))} GB` },
  ],
  variants: [
    { color: 'Black', storage: '128GB', sku: `SKU${i + 1}-BLK-128` },
    { color: 'White', storage: '256GB', sku: `SKU${i + 1}-WHT-256` },
  ],
  description: `This is a description for Device ${i + 1}. It has great features and specifications.`,
}));

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
