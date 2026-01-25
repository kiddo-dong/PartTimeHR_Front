// app/layout.tsx
import localFont from 'next/font/local';
import './globals.css';

const bmHannaPro = localFont({
  src: './fonts/BMHANNAPro.woff2',
  variable: '--font-bm-hanna',
  display: 'swap',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={bmHannaPro.variable}>
      <body>{children}</body>
    </html>
  );
}
