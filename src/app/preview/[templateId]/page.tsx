"use client";

import { use, useEffect, useState } from "react";
import type { SiteData } from "@/lib/site-data";
import { SiteDataProvider } from "@/lib/SiteDataContext";

// comic-panel
import ComicHeader from "@/components/portfolio-templates/comic-panel/Header";
import ComicHero from "@/components/portfolio-templates/comic-panel/HeroSection";
import ComicWorks from "@/components/portfolio-templates/comic-panel/WorksSection";
import ComicAbout from "@/components/portfolio-templates/comic-panel/AboutSection";
import ComicContact from "@/components/portfolio-templates/comic-panel/ContactSection";
import ComicFooter from "@/components/portfolio-templates/comic-panel/Footer";

// cyber-neon
import { FloatingNav as CyberNav } from "@/components/portfolio-templates/cyber-neon/FloatingNav";
import { HeroSection as CyberHero } from "@/components/portfolio-templates/cyber-neon/HeroSection";
import { WorksSection as CyberWorks } from "@/components/portfolio-templates/cyber-neon/WorksSection";
import { AboutSection as CyberAbout } from "@/components/portfolio-templates/cyber-neon/AboutSection";
import { ContactSection as CyberContact } from "@/components/portfolio-templates/cyber-neon/ContactSection";
import { Footer as CyberFooter } from "@/components/portfolio-templates/cyber-neon/Footer";

// dark-elegance
import { HeroSection as DEHero } from "@/components/portfolio-templates/dark-elegance/HeroSection";
import { ContactSection as DEContact } from "@/components/portfolio-templates/dark-elegance/ContactSection";

// floating-gallery
import { MinimalBar as FGBar } from "@/components/portfolio-templates/floating-gallery/MinimalBar";
import { HeroSection as FGHero } from "@/components/portfolio-templates/floating-gallery/HeroSection";
import { GallerySection as FGGallery } from "@/components/portfolio-templates/floating-gallery/GallerySection";
import { AboutSection as FGAbout } from "@/components/portfolio-templates/floating-gallery/AboutSection";
import { ContactSection as FGContact } from "@/components/portfolio-templates/floating-gallery/ContactSection";
import { Footer as FGFooter } from "@/components/portfolio-templates/floating-gallery/Footer";

// ink-wash
import IWHeader from "@/components/portfolio-templates/ink-wash/Header";
import IWHero from "@/components/portfolio-templates/ink-wash/HeroSection";
import IWWorks from "@/components/portfolio-templates/ink-wash/WorksSection";
import IWAbout from "@/components/portfolio-templates/ink-wash/AboutSection";
import IWContact from "@/components/portfolio-templates/ink-wash/ContactSection";
import IWFooter from "@/components/portfolio-templates/ink-wash/Footer";

// mosaic-bold
import { Header as MBHeader } from "@/components/portfolio-templates/mosaic-bold/Header";
import { HeroSection as MBHero } from "@/components/portfolio-templates/mosaic-bold/HeroSection";
import { WorksSection as MBWorks } from "@/components/portfolio-templates/mosaic-bold/WorksSection";
import { AboutSection as MBAbout } from "@/components/portfolio-templates/mosaic-bold/AboutSection";
import { ContactSection as MBContact } from "@/components/portfolio-templates/mosaic-bold/ContactSection";
import { Footer as MBFooter } from "@/components/portfolio-templates/mosaic-bold/Footer";

// pastel-pop
import PPHeader from "@/components/portfolio-templates/pastel-pop/Header";
import PPHero from "@/components/portfolio-templates/pastel-pop/HeroSection";
import PPGallery from "@/components/portfolio-templates/pastel-pop/GallerySection";
import PPAbout from "@/components/portfolio-templates/pastel-pop/AboutSection";
import PPContact from "@/components/portfolio-templates/pastel-pop/ContactSection";
import PPFooter from "@/components/portfolio-templates/pastel-pop/Footer";

// retro-pop
import RPHeader from "@/components/portfolio-templates/retro-pop/Header";
import RPHero from "@/components/portfolio-templates/retro-pop/HeroSection";
import RPWorks from "@/components/portfolio-templates/retro-pop/WorksSection";
import RPAbout from "@/components/portfolio-templates/retro-pop/AboutSection";
import RPContact from "@/components/portfolio-templates/retro-pop/ContactSection";
import RPFooter from "@/components/portfolio-templates/retro-pop/Footer";

