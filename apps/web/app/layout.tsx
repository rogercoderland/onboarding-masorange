import './global.css';
import { ConfigCatProvider } from '@onboarding-nx/configcat';
import {
  FaroErrorBoundary,
  ObservabilityProvider,
} from '@onboarding-nx/observability';
import { Header } from './components/header';
import { SiteFooter } from './components/site-footer';
import { CartProvider } from './components/cart-context';
import { CartDrawer } from './components/cart-drawer';

export const metadata = {
  title: 'Tienda de dispositivos móviles',
  description:
    'Demo de patrones de renderizado de Next.js (Static, ISR, dinámico, CSR) con Cache Components.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" data-brand="yoigo">
      <body>
        {/*
          CartProvider is a client boundary, but `children` are server components
          rendered on the server and passed through as a prop — so Home/Catálogo
          keep their Static/ISR rendering. Only the cart UI is client-side.
        */}
        {/*
          Observability wraps everything else so a failure inside ConfigCat or
          the cart is still reported. `process.env.NEXT_PUBLIC_*` must be read
          literally — Next inlines these at build time, a dynamic lookup is
          `undefined` in the browser.
        */}
        <ObservabilityProvider
          config={{
            collectorUrl: process.env.NEXT_PUBLIC_FARO_COLLECTOR_URL ?? '',
            appName:
              process.env.NEXT_PUBLIC_FARO_APP_NAME ?? 'onboarding-nx-web',
            environment: process.env.NEXT_PUBLIC_FARO_ENVIRONMENT,
            enabled: process.env.NEXT_PUBLIC_FARO_ENABLED !== 'false',
          }}
        >
          <ConfigCatProvider
            sdkKey={process.env.NEXT_PUBLIC_CONFIGCAT_SDK_KEY ?? ''}
          >
            <CartProvider>
              <Header />
              {/* Page content is the riskiest part (CMS data, dynamic routes):
                  a crash here degrades to a fallback instead of a blank page. */}
              <main className="app-main">
                <FaroErrorBoundary>{children}</FaroErrorBoundary>
              </main>
              <SiteFooter />
              <FaroErrorBoundary fallback={<></>}>
                <CartDrawer />
              </FaroErrorBoundary>
            </CartProvider>
          </ConfigCatProvider>
        </ObservabilityProvider>
      </body>
    </html>
  );
}
