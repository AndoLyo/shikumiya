import Header from "../../../test/components/Header";
import HeroSection from "../../../test/components/HeroSection";
import TrustBarSection from "../../../test/components/TrustBarSection";
import ProblemSection from "../../../test/components/ProblemSection";
import SolutionSection from "../../../test/components/SolutionSection";
import ProductSection from "../../../test/components/ProductSection";
import ResourcesSection from "../../../test/components/ResourcesSection";
import MembershipSection from "../../../test/components/MembershipSection";
import FAQSection from "../../../test/components/FAQSection";
import AboutSection from "../../../test/components/AboutSection";
import ContactSection from "../../../test/components/ContactSection";
import Footer from "../../../test/components/Footer";
import CustomCursor from "../../../test/components/CustomCursor";
import LoadingScreen from "../../../test/components/LoadingScreen";
import ScrollProgress from "../../../test/components/ScrollProgress";
import MobileCTA from "../../../test/components/MobileCTA";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "しくみや｜AIでコンテンツ制作を自動化する仕組みと作り方 [Test]",
  description:
    "3サイト融合デザインテスト — moufdesign × hiraomakoto × Anthropic Learn",
};

export default function TestPage() {
  return (
    <>
      <LoadingScreen />
      <CustomCursor />
      <ScrollProgress />
      <Header />

      <main id="main-content">
        <HeroSection />
        <TrustBarSection />
        <ProblemSection />
        <SolutionSection />
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
