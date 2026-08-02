import type { Metadata, Viewport } from 'next';

import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Project115',
    template: '%s · Project115',
  },
  description:
    'Tweetalige studiehub voor ITIL Foundation (Version 5) en EXIN Information Security Foundation based on ISO/IEC 27001.',
  authors: [{ name: 'B. van Rooij' }],
  creator: 'B. van Rooij',
  applicationName: 'Project115',
  // De hub is persoonlijk en hoort niet in zoekmachines terecht te komen.
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f4f5f7' },
    { media: '(prefers-color-scheme: dark)', color: '#101319' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="nl" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
