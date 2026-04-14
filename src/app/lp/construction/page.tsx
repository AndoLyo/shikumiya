"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Check,
  ChevronDown,
  Smartphone,
  Shield,
  RefreshCw,
  Building2,
  Camera,
  Globe,
  Wrench,
  Sparkles,
  ArrowRight,
  Heart,
  Image as ImageIcon,
} from "lucide-react";

/* ─── Shared styles ─── */
const gradientText =
  "bg-gradient-to-r from-[#e84393] via-[#6c5ce7] to-[#f39c12] bg-clip-text text-transparent";
const gradientBg =
  "bg-gradient-to-r from-[#e84393] via-[#6c5ce7] to-[#f39c12]";
const gradientBgSoft =
  "bg-gradient-to-br from-[#fdf2f8] via-[#f3f0ff] to-[#fff7ed]";

/* ─── Header ─── */
function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-purple-100/50">
      <div className="max-w-[1200px] mx-auto px-5 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-xl ${gradientBg} flex items-center justify-center`}>
            <Sparkles className="w-4 h-4 text-white" strokeWidth={2} />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-base font-bold text-gray-800 tracking-wide">しくみや</span>
            <span className="text-[9px] tracking-[0.15em] text-gray-400">by Lyo Vision</span>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/member" className="text-sm text-gray-400 hover:text-purple-600 transition-colors hidden sm:block">
            ログイン
          </Link>
          <a
            href="/start"
            className={`px-5 py-2 rounded-full ${gradientBg} text-white text-sm font-medium hover:opacity-90 transition-opacity`}
          >
            今すぐサイトを作る
          </a>
        </div>
      </div>
    </header>
  );
}

/* ─── Hero ─── */
function HeroSection() {
  return (
    <section className={`relative min-h-[90vh] flex items-center pt-16 ${gradientBgSoft}`}>
      <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-pink-200/30 blur-[80px]" />
      <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-orange-200/20 blur-[80px]" />

      <div className="relative z-10 max-w-[800px] mx-auto px-5 py-20 text-center">
        {/* Badge */}
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-pink-100 shadow-sm mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Building2 className="w-3.5 h-3.5 text-pink-400" />
          <span className="text-gray-500 text-xs tracking-wider">
            工務店・リフォーム会社向け
          </span>
        </motion.div>

        {/* Main copy */}
        <motion.h1
          className="font-bold leading-[1.35] tracking-wide text-gray-800"
          style={{ fontSize: "clamp(1.6rem, 5vw, 2.8rem)" }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          施工実績が映える
          <br />
          ホームページ、
          <br />
          <span className={gradientText}>制作費0円。</span>
        </motion.h1>

        {/* Sub copy */}
        <motion.p
          className="mt-6 text-gray-500 text-base sm:text-lg leading-relaxed max-w-[520px] mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          施工写真を送るだけ。
          <br />
          あとは全部おまかせで、
          <br className="sm:hidden" />
          プロ品質のサイトが完成します。
        </motion.p>

        {/* Trust */}
        <motion.div
          className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 text-gray-400 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.45 }}
        >
          <span>✓ 初期費用0円</span>
          <span>✓ 月額0円から始められる</span>
          <span>✓ 最短翌日公開</span>
        </motion.div>

        {/* CTA */}
        <motion.div
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.55 }}
        >
          <a
            href="/start"
            className={`w-full sm:w-auto px-10 py-4 rounded-full ${gradientBg} text-white font-bold text-base tracking-wider hover:opacity-90 transition-all shadow-lg shadow-purple-200/50 text-center`}
          >
            まずは今すぐサイトを作る
          </a>
          <a
            href="#demo"
            className="w-full sm:w-auto px-10 py-4 rounded-full bg-white border border-purple-100 text-gray-600 text-base tracking-wider hover:border-purple-300 transition-all shadow-sm text-center"
          >
            サンプルサイトを見る
          </a>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Problem ─── */
