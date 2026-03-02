import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'HanoutTN - Votre Marketplace en Ligne en Tunisie',
  description: 'Achète et vendez des produits en Tunisie. Electronique, véhicules, immobilier, vêtements et plus. Le plus grand marketplace local de Gafsa et toute la Tunisie.',
  keywords: ['tunisie', 'hanout', 'marketplace', 'acheter', 'vendre', 'gafas', 'electronique', 'voitures'],
  authors: [{ name: 'HanoutTN' }],
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
