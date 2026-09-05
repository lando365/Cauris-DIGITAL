import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Mail, MapPin, Phone, Clock } from 'lucide-react';
import ContactForm from '@/components/forms/ContactForm';
import SectionTitle from '@/components/ui/SectionTitle';
import { SITE_CONFIG } from '@/lib/constants';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('ContactPage');
  return { title: t('metaTitle'), description: t('metaDescription') };
}

interface PageProps {
  searchParams: Promise<{ objet?: string }>;
}

export default async function ContactPage({ searchParams }: PageProps) {
  const { objet } = await searchParams;
  const t = await getTranslations('ContactPage');
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-12 lg:pt-40 lg:pb-16 bg-cauris-cream/40">
        <div className="container-cauris">
          <div className="max-w-3xl">
            <p className="mb-3 text-[13px] font-semibold uppercase tracking-[0.18em] text-cauris-orange">
              {t('eyebrow')}
            </p>
            <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl leading-[1.1] text-cauris-black mb-6">
              {t('h1')}
            </h1>
            <p className="text-lg text-cauris-gray-text leading-relaxed">{t('heroSubtitle')}</p>
          </div>
        </div>
      </section>

      {/* Form + Coordonnées */}
      <section className="section">
        <div className="container-cauris">
          <div className="grid lg:grid-cols-3 gap-12 lg:gap-16">
            {/* Formulaire — 2/3 */}
            <div className="lg:col-span-2">
              <SectionTitle
                eyebrow={t('formEyebrow')}
                title={t('formTitle')}
                align="left"
              />
              <div className="mt-8">
                <ContactForm defaultSubject={objet ?? ''} />
              </div>
            </div>

            {/* Coordonnées — 1/3 */}
            <aside className="lg:col-span-1">
              <SectionTitle
                eyebrow={t('infoEyebrow')}
                title={t('infoTitle')}
                align="left"
              />

              <div className="mt-8 space-y-5">
                <div className="card bg-white p-5 border border-gray-100">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-cauris-orange/10 text-cauris-orange flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-cauris-gray-secondary mb-1">
                        {t('emailLabel')}
                      </p>
                      <a
                        href={`mailto:${SITE_CONFIG.email}`}
                        className="text-cauris-black font-medium hover:text-cauris-orange transition-colors break-all"
                      >
                        {SITE_CONFIG.email}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="card bg-white p-5 border border-gray-100">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-cauris-orange/10 text-cauris-orange flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-cauris-gray-secondary mb-1">
                        {t('phoneLabel')}
                      </p>
                      <a
                        href={`tel:${SITE_CONFIG.phone.replace(/\s/g, '')}`}
                        className="text-cauris-black font-medium hover:text-cauris-orange transition-colors"
                      >
                        {SITE_CONFIG.phone}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="card bg-white p-5 border border-gray-100">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-cauris-orange/10 text-cauris-orange flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-cauris-gray-secondary mb-1">
                        {t('addressLabel')}
                      </p>
                      <p className="text-cauris-black font-medium">{SITE_CONFIG.address}</p>
                    </div>
                  </div>
                </div>

                <div className="card bg-cauris-black text-white p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-cauris-orange/20 text-cauris-orange flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-cauris-orange-light mb-1">
                        {t('hoursLabel')}
                      </p>
                      <p className="font-medium">{t('hoursDays')}</p>
                      <p className="text-sm text-white/70">{t('hoursTime')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Carte — Yaoundé, Cameroun (siège social) */}
      <section className="bg-cauris-gray-bg pb-20">
        <div className="container-cauris">
          <div className="rounded-card overflow-hidden shadow-card aspect-[16/9] sm:aspect-[21/9] bg-gray-200 relative">
            <iframe
              title={t('mapTitle')}
              src="https://www.openstreetmap.org/export/embed.html?bbox=11.45%2C3.80%2C11.60%2C3.92&amp;layer=mapnik&amp;marker=3.848%2C11.502"
              className="w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <a
              href="https://www.openstreetmap.org/?mlat=3.848&mlon=11.502#map=13/3.848/11.502"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-3 right-3 bg-white/95 backdrop-blur px-3 py-1.5 rounded-btn text-xs font-medium text-cauris-black hover:bg-white shadow-card transition-colors"
            >
              {t('mapViewLarger')}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
