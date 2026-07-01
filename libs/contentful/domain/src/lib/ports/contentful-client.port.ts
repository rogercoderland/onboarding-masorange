import type {
  ContentfulCollection,
  ContentfulEntry,
} from '../models/contentful-entry.model.js';

export interface GetEntriesQuery {
  content_type: string;
  include?: number;
  limit?: number;
  skip?: number;
  order?: string;
  locale?: string;
  [param: string]: string | number | boolean | undefined;
}

export interface ContentfulClientPort {
  getEntries<TFields = Record<string, unknown>>(
    query: GetEntriesQuery,
  ): Promise<ContentfulCollection<TFields>>;

  getEntry<TFields = Record<string, unknown>>(
    id: string,
  ): Promise<ContentfulEntry<TFields>>;
}
