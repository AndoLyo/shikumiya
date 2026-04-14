"use client";

import {
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ChevronDown,
  Loader2,
  Send,
  Sparkles,
  Image as ImageIcon,
  User,
  Palette,
  Mail,
  LayoutGrid,
  AlertCircle,
  CheckCircle,
  Shield,
  Clock,
  Upload,
  X,
  Plus,
  Crown,
  Monitor,
  Smartphone,
  Wand2,
  Save,
  HelpCircle,
  Wrench,
} from "lucide-react";
import {
  getTemplateForm,
  getEditableFields,
  type FormField,
  type SectionDef,
} from "@/lib/template-forms";
import { SiteDataProvider } from "@/lib/SiteDataContext";
import type { SiteData } from "@/lib/site-data";

// ─── Template component imports ───────────────────────────
import ComicHeader from "@/components/portfolio-templates/comic-panel/Header";
import ComicHero from "@/components/portfolio-templates/comic-panel/HeroSection";
import ComicWorks from "@/components/portfolio-templates/comic-panel/WorksSection";
import ComicAbout from "@/components/portfolio-templates/comic-panel/AboutSection";
import ComicContact from "@/components/portfolio-templates/comic-panel/ContactSection";
import ComicFooter from "@/components/portfolio-templates/comic-panel/Footer";
import { FloatingNav as CyberNav } from "@/components/portfolio-templates/cyber-neon/FloatingNav";
import { HeroSection as CyberHero } from "@/components/portfolio-templates/cyber-neon/HeroSection";
import { WorksSection as CyberWorks } from "@/components/portfolio-templates/cyber-neon/WorksSection";
import { AboutSection as CyberAbout } from "@/components/portfolio-templates/cyber-neon/AboutSection";
import { ContactSection as CyberContact } from "@/components/portfolio-templates/cyber-neon/ContactSection";
import { Footer as CyberFooter } from "@/components/portfolio-templates/cyber-neon/Footer";
import { HeroSection as DEHero } from "@/components/portfolio-templates/dark-elegance/HeroSection";
import { ContactSection as DEContact } from "@/components/portfolio-templates/dark-elegance/ContactSection";
import { MinimalBar as FGBar } from "@/components/portfolio-templates/floating-gallery/MinimalBar";
import { HeroSection as FGHero } from "@/components/portfolio-templates/floating-gallery/HeroSection";
import { GallerySection as FGGallery } from "@/components/portfolio-templates/floating-gallery/GallerySection";
import { AboutSection as FGAbout } from "@/components/portfolio-templates/floating-gallery/AboutSection";
import { ContactSection as FGContact } from "@/components/portfolio-templates/floating-gallery/ContactSection";
import { Footer as FGFooter } from "@/components/portfolio-templates/floating-gallery/Footer";
import IWHeader from "@/components/portfolio-templates/ink-wash/Header";
import IWHero from "@/components/portfolio-templates/ink-wash/HeroSection";
import IWWorks from "@/components/portfolio-templates/ink-wash/WorksSection";
import IWAbout from "@/components/portfolio-templates/ink-wash/AboutSection";
import IWContact from "@/components/portfolio-templates/ink-wash/ContactSection";
import IWFooter from "@/components/portfolio-templates/ink-wash/Footer";
import { Header as MBHeader } from "@/components/portfolio-templates/mosaic-bold/Header";
import { HeroSection as MBHero } from "@/components/portfolio-templates/mosaic-bold/HeroSection";
import { WorksSection as MBWorks } from "@/components/portfolio-templates/mosaic-bold/WorksSection";
import { AboutSection as MBAbout } from "@/components/portfolio-templates/mosaic-bold/AboutSection";
import { ContactSection as MBContact } from "@/components/portfolio-templates/mosaic-bold/ContactSection";
import { Footer as MBFooter } from "@/components/portfolio-templates/mosaic-bold/Footer";
import PPHeader from "@/components/portfolio-templates/pastel-pop/Header";
import PPHero from "@/components/portfolio-templates/pastel-pop/HeroSection";
import PPGallery from "@/components/portfolio-templates/pastel-pop/GallerySection";
import PPAbout from "@/components/portfolio-templates/pastel-pop/AboutSection";
import PPContact from "@/components/portfolio-templates/pastel-pop/ContactSection";
import PPFooter from "@/components/portfolio-templates/pastel-pop/Footer";
import RPHeader from "@/components/portfolio-templates/retro-pop/Header";
import RPHero from "@/components/portfolio-templates/retro-pop/HeroSection";
import RPWorks from "@/components/portfolio-templates/retro-pop/WorksSection";
import RPAbout from "@/components/portfolio-templates/retro-pop/AboutSection";
import RPContact from "@/components/portfolio-templates/retro-pop/ContactSection";
import RPFooter from "@/components/portfolio-templates/retro-pop/Footer";
import { SideNav as SWNav } from "@/components/portfolio-templates/studio-white/SideNav";
import { HeroSection as SWHero } from "@/components/portfolio-templates/studio-white/HeroSection";
import { GalleryGrid as SWGallery } from "@/components/portfolio-templates/studio-white/GalleryGrid";
import { AboutSection as SWAbout } from "@/components/portfolio-templates/studio-white/AboutSection";
import { ContactSection as SWContact } from "@/components/portfolio-templates/studio-white/ContactSection";
import WCHeader from "@/components/portfolio-templates/watercolor-soft/Header";
import WCHero from "@/components/portfolio-templates/watercolor-soft/HeroSection";
import WCWorks from "@/components/portfolio-templates/watercolor-soft/WorksSection";
import WCAbout from "@/components/portfolio-templates/watercolor-soft/AboutSection";
import WCContact from "@/components/portfolio-templates/watercolor-soft/ContactSection";
import WCFooter from "@/components/portfolio-templates/watercolor-soft/Footer";

