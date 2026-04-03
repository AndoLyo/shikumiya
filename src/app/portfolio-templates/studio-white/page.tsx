"use client";

import { useState } from "react";
import { SideNav } from "@/components/portfolio-templates/studio-white/SideNav";
import { HeroSection } from "@/components/portfolio-templates/studio-white/HeroSection";
import { GalleryGrid } from "@/components/portfolio-templates/studio-white/GalleryGrid";
import { Lightbox } from "@/components/portfolio-templates/studio-white/Lightbox";
import { AboutSection } from "@/components/portfolio-templates/studio-white/AboutSection";
import { ContactSection } from "@/components/portfolio-templates/studio-white/ContactSection";

export type Work = {
  id: number;
  title: string;
  year: string;
  medium: string;
  gradient: string;
  /** aspect ratio string for lightbox display, e.g. "1/1" | "3/4" | "16/9" */
  ratio: string;
};

export const works: Work[] = [
  /* 4 square */
  {
    id: 1,
    title: "白昼夢",
    year: "2024",
    medium: "AI生成 / デジタル",
    gradient: "linear-gradient(135deg, #e8e0d8 0%, #c9bfb0 100%)",
    ratio: "1/1",
  },
  {
    id: 2,
    title: "無音の庭",
    year: "2024",
    medium: "AI生成 / デジタル",
    gradient: "linear-gradient(150deg, #d4dde4 0%, #b0c4cc 100%)",
    ratio: "1/1",
  },
  {
    id: 3,
    title: "余白",
    year: "2025",
    medium: "AI生成 / デジタル",
    gradient: "linear-gradient(120deg, #e6e2dc 0%, #d0c8bc 100%)",
    ratio: "1/1",
  },
  {
    id: 4,
    title: "静寂の形",
    year: "2025",
    medium: "AI生成 / デジタル",
    gradient: "linear-gradient(160deg, #dde4e0 0%, #bfccc7 100%)",
    ratio: "1/1",
  },
  /* 4 portrait */
  {
    id: 5,
    title: "立像 I",
    year: "2024",
    medium: "AI生成 / コンポジット",
    gradient: "linear-gradient(180deg, #e4ddd6 0%, #c8bfb5 40%, #a89d93 100%)",
    ratio: "3/4",
  },
  {
    id: 6,
    title: "立像 II",
    year: "2024",
    medium: "AI生成 / コンポジット",
    gradient: "linear-gradient(170deg, #d8dfe4 0%, #b8c4cc 50%, #8fa0aa 100%)",
    ratio: "3/4",
  },
  {
    id: 7,
    title: "記憶の柱",
    year: "2025",
    medium: "AI生成 / デジタル",
    gradient: "linear-gradient(175deg, #e0dbd5 0%, #c4bab0 45%, #9d9088 100%)",
    ratio: "3/4",
  },
  {
    id: 8,
    title: "霧の人影",
    year: "2025",
    medium: "AI生成 / デジタル",
    gradient: "linear-gradient(165deg, #dce2e0 0%, #bfcac6 50%, #92a8a3 100%)",
    ratio: "3/4",
  },
  /* 4 landscape */
  {
    id: 9,
    title: "地平線",
    year: "2024",
    medium: "AI生成 / デジタル",
    gradient: "linear-gradient(90deg, #e8e4de 0%, #d0c8bc 35%, #b8b0a4 65%, #e8e4de 100%)",
    ratio: "16/9",
  },
  {
    id: 10,
    title: "原野の朝",
    year: "2024",
    medium: "AI生成 / コンポジット",
    gradient: "linear-gradient(95deg, #dce4e8 0%, #c0cdd5 30%, #a8bbc5 60%, #dce4e8 100%)",
    ratio: "16/9",
  },
  {
    id: 11,
    title: "波打ち際",
    year: "2025",
    medium: "AI生成 / デジタル",
    gradient: "linear-gradient(88deg, #e4e0d8 0%, #ccc4b8 28%, #b0a898 55%, #e4e0d8 100%)",
    ratio: "16/9",
  },
  {
    id: 12,
    title: "日暮れの稜線",
    year: "2025",
    medium: "AI生成 / デジタル",
    gradient: "linear-gradient(92deg, #e2dfe8 0%, #c8c4d4 32%, #aea8c0 60%, #e2dfe8 100%)",
    ratio: "16/9",
  },
];

export default function StudioWhitePage() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <div
      className="studio-white-template"
      style={
        {
          "--sw-bg": "#FAFAFA",
          "--sw-surface": "#FFFFFF",
          "--sw-text": "#1A1A1A",
          "--sw-text-muted": "#999999",
          "--sw-accent": "#000000",
          "--sw-border": "#EEEEEE",
          background: "var(--sw-bg)",
          minHeight: "100vh",
          color: "var(--sw-text)",
        } as React.CSSProperties
      }
    >
      <SideNav />

      {/* Main content shifts right to clear the sidebar */}
      <main
        style={{
          marginLeft: "60px",
          transition: "margin-left 0.3s ease",
        }}
      >
        <HeroSection />
        <GalleryGrid works={works} onOpen={(index) => setLightboxIndex(index)} />
        <AboutSection />
        <ContactSection />
      </main>

      <Lightbox
        works={works}
        activeIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onPrev={() =>
          setLightboxIndex((prev) =>
            prev !== null ? (prev - 1 + works.length) % works.length : null
          )
        }
        onNext={() =>
          setLightboxIndex((prev) =>
            prev !== null ? (prev + 1) % works.length : null
          )
        }
      />
    </div>
  );
}
