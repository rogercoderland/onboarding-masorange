import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";
import type { TypeDeviceSkeleton } from "./TypeDevice";

export interface TypeDeviceGridFields {
    title?: EntryFieldTypes.Symbol;
    devices?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeDeviceSkeleton>>;
}

export type TypeDeviceGridSkeleton = EntrySkeletonType<TypeDeviceGridFields, "deviceGrid">;
export type TypeDeviceGrid<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeDeviceGridSkeleton, Modifiers, Locales>;

export function isTypeDeviceGrid<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: unknown): entry is TypeDeviceGrid<Modifiers, Locales> {
    const candidate = entry as { sys?: { contentType?: { sys?: { id?: string } } } };
    return candidate.sys?.contentType?.sys?.id === 'deviceGrid'
}

export type TypeDeviceGridWithoutLinkResolutionResponse = TypeDeviceGrid<"WITHOUT_LINK_RESOLUTION">;
export type TypeDeviceGridWithoutUnresolvableLinksResponse = TypeDeviceGrid<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeDeviceGridWithAllLocalesResponse<Locales extends LocaleCode = LocaleCode> = TypeDeviceGrid<"WITH_ALL_LOCALES", Locales>;
export type TypeDeviceGridWithAllLocalesAndWithoutLinkResolutionResponse<Locales extends LocaleCode = LocaleCode> = TypeDeviceGrid<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeDeviceGridWithAllLocalesAndWithoutUnresolvableLinksResponse<Locales extends LocaleCode = LocaleCode> = TypeDeviceGrid<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;
