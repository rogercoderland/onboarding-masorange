import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";

export interface TypeDeviceFields {
    name?: EntryFieldTypes.Symbol;
    slug?: EntryFieldTypes.Symbol;
    brand?: EntryFieldTypes.Symbol;
    price?: EntryFieldTypes.Number;
    badge?: EntryFieldTypes.Symbol;
    images?: EntryFieldTypes.Array<EntryFieldTypes.AssetLink>;
    specs?: EntryFieldTypes.Object;
    variants?: EntryFieldTypes.Object;
    description?: EntryFieldTypes.Text;
}

export type TypeDeviceSkeleton = EntrySkeletonType<TypeDeviceFields, "device">;
export type TypeDevice<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeDeviceSkeleton, Modifiers, Locales>;

export function isTypeDevice<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: unknown): entry is TypeDevice<Modifiers, Locales> {
    const candidate = entry as { sys?: { contentType?: { sys?: { id?: string } } } };
    return candidate.sys?.contentType?.sys?.id === 'device'
}

export type TypeDeviceWithoutLinkResolutionResponse = TypeDevice<"WITHOUT_LINK_RESOLUTION">;
export type TypeDeviceWithoutUnresolvableLinksResponse = TypeDevice<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeDeviceWithAllLocalesResponse<Locales extends LocaleCode = LocaleCode> = TypeDevice<"WITH_ALL_LOCALES", Locales>;
export type TypeDeviceWithAllLocalesAndWithoutLinkResolutionResponse<Locales extends LocaleCode = LocaleCode> = TypeDevice<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeDeviceWithAllLocalesAndWithoutUnresolvableLinksResponse<Locales extends LocaleCode = LocaleCode> = TypeDevice<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;