// studio-white
import { SideNav as SWNav } from "@/components/portfolio-templates/studio-white/SideNav";
import { HeroSection as SWHero } from "@/components/portfolio-templates/studio-white/HeroSection";
import { GalleryGrid as SWGallery } from "@/components/portfolio-templates/studio-white/GalleryGrid";
import { AboutSection as SWAbout } from "@/components/portfolio-templates/studio-white/AboutSection";
import { ContactSection as SWContact } from "@/components/portfolio-templates/studio-white/ContactSection";

// watercolor-soft
import WCHeader from "@/components/portfolio-templates/watercolor-soft/Header";
import WCHero from "@/components/portfolio-templates/watercolor-soft/HeroSection";
import WCWorks from "@/components/portfolio-templates/watercolor-soft/WorksSection";
import WCAbout from "@/components/portfolio-templates/watercolor-soft/AboutSection";
import WCContact from "@/components/portfolio-templates/watercolor-soft/ContactSection";
import WCFooter from "@/components/portfolio-templates/watercolor-soft/Footer";

export default function PreviewPage({
  params,
}: {
  params: Promise<{ templateId: string }>;
}) {
  const { templateId } = use(params);
  const [siteData, setSiteData] = useState<SiteData | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("preview-data");
    if (raw) {
      setSiteData(JSON.parse(raw));
    }
  }, []);

  if (!siteData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        プレビューデータを読み込み中...
      </div>
    );
  }

  const content = renderTemplate(templateId, siteData);
  if (!content) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        このテンプレートのプレビューは準備中です
      </div>
    );
  }

  return <SiteDataProvider data={siteData}>{content}</SiteDataProvider>;
}