const problems = [
  {
    icon: Globe,
    text: "ホームページがない。名刺にURLを載せられない。",
    color: "text-pink-500",
    bg: "bg-pink-50",
  },
  {
    icon: Wrench,
    text: "10年前に作ったサイトが古いまま。スマホで見るとボロボロ。",
    color: "text-purple-500",
    bg: "bg-purple-50",
  },
  {
    icon: Camera,
    text: "せっかくの施工実績、スマホの写真フォルダに眠ったまま。",
    color: "text-orange-500",
    bg: "bg-orange-50",
  },
  {
    icon: RefreshCw,
    text: "業者に頼むと何十万。自分で作る時間も知識もない。",
    color: "text-pink-500",
    bg: "bg-pink-50",
  },
];

function ProblemSection() {
  return (
    <section className="relative py-24 bg-white">
      <div className="max-w-[700px] mx-auto px-5">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-gray-800 font-bold text-2xl sm:text-3xl leading-snug">
            こんなお悩み、
            <br className="sm:hidden" />
            ありませんか？
          </h2>
        </motion.div>

        <div className="space-y-4">
          {problems.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={i}
                className="flex items-center gap-4 px-6 py-5 rounded-2xl bg-white border border-purple-50 shadow-sm"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className={`w-10 h-10 rounded-xl ${p.bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-5 h-5 ${p.color}`} strokeWidth={1.5} />
                </div>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                  {p.text}
                </p>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          className="text-center mt-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-purple-500 text-base font-medium">
            ↓ しくみやなら、全部解決します
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── How It Works ─── */
const steps = [
  {
    num: "1",
    title: "施工写真を送る",
    desc: "完成写真を10枚まで。スマホで撮ったものでOKです。",
    color: "from-pink-400 to-pink-500",
  },
  {
    num: "2",
    title: "テンプレートを選ぶ",
    desc: "プロがデザインした10種類から、お好みのデザインを選ぶだけ。",
    color: "from-purple-400 to-purple-500",
  },
  {
    num: "3",
    title: "翌日にはサイト完成",
    desc: "あとはおまかせ。最短翌日にはホームページが公開されます。",
    color: "from-orange-400 to-orange-500",
  },
];

function HowItWorksSection() {
  return (
    <section className={`relative py-24 ${gradientBgSoft}`}>
      <div className="max-w-[700px] mx-auto px-5">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-purple-400 text-sm font-medium tracking-wider mb-3">HOW IT WORKS</p>
          <h2 className="text-gray-800 font-bold text-2xl sm:text-3xl leading-snug">
            ご利用はかんたん3ステップ
          </h2>
        </motion.div>

        <div className="space-y-6">
          {steps.map((s, i) => (
            <motion.div
              key={i}
              className="flex items-start gap-5 bg-white rounded-2xl p-6 shadow-sm border border-purple-50"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
            >
              <div className={`flex-shrink-0 w-11 h-11 rounded-full bg-gradient-to-br ${s.color} flex items-center justify-center shadow-sm`}>
                <span className="text-white font-bold text-sm">{s.num}</span>
              </div>
              <div>
                <h3 className="text-gray-800 font-bold text-base mb-1">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Demo ─── */
const demos = [
  { name: "ウォームクラフト", desc: "温もりのある工務店サイト", template: "warm-craft" },
  { name: "トラストネイビー", desc: "信頼感のある建設会社サイト", template: "trust-navy" },
  { name: "クリーンアーチ", desc: "洗練された設計事務所サイト", template: "clean-arch" },
];

function DemoSection() {
  return (
    <section id="demo" className="relative py-24 bg-white">
      <div className="max-w-[900px] mx-auto px-5">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-purple-400 text-sm font-medium tracking-wider mb-3">DEMO</p>
          <h2 className="text-gray-800 font-bold text-2xl sm:text-3xl leading-snug mb-3">
            こんなサイトが出来上がります
          </h2>
          <p className="text-gray-400 text-sm">
            実際のテンプレートのデモサイトをご覧いただけます
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-3 gap-5">
          {demos.map((d, i) => (
            <motion.a
              key={d.template}
              href={`/portfolio-templates/${d.template}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group block rounded-2xl overflow-hidden border border-purple-50 hover:border-purple-200 hover:shadow-lg hover:shadow-purple-100/50 transition-all duration-300 bg-white"
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="relative w-full h-48 bg-gray-50 overflow-hidden">
                <iframe
                  src={`/portfolio-templates/${d.template}`}
                  title={d.name}
                  className="absolute top-0 left-0 w-[1200px] h-[800px] origin-top-left border-0 pointer-events-none"
                  style={{ transform: "scale(0.25)" }}
                  loading="lazy"
                  tabIndex={-1}
                />
                <div className="absolute inset-0 bg-white/0 group-hover:bg-purple-900/10 transition-all duration-300 flex items-center justify-center">
                  <span className="text-white text-xs tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-purple-500/80 px-4 py-1.5 rounded-full">
                    デモを見る
                  </span>
                </div>
              </div>
              <div className="px-4 py-3">
                <p className="text-gray-800 text-sm font-medium group-hover:text-purple-500 transition-colors">
                  {d.name}
                </p>
                <p className="text-gray-400 text-xs mt-0.5">{d.desc}</p>
              </div>
            </motion.a>
          ))}
        </div>

        <motion.p
          className="text-center mt-8 text-gray-400 text-xs"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          他にも7種類のデザインからお選びいただけます
        </motion.p>
      </div>
    </section>
  );
}

/* ─── Pricing ─── */
const pricingFeatures = [
  { icon: ImageIcon, text: "施工写真を最大10枚掲載" },
  { icon: Smartphone, text: "スマホ対応（レスポンシブ）" },
  { icon: Shield, text: "SSL証明書（HTTPS）標準" },
  { icon: RefreshCw, text: "月1回の内容更新込み" },
];

function PricingSection() {
  return (
    <section id="pricing" className={`relative py-24 ${gradientBgSoft}`}>
      <div className="absolute top-10 right-20 w-64 h-64 rounded-full bg-pink-100/40 blur-[60px]" />
      <div className="absolute bottom-10 left-20 w-64 h-64 rounded-full bg-orange-100/40 blur-[60px]" />

      <div className="relative z-10 max-w-[600px] mx-auto px-5">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-purple-400 text-sm font-medium tracking-wider mb-3">PRICING</p>
          <h2 className="text-gray-800 font-bold text-2xl sm:text-3xl leading-snug">料金</h2>
        </motion.div>

        <motion.div
          className="rounded-3xl bg-white border border-purple-100 shadow-xl shadow-purple-100/30 p-8 sm:p-10 overflow-hidden relative"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 blur-[40px] opacity-60" />

          {/* Free badge */}
          <div className="relative inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-100 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            <span className="text-pink-600 text-xs font-medium">制作費 0円</span>
          </div>

          <p className="text-gray-800 font-bold text-lg mb-1 relative">おためしプラン</p>

          <div className="flex items-baseline gap-1.5 mb-1 relative">
            <span className={`text-4xl sm:text-5xl font-bold ${gradientText}`}>¥0</span>
            <span className="text-gray-400 text-base">/月（税込）</span>
          </div>

          <p className="text-gray-400 text-sm mb-8 relative">
            通常の外注：<span className="line-through">30〜50万円</span> →
            <span className="text-pink-500 font-medium"> 初期費用0円</span>
          </p>

          <div className="w-full h-px bg-gradient-to-r from-transparent via-purple-100 to-transparent mb-8" />

          <ul className="space-y-4 mb-8 relative">
            {pricingFeatures.map((f) => {
              const Icon = f.icon;
              return (
                <li key={f.text} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4.5 h-4.5 text-purple-400" strokeWidth={1.5} />
                  </div>
                  <span className="text-gray-600 text-sm">{f.text}</span>
                </li>
              );
            })}
          </ul>

          <div className="space-y-2.5 mb-8 relative">
            {[
              "会社情報・代表挨拶ページ",
              "SNSリンク設置",
              "サイトはずっと公開（解約後も残る）",
              "いつでも解約OK・違約金なし",
            ].map((text) => (
              <div key={text} className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-green-400 flex-shrink-0" strokeWidth={2.5} />
                <span className="text-gray-500 text-sm">{text}</span>
              </div>
            ))}
          </div>

          <a
            href="/start"
            className={`relative block w-full text-center py-4 rounded-full ${gradientBg} text-white font-bold text-base tracking-wider hover:opacity-90 transition-all shadow-lg shadow-purple-200/40`}
          >
            まずは今すぐサイトを作る
          </a>
        </motion.div>

        <motion.p
          className="text-center mt-6 text-gray-400 text-xs"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          ※ 独自ドメイン（○○.comなど）は全プランで対応。お申し込み時に設定できます
        </motion.p>
      </div>
    </section>
  );
}

/* ─── FAQ ─── */
const faqs = [
  {
    q: "パソコンが苦手ですが大丈夫ですか？",
    a: "大丈夫です。施工写真をスマホで送っていただくだけ。サイトの作成・公開はすべてこちらで行います。",
  },
  {
    q: "本当に制作費は無料ですか？",
    a: "はい。おためしプランなら月額0円で始められます。サーバー費用、SSL証明書もすべて含まれています。",
  },
  {
    q: "どのくらいで完成しますか？",
    a: "写真とお打ち合わせ内容をいただいてから、最短翌日〜3営業日で公開できます。",
  },
  {
    q: "途中で写真や文章を変えたい場合は？",
    a: "月1回まで無料で更新いたします。お気軽にご連絡ください。",
  },
  {
    q: "解約したらサイトは消えますか？",
    a: "いいえ。解約後もサイトはそのまま残ります。更新サポートが停止されるだけです。再開もいつでも可能です。",
  },
  {
    q: "本当に月額0円から使えますか？",
    a: "はい。おためしプランは月額0円です。おまかせプラン（¥1,480/月）にアップグレードすると、ブログやお客様の声などの機能が使えます。",
  },
];

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="relative py-24 bg-white">
      <div className="max-w-[700px] mx-auto px-5">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
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
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-purple-50/30"
                >
                  <span className="text-sm sm:text-base font-medium text-gray-700">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-purple-300 flex-shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                    strokeWidth={1.5}
                  />
                </button>
                <div
                  className="grid transition-all duration-300 ease-in-out"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
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

/* ─── Final CTA ─── */
function FinalCTASection() {
  return (
    <section className={`relative py-20 sm:py-28 ${gradientBgSoft}`}>
      <div className="max-w-[600px] mx-auto px-5 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-gray-800 font-bold text-2xl sm:text-3xl leading-snug mb-4">
            施工実績が映えるホームページ
            <br />
            <span className={gradientText}>今すぐ始めませんか</span>
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-8">
            制作費0円 写真を送るだけで最短翌日に完成します
          </p>
          <a href="/start" className={`inline-flex items-center gap-2 px-10 py-4 rounded-full ${gradientBg} text-white font-bold text-base tracking-wider hover:opacity-90 transition-all shadow-lg shadow-purple-200/50`}>
            <Sparkles className="w-4 h-4" /> 今すぐサイトを作る
          </a>
          <p className="mt-4 text-gray-400 text-xs">制作費0円 いつでも解約OK</p>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Footer ─── */
function Footer() {
  return (
    <footer className="bg-white border-t border-purple-50 py-8 px-5">
      <div className="max-w-[600px] mx-auto text-center">
        <div className="flex items-center justify-center gap-2.5 mb-3">
          <div className={`w-6 h-6 rounded-lg ${gradientBg} flex items-center justify-center`}>
            <Sparkles className="w-3 h-3 text-white" strokeWidth={2} />
          </div>
          <span className="text-sm font-bold text-gray-700">しくみや</span>
        </div>
        <div className="flex items-center justify-center gap-4 text-xs text-gray-400 mb-3">
          <Link href="/privacy" className="hover:text-purple-500 transition-colors">プライバシーポリシー</Link>
          <Link href="/legal" className="hover:text-purple-500 transition-colors">特定商取引法</Link>
        </div>
        <p className="text-gray-300 text-[10px]">
          © {new Date().getFullYear()} Lyo Vision. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

/* ─── Main Page ─── */
export default function ConstructionLPPage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <ProblemSection />
        <HowItWorksSection />
        <DemoSection />
        <PricingSection />
        <FAQSection />
        <FinalCTASection />
      </main>
      <Footer />
    </>
  );
}
