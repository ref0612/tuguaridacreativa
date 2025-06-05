import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import MainNav from '@/components/layout/MainNav';
import Footer from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TuGuaridaCreativa - Tienda en línea',
  description: 'Encuentra los mejores productos creativos en TuGuaridaCreativa',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  themeColor: '#ffffff',
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://tuguaridacreativa.com',
    siteName: 'TuGuaridaCreativa',
    title: 'TuGuaridaCreativa - Tienda en línea',
    description: 'Encuentra los mejores productos creativos en TuGuaridaCreativa',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'TuGuaridaCreativa',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TuGuaridaCreativa - Tienda en línea',
    description: 'Encuentra los mejores productos creativos en TuGuaridaCreativa',
    images: ['/images/twitter-image.jpg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="h-full">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <MainNav />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
