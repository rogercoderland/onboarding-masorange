'use client';

import { useCallback } from 'react';
import { useFaroEvent } from '../hooks/use-faro-event';
import { LOG_PREFIX } from '../constants';
import { ReactErrorBoundary } from './react-error-boundary';
import type { ReactErrorBoundaryProps } from './react-error-boundary';

export interface FaroErrorBoundaryProps
  extends Omit<ReactErrorBoundaryProps, 'onError'> {
  onError?: (error: Error) => void;
}

export function FaroErrorBoundary({
  children,
  fallback,
  onError,
}: FaroErrorBoundaryProps) {
  const { pushError } = useFaroEvent();

  const handleError = useCallback(
    (error: Error, componentStack?: string): void => {
      const context: Record<string, string> = {
        boundary: 'FaroErrorBoundary',
      };
      if (componentStack) context['componentStack'] = componentStack;

      pushError(error, { context, type: 'react_error_boundary' });

      // A throwing user callback would otherwise re-enter the boundary.
      try {
        onError?.(error);
      } catch (callbackFailure) {
        console.error(`${LOG_PREFIX} onError callback failed:`, callbackFailure);
      }
    },
    [pushError, onError],
  );

  return (
    <ReactErrorBoundary fallback={fallback} onError={handleError}>
      {children}
    </ReactErrorBoundary>
  );
}
