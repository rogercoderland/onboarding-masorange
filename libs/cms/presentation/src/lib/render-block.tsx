import type { FC, ReactNode } from 'react';
import type { CmsBlock, CmsBlockType } from '@onboarding-nx/cms-domain';
import { HeroBanner } from './blocks/hero-banner/hero-banner';
import { FeatureBanner } from './blocks/feature-banner/feature-banner';
import { DeviceGrid } from './blocks/device-grid/device-grid';
import { Footer } from './blocks/footer/footer';

/**
 * The block registry: maps each Contentful content-type id to the component that
 * renders it. This is the heart of "components rendered under Contentful" — a
 * page is data (`sections: CmsBlock[]`), and `renderBlock` turns each block into
 * UI without the page knowing which components exist.
 *
 * `satisfies { [K in CmsBlockType]: FC<{ block: Extract<CmsBlock, { type: K }> }> }`
 * enforces two things at compile time: every block type has an entry
 * (exhaustiveness), and each component receives exactly its own block variant.
 * Adding a block type to the domain union makes this line fail until you add its
 * component here.
 */
const BLOCK_REGISTRY = {
  heroBanner: HeroBanner,
  featureBanner: FeatureBanner,
  deviceGrid: DeviceGrid,
  footer: Footer,
} satisfies { [K in CmsBlockType]: FC<{ block: Extract<CmsBlock, { type: K }> }> };

/**
 * Render one block via the registry. Unknown types return `null` (rather than
 * throwing) so publishing a not-yet-supported content type never breaks a live
 * page. Pass the list index (e.g. `sections.map(renderBlock)`) for a stable key.
 */
export function renderBlock(block: CmsBlock, index = 0): ReactNode {
  const Component = BLOCK_REGISTRY[block.type] as
    | FC<{ block: CmsBlock }>
    | undefined;
  return Component ? (
    <Component key={`${block.type}-${index}`} block={block} />
  ) : null;
}
