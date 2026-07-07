import { ContentfulConfigError } from './errors.js';

export const CONTENTFUL_API = {
  DELIVERY_URL: 'https://cdn.contentful.com',
  PREVIEW_URL: 'https://preview.contentful.com',
  DEFAULT_ENVIRONMENT: 'master',
} as const;

export interface ContentfulConfig {
  spaceId: string;
  environment: string;
  /** Content Delivery API token (published content). */
  deliveryToken: string;
  /** Content Preview API token (draft content) — optional. */
  previewToken?: string;
  /** When true, read from the Preview API using `previewToken`. */
  preview?: boolean;
}

type EnvLike = Record<string, string | undefined>;

/**
 * Builds the config from the env var names already present in `.env.local`:
 * `CONTENTFUL_SPACE_ID`, `CONTENTFUL_ENVIRONMENT`, `CONTENT_DELIVERY_API_KEY`,
 * `CONTENT_PREVIEW_API_KEY`. Fails loudly if a required value is missing —
 * never silently defaults a secret.
 */
export function getContentfulConfigFromEnv(
  env: EnvLike = process.env,
  options: { preview?: boolean } = {},
): ContentfulConfig {
  const spaceId = env.CONTENTFUL_SPACE_ID?.trim();
  const deliveryToken = env.CONTENT_DELIVERY_API_KEY?.trim();
  const previewToken = env.CONTENT_PREVIEW_API_KEY?.trim();
  const environment =
    env.CONTENTFUL_ENVIRONMENT?.trim() || CONTENTFUL_API.DEFAULT_ENVIRONMENT;

  if (!spaceId) {
    throw new ContentfulConfigError('Missing env var CONTENTFUL_SPACE_ID');
  }
  if (!deliveryToken) {
    throw new ContentfulConfigError('Missing env var CONTENT_DELIVERY_API_KEY');
  }
  if (options.preview && !previewToken) {
    throw new ContentfulConfigError(
      'Preview mode requested but CONTENT_PREVIEW_API_KEY is missing',
    );
  }

  return {
    spaceId,
    environment,
    deliveryToken,
    previewToken,
    preview: options.preview ?? false,
  };
}
