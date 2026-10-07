// app/page.tsx (or your page component)
import React from 'react';
import { AnimatedSection } from '@/components/AnimatedSection';

import BackgroundSection from '@/components/BackgroundSection';
import MarketAnalysis from '@/components/MarketAnalysis';
import TradingGuide from '@/components/TradingGuide';
import TradingPlan from '@/components/TradingPlan';
import SetupSteps from '@/components/SetupSteps';
import Testimonials from '@/components/Testimonials';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <main className="overflow-x-hidden">
      {/* Background Section (animates immediately on load) */}
      <AnimatedSection>
        <BackgroundSection />
      </AnimatedSection>

      {/* Subsequent sections animate as the user scrolls down */}
      <AnimatedSection>
        <MarketAnalysis />
      </AnimatedSection>

      <AnimatedSection>
        <TradingGuide />
      </AnimatedSection>

      <AnimatedSection>
        <TradingPlan />
      </AnimatedSection>

      <AnimatedSection>
        <SetupSteps />
      </AnimatedSection>

      <AnimatedSection>
        <Testimonials />
      </AnimatedSection>

      <AnimatedSection>
        <Footer />
      </AnimatedSection>
    </main>
  );
}