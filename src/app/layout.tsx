import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import './globals.css';

export const metadata: Metadata = {
  title: 'eGen Labs — rozwiązania inżynieryjne do praktycznych zastosowań',
  description: 'eGen Labs rozwija skalowalne aplikacje oraz specjalistyczne rozwiązania krótkofalarskie z rzetelną dokumentacją.'
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
