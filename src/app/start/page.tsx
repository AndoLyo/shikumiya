"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  Building2, Palette, Globe, ArrowRight, ArrowLeft, Check,
  Sparkles, Search, AlertCircle, ExternalLink, Mail, Phone,
  ChevronRight, Loader2, X, Eye, Heart, Maximize2, Monitor,
} from "lucide-react";
import LoginModal from "@/components/LoginModal";

/* ═══════════════════════════════════════
   業種データ
   ═══════════════════════════════════════ */
const INDUSTRIES = [
  { id: "construction", label: "工務店・リフォーム", icon: Building2, desc: "施工実績を魅力的に見せるサイト", color: "text-green-600", bg: "bg-green-50", border: "border-green-100" },
  { id: "builder", label: "建設会社", icon: Building2, desc: "信頼と実績を伝えるコーポレートサイト", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
  { id: "architect", label: "設計事務所", icon: Palette, desc: "作品が映えるミニマルなポートフォリオ", color: "text-gray-600", bg: "bg-gray-50", border: "border-gray-200" },
  { id: "other", label: "その他の業種", icon: Globe, desc: "飲食・小売・士業など幅広く対応", color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-100" },
];

const TEMPLATES: Record<string, { id: string; name: string; desc: string; preview: string }[]> = {
  construction: [
    { id: "warm-craft", name: "ウォームクラフト（おためし）", desc: "温もりのある、地域密着型の工務店に", preview: "/portfolio-templates/warm-craft" },
    { id: "warm-craft-mid", name: "ウォームクラフト（おまかせ）", desc: "ブログ・お客様の声・Maps付き", preview: "/portfolio-templates/warm-craft-mid" },
    { id: "warm-craft-pro", name: "ウォームクラフト（おまかせプロ）", desc: "AIチャット・予約システム搭載", preview: "/portfolio-templates/warm-craft-pro" },
  ],
  builder: [
    { id: "trust-navy", name: "トラストネイビー（おためし）", desc: "信頼感のあるネイビー×ゴールド", preview: "/portfolio-templates/trust-navy" },
    { id: "trust-navy-mid", name: "トラストネイビー（おまかせ）", desc: "ニュース・実績詳細・Maps付き", preview: "/portfolio-templates/trust-navy-mid" },
    { id: "trust-navy-pro", name: "トラストネイビー（おまかせプロ）", desc: "採用ページ・動画・AI搭載", preview: "/portfolio-templates/trust-navy-pro" },
  ],
  architect: [
    { id: "clean-arch", name: "クリーンアーチ（おためし）", desc: "余白を活かしたミニマルデザイン", preview: "/portfolio-templates/clean-arch" },
    { id: "clean-arch-mid", name: "クリーンアーチ（おまかせ）", desc: "受賞歴・ニュース・詳細ページ付き", preview: "/portfolio-templates/clean-arch-mid" },
    { id: "clean-arch-pro", name: "クリーンアーチ（おまかせプロ）", desc: "多言語・360°ビュー・PDF搭載", preview: "/portfolio-templates/clean-arch-pro" },
  ],
  other: [
    { id: "warm-craft", name: "ウォームクラフト", desc: "温かみのあるデザイン", preview: "/portfolio-templates/warm-craft" },
    { id: "trust-navy", name: "トラストネイビー", desc: "信頼感のあるデザイン", preview: "/portfolio-templates/trust-navy" },
    { id: "clean-arch", name: "クリーンアーチ", desc: "洗練されたデザイン", preview: "/portfolio-templates/clean-arch" },
  ],
};

/* ═══════════════════════════════════════
   プラン情報ヘルパー
   ═══════════════════════════════════════ */
function getPlanInfo(templateId: string | null): { label: string; price: string; planKey: string } {
  if (!templateId) return { label: "おためし", price: "¥0", planKey: "otameshi" };
  if (templateId.endsWith("-pro")) return { label: "おまかせプロ", price: "¥4,980", planKey: "omakase-pro" };
  if (templateId.endsWith("-mid")) return { label: "おまかせ", price: "¥1,480", planKey: "omakase" };
  return { label: "おためし", price: "¥0", planKey: "otameshi" };
}

/* ═══════════════════════════════════════
   ドメイン検索（デモ用）
   ═══════════════════════════════════════ */
const TLDs = [".com", ".jp", ".co.jp", ".net"];

function checkDomainAvailability(name: string): { domain: string; available: boolean; price: string }[] {
  // デモ用のダミー結果
  const base = name.toLowerCase().replace(/[^a-z0-9-]/g, "");
  if (!base) return [];
  return TLDs.map((tld) => ({
    domain: `${base}${tld}`,
    available: Math.random() > 0.3, // デモ用ランダム
    price: tld === ".co.jp" ? "¥3,980/年" : tld === ".jp" ? "¥2,980/年" : "¥1,480/年",
  }));
}

/* ═══════════════════════════════════════
   Shared styles
   ═══════════════════════════════════════ */
const gradientBg = "bg-gradient-to-r from-[#e84393] via-[#6c5ce7] to-[#f39c12]";
const gradientText = "bg-gradient-to-r from-[#e84393] via-[#6c5ce7] to-[#f39c12] bg-clip-text text-transparent";

/* ═══════════════════════════════════════
   Progress Bar
   ═══════════════════════════════════════ */
function ProgressBar({ step, total }: { step: number; total: number }) {
  return (
    <div className="w-full max-w-[400px] mx-auto mb-8">
      <div className="flex items-center justify-between mb-2">
        {Array.from({ length: total }, (_, i) => (
          <div key={i} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              i < step ? `${gradientBg} text-white` :
              i === step ? "border-2 border-purple-400 text-purple-500" :
              "border-2 border-gray-200 text-gray-300"
            }`}>
              {i < step ? <Check className="w-4 h-4" /> : i + 1}
            </div>
            {i < total - 1 && (
              <div className={`w-12 sm:w-20 h-0.5 mx-1 transition-colors ${i < step ? "bg-purple-400" : "bg-gray-200"}`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   Main Page
   ═══════════════════════════════════════ */
export default function StartPage() {
  const { data: session, status: authStatus } = useSession();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const [step, setStep] = useState(0);
  const [industry, setIndustry] = useState<string | null>(null);
  const [template, setTemplate] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState("");
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null);

  // ドメイン
  const [hasDomain, setHasDomain] = useState<boolean | null>(null);
  const [existingDomain, setExistingDomain] = useState("");
  const [domainSearch, setDomainSearch] = useState("");
  const [domainResults, setDomainResults] = useState<ReturnType<typeof checkDomainAvailability>>([]);
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [useSubdomain, setUseSubdomain] = useState(false);

  // 未ログインの場合、3秒後にLoginModalを自動表示
  useEffect(() => {
    if (authStatus === "unauthenticated") {
      const timer = setTimeout(() => setShowAuthModal(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [authStatus]);

  // 申込
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [siteSlugInput, setSiteSlugInput] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [fullscreen, setFullscreen] = useState(false);

  // プレビュー iframe への postMessage 送信
  const previewRef = useRef<HTMLIFrameElement>(null);
  const fullscreenRef = useRef<HTMLIFrameElement>(null);

  const sendPreviewName = useCallback((name: string) => {
    const msg = { type: "shikumiya-preview-name", name };
    previewRef.current?.contentWindow?.postMessage(msg, "*");
    fullscreenRef.current?.contentWindow?.postMessage(msg, "*");
  }, []);

  useEffect(() => {
    if (step === 2 && companyName.trim()) {
      sendPreviewName(companyName.trim());
    }
  }, [companyName, step, sendPreviewName]);

  const searchDomain = () => {
    if (!domainSearch.trim()) return;
    setDomainResults(checkDomainAvailability(domainSearch.trim()));
  };

  const next = () => setStep((s) => s + 1);
  const back = () => setStep((s) => Math.max(0, s - 1));

  // プレビュー用テンプレートの自動更新
  useEffect(() => {
    if (template) {
      const tpl = Object.values(TEMPLATES).flat().find((t) => t.id === template);
      if (tpl) setPreviewTemplate(tpl.preview);
    }
  }, [template]);

  // サブドメイン名
  const subdomain = companyName
    ? `shikumiya-${companyName.replace(/[^a-zA-Z0-9]/g, "").toLowerCase() || "sample"}.vercel.app`
    : "shikumiya-sample.vercel.app";

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#fdf2f8] via-[#f3f0ff] to-[#fff7ed] flex items-center justify-center p-5">
        <motion.div className="bg-white rounded-3xl shadow-xl p-10 max-w-[500px] w-full text-center" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <motion.div
            className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <Check className="w-10 h-10 text-green-500" />
          </motion.div>
          <h2 className="text-gray-800 text-2xl font-bold mb-3">お申し込みありがとうございます！</h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-6">
            ご入力いただいた内容をもとに、サイトの制作を開始します。
            <br />最短翌日にはあなたのホームページが完成します。
          </p>

          <div className="bg-gray-50 rounded-2xl p-5 text-left space-y-3 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">会社名</span>
              <span className="text-gray-700 font-medium">{companyName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">テンプレート</span>
              <span className="text-gray-700 font-medium">{Object.values(TEMPLATES).flat().find((t) => t.id === template)?.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">ドメイン</span>
              <span className="text-gray-700 font-medium text-xs">{siteSlugInput ? `shikumiya-${siteSlugInput}.vercel.app` : subdomain}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">プラン</span>
              <span className="text-gray-700">{getPlanInfo(template).label}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">月額</span>
              <span className={`font-bold ${gradientText}`}>{getPlanInfo(template).price}/月</span>
            </div>
          </div>

          <p className="text-gray-400 text-xs mb-4">確認メールを {email} に送信しました</p>

          <Link href="/" className="text-purple-500 text-sm hover:underline">
            トップページに戻る
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdf2f8] via-[#f3f0ff] to-[#fff7ed]">
      {/* Header */}
      <header className="px-5 py-4 flex items-center justify-between max-w-[1200px] mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-xl ${gradientBg} flex items-center justify-center`}>
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-gray-800 font-bold text-sm">しくみや</span>
        </Link>
        <Link href="/" className="text-gray-400 text-xs hover:text-gray-600 transition-colors">
          トップに戻る
        </Link>
      </header>

      <div className="max-w-[900px] mx-auto px-5 py-8">
        <ProgressBar step={step} total={4} />

        <AnimatePresence mode="wait">
          {/* ═══════════════════════════════════════
             STEP 0: 業種を選ぶ
             ═══════════════════════════════════════ */}
          {step === 0 && (
            <motion.div key="step0" className="text-center" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
              <h1 className="text-gray-800 text-2xl sm:text-3xl font-bold mb-2">
                あなたの業種は？
              </h1>
              <p className="text-gray-400 text-sm mb-10">
                業種に合わせたデザインをご用意しています
              </p>

              <div className="grid sm:grid-cols-2 gap-4 max-w-[600px] mx-auto">
                {INDUSTRIES.map((ind) => {
                  const Icon = ind.icon;
                  const selected = industry === ind.id;
                  return (
                    <button
                      key={ind.id}
                      onClick={() => { setIndustry(ind.id); setTemplate(null); }}
                      className={`p-6 rounded-2xl border-2 text-left transition-all hover:shadow-lg ${
                        selected
                          ? `${ind.border} ${ind.bg} shadow-md`
                          : "border-white bg-white hover:border-purple-100"
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl ${ind.bg} flex items-center justify-center mb-3`}>
                        <Icon className={`w-6 h-6 ${ind.color}`} strokeWidth={1.5} />
                      </div>
                      <h3 className="text-gray-800 font-bold text-base mb-1">{ind.label}</h3>
                      <p className="text-gray-400 text-xs">{ind.desc}</p>
                      {selected && (
                        <motion.div className="mt-3 flex items-center gap-1 text-purple-500 text-xs font-medium" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                          <Check className="w-3.5 h-3.5" /> 選択中
                        </motion.div>
                      )}
                    </button>
                  );
                })}
              </div>

              {industry && (
                <motion.button
                  onClick={next}
                  className={`mt-8 px-10 py-4 rounded-full ${gradientBg} text-white font-bold text-sm tracking-wider hover:opacity-90 transition-all shadow-lg shadow-purple-200/50`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  次へ — デザインを選ぶ <ArrowRight className="w-4 h-4 inline ml-2" />
                </motion.button>
              )}
            </motion.div>
          )}

          {/* ═══════════════════════════════════════
             STEP 1: テンプレートを選ぶ
             ═══════════════════════════════════════ */}
          {step === 1 && industry && (
            <motion.div key="step1" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
              <div className="text-center mb-8">
                <h1 className="text-gray-800 text-2xl sm:text-3xl font-bold mb-2">
                  デザインを選んでください
                </h1>
                <p className="text-gray-400 text-sm">クリックでプレビューを確認できます</p>
              </div>

              <div className="grid lg:grid-cols-3 gap-5 mb-8">
                {(TEMPLATES[industry] || []).map((tpl) => {
                  const selected = template === tpl.id;
                  return (
                    <button
                      key={tpl.id}
                      onClick={() => setTemplate(tpl.id)}
                      className={`rounded-2xl overflow-hidden border-2 text-left transition-all hover:shadow-xl ${
                        selected ? "border-purple-400 shadow-lg shadow-purple-100" : "border-white bg-white hover:border-purple-100"
                      }`}
                    >
                      {/* Preview */}
                      <div className="relative h-40 bg-gray-100 overflow-hidden">
                        <iframe
                          src={tpl.preview}
                          title={tpl.name}
                          className="absolute top-0 left-0 w-[1200px] h-[800px] origin-top-left border-0 pointer-events-none"
                          style={{ transform: "scale(0.26)" }}
                          loading="lazy"
                          tabIndex={-1}
                        />
                        {selected && (
                          <div className="absolute inset-0 bg-purple-500/10 flex items-center justify-center">
                            <div className="px-4 py-1.5 rounded-full bg-purple-500 text-white text-xs font-medium">
                              <Check className="w-3 h-3 inline mr-1" /> 選択中
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="p-4 bg-white">
                        <h3 className={`font-bold text-sm mb-0.5 ${selected ? "text-purple-600" : "text-gray-800"}`}>{tpl.name}</h3>
                        <p className="text-gray-400 text-xs">{tpl.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-center gap-4">
                <button onClick={back} className="px-6 py-3 rounded-full border border-gray-200 text-gray-500 text-sm hover:bg-white transition-colors">
                  <ArrowLeft className="w-4 h-4 inline mr-1" /> 戻る
                </button>
                {template && (
                  <motion.button
                    onClick={next}
                    className={`px-10 py-3 rounded-full ${gradientBg} text-white font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-purple-200/50`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    次へ — 会社名を入力 <ArrowRight className="w-4 h-4 inline ml-2" />
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}

          {/* ═══════════════════════════════════════
             STEP 2: 会社名 → デモサイト即表示
             ═══════════════════════════════════════ */}
          {step === 2 && (() => {
            const planInfo = getPlanInfo(template);
            const tplInfo = Object.values(TEMPLATES).flat().find((t) => t.id === template);
            const nameValid = companyName.trim().length >= 2;
            return (
            <motion.div key="step2" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
              <div className="text-center mb-8">
                <h1 className="text-gray-800 text-2xl sm:text-3xl font-bold mb-2">
                  会社名を入力してください
                </h1>
                <p className="text-gray-400 text-sm">入力した名前がプレビューにリアルタイムで反映されます</p>
              </div>

              <div className="flex flex-col lg:flex-row gap-8">
                {/* 入力エリア */}
                <div className="flex-1 space-y-5">
                  {/* 選択済みテンプレ情報 */}
                  <div className="bg-purple-50/60 rounded-2xl p-4 border border-purple-100 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <Monitor className="w-5 h-5 text-purple-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-800 text-sm font-medium truncate">{tplInfo?.name || "テンプレート"}</p>
                      <p className="text-purple-500 text-xs font-bold">{planInfo.label}プラン — 月額{planInfo.price}</p>
                    </div>
                    <button onClick={back} className="text-purple-400 text-xs hover:text-purple-600 flex-shrink-0">変更</button>
                  </div>

                  {/* 会社名入力 */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <label className="block text-sm text-gray-700 font-medium mb-2">会社名・屋号 <span className="text-red-400">*</span></label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="例：山田工務店"
                      className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 text-lg placeholder:text-gray-300 focus:outline-none focus:border-purple-300 focus:ring-2 focus:ring-purple-100 transition-all"
                      autoFocus
                    />
                    {companyName.trim().length > 0 && companyName.trim().length < 2 && (
                      <p className="text-orange-500 text-xs mt-2 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> 2文字以上入力してください
                      </p>
                    )}
                  </div>

                  {/* 入力後のフィードバック */}
                  {nameValid && (
                    <motion.div
                      className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-3"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-green-50 flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 text-green-500" />
                        </div>
                        <p className="text-gray-700 text-sm font-medium">プレビューに反映済み</p>
                      </div>
                      <div className="space-y-2 pl-8">
                        <div className="flex items-center gap-2 text-xs">
                          <Globe className="w-3.5 h-3.5 text-gray-400" />
                          <span className="text-gray-500">サイトURL:</span>
                          <span className="text-gray-700 font-mono text-[11px]">{subdomain}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <Sparkles className="w-3.5 h-3.5 text-gray-400" />
                          <span className="text-gray-500">制作費:</span>
                          <span className="text-green-600 font-bold">¥0（無料）</span>
                          <span className="text-gray-400">+ 月額{planInfo.price}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* プレビュー */}
                {previewTemplate && (
                  <div className="lg:w-[420px] flex-shrink-0">
                    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-lg sticky top-20">
                      {/* ブラウザバー */}
                      <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border-b border-gray-100">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 rounded-full bg-red-300" />
                          <div className="w-2 h-2 rounded-full bg-yellow-300" />
                          <div className="w-2 h-2 rounded-full bg-green-300" />
                        </div>
                        <div className="flex-1 mx-2 px-2 py-0.5 rounded bg-white border border-gray-200 text-[9px] text-gray-400 font-mono truncate">
                          {companyName.trim() ? subdomain : "your-site.vercel.app"}
                        </div>
                        <button
                          onClick={() => setFullscreen(true)}
                          className="p-1 rounded hover:bg-gray-200 transition-colors"
                          title="フルスクリーンで見る"
                        >
                          <Maximize2 className="w-3 h-3 text-gray-400" />
                        </button>
                      </div>
                      {/* iframe */}
                      <div className="relative h-[420px] overflow-hidden bg-gray-50">
                        <iframe
                          ref={previewRef}
                          src={previewTemplate}
                          title="プレビュー"
                          className="absolute top-0 left-0 w-[1200px] h-[900px] origin-top-left border-0 pointer-events-none"
                          style={{ transform: "scale(0.35)" }}
                          loading="lazy"
                          tabIndex={-1}
                          onLoad={() => { if (companyName.trim()) sendPreviewName(companyName.trim()); }}
                        />
                      </div>
                      {/* キャプション */}
                      <div className="px-4 py-2.5 border-t border-gray-100 flex items-center justify-between">
                        <p className="text-gray-500 text-xs">
                          {nameValid ? (
                            <><span className="text-green-500 font-medium">●</span> 「{companyName.trim()}」を反映中</>
                          ) : (
                            "会社名を入力するとここに反映されます"
                          )}
                        </p>
                        <button
                          onClick={() => setFullscreen(true)}
                          className="text-purple-500 text-xs font-medium hover:text-purple-700 flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" /> 拡大
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-center gap-4 mt-8">
                <button onClick={back} className="px-6 py-3 rounded-full border border-gray-200 text-gray-500 text-sm hover:bg-white transition-colors">
                  <ArrowLeft className="w-4 h-4 inline mr-1" /> 戻る
                </button>
                {nameValid && (
                  <motion.button
                    onClick={next}
                    className={`px-10 py-3 rounded-full ${gradientBg} text-white font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-purple-200/50`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    次へ — ドメイン・連絡先 <ArrowRight className="w-4 h-4 inline ml-2" />
                  </motion.button>
                )}
              </div>
            </motion.div>
            );
          })()}

          {/* フルスクリーンプレビューモーダル */}
          <AnimatePresence>
            {fullscreen && previewTemplate && (
              <motion.div
                className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setFullscreen(false)}
              >
                <motion.div
                  className="bg-white rounded-2xl overflow-hidden shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                      </div>
                      <span className="text-gray-500 text-xs font-mono">{companyName.trim() ? subdomain : "your-site.vercel.app"}</span>
                    </div>
                    <button onClick={() => setFullscreen(false)} className="p-1.5 rounded-lg hover:bg-gray-200 transition-colors">
                      <X className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                  <div className="flex-1 overflow-hidden" style={{ height: "75vh" }}>
                    <iframe
                      ref={fullscreenRef}
                      src={previewTemplate}
                      title="フルスクリーンプレビュー"
                      className="w-full h-full border-0"
                      onLoad={() => { if (companyName.trim()) sendPreviewName(companyName.trim()); }}
                    />
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ═══════════════════════════════════════
             STEP 3: ドメイン + 連絡先 → 申込完了
             ═══════════════════════════════════════ */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
              <div className="text-center mb-8">
                <h1 className="text-gray-800 text-2xl sm:text-3xl font-bold mb-2">
                  あと少しで完了です
                </h1>
                <p className="text-gray-400 text-sm">ドメインと連絡先を入力してください</p>
              </div>

              <div className="max-w-[600px] mx-auto space-y-6">

                {/* 連絡先 */}
                {/* サイトURL */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-gray-800 font-bold text-sm mb-4 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-purple-400" />
                    サイトのURL
                  </h3>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1.5 font-medium">
                      サイトのアドレスを決めてください <span className="text-red-400">*</span>
                    </label>
                    <div className="flex items-center gap-0">
                      <span className="text-gray-400 text-sm bg-gray-50 border border-r-0 border-gray-200 rounded-l-xl px-3 py-3 whitespace-nowrap">
                        shikumiya-
                      </span>
                      <input
                        type="text"
                        value={siteSlugInput}
                        onChange={(e) => setSiteSlugInput(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                        placeholder="yamada-koumuten"
                        className="flex-1 px-3 py-3 bg-gray-50 border border-gray-200 text-gray-800 text-sm placeholder:text-gray-300 focus:outline-none focus:border-purple-300 focus:ring-2 focus:ring-purple-100"
                      />
                      <span className="text-gray-400 text-sm bg-gray-50 border border-l-0 border-gray-200 rounded-r-xl px-3 py-3 whitespace-nowrap">
                        .vercel.app
                      </span>
                    </div>
                    {siteSlugInput && (
                      <p className="text-xs text-purple-500 mt-2">
                        あなたのサイト: <strong>shikumiya-{siteSlugInput}.vercel.app</strong>
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      半角英数字とハイフンが使えます
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-gray-800 font-bold text-sm mb-4 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-purple-400" />
                    連絡先
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1.5 font-medium">メールアドレス <span className="text-red-400">*</span></label>
                      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="info@example.com" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 text-sm placeholder:text-gray-300 focus:outline-none focus:border-purple-300 focus:ring-2 focus:ring-purple-100" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1.5 font-medium">電話番号（任意）</label>
                      <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="090-1234-5678" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 text-sm placeholder:text-gray-300 focus:outline-none focus:border-purple-300 focus:ring-2 focus:ring-purple-100" />
                    </div>
                  </div>
                </div>

                {/* 料金確認 */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-gray-800 font-bold text-sm mb-4">お申し込み内容</h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm"><span className="text-gray-400">初期制作費</span><span className="text-green-500 font-bold">¥0（無料）</span></div>
                    <div className="flex justify-between text-sm"><span className="text-gray-400">月額利用料</span><span className="text-gray-800 font-bold">{getPlanInfo(template).price}/月</span></div>
                    <div className="flex justify-between text-sm"><span className="text-gray-400">プラン</span><span className="text-gray-700">{getPlanInfo(template).label}</span></div>
                    {selectedDomain && <div className="flex justify-between text-sm"><span className="text-gray-400">ドメイン費用</span><span className="text-gray-600">{domainResults.find((r) => r.domain === selectedDomain)?.price}</span></div>}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Check className="w-3.5 h-3.5 text-green-400" />
                    <span>いつでも解約OK・違約金なし・解約後もサイトは残ります</span>
                  </div>
                </div>

                {/* 申込ボタン */}
                <div className="flex items-center justify-center gap-4">
                  <button onClick={back} className="px-6 py-3 rounded-full border border-gray-200 text-gray-500 text-sm hover:bg-white transition-colors">
                    <ArrowLeft className="w-4 h-4 inline mr-1" /> 戻る
                  </button>
                  <button
                    onClick={async () => {
                      setSubmitting(true);
                      setSubmitError(null);
                      try {
                        const res = await fetch("/api/start", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            industry,
                            templateId: template,
                            companyName,
                            email,
                            phone,
                            domain: existingDomain || selectedDomain || "",
                            useSubdomain,
                            siteSlug: siteSlugInput,
                          }),
                        });
                        const data = await res.json();
                        if (!res.ok) throw new Error(data.error || "エラーが発生しました");

                        if (data.devMode) {
                          // 開発モード（Stripe Price未設定時）
                          setSubmitted(true);
                        } else if (data.url) {
                          // Stripe Checkoutにリダイレクト
                          window.location.href = data.url;
                        }
                      } catch (err) {
                        setSubmitError(err instanceof Error ? err.message : "エラーが発生しました");
                        setSubmitting(false);
                      }
                    }}
                    disabled={submitting || !email.trim() || !siteSlugInput.trim()}
                    className={`px-10 py-4 rounded-full ${gradientBg} text-white font-bold text-base tracking-wider hover:opacity-90 transition-all shadow-lg shadow-purple-200/50 disabled:opacity-40 disabled:cursor-not-allowed`}
                  >
                    {submitting ? (
                      <><Loader2 className="w-4 h-4 inline mr-2 animate-spin" /> 処理中...</>
                    ) : (
                      <><Sparkles className="w-4 h-4 inline mr-2" /> このサイトを作る</>
                    )}
                  </button>
                </div>

                {submitError && (
                  <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-500 text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {submitError}
                  </div>
                )}

                <p className="text-gray-400 text-[10px] text-center">
                  ※ 決済完了後、最短翌日にサイトが公開されます
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 未ログイン時の認証モーダル */}
      <LoginModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode="register"
        callbackUrl="/start"
      />

      {/* 未ログイン時のフローティングボタン（モーダルを閉じた後でも再表示可能） */}
      {authStatus === "unauthenticated" && !showAuthModal && (
        <button
          onClick={() => setShowAuthModal(true)}
          className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-full ${gradientBg} text-white font-bold text-sm shadow-lg shadow-purple-300/40 hover:opacity-90 transition-all flex items-center gap-2`}
        >
          <Mail className="w-4 h-4" /> ログイン / 新規登録
        </button>
      )}
    </div>
  );
}
