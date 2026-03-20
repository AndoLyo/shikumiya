"use client";

import { useState, useEffect } from "react";
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
import ContactSection from "@/components/ContactSection";
import ScrollProgress from "@/components/ScrollProgress";
import Footer from "@/components/Footer";

export default function Home() {
  const [showIntro, setShowIntro] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const visited = localStorage.getItem("lyo-visited");
    if (visited) {
      setShowIntro(false);
    }
  }, []);

  const handleEnter = () => {
    localStorage.setItem("lyo-visited", "1");
    setShowIntro(false);
  };

  if (!mounted) return null;

  return (
    <>
      <AnimatePresence>
        {showIntro && <IntroSplash onEnter={handleEnter} />}
      </AnimatePresence>

      {!showIntro && (
        <>
          <ScrollProgress />
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
            <ContactSection />
          </main>
          <Footer />
        </>
      )}
    </>
  );
}
