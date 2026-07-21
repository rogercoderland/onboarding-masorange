'use client';

import { Component } from 'react';
import type { ErrorInfo, ReactElement, ReactNode } from 'react';
import './error-boundary.css';

export interface ReactErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactElement | ((error: Error, reset: () => void) => ReactElement);
  onError?: (error: Error, componentStack?: string) => void;
}

interface ReactErrorBoundaryState {
  error: Error | null;
}

export class ReactErrorBoundary extends Component<
  ReactErrorBoundaryProps,
  ReactErrorBoundaryState
> {
  override state: ReactErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ReactErrorBoundaryState {
    return { error };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.props.onError?.(error, errorInfo.componentStack ?? undefined);
  }

  resetErrorBoundary = (): void => {
    this.setState({ error: null });
  };

  override render(): ReactNode {
    const { error } = this.state;
    if (!error) return this.props.children;

    const { fallback } = this.props;
    if (typeof fallback === 'function') {
      return fallback(error, this.resetErrorBoundary);
    }
    if (fallback) return fallback;

    return (
      <div className="observability-fallback" role="alert">
        <p className="observability-fallback__title">Algo ha ido mal</p>
        <p className="observability-fallback__body">
          Hemos registrado el error. Puedes reintentar sin recargar la página.
        </p>
        <button
          type="button"
          className="observability-fallback__action"
          onClick={this.resetErrorBoundary}
        >
          Reintentar
        </button>
      </div>
    );
  }
}
