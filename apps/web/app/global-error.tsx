'use client';

import { useEffect } from 'react';
import { useFaroEvent } from '@onboarding-nx/observability';
import './global.css';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { pushError } = useFaroEvent();

  useEffect(() => {
    pushError(error, {
      context: {
        boundary: 'global-error',
        ...(error.digest ? { digest: error.digest } : {}),
      },
      type: 'nextjs_global_error',
    });
  }, [error, pushError]);

  return (
    <html lang="es" data-brand="yoigo">
      <body>
        <main className="app-main">
          <div role="alert">
            <h1>Algo ha ido mal</h1>
            <p>Hemos registrado el error. Puedes reintentar.</p>
            <button type="button" onClick={reset}>
              Reintentar
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
