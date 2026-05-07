import CountUp from '@/components/ui/CountUp';
import Reveal from '@/components/ui/Reveal';
import { KEY_NUMBERS } from '@/lib/constants';

/**
 * Chiffres clés animés (CDC §2.1 + Textes_Site_v1).
 * Source unique : constants.ts → KEY_NUMBERS
 */
const NUMBERS = KEY_NUMBERS.map((n) => ({
  end: n.value,
  prefix: 'prefix' in n ? n.prefix : undefined,
  suffix: 'suffix' in n ? n.suffix : undefined,
  label: n.label,
}));

export default function KeyNumbers() {
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
            <p className="mb-3 text-[13px] font-semibold uppercase tracking-[0.18em] text-cauris-orange">
              Notre impact en chiffres
            </p>
            <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl">
              Un écosystème qui livre des résultats
            </h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
          {NUMBERS.map((item, i) => (
            <Reveal key={item.label} delay={i * 80}>
              <div className="text-center group">
                <p className="font-heading font-extrabold text-5xl sm:text-6xl lg:text-7xl text-gradient-orange mb-3 transition-transform group-hover:scale-105">
                  <CountUp end={item.end} prefix={item.prefix} suffix={item.suffix} />
                </p>
                <p className="text-sm sm:text-base text-white/70 max-w-[220px] mx-auto leading-snug">
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
