import type { Metadata } from 'next';
import { Onest } from 'next/font/google';
import './globals.css';

const onest = Onest({
  variable: '--font-onest',
  subsets: ['latin', 'cyrillic'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://gez-walks.mnazaxan.chatgpt.site'),
  title: 'GƏZ Walks — Trusted dog walking in Baku',
  description: 'Create your dog, meet a trusted local walker, follow the walk live, and receive a thoughtful report.',
  icons: { icon: '/favicon.svg' },
  openGraph: {
    title: 'GƏZ Walks — Good walks. Happy dogs.',
    description: 'Trusted dog walkers around Baku, whenever you need one.',
    url: 'https://gez-walks.mnazaxan.chatgpt.site',
    siteName: 'GƏZ Walks',
    locale: 'az_AZ',
    images: [{ url: '/gez-baku-model.png', width: 1536, height: 1024, alt: 'GƏZ miniature Baku neighbourhood' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GƏZ Walks — Good walks. Happy dogs.',
    description: 'A good walk. Someone you trust.',
    images: ['/gez-baku-model.png'],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="az">
      <body className={`${onest.variable} antialiased`}>{children}</body>
    </html>
  );
}
