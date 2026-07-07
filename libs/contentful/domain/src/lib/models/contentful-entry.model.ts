export interface ContentfulLinkSys {
  type: 'Link';
  linkType: 'Entry' | 'Asset';
  id: string;
}

export interface ContentfulLink {
  sys: ContentfulLinkSys;
}

export interface ContentfulEntrySys {
  id: string;
  type: string;
  createdAt?: string;
  updatedAt?: string;
  revision?: number;
  contentType?: {
    sys: { id: string; type: 'Link'; linkType: 'ContentType' };
  };
}

export interface ContentfulEntry<TFields = Record<string, unknown>> {
  sys: ContentfulEntrySys;
  fields: TFields;
}

export interface ContentfulAssetFields {
  title?: string;
  description?: string;
  file?: {
    url: string;
    fileName?: string;
    contentType?: string;
    details?: {
      size?: number;
      image?: { width: number; height: number };
    };
  };
}

export interface ContentfulAsset {
  sys: ContentfulEntrySys;
  fields: ContentfulAssetFields;
}

export interface ContentfulIncludes {
  Entry?: ContentfulEntry[];
  Asset?: ContentfulAsset[];
}

export interface ContentfulCollection<TFields = Record<string, unknown>> {
  sys?: { type: 'Array' };
  total: number;
  skip: number;
  limit: number;
  items: ContentfulEntry<TFields>[];
  includes?: ContentfulIncludes;
}
