export { LogLevel } from '@grafana/faro-web-sdk';

export { ObservabilityProvider } from './lib/provider';
export { createBeforeSend } from './lib/before-send';
export { useFaroEvent } from './lib/hooks/use-faro-event';
export { FaroErrorBoundary } from './lib/components/faro-error-boundary';
export { ReactErrorBoundary } from './lib/components/react-error-boundary';

export {
  DEFAULT_IGNORE_ERRORS,
  DEFAULT_ENVIRONMENT,
  DEFAULT_VERSION,
  LOG_PREFIX,
} from './lib/constants';

export type {
  EventAttributes,
  FaroEventType,
  FaroUser,
  ObservabilityConfig,
  ObservabilityProviderProps,
  PushErrorOptions,
} from './lib/types';
export type { FaroErrorBoundaryProps } from './lib/components/faro-error-boundary';
export type { ReactErrorBoundaryProps } from './lib/components/react-error-boundary';
