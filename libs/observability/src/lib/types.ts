import type { ReactNode } from 'react';

export interface ObservabilityConfig {
  collectorUrl: string;
  appName: string;
  environment?: string;
  version?: string;
  enabled?: boolean;
  ignoreErrors?: RegExp[];
}

export interface ObservabilityProviderProps {
  config: ObservabilityConfig;
  children: ReactNode;
}

export interface FaroUser {
  id?: string;
  email?: string;
  username?: string;
}

export type FaroEventType = 'click' | 'navigation' | 'custom' | 'form' | 'api';

export type EventAttributes = Record<string, string | number | boolean>;

export interface PushErrorOptions {
  context?: Record<string, string>;
  type?: string;
}
