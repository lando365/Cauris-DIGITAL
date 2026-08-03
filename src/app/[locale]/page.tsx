import Hero from '@/components/sections/Hero';
import PartnerStrip from '@/components/sections/PartnerStrip';
import IntroBlock from '@/components/sections/IntroBlock';
import KeyNumbers from '@/components/sections/KeyNumbers';
import ProgramsOverview from '@/components/sections/ProgramsOverview';
import Sectors from '@/components/sections/Sectors';
import FeaturedStartups from '@/components/sections/FeaturedStartups';
import Testimonials from '@/components/sections/Testimonials';
import FinalCTA from '@/components/sections/FinalCTA';

/**
 * Page d'accueil — CAURIS DIGITAL
 * Conforme au cahier des charges v1.0 §2.1
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <PartnerStrip />
      <IntroBlock />
      <KeyNumbers />
      <ProgramsOverview />
      <Sectors />
      <FeaturedStartups />
      <Testimonials />
      <FinalCTA />
    </>
  );
}
