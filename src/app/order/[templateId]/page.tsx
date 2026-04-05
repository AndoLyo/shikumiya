"use client";

import { useState, useRef, useCallback, useEffect, use } from "react";
import imageCompression from "browser-image-compression";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  getTemplateForm,
  getImageSpec,
  getColorPresets,
  type SectionDef,
  type FormField,
} from "@/lib/template-forms";
import {
  Check,
  ChevronRight,
  ChevronLeft,
  Upload,
  X,
  ExternalLink,
  Shield,
  Sparkles,
  CreditCard,
  RectangleHorizontal,
  RectangleVertical,
  Square,
} from "lucide-react";
import type { SiteData } from "@/lib/site-data";
import { SiteDataProvider } from "@/components/portfolio-templates/comic-panel/SiteDataContext";
import { useState as usePreviewState } from "react";

// Lazy imports for template preview (comic-panel only for now)
import ComicHeader from "@/components/portfolio-templates/comic-panel/Header";
import ComicHero from "@/components/portfolio-templates/comic-panel/HeroSection";
import ComicWorks from "@/components/portfolio-templates/comic-panel/WorksSection";
import ComicAbout from "@/components/portfolio-templates/comic-panel/AboutSection";
import ComicContact from "@/components/portfolio-templates/comic-panel/ContactSection";
import ComicFooter from "@/components/portfolio-templates/comic-panel/Footer";

// ─── Shared Styles ──────────────────────────────────────────
const inputClass =
  "w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm placeholder:text-text-muted focus:border-primary/50 focus:outline-none transition-colors";
const labelClass = "block text-sm font-medium text-white mb-1";
const helpClass = "text-text-muted text-[10px] mt-1";

