import type {
  ContentfulCollection,
  ContentfulEntry,
} from '../models/contentful-entry.model';

declare const FIELDS: unique symbol;

export interface GetEntriesQuery<TFields = Record<string, unknown>> {
  content_type: string;
  include?: number;
  limit?: number;
  skip?: number;
  order?: string;
  locale?: string;
  readonly [FIELDS]?: TFields;
  [param: string]: string | number | boolean | undefined;
}

export interface ContentfulClientPort {
  getEntries<TFields = Record<string, unknown>>(
    query: GetEntriesQuery<TFields>,
  ): Promise<ContentfulCollection<TFields>>;

  getEntry<TFields = Record<string, unknown>>(
    id: string,
  ): Promise<ContentfulEntry<TFields>>;
}
