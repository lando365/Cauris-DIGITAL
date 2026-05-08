'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AccordionItem {
  q: string;
  a: string;
}

interface AccordionProps {
  items: ReadonlyArray<AccordionItem>;
  /** Si true, plusieurs items peuvent être ouverts simultanément. Sinon un seul. */
  multiple?: boolean;
}

/**
 * Accordéon accessible (collapse/expand) — utilisé dans la FAQ.
 * Conformité WCAG 2.1 AA : aria-expanded, aria-controls, focus visible.
 */
export default function Accordion({ items, multiple = true }: AccordionProps) {
  const [openIndices, setOpenIndices] = useState<Set<number>>(new Set());

  const toggle = (i: number) => {
    setOpenIndices((prev) => {
      const next = new Set(prev);
      if (next.has(i)) {
        next.delete(i);
      } else {
        if (!multiple) next.clear();
        next.add(i);
      }
      return next;
    });
  };

  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const isOpen = openIndices.has(i);
        const panelId = `acc-panel-${i}`;
        const buttonId = `acc-button-${i}`;
        return (
          <div
            key={i}
            className={cn(
              'bg-white rounded-card border transition-colors',
              isOpen ? 'border-cauris-orange/40 shadow-card' : 'border-gray-100',
            )}
          >
            <button
              id={buttonId}
              type="button"
              onClick={() => toggle(i)}
              aria-expanded={isOpen}
              aria-controls={panelId}
              className="w-full flex items-start justify-between gap-4 px-5 lg:px-6 py-4 lg:py-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-cauris-orange focus-visible:ring-offset-2 rounded-card"
            >
              <span className="font-heading font-semibold text-base lg:text-lg text-cauris-black flex-1">
                {item.q}
              </span>
              <ChevronDown
                className={cn(
                  'w-5 h-5 mt-1 shrink-0 text-cauris-orange transition-transform duration-300',
                  isOpen && 'rotate-180',
                )}
                aria-hidden="true"
              />
            </button>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={cn(
                'grid transition-[grid-template-rows] duration-300 ease-cauris',
                isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
              )}
            >
              <div className="overflow-hidden">
                <p className="px-5 lg:px-6 pb-5 text-cauris-gray-text leading-relaxed">
                  {item.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
