import {
  contentfulCollectionSchema,
  contentfulEntrySchema,
  type ContentfulClientPort,
  type ContentfulCollection,
  type ContentfulEntry,
  type GetEntriesQuery,
} from '@onboarding-nx/contentful-domain';
import { CONTENTFUL_API, type ContentfulConfig } from './config.js';
import { ContentfulApiError, ContentfulValidationError } from './errors.js';

/**
 * Driven adapter that implements `ContentfulClientPort` over the Content
 * Delivery API using the native `fetch` — no `contentful` SDK at runtime,
 * exactly like the real digital repo's `CmsFetcherAdapter`.
 *
 * Every response is validated with Zod before it leaves the adapter, so callers
 * receive data that already matches the domain envelope or a typed error.
 */
export class ContentfulHttpAdapter implements ContentfulClientPort {
  private readonly baseUrl: string;
  private readonly headers: Record<string, string>;

  constructor(config: ContentfulConfig) {
    const host = config.preview
      ? CONTENTFUL_API.PREVIEW_URL
      : CONTENTFUL_API.DELIVERY_URL;
    this.baseUrl = `${host}/spaces/${config.spaceId}/environments/${config.environment}`;

    const token =
      config.preview && config.previewToken
        ? config.previewToken
        : config.deliveryToken;
    this.headers = { Authorization: `Bearer ${token}` };
  }

  async getEntries<TFields = Record<string, unknown>>(
    query: GetEntriesQuery,
  ): Promise<ContentfulCollection<TFields>> {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined) params.set(key, String(value));
    }

    const raw = await this.request(`/entries?${params.toString()}`);
    const parsed = contentfulCollectionSchema.safeParse(raw);
    if (!parsed.success) {
      throw new ContentfulValidationError(
        `Invalid CDA collection for content_type "${query.content_type}"`,
        formatIssues(parsed.error),
      );
    }
    return parsed.data as unknown as ContentfulCollection<TFields>;
  }

  async getEntry<TFields = Record<string, unknown>>(
    id: string,
  ): Promise<ContentfulEntry<TFields>> {
    const raw = await this.request(`/entries/${id}`);
    const parsed = contentfulEntrySchema.safeParse(raw);
    if (!parsed.success) {
      throw new ContentfulValidationError(
        `Invalid CDA entry "${id}"`,
        formatIssues(parsed.error),
      );
    }
    return parsed.data as unknown as ContentfulEntry<TFields>;
  }

  private async request(path: string): Promise<unknown> {
    let response: Response;
    try {
      response = await fetch(`${this.baseUrl}${path}`, {
        headers: this.headers,
      });
    } catch (cause) {
      throw new ContentfulApiError(`Network error calling Contentful`, undefined, {
        cause,
      });
    }

    if (!response.ok) {
      throw new ContentfulApiError(
        `Contentful responded ${response.status} ${response.statusText}`,
        response.status,
      );
    }

    return response.json();
  }
}

function formatIssues(error: { issues: { path: PropertyKey[]; message: string }[] }): string[] {
  return error.issues.map(
    (issue) => `${issue.path.join('.') || '(root)'}: ${issue.message}`,
  );
}
