import { MinimalBar } from "@/components/portfolio-templates/floating-gallery/MinimalBar";
import { HeroSection } from "@/components/portfolio-templates/floating-gallery/HeroSection";
import { GallerySection } from "@/components/portfolio-templates/floating-gallery/GallerySection";
import { AboutSection } from "@/components/portfolio-templates/floating-gallery/AboutSection";
import { ContactSection } from "@/components/portfolio-templates/floating-gallery/ContactSection";
import { Footer } from "@/components/portfolio-templates/floating-gallery/Footer";

export const metadata = {
  title: "Floating Gallery — AI Artist Portfolio Template",
  description:
    "没入型3Dフローティングギャラリー。カードが空間に浮遊し、ホバーで傾くインタラクティブなポートフォリオテンプレート。",
};

export default function FloatingGalleryPage() {
  return (
    <div
      className="floating-gallery-template"
      style={
        {
          "--fg-bg": "#111118",
          "--fg-surface": "#1C1C26",
          "--fg-text": "#E8E8F0",
          "--fg-text-muted": "#7878A0",
          "--fg-accent": "#6C63FF",
          "--fg-accent-light": "#A5A0FF",
          "--fg-border": "rgba(108, 99, 255, 0.15)",
          fontFamily:
            "'Inter', 'Hiragino Sans', 'Noto Sans JP', system-ui, sans-serif",
          color: "var(--fg-text)",
        } as React.CSSProperties
      }
    >
      <MinimalBar />
      <main>
        <HeroSection />
        <GallerySection />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
