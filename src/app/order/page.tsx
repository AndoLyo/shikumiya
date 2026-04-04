"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  getTemplateForm,
  getImageSpec,
  getColorPresets,
  templateForms,
} from "@/lib/template-forms";
// Types used internally from the library
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

// ─── Shared Styles ──────────────────────────────────────────
const inputClass =
  "w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm placeholder:text-text-muted focus:border-primary/50 focus:outline-none transition-colors";
const labelClass = "block text-sm font-medium text-white mb-1";
const helpClass = "text-text-muted text-[10px] mt-1";

// ─── HelpTooltip ────────────────────────────────────────────
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
    { num: 1, label: "テンプレ選択" },
    { num: 2, label: "基本情報" },
    { num: 3, label: "サイト内容" },
    { num: 4, label: "確認・お支払い" },
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

// ═════════════════════════════════════════════════════════════
// Main Component
// ═════════════════════════════════════════════════════════════
export default function OrderPage() {
  // Step management
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);

  // Step 1: Template
  const [template, setTemplate] = useState("");

  // Step 2: Basic Info
  const [artistName, setArtistName] = useState("");
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

  // Step 3: Content
  const [heroImage, setHeroImage] = useState<{ data: string; name: string } | null>(null);
  const [works, setWorks] = useState<WorkImage[]>([]);
  const [profileImage, setProfileImage] = useState<ProfileImage | null>(null);
  const [bio, setBio] = useState("");
  const [motto, setMotto] = useState("");
  const [snsX, setSnsX] = useState("");
  const [snsInstagram, setSnsInstagram] = useState("");
  const [snsPixiv, setSnsPixiv] = useState("");
  const [snsNote, setSnsNote] = useState("");
  const [snsOther, setSnsOther] = useState("");
  const [referenceUrl, setReferenceUrl] = useState("");
  const [requests, setRequests] = useState("");

  // Unique fields (tags)
  const [uniqueTags, setUniqueTags] = useState<Record<string, string[]>>({});
  const [tagInput, setTagInput] = useState<Record<string, string>>({});

  // Step 4
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

  // Derived
  const templateForm = template ? getTemplateForm(template) : null;
  const imageSpec = template ? getImageSpec(template) : null;
  const colorPresets = template ? getColorPresets(template) : [];

  const activeColors =
    colorMode === "preset" && selectedPresetIdx !== null && colorPresets[selectedPresetIdx]
      ? {
          primary: colorPresets[selectedPresetIdx].primary,
          accent: colorPresets[selectedPresetIdx].accent,
          background: colorPresets[selectedPresetIdx].background,
        }
      : { primary: customPrimary, accent: customAccent, background: customBackground };

  // ─── Navigation ─────────────────────────────────────────
  const goNext = () => {
    setError("");
    if (step === 1) {
      if (!template) {
        setError("デザインを選んでください");
        return;
      }
    }
    if (step === 2) {
      if (!artistName.trim()) {
        setError("アーティスト名を入力してください");
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
    if (step === 3) {
      if (works.length < (imageSpec?.recommendedCount.min || 3)) {
        setError(`作品画像を${imageSpec?.recommendedCount.min || 3}枚以上アップロードしてください`);
        return;
      }
    }
    setDirection(1);
    setStep((s) => Math.min(s + 1, 4));
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
        const data = await fileToBase64(file);
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
      const data = await fileToBase64(file);
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
      const data = await fileToBase64(file);
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
          siteTitle: siteTitle.trim(),
          email: email.trim(),
          template,
          catchcopy: catchcopy.trim(),
          subtitle: subtitle.trim(),
          bio: bio.trim(),
          motto: motto.trim(),
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
          snsX: snsX.trim(),
          snsInstagram: snsInstagram.trim(),
          snsPixiv: snsPixiv.trim(),
          snsNote: snsNote.trim(),
          snsOther: snsOther.trim(),
          referenceUrl: referenceUrl.trim(),
          requests: requests.trim(),
          uniqueFields: uniqueTags,
          plan,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "エラーが発生しました");
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
      setIsSubmitting(false);
    }
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
            href="/"
            className="inline-flex items-center gap-2 text-text-muted text-xs tracking-wider hover:text-primary transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>しくみやに戻る</span>
          </Link>
        </motion.div>

        {/* Page title */}
        <motion.div
          className="mt-8 mb-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h1 className="font-serif text-white text-2xl sm:text-3xl font-bold tracking-wide">
            サイトを作る
          </h1>
        </motion.div>

        {/* ─── Guide Banner ─────────────────────────────────── */}
        <motion.div
          className="mb-6 rounded-2xl border border-primary/20 bg-primary/[0.03] px-5 py-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <p className="text-text-secondary text-sm leading-relaxed text-center">
            サイト作成は <span className="text-primary font-bold">4ステップ</span>。
            まずデザインを選んで、情報を入力するだけ。
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

        {/* Step content */}
        <AnimatePresence mode="wait" custom={direction}>
          {/* ═══════════════════════════════════════════ */}
          {/* STEP 1: テンプレートを選ぶ                  */}
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
              <section className="glass-card p-6 sm:p-8">
                <h2 className="text-white text-lg font-bold tracking-wide mb-1">
                  まず、デザインを選びましょう
                </h2>
                <p className="text-text-muted text-xs mb-6">
                  あなたの作品に合うデザインを選んでください。あとから変更もできます。
                </p>

                {/* Template Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  {templateForms.map((tpl) => (
                    <div key={tpl.id} className="flex flex-col">
                      <button
                        type="button"
                        onClick={() => setTemplate(tpl.id)}
                        className={`group rounded-xl overflow-hidden border transition-all duration-300 text-left ${
                          template === tpl.id
                            ? "border-primary shadow-lg shadow-primary/10"
                            : "border-white/[0.06] hover:border-white/[0.15]"
                        }`}
                      >
                        {/* Preview */}
                        <div
                          className="h-24 sm:h-28 relative overflow-hidden"
                          style={{ background: tpl.defaultColors.background }}
                        >
                          <Image
                            src={`/previews/${tpl.id}.webp`}
                            alt={tpl.nameJa}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 50vw, 20vw"
                            onError={(e) => {
                              // Fallback: hide broken image
                              (e.target as HTMLImageElement).style.display = "none";
                            }}
                          />
                          {/* Color dots fallback */}
                          <div className="absolute bottom-1.5 left-1.5 flex gap-1">
                            <span
                              className="w-3 h-3 rounded-full border border-white/20"
                              style={{ background: tpl.defaultColors.primary }}
                            />
                            <span
                              className="w-3 h-3 rounded-full border border-white/20"
                              style={{ background: tpl.defaultColors.accent }}
                            />
                          </div>
                          {template === tpl.id && (
                            <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                              <Check className="w-3 h-3 text-[#0a0a0f]" />
                            </div>
                          )}
                        </div>
                        <div
                          className={`px-2.5 py-2 ${
                            template === tpl.id ? "bg-primary/5" : "bg-[#0d0d15]"
                          }`}
                        >
                          <p
                            className={`text-[10px] tracking-wider font-medium transition-colors ${
                              template === tpl.id
                                ? "text-primary"
                                : "text-text-secondary group-hover:text-white"
                            }`}
                          >
                            {tpl.nameJa}
                          </p>
                          <p className="text-[9px] text-text-muted mt-0.5 leading-tight">
                            {tpl.description}
                          </p>
                        </div>
                      </button>
                      <a
                        href={`/portfolio-templates/${tpl.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 flex items-center justify-center gap-1 text-[10px] text-text-muted hover:text-primary transition-colors"
                      >
                        デモを見る <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                  ))}
                </div>

                {/* Selected template info */}
                <AnimatePresence>
                  {template && imageSpec && templateForm && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-6 rounded-xl border border-primary/20 bg-primary/[0.03] p-4"
                    >
                      <p className="text-sm text-white font-medium mb-2">
                        「{templateForm.nameJa}」を選択中
                      </p>
                      <div className="space-y-1.5">
                        <p className="text-xs text-text-secondary flex items-start gap-2">
                          <span className="text-primary shrink-0">推奨画像:</span>
                          <span>
                            このテンプレートは
                            <span className="text-white font-medium">
                              {imageSpec.recommendedRatio}
                            </span>
                            の画像が映えます。{imageSpec.ratioNote}
                          </span>
                        </p>
                        <p className="text-xs text-text-secondary flex items-center gap-2">
                          <span className="text-primary shrink-0">推奨枚数:</span>
                          <span className="text-white font-medium">
                            {imageSpec.recommendedCount.min}〜{imageSpec.recommendedCount.max}枚
                          </span>
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </section>

              {/* Next */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={goNext}
                  className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-[#0a0a0f] font-bold text-sm tracking-wider hover:bg-primary/90 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
                >
                  次へ：基本情報を入力
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* ═══════════════════════════════════════════ */}
          {/* STEP 2: 基本情報                            */}
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
              <div className="flex justify-between">
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
                  次へ：サイト内容を入力
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* ═══════════════════════════════════════════ */}
          {/* STEP 3: サイト内容                           */}
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
              <section className="glass-card p-6 sm:p-8">
                <h2 className="text-white text-lg font-bold tracking-wide mb-1">
                  サイトに載せる情報を入力してください
                </h2>
                <p className="text-text-muted text-xs mb-6">
                  画像と文章をアップロードするだけで、サイトが完成します
                </p>

                {/* ── 作品画像 ─────────────────────── */}
                <SectionDivider label="作品画像" />

                {/* Template recommendation */}
                {imageSpec && templateForm && (
                  <div className="mt-4 mb-4 rounded-xl border border-primary/20 bg-primary/[0.03] p-3">
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
                      {imageSpec.acceptRatios.map((r) => (
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
                )}

                {/* Hero image */}
                <div className="mt-5 mb-6">
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
                <div className="mb-6">
                  <label className={labelClass}>
                    作品画像（{imageSpec?.recommendedCount.min || 3}〜
                    {imageSpec?.recommendedCount.max || 10}枚）
                    <span className="text-red-400 ml-1">*</span>
                    <HelpTooltip text="サイトのギャラリー部分に表示される作品画像です。あなたの自信作を選んでください。" />
                  </label>
                  <p className={helpClass + " mb-3"}>
                    ギャラリーに表示されます。JPG / PNG / WebP、1枚5MBまで
                  </p>

                  {works.length < (imageSpec?.recommendedCount.max || 10) && (
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
                        {works.length}/{imageSpec?.recommendedCount.max || 10}枚
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

                {/* ── プロフィール ─────────────────── */}
                <SectionDivider label="プロフィール" />

                <div className="mt-5 space-y-5">
                  {/* Profile Image */}
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

                  {/* Bio */}
                  <div>
                    <label className={labelClass}>
                      自己紹介文
                      <HelpTooltip text="あなたのことを教えてください。活動のきっかけ、こだわり、好きなテーマなど。" />
                    </label>
                    <textarea
                      value={bio}
                      onChange={(e) => {
                        if (e.target.value.length <= 500) setBio(e.target.value);
                      }}
                      placeholder="例: AI画像生成を始めて3年。ファンタジーの世界観を中心に制作しています。光の表現にこだわりがあります。"
                      rows={5}
                      className={`${inputClass} resize-none`}
                    />
                    <div className="flex justify-between mt-1">
                      <p className={helpClass}>活動のきっかけ、こだわり、好きなテーマなど</p>
                      <span
                        className={`text-xs ${
                          bio.length > 480 ? "text-red-400" : "text-text-muted"
                        }`}
                      >
                        {bio.length}/500
                      </span>
                    </div>
                  </div>

                  {/* Motto */}
                  <div>
                    <label className={labelClass}>
                      好きな言葉・モットー
                      <HelpTooltip text="自己紹介エリアに引用として表示されます。" />
                    </label>
                    <input
                      type="text"
                      value={motto}
                      onChange={(e) => setMotto(e.target.value)}
                      placeholder="例: 想像の先にある世界を描く"
                      className={inputClass}
                    />
                    <p className={helpClass}>About欄に引用として表示されます</p>
                  </div>
                </div>

                {/* ── SNSリンク ────────────────────── */}
                <div className="mt-8">
                  <SectionDivider label="SNSリンク" />
                  <p className="text-text-muted text-[10px] mt-3 mb-4 text-center">
                    サイトの「お問い合わせ」セクションにリンクが表示されます
                  </p>

                  <div className="space-y-3">
                    {[
                      {
                        label: "X (Twitter)",
                        value: snsX,
                        set: setSnsX,
                        placeholder: "https://x.com/your_handle",
                      },
                      {
                        label: "Instagram",
                        value: snsInstagram,
                        set: setSnsInstagram,
                        placeholder: "https://instagram.com/your_handle",
                      },
                      {
                        label: "Pixiv",
                        value: snsPixiv,
                        set: setSnsPixiv,
                        placeholder: "https://pixiv.net/users/your_id",
                      },
                      {
                        label: "note",
                        value: snsNote,
                        set: setSnsNote,
                        placeholder: "https://note.com/your_id",
                      },
                      {
                        label: "その他",
                        value: snsOther,
                        set: setSnsOther,
                        placeholder: "https://...",
                      },
                    ].map((sns) => (
                      <div key={sns.label} className="flex items-center gap-3">
                        <span className="text-text-muted text-xs w-20 shrink-0 text-right tracking-wider">
                          {sns.label}
                        </span>
                        <input
                          type="text"
                          value={sns.value}
                          onChange={(e) => sns.set(e.target.value)}
                          placeholder={sns.placeholder}
                          className={inputClass}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── テンプレート固有項目 ─────────── */}
                {templateForm && templateForm.uniqueFields.length > 0 && (
                  <div className="mt-8">
                    <SectionDivider label="テンプレート固有の項目" />
                    <div className="mt-4 space-y-5">
                      {templateForm.uniqueFields.map((field) => (
                        <div key={field.id}>
                          <label className={labelClass}>
                            {field.label}
                            {field.help && <HelpTooltip text={field.help} />}
                          </label>
                          {field.help && <p className={helpClass + " mb-2"}>{field.help}</p>}

                          {/* Tag input */}
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={tagInput[field.id] || ""}
                              onChange={(e) =>
                                setTagInput((prev) => ({
                                  ...prev,
                                  [field.id]: e.target.value,
                                }))
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

                          {/* Tags display */}
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
                      ))}
                    </div>
                  </div>
                )}

                {/* ── 参考・要望 ───────────────────── */}
                <div className="mt-8">
                  <SectionDivider label="参考・要望" />
                  <div className="mt-4 space-y-5">
                    <div>
                      <label className={labelClass}>
                        参考サイトURL
                        <HelpTooltip text="「こんな感じにしたい」というサイトがあれば教えてください。参考にします。" />
                      </label>
                      <input
                        type="text"
                        value={referenceUrl}
                        onChange={(e) => setReferenceUrl(e.target.value)}
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
                        value={requests}
                        onChange={(e) => {
                          if (e.target.value.length <= 500) setRequests(e.target.value);
                        }}
                        placeholder="例: 青と紫を基調にしてほしい、背景を白にしたい、等"
                        rows={4}
                        className={`${inputClass} resize-none`}
                      />
                      <div className="flex justify-between mt-1">
                        <p className={helpClass}>色の好み、レイアウトの希望など自由にお書きください</p>
                        <span
                          className={`text-xs ${
                            requests.length > 480 ? "text-red-400" : "text-text-muted"
                          }`}
                        >
                          {requests.length}/500
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Nav */}
              <div className="flex justify-between">
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
          {/* STEP 4: 確認・お支払い                       */}
          {/* ═══════════════════════════════════════════ */}
          {step === 4 && (
            <motion.div
              key="step4"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="space-y-6"
            >
              {/* Summary */}
              <section className="glass-card p-6 sm:p-8">
                <h2 className="text-white text-sm font-bold tracking-wider mb-6 flex items-center gap-2">
                  <span className="w-1 h-4 bg-primary rounded-full" />
                  入力内容の確認
                </h2>

                <div className="space-y-4 text-sm">
                  {/* Template */}
                  <SummaryRow
                    label="テンプレート"
                    value={templateForm?.nameJa || template}
                  />

                  <div className="border-t border-white/[0.06] my-4" />

                  {/* Basic info */}
                  <SummaryRow label="アーティスト名" value={artistName} />
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

                  {/* Images */}
                  {heroImage && (
                    <div>
                      <span className="text-text-muted text-xs block mb-2">トップ画像</span>
                      <div className="w-24 h-16 rounded-lg overflow-hidden border border-white/[0.08]">
                        <img
                          src={heroImage.data}
                          alt="Hero"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <span className="text-text-muted text-xs block mb-2">
                      作品画像（{works.length}枚）
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {works.map((w, i) => (
                        <div
                          key={i}
                          className="w-16 h-16 rounded-lg overflow-hidden border border-white/[0.08]"
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

                  {/* Profile text */}
                  {bio && (
                    <>
                      <div className="border-t border-white/[0.06] my-4" />
                      <SummaryRow label="自己紹介文" value={bio} />
                    </>
                  )}
                  {motto && <SummaryRow label="モットー" value={motto} />}

                  {/* SNS */}
                  {(snsX || snsInstagram || snsPixiv || snsNote || snsOther) && (
                    <>
                      <div className="border-t border-white/[0.06] my-4" />
                      {snsX && <SummaryRow label="X" value={snsX} />}
                      {snsInstagram && <SummaryRow label="Instagram" value={snsInstagram} />}
                      {snsPixiv && <SummaryRow label="Pixiv" value={snsPixiv} />}
                      {snsNote && <SummaryRow label="note" value={snsNote} />}
                      {snsOther && <SummaryRow label="その他" value={snsOther} />}
                    </>
                  )}

                  {/* Unique fields */}
                  {Object.entries(uniqueTags).some(([, tags]) => tags.length > 0) && (
                    <>
                      <div className="border-t border-white/[0.06] my-4" />
                      {Object.entries(uniqueTags)
                        .filter(([, tags]) => tags.length > 0)
                        .map(([fieldId, tags]) => {
                          const field = templateForm?.uniqueFields.find(
                            (f) => f.id === fieldId
                          );
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
                  {(referenceUrl || requests) && (
                    <>
                      <div className="border-t border-white/[0.06] my-4" />
                      {referenceUrl && (
                        <SummaryRow label="参考サイト" value={referenceUrl} />
                      )}
                      {requests && (
                        <SummaryRow label="ご要望・備考" value={requests} />
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
                <p className="text-center text-text-muted text-[11px] tracking-wide flex items-center justify-center gap-1">
                  <Shield className="w-3 h-3" />
                  Stripeの安全な決済ページに移動します
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
