import './global.css';
import { ConfigCatProvider } from '@onboarding-nx/configcat';
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
          ConfigCatProvider is also a client boundary. NEXT_PUBLIC_* vars are
          inlined at build time, so the SDK key is readable here and in the
          browser bundle (it is public by design — flags are not secrets).
        */}
        <ConfigCatProvider
          sdkKey={process.env.NEXT_PUBLIC_CONFIGCAT_SDK_KEY ?? ''}
        >
          <CartProvider>
            <Header />
            <main className="app-main">{children}</main>
            <SiteFooter />
            <CartDrawer />
          </CartProvider>
        </ConfigCatProvider>
      </body>
    </html>
  );
}
