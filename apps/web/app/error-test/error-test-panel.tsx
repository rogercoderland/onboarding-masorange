'use client';

import { useState } from 'react';
import {
  FaroErrorBoundary,
  LogLevel,
  useFaroEvent,
} from '@onboarding-nx/observability';
import styles from './error-test.module.css';

/** Throws during render. */
function Bomb({ armed }: { armed: boolean }) {
  if (armed) {
    throw new Error('Faro demo: React render error');
  }
  return (
    <p className={styles.ok}>
      Componente sano. Pulsa el botón para hacerlo fallar en render.
    </p>
  );
}

function RenderErrorSection() {
  const [armed, setArmed] = useState(false);

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>1 · Error de render</h2>
      <p className={styles.sectionBody}>
        Lo captura <code>FaroErrorBoundary</code>: se reporta con{' '}
        <code>type: react_error_boundary</code> y se muestra el fallback. Es el
        único de los tres que demuestra el boundary.
      </p>

      {/* Render-prop fallback. */}
      <FaroErrorBoundary
        fallback={(error, reset) => (
          <div className={styles.fallback} role="alert">
            <p className={styles.fallbackTitle}>
              Capturado por el boundary: {error.message}
            </p>
            <button
              type="button"
              className={styles.button}
              onClick={() => {
                setArmed(false);
                reset();
              }}
            >
              Reintentar
            </button>
          </div>
        )}
      >
        <Bomb armed={armed} />
      </FaroErrorBoundary>

      <button
        type="button"
        className={styles.button}
        onClick={() => setArmed(true)}
        disabled={armed}
      >
        Romper el render
      </button>
    </section>
  );
}

function UncaughtErrorSection() {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>
        2 · Error no controlado en un click
      </h2>
      <p className={styles.sectionBody}>
        <strong>No lo coge el error boundary</strong>: React solo captura
        errores de render. Llega a Faro por su instrumentación de{' '}
        <code>window.onerror</code>.
      </p>
      <button
        type="button"
        className={styles.button}
        onClick={() => {
          throw new Error('Faro demo: unhandled click error');
        }}
      >
        Lanzar error en el handler
      </button>
    </section>
  );
}

function AsyncErrorSection() {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>3 · Error async desde una Promise</h2>
      <p className={styles.sectionBody}>
        Una promesa rechazada sin <code>.catch()</code>. Llega vía{' '}
        <code>unhandledrejection</code>, tampoco por el boundary.
      </p>
      <button
        type="button"
        className={styles.button}
        onClick={() => {
          void Promise.reject(
            new Error('Faro demo: unhandled async rejection'),
          );
        }}
      >
        Rechazar una promesa
      </button>
    </section>
  );
}

function SignalsSection() {
  const { pushEvent, pushLog, isFaroReady } = useFaroEvent();

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>4 · Eventos y logs</h2>
      <p className={styles.sectionBody}>
        Todos los push llevan <code>skipDedupe: true</code>, si no el SDK
        descartaría en silencio las pulsaciones repetidas.
      </p>
      <p className={styles.status}>
        Faro {isFaroReady() ? 'inicializado' : 'no inicializado'}
      </p>

      <div className={styles.row}>
        <button
          type="button"
          className={styles.button}
          onClick={() =>
            pushEvent(
              'demo_button_click',
              { source: 'error-test', clicks: 1 },
              'click',
            )
          }
        >
          Evento custom
        </button>
        <button
          type="button"
          className={styles.button}
          onClick={() => pushLog(['Faro demo: info log'], LogLevel.INFO)}
        >
          Log INFO
        </button>
        <button
          type="button"
          className={styles.button}
          onClick={() => pushLog(['Faro demo: warn log'], LogLevel.WARN)}
        >
          Log WARN
        </button>
        <button
          type="button"
          className={styles.button}
          onClick={() => pushLog(['Faro demo: error log'], LogLevel.ERROR)}
        >
          Log ERROR
        </button>
      </div>
    </section>
  );
}

function UserContextSection() {
  const { setUser } = useFaroEvent();
  const [current, setCurrent] = useState<string | null>(null);

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>5 · Contexto de usuario</h2>
      <p className={styles.sectionBody}>
        Una vez fijado, los eventos posteriores llevan el usuario adjunto en
        Grafana. <code>setUser(undefined)</code> llama a{' '}
        <code>resetUser()</code>.
      </p>
      <p className={styles.status}>Usuario actual: {current ?? 'ninguno'}</p>

      <div className={styles.row}>
        <button
          type="button"
          className={styles.button}
          onClick={() => {
            setUser({
              id: 'user-42',
              email: 'demo@onboarding.test',
              username: 'demo',
            });
            setCurrent('user-42');
          }}
        >
          Fijar usuario
        </button>
        <button
          type="button"
          className={styles.button}
          onClick={() => {
            setUser(undefined);
            setCurrent(null);
          }}
        >
          Limpiar usuario
        </button>
      </div>
    </section>
  );
}

export function ErrorTestPanel() {
  return (
    <div className={styles.panel}>
      <RenderErrorSection />
      <UncaughtErrorSection />
      <AsyncErrorSection />
      <SignalsSection />
      <UserContextSection />
    </div>
  );
}
