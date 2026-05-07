import Link from 'next/link';
import { Linkedin, Twitter, Youtube, Facebook } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/constants';
import NewsletterForm from '@/components/forms/NewsletterForm';
import Logo from '@/components/ui/Logo';

/**
 * Footer 4 colonnes (CDC §4.3)
 * - Col 1 : Logo + slogan + newsletter
 * - Col 2 : Liens À propos
 * - Col 3 : Startups + Innovation Corporative
 * - Col 4 : Liens légaux + réseaux sociaux
 */
export default function Footer() {
  return (
    <footer className="bg-cauris-black text-white">
      <div className="container-cauris py-section-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1 — Logo + Newsletter */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <Logo variant="light" size={44} />
            </div>
            <p className="text-sm text-white/70 leading-relaxed mb-6">
              Propulser l&apos;innovation numérique africaine — depuis Yaoundé, pour le monde.
            </p>
            <h3 className="text-sm font-semibold mb-3 uppercase tracking-wide">Newsletter</h3>
            <p className="text-xs text-white/60 mb-3">
              Restez informé de nos actualités et événements.
            </p>
            <NewsletterForm />
          </div>

          {/* Col 2 — À propos */}
          <div>
            <h3 className="text-sm font-semibold mb-4 uppercase tracking-wide text-cauris-orange">
              À propos
            </h3>
            <ul className="space-y-2.5 text-sm text-white/80">
              <li><Link href="/a-propos" className="hover:text-cauris-orange transition-colors">Qui sommes-nous</Link></li>
              <li><Link href="/a-propos#equipe" className="hover:text-cauris-orange transition-colors">Notre équipe</Link></li>
              <li><Link href="/a-propos#ca" className="hover:text-cauris-orange transition-colors">Conseil d&apos;administration</Link></li>
              <li><Link href="/actualites" className="hover:text-cauris-orange transition-colors">Actualités</Link></li>
              <li><Link href="/evenements" className="hover:text-cauris-orange transition-colors">Événements</Link></li>
            </ul>
          </div>

          {/* Col 3 — Startups + Innovation */}
          <div>
            <h3 className="text-sm font-semibold mb-4 uppercase tracking-wide text-cauris-orange">
              Programmes
            </h3>
            <ul className="space-y-2.5 text-sm text-white/80">
              <li><Link href="/programme-incubation" className="hover:text-cauris-orange transition-colors">Programme Incubation</Link></li>
              <li><Link href="/programme-acceleration" className="hover:text-cauris-orange transition-colors">Programme Accélération</Link></li>
              <li><Link href="/startups" className="hover:text-cauris-orange transition-colors">Nos startups</Link></li>
              <li><Link href="/innovation-corporative" className="hover:text-cauris-orange transition-colors">Innovation corporative</Link></li>
              <li><Link href="/partenaires" className="hover:text-cauris-orange transition-colors">Partenaires</Link></li>
            </ul>
          </div>

          {/* Col 4 — Légal + Social */}
          <div>
            <h3 className="text-sm font-semibold mb-4 uppercase tracking-wide text-cauris-orange">
              Mentions légales
            </h3>
            <ul className="space-y-2.5 text-sm text-white/80 mb-6">
              <li><Link href="/mentions-legales" className="hover:text-cauris-orange transition-colors">Mentions légales</Link></li>
              <li><Link href="/politique-de-confidentialite" className="hover:text-cauris-orange transition-colors">Politique de confidentialité</Link></li>
              <li><Link href="/politique-de-confidentialite#cookies" className="hover:text-cauris-orange transition-colors">Utilisation des cookies</Link></li>
              <li><Link href="/contact" className="hover:text-cauris-orange transition-colors">Contact</Link></li>
              <li><Link href="/faq" className="hover:text-cauris-orange transition-colors">FAQ</Link></li>
            </ul>

            <h3 className="text-sm font-semibold mb-3 uppercase tracking-wide text-cauris-orange">
              Suivez-nous
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
          <p>
            © {new Date().getFullYear()} CAURIS DIGITAL — Tous droits réservés
          </p>
          <p>Siège social : {SITE_CONFIG.fullAddress}</p>
        </div>
      </div>
    </footer>
  );
}
