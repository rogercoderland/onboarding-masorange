/**
 * Typed error hierarchy for the Contentful client — mirrors the real repo's
 * `errors.ts`. Rich, specific errors make failures debuggable at the boundary
 * instead of surfacing as generic `TypeError: fetch failed` deep in a page.
 */

export class ContentfulError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = 'ContentfulError';
  }
}

/** Non-2xx HTTP response from the Contentful API. */
export class ContentfulApiError extends ContentfulError {
  constructor(
    message: string,
    readonly statusCode?: number,
    options?: { cause?: unknown },
  ) {
    super(message, options);
    this.name = 'ContentfulApiError';
  }
}

/** Response did not match the expected Zod schema. */
export class ContentfulValidationError extends ContentfulError {
  constructor(
    message: string,
    readonly issues: string[] = [],
    options?: { cause?: unknown },
  ) {
    super(message, options);
    this.name = 'ContentfulValidationError';
  }
}

/** Missing or invalid configuration (env vars). */
export class ContentfulConfigError extends ContentfulError {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = 'ContentfulConfigError';
  }
}
