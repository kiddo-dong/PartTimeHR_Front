import localFont from 'next/font/local';
import AuthProvider from './providers/AuthProvider';
import { StoreProvider } from './providers/StoreProvider';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import './globals.css';

const bmHannaPro = localFont({
  src: './fonts/BMHANNAPro.woff2',
  variable: '--font-bm-hanna',
  display: 'swap',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={bmHannaPro.variable}>
      <body className="flex flex-col min-h-screen">
        <AuthProvider>
          <StoreProvider>
            <main className="flex-1">{children}</main>
            <Footer />
          </StoreProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
