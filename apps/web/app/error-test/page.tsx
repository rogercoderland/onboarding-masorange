import { ErrorTestPanel } from './error-test-panel';
import styles from './error-test.module.css';

export const metadata = {
  title: 'Error test · Grafana Faro',
  description:
    'Disparadores de errores, eventos y logs para verificar la instrumentación de Grafana Faro en Frontend Observability.',
};

export default function ErrorTestPage() {
  return (
    <div className={styles.page}>
      <header className={styles.head}>
        <h1 className={styles.title}>Error test (Grafana Faro)</h1>
        <p className={styles.subtitle}>
          Cada botón dispara un tipo de señal distinto. Compruébalos en Grafana
          Cloud → Frontend Observability → tu app. Si no hay collector URL
          configurada, la página sigue funcionando y verás un aviso en consola.
        </p>
      </header>

      <ErrorTestPanel />
    </div>
  );
}
