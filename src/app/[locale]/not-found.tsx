import { getTranslations } from 'next-intl/server';
import Button from '@/components/ui/Button';

export default async function NotFound() {
  const t = await getTranslations('NotFound');
  return (
    <section className="min-h-[80vh] flex items-center pt-32 pb-20">
      <div className="container-cauris text-center">
        <p className="font-heading font-extrabold text-[120px] sm:text-[180px] leading-none text-gradient-orange">
          404
        </p>
        <h1 className="font-heading font-bold text-2xl sm:text-3xl text-cauris-black mb-4">
          {t('title')}
        </h1>
        <p className="text-cauris-gray-text max-w-md mx-auto mb-8">{t('description')}</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button href="/">{t('backHome')}</Button>
          <Button href="/contact" variant="secondary">
            {t('contactUs')}
          </Button>
        </div>
      </div>
    </section>
  );
}