// ─── Section icon mapping ──────────────────────────────────
const sectionIcons: Record<string, React.ReactNode> = {
  hero: <Sparkles className="w-4 h-4" />,
  works: <ImageIcon className="w-4 h-4" />,
  about: <User className="w-4 h-4" />,
  contact: <Mail className="w-4 h-4" />,
  style: <Palette className="w-4 h-4" />,
  skills: <Wrench className="w-4 h-4" />,
  stats: <Crown className="w-4 h-4" />,
  categories: <LayoutGrid className="w-4 h-4" />,
  tools: <Wrench className="w-4 h-4" />,
};

// ─── Types ──────────────────────────────────────────────────
interface OrderData {
  valid: boolean;
  artistName: string;
  template: string;
  templateName?: string;
  plan: string;
  siteUrl: string;
  editsUsed: number;
  currentValues?: Record<string, string>;
}

// ─── Build SiteData from currentValues + changes ────────────
function buildSiteData(
  currentValues: Record<string, string>,
  changes: Record<string, string>,
): SiteData {
  const merged = { ...currentValues, ...changes };

  // Parse works from comma-separated base64 or URLs
  const worksRaw = merged.works || "";
  const works = worksRaw
    ? worksRaw.split(",").filter(Boolean).map((src, i) => ({
        src: src.trim(),
        title: `Work ${i + 1}`,
      }))
    : [];

  return {
    artistName: merged.artistName || "Your Name",
    catchcopy: merged.catchcopy || "",
    subtitle: merged.subtitle || "",
    bio: merged.bio || "",
    motto: merged.motto || "",
    email: merged.email || "",
    snsX: merged.snsX || "",
    snsInstagram: merged.snsInstagram || "",
    snsPixiv: merged.snsPixiv || "",
    snsNote: merged.snsNote || "",
    snsOther: merged.snsOther || "",
    works,
    heroImage: merged.heroImage || "",
    profileImage: merged.profileImage || "",
    colorPrimary: merged.colorPrimary || undefined,
    colorAccent: merged.colorAccent || undefined,
    colorBackground: merged.colorBackground || undefined,
    skills: merged.skills ? merged.skills.split(",").map((s) => s.trim()).filter(Boolean) : undefined,
    stats: merged.stats ? merged.stats.split(",").map((s) => s.trim()).filter(Boolean) : undefined,
    tools: merged.tools ? merged.tools.split(",").map((s) => s.trim()).filter(Boolean) : undefined,
    location: merged.location || undefined,
    artStyle: merged.artStyle || undefined,
  };
}

