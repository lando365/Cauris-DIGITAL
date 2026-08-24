import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { Linkedin, Twitter, Youtube, Facebook } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/constants';
import NewsletterForm from '@/components/forms/NewsletterForm';
import Logo from '@/components/ui/Logo';

/**
 * Footer 4 colonnes (CDC §4.3) — Traduit via next-intl.
 * - Col 1 : Logo + slogan + newsletter
 * - Col 2 : Liens À propos
 * - Col 3 : Programmes
 * - Col 4 : Liens légaux + réseaux sociaux
 */
export default function Footer() {
  const t = useTranslations('Footer');
  const tLinks = useTranslations('Footer.links');
  const tCols = useTranslations('Footer.columns');
  const year = new Date().getFullYear();

  return (
    <footer className="bg-cauris-black text-white">
      <div className="container-cauris py-section-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1 — Logo + Newsletter */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <Logo variant="light" size={44} />
            </div>
            <p className="text-sm text-white/70 leading-relaxed mb-6">{t('slogan')}</p>
            <h3 className="text-sm font-semibold mb-3 uppercase tracking-wide">
              {t('newsletterTitle')}
            </h3>
            <p className="text-xs text-white/60 mb-3">{t('newsletterDescription')}</p>
            <NewsletterForm />
          </div>

          {/* Col 2 — À propos */}
          <div>
            <h3 className="text-sm font-semibold mb-4 uppercase tracking-wide text-cauris-orange-light">
              {tCols('about')}
            </h3>
            <ul className="space-y-2.5 text-sm text-white/80">
              <li>
                <Link
                  href="/a-propos"
                  className="inline-block py-1.5 hover:text-cauris-orange transition-colors"
                >
                  {tLinks('whoWeAre')}
                </Link>
              </li>
              <li>
                <Link
                  href="/a-propos#equipe"
                  className="inline-block py-1.5 hover:text-cauris-orange transition-colors"
                >
                  {tLinks('ourTeam')}
                </Link>
              </li>
              <li>
                <Link
                  href="/a-propos#ca"
                  className="inline-block py-1.5 hover:text-cauris-orange transition-colors"
                >
                  {tLinks('board')}
                </Link>
              </li>
              <li>
                <Link
                  href="/actualites"
                  className="inline-block py-1.5 hover:text-cauris-orange transition-colors"
                >
                  {tLinks('news')}
                </Link>
              </li>
              <li>
                <Link
                  href="/evenements"
                  className="inline-block py-1.5 hover:text-cauris-orange transition-colors"
                >
                  {tLinks('events')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3 — Programmes */}
          <div>
            <h3 className="text-sm font-semibold mb-4 uppercase tracking-wide text-cauris-orange-light">
              {tCols('programs')}
            </h3>
            <ul className="space-y-2.5 text-sm text-white/80">
              <li>
                <Link
                  href="/programme-incubation"
                  className="inline-block py-1.5 hover:text-cauris-orange transition-colors"
                >
                  {tLinks('incubation')}
                </Link>
              </li>
              <li>
                <Link
                  href="/programme-acceleration"
                  className="inline-block py-1.5 hover:text-cauris-orange transition-colors"
                >
                  {tLinks('acceleration')}
                </Link>
              </li>
              <li>
                <Link
                  href="/startups"
                  className="inline-block py-1.5 hover:text-cauris-orange transition-colors"
                >
                  {tLinks('startups')}
                </Link>
              </li>
              <li>
                <Link
                  href="/innovation-corporative"
                  className="inline-block py-1.5 hover:text-cauris-orange transition-colors"
                >
                  {tLinks('innovationCorporative')}
                </Link>
              </li>
              <li>
                <Link
                  href="/partenaires"
                  className="inline-block py-1.5 hover:text-cauris-orange transition-colors"
                >
                  {tLinks('partners')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4 — Légal + Social */}
          <div>
            <h3 className="text-sm font-semibold mb-4 uppercase tracking-wide text-cauris-orange-light">
              {tCols('legal')}
            </h3>
            <ul className="space-y-2.5 text-sm text-white/80 mb-6">
              <li>
                <Link
                  href="/mentions-legales"
                  className="inline-block py-1.5 hover:text-cauris-orange transition-colors"
                >
                  {tLinks('legalNotice')}
                </Link>
              </li>
              <li>
                <Link
                  href="/politique-de-confidentialite"
                  className="inline-block py-1.5 hover:text-cauris-orange transition-colors"
                >
                  {tLinks('privacy')}
                </Link>
              </li>
              <li>
                <Link
                  href="/politique-de-confidentialite#cookies"
                  className="inline-block py-1.5 hover:text-cauris-orange transition-colors"
                >
                  {tLinks('cookies')}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="inline-block py-1.5 hover:text-cauris-orange transition-colors"
                >
                  {tLinks('contact')}
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="inline-block py-1.5 hover:text-cauris-orange transition-colors"
                >
                  {tLinks('faq')}
                </Link>
              </li>
            </ul>

            <h3 className="text-sm font-semibold mb-3 uppercase tracking-wide text-cauris-orange-light">
              {tCols('follow')}
            </h3>
            <div className="flex items-center gap-3">
              <a
                href={SITE_CONFIG.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-cauris-orange flex items-center justify-center transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href={SITE_CONFIG.social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-cauris-orange flex items-center justify-center transition-colors"
                aria-label="Twitter / X"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href={SITE_CONFIG.social.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-cauris-orange flex items-center justify-center transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href={SITE_CONFIG.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-cauris-orange flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/10">
        <div className="container-cauris py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/60">
          <p>{t('copyright', { year })}</p>
          <p>{t('headOffice', { address: SITE_CONFIG.fullAddress })}</p>
        </div>
      </div>
    </footer>
  );
}
