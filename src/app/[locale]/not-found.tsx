import Button from '@/components/ui/Button';

export default function NotFound() {
  return (
    <section className="min-h-[80vh] flex items-center pt-32 pb-20">
      <div className="container-cauris text-center">
        <p className="font-heading font-extrabold text-[120px] sm:text-[180px] leading-none text-gradient-orange">
          404
        </p>
        <h1 className="font-heading font-bold text-2xl sm:text-3xl text-cauris-black mb-4">
          Cette page n&apos;existe pas
        </h1>
        <p className="text-cauris-gray-text max-w-md mx-auto mb-8">
          La page que vous cherchez a peut-être été déplacée ou n&apos;existe plus.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button href="/">Retour à l&apos;accueil</Button>
          <Button href="/contact" variant="secondary">
            Nous contacter
          </Button>
        </div>
      </div>
    </section>
  );
}
