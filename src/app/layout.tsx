import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import './globals.css';

export const metadata: Metadata = {
  title: 'eGen Labs — praktyczne produkty, dokumentacja i narzędzia branżowe',
  description: 'eGen Labs rozwija praktyczne produkty cyfrowe, dokumentację i narzędzia branżowe w ekosystemie eGen.'
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="pl">
      <body>{children}</body>
    </html>
  );
}
