"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  Home,
  Building2,
  Compass,
  Monitor,
  Tablet,
  Smartphone,
  Columns2,
  Columns3,
  Square,
  ExternalLink,
  Star,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";

/* ═══ テンプレート定義（建築9種のみ） ═══ */
interface Template {
  id: string;
  name: string;
  industry: string;
  plan: string;
  planBadge?: string;
  icon: LucideIcon;
  accentColor: string;
  features: string[];
}

const templates: Template[] = [
  // 工務店
  { id: "warm-craft", name: "Warm Craft", industry: "工務店", plan: "おためし", icon: Home, accentColor: "#7BA23F", features: ["施工実績", "会社概要", "問い合わせ"] },
  { id: "warm-craft-mid", name: "Warm Craft Mid", industry: "工務店", plan: "おまかせ", planBadge: "おすすめ", icon: Home, accentColor: "#7BA23F", features: ["Before/After", "お客様の声", "SEO強化"] },
  { id: "warm-craft-pro", name: "Warm Craft Pro", industry: "工務店", plan: "おまかせプロ", icon: Home, accentColor: "#7BA23F", features: ["AIチャット", "予約システム", "採用ページ"] },
  // 建設会社
  { id: "trust-navy", name: "Trust Navy", industry: "建設会社", plan: "おためし", icon: Building2, accentColor: "#1B3A5C", features: ["施工実績", "会社概要", "問い合わせ"] },
  { id: "trust-navy-mid", name: "Trust Navy Mid", industry: "建設会社", plan: "おまかせ", planBadge: "おすすめ", icon: Building2, accentColor: "#1B3A5C", features: ["Before/After", "お客様の声", "SEO強化"] },
  { id: "trust-navy-pro", name: "Trust Navy Pro", industry: "建設会社", plan: "おまかせプロ", icon: Building2, accentColor: "#1B3A5C", features: ["AIチャット", "採用ページ", "多言語"] },
  // 設計事務所
  { id: "clean-arch", name: "Clean Arch", industry: "設計事務所", plan: "おためし", icon: Compass, accentColor: "#2D3436", features: ["施工実績", "会社概要", "問い合わせ"] },
  { id: "clean-arch-mid", name: "Clean Arch Mid", industry: "設計事務所", plan: "おまかせ", planBadge: "おすすめ", icon: Compass, accentColor: "#2D3436", features: ["Before/After", "ブログ", "SEO強化"] },
  { id: "clean-arch-pro", name: "Clean Arch Pro", industry: "設計事務所", plan: "おまかせプロ", icon: Compass, accentColor: "#2D3436", features: ["AIチャット", "多言語", "360°ビューア"] },
];

/* ═══ デバイス設定 ═══ */
type DeviceSize = "mobile" | "tablet" | "desktop";
type ColumnCount = 1 | 2 | 3;

const deviceConfig: Record<DeviceSize, { label: string; sublabel: string; width: string; height: string; icon: LucideIcon }> = {
  mobile: { label: "スマートフォン", sublabel: "375 × 667", width: "375px", height: "667px", icon: Smartphone },
  tablet: { label: "タブレット", sublabel: "768 × 1024", width: "768px", height: "800px", icon: Tablet },
  desktop: { label: "デスクトップ", sublabel: "1280 × 800", width: "100%", height: "800px", icon: Monitor },
};

const columnIcons: Record<ColumnCount, { icon: LucideIcon; label: string }> = {
  1: { icon: Square, label: "1列" },
  2: { icon: Columns2, label: "2列" },
  3: { icon: Columns3, label: "3列" },
};

const gradientText = "bg-gradient-to-r from-[#e84393] via-[#6c5ce7] to-[#f39c12] bg-clip-text text-transparent";
const gradientBg = "bg-gradient-to-r from-[#e84393] via-[#6c5ce7] to-[#f39c12]";

