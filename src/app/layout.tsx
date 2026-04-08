import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ShareMarketFlow — FII/DII Intelligence Platform',
  description: 'Bloomberg-style AI-powered tracker for Foreign and Domestic Institutional Investor activity in the Indian stock market.',
  keywords: 'FII, DII, NSE, BSE, institutional investors, smart money, India stock market',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body style={{ background: '#080b14' }}>{children}</body>
    </html>
  );
}
