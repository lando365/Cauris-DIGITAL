'use client';

import { useState } from 'react';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { TESTIMONIALS } from '@/lib/constants';
import SectionTitle from '@/components/ui/SectionTitle';

/**
 * Carousel de témoignages (CDC §2.1).
 */
export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const total = TESTIMONIALS.length;

  const prev = () => setIndex((i) => (i - 1 + total) % total);
  const next = () => setIndex((i) => (i + 1) % total);

  const current = TESTIMONIALS[index];

  return (
    <section className="section bg-cauris-cream/40">
      <div className="container-cauris">
        <SectionTitle
          eyebrow="Témoignages"
          title="Ils ont fait confiance à CAURIS DIGITAL"
        />

        <div className="mt-14 max-w-3xl mx-auto">
          <div className="card bg-white p-8 lg:p-12 border border-gray-100 relative">
            <Quote className="absolute top-6 right-6 w-12 h-12 text-cauris-orange/15" aria-hidden="true" />
            <p className="font-heading text-xl lg:text-2xl text-cauris-black leading-relaxed mb-8">
              « {current.quote} »
            </p>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cauris-orange to-cauris-orange-light flex items-center justify-center text-white font-bold">
                  {current.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-cauris-black">{current.name}</p>
                  <p className="text-sm text-cauris-gray-secondary">
                    Fondateur·rice — {current.startup}
                    {current.location && <span className="ml-1">· {current.location}</span>}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={prev}
                  className="w-10 h-10 rounded-full border border-gray-200 hover:border-cauris-orange hover:bg-cauris-orange hover:text-white transition-all flex items-center justify-center"
                  aria-label="Témoignage précédent"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={next}
                  className="w-10 h-10 rounded-full border border-gray-200 hover:border-cauris-orange hover:bg-cauris-orange hover:text-white transition-all flex items-center justify-center"
                  aria-label="Témoignage suivant"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Pagination dots */}
          <div className="flex justify-center gap-2 mt-6">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                className={`h-2 rounded-full transition-all ${
                  i === index ? 'w-8 bg-cauris-orange' : 'w-2 bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Aller au témoignage ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