/* ═══ ページ ═══ */
export default function PortfolioTemplatesPage() {
  const [device, setDevice] = useState<DeviceSize>("desktop");
  const [columns, setColumns] = useState<ColumnCount>(3);
  const config = deviceConfig[device];

  const gridCols =
    columns === 1 ? "grid-cols-1" : columns === 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:grid-cols-2 xl:grid-cols-3";

  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen">
      {/* ===== ヘッダー ===== */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className={`w-1 h-8 rounded-full ${gradientBg}`} />
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-bold text-gray-800 tracking-wide">しくみや</span>
              <span className="text-[10px] tracking-[0.2em] text-gray-400 group-hover:text-[#e84393] transition-colors">by Lyo Vision</span>
            </div>
          </Link>
          <Link href="/" className="text-xs text-gray-400 hover:text-[#6c5ce7] transition-colors tracking-wider">
            ← トップに戻る
          </Link>
        </div>
      </header>

      <main className="pt-24 pb-16">
        {/* ===== タイトル ===== */}
        <section className="max-w-[1800px] mx-auto px-4 sm:px-6 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-6">
            <p className={`text-xs tracking-[0.3em] uppercase mb-2 font-medium ${gradientText}`}>建築業テンプレート一覧</p>
            <h1 className="text-2xl sm:text-3xl text-gray-800 font-bold">業種別ホームページテンプレート</h1>
            <p className="text-gray-500 text-sm mt-3 max-w-[540px] mx-auto leading-relaxed">
              3業種 × 3プラン = 全9種。デバイス表示やレイアウトを切り替えて、実際の見え方をチェックしてください。
            </p>
          </motion.div>

          {/* ===== コントロールバー ===== */}
          <motion.div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-gray-200">
              <config.icon className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-[11px] text-gray-500">
                {config.label}<span className="text-gray-400 ml-1.5">{config.sublabel}</span>
              </span>
            </div>

            <div className="flex rounded-lg border border-gray-200 overflow-hidden bg-white">
              {(Object.keys(deviceConfig) as DeviceSize[]).map((key) => {
                const d = deviceConfig[key];
                const Icon = d.icon;
                const active = device === key;
                return (
                  <button key={key} onClick={() => setDevice(key)} className={`flex items-center gap-1.5 px-3 py-2 text-[11px] transition-all cursor-pointer ${active ? "bg-purple-50 text-[#6c5ce7] border-r border-gray-200" : "text-gray-400 hover:text-gray-600 hover:bg-gray-50 border-r border-gray-200"} last:border-r-0`}>
                    <Icon className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{d.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="hidden sm:block w-px h-6 bg-gray-200" />

            <div className="flex rounded-lg border border-gray-200 overflow-hidden bg-white">
              {([1, 2, 3] as ColumnCount[]).map((n) => {
                const c = columnIcons[n];
                const Icon = c.icon;
                const active = columns === n;
                return (
                  <button key={n} onClick={() => setColumns(n)} className={`flex items-center gap-1.5 px-3 py-2 text-[11px] transition-all cursor-pointer ${active ? "bg-purple-50 text-[#6c5ce7] border-r border-gray-200" : "text-gray-400 hover:text-gray-600 hover:bg-gray-50 border-r border-gray-200"} last:border-r-0`}>
                    <Icon className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{c.label}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </section>

        {/* ===== テンプレートグリッド ===== */}
        <section className="max-w-[1800px] mx-auto px-4 sm:px-6">
          <div className={`grid ${gridCols} gap-5`}>
            {templates.map((tpl, i) => {
              const Icon = tpl.icon;
              return (
                <motion.div
                  key={tpl.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                  className="rounded-2xl border border-gray-200 overflow-hidden bg-white hover:border-gray-300 hover:shadow-lg transition-all duration-300"
                >
                  {/* カードヘッダー */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                    <div className="flex items-center gap-2.5">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: tpl.accentColor }} />
                      <Icon className="w-3.5 h-3.5 text-gray-400" strokeWidth={1.5} />
                      <span className="text-gray-800 text-[13px] font-medium">{tpl.industry}</span>
                      <span className={`text-[11px] px-2 py-0.5 rounded-full ${tpl.planBadge ? `${gradientBg} text-white font-bold` : "bg-gray-100 text-gray-500"}`}>
                        {tpl.plan}
                        {tpl.planBadge && <Star className="w-2.5 h-2.5 inline ml-0.5 -mt-0.5" fill="white" />}
                      </span>
                    </div>
                    <Link
                      href={`/portfolio-templates/${tpl.id}`}
                      target="_blank"
                      className="flex items-center gap-1.5 text-[11px] text-[#6c5ce7] px-2.5 py-1 rounded-md border border-[#6c5ce7]/20 hover:bg-[#6c5ce7]/10 hover:border-[#6c5ce7]/40 transition-all duration-200"
                    >
                      <ExternalLink className="w-3 h-3" />
                      全画面で見る
                    </Link>
                  </div>

                  {/* iframeプレビュー */}
                  <div className="bg-gray-100 overflow-hidden" style={{ maxWidth: device === "desktop" ? "none" : config.width, margin: device === "desktop" ? "0" : "0 auto" }}>
                    <iframe src={`/portfolio-templates/${tpl.id}`} style={{ height: config.height }} className="w-full border-0" loading="lazy" title={tpl.name} />
                  </div>

                  {/* カードフッター */}
                  <div className="flex items-center justify-between px-4 py-2.5 border-t border-gray-100">
                    <div className="flex gap-1.5 flex-wrap">
                      {tpl.features.map((f) => (
                        <span key={f} className="text-[10px] text-gray-500 px-2 py-0.5 border border-gray-200 rounded-full bg-gray-50">{f}</span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ===== CTA ===== */}
        <section className="max-w-[700px] mx-auto px-6 text-center mt-20">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h3 className="text-2xl sm:text-3xl text-gray-800 font-bold mb-4">ホームページを作りませんか？</h3>
            <p className="text-gray-500 text-sm mb-8 leading-relaxed">写真を送るだけ。制作費0円、月額0円からホームページが完成します。</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/start" className={`inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full ${gradientBg} text-white font-bold text-sm tracking-wider hover:opacity-90 transition-all shadow-lg shadow-purple-200/40`}>
                今すぐサイトを作る →
              </Link>
              <Link href="/" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full border border-gray-200 text-gray-500 text-sm tracking-wider hover:border-gray-300 hover:text-gray-700 transition-all">
                トップに戻る
              </Link>
            </div>
          </motion.div>
        </section>
      </main>

      <footer className="border-t border-gray-200 py-8 text-center bg-white">
        <p className="text-gray-400 text-xs">&copy; 2026 Lyo Vision. All rights reserved.</p>
      </footer>
    </div>
  );
}