// ─── HelpTooltip ────────────────────────────────────────────
// ─── Inline Preview Component ─────────────────────────────
function InlinePreview({ templateId, siteData }: { templateId: string; siteData: SiteData }) {
  const [viewMode, setViewMode] = useState<"pc" | "mobile">("pc");

  // Only comic-panel is supported for now
  const renderTemplate = () => {
    if (templateId === "comic-panel") {
      return (
        <SiteDataProvider data={siteData}>
          <div
            className="comic-panel-template"
            style={{
              "--cp-bg": siteData.colorBackground || "#FFFEF5",
              "--cp-surface": "#FFFFFF",
              "--cp-text": "#1A1A1A",
              "--cp-text-muted": "#666666",
              "--cp-red": siteData.colorPrimary || "#E63946",
              "--cp-blue": siteData.colorAccent || "#2563EB",
              "--cp-yellow": "#FFC107",
              "--cp-border": "#1A1A1A",
              backgroundColor: siteData.colorBackground || "#FFFEF5",
            } as React.CSSProperties}
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
      <div className="flex items-center justify-center h-64 text-text-muted text-sm">
        このテンプレートのプレビューは準備中です
      </div>
    );
  };

  return (
    <div>
      {/* PC / Mobile toggle */}
      <div className="flex justify-center gap-2 mb-4">
        <button
          type="button"
          onClick={() => setViewMode("pc")}
          className={`px-4 py-1.5 rounded-full text-xs transition-colors ${viewMode === "pc" ? "bg-primary text-[#0a0a0f] font-bold" : "bg-white/[0.05] text-text-muted"}`}
        >
          PC
        </button>
        <button
          type="button"
          onClick={() => setViewMode("mobile")}
          className={`px-4 py-1.5 rounded-full text-xs transition-colors ${viewMode === "mobile" ? "bg-primary text-[#0a0a0f] font-bold" : "bg-white/[0.05] text-text-muted"}`}
        >
          スマホ
        </button>
      </div>

      {/* Preview container */}
      <div className="flex justify-center">
        <div
          className={`overflow-hidden rounded-xl border border-white/[0.1] transition-all duration-300 ${
            viewMode === "pc" ? "w-full" : "w-[375px] max-w-full"
          }`}
        >
          <div
            className="overflow-y-auto"
            style={{ maxHeight: "70vh" }}
          >
            {renderTemplate()}
          </div>
        </div>
      </div>
    </div>
  );
}

function HelpTooltip({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  return (
    <span className="relative inline-block ml-1">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-4 h-4 rounded-full bg-white/10 text-text-muted text-[10px] inline-flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-colors"
      >
        ?
      </button>
      {open && (
        <div className="absolute bottom-6 left-0 z-50 w-64 p-3 rounded-lg bg-[#1a1a2e] border border-white/10 text-xs text-text-secondary shadow-xl">
          {text}
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="block mt-2 text-primary text-[10px]"
          >
            閉じる
          </button>
        </div>
      )}
    </span>
  );
}

// ─── Types ──────────────────────────────────────────────────
interface WorkImage {
  data: string;
  name: string;
  title: string;
}

interface ProfileImage {
  data: string;
  name: string;
}

// ─── Utility ────────────────────────────────────────────────
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ─── Image Compression ─────────────────────────────────────
async function compressImage(file: File): Promise<File> {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  };
  try {
    return await imageCompression(file, options);
  } catch {
    return file; // fallback to original if compression fails
  }
}

// ─── Ratio icon helper ─────────────────────────────────────
function RatioIcon({ ratio }: { ratio: string }) {
  if (ratio.includes("16:9") || ratio.includes("4:3") || ratio === "横長")
    return <RectangleHorizontal className="w-4 h-4" />;
  if (ratio.includes("9:16") || ratio.includes("3:4") || ratio === "縦長")
    return <RectangleVertical className="w-4 h-4" />;
  return <Square className="w-4 h-4" />;
}

// ─── Mood option icons ──────────────────────────────────────
const moodToneIcons: Record<string, string> = {
  dark: "🌑",
  light: "☀️",
  warm: "🔥",
  cool: "❄️",
  pop: "🎨",
  elegant: "💎",
};

const moodFontIcons: Record<string, string> = {
  serif: "明",
  sans: "Aa",
  mono: "</>",
  handwritten: "✎",
};

const moodAnimIcons: Record<string, string> = {
  none: "—",
  subtle: "~",
  moderate: "≈",
  dynamic: "⚡",
};

// ─── Step Indicator ─────────────────────────────────────────
function StepIndicator({ current }: { current: number }) {
  const steps = [
    { num: 1, label: "基本情報" },
    { num: 2, label: "サイト内容" },
    { num: 3, label: "確認・お支払い" },
  ];

  return (
    <div className="flex items-center justify-center gap-1.5 sm:gap-2">
      {steps.map((step, i) => {
        const isCompleted = step.num < current;
        const isActive = step.num === current;
        return (
          <div key={step.num} className="flex items-center gap-1.5 sm:gap-2">
            <div className="flex items-center gap-1">
              <span
                className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[10px] sm:text-[11px] font-bold transition-colors ${
                  isActive
                    ? "bg-primary text-[#0a0a0f]"
                    : isCompleted
                    ? "bg-primary/20 text-primary"
                    : "bg-white/[0.06] text-text-muted"
                }`}
              >
                {isCompleted ? <Check className="w-3 h-3" /> : step.num}
              </span>
              <span
                className={`text-[10px] sm:text-xs tracking-wider hidden sm:inline ${
                  isActive ? "text-primary" : isCompleted ? "text-primary/60" : "text-text-muted"
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <span className="text-text-muted/30 text-[10px]">→</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Slide animation variants ───────────────────────────────
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -80 : 80,
    opacity: 0,
  }),
};

// ─── Section Divider ────────────────────────────────────────
function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 pt-2">
      <span className="h-px flex-1 bg-white/[0.06]" />
      <span className="text-text-muted text-[10px] tracking-widest uppercase">{label}</span>
      <span className="h-px flex-1 bg-white/[0.06]" />
    </div>
  );
}

// ─── Summary Row ────────────────────────────────────────────
function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4">
      <span className="text-text-muted text-xs shrink-0 sm:w-32 sm:text-right">{label}</span>
      <span className="text-text-secondary text-sm break-all">{value}</span>
    </div>
  );
}

// ─── Section Toggle ─────────────────────────────────────────
function SectionToggle({
  enabled,
  onToggle,
}: {
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
        enabled ? "bg-primary" : "bg-white/[0.1]"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${
          enabled ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

// ═════════════════════════════════════════════════════════════
// Main Component
// ═════════════════════════════════════════════════════════════
export default function OrderTemplatePage({
  params,
}: {
  params: Promise<{ templateId: string }>;
}) {
  const { templateId } = use(params);
  const router = useRouter();

  const templateForm = getTemplateForm(templateId);
  const imageSpec = getImageSpec(templateId);
  const colorPresets = getColorPresets(templateId);

  // Step management (3 steps now)
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);

  // Step 1: Basic Info (Hero fields + mood/color)
  const [artistName, setArtistName] = useState("");
  const [siteSlug, setSiteSlug] = useState("");
  const [siteSlugError, setSiteSlugError] = useState("");
  const [siteTitle, setSiteTitle] = useState("");
  const [catchcopy, setCatchcopy] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [email, setEmail] = useState("");

  // Mood
  const [moodTone, setMoodTone] = useState("");
  const [moodFont, setMoodFont] = useState("");
  const [moodAnimation, setMoodAnimation] = useState("");

  // Colors
  const [colorMode, setColorMode] = useState<"preset" | "custom">("preset");
  const [selectedPresetIdx, setSelectedPresetIdx] = useState<number | null>(null);
  const [customPrimary, setCustomPrimary] = useState("#00e5ff");
  const [customAccent, setCustomAccent] = useState("#d4a853");
  const [customBackground, setCustomBackground] = useState("#0a0a0f");

  // Step 2: Content — section toggles
  const [enabledSections, setEnabledSections] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    if (templateForm) {
      templateForm.sectionDefs.forEach((s) => {
        initial[s.id] = true; // all enabled by default
      });
    }
    return initial;
  });

  // Field data storage (keyed by field id)
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});

  // Image data
  const [heroImage, setHeroImage] = useState<{ data: string; name: string } | null>(null);
  const [works, setWorks] = useState<WorkImage[]>([]);
  const [profileImage, setProfileImage] = useState<ProfileImage | null>(null);

  // Tag data (for tags fields)
  const [uniqueTags, setUniqueTags] = useState<Record<string, string[]>>({});
  const [tagInput, setTagInput] = useState<Record<string, string>>({});

  // Step 3
  const [plan, setPlan] = useState<"template" | "omakase" | "">("");

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [imageGistId, setImageGistId] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadedCount, setUploadedCount] = useState(0);

  const worksInputRef = useRef<HTMLInputElement>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);
  const heroInputRef = useRef<HTMLInputElement>(null);

  // ─── localStorage Auto-Save ─────────────────────────────
  const [showRestore, setShowRestore] = useState(false);
  const [savedData, setSavedData] = useState<Record<string, unknown> | null>(null);

  // Restore on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`order-form-${templateId}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        setSavedData(parsed);
        setShowRestore(true);
      }
    } catch { /* corrupted data — ignore */ }
  }, [templateId]);

  // Restore handler
  const restoreData = (data: Record<string, unknown>) => {
    if (data.artistName) setArtistName(data.artistName as string);
    if (data.siteSlug) setSiteSlug(data.siteSlug as string);
    if (data.email) setEmail(data.email as string);
    if (data.siteTitle) setSiteTitle(data.siteTitle as string);
    if (data.catchcopy) setCatchcopy(data.catchcopy as string);
    if (data.subtitle) setSubtitle(data.subtitle as string);
    if (data.moodTone) setMoodTone(data.moodTone as string);
    if (data.moodFont) setMoodFont(data.moodFont as string);
    if (data.moodAnimation) setMoodAnimation(data.moodAnimation as string);
    if (data.colorMode) setColorMode(data.colorMode as "preset" | "custom");
    if (data.selectedPresetIdx !== undefined) setSelectedPresetIdx(data.selectedPresetIdx as number | null);
    if (data.enabledSections) setEnabledSections(data.enabledSections as Record<string, boolean>);
    if (data.plan) setPlan(data.plan as "template" | "omakase" | "");
    if (data.step) setStep(data.step as number);
    if (data.fieldValues) setFieldValues(data.fieldValues as Record<string, string>);
    if (data.uniqueTags) setUniqueTags(data.uniqueTags as Record<string, string[]>);
  };

  // Debounced save effect
  useEffect(() => {
    const timer = setTimeout(() => {
      const formData = {
        artistName, siteSlug, email, siteTitle, catchcopy, subtitle,
        moodTone, moodFont, moodAnimation, colorMode, selectedPresetIdx,
        enabledSections, plan, step, fieldValues, uniqueTags,
      };
      try {
        localStorage.setItem(`order-form-${templateId}`, JSON.stringify(formData));
      } catch { /* localStorage full — ignore */ }
    }, 500);
    return () => clearTimeout(timer);
  }, [artistName, siteSlug, email, siteTitle, catchcopy, subtitle, moodTone, moodFont, moodAnimation, colorMode, selectedPresetIdx, enabledSections, plan, step, fieldValues, uniqueTags, templateId]);

  // beforeunload warning
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (artistName || works.length > 0) {
        e.preventDefault();
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [artistName, works.length]);

  // Derived
  const activeColors =
    colorMode === "preset" && selectedPresetIdx !== null && colorPresets[selectedPresetIdx]
      ? {
          primary: colorPresets[selectedPresetIdx].primary,
          accent: colorPresets[selectedPresetIdx].accent,
          background: colorPresets[selectedPresetIdx].background,
        }
      : { primary: customPrimary, accent: customAccent, background: customBackground };

  // ─── Template not found ─────────────────────────────────
  if (!templateForm) {
    return (
      <main className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-white text-xl font-bold mb-4">テンプレートが見つかりません</h1>
          <p className="text-text-muted text-sm mb-6">
            「{templateId}」というテンプレートは存在しません。
          </p>
          <Link
            href="/order"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-[#0a0a0f] font-bold text-sm hover:bg-primary/90 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            テンプレート一覧に戻る
          </Link>
        </div>
      </main>
    );
  }

  // ─── Section toggle helpers ─────────────────────────────
  const toggleSection = (sectionId: string) => {
    setEnabledSections((prev) => {
      const next = { ...prev, [sectionId]: !prev[sectionId] };
      // Clear field data when toggling OFF
      if (!next[sectionId]) {
        const section = templateForm.sectionDefs.find((s) => s.id === sectionId);
        if (section) {
          const clearedFields = { ...fieldValues };
          const clearedTags = { ...uniqueTags };
          section.fields.forEach((f) => {
            delete clearedFields[f.id];
            delete clearedTags[f.id];
          });
          setFieldValues(clearedFields);
          setUniqueTags(clearedTags);
          // Clear images for specific sections
          if (sectionId === "about") setProfileImage(null);
          if (sectionId === "works") setWorks([]);
        }
      }
      return next;
    });
  };

  const getEnabledSectionIds = (): string[] => {
    return Object.entries(enabledSections)
      .filter(([, v]) => v)
      .map(([k]) => k);
  };

  // ─── Navigation ─────────────────────────────────────────
  const goNext = () => {
    setError("");
    if (step === 1) {
      if (!artistName.trim()) {
        setError("アーティスト名を入力してください");
        return;
      }
      if (!siteSlug.trim()) {
        setError("サイトURLを入力してください");
        return;
      }
      if (!/^[a-z0-9][a-z0-9-]*[a-z0-9]$/.test(siteSlug) && siteSlug.length > 1) {
        setError("サイトURLの形式が正しくありません");
        return;
      }
      if (siteSlug.length === 1 && !/^[a-z0-9]$/.test(siteSlug)) {
        setError("サイトURLの形式が正しくありません");
        return;
      }
      if (siteSlug.length < 2) {
        setError("サイトURLは2文字以上で入力してください");
        return;
      }
      if (!email.trim()) {
        setError("メールアドレスを入力してください");
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        setError("メールアドレスの形式が正しくありません");
        return;
      }
    }
    if (step === 2) {
      if (enabledSections["works"] && works.length < (imageSpec?.recommendedCount.min || 3)) {
        setError(`作品画像を${imageSpec?.recommendedCount.min || 3}枚以上アップロードしてください`);
        return;
      }
    }
    setDirection(1);
    setStep((s) => Math.min(s + 1, 3));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goBack = () => {
    setError("");
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToStep = (target: number) => {
    setError("");
    setDirection(target > step ? 1 : -1);
    setStep(target);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ─── Save preview data to sessionStorage when entering Step 3 ───
  useEffect(() => {
    if (step === 3) {
      const previewData: SiteData = {
        artistName,
        catchcopy,
        subtitle,
        bio: fieldValues.bio || "",
        motto: fieldValues.motto || "",
        email,
        snsX: fieldValues.snsX || "",
        snsInstagram: fieldValues.snsInstagram || "",
        snsPixiv: fieldValues.snsPixiv || "",
        works: works.map((w) => ({ src: w.data, title: w.title })),
        heroImage: heroImage?.data,
        profileImage: profileImage?.data,
        colorPrimary: activeColors.primary,
        colorAccent: activeColors.accent,
        colorBackground: activeColors.background,
        skills: uniqueTags.skills || [],
        stats: uniqueTags.stats || [],
        tools: uniqueTags.tools || [],
      };
      // sessionStorageは不要（インラインプレビューはstateから直接描画）
    }
  }, [step]); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Field value helpers ────────────────────────────────
  const setFieldValue = (fieldId: string, value: string) => {
    setFieldValues((prev) => ({ ...prev, [fieldId]: value }));
  };

  const getFieldValue = (fieldId: string) => fieldValues[fieldId] || "";

  // ─── Image handling ─────────────────────────────────────
  const handleWorkFiles = useCallback(
    async (files: FileList | null) => {
      if (!files) return;
      const maxCount = imageSpec?.recommendedCount.max || 10;
      const remaining = maxCount - works.length;
      const toProcess = Array.from(files).slice(0, remaining);
      const maxSize = 5 * 1024 * 1024;

      const newWorks: WorkImage[] = [];
      for (const file of toProcess) {
        if (file.size > maxSize) {
          setError(`${file.name} は5MBを超えています`);
          continue;
        }
        if (!file.type.match(/^image\/(jpeg|png|webp)$/)) {
          setError(`${file.name} はJPG/PNG/WebP形式ではありません`);
          continue;
        }
        const compressed = await compressImage(file);
        const data = await fileToBase64(compressed);
        newWorks.push({
          data,
          name: file.name,
          title: `作品 ${String(works.length + newWorks.length + 1).padStart(2, "0")}`,
        });
      }

      if (newWorks.length === 0) return;
      setWorks((prev) => [...prev, ...newWorks]);

      // Background upload
      setUploading(true);
      let gistId = imageGistId;
      for (const w of newWorks) {
        try {
          const res = await fetch("/api/upload-images", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              gistId: gistId || undefined,
              fileName: `work_${String(works.length + newWorks.indexOf(w) + 1).padStart(2, "0")}`,
              imageData: w.data,
            }),
          });
          const data = await res.json();
          if (res.ok) {
            gistId = data.gistId;
            setImageGistId(gistId);
            setUploadedCount((c) => c + 1);
          }
        } catch {
          // Silent fail
        }
      }
      setUploading(false);
    },
    [works.length, imageGistId, imageSpec]
  );

  const handleHeroFile = useCallback(
    async (files: FileList | null) => {
      if (!files || !files[0]) return;
      const file = files[0];
      if (file.size > 5 * 1024 * 1024) {
        setError("画像は5MBまでです");
        return;
      }
      if (!file.type.match(/^image\/(jpeg|png|webp)$/)) {
        setError("JPG/PNG/WebP形式の画像を選択してください");
        return;
      }
      const compressed = await compressImage(file);
      const data = await fileToBase64(compressed);
      setHeroImage({ data, name: file.name });

      try {
        const res = await fetch("/api/upload-images", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            gistId: imageGistId || undefined,
            fileName: "hero",
            imageData: data,
          }),
        });
        const result = await res.json();
        if (res.ok) setImageGistId(result.gistId);
      } catch {
        // Will retry
      }
    },
    [imageGistId]
  );

  const handleProfileFile = useCallback(
    async (files: FileList | null) => {
      if (!files || !files[0]) return;
      const file = files[0];
      if (file.size > 5 * 1024 * 1024) {
        setError("プロフィール画像は5MBまでです");
        return;
      }
      if (!file.type.match(/^image\/(jpeg|png|webp)$/)) {
        setError("JPG/PNG/WebP形式の画像を選択してください");
        return;
      }
      const compressed = await compressImage(file);
      const data = await fileToBase64(compressed);
      setProfileImage({ data, name: file.name });

      try {
        const res = await fetch("/api/upload-images", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            gistId: imageGistId || undefined,
            fileName: "profile",
            imageData: data,
          }),
        });
        const result = await res.json();
        if (res.ok) setImageGistId(result.gistId);
      } catch {
        // Will retry
      }
    },
    [imageGistId]
  );

  const removeWork = (idx: number) => {
    setWorks((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateWorkTitle = (idx: number, title: string) => {
    setWorks((prev) => prev.map((w, i) => (i === idx ? { ...w, title } : w)));
  };

  // ─── Drop handler factory ──────────────────────────────
  const onDrop =
    (handler: (files: FileList | null) => void) => (e: React.DragEvent) => {
      e.preventDefault();
      handler(e.dataTransfer.files);
    };
  const preventDefault = (e: React.DragEvent) => e.preventDefault();

  // ─── Tag helpers ───────────────────────────────────────
  const addTag = (fieldId: string, maxCount: number) => {
    const input = (tagInput[fieldId] || "").trim();
    if (!input) return;
    const current = uniqueTags[fieldId] || [];
    if (current.length >= maxCount) return;
    if (current.includes(input)) return;
    setUniqueTags((prev) => ({ ...prev, [fieldId]: [...current, input] }));
    setTagInput((prev) => ({ ...prev, [fieldId]: "" }));
  };

  const removeTag = (fieldId: string, idx: number) => {
    setUniqueTags((prev) => ({
      ...prev,
      [fieldId]: (prev[fieldId] || []).filter((_, i) => i !== idx),
    }));
  };

  // ─── Submit ────────────────────────────────────────────
  const handleSubmit = async () => {
    setError("");
    if (!plan) {
      setError("プランを選んでください");
      return;
    }

    setIsSubmitting(true);

    try {
      if (uploading) {
        setError("画像のアップロードが完了するまでお待ちください...");
        setIsSubmitting(false);
        return;
      }

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          artistName: artistName.trim(),
          siteSlug: siteSlug.trim(),
          siteTitle: siteTitle.trim(),
          email: email.trim(),
          template: templateId,
          catchcopy: catchcopy.trim(),
          subtitle: subtitle.trim(),
          bio: getFieldValue("bio").trim(),
          motto: getFieldValue("motto").trim(),
          moodTone,
          moodFont,
          moodAnimation,
          colors: activeColors,
          worksMeta: works.map((w, i) => ({
            name: `work_${String(i + 1).padStart(2, "0")}`,
            title: w.title,
          })),
          hasProfileImage: !!profileImage,
          hasHeroImage: !!heroImage,
          imageGistId,
          snsX: getFieldValue("snsX").trim(),
          snsInstagram: getFieldValue("snsInstagram").trim(),
          snsPixiv: getFieldValue("snsPixiv").trim(),
          snsNote: getFieldValue("snsNote").trim(),
          snsOther: getFieldValue("snsOther").trim(),
          referenceUrl: getFieldValue("referenceUrl").trim(),
          requests: getFieldValue("requests").trim(),
          uniqueFields: uniqueTags,
          plan,
          enabledSections: getEnabledSectionIds(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "エラーが発生しました");
      localStorage.removeItem(`order-form-${templateId}`);
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
      setIsSubmitting(false);
    }
  };

  // ─── Render section fields ─────────────────────────────
  const renderField = (field: FormField) => {
    // Special handling for known field types
    if (field.type === "images") {
      return renderWorksUpload();
    }
    if (field.type === "image" && field.id === "profileImage") {
      return renderProfileUpload();
    }
    if (field.type === "tags") {
      return renderTagField(field);
    }
    if (field.type === "textarea") {
      const maxLen = field.maxLength || 500;
      const val = getFieldValue(field.id);
      return (
        <div key={field.id}>
          <label className={labelClass}>
            {field.label}
            {field.required && <span className="text-red-400 ml-1">*</span>}
            {field.help && <HelpTooltip text={field.help} />}
          </label>
          <textarea
            value={val}
            onChange={(e) => {
              if (e.target.value.length <= maxLen) setFieldValue(field.id, e.target.value);
            }}
            placeholder={field.placeholder}
            rows={5}
            className={`${inputClass} resize-none`}
          />
          <div className="flex justify-between mt-1">
            {field.help && <p className={helpClass}>{field.help}</p>}
            <span
              className={`text-xs ml-auto ${
                val.length > maxLen - 20 ? "text-red-400" : "text-text-muted"
              }`}
            >
              {val.length}/{maxLen}
            </span>
          </div>
        </div>
      );
    }
    // Default: text input
    return (
      <div key={field.id}>
        <label className={labelClass}>
          {field.label}
          {field.required && <span className="text-red-400 ml-1">*</span>}
          {field.help && <HelpTooltip text={field.help} />}
        </label>
        <input
          type="text"
          value={getFieldValue(field.id)}
          onChange={(e) => setFieldValue(field.id, e.target.value)}
          placeholder={field.placeholder}
          className={inputClass}
        />
        {field.help && <p className={helpClass}>{field.help}</p>}
      </div>
    );
  };

  const renderTagField = (field: FormField) => {
    return (
      <div key={field.id}>
        <label className={labelClass}>
          {field.label}
          {field.help && <HelpTooltip text={field.help} />}
        </label>
        {field.help && <p className={helpClass + " mb-2"}>{field.help}</p>}
        <div className="flex gap-2">
          <input
            type="text"
            value={tagInput[field.id] || ""}
            onChange={(e) =>
              setTagInput((prev) => ({ ...prev, [field.id]: e.target.value }))
            }
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === ",") {
                e.preventDefault();
                addTag(field.id, field.max || 10);
              }
            }}
            placeholder={field.placeholder}
            className={inputClass}
          />
          <button
            type="button"
            onClick={() => addTag(field.id, field.max || 10)}
            className="px-3 py-2 rounded-xl border border-white/[0.08] text-text-secondary text-xs hover:border-primary/50 hover:text-primary transition-colors shrink-0"
          >
            追加
          </button>
        </div>
        {(uniqueTags[field.id] || []).length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {(uniqueTags[field.id] || []).map((tag, idx) => (
              <span
                key={idx}
                className="flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(field.id, idx)}
                  className="hover:text-red-400 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
        <p className="text-text-muted text-[10px] mt-1">
          {(uniqueTags[field.id] || []).length}/{field.max || 10}個
          （Enterキーまたはカンマで追加）
        </p>
      </div>
    );
  };

  const renderWorksUpload = () => {
    return (
      <div>
        {/* Image recommendation banner */}
        <div className="mb-4 rounded-xl border border-primary/20 bg-primary/[0.03] p-3">
          <p className="text-xs text-text-secondary">
            「<span className="text-white font-medium">{templateForm.nameJa}</span>
            」には
            <span className="text-primary font-medium">
              {imageSpec.recommendedRatio}
            </span>
            の画像が
            <span className="text-primary font-medium">
              {imageSpec.recommendedCount.min}〜{imageSpec.recommendedCount.max}枚
            </span>
            おすすめです
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[10px] text-text-muted">対応サイズ:</span>
            {imageSpec.acceptRatios.map((r: string) => (
              <span
                key={r}
                className="flex items-center gap-0.5 text-[10px] text-text-secondary"
              >
                <RatioIcon ratio={r} />
                {r}
              </span>
            ))}
          </div>
        </div>

        {/* Hero image */}
        <div className="mb-6">
          <label className={labelClass}>
            トップ画像（サイトの一番上に表示）
            <HelpTooltip text="サイトを開いた時に最初に見える大きな画像です。インパクトのある1枚を選んでください。" />
          </label>
          <p className={helpClass + " mb-3"}>
            サイトを開いた時に最初に見える大きな画像です
          </p>

          {!heroImage ? (
            <div
              onDrop={onDrop(handleHeroFile)}
              onDragOver={preventDefault}
              onClick={() => heroInputRef.current?.click()}
              className="border-2 border-dashed border-white/[0.1] rounded-xl p-6 text-center hover:border-primary/30 transition-colors cursor-pointer"
            >
              <Upload className="w-6 h-6 text-text-muted mx-auto mb-2" />
              <p className="text-text-secondary text-xs">
                クリックまたはドラッグ&ドロップ
              </p>
              <p className="text-text-muted text-[10px] mt-1">JPG / PNG / WebP、5MBまで</p>
              <input
                ref={heroInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => {
                  handleHeroFile(e.target.files);
                  e.target.value = "";
                }}
                className="hidden"
              />
            </div>
          ) : (
            <div className="relative group inline-block">
              <div className="h-32 rounded-xl overflow-hidden border border-white/[0.08]">
                <img
                  src={heroImage.data}
                  alt="トップ画像"
                  className="h-full object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => setHeroImage(null)}
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {/* Works images */}
        <div>
          <label className={labelClass}>
            作品画像（{imageSpec.recommendedCount.min}〜
            {imageSpec.recommendedCount.max}枚）
            <span className="text-red-400 ml-1">*</span>
            <HelpTooltip text="サイトのギャラリー部分に表示される作品画像です。あなたの自信作を選んでください。" />
          </label>
          <p className={helpClass + " mb-3"}>
            ギャラリーに表示されます。JPG / PNG / WebP、1枚5MBまで
          </p>

          {works.length < (imageSpec.recommendedCount.max || 10) && (
            <div
              onDrop={onDrop(handleWorkFiles)}
              onDragOver={preventDefault}
              onClick={() => worksInputRef.current?.click()}
              className="border-2 border-dashed border-white/[0.1] rounded-xl p-8 text-center hover:border-primary/30 transition-colors cursor-pointer"
            >
              <Upload className="w-8 h-8 text-text-muted mx-auto mb-3" />
              <p className="text-text-secondary text-sm">
                ドラッグ&ドロップ、またはクリックして選択
              </p>
              <p className="text-text-muted text-xs mt-1">
                {works.length}/{imageSpec.recommendedCount.max || 10}枚
                {uploading && (
                  <span className="text-primary ml-2">アップロード中...</span>
                )}
                {!uploading && uploadedCount > 0 && (
                  <span className="text-emerald-400 ml-2">
                    ✓ {uploadedCount}枚アップ済み
                  </span>
                )}
              </p>
              <input
                ref={worksInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={(e) => {
                  handleWorkFiles(e.target.files);
                  e.target.value = "";
                }}
                className="hidden"
              />
            </div>
          )}

          {/* Thumbnails */}
          {works.length > 0 && (
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {works.map((w, i) => (
                <div key={i} className="relative group">
                  <div className="aspect-square rounded-lg overflow-hidden bg-white/[0.03] border border-white/[0.08]">
                    <img
                      src={w.data}
                      alt={w.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeWork(i)}
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  <input
                    type="text"
                    value={w.title}
                    onChange={(e) => updateWorkTitle(i, e.target.value)}
                    placeholder={`作品 ${String(i + 1).padStart(2, "0")}`}
                    className="mt-1.5 w-full bg-transparent border-b border-white/[0.08] text-white text-xs py-1 focus:border-primary/50 focus:outline-none transition-colors placeholder:text-text-muted"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderProfileUpload = () => {
    return (
      <div>
        <label className={labelClass}>
          プロフィール画像
          <HelpTooltip text="「自己紹介」セクションに表示される画像です。顔写真やアイコンなど何でもOKです。" />
        </label>
        <p className={helpClass + " mb-3"}>
          About欄に表示されます。未設定でもOK
        </p>

        {!profileImage ? (
          <div
            onDrop={onDrop(handleProfileFile)}
            onDragOver={preventDefault}
            onClick={() => profileInputRef.current?.click()}
            className="border-2 border-dashed border-white/[0.1] rounded-xl p-6 text-center hover:border-primary/30 transition-colors cursor-pointer max-w-[240px]"
          >
            <Upload className="w-6 h-6 text-text-muted mx-auto mb-2" />
            <p className="text-text-secondary text-xs">クリックまたはドロップ</p>
            <input
              ref={profileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => {
                handleProfileFile(e.target.files);
                e.target.value = "";
              }}
              className="hidden"
            />
          </div>
        ) : (
          <div className="relative group inline-block">
            <div className="w-24 h-24 rounded-full overflow-hidden border border-white/[0.08]">
              <img
                src={profileImage.data}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <button
              type="button"
              onClick={() => setProfileImage(null)}
              className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>
    );
  };

  // ─── Render a full section with toggle ─────────────────
  const renderSection = (section: SectionDef) => {
    const isEnabled = enabledSections[section.id] !== false;

    // Skip hero section in step 2 — hero fields are in step 1
    if (section.id === "hero") return null;

    return (
      <motion.div
        key={section.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-white/[0.06] bg-white/[0.01] overflow-hidden"
      >
        {/* Section header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <div>
            <h3 className="text-white text-sm font-bold tracking-wide">{section.label}</h3>
            <p className="text-text-muted text-[10px] mt-0.5">{section.description}</p>
          </div>
          {!section.required && (
            <div className="flex items-center gap-2">
              <span className="text-text-muted text-[10px]">
                {isEnabled ? "使う" : "使わない"}
              </span>
              <SectionToggle
                enabled={isEnabled}
                onToggle={() => toggleSection(section.id)}
              />
            </div>
          )}
          {section.required && (
            <span className="text-primary text-[10px] tracking-wider">必須</span>
          )}
        </div>

        {/* Section fields */}
        <AnimatePresence>
          {isEnabled && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="px-5 py-5 space-y-5">
                {section.fields.map((field) => (
                  <div key={field.id}>{renderField(field)}</div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  // ═══════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════
  return (
    <main className="min-h-screen bg-[#0a0a0f] pt-12 pb-20">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(0,229,255,0.06),transparent)] pointer-events-none" />

      <div className="relative z-10 max-w-[800px] mx-auto px-4 sm:px-6">
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link
            href="/order"
            className="inline-flex items-center gap-2 text-text-muted text-xs tracking-wider hover:text-primary transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>テンプレート一覧に戻る</span>
          </Link>
        </motion.div>

        {/* Template info banner */}
        <motion.div
          className="mt-6 mb-6 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 sm:p-5 flex gap-4 items-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="w-20 h-14 sm:w-24 sm:h-16 relative rounded-lg overflow-hidden shrink-0 border border-white/[0.08]">
            <Image
              src={`/previews/${templateId}.webp`}
              alt={templateForm.nameJa}
              fill
              className="object-cover"
              sizes="96px"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-bold tracking-wide">
              {templateForm.nameJa}
              <span className="text-text-muted text-[10px] ml-2 font-normal">{templateForm.name}</span>
            </p>
            <p className="text-text-muted text-[10px] mt-0.5">{templateForm.description}</p>
            <div className="flex items-center gap-3 mt-2">
              <a
                href={`/portfolio-templates/${templateId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary text-[10px] hover:underline"
              >
                デモを見る <ExternalLink className="w-2.5 h-2.5" />
              </a>
              <Link
                href="/order"
                className="text-text-muted text-[10px] hover:text-white transition-colors"
              >
                別のテンプレートを選ぶ
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Guide Banner */}
        <motion.div
          className="mb-6 rounded-2xl border border-primary/20 bg-primary/[0.03] px-5 py-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <p className="text-text-secondary text-sm leading-relaxed text-center">
            <span className="text-primary font-bold">3ステップ</span>で完了。情報を入力するだけ。
            <span className="text-text-muted text-xs ml-1">5〜10分で完了します。</span>
          </p>
          <div className="mt-3">
            <StepIndicator current={step} />
          </div>
        </motion.div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              className="mb-6 glass-card border-red-500/30 p-4 text-red-400 text-sm text-center"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Restore banner */}
        <AnimatePresence>
          {showRestore && (
            <motion.div
              className="mb-6 p-4 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-between gap-4"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <p className="text-sm text-white">前回の入力内容が残っています</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (savedData) restoreData(savedData);
                    setShowRestore(false);
                  }}
                  className="px-4 py-1.5 rounded-lg bg-primary text-[#0a0a0f] text-xs font-bold"
                >
                  復元する
                </button>
                <button
                  type="button"
                  onClick={() => {
                    localStorage.removeItem(`order-form-${templateId}`);
                    setShowRestore(false);
                  }}
                  className="px-4 py-1.5 rounded-lg bg-white/10 text-text-secondary text-xs"
                >
                  新しく始める
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step content */}
        <AnimatePresence mode="wait" custom={direction}>
          {/* ═══════════════════════════════════════════ */}
          {/* STEP 1: 基本情報 + 雰囲気                    */}
          {/* ═══════════════════════════════════════════ */}
          {step === 1 && (
            <motion.div
              key="step1"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="space-y-6"
            >
              {/* --- あなたのこと --- */}
              <section className="glass-card p-6 sm:p-8">
                <h2 className="text-white text-lg font-bold tracking-wide mb-1">
                  あなたのことを教えてください
                </h2>
                <p className="text-text-muted text-xs mb-6">
                  サイトに表示される基本的な情報です
                </p>

                <div className="space-y-5">
                  {/* Artist Name */}
                  <div>
                    <label className={labelClass}>
                      アーティスト名 <span className="text-red-400">*</span>
                      <HelpTooltip text="サイトのトップに大きく表示されるあなたの名前です。本名でもペンネームでもOKです。" />
                    </label>
                    <input
                      type="text"
                      value={artistName}
                      onChange={(e) => setArtistName(e.target.value)}
                      placeholder="例: Lyo"
                      className={inputClass}
                    />
                    <p className={helpClass}>
                      サイトに表示される名前です（本名でもペンネームでもOK）
                    </p>
                  </div>

                  {/* Site URL Slug */}
                  <div>
                    <label className={labelClass}>
                      サイトURL <span className="text-red-400">*</span>
                      <HelpTooltip text="あなたのサイトのアドレス（URL）になります。英語の小文字・数字・ハイフンだけ使えます。" />
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={siteSlug}
                        onChange={(e) => {
                          const v = e.target.value.toLowerCase();
                          if (v === "" || /^[a-z0-9-]*$/.test(v)) {
                            setSiteSlug(v);
                            if (v.length > 0 && !/^[a-z0-9]/.test(v)) {
                              setSiteSlugError("最初の文字は英語の小文字か数字にしてください");
                            } else if (v.includes("--")) {
                              setSiteSlugError("ハイフンは連続で使えません");
                            } else {
                              setSiteSlugError("");
                            }
                          } else {
                            setSiteSlugError("使えるのは英語の小文字(a-z)・数字(0-9)・ハイフン(-)だけです");
                          }
                        }}
                        placeholder="例: hana-art"
                        className={inputClass}
                        maxLength={30}
                      />
                    </div>
                    {siteSlugError && (
                      <p className="text-red-400 text-xs mt-1.5">{siteSlugError}</p>
                    )}
                    <div className="mt-2 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                      <p className="text-text-muted text-[10px] tracking-wider mb-1">あなたのサイトURLはこうなります</p>
                      <p className="text-white text-sm font-mono">
                        https://<span className="text-primary">{siteSlug || "ここに入力した文字"}</span>.vercel.app
                      </p>
                    </div>
                    <p className={helpClass}>
                      英語の小文字・数字・ハイフン(-)だけ使えます（例: hana, yuki-art, taro-illustration）
                    </p>
                  </div>

                  {/* Email */}
                  <div>
                    <label className={labelClass}>
                      メールアドレス <span className="text-red-400">*</span>
                      <HelpTooltip text="サイトの問い合わせ先として表示されます。完成通知もこのアドレスに届きます。" />
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="例: your-email@example.com"
                      className={inputClass}
                    />
                    <p className={helpClass}>サイトの問い合わせ先 & 完成通知の送信先</p>
                  </div>

                  {/* Site Title */}
                  <div>
                    <label className={labelClass}>
                      サイトタイトル
                      <HelpTooltip text="ブラウザのタブ（上の方の小さいところ）に表示される名前です。空欄でも大丈夫です。" />
                    </label>
                    <input
                      type="text"
                      value={siteTitle}
                      onChange={(e) => setSiteTitle(e.target.value)}
                      placeholder="例: Lyo — AI Art Gallery"
                      className={inputClass}
                    />
                    <p className={helpClass}>
                      ブラウザのタブに表示されます。空欄なら「アーティスト名 — Gallery」になります
                    </p>
                  </div>

                  {/* Catchcopy */}
                  <div>
                    <label className={labelClass}>
                      キャッチコピー
                      <HelpTooltip text="サイトを開いた時に一番最初に目に入る、大きなテキストです。あなたの世界観を一言で表してみてください。" />
                    </label>
                    <input
                      type="text"
                      value={catchcopy}
                      onChange={(e) => setCatchcopy(e.target.value)}
                      placeholder="例: 光と影で紡ぐ幻想世界"
                      className={inputClass}
                    />
                    <p className={helpClass}>
                      サイトのトップに大きく表示されます。あなたの世界観を一言で
                    </p>
                  </div>

                  {/* Subtitle */}
                  <div>
                    <label className={labelClass}>
                      肩書き・サブタイトル
                      <HelpTooltip text="名前の近くに小さく表示されます。「何をしている人か」がわかるとベストです。" />
                    </label>
                    <input
                      type="text"
                      value={subtitle}
                      onChange={(e) => setSubtitle(e.target.value)}
                      placeholder="例: AI Art Creator / Digital Artist"
                      className={inputClass}
                    />
                    <p className={helpClass}>名前の下に小さく表示されます</p>
                  </div>
                </div>
              </section>

              {/* --- 雰囲気 --- */}
              <section className="glass-card p-6 sm:p-8">
                <SectionDivider label="雰囲気" />
                <p className="text-text-muted text-xs mt-3 mb-5 text-center">
                  あなたの作品に合う雰囲気を選んでください
                </p>

                {/* Mood Tone */}
                <div className="mb-6">
                  <label className={labelClass}>
                    サイト全体の雰囲気
                    <HelpTooltip text="サイト全体の見た目の印象です。作品の世界観に近いものを選んでください。" />
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                    {[
                      { value: "dark", label: "ダーク", sub: "重厚感・没入感" },
                      { value: "light", label: "ライト", sub: "明るく・爽やか" },
                      { value: "warm", label: "ウォーム", sub: "温かみ・親しみやすさ" },
                      { value: "cool", label: "クール", sub: "シャープ・洗練" },
                      { value: "pop", label: "ポップ", sub: "元気・カラフル" },
                      { value: "elegant", label: "エレガント", sub: "上品・高級感" },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setMoodTone(opt.value)}
                        className={`border rounded-xl p-3 text-left transition-all duration-200 ${
                          moodTone === opt.value
                            ? "border-primary bg-primary/5"
                            : "border-white/[0.08] hover:border-white/20"
                        }`}
                      >
                        <span className="text-lg block mb-1">
                          {moodToneIcons[opt.value]}
                        </span>
                        <span
                          className={`text-xs font-medium block ${
                            moodTone === opt.value ? "text-primary" : "text-white"
                          }`}
                        >
                          {opt.label}
                        </span>
                        <span className="text-[10px] text-text-muted">{opt.sub}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mood Font */}
                <div className="mb-6">
                  <label className={labelClass}>
                    文字の雰囲気
                    <HelpTooltip text="タイトルや見出しに使われるフォントの雰囲気です。" />
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
                    {[
                      { value: "serif", label: "上品・伝統的", sub: "明朝体系" },
                      { value: "sans", label: "モダン・すっきり", sub: "ゴシック体系" },
                      { value: "mono", label: "テック・デジタル", sub: "等幅フォント" },
                      { value: "handwritten", label: "手書き・温かみ", sub: "手書き風" },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setMoodFont(opt.value)}
                        className={`border rounded-xl p-3 text-left transition-all duration-200 ${
                          moodFont === opt.value
                            ? "border-primary bg-primary/5"
                            : "border-white/[0.08] hover:border-white/20"
                        }`}
                      >
                        <span
                          className={`text-base block mb-1 ${
                            opt.value === "serif"
                              ? "font-serif"
                              : opt.value === "mono"
                              ? "font-mono"
                              : ""
                          }`}
                        >
                          {moodFontIcons[opt.value]}
                        </span>
                        <span
                          className={`text-xs font-medium block ${
                            moodFont === opt.value ? "text-primary" : "text-white"
                          }`}
                        >
                          {opt.label}
                        </span>
                        <span className="text-[10px] text-text-muted">{opt.sub}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mood Animation */}
                <div>
                  <label className={labelClass}>
                    アニメーションの強さ
                    <HelpTooltip text="スクロールした時の動きの強さです。「なし」なら静的なサイトになります。" />
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
                    {[
                      { value: "none", label: "なし", sub: "シンプルに" },
                      { value: "subtle", label: "控えめ", sub: "ふわっと表示" },
                      { value: "moderate", label: "普通", sub: "スクロールで動く" },
                      { value: "dynamic", label: "しっかり", sub: "印象に残る演出" },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setMoodAnimation(opt.value)}
                        className={`border rounded-xl p-3 text-left transition-all duration-200 ${
                          moodAnimation === opt.value
                            ? "border-primary bg-primary/5"
                            : "border-white/[0.08] hover:border-white/20"
                        }`}
                      >
                        <span className="text-base block mb-1">
                          {moodAnimIcons[opt.value]}
                        </span>
                        <span
                          className={`text-xs font-medium block ${
                            moodAnimation === opt.value ? "text-primary" : "text-white"
                          }`}
                        >
                          {opt.label}
                        </span>
                        <span className="text-[10px] text-text-muted">{opt.sub}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </section>

              {/* --- カラー --- */}
              <section className="glass-card p-6 sm:p-8">
                <SectionDivider label="カラー" />
                <p className="text-text-muted text-xs mt-3 mb-5 text-center">
                  サイトの色を選んでください
                </p>

                {/* Preset swatches */}
                <div className="mb-4">
                  <label className={labelClass}>
                    カラープリセット
                    <HelpTooltip text="あらかじめ用意された配色セットです。クリックするだけで色が決まります。" />
                  </label>
                  <div className="flex flex-wrap gap-3 mt-2">
                    {colorPresets.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setColorMode("preset");
                          setSelectedPresetIdx(idx);
                        }}
                        className="group flex flex-col items-center gap-1"
                        title={preset.name}
                      >
                        <div className="relative">
                          <div
                            className={`w-8 h-8 rounded-full border-2 transition-all ${
                              colorMode === "preset" && selectedPresetIdx === idx
                                ? "ring-2 ring-primary ring-offset-2 ring-offset-[#0a0a0f] border-primary"
                                : "border-white/20 group-hover:border-white/40"
                            }`}
                            style={{
                              background: `linear-gradient(135deg, ${preset.primary} 50%, ${preset.accent} 50%)`,
                            }}
                          />
                          {colorMode === "preset" && selectedPresetIdx === idx && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Check className="w-3.5 h-3.5 text-white drop-shadow-md" />
                            </div>
                          )}
                        </div>
                        <span className="text-[9px] text-text-muted group-hover:text-text-secondary transition-colors">
                          {preset.name}
                        </span>
                      </button>
                    ))}

                    {/* Custom option */}
                    <button
                      type="button"
                      onClick={() => setColorMode("custom")}
                      className="flex flex-col items-center gap-1 group"
                    >
                      <div
                        className={`w-8 h-8 rounded-full border-2 border-dashed flex items-center justify-center transition-all ${
                          colorMode === "custom"
                            ? "border-primary text-primary"
                            : "border-white/20 text-text-muted group-hover:border-white/40"
                        }`}
                      >
                        <span className="text-xs">+</span>
                      </div>
                      <span className="text-[9px] text-text-muted">自分で選ぶ</span>
                    </button>
                  </div>
                </div>

                {/* Custom color pickers */}
                <AnimatePresence>
                  {colorMode === "custom" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-3 mb-4"
                    >
                      <div className="flex items-center gap-3">
                        <label className="text-xs text-text-secondary w-20 shrink-0">メインカラー</label>
                        <input
                          type="color"
                          value={customPrimary}
                          onChange={(e) => setCustomPrimary(e.target.value)}
                          className="w-8 h-8 rounded cursor-pointer bg-transparent border-0"
                        />
                        <span className="text-text-muted text-xs font-mono">{customPrimary}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <label className="text-xs text-text-secondary w-20 shrink-0">アクセント</label>
                        <input
                          type="color"
                          value={customAccent}
                          onChange={(e) => setCustomAccent(e.target.value)}
                          className="w-8 h-8 rounded cursor-pointer bg-transparent border-0"
                        />
                        <span className="text-text-muted text-xs font-mono">{customAccent}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <label className="text-xs text-text-secondary w-20 shrink-0">背景色</label>
                        <input
                          type="color"
                          value={customBackground}
                          onChange={(e) => setCustomBackground(e.target.value)}
                          className="w-8 h-8 rounded cursor-pointer bg-transparent border-0"
                        />
                        <span className="text-text-muted text-xs font-mono">{customBackground}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Live color preview */}
                {(selectedPresetIdx !== null || colorMode === "custom") && (
                  <div
                    className="rounded-xl p-4 border border-white/[0.06] flex items-center gap-4"
                    style={{ backgroundColor: activeColors.background }}
                  >
                    <span className="text-xs" style={{ color: activeColors.primary }}>
                      メインカラー
                    </span>
                    <span className="text-xs font-bold" style={{ color: activeColors.accent }}>
                      Sample
                    </span>
                    <span className="text-[10px] text-text-muted ml-auto">プレビュー</span>
                  </div>
                )}
              </section>

              {/* Nav */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={goNext}
                  className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-[#0a0a0f] font-bold text-sm tracking-wider hover:bg-primary/90 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
                >
                  次へ：サイト内容を入力
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* ═══════════════════════════════════════════ */}
          {/* STEP 2: サイト内容（セクションごとにトグル）     */}
          {/* ═══════════════════════════════════════════ */}
          {step === 2 && (
            <motion.div
              key="step2"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="space-y-4"
            >
              <div className="mb-2">
                <h2 className="text-white text-lg font-bold tracking-wide mb-1">
                  サイトに載せる情報を入力してください
                </h2>
                <p className="text-text-muted text-xs">
                  各セクションのON/OFFを切り替えて、使うセクションだけ入力できます
                </p>
              </div>

              {/* Render all sections from sectionDefs */}
              {templateForm.sectionDefs.map((section) => renderSection(section))}

              {/* --- 参考・要望 --- */}
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.01] overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
                  <div>
                    <h3 className="text-white text-sm font-bold tracking-wide">参考・要望</h3>
                    <p className="text-text-muted text-[10px] mt-0.5">参考サイトやその他のリクエストがあれば</p>
                  </div>
                </div>
                <div className="px-5 py-5 space-y-5">
                  <div>
                    <label className={labelClass}>
                      参考サイトURL
                      <HelpTooltip text="「こんな感じにしたい」というサイトがあれば教えてください。参考にします。" />
                    </label>
                    <input
                      type="text"
                      value={getFieldValue("referenceUrl")}
                      onChange={(e) => setFieldValue("referenceUrl", e.target.value)}
                      placeholder="https://example.com"
                      className={inputClass}
                    />
                    <p className={helpClass}>
                      「こんな感じにしたい」というサイトがあれば教えてください
                    </p>
                  </div>

                  <div>
                    <label className={labelClass}>
                      その他のご要望
                      <HelpTooltip text="色の好み、レイアウトの希望、特別なリクエストなど何でも自由にお書きください。" />
                    </label>
                    <textarea
                      value={getFieldValue("requests")}
                      onChange={(e) => {
                        if (e.target.value.length <= 500) setFieldValue("requests", e.target.value);
                      }}
                      placeholder="例: 青と紫を基調にしてほしい、背景を白にしたい、等"
                      rows={4}
                      className={`${inputClass} resize-none`}
                    />
                    <div className="flex justify-between mt-1">
                      <p className={helpClass}>色の好み、レイアウトの希望など自由にお書きください</p>
                      <span
                        className={`text-xs ${
                          getFieldValue("requests").length > 480 ? "text-red-400" : "text-text-muted"
                        }`}
                      >
                        {getFieldValue("requests").length}/500
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Nav */}
              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={goBack}
                  className="flex items-center gap-2 px-6 py-3.5 rounded-xl border border-white/[0.08] text-text-secondary text-sm tracking-wider hover:border-white/20 hover:text-white transition-all duration-300"
                >
                  <ChevronLeft className="w-4 h-4" />
                  戻る
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-[#0a0a0f] font-bold text-sm tracking-wider hover:bg-primary/90 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
                >
                  次へ：確認画面
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* ═══════════════════════════════════════════ */}
          {/* STEP 3: 確認・お支払い                        */}
          {/* ═══════════════════════════════════════════ */}
          {step === 3 && (
            <motion.div
              key="step3"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="space-y-6"
            >
              {/* Site Preview (inline rendering, no iframe) */}
              <section className="glass-card p-4 sm:p-6">
                <h3 className="text-white font-bold text-sm mb-3">サイトプレビュー</h3>
                <InlinePreview
                  templateId={templateId}
                  siteData={{
                    artistName,
                    catchcopy,
                    subtitle,
                    bio: fieldValues.bio || "",
                    motto: fieldValues.motto || "",
                    email,
                    snsX: fieldValues.snsX || "",
                    snsInstagram: fieldValues.snsInstagram || "",
                    snsPixiv: fieldValues.snsPixiv || "",
                    works: works.map((w) => ({ src: w.data, title: w.title })),
                    heroImage: heroImage?.data,
                    profileImage: profileImage?.data,
                    colorPrimary: activeColors.primary,
                    colorAccent: activeColors.accent,
                    colorBackground: activeColors.background,
                    skills: uniqueTags.skills || [],
                    stats: uniqueTags.stats || [],
                    tools: uniqueTags.tools || [],
                  }}
                />
                <p className="text-text-muted text-[10px] mt-3 text-center">
                  ※ このプレビューは、入力いただいた文字・画像・色をそのまま表示しています。
                  「ご要望・備考」欄の内容は、制作時にスタッフが反映するため、完成品とは異なる場合があります。
                </p>
              </section>

              {/* Summary */}
              <section className="glass-card p-6 sm:p-8">
                <h2 className="text-white text-sm font-bold tracking-wider mb-6 flex items-center gap-2">
                  <span className="w-1 h-4 bg-primary rounded-full" />
                  入力内容の確認
                </h2>

                <div className="space-y-4 text-sm">
                  {/* Template */}
                  <SummaryRow label="テンプレート" value={templateForm.nameJa} />

                  <div className="border-t border-white/[0.06] my-4" />

                  {/* Basic info */}
                  <SummaryRow label="アーティスト名" value={artistName} />
                  <SummaryRow label="サイトURL" value={`https://${siteSlug}.vercel.app`} />
                  <SummaryRow label="メールアドレス" value={email} />
                  {siteTitle && <SummaryRow label="サイトタイトル" value={siteTitle} />}
                  {catchcopy && <SummaryRow label="キャッチコピー" value={catchcopy} />}
                  {subtitle && <SummaryRow label="肩書き" value={subtitle} />}

                  {/* Mood */}
                  {moodTone && (
                    <SummaryRow
                      label="雰囲気"
                      value={
                        { dark: "ダーク", light: "ライト", warm: "ウォーム", cool: "クール", pop: "ポップ", elegant: "エレガント" }[
                          moodTone
                        ] || moodTone
                      }
                    />
                  )}
                  {moodFont && (
                    <SummaryRow
                      label="文字"
                      value={
                        { serif: "上品・伝統的", sans: "モダン・すっきり", mono: "テック・デジタル", handwritten: "手書き・温かみ" }[
                          moodFont
                        ] || moodFont
                      }
                    />
                  )}
                  {moodAnimation && (
                    <SummaryRow
                      label="アニメーション"
                      value={
                        { none: "なし", subtle: "控えめ", moderate: "普通", dynamic: "しっかり" }[
                          moodAnimation
                        ] || moodAnimation
                      }
                    />
                  )}

                  {/* Colors */}
                  {(selectedPresetIdx !== null || colorMode === "custom") && (
                    <div className="flex items-center gap-3">
                      <span className="text-text-muted text-xs shrink-0 sm:w-32 sm:text-right">
                        カラー
                      </span>
                      <div className="flex gap-2">
                        <span
                          className="w-5 h-5 rounded-full border border-white/20"
                          style={{ background: activeColors.primary }}
                        />
                        <span
                          className="w-5 h-5 rounded-full border border-white/20"
                          style={{ background: activeColors.accent }}
                        />
                        <span
                          className="w-5 h-5 rounded-full border border-white/20"
                          style={{ background: activeColors.background }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="border-t border-white/[0.06] my-4" />

                  {/* Enabled sections */}
                  <div>
                    <span className="text-text-muted text-xs block mb-2">使用セクション</span>
                    <div className="flex flex-wrap gap-2">
                      {templateForm.sectionDefs.map((s) => (
                        <span
                          key={s.id}
                          className={`text-[10px] px-2.5 py-1 rounded-full ${
                            enabledSections[s.id] !== false
                              ? "bg-primary/10 border border-primary/30 text-primary"
                              : "bg-white/[0.03] border border-white/[0.06] text-text-muted line-through"
                          }`}
                        >
                          {s.label}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-white/[0.06] my-4" />

                  {/* Images */}
                  {heroImage && (
                    <div>
                      <span className="text-text-muted text-xs block mb-2">トップ画像</span>
                      <div className="h-32 rounded-lg overflow-hidden bg-white/5 border border-white/[0.08]">
                        <img
                          src={heroImage.data}
                          alt="Hero"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}

                  {works.length > 0 && (
                    <div>
                      <span className="text-text-muted text-xs block mb-2">
                        作品画像（{works.length}枚）
                      </span>
                      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                        {works.map((w, i) => (
                          <div
                            key={i}
                            className="aspect-square rounded-lg overflow-hidden bg-white/5 border border-white/[0.08]"
                          >
                            <img
                              src={w.data}
                              alt={w.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {profileImage && (
                    <div>
                      <span className="text-text-muted text-xs block mb-2">
                        プロフィール画像
                      </span>
                      <div className="w-12 h-12 rounded-full overflow-hidden border border-white/[0.08]">
                        <img
                          src={profileImage.data}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}

                  {/* Text fields from sections */}
                  {getFieldValue("bio") && (
                    <>
                      <div className="border-t border-white/[0.06] my-4" />
                      <SummaryRow label="自己紹介文" value={getFieldValue("bio")} />
                    </>
                  )}
                  {getFieldValue("motto") && (
                    <SummaryRow label="モットー" value={getFieldValue("motto")} />
                  )}

                  {/* SNS */}
                  {(getFieldValue("snsX") || getFieldValue("snsInstagram") || getFieldValue("snsPixiv") || getFieldValue("snsNote") || getFieldValue("snsOther")) && (
                    <>
                      <div className="border-t border-white/[0.06] my-4" />
                      {getFieldValue("snsX") && <SummaryRow label="X" value={getFieldValue("snsX")} />}
                      {getFieldValue("snsInstagram") && <SummaryRow label="Instagram" value={getFieldValue("snsInstagram")} />}
                      {getFieldValue("snsPixiv") && <SummaryRow label="Pixiv" value={getFieldValue("snsPixiv")} />}
                      {getFieldValue("snsNote") && <SummaryRow label="note" value={getFieldValue("snsNote")} />}
                      {getFieldValue("snsOther") && <SummaryRow label="その他" value={getFieldValue("snsOther")} />}
                    </>
                  )}

                  {/* Unique fields (tags) */}
                  {Object.entries(uniqueTags).some(([, tags]) => tags.length > 0) && (
                    <>
                      <div className="border-t border-white/[0.06] my-4" />
                      {Object.entries(uniqueTags)
                        .filter(([, tags]) => tags.length > 0)
                        .map(([fieldId, tags]) => {
                          const field = templateForm.sectionDefs
                            .flatMap((s) => s.fields)
                            .find((f) => f.id === fieldId);
                          return (
                            <SummaryRow
                              key={fieldId}
                              label={field?.label || fieldId}
                              value={tags.join("、")}
                            />
                          );
                        })}
                    </>
                  )}

                  {/* Requests */}
                  {(getFieldValue("referenceUrl") || getFieldValue("requests")) && (
                    <>
                      <div className="border-t border-white/[0.06] my-4" />
                      {getFieldValue("referenceUrl") && (
                        <SummaryRow label="参考サイト" value={getFieldValue("referenceUrl")} />
                      )}
                      {getFieldValue("requests") && (
                        <SummaryRow label="ご要望・備考" value={getFieldValue("requests")} />
                      )}
                    </>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => goToStep(1)}
                  className="mt-6 flex items-center gap-2 text-text-muted text-xs hover:text-primary transition-colors"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  修正する
                </button>
              </section>

              {/* Plan Selection */}
              <section className="glass-card p-6 sm:p-8">
                <div className="flex items-center gap-2 mb-6">
                  <CreditCard className="w-4 h-4 text-primary" />
                  <h2 className="text-white text-sm font-bold tracking-wider">プラン選択</h2>
                  <span className="text-red-400 text-xs">*必須</span>
                  <HelpTooltip text="テンプレートプランは買い切りで初回1回編集可能。おまかせプランは月額で月3回カスタマイズ可能です。" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Template Plan */}
                  <button
                    type="button"
                    onClick={() => setPlan("template")}
                    className={`text-left rounded-xl border p-5 transition-all duration-300 ${
                      plan === "template"
                        ? "border-primary bg-primary/[0.03] shadow-lg shadow-primary/5"
                        : "border-white/[0.08] bg-white/[0.02] hover:border-white/[0.15]"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-white text-sm font-bold tracking-wide">
                        テンプレートプラン
                      </span>
                      <span
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                          plan === "template"
                            ? "border-primary bg-primary"
                            : "border-white/20"
                        }`}
                      >
                        {plan === "template" && (
                          <Check className="w-3 h-3 text-[#0a0a0f]" />
                        )}
                      </span>
                    </div>
                    <p className="text-primary text-2xl font-bold">
                      ¥980
                      <span className="text-text-muted text-xs font-normal ml-1">
                        買い切り
                      </span>
                    </p>
                    <p className="mt-3 text-text-muted text-xs leading-relaxed">
                      テンプレートから選んでサイトを作成。初回1回のみ編集可能
                    </p>
                  </button>

                  {/* Omakase Plan */}
                  <button
                    type="button"
                    onClick={() => setPlan("omakase")}
                    className={`text-left rounded-xl border p-5 transition-all duration-300 relative overflow-hidden ${
                      plan === "omakase"
                        ? "border-primary bg-primary/[0.03] shadow-lg shadow-primary/5"
                        : "border-white/[0.08] bg-white/[0.02] hover:border-white/[0.15]"
                    }`}
                  >
                    <span className="absolute top-0 right-0 bg-primary text-[#0a0a0f] text-[9px] font-bold tracking-widest px-2.5 py-0.5 rounded-bl-lg flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5" />
                      おすすめ
                    </span>
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-white text-sm font-bold tracking-wide">
                        おまかせプラン
                      </span>
                      <span
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                          plan === "omakase"
                            ? "border-primary bg-primary"
                            : "border-white/20"
                        }`}
                      >
                        {plan === "omakase" && (
                          <Check className="w-3 h-3 text-[#0a0a0f]" />
                        )}
                      </span>
                    </div>
                    <p className="text-primary text-2xl font-bold">
                      ¥2,980
                      <span className="text-text-muted text-xs font-normal ml-1">/月</span>
                    </p>
                    <p className="mt-3 text-text-muted text-xs leading-relaxed">
                      独自ドメイン・カスタマイズ月3回・会員コンテンツ付き
                    </p>
                    <p className="mt-2 text-primary/70 text-[11px]">
                      ¥980プランから1ヶ月以内のアップグレードで初月¥980引き
                    </p>
                  </button>
                </div>
              </section>

              {/* Submit */}
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting || !plan}
                  className="w-full py-4 rounded-xl bg-primary text-[#0a0a0f] font-bold text-sm tracking-wider hover:bg-primary/90 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-[#0a0a0f]/30 border-t-[#0a0a0f] rounded-full animate-spin" />
                      処理中...
                    </span>
                  ) : (
                    "お支払いへ進む"
                  )}
                </button>
                <div className="flex items-center justify-center gap-4 text-text-muted text-[10px]">
                  <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> SSL暗号化通信</span>
                  <span className="flex items-center gap-1"><CreditCard className="w-3 h-3" /> Stripe安全決済</span>
                </div>
                <p className="text-center text-text-muted text-[10px] mt-2">
                  完成後に無料で1回修正できます
                </p>
                <div className="mt-6 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <p className="text-text-secondary text-xs leading-relaxed">
                    ※ このプレビューは、入力いただいた文字・画像・色をそのまま表示しています。
                    「ご要望・備考」欄でお伝えいただいた内容（雰囲気の調整、色味の変更など）は、
                    制作時にスタッフが一つひとつ確認して反映いたします。
                    そのため、完成したサイトはこのプレビューとは見た目が異なる場合があります。
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
