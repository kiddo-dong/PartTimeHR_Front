// app/layout.tsx
import localFont from 'next/font/local';
import './globals.css';

export const metadata = {
  title: 'al-bam', // 탭 이름
  description: '매장 및 직원을 한 번에 관리하세요',
  icons: {
    icon: '/favicon.ico', // 파비콘 경로
    shortcut: '/favicon.ico', 
  },
};

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
