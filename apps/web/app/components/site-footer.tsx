import { cacheLife, cacheTag } from 'next/cache';
import { getFooter } from '../lib/mock-api';
import { CacheTags } from '../lib/cache-tags';
import { Footer } from './footer';

export async function SiteFooter() {
  'use cache';
  cacheLife('max');
  cacheTag(CacheTags.homeSections);

  const { footer } = await getFooter();
  return <Footer data={footer} />;
}
