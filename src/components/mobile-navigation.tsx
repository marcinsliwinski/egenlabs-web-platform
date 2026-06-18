'use client';

import Link from 'next/link';
import { useEffect, useId, useState } from 'react';

const navigationItems = [
  { href: '/products', label: 'Rozwiązania' },
  { href: '/downloads/ham-radio', label: 'Dokumentacja' },
  { href: '/blog', label: 'Wiedza' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Kontakt' },
  { href: '/legal', label: 'Informacje prawne' }
] as const;

export function DesktopNavigation() {
  return (
    <nav className="site-nav site-nav--desktop" aria-label="Główna nawigacja">
      {navigationItems.slice(0, 5).map((item) => (
        <Link href={item.href} key={item.href}>{item.label}</Link>
      ))}
    </nav>
  );
}

export function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const navigationId = useId();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  return (
    <div className="mobile-navigation">
      <button
        aria-controls={navigationId}
        aria-expanded={isOpen}
        className="mobile-navigation__toggle"
        onClick={() => setIsOpen((current) => !current)}
        type="button"
      >
        <span>Menu</span>
        <span className="mobile-navigation__icon" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      </button>
      <nav
        aria-label="Mobilna nawigacja"
        className={isOpen ? 'mobile-navigation__panel mobile-navigation__panel--open' : 'mobile-navigation__panel'}
        id={navigationId}
      >
        {navigationItems.map((item) => (
          <Link href={item.href} key={item.href} onClick={() => setIsOpen(false)}>{item.label}</Link>
        ))}
      </nav>
    </div>
  );
}
