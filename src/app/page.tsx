"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import IntroSplash from "@/components/IntroSplash";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import PortfolioSection from "@/components/PortfolioSection";
import PillarsSection from "@/components/PillarsSection";
import ResourcesSection from "@/components/ResourcesSection";
import TimelineSection from "@/components/TimelineSection";
import MembershipSection from "@/components/MembershipSection";
import AchievementsSection from "@/components/AchievementsSection";
import Footer from "@/components/Footer";

export default function Home() {
  const [showIntro, setShowIntro] = useState(true);

  return (
    <>
      <AnimatePresence>
        {showIntro && (
          <IntroSplash onEnter={() => setShowIntro(false)} />
        )}
      </AnimatePresence>

      {!showIntro && (
        <>
          <Header />
          <main>
            <HeroSection />
            <AboutSection />
            <PortfolioSection />
            <PillarsSection />
            <ResourcesSection />
            <TimelineSection />
            <MembershipSection />
            <AchievementsSection />
          </main>
          <Footer />
        </>
      )}
    </>
  );
}
