"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const templates = [
  { id: "cinematic-dark", name: "Cinematic Dark", colors: ["#0a0a1a", "#00bbdd", "#d42d83"] },
  { id: "minimal-grid", name: "Minimal Grid", colors: ["#f5f3ef", "#A28D69", "#2a2a2a"] },
  { id: "warm-natural", name: "Warm Natural", colors: ["#f2eee7", "#fffe3e", "#333333"] },
  { id: "horizontal-scroll", name: "Horizontal Scroll", colors: ["#0a0a0a", "#e63946", "#EFE8D7"] },
  { id: "elegant-mono", name: "Elegant Mono", colors: ["#1a1a1a", "#00bbdd", "#d42d83"] },
  { id: "ai-art-portfolio", name: "AI Art Portfolio", colors: ["#0a0a0f", "#6366f1", "#f59e0b"] },
  { id: "split-showcase", name: "Split Showcase", colors: ["#111111", "#ff6b6b", "#4ecdc4"] },
  { id: "stack-cards", name: "Stack Cards", colors: ["#0d0d0d", "#a855f7", "#ec4899"] },
  { id: "neo-brutalist", name: "Neo Brutalist", colors: ["#fffbe6", "#ff5722", "#222222"] },
  { id: "glass-morphism", name: "Glass Morphism", colors: ["#0f172a", "#38bdf8", "#818cf8"] },
];

const steps = [
  { num: 1, label: "情報入力", active: true },
  { num: 2, label: "お支払い", active: false },
  { num: 3, label: "完成", active: false },
];

