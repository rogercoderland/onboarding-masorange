import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";

export interface TypeFeatureBannerFields {
    title?: EntryFieldTypes.Symbol;
    ctaLabel?: EntryFieldTypes.Symbol;
    ctaHref?: EntryFieldTypes.Symbol;
    description?: EntryFieldTypes.Text;
}

export type TypeFeatureBannerSkeleton = EntrySkeletonType<TypeFeatureBannerFields, "featureBanner">;
export type TypeFeatureBanner<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeFeatureBannerSkeleton, Modifiers, Locales>;

export function isTypeFeatureBanner<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: unknown): entry is TypeFeatureBanner<Modifiers, Locales> {
    const candidate = entry as { sys?: { contentType?: { sys?: { id?: string } } } };
    return candidate.sys?.contentType?.sys?.id === 'featureBanner'
}

export type TypeFeatureBannerWithoutLinkResolutionResponse = TypeFeatureBanner<"WITHOUT_LINK_RESOLUTION">;
export type TypeFeatureBannerWithoutUnresolvableLinksResponse = TypeFeatureBanner<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeFeatureBannerWithAllLocalesResponse<Locales extends LocaleCode = LocaleCode> = TypeFeatureBanner<"WITH_ALL_LOCALES", Locales>;
export type TypeFeatureBannerWithAllLocalesAndWithoutLinkResolutionResponse<Locales extends LocaleCode = LocaleCode> = TypeFeatureBanner<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeFeatureBannerWithAllLocalesAndWithoutUnresolvableLinksResponse<Locales extends LocaleCode = LocaleCode> = TypeFeatureBanner<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;
