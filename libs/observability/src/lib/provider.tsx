'use client';

import { useEffect, useRef } from 'react';
import {
  getWebInstrumentations,
  initializeFaro,
  LogLevel,
} from '@grafana/faro-web-sdk';
import { createBeforeSend } from './before-send';
import {
  DEFAULT_ENVIRONMENT,
  DEFAULT_IGNORE_ERRORS,
  DEFAULT_VERSION,
  LOG_PREFIX,
} from './constants';
import type { ObservabilityProviderProps } from './types';

export function ObservabilityProvider({
  config,
  children,
}: ObservabilityProviderProps) {
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;

    if (!config.collectorUrl) {
      console.warn(
        `${LOG_PREFIX} No collector URL provided, skipping initialization. ` +
          'Set NEXT_PUBLIC_FARO_COLLECTOR_URL to enable frontend observability.',
      );
      return;
    }

    initializedRef.current = true;

    try {
      initializeFaro({
        url: config.collectorUrl,
        paused: config.enabled === false,
        app: {
          name: config.appName,
          version: config.version ?? DEFAULT_VERSION,
          environment: config.environment ?? DEFAULT_ENVIRONMENT,
        },
        instrumentations: getWebInstrumentations({
          captureConsole: true,
          captureConsoleDisabledLevels: [
            LogLevel.LOG,
            LogLevel.DEBUG,
            LogLevel.TRACE,
            LogLevel.INFO,
          ],
        }),
        beforeSend: createBeforeSend(
          config.ignoreErrors ?? DEFAULT_IGNORE_ERRORS,
        ),
      });
    } catch (error) {
      console.error(`${LOG_PREFIX} Failed to initialize Faro:`, error);
    }
  }, [
    config.collectorUrl,
    config.appName,
    config.version,
    config.environment,
    config.enabled,
    config.ignoreErrors,
  ]);

  return <>{children}</>;
}
