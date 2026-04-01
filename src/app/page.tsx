"use client";

import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ShowcaseSection from "@/components/ShowcaseSection";
import ServiceSection from "@/components/ServiceSection";
import PricingSection from "@/components/PricingSection";
import RoadmapSection from "@/components/RoadmapSection";
import AboutSection from "@/components/AboutSection";
import ResourcesSection from "@/components/ResourcesSection";
import FAQSection from "@/components/FAQSection";
import ContactSection from "@/components/ContactSection";
import ScrollProgress from "@/components/ScrollProgress";
import Footer from "@/components/Footer";
import MobileCTA from "@/components/MobileCTA";

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <Header />
      <main id="main-content">
        <HeroSection />
        <ShowcaseSection />
        <ServiceSection />
        <PricingSection />
        <RoadmapSection />
        <AboutSection />
        <ResourcesSection />
        <FAQSection />
        <ContactSection />
      </main>
      <Footer />
      <MobileCTA />
    </>
  );
}
