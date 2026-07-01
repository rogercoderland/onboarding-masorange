import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";

export interface TypeHeroBannerFields {
    title?: EntryFieldTypes.Symbol;
    subtitle?: EntryFieldTypes.Symbol;
    ctaLabel?: EntryFieldTypes.Symbol;
    ctaHref?: EntryFieldTypes.Symbol;
    image?: EntryFieldTypes.AssetLink;
}

export type TypeHeroBannerSkeleton = EntrySkeletonType<TypeHeroBannerFields, "heroBanner">;
export type TypeHeroBanner<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeHeroBannerSkeleton, Modifiers, Locales>;

export function isTypeHeroBanner<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: unknown): entry is TypeHeroBanner<Modifiers, Locales> {
    const candidate = entry as { sys?: { contentType?: { sys?: { id?: string } } } };
    return candidate.sys?.contentType?.sys?.id === 'heroBanner'
}

export type TypeHeroBannerWithoutLinkResolutionResponse = TypeHeroBanner<"WITHOUT_LINK_RESOLUTION">;
export type TypeHeroBannerWithoutUnresolvableLinksResponse = TypeHeroBanner<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeHeroBannerWithAllLocalesResponse<Locales extends LocaleCode = LocaleCode> = TypeHeroBanner<"WITH_ALL_LOCALES", Locales>;
export type TypeHeroBannerWithAllLocalesAndWithoutLinkResolutionResponse<Locales extends LocaleCode = LocaleCode> = TypeHeroBanner<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeHeroBannerWithAllLocalesAndWithoutUnresolvableLinksResponse<Locales extends LocaleCode = LocaleCode> = TypeHeroBanner<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;
