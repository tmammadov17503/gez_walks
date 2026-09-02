import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import './globals.css';

const manrope = Manrope({
  variable: '--font-manrope',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'YOLDA Walks — Bakıda etibarlı it gəzintisi',
  description:
    'Bakıda yoxlanılmış it gəzdiricilərini tap, gəzintini sifariş et və canlı izlə.',
  openGraph: {
    title: 'YOLDA Walks — Sən rahat ol. O, gəzintidə.',
    description: 'Bakıda yoxlanılmış it gəzdiriciləri, canlı GPS və rahat sifariş.',
    images: [{ url: '/og.png', width: 1664, height: 909, alt: 'YOLDA Walks' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'YOLDA Walks — Sən rahat ol. O, gəzintidə.',
    description: 'Bakıda yoxlanılmış it gəzdiriciləri, canlı GPS və rahat sifariş.',
    images: ['/og.png'],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="az">
      <body className={`${manrope.variable} antialiased`}>{children}</body>
    </html>
  );
}
