"use client";

import { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import LoginModal from "@/components/LoginModal";
import {
  Check,
  ChevronDown,
  Smartphone,
  Shield,
  RefreshCw,
  Building2,
  Palette,
  Camera,
  Sparkles,
  ArrowRight,
  Globe,
  Heart,
  Image as ImageIcon,
  Zap,
  Clock,
  BadgeCheck,
  Star,
  MessageCircle,
  ChevronRight,
} from "lucide-react";

/* ─── Shared styles ─── */
const gradientText =
  "bg-gradient-to-r from-[#e84393] via-[#6c5ce7] to-[#f39c12] bg-clip-text text-transparent";
const gradientBg =
  "bg-gradient-to-r from-[#e84393] via-[#6c5ce7] to-[#f39c12]";
const gradientBgSoft =
  "bg-gradient-to-br from-[#fdf2f8] via-[#f3f0ff] to-[#fff7ed]";

/* ═══════════════════════════════════════
   Header
   ═══════════════════════════════════════ */
function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <>
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-purple-100/50">
      <div className="max-w-[1200px] mx-auto px-5 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className={`w-8 h-8 rounded-xl ${gradientBg} flex items-center justify-center`}>
            <Sparkles className="w-4 h-4 text-white" strokeWidth={2} />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-base font-bold text-gray-800 tracking-wide">しくみや</span>
            <span className="text-[9px] tracking-[0.15em] text-gray-400">by Lyo Vision</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {[
            ["サービス", "#services"],
            ["テンプレート", "#templates"],
            ["料金", "#pricing"],
            ["よくある質問", "#faq"],
          ].map(([label, href]) => (
            <a key={href} href={href} className="text-sm text-gray-500 hover:text-purple-600 transition-colors">
              {label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <button onClick={() => setLoginOpen(true)} className="text-sm text-gray-400 hover:text-purple-600 transition-colors cursor-pointer">
            ログイン
          </button>
          <a
            href="/start"
            className={`flex items-center gap-2 px-5 py-2 rounded-full ${gradientBg} text-white text-sm font-medium hover:opacity-90 transition-opacity shadow-lg shadow-purple-200/30`}
          >
            今すぐサイトを作る
          </a>
        </div>

        {/* Mobile */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden flex flex-col gap-1.5 w-6" aria-label="メニュー">
          <span className={`block h-0.5 bg-gray-600 transition-all duration-300 ${isOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block h-0.5 bg-gray-600 transition-all duration-300 ${isOpen ? "opacity-0" : ""}`} />
          <span className={`block h-0.5 bg-gray-600 transition-all duration-300 ${isOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-purple-100/50 px-5 py-6">
          <nav className="flex flex-col gap-4">
            {[["サービス","#services"],["テンプレート","#templates"],["料金","#pricing"],["よくある質問","#faq"]].map(([l,h])=>(
              <a key={h} href={h} onClick={()=>setIsOpen(false)} className="text-gray-600 text-base">{l}</a>
            ))}
            <button onClick={()=>{ setIsOpen(false); setLoginOpen(true); }} className="text-gray-400 text-base text-left cursor-pointer">
              ログイン
            </button>
            <a href="/start" onClick={()=>setIsOpen(false)} className={`mt-2 text-center px-5 py-3 rounded-full ${gradientBg} text-white font-medium`}>
              今すぐサイトを作る
            </a>
          </nav>
        </div>
      )}
    </header>

    <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}

/* ═══════════════════════════════════════
   Section 1: Hero — プロダクトビジュアル付き
   参考: Wix + Squarespace + Framer
   ═══════════════════════════════════════ */
function HeroSection() {
  return (
    <section className={`relative min-h-screen flex items-center pt-16 overflow-hidden ${gradientBgSoft}`}>
      {/* Decorative blobs */}
      <div className="absolute top-10 left-5 w-80 h-80 rounded-full bg-pink-200/40 blur-[100px]" />
      <div className="absolute bottom-10 right-5 w-96 h-96 rounded-full bg-purple-200/30 blur-[100px]" />
      <div className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full bg-orange-200/30 blur-[80px]" />

      <div className="relative z-10 max-w-[1100px] mx-auto px-5 py-16 sm:py-20">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left: Text */}
          <div className="flex-1 text-center lg:text-left">
            {/* Badge */}
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 border border-purple-100 shadow-sm mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Heart className="w-3.5 h-3.5 text-pink-400" fill="#fd79a8" />
              <span className="text-gray-500 text-xs tracking-wider">
                制作費 0円 — パソコン操作不要
              </span>
            </motion.div>

            {/* Main copy */}
            <motion.h1
              className="font-bold leading-[1.3] tracking-wide text-gray-800"
              style={{ fontSize: "clamp(1.6rem, 4vw, 3.2rem)" }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <span className="whitespace-nowrap">ホームページ制作、</span>
              <br />
              <span className={gradientText}>無料。</span>
            </motion.h1>

            <motion.p
              className="mt-5 text-gray-500 text-base sm:text-lg leading-relaxed max-w-[480px] mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
            >
              写真を送るだけで、プロ品質のサイトが完成。
              <br />
              月々0円から、デザインも更新もすべておまかせ。
            </motion.p>

            {/* Trust */}
            <motion.div
              className="mt-4 flex flex-wrap justify-center lg:justify-start gap-x-4 gap-y-1 text-gray-400 text-xs sm:text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <span>✓ 初期費用0円</span>
              <span>✓ 最短翌日公開</span>
              <span>✓ いつでも解約OK</span>
            </motion.div>

            {/* CTA */}
            <motion.div
              className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <a
                href="/start"
                className={`w-full sm:w-auto px-8 py-3.5 rounded-full ${gradientBg} text-white font-bold text-sm tracking-wider hover:opacity-90 transition-all shadow-lg shadow-purple-200/50 text-center`}
              >
                今すぐサイトを作る
              </a>
              <a
                href="#templates"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white/90 border border-purple-100 text-gray-600 text-sm tracking-wider hover:border-purple-300 hover:shadow-md transition-all text-center"
              >
                テンプレートを見る →
              </a>
            </motion.div>
          </div>

          {/* Right: Product visual — ブラウザモックアップ内にiframe */}
          <motion.div
            className="flex-1 w-full max-w-[560px]"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="relative">
              {/* Browser chrome */}
              <div className="rounded-2xl overflow-hidden shadow-2xl shadow-purple-200/40 border border-purple-100/50 bg-white">
                {/* Browser bar */}
                <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border-b border-gray-100">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-300" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-300" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-300" />
                  </div>
                  <div className="flex-1 mx-3 px-3 py-1 rounded-md bg-white border border-gray-200 text-[10px] text-gray-400 font-mono truncate">
                    shikumiya-sample.vercel.app
                  </div>
                </div>
                {/* iframe */}
                <div className="relative w-full h-[280px] sm:h-[340px] overflow-hidden">
                  <iframe
                    src="/portfolio-templates/warm-craft"
                    title="サンプルサイト"
                    className="absolute top-0 left-0 w-[1200px] h-[800px] origin-top-left border-0 pointer-events-none"
                    style={{ transform: "scale(0.47)" }}
                    loading="eager"
                    tabIndex={-1}
                  />
                </div>
              </div>

              {/* Floating badge */}
              <motion.div
                className="absolute -bottom-4 -left-4 sm:-left-6 px-4 py-2 rounded-xl bg-white shadow-lg shadow-purple-100/40 border border-purple-50 flex items-center gap-2"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-green-500" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400">制作時間</p>
                  <p className="text-sm font-bold text-gray-700">最短1日</p>
                </div>
              </motion.div>

              {/* Floating badge right */}
              <motion.div
                className="absolute -top-3 -right-3 sm:-right-5 px-4 py-2 rounded-xl bg-white shadow-lg shadow-pink-100/40 border border-pink-50 flex items-center gap-2"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              >
                <div className="w-8 h-8 rounded-lg bg-pink-50 flex items-center justify-center">
                  <Heart className="w-4 h-4 text-pink-400" fill="#fd79a8" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400">制作費</p>
                  <p className="text-sm font-bold text-pink-500">¥0</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════
   Section 2: 信頼の数字バー
   参考: Webflow + Shopify
   ═══════════════════════════════════════ */
const stats = [
  { num: "500+", label: "施工実績", sub: "パートナー企業合計" },
  { num: "10", label: "テンプレート", sub: "プロ品質デザイン" },
  { num: "¥0", label: "初期費用", sub: "制作費完全無料" },
  { num: "翌日", label: "最短公開", sub: "スピード納品" },
];

function TrustBar() {
  return (
    <section className="relative py-12 bg-white border-y border-purple-50">
      <div className="max-w-[900px] mx-auto px-5">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-4">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <p className={`text-2xl sm:text-3xl font-bold ${gradientText}`}>{s.num}</p>
              <p className="text-gray-700 text-sm font-medium mt-1">{s.label}</p>
              <p className="text-gray-400 text-xs">{s.sub}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════
   Section 3: こんなお悩みありませんか → 解決
   参考: Squarespace + ベイジ
   ═══════════════════════════════════════ */
const problems = [
  { icon: Globe, text: "ホームページがない。名刺にURLも載せられない。", color: "text-pink-500", bg: "bg-pink-50" },
  { icon: Clock, text: "作ったのは10年前。スマホで見るとボロボロ。", color: "text-purple-500", bg: "bg-purple-50" },
  { icon: Camera, text: "せっかくの実績写真、スマホに眠ったまま。", color: "text-orange-500", bg: "bg-orange-50" },
];

function ProblemSection() {
  return (
    <section className="relative py-20 sm:py-24 bg-white">
      <div className="max-w-[800px] mx-auto px-5">
        <motion.div className="text-center mb-14" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-pink-400 text-sm font-medium tracking-wider mb-3">PROBLEM</p>
          <h2 className="text-gray-800 font-bold text-2xl sm:text-3xl leading-snug">
            こんなお悩み、ありませんか？
          </h2>
        </motion.div>

        <div className="space-y-4 max-w-[600px] mx-auto">
          {problems.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={i}
                className="flex items-center gap-4 px-6 py-5 rounded-2xl bg-white border border-purple-50 shadow-sm hover:shadow-md hover:border-purple-100 transition-all"
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className={`w-11 h-11 rounded-xl ${p.bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-5 h-5 ${p.color}`} strokeWidth={1.5} />
                </div>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{p.text}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Transition */}
        <motion.div
          className="flex flex-col items-center mt-12 gap-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <div className="w-px h-10 bg-gradient-to-b from-purple-200 to-transparent" />
          <p className={`text-base font-bold ${gradientText}`}>
            しくみやなら、ぜんぶ解決。
          </p>
          <div className="w-px h-10 bg-gradient-to-b from-transparent to-purple-200" />
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════
   Section 4: Before → After（ビジュアル変換）
   ═══════════════════════════════════════ */
function BeforeAfterSection() {
  return (
    <section className={`relative py-20 sm:py-24 overflow-hidden ${gradientBgSoft}`}>
      <div className="max-w-[900px] mx-auto px-5">
        <motion.div className="text-center mb-14" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-purple-400 text-sm font-medium tracking-wider mb-3">BEFORE → AFTER</p>
          <h2 className="text-gray-800 font-bold text-2xl sm:text-3xl leading-snug">
            写真を送るだけで、この変化。
          </h2>
        </motion.div>

        <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-4">
          {/* Before */}
          <motion.div
            className="flex-1 w-full rounded-2xl border-2 border-dashed border-gray-200 bg-white/60 p-8 text-center"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Camera className="w-7 h-7 text-gray-300" strokeWidth={1.5} />
            </div>
            <p className="text-gray-400 font-medium text-sm mb-1">Before</p>
            <p className="text-gray-500 text-sm leading-relaxed">
              スマホに眠っている
              <br />写真やロゴデータ
            </p>
          </motion.div>

          {/* Arrow */}
          <motion.div
            className="flex-shrink-0"
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className={`w-12 h-12 rounded-full ${gradientBg} flex items-center justify-center shadow-lg shadow-purple-200/50`}>
              <ArrowRight className="w-5 h-5 text-white sm:block hidden" />
              <ChevronDown className="w-5 h-5 text-white sm:hidden" />
            </div>
          </motion.div>

          {/* After */}
          <motion.div
            className="flex-1 w-full rounded-2xl overflow-hidden border border-purple-100 shadow-xl shadow-purple-100/30 bg-white"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            {/* Browser bar */}
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border-b border-gray-100">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-red-300" />
                <div className="w-2 h-2 rounded-full bg-yellow-300" />
                <div className="w-2 h-2 rounded-full bg-green-300" />
              </div>
              <div className="flex-1 mx-2 px-2 py-0.5 rounded bg-white border border-gray-200 text-[9px] text-gray-400 font-mono">
                your-company.vercel.app
              </div>
            </div>
            <div className="relative w-full h-[200px] overflow-hidden">
              <iframe
                src="/portfolio-templates/trust-navy"
                title="完成サイト例"
                className="absolute top-0 left-0 w-[1200px] h-[800px] origin-top-left border-0 pointer-events-none"
                style={{ transform: "scale(0.36)" }}
                loading="lazy"
                tabIndex={-1}
              />
            </div>
            <div className="px-4 py-2 text-center">
              <p className="text-purple-500 font-medium text-xs">After — プロ品質のサイトが完成</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════
   Section 5: 3ステップ（ビジュアル強化版）
   参考: Wix + Squarespace
   ═══════════════════════════════════════ */
const steps = [
  { num: "1", title: "写真を送る", desc: "スマホで撮った写真でOK。LINEやメールで送るだけ。", icon: Camera, color: "from-pink-400 to-pink-500" },
  { num: "2", title: "デザインを選ぶ", desc: "業種に合ったテンプレートから、お好みを選ぶだけ。", icon: Palette, color: "from-purple-400 to-purple-500" },
  { num: "3", title: "翌日にはサイト完成", desc: "あとは全部おまかせ。最短翌日にはあなたのサイトが公開。", icon: Sparkles, color: "from-orange-400 to-orange-500" },
];

function StepsSection() {
  return (
    <section className="relative py-20 sm:py-24 bg-white">
      <div className="max-w-[900px] mx-auto px-5">
        <motion.div className="text-center mb-14" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-purple-400 text-sm font-medium tracking-wider mb-3">HOW IT WORKS</p>
          <h2 className="text-gray-800 font-bold text-2xl sm:text-3xl leading-snug">
            かんたん3ステップ
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-3 gap-6">
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={i}
                className="relative text-center bg-white rounded-2xl p-7 border border-purple-50 shadow-sm hover:shadow-lg hover:shadow-purple-100/30 hover:-translate-y-1 transition-all duration-300"
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
              >
                {/* Step number */}
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center mx-auto mb-5 shadow-sm`}>
                  <Icon className="w-6 h-6 text-white" strokeWidth={1.5} />
                </div>

                {/* Connection line (not on last) */}
                {i < 2 && (
                  <div className="hidden sm:block absolute top-12 -right-3 w-6 border-t-2 border-dashed border-purple-200" />
                )}

                <p className="text-purple-400 text-xs font-medium tracking-wider mb-2">STEP {s.num}</p>
                <h3 className="text-gray-800 font-bold text-lg mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════
   Section 6: 業種別ソリューション
   参考: Squarespace + Wix ユースケース
   ═══════════════════════════════════════ */
const solutions = [
  {
    icon: Building2,
    title: "工務店・リフォーム会社",
    desc: "施工実績を美しく見せるサイト。写真を送るだけで、信頼感のあるホームページが完成。",
    points: ["施工実績ギャラリー", "会社案内・代表挨拶", "お問い合わせ導線"],
    color: "text-pink-500",
    bg: "bg-pink-50",
    border: "border-pink-100",
    href: "/start",
  },
  {
    icon: Shield,
    title: "建設会社・ゼネコン",
    desc: "技術力と信頼を伝えるサイト。施工実績と事業内容を格調高くアピール。",
    points: ["施工実績アーカイブ", "事業内容・技術力", "採用ページ"],
    color: "text-purple-500",
    bg: "bg-purple-50",
    border: "border-purple-100",
    href: "/start",
  },
  {
    icon: Sparkles,
    title: "設計事務所・デザイン",
    desc: "作品で語るミニマルなサイト。洗練されたギャラリーで世界観を伝える。",
    points: ["作品ギャラリー", "設計コンセプト", "多言語対応"],
    color: "text-orange-500",
    bg: "bg-orange-50",
    border: "border-orange-100",
    href: "/start",
  },
];

function SolutionsSection() {
  return (
    <section id="services" className={`relative py-20 sm:py-24 ${gradientBgSoft}`}>
      <div className="max-w-[1000px] mx-auto px-5">
        <motion.div className="text-center mb-14" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-purple-400 text-sm font-medium tracking-wider mb-3">SOLUTIONS</p>
          <h2 className="text-gray-800 font-bold text-2xl sm:text-3xl leading-snug">
            あなたの業種に合った
            <br className="sm:hidden" />
            ホームページを
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-3 gap-5">
          {solutions.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.a
                key={i}
                href={s.href}
                className={`group block rounded-2xl p-7 bg-white border ${s.border} hover:shadow-xl hover:shadow-purple-100/40 transition-all duration-300 hover:-translate-y-1`}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className={`w-12 h-12 rounded-xl ${s.bg} flex items-center justify-center mb-5`}>
                  <Icon className={`w-6 h-6 ${s.color}`} strokeWidth={1.5} />
                </div>
                <h3 className="text-gray-800 font-bold text-base mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">{s.desc}</p>

                {/* Points */}
                <ul className="space-y-1.5 mb-5">
                  {s.points.map((p) => (
                    <li key={p} className="flex items-center gap-2 text-sm text-gray-500">
                      <Check className="w-3.5 h-3.5 text-green-400 flex-shrink-0" strokeWidth={2.5} />
                      {p}
                    </li>
                  ))}
                </ul>

                <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${s.color} group-hover:gap-2.5 transition-all`}>
                  詳しく見る <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════
   Section 7: テンプレートギャラリー（大きめプレビュー）
   参考: Wix + Squarespace + Framer
   ═══════════════════════════════════════ */
const templates = [
  { id: "warm-craft", name: "ウォームクラフト", tag: "温もり・地域密着（工務店向け）" },
  { id: "trust-navy", name: "トラストネイビー", tag: "信頼・堅実（建設会社向け）" },
  { id: "clean-arch", name: "クリーンアーチ", tag: "洗練・ミニマル（設計事務所向け）" },
  { id: "warm-craft-mid", name: "ウォームクラフト ミドル", tag: "工務店向け＋集客機能" },
  { id: "trust-navy-mid", name: "トラストネイビー ミドル", tag: "建設会社向け＋SEO強化" },
  { id: "clean-arch-mid", name: "クリーンアーチ ミドル", tag: "設計事務所向け＋実績詳細" },
];

function TemplateSection() {
  return (
    <section id="templates" className="relative py-20 sm:py-24 bg-white">
      <div className="max-w-[1100px] mx-auto px-5">
        <motion.div className="text-center mb-14" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-purple-400 text-sm font-medium tracking-wider mb-3">TEMPLATES</p>
          <h2 className="text-gray-800 font-bold text-2xl sm:text-3xl leading-snug">
            プロがデザインした
            <br className="sm:hidden" />
            テンプレート
          </h2>
          <p className="mt-3 text-gray-400 text-sm">3業種×3プラン。業種ごとに最適化されたデザインを揃えています。</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {templates.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Link
                href={`/portfolio-templates/${t.id}`}
                className="group block rounded-2xl overflow-hidden border border-purple-50 hover:border-purple-200 hover:shadow-xl hover:shadow-purple-100/40 transition-all duration-300 bg-white"
              >
                <div className="relative w-full h-52 sm:h-56 bg-gray-50 overflow-hidden">
                  <iframe
                    src={`/portfolio-templates/${t.id}`}
                    title={t.name}
                    className="absolute top-0 left-0 w-[1400px] h-[900px] origin-top-left border-0 pointer-events-none"
                    style={{ transform: "scale(0.28)" }}
                    loading="lazy"
                    tabIndex={-1}
                  />
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-purple-900/10 transition-all duration-300 flex items-center justify-center">
                    <span className="text-white text-xs tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-purple-500/90 px-5 py-2 rounded-full font-medium">
                      デモを見る →
                    </span>
                  </div>
                </div>
                <div className="px-5 py-4 flex items-center justify-between">
                  <div>
                    <p className="text-gray-800 text-sm font-medium">{t.name}</p>
                    <p className="text-gray-400 text-xs mt-0.5">{t.tag}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-purple-400 transition-colors" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div className="text-center mt-10" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <Link href="/start" className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-purple-200 text-purple-500 text-sm font-medium hover:bg-purple-50 transition-all">
            全テンプレートを見て選ぶ <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════
   Section 8: なぜしくみや？（差別化）
   参考: ベイジ差別化セクション
   ═══════════════════════════════════════ */
const whyUs = [
  { icon: Sparkles, title: "制作費0円", desc: "初期費用は一切かかりません。月額料金だけのシンプルな料金体系。", color: "text-pink-500", bg: "bg-pink-50" },
  { icon: Zap, title: "最短翌日公開", desc: "写真を送ったら、あとはおまかせ。最短翌日にはサイトが公開されます。", color: "text-purple-500", bg: "bg-purple-50" },
  { icon: RefreshCw, title: "月1回の更新込み", desc: "写真の差し替えや文章の修正も、月1回まで無料で対応します。", color: "text-orange-500", bg: "bg-orange-50" },
  { icon: Shield, title: "解約後もサイトは残る", desc: "解約しても、作成したサイトはそのまま公開され続けます。安心。", color: "text-green-500", bg: "bg-green-50" },
  { icon: Smartphone, title: "スマホ完全対応", desc: "すべてのテンプレートがスマホ・タブレットに最適化されています。", color: "text-blue-500", bg: "bg-blue-50" },
  { icon: BadgeCheck, title: "SSL標準装備", desc: "セキュリティ証明書（HTTPS）が標準で付いています。", color: "text-purple-500", bg: "bg-purple-50" },
];

function WhyUsSection() {
  return (
    <section className={`relative py-20 sm:py-24 ${gradientBgSoft}`}>
      <div className="max-w-[900px] mx-auto px-5">
        <motion.div className="text-center mb-14" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-purple-400 text-sm font-medium tracking-wider mb-3">WHY US</p>
          <h2 className="text-gray-800 font-bold text-2xl sm:text-3xl leading-snug">
            しくみやが選ばれる理由
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {whyUs.map((w, i) => {
            const Icon = w.icon;
            return (
              <motion.div
                key={i}
                className="bg-white rounded-2xl p-6 border border-purple-50 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
              >
                <div className={`w-10 h-10 rounded-xl ${w.bg} flex items-center justify-center mb-4`}>
                  <Icon className={`w-5 h-5 ${w.color}`} strokeWidth={1.5} />
                </div>
                <h3 className="text-gray-800 font-bold text-sm mb-1.5">{w.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{w.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════
   Section 9: 料金
   ═══════════════════════════════════════ */
function PricingSection() {
  return (
    <section id="pricing" className="relative py-20 sm:py-24 bg-white">
      <div className="max-w-[600px] mx-auto px-5">
        <motion.div className="text-center mb-14" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-purple-400 text-sm font-medium tracking-wider mb-3">PRICING</p>
          <h2 className="text-gray-800 font-bold text-2xl sm:text-3xl leading-snug">料金</h2>
        </motion.div>

        <motion.div
          className="rounded-3xl bg-white border border-purple-100 shadow-2xl shadow-purple-100/30 p-8 sm:p-10 relative overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 blur-[40px] opacity-60" />

          <div className="relative">
            {/* Free badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-100 mb-6">
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              <span className="text-pink-600 text-xs font-medium">制作費 0円</span>
            </div>

            <p className="text-gray-800 font-bold text-lg mb-1">おためしプラン</p>

            <div className="flex items-baseline gap-1.5 mb-1">
              <span className={`text-4xl sm:text-5xl font-bold ${gradientText}`}>¥0</span>
              <span className="text-gray-400 text-base">/月（税込）</span>
            </div>

            <p className="text-gray-400 text-sm mb-8">
              通常の外注：<span className="line-through">30〜50万円</span> →
              <span className="text-pink-500 font-medium"> 初期費用0円</span>
            </p>

            <div className="w-full h-px bg-gradient-to-r from-transparent via-purple-100 to-transparent mb-8" />

            <ul className="space-y-3.5 mb-8">
              {[
                "業種別テンプレートから選択",
                "施工写真を最大10枚掲載",
                "お問い合わせフォーム",
                "電話タップ発信",
                "スマホ完全対応（レスポンシブ）",
                "SSL証明書（HTTPS）標準",
                "独自ドメイン対応",
                "月1回の内容更新込み",
              ].map((text) => (
                <li key={text} className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-green-400 flex-shrink-0" strokeWidth={2.5} />
                  <span className="text-gray-600 text-sm">{text}</span>
                </li>
              ))}
            </ul>

            <div className="space-y-2 mb-8 px-4 py-3 rounded-xl bg-green-50/50 border border-green-100/50">
              {[
                "いつでも解約OK・違約金なし",
                "解約月末までサイト公開・再開OK",
              ].map((text) => (
                <div key={text} className="flex items-center gap-2.5">
                  <Heart className="w-3.5 h-3.5 text-green-400 flex-shrink-0" fill="#86efac" />
                  <span className="text-green-700 text-sm">{text}</span>
                </div>
              ))}
            </div>

            <a
              href="/start"
              className={`block w-full text-center py-4 rounded-full ${gradientBg} text-white font-bold text-base tracking-wider hover:opacity-90 transition-all shadow-lg shadow-purple-200/40`}
            >
              今すぐサイトを作る
            </a>
          </div>
        </motion.div>

        <motion.p className="text-center mt-6 text-gray-400 text-xs" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          ※ 独自ドメインは全プラン対応。お申し込み時にご希望のドメインをお選びいただけます
        </motion.p>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════
   Section 10: FAQ
   参考: Squarespace + Wix
   ═══════════════════════════════════════ */
const faqs = [
  { q: "パソコンが苦手ですが大丈夫ですか？", a: "大丈夫です。写真をスマホで送っていただくだけ。サイトの作成・公開はすべてこちらで行います。" },
  { q: "本当に制作費は無料ですか？", a: "はい。おためしプランなら月額0円で始められます。初期制作費、サーバー費用、SSL証明書もすべて含まれています。" },
  { q: "どのくらいで完成しますか？", a: "写真とお打ち合わせ内容をいただいてから、最短翌日〜3営業日で公開できます。" },
  { q: "途中で写真や文章を変えたい場合は？", a: "月1回まで無料で更新いたします。お気軽にご連絡ください。" },
  { q: "解約したらサイトは消えますか？", a: "いいえ。解約後もサイトはそのまま残ります。更新サポートが停止されるだけです。再開もいつでも可能です。" },
  { q: "どんな業種でも対応していますか？", a: "はい。工務店・建設会社・設計事務所を中心に、幅広い業種に対応しています。まずはお気軽にご相談ください。" },
];

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className={`relative py-20 sm:py-24 ${gradientBgSoft}`}>
      <div className="max-w-[700px] mx-auto px-5">
        <motion.div className="text-center mb-14" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-purple-400 text-sm font-medium tracking-wider mb-3">FAQ</p>
          <h2 className="text-gray-800 font-bold text-2xl sm:text-3xl leading-snug">よくある質問</h2>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <motion.div
                key={i}
                className="rounded-2xl bg-white border border-purple-50 overflow-hidden shadow-sm"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <button
                  aria-expanded={isOpen}
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left hover:bg-purple-50/30 transition-colors"
                >
                  <span className="text-sm sm:text-base font-medium text-gray-700">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-purple-300 flex-shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} strokeWidth={1.5} />
                </button>
                <div className="grid transition-all duration-300 ease-in-out" style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}>
                  <div className="overflow-hidden">
                    <div className="px-6 pb-5">
                      <div className="w-full h-px bg-purple-50 mb-4" />
                      <p className="text-sm sm:text-base text-gray-500 leading-relaxed">{faq.a}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════
   Section 12: 最終CTA（フッター直前）
   参考: Wix + Framer + Webflow
   ═══════════════════════════════════════ */
function FinalCTA() {
  return (
    <section className={`relative py-20 sm:py-28 overflow-hidden ${gradientBgSoft}`}>
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-purple-200/30 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-[600px] mx-auto px-5 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-gray-800 font-bold text-2xl sm:text-3xl leading-snug mb-4">
            あなたのビジネスを、
            <br />
            <span className={gradientText}>もっと多くの人に届けよう。</span>
          </h2>
          <p className="text-gray-500 text-sm sm:text-base leading-relaxed mb-8">
            ホームページがあるだけで、出会える人が変わります。
            <br />
            まずは気軽にご相談ください。
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="/start"
              className={`w-full sm:w-auto px-10 py-4 rounded-full ${gradientBg} text-white font-bold text-base tracking-wider hover:opacity-90 transition-all shadow-lg shadow-purple-200/50 text-center`}
            >
              今すぐサイトを作る
            </a>
          </div>
          <p className="mt-4 text-gray-400 text-xs">制作費0円・クレジットカード不要</p>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════
   Footer
   ═══════════════════════════════════════ */
function FooterSection() {
  return (
    <footer className="bg-white border-t border-purple-50 py-10 px-5">
      <div className="max-w-[900px] mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className={`w-7 h-7 rounded-lg ${gradientBg} flex items-center justify-center`}>
              <Sparkles className="w-3.5 h-3.5 text-white" strokeWidth={2} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-700">しくみや</p>
              <p className="text-[9px] text-gray-400 tracking-wider">by Lyo Vision</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-5 text-xs text-gray-400">
            <Link href="/member" className="hover:text-purple-500 transition-colors">ログイン</Link>
            <Link href="/privacy" className="hover:text-purple-500 transition-colors">プライバシーポリシー</Link>
            <Link href="/legal" className="hover:text-purple-500 transition-colors">特定商取引法</Link>
            <a href="https://x.com/ando_lyo" target="_blank" rel="noopener noreferrer" className="hover:text-purple-500 transition-colors">X (Twitter)</a>
            <a href="https://note.com/ando_lyo_ai" target="_blank" rel="noopener noreferrer" className="hover:text-purple-500 transition-colors">note</a>
            <Link href="/admin" className="hover:text-gray-500 transition-colors text-gray-300">管理</Link>
          </div>
        </div>
        <p className="text-center text-gray-300 text-[10px] mt-6">© {new Date().getFullYear()} Lyo Vision. All rights reserved.</p>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════
   Main Page
   ═══════════════════════════════════════ */
export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <TrustBar />
        <ProblemSection />
        <BeforeAfterSection />
        <StepsSection />
        <SolutionsSection />
        <TemplateSection />
        <WhyUsSection />
        <PricingSection />
        <FAQSection />
        <FinalCTA />
      </main>
      <FooterSection />
    </>
  );
}
