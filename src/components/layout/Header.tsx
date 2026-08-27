'use client';

import { Link } from '@/i18n/navigation';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Menu, X, ChevronDown, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import Button from '@/components/ui/Button';
import Logo from '@/components/ui/Logo';
import LanguageSwitcher from '@/components/layout/LanguageSwitcher';

/**
 * Header sticky avec smart navbar (CDC §4.1) :
 * - Sticky en haut de page
 * - Disparaît au scroll vers le bas, réapparaît au scroll vers le haut
 * - Menu mobile hamburger en dessous de 1024px (lg breakpoint)
 * - Sélecteur de langue FR/EN (CDC §6.6)
 *
 * Le menu mobile est rendu en dehors du <header> pour éviter les
 * problèmes de positionnement imbriqués (translate parent ≠ child).
 */

/**
 * Structure de navigation avec clés de traduction (au lieu de libellés en dur).
 * Les `tKey` pointent vers `messages/[locale].json` → Header.menu.*
 */
interface NavItem {
  tKey: string;
  href: string;
  submenu?: Array<{ tKey: string; href: string }>;
}

const NAV_ITEMS: NavItem[] = [
  {
    tKey: 'about',
    href: '/a-propos',
    submenu: [
      { tKey: 'whoWeAre', href: '/a-propos#qui-sommes-nous' },
      { tKey: 'ourTeam', href: '/a-propos#equipe' },
      { tKey: 'board', href: '/a-propos#ca' },
    ],
  },
  {
    tKey: 'startups',
    href: '/startups',
    submenu: [
      { tKey: 'incubation', href: '/programme-incubation' },
      { tKey: 'acceleration', href: '/programme-acceleration' },
      { tKey: 'ourStartups', href: '/startups' },
      { tKey: 'residentEntrepreneurs', href: '/startups#residence' },
    ],
  },
  {
    tKey: 'innovationCorporative',
    href: '/innovation-corporative',
    submenu: [
      { tKey: 'innovationLab', href: '/innovation-corporative#lab' },
      { tKey: 'ourStartups', href: '/partenaires' },
      { tKey: 'corporatePrograms', href: '/innovation-corporative#programmes' },
    ],
  },
  { tKey: 'events', href: '/evenements' },
  { tKey: 'news', href: '/actualites' },
  { tKey: 'partners', href: '/partenaires' },
  { tKey: 'faq', href: '/faq' },
  { tKey: 'contact', href: '/contact' },
];

export default function Header() {
  const tMenu = useTranslations('Header.menu');
  const tSub = useTranslations('Header.submenu');
  const t = useTranslations('Header');

  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  // Smart navbar : cache le header au scroll vers le bas
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

  // Bloque le scroll du body quand le menu mobile est ouvert
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  // Ferme le menu mobile avec la touche Échap
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobileOpen]);

  // Ferme le menu quand on redimensionne au-dessus de lg
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024 && mobileOpen) {
        setMobileOpen(false);
      }
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [mobileOpen]);

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-40 transition-all duration-300 ease-cauris',
          scrolled ? 'bg-white/95 backdrop-blur shadow-sm' : 'bg-white',
          hidden && !mobileOpen ? '-translate-y-full' : 'translate-y-0'
        )}
      >
        <div className="container-cauris">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Logo size={40} />

            {/* Navigation desktop */}
            <nav
              className="hidden lg:flex items-center gap-6"
              aria-label={
                tMenu('about') /* Re-utilise un libellé existant ; le aria-label parent suffit */
              }
            >
              {NAV_ITEMS.map((item) => {
                const hasSubmenu = !!item.submenu;
                return (
                  <div key={item.tKey} className="relative group">
                    <Link
                      href={item.href}
                      className="nav-link inline-flex items-center gap-1 py-2 text-[15px]"
                    >
                      {tMenu(item.tKey)}
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
                              {tSub(sub.tKey)}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Sélecteur de langue + CTA + hamburger */}
            <div className="flex items-center gap-3 lg:gap-4">
              {/* Sélecteur de langue desktop (inline) */}
              <div className="hidden lg:block">
                <LanguageSwitcher variant="inline" />
              </div>

              <div className="hidden sm:block">
                <Button href="/contact?objet=candidature" size="sm">
                  {t('applyButton')}
                </Button>
              </div>

              {/* Bouton hamburger mobile */}
              <button
                type="button"
                className="lg:hidden -mr-2 p-2.5 rounded-md text-cauris-black hover:bg-cauris-cream active:bg-cauris-cream/80 transition-colors touch-manipulation"
                onClick={() => setMobileOpen((open) => !open)}
                aria-label={mobileOpen ? t('closeMenu') : t('openMenu')}
                aria-expanded={mobileOpen}
                aria-controls="mobile-menu"
              >
                {mobileOpen ? (
                  <X className="w-6 h-6" aria-hidden="true" />
                ) : (
                  <Menu className="w-6 h-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ============ MENU MOBILE — rendu en dehors du <header> ============ */}
      {/* Backdrop */}
      <div
        className={cn(
          'lg:hidden fixed inset-0 z-50 bg-cauris-black/50 backdrop-blur-sm transition-opacity duration-300',
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        aria-hidden="true"
        onClick={() => setMobileOpen(false)}
      />

      {/* Panneau du menu */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label={t('openMenu')}
        className={cn(
          'lg:hidden fixed top-0 right-0 bottom-0 z-50 w-[88%] max-w-sm bg-white shadow-2xl transition-transform duration-300 ease-cauris',
          mobileOpen ? 'translate-x-0' : 'translate-x-full',
          'flex flex-col'
        )}
      >
        {/* Header du menu */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-100 shrink-0">
          <Logo size={36} />
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label={t('closeMenu')}
            className="p-2.5 -mr-2 rounded-md text-cauris-black hover:bg-cauris-cream active:bg-cauris-cream/80 transition-colors"
          >
            <X className="w-6 h-6" aria-hidden="true" />
          </button>
        </div>

        {/* Liens de navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-4" aria-label={t('openMenu')}>
          {NAV_ITEMS.map((item) => {
            const hasSubmenu = !!item.submenu;
            const isOpen = openSubmenu === item.tKey;
            return (
              <div key={item.tKey} className="border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 py-4 text-base font-medium text-cauris-black hover:text-cauris-orange transition-colors"
                  >
                    {tMenu(item.tKey)}
                  </Link>
                  {hasSubmenu && (
                    <button
                      type="button"
                      onClick={() => setOpenSubmenu(isOpen ? null : item.tKey)}
                      className="p-3 text-cauris-gray-secondary hover:text-cauris-orange"
                      aria-expanded={isOpen}
                    >
                      <ChevronDown
                        className={cn(
                          'w-4 h-4 transition-transform duration-200',
                          isOpen && 'rotate-180'
                        )}
                        aria-hidden="true"
                      />
                    </button>
                  )}
                </div>
                {hasSubmenu && isOpen && (
                  <div className="pb-3 pl-4 flex flex-col gap-2 animate-fade-in">
                    {item.submenu!.map((sub) => (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        onClick={() => setMobileOpen(false)}
                        className="text-sm text-cauris-gray-secondary py-2 hover:text-cauris-orange transition-colors"
                      >
                        {tSub(sub.tKey)}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Bottom: Language switcher + CTA */}
        <div className="p-4 border-t border-gray-100 shrink-0 space-y-3">
          <LanguageSwitcher variant="dropdown" />
          <Link
            href="/contact?objet=candidature"
            onClick={() => setMobileOpen(false)}
            className="btn-primary w-full justify-center"
          >
            {t('applyButton')}
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </>
  );
}
