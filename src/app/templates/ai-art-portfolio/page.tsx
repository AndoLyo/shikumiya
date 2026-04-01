"use client";

import Header from "@/components/templates/ai-art-portfolio/Header";
import HeroSection from "@/components/templates/ai-art-portfolio/HeroSection";
import GallerySection from "@/components/templates/ai-art-portfolio/GallerySection";
import AboutSection from "@/components/templates/ai-art-portfolio/AboutSection";
import ContactSection from "@/components/templates/ai-art-portfolio/ContactSection";
import Footer from "@/components/templates/ai-art-portfolio/Footer";
import ScrollProgress from "@/components/templates/ai-art-portfolio/ScrollProgress";

export default function AiArtPortfolioPage() {
  return (
    <div className="ai-art-portfolio-template">
      <ScrollProgress />
      <Header />
      <main id="main-content">
        <HeroSection />
        <GallerySection />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
