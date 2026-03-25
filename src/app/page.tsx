"use client";

import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import TrustBarSection from "@/components/TrustBarSection";
import ProblemSection from "@/components/ProblemSection";
import PillarsSection from "@/components/PillarsSection";
import ProductSection from "@/components/ProductSection";
import ResourcesSection from "@/components/ResourcesSection";
import MembershipSection from "@/components/MembershipSection";
import FAQSection from "@/components/FAQSection";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import MobileCTA from "@/components/MobileCTA";
import ScrollProgress from "@/components/ScrollProgress";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <Header />
      <main id="main-content">
        <HeroSection />
        <TrustBarSection />
        <ProblemSection />
        <PillarsSection />
        <ProductSection />
        <ResourcesSection />
        <MembershipSection />
        <FAQSection />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
      <MobileCTA />
    </>
  );
}
