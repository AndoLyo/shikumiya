"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Building2, Palette, Globe, ArrowRight, ArrowLeft, Check,
  Sparkles, Search, AlertCircle, ExternalLink, Mail, Phone,
  ChevronRight, Loader2, X, Eye, Heart,
} from "lucide-react";

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
    { id: "warm-craft", name: "ウォームクラフト（おまかせ）", desc: "温もりのある、地域密着型の工務店に", preview: "/portfolio-templates/warm-craft" },
    { id: "warm-craft-mid", name: "ウォームクラフト（まるっと）", desc: "ブログ・お客様の声・Maps付き", preview: "/portfolio-templates/warm-craft-mid" },
    { id: "warm-craft-pro", name: "ウォームクラフト（ぜんぶ）", desc: "AIチャット・予約システム搭載", preview: "/portfolio-templates/warm-craft-pro" },
  ],
  builder: [
    { id: "trust-navy", name: "トラストネイビー（おまかせ）", desc: "信頼感のあるネイビー×ゴールド", preview: "/portfolio-templates/trust-navy" },
    { id: "trust-navy-mid", name: "トラストネイビー（まるっと）", desc: "ニュース・実績詳細・Maps付き", preview: "/portfolio-templates/trust-navy-mid" },
    { id: "trust-navy-pro", name: "トラストネイビー（ぜんぶ）", desc: "採用ページ・動画・AI搭載", preview: "/portfolio-templates/trust-navy-pro" },
  ],
  architect: [
    { id: "clean-arch", name: "クリーンアーチ（おまかせ）", desc: "余白を活かしたミニマルデザイン", preview: "/portfolio-templates/clean-arch" },
    { id: "clean-arch-mid", name: "クリーンアーチ（まるっと）", desc: "受賞歴・ニュース・詳細ページ付き", preview: "/portfolio-templates/clean-arch-mid" },
    { id: "clean-arch-pro", name: "クリーンアーチ（ぜんぶ）", desc: "多言語・360°ビュー・PDF搭載", preview: "/portfolio-templates/clean-arch-pro" },
  ],
  other: [
    { id: "warm-craft", name: "ウォームクラフト", desc: "温かみのあるデザイン", preview: "/portfolio-templates/warm-craft" },
    { id: "trust-navy", name: "トラストネイビー", desc: "信頼感のあるデザイン", preview: "/portfolio-templates/trust-navy" },
    { id: "clean-arch", name: "クリーンアーチ", desc: "洗練されたデザイン", preview: "/portfolio-templates/clean-arch" },
  ],
};

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

  // 申込
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

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
              <span className="text-gray-700 font-medium text-xs">{selectedDomain || existingDomain || subdomain}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">月額</span>
              <span className={`font-bold ${gradientText}`}>¥3,000/月〜</span>
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
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
              <div className="text-center mb-8">
                <h1 className="text-gray-800 text-2xl sm:text-3xl font-bold mb-2">
                  会社名を入力してください
                </h1>
                <p className="text-gray-400 text-sm">入力するとプレビューに反映されます</p>
              </div>

              <div className="flex flex-col lg:flex-row gap-8">
                {/* 入力エリア */}
                <div className="flex-1">
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
                    <label className="block text-sm text-gray-700 font-medium mb-2">会社名・屋号</label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="例：山田工務店"
                      className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 text-lg placeholder:text-gray-300 focus:outline-none focus:border-purple-300 focus:ring-2 focus:ring-purple-100 transition-all"
                      autoFocus
                    />
                  </div>

                  {companyName && (
                    <motion.div
                      className="bg-green-50 rounded-2xl p-5 border border-green-100"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Heart className="w-4 h-4 text-green-500" fill="#22c55e" />
                        <p className="text-green-700 text-sm font-medium">いい名前ですね！</p>
                      </div>
                      <p className="text-green-600 text-xs">
                        右のプレビューに「{companyName}」が反映されています。
                        <br />こんなサイトが、月3,000円で持てます。
                      </p>
                    </motion.div>
                  )}
                </div>

                {/* プレビュー */}
                {previewTemplate && (
                  <div className="lg:w-[400px] flex-shrink-0">
                    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-lg sticky top-20">
                      <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border-b border-gray-100">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 rounded-full bg-red-300" />
                          <div className="w-2 h-2 rounded-full bg-yellow-300" />
                          <div className="w-2 h-2 rounded-full bg-green-300" />
                        </div>
                        <div className="flex-1 mx-2 px-2 py-0.5 rounded bg-white border border-gray-200 text-[9px] text-gray-400 font-mono truncate">
                          {companyName ? subdomain : "your-site.vercel.app"}
                        </div>
                      </div>
                      <div className="relative h-[400px] overflow-hidden">
                        <iframe
                          src={previewTemplate}
                          title="プレビュー"
                          className="absolute top-0 left-0 w-[1200px] h-[800px] origin-top-left border-0 pointer-events-none"
                          style={{ transform: "scale(0.34)" }}
                          loading="lazy"
                          tabIndex={-1}
                        />
                      </div>
                      <div className="px-4 py-2.5 border-t border-gray-100 bg-purple-50 text-center">
                        <p className="text-purple-500 text-xs font-medium">
                          {companyName ? `「${companyName}」のサイトイメージ` : "サイトプレビュー"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-center gap-4 mt-8">
                <button onClick={back} className="px-6 py-3 rounded-full border border-gray-200 text-gray-500 text-sm hover:bg-white transition-colors">
                  <ArrowLeft className="w-4 h-4 inline mr-1" /> 戻る
                </button>
                {companyName.trim() && (
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
          )}

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
                {/* ドメイン */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-gray-800 font-bold text-sm mb-4 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-purple-400" />
                    ドメイン（サイトのURL）
                  </h3>

                  {/* 持ってる/持ってない */}
                  {hasDomain === null ? (
                    <div className="space-y-3">
                      <p className="text-gray-500 text-sm mb-3">独自ドメイン（○○.comなど）をお持ちですか？</p>
                      <div className="grid grid-cols-2 gap-3">
                        <button onClick={() => setHasDomain(true)} className="p-4 rounded-xl border-2 border-gray-100 hover:border-purple-200 hover:bg-purple-50/30 transition-all text-center">
                          <p className="text-gray-800 font-medium text-sm">はい、持っています</p>
                          <p className="text-gray-400 text-xs mt-0.5">既存のドメインを使う</p>
                        </button>
                        <button onClick={() => setHasDomain(false)} className="p-4 rounded-xl border-2 border-gray-100 hover:border-purple-200 hover:bg-purple-50/30 transition-all text-center">
                          <p className="text-gray-800 font-medium text-sm">いいえ、まだです</p>
                          <p className="text-gray-400 text-xs mt-0.5">新しく取得する</p>
                        </button>
                      </div>
                    </div>
                  ) : hasDomain ? (
                    /* 既存ドメイン入力 */
                    <div>
                      <label className="block text-xs text-gray-500 mb-1.5 font-medium">お持ちのドメイン</label>
                      <input
                        type="text"
                        value={existingDomain}
                        onChange={(e) => setExistingDomain(e.target.value)}
                        placeholder="例：yamada-koumuten.com"
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 text-sm placeholder:text-gray-300 focus:outline-none focus:border-purple-300 focus:ring-2 focus:ring-purple-100"
                      />
                      <button onClick={() => setHasDomain(null)} className="text-gray-400 text-xs mt-2 hover:text-gray-600">← 選び直す</button>
                    </div>
                  ) : (
                    /* 新規ドメイン検索 */
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1.5 font-medium">希望のドメイン名</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={domainSearch}
                            onChange={(e) => setDomainSearch(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && searchDomain()}
                            placeholder="例：yamada-koumuten"
                            className="flex-1 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 text-sm placeholder:text-gray-300 focus:outline-none focus:border-purple-300"
                          />
                          <button onClick={searchDomain} className="px-4 py-3 rounded-xl bg-purple-500 text-white text-sm font-medium hover:bg-purple-600 transition-colors flex-shrink-0">
                            <Search className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* 検索結果 */}
                      {domainResults.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-gray-500 text-xs">取得可能なドメイン:</p>
                          {domainResults.map((r) => (
                            <button
                              key={r.domain}
                              onClick={() => r.available && setSelectedDomain(r.domain)}
                              disabled={!r.available}
                              className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${
                                selectedDomain === r.domain
                                  ? "border-purple-300 bg-purple-50"
                                  : r.available
                                    ? "border-gray-100 hover:border-purple-200"
                                    : "border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed"
                              }`}
                            >
                              <span className={`text-sm font-mono ${r.available ? "text-gray-800" : "text-gray-400 line-through"}`}>{r.domain}</span>
                              <div className="flex items-center gap-2">
                                {r.available ? (
                                  <>
                                    <span className="text-green-500 text-xs">取得可能</span>
                                    <span className="text-gray-400 text-xs">{r.price}</span>
                                    {selectedDomain === r.domain && <Check className="w-4 h-4 text-purple-500" />}
                                  </>
                                ) : (
                                  <span className="text-red-400 text-xs">取得不可</span>
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                      )}

                      {/* まだ決められない */}
                      <div className="border-t border-gray-100 pt-3">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={useSubdomain}
                            onChange={(e) => { setUseSubdomain(e.target.checked); if (e.target.checked) setSelectedDomain(null); }}
                            className="w-4 h-4 rounded text-purple-500 focus:ring-purple-200"
                          />
                          <div>
                            <p className="text-gray-700 text-sm">まだ決められない — まずは無料のURLで始める</p>
                            <p className="text-gray-400 text-xs">{subdomain}（後から独自ドメインに変更可能）</p>
                          </div>
                        </label>
                      </div>

                      <button onClick={() => setHasDomain(null)} className="text-gray-400 text-xs hover:text-gray-600">← 選び直す</button>

                      <div className="bg-orange-50 border border-orange-100 rounded-xl p-3">
                        <p className="text-orange-600 text-xs flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                          <span>ドメインは一度決めると変更が大変です。じっくりお考えください。後からの変更もサポートしますが、費用と手間がかかります。</span>
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* 連絡先 */}
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
                    <div className="flex justify-between text-sm"><span className="text-gray-400">月額利用料</span><span className="text-gray-800 font-bold">¥3,000/月〜</span></div>
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
                    disabled={submitting || !email.trim() || (!existingDomain && !selectedDomain && !useSubdomain)}
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
    </div>
  );
}
