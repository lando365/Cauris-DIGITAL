import { getTranslations } from 'next-intl/server';
import CountUp from '@/components/ui/CountUp';
import Reveal from '@/components/ui/Reveal';
import { KEY_NUMBERS } from '@/lib/constants';

export default async function KeyNumbers() {
  const t = await getTranslations('KeyNumbers');
  const tData = await getTranslations('KeyNumbersData');

  /**
   * Chiffres clés animés (CDC §2.1 + Textes_Site_v1).
   * Source des valeurs : constants.ts → KEY_NUMBERS. Libellés traduits via
   * le namespace next-intl "KeyNumbersData".
   */
  const NUMBERS = KEY_NUMBERS.map((n) => ({
    id: n.id,
    end: n.value,
    prefix: 'prefix' in n ? n.prefix : undefined,
    suffix: 'suffix' in n ? n.suffix : undefined,
    label: tData(n.id),
  }));

  return (
    <section className="section relative overflow-hidden bg-cauris-black text-white">
      {/* Motif décoratif */}
      <div className="absolute inset-0 opacity-[0.04]">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-cauris-orange blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full bg-cauris-orange blur-3xl" />
      </div>

      <div className="container-cauris relative">
        <Reveal>
          <div className="text-center mb-14">
            <p className="mb-3 text-[13px] font-semibold uppercase tracking-[0.18em] text-cauris-orange-light">
              {t('eyebrow')}
            </p>
            <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl">
              {t('title')}
            </h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 sm:gap-x-6 gap-y-10 sm:gap-y-12">
          {NUMBERS.map((item, i) => (
            <Reveal key={item.id} delay={i * 80}>
              <div className="text-center group">
                <p className="font-heading font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-gradient-orange mb-2 sm:mb-3 transition-transform group-hover:scale-105 break-words">
                  <CountUp end={item.end} prefix={item.prefix} suffix={item.suffix} />
                </p>
                <p className="text-xs sm:text-sm md:text-base text-white/70 max-w-[180px] sm:max-w-[220px] mx-auto leading-snug">
                  {item.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
