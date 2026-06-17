import Link from 'next/link';
import type { ReactNode } from 'react';

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
          <span className="brand-mark__symbol">eG</span>
          <span className="brand-mark__text">
            <span className="brand-mark__name">eGen Labs</span>
            <span className="brand-mark__caption">produkty eGen</span>
          </span>
        </Link>
        <nav className="site-nav" aria-label="Główna nawigacja">
          <Link href="/#platforma">Platforma</Link>
          <Link href="/products">Produkty</Link>
          <Link href="/blog">Wiedza</Link>
          <Link href="/faq">FAQ</Link>
          <Link href="/downloads/ham-radio">Dokumenty</Link>
          <Link href="/contact">Kontakt</Link>
        </nav>
      </div>
    </header>
  );
}

export function PublicFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="brand-mark">
          <span className="brand-mark__symbol">eG</span>
          <span className="brand-mark__text">
            <span className="brand-mark__name">eGen Labs</span>
            <span className="brand-mark__caption">egenlabs.eu</span>
          </span>
        </div>
        <p>
          Platforma produktowa eGen: praktyczne narzędzia, dokumentacja, wiedza branżowa i wsparcie aplikacji desktopowych —
          bez przenoszenia operacyjnych danych użytkowników do chmury.
        </p>
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
