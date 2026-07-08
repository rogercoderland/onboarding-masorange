import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cacheLife, cacheTag } from 'next/cache';
import { RenderBadge } from '@onboarding-nx/ui';
import { renderBlock } from '@onboarding-nx/cms-presentation';
import { getPage } from './lib/cms';
import { CacheTags } from './lib/cache-tags';
import styles from './home.module.css';

export async function generateMetadata(): Promise<Metadata> {
  'use cache';
  cacheLife('max');
  cacheTag(CacheTags.homeSections);
  const page = await getPage('home');
  return {
    title: page?.seo.title ?? page?.title,
    description: page?.seo.description,
  };
}

export default async function HomePage() {
  'use cache';
  cacheLife('max');
  cacheTag(CacheTags.homeSections);

  const page = await getPage('home');
  if (!page) notFound();

  const generatedAt = new Date().toISOString();
  const sections = page.sections.filter((block) => block.type !== 'footer');

  return (
    <div className={styles.page}>
      <RenderBadge
        type="static"
        renderedAt={generatedAt}
        strategy="use cache · cacheLife('max')"
      />

      {sections.map((block, index) => renderBlock(block, index))}
    </div>
  );
}
