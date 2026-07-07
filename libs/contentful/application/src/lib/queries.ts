import type {
  GetEntriesQuery,
  ResolveFields,
  TypeDeviceFields,
  TypeDeviceGridFields,
  TypeFeatureBannerFields,
  TypeFooterFields,
  TypeHeroBannerFields,
  TypePageFields,
} from '@onboarding-nx/contentful-domain';
import { entriesByType, entryBySlug } from './query-builder.js';

/**
 * Plain field shapes for each content type, derived from the codegen'd types.
 * These are what `getEntries` returns in `.fields`, so mappers/components read
 * `.fields.title` (string) instead of the SDK's abstract descriptors.
 */
export type PageFields = ResolveFields<TypePageFields>;
export type DeviceFields = ResolveFields<TypeDeviceFields>;
export type HeroBannerFields = ResolveFields<TypeHeroBannerFields>;
export type FeatureBannerFields = ResolveFields<TypeFeatureBannerFields>;
export type DeviceGridFields = ResolveFields<TypeDeviceGridFields>;
export type FooterFields = ResolveFields<TypeFooterFields>;

/**
 * Typed query helpers: the content-type id and its field type travel together,
 * so `client.getEntries(pageBySlug('home'))` infers `ContentfulEntry<PageFields>`
 * with no call-site generic. The cast attaches the phantom field type; the
 * runtime query is unchanged.
 */
export const pageBySlug = (slug: string) =>
  entryBySlug<PageFields>('page', slug);

export const allDevices = (overrides?: Partial<GetEntriesQuery>) =>
  entriesByType<DeviceFields>('device', overrides);

export const deviceBySlug = (slug: string) =>
  entryBySlug<DeviceFields>('device', slug);