// ─── Template Renderer ──────────────────────────────────────
function TemplatePreview({
  templateId,
  siteData,
}: {
  templateId: string;
  siteData: SiteData;
}) {
  const sd = siteData;

  const tplContent = (() => {
    switch (templateId) {
      case "comic-panel":
        return (
          <div
            className="comic-panel-template"
            style={
              {
                "--cp-bg": sd.colorBackground || "#FFFEF5",
                "--cp-surface": "#FFFFFF",
                "--cp-text": "#1A1A1A",
                "--cp-text-muted": "#666666",
                "--cp-red": sd.colorPrimary || "#E63946",
                "--cp-blue": sd.colorAccent || "#2563EB",
                "--cp-yellow": "#FFC107",
                "--cp-border": "#1A1A1A",
                backgroundColor: sd.colorBackground || "#FFFEF5",
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
        );
      case "cyber-neon":
        return (
          <div
            className="cyber-neon-template"
            style={
              {
                "--cn-bg": "#0A0A14",
                "--cn-surface": "#12121F",
                "--cn-text": "#E0E0FF",
                "--cn-text-muted": "#6B6B8D",
                "--cn-cyan": sd.colorPrimary || "#00F0FF",
                "--cn-magenta": sd.colorAccent || "#FF00E5",
                "--cn-lime": "#BFFF00",
                "--cn-border": "rgba(0, 240, 255, 0.15)",
              } as React.CSSProperties
            }
          >
            <CyberNav />
            <main className="tpl-snap-container">
              <CyberHero />
              <CyberWorks />
              <CyberAbout />
              <CyberContact />
            </main>
            <CyberFooter />
          </div>
        );
      case "dark-elegance":
        return (
          <div
            className="dark-elegance-template"
            style={
              {
                "--de-bg": sd.colorBackground || "#0D0D0D",
                "--de-surface": "#1A1A1A",
                "--de-text": "#F0EDE6",
                "--de-text-muted": "#7A7770",
                "--de-gold": sd.colorPrimary || "#C9A96E",
                "--de-gold-light": "#E4D5B7",
                "--de-border": "rgba(201, 169, 110, 0.2)",
                position: "relative",
                width: "100%",
                minHeight: "100vh",
                background: "var(--de-bg)",
                color: "var(--de-text)",
              } as React.CSSProperties
            }
          >
            <DEHero />
            <DEContact />
          </div>
        );
      case "floating-gallery":
        return (
          <div
            className="floating-gallery-template"
            style={
              {
                "--fg-bg": "#111118",
                "--fg-surface": "#1C1C26",
                "--fg-text": "#E8E8F0",
                "--fg-text-muted": "#7878A0",
                "--fg-accent": sd.colorPrimary || "#6C63FF",
                "--fg-accent-light": sd.colorAccent || "#A5A0FF",
                "--fg-border": "rgba(108, 99, 255, 0.15)",
                color: "var(--fg-text)",
              } as React.CSSProperties
            }
          >
            <FGBar />
            <main>
              <FGHero />
              <FGGallery />
              <FGAbout />
              <FGContact />
            </main>
            <FGFooter />
          </div>
        );
      case "ink-wash":
        return (
          <div
            className="ink-wash-template"
            style={
              {
                "--color-bg": sd.colorBackground || "#F5F0E8",
                "--color-surface": "#FEFCF7",
                "--color-text": "#2C2C2C",
                "--color-text-muted": "#8B8578",
                "--color-accent": sd.colorPrimary || "#C73E3A",
                "--color-accent-secondary": sd.colorAccent || "#3D6B5E",
                "--color-border": "#D5CBBB",
                backgroundColor: "var(--color-bg)",
                color: "var(--color-text)",
                minHeight: "100vh",
              } as React.CSSProperties
            }
          >
            <IWHeader />
            <main>
              <IWHero />
              <IWWorks />
              <IWAbout />
              <IWContact />
            </main>
            <IWFooter />
          </div>
        );
      case "mosaic-bold":
        return (
          <div
            className="mosaic-bold-template"
            style={
              {
                "--mb-bg": "#F5F5F5",
                "--mb-surface": "#FFFFFF",
                "--mb-text": "#0A0A0A",
                "--mb-text-muted": "#6B6B6B",
                "--mb-accent": sd.colorPrimary || "#FF3D00",
                "--mb-border": "#0A0A0A",
              } as React.CSSProperties
            }
          >
            <MBHeader />
            <main style={{ background: "var(--mb-bg)" }}>
              <MBHero />
              <MBWorks />
              <MBAbout />
              <MBContact />
            </main>
            <MBFooter />
          </div>
        );
      case "pastel-pop":
        return (
          <div
            className="pastel-pop-template"
            style={
              {
                "--color-bg": sd.colorBackground || "#FFF5F9",
                "--color-surface": "#FFFFFF",
                "--color-text": "#4A3548",
                "--color-text-muted": "#B89AB5",
                "--color-accent": sd.colorPrimary || "#FF7EB3",
                "--color-accent-blue": sd.colorAccent || "#7EC8E3",
                "--color-accent-yellow": "#FFE066",
                "--color-accent-mint": "#A8E6CF",
                "--color-border": "#F0E0EB",
                backgroundColor: sd.colorBackground || "#FFF5F9",
              } as React.CSSProperties
            }
          >
            <PPHeader />
            <main>
              <PPHero />
              <PPGallery />
              <PPAbout />
              <PPContact />
            </main>
            <PPFooter />
          </div>
        );
      case "retro-pop":
        return (
          <div
            className="retro-pop-template"
            style={
              {
                "--rp-bg": sd.colorBackground || "#FFFDF0",
                "--rp-surface": "#FFFFFF",
                "--rp-text": "#1A1A2E",
                "--rp-text-muted": "#7A7A8E",
                "--rp-orange": sd.colorPrimary || "#FF6B35",
                "--rp-teal": sd.colorAccent || "#00B4D8",
                "--rp-yellow": "#FFD166",
                "--rp-pink": "#EF476F",
                "--rp-border": "#1A1A2E",
                backgroundColor: sd.colorBackground || "#FFFDF0",
              } as React.CSSProperties
            }
          >
            <RPHeader />
            <main>
              <RPHero />
              <RPWorks />
              <RPAbout />
              <RPContact />
            </main>
            <RPFooter />
          </div>
        );
      case "studio-white":
        return (
          <div
            className="studio-white-template"
            style={
              {
                "--sw-bg": "#FAFAFA",
                "--sw-surface": "#FFFFFF",
                "--sw-text": "#1A1A1A",
                "--sw-text-muted": "#999999",
                "--sw-accent": sd.colorPrimary || "#000000",
                "--sw-border": "#EEEEEE",
                background: "var(--sw-bg)",
                minHeight: "100vh",
                color: "var(--sw-text)",
              } as React.CSSProperties
            }
          >
            <SWNav />
            <main style={{ marginLeft: "60px" }}>
              <SWHero />
              <SWGallery works={[]} onOpen={() => {}} />
              <SWAbout />
              <SWContact />
            </main>
          </div>
        );
      case "watercolor-soft":
        return (
          <div
            className="watercolor-soft-template"
            style={
              {
                "--wc-bg": sd.colorBackground || "#F8F5F0",
                "--wc-surface": "#FFFFFF",
                "--wc-text": "#3D3D3D",
                "--wc-text-muted": "#9B9B9B",
                "--wc-blue": sd.colorPrimary || "#7FB5D5",
                "--wc-green": sd.colorAccent || "#8FBFA0",
                "--wc-pink": "#E8B4C8",
                "--wc-peach": "#F0C9A6",
                "--wc-border": "#E8E2DB",
                backgroundColor: sd.colorBackground || "#F8F5F0",
              } as React.CSSProperties
            }
          >
            <WCHeader />
            <main>
              <WCHero />
              <WCWorks />
              <WCAbout />
              <WCContact />
            </main>
            <WCFooter />
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center h-64 text-white/40 text-sm">
            このテンプレートのプレビューは準備中です
          </div>
        );
    }
  })();

  return <SiteDataProvider data={sd}>{tplContent}</SiteDataProvider>;
}

// ─── Tooltip Component ──────────────────────────────────────
function Tooltip({ text }: { text: string }) {
  const [show, setShow] = useState(false);

  return (
    <span className="relative inline-flex ml-1.5">
      <button
        type="button"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        className="text-white/20 hover:text-white/40 transition-colors"
        aria-label="ヘルプ"
      >
        <HelpCircle className="w-3.5 h-3.5" />
      </button>
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 px-3 py-2 rounded-lg bg-[#1a1a2e] border border-white/[0.1] text-white/70 text-xs leading-relaxed z-50 shadow-xl pointer-events-none"
          >
            {text}
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}

// ─── Tag Input Component ────────────────────────────────────
function TagInput({
  value,
  onChange,
  placeholder,
  disabled,
  max,
}: {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  disabled: boolean;
  max?: number;
}) {
  const [inputVal, setInputVal] = useState("");
  const tags = value
    ? value
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  function addTag() {
    const trimmed = inputVal.trim();
    if (!trimmed) return;
    if (max && tags.length >= max) return;
    if (tags.includes(trimmed)) return;
    onChange([...tags, trimmed].join(", "));
    setInputVal("");
  }

  function removeTag(index: number) {
    onChange(tags.filter((_, i) => i !== index).join(", "));
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5">
        {tags.map((tag, i) => (
          <span
            key={`${tag}-${i}`}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#00e5ff]/10 text-[#00e5ff] text-xs font-medium"
          >
            {tag}
            {!disabled && (
              <button
                type="button"
                onClick={() => removeTag(i)}
                className="hover:text-white transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </span>
        ))}
      </div>
      {!disabled && (!max || tags.length < max) && (
        <div className="flex gap-2">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTag();
              }
            }}
            placeholder={placeholder}
            className="flex-1 bg-white/[0.03] border border-white/[0.08] rounded-lg px-3 py-2 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#00e5ff]/50 transition-all"
          />
          <button
            type="button"
            onClick={addTag}
            className="px-3 py-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-white/50 hover:text-white transition-all"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      )}
      {max && (
        <p className="text-white/20 text-xs">
          {tags.length} / {max}
        </p>
      )}
    </div>
  );
}

// ─── Image Upload Component ─────────────────────────────────
function ImageUploadField({
  field,
  value,
  onChange,
  disabled,
}: {
  field: FormField;
  value: string;
  onChange: (val: string) => void;
  disabled: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<string[]>(
    value ? value.split(",").filter(Boolean) : [],
  );
  const isMultiple = field.type === "images";
  const maxFiles = field.max || 10;

  function handleFiles(files: FileList | null) {
    if (!files) return;
    const newPreviews: string[] = [];
    Array.from(files).forEach((file) => {
      if (isMultiple && previews.length + newPreviews.length >= maxFiles) return;
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        newPreviews.push(dataUrl);
        if (
          newPreviews.length ===
          Math.min(files.length, maxFiles - previews.length)
        ) {
          const all = isMultiple ? [...previews, ...newPreviews] : newPreviews;
          setPreviews(all);
          onChange(all.join(","));
        }
      };
      reader.readAsDataURL(file);
    });
  }

  function removeImage(index: number) {
    const next = previews.filter((_, i) => i !== index);
    setPreviews(next);
    onChange(next.join(","));
  }

  return (
    <div className="space-y-2">
      {previews.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {previews.map((src, i) => (
            <div
              key={i}
              className="relative group w-16 h-16 rounded-lg overflow-hidden border border-white/[0.1] bg-white/[0.03]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`upload-${i}`}
                className="w-full h-full object-cover"
              />
              {!disabled && (
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                >
                  <X className="w-3.5 h-3.5 text-white" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {!disabled && (!isMultiple || previews.length < maxFiles) && (
        <>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple={isMultiple}
            onChange={(e) => handleFiles(e.target.files)}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-dashed border-white/[0.12] hover:border-[#00e5ff]/40 bg-white/[0.02] hover:bg-white/[0.04] text-white/40 hover:text-white/60 transition-all text-xs w-full justify-center"
          >
            <Upload className="w-3.5 h-3.5" />
            {isMultiple
              ? `画像を追加（残り${maxFiles - previews.length}枚）`
              : "画像をアップロード"}
          </button>
        </>
      )}
    </div>
  );
}

// ─── Field Input (compact version for side panel) ───────────
function FieldInput({
  field,
  value,
  originalValue,
  onChange,
  disabled,
}: {
  field: FormField;
  value: string;
  originalValue: string;
  onChange: (val: string) => void;
  disabled: boolean;
}) {
  const isChanged = value !== originalValue;
  const borderClass = isChanged
    ? "border-[#00e5ff]/40 ring-1 ring-[#00e5ff]/20"
    : "border-white/[0.08]";

  const baseClasses = `w-full bg-white/[0.03] border ${borderClass} rounded-lg px-3 py-2.5 text-white placeholder:text-white/20 focus:outline-none focus:border-[#00e5ff]/50 focus:ring-1 focus:ring-[#00e5ff]/30 transition-all text-sm disabled:opacity-30 disabled:cursor-not-allowed`;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center">
        <label className="text-xs font-medium text-white/60 flex items-center">
          {field.label}
          {field.required && <span className="text-[#00e5ff] ml-1">*</span>}
          {isChanged && (
            <span className="ml-1.5 w-1.5 h-1.5 rounded-full bg-[#00e5ff] inline-block" />
          )}
        </label>
        {field.help && <Tooltip text={field.help} />}
      </div>

      {field.type === "textarea" ? (
        <div className="relative">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            maxLength={field.maxLength}
            rows={3}
            disabled={disabled}
            className={`${baseClasses} resize-none`}
          />
          {field.maxLength && (
            <span className="absolute bottom-1.5 right-2 text-[10px] text-white/20">
              {value.length} / {field.maxLength}
            </span>
          )}
        </div>
      ) : field.type === "color" ? (
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={value || "#00e5ff"}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className="w-10 h-10 rounded-lg border border-white/[0.08] cursor-pointer disabled:opacity-30 bg-transparent p-0.5"
          />
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="#00e5ff"
            disabled={disabled}
            className={`${baseClasses} flex-1 font-mono text-xs`}
          />
        </div>
      ) : field.type === "select" ? (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`${baseClasses} appearance-none`}
        >
          <option value="">選択してください</option>
          {field.options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : field.type === "image" || field.type === "images" ? (
        <ImageUploadField
          field={field}
          value={value}
          onChange={onChange}
          disabled={disabled}
        />
      ) : field.type === "tags" ? (
        <TagInput
          value={value}
          onChange={onChange}
          placeholder={field.placeholder}
          disabled={disabled}
          max={field.max}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          maxLength={field.maxLength}
          disabled={disabled}
          className={baseClasses}
        />
      )}
    </div>
  );
}

// ─── Confetti seed generator (pure) ─────────────────────────
function generateConfettiParticles() {
  const colors = ["#00e5ff", "#8b5cf6", "#ec4899", "#10b981", "#f59e0b"];
  return Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: ((i * 7 + 13) % 100),
    delay: (i % 10) * 0.05,
    duration: 1.5 + (i % 5) * 0.3,
    color: colors[i % 5],
    size: 4 + (i % 7),
  }));
}

const confettiParticles = generateConfettiParticles();

// ─── Confetti Effect ────────────────────────────────────────
function ConfettiEffect() {
  const particles = confettiParticles;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: -20, x: `${p.x}vw`, opacity: 1, scale: 1 }}
          animate={{
            y: "110vh",
            rotate: ((p.id * 53 + 17) % 720) - 360,
            opacity: 0,
            scale: 0.5,
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: "easeOut",
          }}
          className="absolute rounded-sm"
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
          }}
        />
      ))}
    </div>
  );
}

