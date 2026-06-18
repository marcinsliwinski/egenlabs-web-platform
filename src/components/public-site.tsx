import Link from 'next/link';
import type { ReactNode } from 'react';

import { DesktopNavigation, MobileNavigation } from './mobile-navigation';

type PublicShellProps = {
  children: ReactNode;
};

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  children?: ReactNode;
};

type CardProps = {
  title: string;
  children: ReactNode;
  accent?: boolean;
};

export function PublicShell({ children }: PublicShellProps) {
  return (
    <div className="site-shell">
      <PublicHeader />
      <main className="site-main">{children}</main>
      <PublicFooter />
    </div>
  );
}

export function PublicHeader() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link className="brand-mark" href="/" aria-label="eGen Labs — strona główna">
          <span className="brand-mark__symbol" aria-hidden="true">eG</span>
          <span className="brand-mark__text">
            <span className="brand-mark__name">eGen Labs</span>
            <span className="brand-mark__caption">Rozwiązania inżynieryjne do praktycznych zastosowań</span>
          </span>
        </Link>
        <DesktopNavigation />
        <MobileNavigation />
      </div>
    </header>
  );
}

export function PublicFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__about">
          <div className="brand-mark">
            <span className="brand-mark__symbol" aria-hidden="true">eG</span>
            <span className="brand-mark__text">
              <span className="brand-mark__name">eGen Labs</span>
              <span className="brand-mark__caption">egenlabs.eu</span>
            </span>
          </div>
          <p>Skalowalne aplikacje oraz specjalistyczne rozwiązania krótkofalarskie z rzetelną dokumentacją.</p>
        </div>
        <nav className="site-footer__links" aria-label="Rozwiązania">
          <strong>Rozwiązania</strong>
          <Link href="/products/fito-gen">Fito Gen</Link>
          <Link href="/products/gen-fed">GEN-FED</Link>
          <Link href="/products/cmc-gen">CMC-GEN</Link>
        </nav>
        <nav className="site-footer__links" aria-label="Informacje">
          <strong>Informacje</strong>
          <Link href="/downloads/ham-radio">Dokumentacja</Link>
          <Link href="/blog">Wiedza</Link>
          <Link href="/faq">FAQ</Link>
          <Link href="/contact">Kontakt</Link>
          <Link href="/legal">Informacje prawne</Link>
        </nav>
      </div>
      <div className="site-footer__bottom">
        <span>© {new Date().getFullYear()} eGen Labs</span>
        <span>Rozwiązania projektowane i rozwijane w Polsce</span>
      </div>
    </footer>
  );
}

export function PageContainer({ children }: { children: ReactNode }) {
  return <div className="page-container page-stack">{children}</div>;
}

export function SectionHeader({ eyebrow, title, children }: SectionHeaderProps) {
  return (
    <header className="section-header">
      {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
      <h2>{title}</h2>
      {children}
    </header>
  );
}

export function Card({ title, children, accent = false }: CardProps) {
  return (
    <article className={accent ? 'card card--accent' : 'card'}>
      <h3>{title}</h3>
      {children}
    </article>
  );
}
