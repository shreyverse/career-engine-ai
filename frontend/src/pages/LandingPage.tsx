import React from "react";
import { Navbar } from "../components/layout/Navbar";
import { HeroSection } from "../components/landing/HeroSection";
import { HowItWorksSection } from "../components/landing/HowItWorksSection";
import { FresherJourneySection } from "../components/landing/FresherJourneySection";
import { ProfessionalJourneySection } from "../components/landing/ProfessionalJourneySection";
import { FeatureGridSection } from "../components/landing/FeatureGridSection";
import { FinalCtaSection } from "../components/landing/FinalCtaSection";
import { Footer } from "../components/layout/Footer";

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#050608] text-white flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <div id="how-it-works">
          <HowItWorksSection />
        </div>
        <div id="roadmap">
          <FresherJourneySection />
          <ProfessionalJourneySection />
        </div>
        <div id="skills">
          <FeatureGridSection />
        </div>
        <div id="about">
          <FinalCtaSection />
        </div>
      </main>
      <Footer />
    </div>
  );
};
