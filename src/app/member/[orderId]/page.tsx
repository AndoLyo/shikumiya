"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Loader2,
  Send,
  Home,
  Sparkles,
  Image as ImageIcon,
  User,
  Palette,
  Mail,
  LayoutGrid,
  AlertCircle,
  CheckCircle,
  ArrowUpCircle,
} from "lucide-react";
import {
  getTemplateForm,
  getEditableFields,
  type FormField,
} from "@/lib/template-forms";

// ─── Section metadata ──────────────────────────────────────
const sectionMeta: Record<
  string,
  { label: string; icon: React.ReactNode }
> = {
  hero: { label: "ヒーロー", icon: <Sparkles className="w-4 h-4" /> },
  works: { label: "作品", icon: <ImageIcon className="w-4 h-4" /> },
  about: { label: "プロフィール", icon: <User className="w-4 h-4" /> },
  contact: { label: "連絡先・SNS", icon: <Mail className="w-4 h-4" /> },
  style: { label: "スタイル", icon: <Palette className="w-4 h-4" /> },
  unique: { label: "テンプレート固有", icon: <LayoutGrid className="w-4 h-4" /> },
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
          `/api/member/${encodeURIComponent(orderId)}?email=${encodeURIComponent(email)}`,
        );
        const data = await res.json();

        if (!res.ok || !data.valid) {
          setError(data.error || "データの取得に失敗しました");
          return;
        }

        setOrderData(data);

        // Open the first section by default
        const form = getTemplateForm(data.template);
        if (form && form.sections.length > 0) {
          setOpenSections({ [form.sections[0]]: true });
        }
      } catch {
        setError("通信エラーが発生しました");
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [orderId, router, getEmail]);

  // Compute plan info
  const maxEdits = orderData?.plan === "omakase" ? 3 : 1;
  const editsUsed = orderData?.editsUsed || 0;
  const editsRemaining = maxEdits - editsUsed;
  const canEdit = editsRemaining > 0;

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

  // Submit edits
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canEdit || Object.keys(changes).length === 0) return;

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
        // Update edits count locally
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

  // Get template form definition
  const templateForm = orderData ? getTemplateForm(orderData.template) : null;

  // Group fields by section
  function getFieldsBySection(section: string): FormField[] {
    if (!orderData) return [];
    return getEditableFields(orderData.template, section);
  }

  // ─── Loading state ──────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#00e5ff] animate-spin" />
      </div>
    );
  }

  // ─── Error state ──────────────────────────────────────────
  if (error || !orderData) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
          <p className="text-red-400">{error || "データを取得できませんでした"}</p>
          <Link
            href="/member"
            className="inline-flex items-center gap-1.5 text-[#00e5ff] hover:underline text-sm"
          >
            ログイン画面に戻る
          </Link>
        </div>
      </div>
    );
  }

  // ─── Sections to render ──────────────────────────────────────
  const sections = templateForm?.sections || [
    "hero",
    "works",
    "about",
    "contact",
    "style",
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Header bar */}
      <header className="border-b border-white/[0.06] bg-white/[0.02]">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="text-white/40 hover:text-white/60 transition-colors"
          >
            <Home className="w-5 h-5" />
          </Link>
          <h1 className="text-white font-semibold text-sm">会員ページ</h1>
          <div className="w-5" />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/* ─── Site Info Card ──────────────────────────────── */}
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1 min-w-0">
              <h2 className="text-white font-bold text-lg truncate">
                {orderData.artistName}
              </h2>
              <p className="text-white/40 text-sm">
                {templateForm?.nameJa || orderData.template}
              </p>
            </div>
            {/* Edits badge */}
            <div className="shrink-0">
              {orderData.plan === "omakase" ? (
                <span className="inline-flex items-center gap-1.5 bg-[#00e5ff]/10 text-[#00e5ff] text-xs font-medium px-3 py-1.5 rounded-full">
                  残り {editsRemaining}回 / 月{maxEdits}回
                </span>
              ) : (
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full ${
                    canEdit
                      ? "bg-[#00e5ff]/10 text-[#00e5ff]"
                      : "bg-white/[0.05] text-white/30"
                  }`}
                >
                  {canEdit
                    ? `残り ${editsRemaining}回（初回無料編集）`
                    : "編集済み"}
                </span>
              )}
            </div>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="space-y-0.5">
              <span className="text-white/30">プラン</span>
              <p className="text-white">
                {orderData.plan === "omakase"
                  ? "おまかせプラン（¥2,980/月）"
                  : "テンプレートプラン（¥980）"}
              </p>
            </div>
            {orderData.siteUrl && (
              <div className="space-y-0.5">
                <span className="text-white/30">サイトURL</span>
                <a
                  href={orderData.siteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[#00e5ff] hover:underline truncate"
                >
                  {orderData.siteUrl.replace("https://", "")}
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </a>
              </div>
            )}
          </div>
        </div>

        {/* ─── No edits remaining ─────────────────────────── */}
        {!canEdit && (
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-5 space-y-3">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-amber-300 font-medium text-sm">
                  編集回数の上限に達しました
                </p>
                {orderData.plan !== "omakase" && (
                  <p className="text-white/40 text-xs">
                    おまかせプランにアップグレードすると月3回まで編集できます。
                  </p>
                )}
              </div>
            </div>
            {orderData.plan !== "omakase" && (
              <Link
                href="/order"
                className="inline-flex items-center gap-1.5 text-[#00e5ff] text-sm hover:underline"
              >
                <ArrowUpCircle className="w-4 h-4" />
                アップグレードする
              </Link>
            )}
          </div>
        )}

        {/* ─── Edit Form ──────────────────────────────────── */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {sections.map((section) => {
            const fields = getFieldsBySection(section);
            if (fields.length === 0) return null;

            const meta = sectionMeta[section] || {
              label: section,
              icon: <LayoutGrid className="w-4 h-4" />,
            };
            const isOpen = openSections[section] || false;

            return (
              <div
                key={section}
                className="bg-white/[0.03] border border-white/[0.08] rounded-2xl overflow-hidden"
              >
                {/* Section header (toggle) */}
                <button
                  type="button"
                  onClick={() => toggleSection(section)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-2.5 text-white">
                    <span className="text-[#00e5ff]">{meta.icon}</span>
                    <span className="font-medium text-sm">{meta.label}</span>
                    <span className="text-white/20 text-xs">
                      ({fields.length})
                    </span>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-white/30" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-white/30" />
                  )}
                </button>

                {/* Section fields */}
                {isOpen && (
                  <div className="px-5 pb-5 space-y-4 border-t border-white/[0.04]">
                    <div className="pt-4 space-y-4">
                      {fields.map((field) => (
                        <FieldInput
                          key={field.id}
                          field={field}
                          value={
                            changes[field.id] ??
                            orderData.currentValues?.[field.id] ??
                            ""
                          }
                          onChange={(val) => handleFieldChange(field.id, val)}
                          disabled={!canEdit}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* ─── Requests / notes ──────────────────────────── */}
          {canEdit && (
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5 space-y-3">
              <label className="block text-sm font-medium text-white/70">
                備考・要望
              </label>
              <textarea
                value={requests}
                onChange={(e) => setRequests(e.target.value)}
                placeholder="色味の変更、レイアウトの希望など自由にお書きください"
                rows={3}
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[#00e5ff]/50 focus:ring-1 focus:ring-[#00e5ff]/30 transition-colors text-sm resize-none"
              />
            </div>
          )}

          {/* ─── Submit result ─────────────────────────────── */}
          {submitResult && (
            <div
              className={`flex items-start gap-3 rounded-2xl p-4 border ${
                submitResult.success
                  ? "bg-emerald-500/5 border-emerald-500/20"
                  : "bg-red-500/5 border-red-500/20"
              }`}
            >
              {submitResult.success ? (
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              )}
              <p
                className={`text-sm ${
                  submitResult.success ? "text-emerald-300" : "text-red-300"
                }`}
              >
                {submitResult.message}
              </p>
            </div>
          )}

          {/* ─── Submit button ─────────────────────────────── */}
          {canEdit && (
            <button
              type="submit"
              disabled={
                submitting || Object.keys(changes).length === 0
              }
              className="w-full bg-[#00e5ff] hover:bg-[#00c8e0] disabled:opacity-30 disabled:cursor-not-allowed text-black font-semibold rounded-xl py-3.5 flex items-center justify-center gap-2 transition-colors"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  送信中...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  編集リクエストを送信
                </>
              )}
            </button>
          )}
        </form>

        {/* ─── Footer link ─────────────────────────────── */}
        <div className="text-center pb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-white/30 hover:text-white/50 text-xs transition-colors"
          >
            <Home className="w-3 h-3" />
            トップページに戻る
          </Link>
        </div>
      </main>
    </div>
  );
}

// ─── Field Input Component ──────────────────────────────────
function FieldInput({
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
  const baseClasses =
    "w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[#00e5ff]/50 focus:ring-1 focus:ring-[#00e5ff]/30 transition-colors text-sm disabled:opacity-40 disabled:cursor-not-allowed";

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-white/70">
        {field.label}
        {field.required && <span className="text-[#00e5ff] ml-1">*</span>}
      </label>

      {field.type === "textarea" ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          maxLength={field.maxLength}
          rows={3}
          disabled={disabled}
          className={`${baseClasses} resize-none`}
        />
      ) : field.type === "color" ? (
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={value || "#00e5ff"}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className="w-10 h-10 rounded-lg border border-white/[0.08] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed bg-transparent"
          />
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="#00e5ff"
            disabled={disabled}
            className={`${baseClasses} flex-1`}
          />
        </div>
      ) : field.type === "select" ? (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={baseClasses}
        >
          <option value="">選択してください</option>
          {field.options?.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ) : field.type === "image" || field.type === "images" ? (
        <div className="space-y-2">
          <p className="text-white/30 text-xs">
            {field.type === "images"
              ? `現在の画像を差し替えたい場合は、備考欄にてお知らせください（最大${field.max || 10}枚）`
              : "画像を差し替えたい場合は、備考欄にてお知らせください"}
          </p>
        </div>
      ) : field.type === "tags" ? (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          disabled={disabled}
          className={baseClasses}
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

      {field.help && (
        <p className="text-white/25 text-xs">{field.help}</p>
      )}
    </div>
  );
}