export default function OrderPage() {
  const [artistName, setArtistName] = useState("");
  const [email, setEmail] = useState("");
  const [template, setTemplate] = useState("");
  const [bio, setBio] = useState("");
  const [snsX, setSnsX] = useState("");
  const [snsInstagram, setSnsInstagram] = useState("");
  const [snsPixiv, setSnsPixiv] = useState("");
  const [snsOther, setSnsOther] = useState("");
  const [plan, setPlan] = useState<"template" | "omakase">("template");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!artistName.trim() || !email.trim() || !template) {
      setError("必須項目を入力してください。");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          artistName: artistName.trim(),
          email: email.trim(),
          template,
          bio: bio.trim(),
          snsX: snsX.trim(),
          snsInstagram: snsInstagram.trim(),
          snsPixiv: snsPixiv.trim(),
          snsOther: snsOther.trim(),
          plan,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "エラーが発生しました。");
      }

      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました。");
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm placeholder:text-text-muted focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all duration-300";

  const labelClass = "block text-text-secondary text-sm mb-2 tracking-wide";

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#0a0a0f] pt-24 pb-20">
        {/* Background */}
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
              <span>←</span>
              <span>トップに戻る</span>
            </Link>
          </motion.div>

          {/* Page title */}
          <motion.div
            className="mt-8 mb-10 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h1 className="font-serif text-white text-2xl sm:text-3xl font-bold tracking-wide">
              サイトを作る
            </h1>

            {/* Step indicator */}
            <div className="mt-6 flex items-center justify-center gap-2 sm:gap-3">
              {steps.map((step, i) => (
                <div key={step.num} className="flex items-center gap-2 sm:gap-3">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
                        step.active
                          ? "bg-primary text-[#0a0a0f]"
                          : "bg-white/[0.06] text-text-muted"
                      }`}
                    >
                      {step.num}
                    </span>
                    <span
                      className={`text-xs tracking-wider ${
                        step.active ? "text-primary" : "text-text-muted"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <span className="text-text-muted/30 text-xs">→</span>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Section: Basic Info */}
            <section className="glass-card p-6 sm:p-8">
              <h2 className="text-white text-sm font-bold tracking-wider mb-6 flex items-center gap-2">
                <span className="w-1 h-4 bg-primary rounded-full" />
                基本情報
              </h2>

              <div className="space-y-5">
                {/* Artist Name */}
                <div>
                  <label htmlFor="artistName" className={labelClass}>
                    活動名 / アーティスト名 <span className="text-danger text-xs">*必須</span>
                  </label>
                  <input
                    id="artistName"
                    type="text"
                    value={artistName}
                    onChange={(e) => setArtistName(e.target.value)}
                    placeholder="例: Lyo"
                    className={inputClass}
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className={labelClass}>
                    メールアドレス <span className="text-danger text-xs">*必須</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="例: you@example.com"
                    className={inputClass}
                    required
                  />
                  <p className="mt-1.5 text-text-muted text-[11px] tracking-wide">
                    完成のお知らせを送信します
                  </p>
                </div>
              </div>
            </section>

            {/* Section: Template Selection */}
            <section className="glass-card p-6 sm:p-8">
              <h2 className="text-white text-sm font-bold tracking-wider mb-6 flex items-center gap-2">
                <span className="w-1 h-4 bg-primary rounded-full" />
                テンプレート選択 <span className="text-danger text-xs">*必須</span>
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {templates.map((tpl) => (
                  <label
                    key={tpl.id}
                    className={`group cursor-pointer rounded-xl overflow-hidden border transition-all duration-300 ${
                      template === tpl.id
                        ? "border-primary shadow-lg shadow-primary/10"
                        : "border-white/[0.06] hover:border-white/[0.15]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="template"
                      value={tpl.id}
                      checked={template === tpl.id}
                      onChange={() => setTemplate(tpl.id)}
                      className="sr-only"
                    />
                    {/* Color preview */}
                    <div
                      className="h-16 sm:h-20 relative overflow-hidden"
                      style={{ background: tpl.colors[0] }}
                    >
                      <div className="absolute inset-2.5 flex flex-col gap-1 opacity-60 group-hover:opacity-80 transition-opacity">
                        <div
                          className="h-0.5 w-6 rounded-full"
                          style={{ background: tpl.colors[1] }}
                        />
                        <div className="flex-1 flex gap-1 mt-0.5">
                          <div
                            className="flex-1 rounded"
                            style={{ background: `${tpl.colors[1]}20` }}
                          />
                          <div
                            className="w-1/3 rounded"
                            style={{ background: `${tpl.colors[2]}15` }}
                          />
                        </div>
                        <div className="flex gap-0.5">
                          <div
                            className="h-0.5 w-4 rounded-full"
                            style={{ background: `${tpl.colors[2]}40` }}
                          />
                          <div
                            className="h-0.5 w-3 rounded-full"
                            style={{ background: `${tpl.colors[1]}30` }}
                          />
                        </div>
                      </div>
                      {/* Selected indicator */}
                      {template === tpl.id && (
                        <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                            <path d="M1 4L3.5 6.5L9 1" stroke="#0a0a0f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      )}
                    </div>
                    {/* Name */}
                    <div className={`px-2.5 py-1.5 ${template === tpl.id ? "bg-primary/5" : "bg-[#0d0d15]"}`}>
                      <p className={`text-[10px] tracking-wider transition-colors ${
                        template === tpl.id ? "text-primary" : "text-text-secondary group-hover:text-white"
                      }`}>
                        {tpl.name}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </section>

            {/* Section: Profile */}
            <section className="glass-card p-6 sm:p-8">
              <h2 className="text-white text-sm font-bold tracking-wider mb-6 flex items-center gap-2">
                <span className="w-1 h-4 bg-primary rounded-full" />
                プロフィール
              </h2>

              <div className="space-y-5">
                {/* Bio */}
                <div>
                  <label htmlFor="bio" className={labelClass}>
                    自己紹介文 <span className="text-text-muted text-[11px]">（任意・最大200文字）</span>
                  </label>
                  <textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => {
                      if (e.target.value.length <= 200) setBio(e.target.value);
                    }}
                    placeholder="サイトに表示される自己紹介文です"
                    rows={4}
                    className={`${inputClass} resize-none`}
                  />
                  <p className="mt-1 text-right text-text-muted text-[11px]">
                    {bio.length}/200
                  </p>
                </div>

                {/* SNS Links */}
                <div>
                  <p className={labelClass}>
                    SNSリンク <span className="text-text-muted text-[11px]">（任意）</span>
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-text-muted text-xs w-20 shrink-0 text-right tracking-wider">X</span>
                      <input
                        type="text"
                        value={snsX}
                        onChange={(e) => setSnsX(e.target.value)}
                        placeholder="https://x.com/username"
                        className={inputClass}
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-text-muted text-xs w-20 shrink-0 text-right tracking-wider">Instagram</span>
                      <input
                        type="text"
                        value={snsInstagram}
                        onChange={(e) => setSnsInstagram(e.target.value)}
                        placeholder="https://instagram.com/username"
                        className={inputClass}
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-text-muted text-xs w-20 shrink-0 text-right tracking-wider">Pixiv</span>
                      <input
                        type="text"
                        value={snsPixiv}
                        onChange={(e) => setSnsPixiv(e.target.value)}
                        placeholder="https://pixiv.net/users/12345"
                        className={inputClass}
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-text-muted text-xs w-20 shrink-0 text-right tracking-wider">その他</span>
                      <input
                        type="text"
                        value={snsOther}
                        onChange={(e) => setSnsOther(e.target.value)}
                        placeholder="その他のSNSやポートフォリオURL"
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section: Plan */}
            <section className="glass-card p-6 sm:p-8">
              <h2 className="text-white text-sm font-bold tracking-wider mb-6 flex items-center gap-2">
                <span className="w-1 h-4 bg-primary rounded-full" />
                プラン選択
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Template Plan */}
                <label
                  className={`group cursor-pointer rounded-xl border p-5 transition-all duration-300 ${
                    plan === "template"
                      ? "border-primary bg-primary/[0.03] shadow-lg shadow-primary/5"
                      : "border-white/[0.08] bg-white/[0.02] hover:border-white/[0.15]"
                  }`}
                >
                  <input
                    type="radio"
                    name="plan"
                    value="template"
                    checked={plan === "template"}
                    onChange={() => setPlan("template")}
                    className="sr-only"
                  />
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-white text-sm font-bold tracking-wide">
                      テンプレートプラン
                    </span>
                    <span
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                        plan === "template" ? "border-primary" : "border-white/20"
                      }`}
                    >
                      {plan === "template" && (
                        <span className="w-2 h-2 rounded-full bg-primary" />
                      )}
                    </span>
                  </div>
                  <p className="text-primary text-xl font-bold">
                    ¥980
                    <span className="text-text-muted text-xs font-normal ml-1">買い切り</span>
                  </p>
                  <p className="mt-2 text-text-muted text-[11px] leading-relaxed tracking-wide">
                    テンプレートを選んでフォーム入力するだけ。あなた専用のギャラリーサイトが完成します。
                  </p>
                </label>

                {/* Omakase Plan */}
                <label
                  className={`group cursor-pointer rounded-xl border p-5 transition-all duration-300 relative overflow-hidden ${
                    plan === "omakase"
                      ? "border-gold bg-gold/[0.03] shadow-lg shadow-gold/5"
                      : "border-white/[0.08] bg-white/[0.02] hover:border-white/[0.15]"
                  }`}
                >
                  <input
                    type="radio"
                    name="plan"
                    value="omakase"
                    checked={plan === "omakase"}
                    onChange={() => setPlan("omakase")}
                    className="sr-only"
                  />
                  {/* Popular badge */}
                  <span className="absolute top-0 right-0 bg-gold text-[#0a0a0f] text-[9px] font-bold tracking-widest px-2.5 py-0.5 rounded-bl-lg">
                    POPULAR
                  </span>
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-white text-sm font-bold tracking-wide">
                      おまかせプラン
                    </span>
                    <span
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                        plan === "omakase" ? "border-gold" : "border-white/20"
                      }`}
                    >
                      {plan === "omakase" && (
                        <span className="w-2 h-2 rounded-full bg-gold" />
                      )}
                    </span>
                  </div>
                  <p className={`text-xl font-bold ${plan === "omakase" ? "text-gold" : "text-gold-light"}`}>
                    ¥2,980
                    <span className="text-text-muted text-xs font-normal ml-1">/月</span>
                  </p>
                  <p className="mt-2 text-text-muted text-[11px] leading-relaxed tracking-wide">
                    デザインの調整・更新・相談まですべておまかせ。月額制で継続サポートします。
                  </p>
                </label>
              </div>
            </section>

            {/* Error */}
            {error && (
              <motion.div
                className="glass-card border-danger/30 p-4 text-danger text-sm text-center"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {error}
              </motion.div>
            )}

            {/* Submit */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-12 py-4 rounded-xl bg-primary text-[#0a0a0f] font-bold text-sm tracking-wider hover:bg-primary/90 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-[#0a0a0f]/30 border-t-[#0a0a0f] rounded-full animate-spin" />
                    処理中...
                  </span>
                ) : (
                  "お支払いに進む →"
                )}
              </button>
              <p className="mt-3 text-text-muted text-[11px] tracking-wide">
                Stripeの安全な決済画面に移動します
              </p>
            </motion.div>
          </motion.form>
        </div>
      </main>
      <Footer />
    </>
  );
}
