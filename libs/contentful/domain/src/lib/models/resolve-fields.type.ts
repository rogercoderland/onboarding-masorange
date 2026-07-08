import type { ContentfulLink } from './contentful-entry.model';

/**
 * Bridge from the codegen'd Contentful field descriptors to the plain values
 * our native-fetch envelope actually returns.
 */
type ResolveField<T> = T extends { type: 'Symbol' | 'Text'; values: infer V }
  ? V
  : T extends { type: 'Integer' | 'Number'; values: infer V }
    ? V
    : T extends { type: 'Boolean' }
      ? boolean
      : T extends { type: 'Object'; data: infer D }
        ? D
        : T extends { type: 'AssetLink' | 'EntryLink' }
          ? ContentfulLink
          : T extends { type: 'Array'; item: infer I }
            ? ResolveField<I>[]
            : unknown;

export type ResolveFields<TFields> = {
  [K in keyof TFields]: ResolveField<NonNullable<TFields[K]>>;
};