// ─── Loading Skeleton ───────────────────────────────────────
function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className="w-8 h-8 text-[#00e5ff] animate-spin mx-auto" />
        <p className="text-white/40 text-sm">エディタを読み込み中...</p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// Main Editor Page
// ═══════════════════════════════════════════════════════════
export default function MemberEditPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;

  // ─── State ──────────────────────────────────────────────
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [changes, setChanges] = useState<Record<string, string>>({});
  const [aiRequest, setAiRequest] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [viewMode, setViewMode] = useState<"pc" | "mobile">("pc");
  const [showConfetti, setShowConfetti] = useState(false);
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [panelCollapsed, setPanelCollapsed] = useState(false);

  const getEmail = useCallback(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("memberEmail") || "";
    }
    return "";
  }, []);

  // ─── Fetch order data ──────────────────────────────────
  useEffect(() => {
    async function fetchOrder() {
      const email = getEmail();
      if (!email) {
        router.push("/member");
        return;
      }

      try {
        const res = await fetch(
          `/api/member/${encodeURIComponent(orderId)}?email=${encodeURIComponent(email)}`,
        );
        const data = await res.json();

        if (!res.ok || !data.valid) {
          setError(data.error || "データの取得に失敗しました");
          return;
        }

        setOrderData(data);

        // Open all sections by default in editor
        const form = getTemplateForm(data.template);
        if (form) {
          const initial: Record<string, boolean> = {};
          form.sectionDefs.forEach((s) => {
            initial[s.id] = true;
          });
          setOpenSections(initial);
        }
      } catch {
        setError("通信エラーが発生しました");
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [orderId, router, getEmail]);

  // ─── Derived state ────────────────────────────────────
  const maxEdits = orderData?.plan === "omakase-pro" ? 999 : orderData?.plan === "omakase" ? 3 : 0;
  const editsUsed = orderData?.editsUsed || 0;
  const editsRemaining = maxEdits - editsUsed;
  const canEdit = editsRemaining > 0;
  const changedCount = Object.keys(changes).length;
  const hasAiRequest = aiRequest.trim().length > 0;
  const isOmakase = orderData?.plan === "omakase" || orderData?.plan === "omakase-pro";

  const templateForm = orderData ? getTemplateForm(orderData.template) : null;
  const sections: SectionDef[] = templateForm?.sectionDefs || [];

  // Build live SiteData for preview
  const siteData = orderData
    ? buildSiteData(orderData.currentValues || {}, changes)
    : null;

  // ─── Handlers ─────────────────────────────────────────
  function handleFieldChange(fieldId: string, value: string) {
    setChanges((prev) => {
      const next = { ...prev };
      if (value === (orderData?.currentValues?.[fieldId] || "")) {
        delete next[fieldId];
      } else {
        next[fieldId] = value;
      }
      return next;
    });
  }

  function toggleSection(sectionId: string) {
    setOpenSections((prev) => ({ ...prev, [sectionId]: !prev[sectionId] }));
  }

  function getFieldsBySection(section: string): FormField[] {
    if (!orderData) return [];
    return getEditableFields(orderData.template, section);
  }

  function sectionChangeCount(sectionId: string): number {
    const fields = getFieldsBySection(sectionId);
    return fields.filter((f) => changes[f.id] !== undefined).length;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canEdit || (changedCount === 0 && !hasAiRequest)) return;

    setSubmitting(true);
    setSubmitResult(null);

    try {
      const res = await fetch("/api/member/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          email: getEmail(),
          changes,
          requests: aiRequest,
        }),
      });

      const data = await res.json();
      setSubmitResult({
        success: data.success,
        message: data.message || data.error || "不明なエラー",
      });

      if (data.success) {
        setChanges({});
        setAiRequest("");
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
        if (orderData) {
          setOrderData({
            ...orderData,
            editsUsed: (orderData.editsUsed || 0) + 1,
            currentValues: {
              ...orderData.currentValues,
              ...changes,
            },
          });
        }
      }
    } catch {
      setSubmitResult({
        success: false,
        message: "通信エラーが発生しました",
      });
    } finally {
      setSubmitting(false);
    }
  }

  // ─── Loading ──────────────────────────────────────────
  if (loading) return <LoadingSkeleton />;

  // ─── Error ────────────────────────────────────────────
  if (error || !orderData) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6 max-w-sm"
        >
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
          <div className="space-y-2">
            <h2 className="text-white font-bold text-lg">
              エラーが発生しました
            </h2>
            <p className="text-white/50 text-sm">
              {error || "データを取得できませんでした"}
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-white text-sm font-medium transition-all"
            >
              再読み込み
            </button>
            <Link
              href={`/member/${orderId}`}
              className="inline-flex items-center justify-center gap-1.5 text-[#00e5ff] hover:underline text-sm"
            >
              ダッシュボードに戻る
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════
  // Render
  // ═══════════════════════════════════════════════════════
  return (
    <div className="h-screen flex flex-col bg-[#0a0a0f] overflow-hidden">
      {/* Confetti */}
      <AnimatePresence>{showConfetti && <ConfettiEffect />}</AnimatePresence>

      {/* ─── Sticky Toolbar ──────────────────────────────── */}
      <header className="shrink-0 z-40 border-b border-white/[0.06] bg-[#0a0a0f]/95 backdrop-blur-xl">
        <div className="px-4 py-2.5 flex items-center justify-between gap-3">
          {/* Left: back + title */}
          <div className="flex items-center gap-2 min-w-0">
            <Link
              href={`/member/${orderId}`}
              className="p-1.5 -ml-1.5 rounded-lg text-white/40 hover:text-white/70 hover:bg-white/[0.05] transition-all shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="min-w-0">
              <h1 className="text-white font-bold text-sm truncate">
                {orderData.artistName}
              </h1>
              <p className="text-white/30 text-[11px] truncate">
                {templateForm?.nameJa || orderData.template}
              </p>
            </div>
          </div>

          {/* Center: device toggle */}
          <div className="hidden sm:flex items-center gap-1 bg-white/[0.04] rounded-lg p-0.5">
            <button
              type="button"
              onClick={() => setViewMode("pc")}
              className={`p-1.5 rounded-md transition-all ${
                viewMode === "pc"
                  ? "bg-white/[0.1] text-white"
                  : "text-white/30 hover:text-white/50"
              }`}
              aria-label="PCプレビュー"
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("mobile")}
              className={`p-1.5 rounded-md transition-all ${
                viewMode === "mobile"
                  ? "bg-white/[0.1] text-white"
                  : "text-white/30 hover:text-white/50"
              }`}
              aria-label="スマホプレビュー"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>

          {/* Right: save + info */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Edits remaining badge */}
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.04] text-white/40 text-[11px]">
              <span className="text-[#00e5ff] font-bold">
                {editsRemaining}
              </span>
              / {maxEdits}回
            </span>

            {/* Save button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting || (changedCount === 0 && !hasAiRequest) || !canEdit}
              className="relative inline-flex items-center gap-1.5 px-4 py-2 rounded-lg font-semibold text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-gradient-to-r from-[#00e5ff] to-[#00b4d8] hover:from-[#33eaff] hover:to-[#00c8e0] text-[#0a0a0f]"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">保存</span>
              {changedCount > 0 && (
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-black/15 text-[11px] font-bold">
                  {changedCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ─── Submit Result Toast ─────────────────────────── */}
      <AnimatePresence>
        {submitResult && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-16 left-1/2 -translate-x-1/2 z-50"
          >
            <div
              className={`flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl border ${
                submitResult.success
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
                  : "bg-red-500/10 border-red-500/20 text-red-300"
              }`}
            >
              {submitResult.success ? (
                <CheckCircle className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <div className="text-sm">
                <p className="font-semibold">
                  {submitResult.success
                    ? "リクエストを受け付けました"
                    : "送信に失敗しました"}
                </p>
                <p className="text-white/40 text-xs mt-0.5">
                  {submitResult.success && hasAiRequest
                    ? "変更はスタッフが確認して反映します"
                    : submitResult.message}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSubmitResult(null)}
                className="p-1 hover:bg-white/10 rounded transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Main Content: Preview + Edit Panel ──────────── */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* ═══ Preview Area ═══════════════════════════════ */}
        <div className="flex-1 overflow-y-auto bg-[#08080d]">
          <div className="flex justify-center p-4 min-h-full">
            <div
              className={`overflow-hidden rounded-xl border border-white/[0.08] bg-white transition-all duration-300 ${
                viewMode === "pc"
                  ? "w-full max-w-[1200px]"
                  : "w-[375px] max-w-full"
              }`}
            >
              {siteData && (
                <TemplatePreview
                  templateId={orderData.template}
                  siteData={siteData}
                />
              )}
            </div>
          </div>
        </div>

        {/* ═══ Edit Panel ════════════════════════════════ */}
        <motion.div
          className={`shrink-0 border-t lg:border-t-0 lg:border-l border-white/[0.06] bg-[#0a0a0f] overflow-hidden flex flex-col ${
            panelCollapsed ? "lg:w-12" : "lg:w-[380px]"
          }`}
          animate={{ width: panelCollapsed ? 48 : undefined }}
          transition={{ duration: 0.2 }}
        >
          {/* Panel collapse toggle (desktop only) */}
          <div className="hidden lg:flex items-center justify-between px-3 py-2 border-b border-white/[0.06]">
            {!panelCollapsed && (
              <span className="text-white/50 text-xs font-semibold">
                編集パネル
              </span>
            )}
            <button
              type="button"
              onClick={() => setPanelCollapsed(!panelCollapsed)}
              className="p-1 rounded-md text-white/30 hover:text-white/60 hover:bg-white/[0.05] transition-all"
              aria-label={panelCollapsed ? "パネルを開く" : "パネルを閉じる"}
            >
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  panelCollapsed ? "rotate-90" : "-rotate-90"
                }`}
              />
            </button>
          </div>

          {/* Panel content */}
          {!panelCollapsed && (
            <div className="flex-1 overflow-y-auto">
              {/* No edits remaining warning */}
              {!canEdit && (
                <div className="mx-3 mt-3 p-3 rounded-lg border border-amber-500/20 bg-amber-500/[0.06]">
                  <p className="text-amber-200 text-xs font-semibold">
                    編集回数の上限に達しました
                  </p>
                  {!isOmakase && (
                    <p className="text-white/30 text-[11px] mt-1">
                      おまかせプランで毎月3回まで編集可能
                    </p>
                  )}
                </div>
              )}

              {/* Sections */}
              <form
                onSubmit={handleSubmit}
                className="p-3 space-y-2"
              >
                {sections.map((sectionDef) => {
                  const fields = getFieldsBySection(sectionDef.id);
                  if (fields.length === 0) return null;

                  const isOpen = openSections[sectionDef.id] || false;
                  const sectionChanges = sectionChangeCount(sectionDef.id);
                  const icon = sectionIcons[sectionDef.id] || (
                    <LayoutGrid className="w-4 h-4" />
                  );

                  return (
                    <div
                      key={sectionDef.id}
                      className={`rounded-xl border overflow-hidden transition-colors ${
                        sectionChanges > 0
                          ? "border-[#00e5ff]/20 bg-[#00e5ff]/[0.02]"
                          : "border-white/[0.06] bg-white/[0.02]"
                      }`}
                    >
                      {/* Section header */}
                      <button
                        type="button"
                        onClick={() => toggleSection(sectionDef.id)}
                        className="w-full flex items-center justify-between px-3 py-2.5 text-left hover:bg-white/[0.02] transition-all"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                              sectionChanges > 0
                                ? "bg-[#00e5ff]/10 text-[#00e5ff]"
                                : "bg-white/[0.05] text-white/40"
                            }`}
                          >
                            {icon}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-semibold text-xs text-white">
                                {sectionDef.label}
                              </span>
                              {sectionChanges > 0 && (
                                <span className="w-1.5 h-1.5 rounded-full bg-[#00e5ff]" />
                              )}
                            </div>
                          </div>
                        </div>
                        <motion.div
                          animate={{ rotate: isOpen ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                          className="text-white/20"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </motion.div>
                      </button>

                      {/* Section fields */}
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{
                              duration: 0.2,
                              ease: "easeInOut",
                            }}
                            className="overflow-hidden"
                          >
                            <div className="px-3 pb-3 space-y-3 border-t border-white/[0.04]">
                              <div className="pt-3 space-y-3">
                                {fields.map((field) => (
                                  <FieldInput
                                    key={field.id}
                                    field={field}
                                    value={
                                      changes[field.id] ??
                                      orderData.currentValues?.[field.id] ??
                                      ""
                                    }
                                    originalValue={
                                      orderData.currentValues?.[field.id] ?? ""
                                    }
                                    onChange={(val) =>
                                      handleFieldChange(field.id, val)
                                    }
                                    disabled={!canEdit}
                                  />
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}

                {/* ═══ AI Request Panel (omakase only) ═══════ */}
                {isOmakase && canEdit && (
                  <div className="rounded-xl border border-purple-500/20 bg-purple-500/[0.03] overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setShowAiPanel(!showAiPanel)}
                      className="w-full flex items-center justify-between px-3 py-2.5 text-left hover:bg-white/[0.02] transition-all"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-purple-500/10 text-purple-400">
                          <Wand2 className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-semibold text-xs text-white">
                            AIに要望を伝える
                          </span>
                          <span className="ml-1.5 px-1.5 py-0.5 rounded text-[10px] bg-purple-500/20 text-purple-300 font-medium">
                            おまかせ限定
                          </span>
                        </div>
                      </div>
                      <motion.div
                        animate={{ rotate: showAiPanel ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="text-white/20"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </motion.div>
                    </button>

                    <AnimatePresence>
                      {showAiPanel && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-3 pb-3 border-t border-purple-500/10 pt-3 space-y-2">
                            <p className="text-white/30 text-[11px] leading-relaxed">
                              例: 全体を暖かい雰囲気にしてほしい、フォントをもっと太くしてほしい、レイアウトを変えたい、等
                            </p>
                            <textarea
                              value={aiRequest}
                              onChange={(e) => setAiRequest(e.target.value)}
                              placeholder="自由に要望をお書きください..."
                              rows={4}
                              className="w-full bg-white/[0.03] border border-purple-500/20 rounded-lg px-3 py-2.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-purple-400/50 focus:ring-1 focus:ring-purple-400/20 transition-all resize-none"
                            />
                            {hasAiRequest && (
                              <p className="text-purple-300/60 text-[11px] flex items-center gap-1">
                                <Shield className="w-3 h-3" />
                                スタッフが確認して反映します
                              </p>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* ═══ Submit Note (mobile) ═══════════════════ */}
                {canEdit && (changedCount > 0 || hasAiRequest) && (
                  <div className="pt-2 space-y-3">
                    {/* Mobile save button */}
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full lg:hidden inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-sm transition-all bg-gradient-to-r from-[#00e5ff] to-[#00b4d8] text-[#0a0a0f] disabled:opacity-50"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          送信中...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          変更をリクエスト
                          {changedCount > 0 && (
                            <span className="px-2 py-0.5 rounded-md bg-black/10 text-xs font-bold">
                              {changedCount}件
                            </span>
                          )}
                        </>
                      )}
                    </button>

                    <div className="flex items-center justify-center gap-3 text-white/20 text-[11px]">
                      <span className="inline-flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        スタッフ確認後に反映
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        1〜2営業日
                      </span>
                    </div>

                    <p className="text-center text-white/15 text-[11px]">
                      残り{" "}
                      <span className="text-[#00e5ff]/60">
                        {editsRemaining}
                      </span>{" "}
                      →{" "}
                      <span className="text-white/30">
                        {editsRemaining - 1}
                      </span>
                    </p>
                  </div>
                )}
              </form>

              {/* Footer links */}
              <div className="px-3 py-4 border-t border-white/[0.04] flex items-center gap-3 text-[11px]">
                <Link
                  href={`/member/${orderId}`}
                  className="text-white/20 hover:text-white/40 transition-colors"
                >
                  ダッシュボード
                </Link>
                <span className="text-white/10">|</span>
                <Link
                  href="/"
                  className="text-white/20 hover:text-white/40 transition-colors"
                >
                  トップページ
                </Link>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
