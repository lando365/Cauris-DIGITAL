import { ArrowRight, Clock, Globe } from 'lucide-react';
import { PROGRAMS } from '@/lib/constants';
import Button from '@/components/ui/Button';
import SectionTitle from '@/components/ui/SectionTitle';
import Reveal from '@/components/ui/Reveal';

/**
 * Aperçu des programmes (Textes_Site_v1).
 */
export default function ProgramsOverview() {
  return (
    <section id="programmes" className="section bg-white scroll-mt-24">
      <div className="container-cauris">
        <SectionTitle
          eyebrow="Nos programmes"
          title="Des programmes conçus pour propulser vos ambitions"
          description="Que vous soyez en phase d'idée ou déjà en croissance, CAURIS DIGITAL a un programme fait pour vous."
        />

        <div className="mt-14 grid md:grid-cols-2 gap-6 lg:gap-8">
          {PROGRAMS.map((program, i) => (
            <Reveal key={program.id} delay={i * 100}>
              <article className="card group h-full p-8 lg:p-10 border border-gray-100 flex flex-col">
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cauris-orange">
                    {program.badge}
                  </span>
                  <span className="tag">
                    <Clock className="w-3 h-3 mr-1" />
                    {program.duration}
                  </span>
                </div>
                <h3 className="font-heading font-bold text-2xl lg:text-3xl text-cauris-black mb-3">
                  {program.name}
                </h3>
                <p className="text-cauris-orange font-medium mb-4">{program.tagline}</p>
                <p className="text-cauris-gray-text leading-relaxed mb-5 flex-1">
                  {program.description}
                </p>
                <p className="flex items-start gap-2 text-xs text-cauris-gray-secondary mb-6">
                  <Globe className="w-4 h-4 shrink-0 mt-0.5 text-cauris-orange" aria-hidden="true" />
                  <span>{program.format}</span>
                </p>
                <ul className="space-y-2 mb-8 text-sm text-cauris-gray-text">
                  {program.benefits.slice(0, 3).map((b) => (
                    <li key={b} className="flex items-start gap-2">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-cauris-orange shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
                <Button href={program.href} variant="secondary" className="self-start">
                  {program.cta}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
