'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { MAIN_NAV } from '@/lib/constants';
import { cn } from '@/lib/utils';
import Button from '@/components/ui/Button';
import Logo from '@/components/ui/Logo';

/**
 * Header sticky avec smart navbar (CDC §4.1) :
 * - Sticky en haut de page
 * - Disparaît au scroll vers le bas, réapparaît au scroll vers le haut
 * - Menu mobile hamburger en dessous de 768px
 */
export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  useEffect(() => {
    let lastY = window.scrollY;

    const onScroll = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > 8);

      if (currentY > 100 && currentY > lastY) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      lastY = currentY;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Bloque le scroll quand le menu mobile est ouvert
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-40 transition-all duration-300 ease-cauris',
        scrolled ? 'bg-white/95 backdrop-blur shadow-sm' : 'bg-white',
        hidden && !mobileOpen ? '-translate-y-full' : 'translate-y-0',
      )}
    >
      <div className="container-cauris">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Logo size={40} />

          {/* Navigation desktop */}
          <nav className="hidden lg:flex items-center gap-7" aria-label="Navigation principale">
            {MAIN_NAV.map((item) => {
              const hasSubmenu = 'submenu' in item && item.submenu;
              return (
                <div key={item.label} className="relative group">
                  <Link
                    href={item.href}
                    className="nav-link inline-flex items-center gap-1 py-2 text-[15px]"
                  >
                    {item.label}
                    {hasSubmenu && <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />}
                  </Link>
                  {hasSubmenu && (
                    <div className="absolute top-full left-0 pt-2 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200">
                      <div className="bg-white rounded-card shadow-card-hover py-3 min-w-[240px] border border-gray-100">
                        {item.submenu!.map((sub) => (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            className="block px-5 py-2 text-sm text-cauris-gray-text hover:text-cauris-orange hover:bg-cauris-cream transition-colors"
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* CTA + hamburger */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <Button href="/contact?objet=candidature" size="sm">
                Candidater
              </Button>
            </div>
            <button
              type="button"
              className="lg:hidden p-2 rounded-md text-cauris-black hover:bg-cauris-cream transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu mobile */}
      <div
        className={cn(
          'lg:hidden fixed inset-x-0 top-16 bottom-0 bg-white overflow-y-auto transition-transform duration-300 ease-cauris',
          mobileOpen ? 'translate-x-0' : 'translate-x-full',
        )}
        aria-hidden={!mobileOpen}
      >
        <nav className="container-cauris py-6 flex flex-col gap-1" aria-label="Navigation mobile">
          {MAIN_NAV.map((item) => {
            const hasSubmenu = 'submenu' in item && item.submenu;
            const isOpen = openSubmenu === item.label;
            return (
              <div key={item.label} className="border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 py-4 text-base font-medium text-cauris-black"
                  >
                    {item.label}
                  </Link>
                  {hasSubmenu && (
                    <button
                      type="button"
                      onClick={() => setOpenSubmenu(isOpen ? null : item.label)}
                      className="p-3"
                      aria-expanded={isOpen}
                      aria-label={`Sous-menu ${item.label}`}
                    >
                      <ChevronDown
                        className={cn('w-4 h-4 transition-transform', isOpen && 'rotate-180')}
                      />
                    </button>
                  )}
                </div>
                {hasSubmenu && isOpen && (
                  <div className="pb-3 pl-4 flex flex-col gap-2">
                    {item.submenu!.map((sub) => (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        onClick={() => setMobileOpen(false)}
                        className="text-sm text-cauris-gray-secondary py-1.5 hover:text-cauris-orange"
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          <div className="mt-6">
            <Button href="/contact?objet=candidature" className="w-full">
              Candidater
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
