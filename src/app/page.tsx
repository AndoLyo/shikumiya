"use client";

import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ProblemSection from "@/components/ProblemSection";
import PillarsSection from "@/components/PillarsSection";
import ProductSection from "@/components/ProductSection";
import ResourcesSection from "@/components/ResourcesSection";
import MembershipSection from "@/components/MembershipSection";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import ScrollProgress from "@/components/ScrollProgress";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <Header />
      <main>
        <HeroSection />
        <ProblemSection />
        <PillarsSection />
        <ProductSection />
        <ResourcesSection />
        <MembershipSection />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
