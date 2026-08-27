import { cn } from '@/lib/utils';

interface SectionTitleProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
  as?: 'h1' | 'h2' | 'h3';
}

export default function SectionTitle({
  eyebrow,
  title,
  description,
  align = 'center',
  className,
  as: Heading = 'h2',
}: SectionTitleProps) {
  const isHero = Heading === 'h1';

  return (
    <div
      className={cn(
        'max-w-3xl',
        align === 'center' && 'mx-auto text-center',
        align === 'left' && 'text-left',
        className
      )}
    >
      {eyebrow && (
        <p className="mb-3 text-[13px] font-semibold uppercase tracking-[0.18em] text-cauris-orange">
          {eyebrow}
        </p>
      )}
      <Heading
        className={cn(
          'font-heading font-bold text-cauris-black',
          isHero
            ? 'text-4xl sm:text-5xl lg:text-6xl leading-[1.1]'
            : 'text-3xl sm:text-h2 leading-tight'
        )}
      >
        {title}
      </Heading>
      {description && (
        <p className="mt-4 text-base sm:text-lg text-cauris-gray-secondary leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
