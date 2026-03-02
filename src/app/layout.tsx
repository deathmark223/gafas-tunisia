import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'HyperLocal Marketplace - Buy & Sell Locally',
  description: 'A hyper-local marketplace for buying and selling items, and discovering local restaurants near you.',
  keywords: ['marketplace', 'local', 'buy', 'sell', 'restaurants', 'near me'],
  authors: [{ name: 'HyperLocal Team' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
