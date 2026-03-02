import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'Gafas Tunisia - Local Marketplace in Gafsa',
  description: 'Buy and sell items in Gafsa, Tunisia. Find sunglasses, electronics, vehicles, and more. Local marketplace for Gafsa residents.',
  keywords: ['gafas', 'tunisia', 'marketplace', 'buy', 'sell', 'sunglasses', 'local'],
  authors: [{ name: 'Gafas Tunisia' }],
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
