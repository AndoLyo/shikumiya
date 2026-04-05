"use client";

import { use, useEffect, useState } from "react";
import type { SiteData } from "@/lib/site-data";

// comic-panel components
import { SiteDataProvider } from "@/components/portfolio-templates/comic-panel/SiteDataContext";
import ComicHeader from "@/components/portfolio-templates/comic-panel/Header";
import ComicHero from "@/components/portfolio-templates/comic-panel/HeroSection";
import ComicWorks from "@/components/portfolio-templates/comic-panel/WorksSection";
import ComicAbout from "@/components/portfolio-templates/comic-panel/AboutSection";
import ComicContact from "@/components/portfolio-templates/comic-panel/ContactSection";
import ComicFooter from "@/components/portfolio-templates/comic-panel/Footer";

export default function PreviewPage({
  params,
}: {
  params: Promise<{ templateId: string }>;
}) {
  const { templateId } = use(params);
  const [siteData, setSiteData] = useState<SiteData | null>(null);

  useEffect(() => {
    // Read form data from sessionStorage (set by order form)
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

  // comic-panel template
  if (templateId === "comic-panel") {
    return (
      <SiteDataProvider data={siteData}>
        <div
          className="comic-panel-template"
          style={
            {
              "--cp-bg": siteData.colorBackground || "#FFFEF5",
              "--cp-surface": "#FFFFFF",
              "--cp-text": "#1A1A1A",
              "--cp-text-muted": "#666666",
              "--cp-red": siteData.colorPrimary || "#E63946",
              "--cp-blue": siteData.colorAccent || "#2563EB",
              "--cp-yellow": "#FFC107",
              "--cp-border": "#1A1A1A",
              backgroundColor: siteData.colorBackground || "#FFFEF5",
            } as React.CSSProperties
          }
        >
          <ComicHeader />
          <main>
            <ComicHero />
            <ComicWorks />
            <ComicAbout />
            <ComicContact />
          </main>
          <ComicFooter />
        </div>
      </SiteDataProvider>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white">
      このテンプレートのプレビューは準備中です
    </div>
  );
}
