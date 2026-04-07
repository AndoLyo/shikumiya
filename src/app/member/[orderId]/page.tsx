"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ExternalLink,
  ChevronDown,
  Loader2,
  Send,
  ArrowLeft,
  Sparkles,
  Image as ImageIcon,
  User,
  Palette,
  Mail,
  LayoutGrid,
  AlertCircle,
  CheckCircle,
  ArrowUpCircle,
  HelpCircle,
  Upload,
  X,
  Plus,
  Crown,
  Shield,
  Clock,
  Eye,
  Wrench,
  RefreshCw,
} from "lucide-react";
import {
  getTemplateForm,
  getEditableFields,
  type FormField,
  type SectionDef,
} from "@/lib/template-forms";
import DevicePreview from "@/components/DevicePreview";

// ─── Section icon mapping ──────────────────────────────────
const sectionIcons: Record<string, React.ReactNode> = {
  hero: <Sparkles className="w-5 h-5" />,
  works: <ImageIcon className="w-5 h-5" />,
  about: <User className="w-5 h-5" />,
  contact: <Mail className="w-5 h-5" />,
  style: <Palette className="w-5 h-5" />,
  skills: <Wrench className="w-5 h-5" />,
  stats: <Crown className="w-5 h-5" />,
  categories: <LayoutGrid className="w-5 h-5" />,
  tools: <Wrench className="w-5 h-5" />,
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

// ─── Confetti Component ─────────────────────────────────────
function ConfettiEffect() {
  const particles = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 1.5 + Math.random() * 1.5,
    color: ["#00e5ff", "#8b5cf6", "#ec4899", "#10b981", "#f59e0b"][
      Math.floor(Math.random() * 5)
    ],
    size: 4 + Math.random() * 6,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: -20, x: `${p.x}vw`, opacity: 1, scale: 1 }}
          animate={{
            y: "110vh",
            rotate: Math.random() * 720 - 360,
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
  const shimmer =
    "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/[0.05] before:to-transparent";

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Header skeleton */}
      <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#0a0a0f]/80 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg bg-white/[0.05] ${shimmer}`} />
          <div className={`w-32 h-5 rounded bg-white/[0.05] ${shimmer}`} />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Info card skeleton */}
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
          <div className="flex gap-5">
            <div
              className={`w-48 h-28 rounded-xl bg-white/[0.05] shrink-0 ${shimmer}`}
            />
            <div className="flex-1 space-y-3">
              <div className={`w-40 h-6 rounded bg-white/[0.05] ${shimmer}`} />
              <div className={`w-24 h-4 rounded bg-white/[0.05] ${shimmer}`} />
              <div className={`w-56 h-4 rounded bg-white/[0.05] ${shimmer}`} />
              <div className={`w-32 h-8 rounded-full bg-white/[0.05] ${shimmer}`} />
            </div>
          </div>
        </div>

        {/* Section skeletons */}
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 ${shimmer}`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/[0.05]" />
              <div className="w-28 h-5 rounded bg-white/[0.05]" />
            </div>
          </div>
        ))}
      </main>
    </div>
  );
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
        onFocus={() => setShow(true)}
        onBlur={() => setShow(false)}
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
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px w-2 h-2 rotate-45 bg-[#1a1a2e] border-r border-b border-white/[0.1]" />
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
  const tags = value ? value.split(",").map((t) => t.trim()).filter(Boolean) : [];

  function addTag() {
    const trimmed = inputVal.trim();
    if (!trimmed) return;
    if (max && tags.length >= max) return;
    if (tags.includes(trimmed)) return;
    const next = [...tags, trimmed].join(", ");
    onChange(next);
    setInputVal("");
  }

  function removeTag(index: number) {
    const next = tags.filter((_, i) => i !== index).join(", ");
    onChange(next);
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, i) => (
          <motion.span
            key={`${tag}-${i}`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#00e5ff]/10 text-[#00e5ff] text-xs font-medium"
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
          </motion.span>
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
            className="flex-1 bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#00e5ff]/50 focus:ring-1 focus:ring-[#00e5ff]/30 transition-all"
          />
          <button
            type="button"
            onClick={addTag}
            className="px-3 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-white/50 hover:text-white transition-all"
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
    value ? value.split(",").filter(Boolean) : []
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
        if (newPreviews.length === Math.min(files.length, maxFiles - previews.length)) {
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
    <div className="space-y-3">
      {/* Thumbnails */}
      {previews.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {previews.map((src, i) => (
            <div
              key={i}
              className="relative group w-20 h-20 rounded-xl overflow-hidden border border-white/[0.1] bg-white/[0.03]"
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
                  <X className="w-4 h-4 text-white" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload button */}
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
            className="flex items-center gap-2 px-4 py-3 rounded-xl border border-dashed border-white/[0.12] hover:border-[#00e5ff]/40 bg-white/[0.02] hover:bg-white/[0.04] text-white/40 hover:text-white/60 transition-all text-sm w-full justify-center"
          >
            <Upload className="w-4 h-4" />
            {isMultiple
              ? `画像をアップロード（残り${maxFiles - previews.length}枚）`
              : "画像をアップロード"}
          </button>
        </>
      )}

      {previews.length === 0 && value && (
        <p className="text-white/30 text-xs">
          現在の画像はサイト上で確認できます
        </p>
      )}
    </div>
  );
}

// ─── Field Input Component ──────────────────────────────────
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

  const baseClasses = `w-full bg-white/[0.03] border ${borderClass} rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[#00e5ff]/50 focus:ring-1 focus:ring-[#00e5ff]/30 transition-all text-sm disabled:opacity-30 disabled:cursor-not-allowed`;

  return (
    <motion.div
      layout
      className="space-y-2"
    >
      <div className="flex items-center">
        <label className="text-sm font-medium text-white/70 flex items-center">
          {field.label}
          {field.required && <span className="text-[#00e5ff] ml-1">*</span>}
          {isChanged && (
            <span className="ml-2 w-1.5 h-1.5 rounded-full bg-[#00e5ff] inline-block" />
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
            rows={4}
            disabled={disabled}
            className={`${baseClasses} resize-none`}
          />
          {field.maxLength && (
            <span className="absolute bottom-2 right-3 text-[10px] text-white/20">
              {value.length} / {field.maxLength}
            </span>
          )}
        </div>
      ) : field.type === "color" ? (
        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="color"
              value={value || "#00e5ff"}
              onChange={(e) => onChange(e.target.value)}
              disabled={disabled}
              className="w-12 h-12 rounded-xl border border-white/[0.08] cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed bg-transparent p-1"
            />
          </div>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="#00e5ff"
            disabled={disabled}
            className={`${baseClasses} flex-1 font-mono`}
          />
          {isChanged && (
            <span className="text-xs text-[#00e5ff]/60">変更あり</span>
          )}
        </div>
      ) : field.type === "select" ? (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`${baseClasses} appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%23666%22%20d%3D%22M6%208L1%203h10z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_1rem_center]`}
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
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════
// Main Page Component
// ═══════════════════════════════════════════════════════════

export default function MemberDashboardPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;

  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [changes, setChanges] = useState<Record<string, string>>({});
  const [requests, setRequests] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [showPreview, setShowPreview] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const getEmail = useCallback(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("member_email") || "";
    }
    return "";
  }, []);

  // Fetch order data
  useEffect(() => {
    async function fetchOrder() {
      const email = getEmail();
      if (!email) {
        router.push("/member");
        return;
      }

      try {
        const res = await fetch(
          `/api/member/${encodeURIComponent(orderId)}?email=${encodeURIComponent(email)}`
        );
        const data = await res.json();

        if (!res.ok || !data.valid) {
          setError(data.error || "データの取得に失敗しました");
          return;
        }

        setOrderData(data);

        // Open the first section by default
        const form = getTemplateForm(data.template);
        if (form && form.sectionDefs.length > 0) {
          setOpenSections({ [form.sectionDefs[0].id]: true });
        }
      } catch {
        setError("通信エラーが発生しました");
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [orderId, router, getEmail]);

  // Plan info
  const maxEdits = orderData?.plan === "omakase" ? 3 : 1;
  const editsUsed = orderData?.editsUsed || 0;
  const editsRemaining = maxEdits - editsUsed;
  const canEdit = editsRemaining > 0;
  const changedCount = Object.keys(changes).length;

  // Form field change handler
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

  // Toggle section
  function toggleSection(section: string) {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  }

  // Submit
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canEdit || changedCount === 0) return;

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
          requests,
        }),
      });

      const data = await res.json();
      setSubmitResult({
        success: data.success,
        message: data.message || data.error || "不明なエラー",
      });

      if (data.success) {
        setChanges({});
        setRequests("");
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
        if (orderData) {
          setOrderData({
            ...orderData,
            editsUsed: (orderData.editsUsed || 0) + 1,
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

  // Template form definition
  const templateForm = orderData ? getTemplateForm(orderData.template) : null;

  // Group fields by section
  function getFieldsBySection(section: string): FormField[] {
    if (!orderData) return [];
    return getEditableFields(orderData.template, section);
  }

  // Count changed fields per section
  function sectionChangeCount(sectionId: string): number {
    const fields = getFieldsBySection(sectionId);
    return fields.filter((f) => changes[f.id] !== undefined).length;
  }

  // ─── Loading ───────────────────────────────────────────────
  if (loading) return <LoadingSkeleton />;

  // ─── Error ─────────────────────────────────────────────────
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
              <RefreshCw className="w-4 h-4" />
              再読み込み
            </button>
            <Link
              href="/member"
              className="inline-flex items-center justify-center gap-1.5 text-[#00e5ff] hover:underline text-sm"
            >
              ログイン画面に戻る
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // Sections to render
  const sections: SectionDef[] = templateForm?.sectionDefs || [];

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Confetti */}
      <AnimatePresence>{showConfetti && <ConfettiEffect />}</AnimatePresence>

      {/* ─── Sticky Header ────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#0a0a0f]/80 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/member"
              className="p-2 -ml-2 rounded-xl text-white/40 hover:text-white/70 hover:bg-white/[0.05] transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="min-w-0">
              <h1 className="text-white font-bold text-sm truncate">
                {orderData.artistName}
              </h1>
              <p className="text-white/30 text-xs truncate">
                サイト編集
              </p>
            </div>
          </div>

          {/* Changed fields indicator */}
          <AnimatePresence>
            {changedCount > 0 && (
              <motion.span
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#00e5ff]/10 text-[#00e5ff] text-xs font-medium"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#00e5ff] animate-pulse" />
                {changedCount}件の変更
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* ═══ Site Info Card ═══════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-white/[0.01] overflow-hidden"
        >
          <div className="p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-5">
              {/* Template screenshot */}
              <div className="relative w-full sm:w-52 aspect-video sm:aspect-[16/10] rounded-xl overflow-hidden border border-white/[0.08] shrink-0 bg-white/[0.03]">
                <Image
                  src={`/previews/${orderData.template}.webp`}
                  alt={templateForm?.nameJa || orderData.template}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 208px"
                />
                {/* Template name overlay */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                  <p className="text-white text-xs font-medium">
                    {templateForm?.nameJa || orderData.template}
                  </p>
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0 space-y-4">
                <div>
                  <h2 className="text-white font-bold text-xl truncate">
                    {orderData.artistName}
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    {/* Plan badge */}
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold tracking-wide uppercase ${
                        orderData.plan === "omakase"
                          ? "bg-gradient-to-r from-amber-500/20 to-amber-600/20 text-amber-300 border border-amber-500/20"
                          : "bg-white/[0.06] text-white/50 border border-white/[0.08]"
                      }`}
                    >
                      {orderData.plan === "omakase" ? (
                        <>
                          <Crown className="w-3 h-3" />
                          おまかせ
                        </>
                      ) : (
                        "テンプレート"
                      )}
                    </span>
                    <span className="text-white/20 text-xs">
                      {orderData.plan === "omakase"
                        ? "¥2,980/月"
                        : "¥980"}
                    </span>
                  </div>
                </div>

                {/* Site URL */}
                {orderData.siteUrl && (
                  <a
                    href={orderData.siteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[#00e5ff] hover:text-[#33eaff] text-sm transition-colors group"
                  >
                    <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    <span className="truncate max-w-[280px]">
                      {orderData.siteUrl.replace("https://", "")}
                    </span>
                  </a>
                )}

                {/* Edit site button */}
                <Link
                  href={`/member/${orderId}/edit`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00e5ff] to-[#00b4d8] hover:from-[#33eaff] hover:to-[#00c8e0] text-[#0a0a0f] font-semibold text-sm transition-all shadow-lg shadow-[#00e5ff]/10"
                >
                  <Palette className="w-4 h-4" />
                  サイトを編集する
                </Link>

                {/* Edits remaining */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/50">残り編集回数</span>
                    <span
                      className={`font-bold ${
                        canEdit ? "text-[#00e5ff]" : "text-white/30"
                      }`}
                    >
                      {editsRemaining}回{" "}
                      <span className="text-white/30 font-normal">
                        / {orderData.plan === "omakase" ? "月" : ""}
                        {maxEdits}回
                      </span>
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${(editsRemaining / maxEdits) * 100}%`,
                      }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className={`h-full rounded-full ${
                        editsRemaining === 0
                          ? "bg-white/20"
                          : editsRemaining === 1 && orderData.plan === "omakase"
                          ? "bg-amber-400"
                          : "bg-gradient-to-r from-[#00e5ff] to-[#00e5ff]/60"
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ═══ No Edits Remaining CTA ═════════════════════ */}
        <AnimatePresence>
          {!canEdit && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="rounded-2xl border border-amber-500/20 bg-gradient-to-r from-amber-500/[0.06] to-amber-600/[0.03] p-5"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-5 h-5 text-amber-400" />
                </div>
                <div className="space-y-2 flex-1">
                  <p className="text-amber-200 font-semibold text-sm">
                    編集回数の上限に達しました
                  </p>
                  {orderData.plan !== "omakase" ? (
                    <>
                      <p className="text-white/40 text-sm leading-relaxed">
                        おまかせプランにアップグレードすると、毎月3回まで編集リクエストを送れます。
                      </p>
                      <Link
                        href="/order"
                        className="inline-flex items-center gap-2 mt-1 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-semibold text-sm transition-all"
                      >
                        <ArrowUpCircle className="w-4 h-4" />
                        アップグレードする
                      </Link>
                    </>
                  ) : (
                    <p className="text-white/40 text-sm">
                      月初にリセットされます。しばらくお待ちください。
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ═══ Live Site Preview ═══════════════════════════ */}
        {orderData.siteUrl && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2 text-white/50 hover:text-white/80 transition-colors text-sm font-medium group"
            >
              <Eye className="w-4 h-4" />
              現在のサイトをプレビュー
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  showPreview ? "rotate-180" : ""
                }`}
              />
            </button>

            <AnimatePresence>
              {showPreview && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 sm:p-6">
                    <DevicePreview
                      url={orderData.siteUrl}
                      title={orderData.artistName}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* ═══ Edit Form ═════════════════════════════════ */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {sections.map((sectionDef, sIndex) => {
            const fields = getFieldsBySection(sectionDef.id);
            if (fields.length === 0) return null;

            const isOpen = openSections[sectionDef.id] || false;
            const sectionChanges = sectionChangeCount(sectionDef.id);
            const icon =
              sectionIcons[sectionDef.id] || (
                <LayoutGrid className="w-5 h-5" />
              );

            return (
              <motion.div
                key={sectionDef.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + sIndex * 0.05 }}
                className={`rounded-2xl border overflow-hidden transition-colors ${
                  sectionChanges > 0
                    ? "border-[#00e5ff]/20 bg-[#00e5ff]/[0.02]"
                    : "border-white/[0.08] bg-white/[0.02]"
                }`}
              >
                {/* Section header */}
                <button
                  type="button"
                  onClick={() => toggleSection(sectionDef.id)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/[0.02] transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                        sectionChanges > 0
                          ? "bg-[#00e5ff]/10 text-[#00e5ff]"
                          : "bg-white/[0.05] text-white/40"
                      }`}
                    >
                      {icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-white">
                          {sectionDef.label}
                        </span>
                        <span className="text-white/20 text-xs">
                          {fields.length}項目
                        </span>
                        {sectionChanges > 0 && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-2 h-2 rounded-full bg-[#00e5ff]"
                          />
                        )}
                      </div>
                      <p className="text-white/30 text-xs mt-0.5 hidden sm:block">
                        {sectionDef.description}
                      </p>
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-white/30 group-hover:text-white/50 transition-colors"
                  >
                    <ChevronDown className="w-5 h-5" />
                  </motion.div>
                </button>

                {/* Section fields */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 space-y-5 border-t border-white/[0.04]">
                        <div className="pt-5 space-y-5">
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
              </motion.div>
            );
          })}

          {/* ═══ Requests / Notes ═══════════════════════════ */}
          {canEdit && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 space-y-3"
            >
              <label className="flex items-center gap-2 text-sm font-semibold text-white/70">
                <Mail className="w-4 h-4 text-white/30" />
                備考・要望
              </label>
              <p className="text-white/30 text-xs">
                色味の変更、レイアウトの希望など自由にお書きください
              </p>
              <textarea
                value={requests}
                onChange={(e) => setRequests(e.target.value)}
                placeholder="例: ヒーロー画像を差し替えたい、全体的に青みを強くしたい..."
                rows={4}
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[#00e5ff]/50 focus:ring-1 focus:ring-[#00e5ff]/30 transition-all text-sm resize-none"
              />
            </motion.div>
          )}

          {/* ═══ Submit Result ════════════════════════════ */}
          <AnimatePresence>
            {submitResult && (
              <motion.div
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.98 }}
                className={`flex items-start gap-4 rounded-2xl p-5 border ${
                  submitResult.success
                    ? "bg-emerald-500/[0.06] border-emerald-500/20"
                    : "bg-red-500/[0.06] border-red-500/20"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    submitResult.success
                      ? "bg-emerald-500/10"
                      : "bg-red-500/10"
                  }`}
                >
                  {submitResult.success ? (
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-400" />
                  )}
                </div>
                <div className="space-y-1">
                  <p
                    className={`font-semibold text-sm ${
                      submitResult.success
                        ? "text-emerald-300"
                        : "text-red-300"
                    }`}
                  >
                    {submitResult.success
                      ? "リクエストを受け付けました"
                      : "送信に失敗しました"}
                  </p>
                  <p className="text-white/40 text-sm">
                    {submitResult.message}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ═══ Submit Section ═══════════════════════════ */}
          {canEdit && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="space-y-4"
            >
              {/* Submit button */}
              <button
                type="submit"
                disabled={submitting || changedCount === 0}
                className="relative w-full group overflow-hidden rounded-2xl py-4 font-bold text-base transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {/* Gradient background */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#00e5ff] to-[#00b4d8] group-hover:from-[#33eaff] group-hover:to-[#00c8e0] transition-all" />
                <div className="relative flex items-center justify-center gap-2 text-[#0a0a0f]">
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      送信中...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      変更をリクエスト
                      {changedCount > 0 && (
                        <span className="ml-1 px-2 py-0.5 rounded-md bg-black/10 text-xs font-bold">
                          {changedCount}件
                        </span>
                      )}
                    </>
                  )}
                </div>
              </button>

              {/* Trust badges */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-white/30 text-xs">
                <span className="inline-flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" />
                  変更はスタッフが確認して反映します
                </span>
                <span className="hidden sm:block">|</span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  通常1〜2営業日以内に反映
                </span>
              </div>

              {/* Remaining edits note */}
              <p className="text-center text-white/20 text-xs">
                この送信で残り編集回数が{" "}
                <span className="text-[#00e5ff]">{editsRemaining}</span>
                {" "}→{" "}
                <span className="text-white/40">{editsRemaining - 1}</span>{" "}
                になります
              </p>
            </motion.div>
          )}
        </form>

        {/* ─── Footer ──────────────────────────────────── */}
        <div className="flex items-center justify-center gap-4 pb-12 pt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-white/25 hover:text-white/45 text-xs transition-colors"
          >
            トップページ
          </Link>
          <span className="text-white/10">|</span>
          <Link
            href="/member"
            className="inline-flex items-center gap-1.5 text-white/25 hover:text-white/45 text-xs transition-colors"
          >
            ログイン画面
          </Link>
        </div>
      </main>

      {/* ─── Global shimmer keyframe ─────────────────── */}
      <style jsx global>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}
