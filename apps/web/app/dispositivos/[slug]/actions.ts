'use server';

import { revalidateTag } from 'next/cache';
import { CacheTags } from '../../lib/cache-tags';

/**
 * Server action — on-demand revalidation of a single device.
 *
 * Mirrors the production contact-form action (`'use server'`, stamps an ISO
 * timestamp). It reads the slug from the submitted form (progressive enhancement)
 * and validates it server-side before invalidating the cache. Calling
 * `revalidateTag('device:<slug>')` purges *only* this device's entry, so reloading
 * the PDP shows a fresh `generatedAt` while every other device stays frozen — the
 * visual proof of tag-scoped caching.
 */
export async function refreshDevice(formData: FormData) {
  const slug = String(formData.get('slug') ?? '').trim();
  // Server-side validation: ignore malformed submissions.
  if (!slug) return;

  console.log('Server action - device refreshed:', {
    slug,
    timestamp: new Date().toISOString(),
  });

  // Simulate server-side work (e.g. re-pricing) before invalidating the cache.
  await new Promise((resolve) => setTimeout(resolve, 600));

  // Second arg is the cache-life profile applied on revalidation (production
  // uses `'max'` here too) — the entry is rebuilt and then frozen again.
  revalidateTag(CacheTags.device(slug), 'max');
}
