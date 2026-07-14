import { cacheLife, cacheTag } from 'next/cache';
import { Footer } from '@onboarding-nx/cms-presentation';
import { getPage } from '../lib/cms';
import { CacheTags } from '../lib/cache-tags';

export async function SiteFooter() {
  'use cache';
  cacheLife('max');
  cacheTag(CacheTags.homeSections);

  const page = await getPage('home');
  const footer = page?.sections.find((block) => block.type === 'footer');
  if (!footer) return null;

  return <Footer block={footer} />;
}