function renderTemplate(templateId: string, sd: SiteData) {
  switch (templateId) {
    case "comic-panel":
      return (
        <div className="comic-panel-template" style={{ "--cp-bg": sd.colorBackground || "#FFFEF5", "--cp-surface": "#FFFFFF", "--cp-text": "#1A1A1A", "--cp-text-muted": "#666666", "--cp-red": sd.colorPrimary || "#E63946", "--cp-blue": sd.colorAccent || "#2563EB", "--cp-yellow": "#FFC107", "--cp-border": "#1A1A1A", backgroundColor: sd.colorBackground || "#FFFEF5" } as React.CSSProperties}>
          <ComicHeader /><main><ComicHero /><ComicWorks /><ComicAbout /><ComicContact /></main><ComicFooter />
        </div>
      );
    case "cyber-neon":
      return (
        <div className="cyber-neon-template" style={{ "--cn-bg": "#0A0A14", "--cn-surface": "#12121F", "--cn-text": "#E0E0FF", "--cn-text-muted": "#6B6B8D", "--cn-cyan": sd.colorPrimary || "#00F0FF", "--cn-magenta": sd.colorAccent || "#FF00E5", "--cn-lime": "#BFFF00", "--cn-border": "rgba(0, 240, 255, 0.15)" } as React.CSSProperties}>
          <CyberNav /><main className="tpl-snap-container"><CyberHero /><CyberWorks /><CyberAbout /><CyberContact /></main><CyberFooter />
        </div>
      );
    case "dark-elegance":
      return (
        <div className="dark-elegance-template" style={{ "--de-bg": sd.colorBackground || "#0D0D0D", "--de-surface": "#1A1A1A", "--de-text": "#F0EDE6", "--de-text-muted": "#7A7770", "--de-gold": sd.colorPrimary || "#C9A96E", "--de-gold-light": "#E4D5B7", "--de-border": "rgba(201, 169, 110, 0.2)", position: "relative", width: "100%", minHeight: "100vh", background: "var(--de-bg)", color: "var(--de-text)" } as React.CSSProperties}>
          <DEHero /><DEContact />
        </div>
      );
    case "floating-gallery":
      return (
        <div className="floating-gallery-template" style={{ "--fg-bg": "#111118", "--fg-surface": "#1C1C26", "--fg-text": "#E8E8F0", "--fg-text-muted": "#7878A0", "--fg-accent": sd.colorPrimary || "#6C63FF", "--fg-accent-light": sd.colorAccent || "#A5A0FF", "--fg-border": "rgba(108, 99, 255, 0.15)", fontFamily: "'Inter', 'Hiragino Sans', 'Noto Sans JP', system-ui, sans-serif", color: "var(--fg-text)" } as React.CSSProperties}>
          <FGBar /><main><FGHero /><FGGallery /><FGAbout /><FGContact /></main><FGFooter />
        </div>
      );
    case "ink-wash":
      return (
        <div className="ink-wash-template" style={{ "--color-bg": sd.colorBackground || "#F5F0E8", "--color-surface": "#FEFCF7", "--color-text": "#2C2C2C", "--color-text-muted": "#8B8578", "--color-accent": sd.colorPrimary || "#C73E3A", "--color-accent-secondary": sd.colorAccent || "#3D6B5E", "--color-border": "#D5CBBB", backgroundColor: "var(--color-bg)", color: "var(--color-text)", fontFamily: "'Hiragino Mincho ProN', 'Yu Mincho', 'YuMincho', 'Noto Serif JP', Georgia, serif", minHeight: "100vh" } as React.CSSProperties}>
          <IWHeader /><main><IWHero /><IWWorks /><IWAbout /><IWContact /></main><IWFooter />
        </div>
      );
    case "mosaic-bold":
      return (
        <div className="mosaic-bold-template" style={{ "--mb-bg": "#F5F5F5", "--mb-surface": "#FFFFFF", "--mb-text": "#0A0A0A", "--mb-text-muted": "#6B6B6B", "--mb-accent": sd.colorPrimary || "#FF3D00", "--mb-border": "#0A0A0A" } as React.CSSProperties}>
          <MBHeader /><main style={{ background: "var(--mb-bg)" }}><MBHero /><MBWorks /><MBAbout /><MBContact /></main><MBFooter />
        </div>
      );
    case "pastel-pop":
      return (
        <div className="pastel-pop-template" style={{ "--color-bg": sd.colorBackground || "#FFF5F9", "--color-surface": "#FFFFFF", "--color-text": "#4A3548", "--color-text-muted": "#B89AB5", "--color-accent": sd.colorPrimary || "#FF7EB3", "--color-accent-blue": sd.colorAccent || "#7EC8E3", "--color-accent-yellow": "#FFE066", "--color-accent-mint": "#A8E6CF", "--color-border": "#F0E0EB", backgroundColor: sd.colorBackground || "#FFF5F9" } as React.CSSProperties}>
          <PPHeader /><main><PPHero /><PPGallery /><PPAbout /><PPContact /></main><PPFooter />
        </div>
      );
    case "retro-pop":
      return (
        <div className="retro-pop-template" style={{ "--rp-bg": sd.colorBackground || "#FFFDF0", "--rp-surface": "#FFFFFF", "--rp-text": "#1A1A2E", "--rp-text-muted": "#7A7A8E", "--rp-orange": sd.colorPrimary || "#FF6B35", "--rp-teal": sd.colorAccent || "#00B4D8", "--rp-yellow": "#FFD166", "--rp-pink": "#EF476F", "--rp-border": "#1A1A2E", backgroundColor: sd.colorBackground || "#FFFDF0" } as React.CSSProperties}>
          <RPHeader /><main><RPHero /><RPWorks /><RPAbout /><RPContact /></main><RPFooter />
        </div>
      );
    case "studio-white":
      return (
        <div className="studio-white-template" style={{ "--sw-bg": "#FAFAFA", "--sw-surface": "#FFFFFF", "--sw-text": "#1A1A1A", "--sw-text-muted": "#999999", "--sw-accent": sd.colorPrimary || "#000000", "--sw-border": "#EEEEEE", background: "var(--sw-bg)", minHeight: "100vh", color: "var(--sw-text)" } as React.CSSProperties}>
          <SWNav /><main style={{ marginLeft: "60px", transition: "margin-left 0.3s ease" }}><SWHero /><SWGallery works={[]} onOpen={() => {}} /><SWAbout /><SWContact /></main>
        </div>
      );
    case "watercolor-soft":
      return (
        <div className="watercolor-soft-template" style={{ "--wc-bg": sd.colorBackground || "#F8F5F0", "--wc-surface": "#FFFFFF", "--wc-text": "#3D3D3D", "--wc-text-muted": "#9B9B9B", "--wc-blue": sd.colorPrimary || "#7FB5D5", "--wc-green": sd.colorAccent || "#8FBFA0", "--wc-pink": "#E8B4C8", "--wc-peach": "#F0C9A6", "--wc-border": "#E8E2DB", backgroundColor: sd.colorBackground || "#F8F5F0" } as React.CSSProperties}>
          <WCHeader /><main><WCHero /><WCWorks /><WCAbout /><WCContact /></main><WCFooter />
        </div>
      );
    default:
      return null;
  }
}
