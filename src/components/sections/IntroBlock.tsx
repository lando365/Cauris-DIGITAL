import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { ArrowRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import Reveal from '@/components/ui/Reveal';
import { BRAND_IMAGES } from '@/lib/constants';

/**
 * Bloc présentation (CDC §2.1).
 */
export default async function IntroBlock() {
  const t = await getTranslations('IntroBlock');
  return (
    <section className="section bg-cauris-cream/40">
      <div className="container-cauris">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <Reveal>
            <p className="mb-3 text-[13px] font-semibold uppercase tracking-[0.18em] text-cauris-orange">
              {t('eyebrow')}
            </p>
            <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl leading-tight text-cauris-black mb-6">
              {t('title')}
            </h2>
            <div className="space-y-4 text-cauris-gray-text leading-relaxed">
              <p>{t('paragraph1')}</p>
              <p>{t('paragraph2')}</p>
              <p className="font-medium text-cauris-black">{t('paragraph3')}</p>
            </div>
            <div className="mt-8">
              <Button href="/a-propos" variant="secondary">
                {t('discoverButton')}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </Reveal>

          <Reveal delay={150}>
            <div className="relative">
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-3 sm:space-y-4">
                  <div className="relative aspect-[3/4] rounded-card overflow-hidden shadow-card bg-cauris-orange/10">
                    <Image
                      src={BRAND_IMAGES.introPitch}
                      alt={t('altPitch')}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="relative aspect-square rounded-card overflow-hidden shadow-card bg-cauris-cream">
                    <Image
                      src={BRAND_IMAGES.introMentoring}
                      alt={t('altMentoring')}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover"
                    />
                  </div>
                </div>
                {/* Décalage uniquement sur sm+ pour l'effet mosaïque, droit sur mobile */}
                <div className="space-y-3 sm:space-y-4 sm:pt-12">
                  <div className="relative aspect-square rounded-card overflow-hidden shadow-card bg-cauris-black">
                    <Image
                      src={BRAND_IMAGES.introCoworking}
                      alt={t('altCoworking')}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="relative aspect-[3/4] rounded-card overflow-hidden shadow-card bg-cauris-orange">
                    <Image
                      src={BRAND_IMAGES.introWorkshop}
                      alt={t('altWorkshop')}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
              {/* Badge +80 — inline sous la mosaïque sur mobile, en superposition sur sm+ */}
              <div className="mt-4 sm:mt-0 sm:absolute sm:-bottom-4 sm:-left-4 bg-white rounded-card shadow-card-hover px-5 py-4 border border-gray-100 max-w-full sm:max-w-[200px] flex items-baseline sm:block gap-3">
                <p className="text-2xl font-heading font-bold text-cauris-orange">+80</p>
                <p className="text-xs text-cauris-gray-secondary">{t('badgeText')}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
