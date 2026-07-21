export const LOG_PREFIX = '[Observability]';

export const DEFAULT_ENVIRONMENT = 'development';

export const DEFAULT_VERSION = '0.0.1';

export const DEFAULT_IGNORE_ERRORS: RegExp[] = [
  /ResizeObserver loop/,
  /Non-Error promise rejection captured/,
];

export const COLLECTOR_URL_MARKER = 'faro-collector';
