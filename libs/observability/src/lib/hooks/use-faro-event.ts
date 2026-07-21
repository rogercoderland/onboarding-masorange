'use client';

import { useCallback, useMemo } from 'react';
import { faro, LogLevel } from '@grafana/faro-web-sdk';
import { LOG_PREFIX } from '../constants';
import type {
  EventAttributes,
  FaroEventType,
  FaroUser,
  PushErrorOptions,
} from '../types';

function isFaroReady(): boolean {
  return Boolean(faro?.api);
}

function warnNotReady(what: string): void {
  console.warn(`${LOG_PREFIX} Faro is not ready, dropping ${what}.`);
}

function toStringAttributes(
  attributes: EventAttributes = {},
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(attributes).map(([key, value]) => [key, String(value)]),
  );
}

export function useFaroEvent() {
  const pushError = useCallback(
    (error: Error, options?: PushErrorOptions): void => {
      if (!isFaroReady()) return warnNotReady('error');
      try {
        faro.api.pushError(error, {
          context: options?.context,
          type: options?.type,
          skipDedupe: true,
        });
      } catch (pushFailure) {
        console.error(`${LOG_PREFIX} Failed to push error:`, pushFailure);
      }
    },
    [],
  );

  const pushLog = useCallback(
    (messages: string[], level: LogLevel = LogLevel.INFO): void => {
      if (!isFaroReady()) return warnNotReady('log');
      try {
        faro.api.pushLog(messages, { level, skipDedupe: true });
      } catch (pushFailure) {
        console.error(`${LOG_PREFIX} Failed to push log:`, pushFailure);
      }
    },
    [],
  );

  const pushEvent = useCallback(
    (
      name: string,
      attributes?: EventAttributes,
      eventType?: FaroEventType,
    ): void => {
      if (!isFaroReady()) return warnNotReady('event');
      const eventAttributes = toStringAttributes(attributes);
      if (eventType) eventAttributes['event_type'] = eventType;
      try {
        // `skipDedupe` lives in the 4th argument; the 3rd one is `domain`.
        faro.api.pushEvent(name, eventAttributes, undefined, {
          skipDedupe: true,
        });
      } catch (pushFailure) {
        console.error(`${LOG_PREFIX} Failed to push event:`, pushFailure);
      }
    },
    [],
  );

  const setUser = useCallback((user: FaroUser | undefined): void => {
    if (!isFaroReady()) return warnNotReady('user context');
    try {
      if (user) {
        faro.api.setUser(user);
      } else {
        faro.api.resetUser();
      }
    } catch (pushFailure) {
      console.error(`${LOG_PREFIX} Failed to set user:`, pushFailure);
    }
  }, []);

  return useMemo(
    () => ({ pushError, pushLog, pushEvent, setUser, isFaroReady }),
    [pushError, pushLog, pushEvent, setUser],
  );
}
