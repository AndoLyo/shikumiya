"use client";

import { useState, useRef, useMemo } from "react";
import NextImage from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Smartphone,
  Layers, LayoutGrid, Shield,
  Image, MessageSquare, Share2, Newspaper, Users,
  Bot, CalendarDays, Briefcase, Globe, Eye, Download,
  Video, Sparkles, Check, X, Play,
  MapPin, Search, Cookie, Navigation, FileText, Moon,
  Star, Bell, BarChart3, Upload, Zap,
  ChevronDown, ChevronRight,
  Megaphone, SlidersHorizontal,
  Building2,
  HelpCircle, ImageIcon, PanelTop, PanelBottom,
} from "lucide-react";

/* ═══════════════════════════════════════
   FEATURE DATA — 40機能
   ═══════════════════════════════════════ */

type Plan = "lite" | "middle" | "premium";
type Category = "section" | "parts" | "function" | "validation";

interface FeatureItem {
  id: string;
  num: number;
  label: string;
  labelEn: string;
  desc: string;
  core: string;
  icon: typeof MapPin;
  plan: Plan;
  category: Category;
  demoType: "visual" | "interactive" | "info";
}

const FEATURES: FeatureItem[] = [
  // === セクション系 (1-16) ===
  { id: "hero-section", num: 1, label: "ヒーローセクション", labelEn: "Hero", desc: "ファーストビューを占有するメインビジュアル+CTA", core: "3秒で「ここは自分に関係ある」と感じてスクロールする", icon: PanelTop, plan: "lite", category: "section", demoType: "visual" },
  { id: "news-section", num: 2, label: "ニュース/お知らせ", labelEn: "News", desc: "タブ切替式のニュースリスト", core: "日付を見て「この会社はちゃんと動いてる」と安心する", icon: Newspaper, plan: "middle", category: "section", demoType: "interactive" },
  { id: "works-gallery", num: 3, label: "施工実績/WORKS", labelEn: "Works", desc: "カードグリッド+フィルター+ライトボックス", core: "「うちと似た案件やってる」と思える事例を見つける", icon: ImageIcon, plan: "lite", category: "section", demoType: "interactive" },
  { id: "service-section", num: 4, label: "事業内容/サービス", labelEn: "Service", desc: "アイコン+テキストのカードグリッド", core: "「何をやってくれる会社なのか」が10秒で伝わる", icon: LayoutGrid, plan: "lite", category: "section", demoType: "visual" },
  { id: "product-lineup", num: 5, label: "商品ラインアップ", labelEn: "Products", desc: "横スクロールスライダーで商品/サービスを一覧", core: "「こういう選択肢があるんだ」と全体像が掴める", icon: Layers, plan: "middle", category: "section", demoType: "interactive" },
  { id: "technology-section", num: 6, label: "テクノロジー/こだわり", labelEn: "Technology", desc: "技術力や独自の強みを数字で訴求", core: "「ここは他と何が違うのか」が具体的な数字で伝わる", icon: Zap, plan: "middle", category: "section", demoType: "visual" },
  { id: "pickup-section", num: 7, label: "ピックアップ/特集", labelEn: "Pickup", desc: "キャンペーン・イベント・季節特集のカルーセル", core: "「今やってるキャンペーン」に気づいて興味を持つ", icon: Megaphone, plan: "middle", category: "section", demoType: "visual" },
  { id: "testimonials", num: 8, label: "お客様の声", labelEn: "Testimonials", desc: "写真+コメント+評価のカルーセル/グリッド", core: "「この会社に頼んで大丈夫」と確信する", icon: Users, plan: "middle", category: "section", demoType: "interactive" },
  { id: "location-search", num: 9, label: "店舗・拠点検索", labelEn: "Locations", desc: "地域別検索+マップ連動", core: "「一番近い店舗」がすぐ見つかる", icon: MapPin, plan: "premium", category: "section", demoType: "interactive" },
  { id: "company-info", num: 10, label: "会社情報", labelEn: "Company", desc: "代表メッセージ+概要テーブル+沿革", core: "「ちゃんとした会社だ」と信用する", icon: Building2, plan: "lite", category: "section", demoType: "visual" },
  { id: "cta-section", num: 11, label: "CTAバー", labelEn: "CTA", desc: "固定/追従型のアクションボタン", core: "「聞いてみよう」と思った瞬間にボタンが目の前にある", icon: Megaphone, plan: "lite", category: "section", demoType: "visual" },
  { id: "video-section", num: 12, label: "動画セクション", labelEn: "Video", desc: "YouTube/Vimeo埋め込み+カスタム再生ボタン", core: "「文字じゃ伝わらない雰囲気」を感じ取る", icon: Video, plan: "premium", category: "section", demoType: "visual" },
  { id: "recruit-page", num: 13, label: "採用ページ", labelEn: "Recruit", desc: "求人情報+応募フォーム付きサブページ", core: "「ここで働きたい」と思って応募する", icon: Briefcase, plan: "premium", category: "section", demoType: "info" },
  { id: "blog-section", num: 14, label: "ブログ/コラム", labelEn: "Blog", desc: "記事一覧+カテゴリ+ページネーション", core: "「この会社は専門知識がある」と感じる", icon: FileText, plan: "middle", category: "section", demoType: "interactive" },
  { id: "faq-section", num: 15, label: "FAQ", labelEn: "FAQ", desc: "アコーディオン式Q&A+構造化データ", core: "「いくら？」の不安が具体的な数字で消える", icon: HelpCircle, plan: "lite", category: "section", demoType: "interactive" },
  { id: "before-after", num: 16, label: "ビフォーアフター", labelEn: "Before/After", desc: "ドラッグ式の画像比較スライダー", core: "「こんなに変わるんだ」と効果を実感する", icon: SlidersHorizontal, plan: "middle", category: "section", demoType: "interactive" },
  // === 共通パーツ系 (17-24) ===
  { id: "header-nav", num: 17, label: "ヘッダー+ナビ", labelEn: "Header", desc: "固定ヘッダー+グローバルナビ+ハンバーガー", core: "「どのページに何があるか」が迷わずわかる", icon: Navigation, plan: "lite", category: "parts", demoType: "visual" },
  { id: "footer", num: 18, label: "フッター", labelEn: "Footer", desc: "サイトマップ+SNS+法的リンク", core: "住所と電話番号を見て「実在する会社だ」と安心する", icon: PanelBottom, plan: "lite", category: "parts", demoType: "visual" },
  { id: "contact-form", num: 19, label: "お問い合わせフォーム", labelEn: "Contact", desc: "バリデーション付きフォーム+完了画面", core: "「ちょっと聞くだけ」のつもりで送信ボタンを押せる", icon: MessageSquare, plan: "lite", category: "parts", demoType: "interactive" },
  { id: "breadcrumbs", num: 20, label: "パンくずリスト", labelEn: "Breadcrumbs", desc: "Schema.org対応の階層ナビ", core: "「今どこにいるか」がわかる", icon: ChevronRight, plan: "middle", category: "parts", demoType: "visual" },
  { id: "google-maps", num: 21, label: "Google Maps", labelEn: "Map", desc: "iframe埋め込み+カスタムピン+遅延読み込み", core: "「うちから何分くらいか」がすぐ判断できる", icon: MapPin, plan: "middle", category: "parts", demoType: "visual" },
  { id: "sns-integration", num: 22, label: "SNSリンク+埋め込み", labelEn: "SNS", desc: "IG/X/YouTube/LINE アイコン+フィード+シェア", core: "「SNSでも発信してるんだ」と活動感を感じる", icon: Share2, plan: "lite", category: "parts", demoType: "visual" },
  { id: "cookie-consent", num: 23, label: "Cookie同意バナー", labelEn: "Cookie", desc: "GDPR対応の承諾/拒否/設定バナー", core: "邪魔にならずに消えて、サイト閲覧を妨げない", icon: Cookie, plan: "middle", category: "parts", demoType: "interactive" },
  { id: "site-search", num: 24, label: "サイト内検索", labelEn: "Search", desc: "オートコンプリート+結果ハイライト", core: "「あのページどこだっけ」が3秒で見つかる", icon: Search, plan: "premium", category: "parts", demoType: "interactive" },
  // === 機能系 (25-36) ===
  { id: "ai-chatbot", num: 25, label: "AIチャットボット", labelEn: "AI Chat", desc: "FAQ自動応答+タイピング表示+クイックリプライ", core: "夜中でも自分の質問の答えが得られる", icon: Bot, plan: "premium", category: "function", demoType: "interactive" },
  { id: "booking-system", num: 26, label: "予約システム", labelEn: "Booking", desc: "カレンダー+時間枠+残枠+確認ステップ", core: "30秒で予約が完了し、電話しなくて済む", icon: CalendarDays, plan: "premium", category: "function", demoType: "interactive" },
  { id: "multilingual", num: 27, label: "多言語切替", labelEn: "i18n", desc: "JA/EN/ZH、LangContext+翻訳キー管理", core: "外国人が母国語で情報を理解できる", icon: Globe, plan: "premium", category: "function", demoType: "interactive" },
  { id: "panorama-viewer", num: 28, label: "360°パノラマ", labelEn: "Panorama", desc: "ドラッグ回転+ズーム+フルスクリーン", core: "「行かなくても中が見える」感覚を得る", icon: Eye, plan: "premium", category: "function", demoType: "visual" },
  { id: "pdf-download", num: 29, label: "PDF資料DL", labelEn: "PDF", desc: "Blob生成/プリセットPDF+プレビュー", core: "手元に資料を持ち帰って比較検討できる", icon: Download, plan: "premium", category: "function", demoType: "interactive" },
  { id: "image-gallery", num: 30, label: "画像ギャラリー", labelEn: "Gallery", desc: "グリッド/Masonry+ライトボックス+遅延読み込み", core: "写真を大きく見て「この雰囲気が好き」と感じる", icon: Image, plan: "lite", category: "function", demoType: "interactive" },
  { id: "file-upload", num: 31, label: "ファイルアップロード", labelEn: "Upload", desc: "ドラッグ&ドロップ+バリデーション+プログレス", core: "スマホから書類を送れる", icon: Upload, plan: "premium", category: "function", demoType: "interactive" },
  { id: "review-rating", num: 32, label: "レビュー/評価", labelEn: "Reviews", desc: "星評価+コメントカード+ソート", core: "「みんなの評価が高い」と安心する", icon: Star, plan: "middle", category: "function", demoType: "visual" },
  { id: "notification", num: 33, label: "通知システム", labelEn: "Notify", desc: "メール/LINE/Slack連携", core: "「ちゃんと届いた」と確認できる", icon: Bell, plan: "middle", category: "function", demoType: "info" },
  { id: "analytics-dashboard", num: 34, label: "アクセス解析", labelEn: "Analytics", desc: "PV/UU/人気ページ/流入元+チャート", core: "どのページが見られてるかわかる", icon: BarChart3, plan: "premium", category: "function", demoType: "visual" },
  { id: "dark-mode", num: 35, label: "ダークモード", labelEn: "Dark Mode", desc: "システム検出+localStorage+トグルUI", core: "夜に見ても眩しくない", icon: Moon, plan: "middle", category: "function", demoType: "interactive" },
  { id: "animation", num: 36, label: "スクロールアニメーション", labelEn: "Animation", desc: "フェードイン+スタガー+パララックス", core: "スクロールが気持ちよくて「ちゃんと作ってある」と感じる", icon: Sparkles, plan: "lite", category: "function", demoType: "visual" },
  // === 横断系 (37-40) ===
  { id: "seo-check", num: 37, label: "SEO対策", labelEn: "SEO", desc: "メタタグ/構造化データ/OGP/sitemap", core: "検索したときにこのサイトが見つかる", icon: Search, plan: "lite", category: "validation", demoType: "info" },
  { id: "responsive-check", num: 38, label: "レスポンシブ対応", labelEn: "Responsive", desc: "PC/タブレット/スマホ全対応", core: "スマホでもPCでも同じように使える", icon: Smartphone, plan: "lite", category: "validation", demoType: "info" },
  { id: "accessibility-check", num: 39, label: "アクセシビリティ", labelEn: "A11y", desc: "WCAG 2.1 AA準拠", core: "目が悪くても手が不自由でも使える", icon: Shield, plan: "lite", category: "validation", demoType: "info" },
  { id: "performance-check", num: 40, label: "パフォーマンス", labelEn: "Performance", desc: "Core Web Vitals最適化", core: "待たされずに表示される", icon: Zap, plan: "lite", category: "validation", demoType: "info" },
];

const PLAN_COLORS: Record<Plan, { bg: string; text: string; border: string; label: string }> = {
  lite: { bg: "bg-[#fdf2f8]", text: "text-[#e84393]", border: "border-[#e84393]/20", label: "おまかせ" },
  middle: { bg: "bg-[#f3f0ff]", text: "text-[#6c5ce7]", border: "border-[#6c5ce7]/20", label: "まるっと" },
  premium: { bg: "bg-[#fff7ed]", text: "text-[#f39c12]", border: "border-[#f39c12]/20", label: "ぜんぶ" },
};

const CATEGORY_INFO: Record<Category, { label: string; labelEn: string; color: string }> = {
  section: { label: "セクション", labelEn: "Sections", color: "text-[#e84393]" },
  parts: { label: "共通パーツ", labelEn: "Common Parts", color: "text-[#6c5ce7]" },
  function: { label: "機能", labelEn: "Functions", color: "text-[#f39c12]" },
  validation: { label: "品質保証", labelEn: "Quality", color: "text-emerald-500" },
};

/* ═══════════════════════════════════════
   PAGE COMPONENT
   ═══════════════════════════════════════ */
export default function FeaturesShowcasePage() {
  const [activeCategory, setActiveCategory] = useState<Category | "all">("all");
  const [activePlan, setActivePlan] = useState<Plan | "all">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const prefersReducedMotion = useReducedMotion();

  const filtered = useMemo(() => {
    return FEATURES.filter((f) => {
      if (activeCategory !== "all" && f.category !== activeCategory) return false;
      if (activePlan !== "all" && f.plan !== activePlan) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          f.label.toLowerCase().includes(q) ||
          f.labelEn.toLowerCase().includes(q) ||
          f.desc.toLowerCase().includes(q) ||
          f.core.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [activeCategory, activePlan, searchQuery]);

  const stats = useMemo(() => ({
    total: FEATURES.length,
    lite: FEATURES.filter((f) => f.plan === "lite").length,
    middle: FEATURES.filter((f) => f.plan === "middle").length,
    premium: FEATURES.filter((f) => f.plan === "premium").length,
  }), []);

  return (
    <div className="min-h-screen bg-white">
      {/* ── Hero ── */}
      <section className="relative bg-gradient-to-br from-[#fdf2f8] via-[#f3f0ff] to-[#fff7ed] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(232,67,147,0.08),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(108,92,231,0.06),transparent_50%)]" />
        <div className="relative max-w-[1100px] mx-auto px-5 py-20 sm:py-28">
          <p className="text-[#e84393] text-xs tracking-[0.3em] mb-3 font-medium">
            FEATURES
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4 text-gray-800">
            あなたのサイトに
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e84393] via-[#6c5ce7] to-[#f39c12]">
              必要な機能、全部ある。
            </span>
          </h1>
          <p className="text-gray-500 text-sm sm:text-base max-w-[600px] leading-relaxed mb-8">
            40種類の機能から、あなたのビジネスに最適な組み合わせを選べます。
            全プラン共通の基本機能から、AIチャットボットや予約システムなどの高機能まで。
          </p>

          {/* Stats */}
          <div className="flex flex-wrap gap-6">
            {[
              { num: stats.total, label: "機能", suffix: "種類", color: "text-gray-800" },
              { num: stats.lite, label: "おまかせ", suffix: "機能", color: "text-[#e84393]" },
              { num: stats.middle, label: "ミドル+", suffix: "機能", color: "text-[#6c5ce7]" },
              { num: stats.premium, label: "ぜんぶ", suffix: "機能", color: "text-[#f39c12]" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className={`text-2xl sm:text-3xl font-bold ${s.color}`}>{s.num}</p>
                <p className="text-gray-400 text-xs mt-0.5">{s.label} {s.suffix}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Filters ── */}
      <section className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-[1100px] mx-auto px-5 py-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="機能名で検索..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:border-[#6c5ce7]/40 focus:ring-2 focus:ring-[#6c5ce7]/10 transition-all"
              />
            </div>
            {/* Category filter */}
            <div className="flex gap-1.5 overflow-x-auto">
              {[
                { key: "all" as const, label: "すべて" },
                ...Object.entries(CATEGORY_INFO).map(([key, info]) => ({ key: key as Category, label: info.label })),
              ].map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                    activeCategory === cat.key
                      ? "bg-gradient-to-r from-[#e84393] via-[#6c5ce7] to-[#f39c12] text-white shadow-sm"
                      : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            {/* Plan filter */}
            <div className="flex gap-1.5">
              {[
                { key: "all" as const, label: "全プラン", color: "bg-gray-50 text-gray-500" },
                { key: "lite" as const, label: "おまかせ", color: "bg-emerald-50 text-emerald-600" },
                { key: "middle" as const, label: "まるっと", color: "bg-blue-50 text-blue-600" },
                { key: "premium" as const, label: "ぜんぶ", color: "bg-purple-50 text-purple-600" },
              ].map((p) => (
                <button
                  key={p.key}
                  onClick={() => setActivePlan(p.key)}
                  className={`px-3 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                    activePlan === p.key
                      ? p.key === "all" ? "bg-gradient-to-r from-[#e84393] via-[#6c5ce7] to-[#f39c12] text-white" : p.color + " ring-2 ring-offset-1 ring-current"
                      : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Feature Grid ── */}
      <section className="max-w-[1100px] mx-auto px-5 py-10">
        <p className="text-gray-400 text-xs mb-6">{filtered.length}件の機能</p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((feature, i) => {
            const Icon = feature.icon;
            const planStyle = PLAN_COLORS[feature.plan];
            const catInfo = CATEGORY_INFO[feature.category];
            const isExpanded = expandedId === feature.id;

            return (
              <div
                key={feature.id}
                data-feature-id={feature.id}
                className={`group rounded-2xl border transition-colors duration-200 cursor-pointer ${
                  isExpanded
                    ? "border-[#6c5ce7]/20 shadow-md"
                    : "border-gray-100 hover:border-[#e84393]/20"
                }`}
                onClick={() => setExpandedId(isExpanded ? null : feature.id)}
              >
                {/* Card Header */}
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                      <img src={`/icons/${feature.id}.png`} alt="" className="w-11 h-11 object-cover" />
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Title row */}
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-gray-300 text-[10px] font-mono">#{String(feature.num).padStart(2, "0")}</span>
                        <h3 className="text-gray-800 text-sm font-bold truncate">{feature.label}</h3>
                      </div>
                      {/* Tags */}
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-[10px] font-medium ${catInfo.color}`}>{catInfo.label}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${planStyle.bg} ${planStyle.text}`}>
                          {planStyle.label}
                        </span>
                      </div>
                      {/* Description */}
                      <p className="text-gray-400 text-xs leading-relaxed">{feature.desc}</p>
                    </div>

                    {/* Expand indicator */}
                    <ChevronDown
                      className={`w-4 h-4 text-gray-300 flex-shrink-0 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                    />
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="overflow-hidden">
                      <div className="px-5 pb-5 border-t border-gray-50 pt-4">
                        {/* Core value */}
                        <div className="bg-gradient-to-r from-[#fdf2f8] via-[#f3f0ff] to-[#fff7ed] rounded-xl p-4 mb-4">
                          <p className="text-[10px] text-[#e84393] font-medium tracking-wider mb-1">この機能の核</p>
                          <p className="text-gray-700 text-sm font-medium leading-relaxed">
                            {feature.core}
                          </p>
                        </div>

                        {/* Demo area */}
                        <FeatureDemo feature={feature} />
                      </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <Search className="w-8 h-8 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">該当する機能が見つかりません</p>
          </div>
        )}
      </section>

      {/* ── CTA ── */}
      <section className="bg-gradient-to-br from-[#fdf2f8] via-[#f3f0ff] to-[#fff7ed] py-16">
        <div className="max-w-[600px] mx-auto px-5 text-center">
          <h2 className="text-gray-800 text-xl sm:text-2xl font-bold mb-3">
            気になる機能はありましたか？
          </h2>
          <p className="text-gray-400 text-sm mb-8">
            お客様のビジネスに合わせて、最適な機能の組み合わせをご提案します。
            まずはお気軽にご相談ください。
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <a
              href="/start"
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#e84393] via-[#6c5ce7] to-[#f39c12] text-white text-sm font-bold hover:opacity-90 transition-opacity"
            >
              今すぐサイトを作る
            </a>
            <a
              href="/#pricing"
              className="px-8 py-3.5 rounded-xl bg-white border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              料金プランを見る
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ═══════════════════════════════════════
   FEATURE DEMO COMPONENTS
   ═══════════════════════════════════════ */

const FEATURES_WITH_IMAGES = new Set([
  "hero-section", "news-section", "works-gallery", "service-section",
  "product-lineup", "technology-section", "pickup-section", "testimonials",
  "location-search", "company-info", "cta-section", "video-section",
  "recruit-page", "blog-section", "faq-section", "before-after",
  "header-nav", "footer", "contact-form", "google-maps",
  "sns-integration", "ai-chatbot", "booking-system", "panorama-viewer",
  "image-gallery", "analytics-dashboard", "seo-check", "responsive-check",
  "performance-check",
]);

function FeatureImage({ featureId, label }: { featureId: string; label: string }) {
  if (!FEATURES_WITH_IMAGES.has(featureId)) return null;
  return (
    <div className="mb-4 rounded-xl overflow-hidden">
      <img
        src={`/features/${featureId}.jpg`}
        alt={`${label}のイメージ`}
        className="w-full h-40 object-cover"
        loading="lazy"
      />
    </div>
  );
}

function FeatureDemo({ feature }: { feature: FeatureItem }) {
  switch (feature.id) {
    case "faq-section":
      return <FAQDemo />;
    case "news-section":
      return <NewsDemo />;
    case "testimonials":
      return <TestimonialsDemo />;
    case "ai-chatbot":
      return <ChatbotDemo />;
    case "booking-system":
      return <BookingDemo />;
    case "dark-mode":
      return <DarkModeDemo />;
    case "before-after":
      return <BeforeAfterDemo />;
    case "contact-form":
      return <ContactFormDemo />;
    case "cookie-consent":
      return <CookieDemo />;
    case "hero-section":
      return <HeroDemo />;
    case "works-gallery":
      return <WorksGalleryDemo />;
    case "service-section":
      return <ServiceDemo />;
    case "review-rating":
      return <ReviewDemo />;
    case "site-search":
      return <SiteSearchDemo />;
    case "multilingual":
      return <MultilingualDemo />;
    case "image-gallery":
      return <GalleryDemo />;
    case "header-nav":
      return <HeaderDemo />;
    case "cta-section":
      return <CTADemo />;
    case "animation":
      return <AnimationDemo />;
    case "product-lineup":
      return <ProductLineupDemo />;
    case "technology-section":
      return <TechnologyDemo />;
    case "pickup-section":
      return <PickupDemo />;
    case "location-search":
      return <LocationSearchDemo />;
    case "company-info":
      return <CompanyInfoDemo />;
    case "video-section":
      return <VideoDemo />;
    case "recruit-page":
      return <RecruitDemo />;
    case "blog-section":
      return <BlogDemo />;
    case "breadcrumbs":
      return <BreadcrumbsDemo />;
    case "google-maps":
      return <GoogleMapsDemo />;
    case "sns-integration":
      return <SNSDemo />;
    case "panorama-viewer":
      return <PanoramaDemo />;
    case "pdf-download":
      return <PDFDemo />;
    case "file-upload":
      return <FileUploadDemo />;
    case "notification":
      return <NotificationDemo />;
    case "analytics-dashboard":
      return <AnalyticsDemo />;
    case "footer":
      return <FooterDemo />;
    case "seo-check":
      return <SEOCheckDemo />;
    case "responsive-check":
      return <ResponsiveCheckDemo />;
    case "accessibility-check":
      return <A11yCheckDemo />;
    case "performance-check":
      return <PerformanceCheckDemo />;
    default:
      return <DefaultDemo feature={feature} />;
  }
}

/* ── FAQ Demo ── */
function FAQDemo() {
  const [openId, setOpenId] = useState<number | null>(null);
  const faqs = [
    { id: 1, q: "費用の目安を教えてください", a: "坪単価60〜80万円が目安です。30坪の住宅で1,800〜2,400万円程度。詳しいお見積もりは無料で承ります。" },
    { id: 2, q: "完成までどのくらいかかりますか？", a: "一般的な注文住宅で着工から約4〜6ヶ月。設計期間を含めると初回相談から約8〜10ヶ月が目安です。" },
    { id: 3, q: "アフターサービスはありますか？", a: "お引渡し後、6ヶ月・1年・2年・5年・10年の定期点検を無償で実施。構造躯体は20年保証です。" },
  ];

  return (
    <div className="space-y-2">
      <p className="text-[10px] text-gray-400 mb-2">タップして開閉を試してみてください</p>
      {faqs.map((faq) => (
        <div key={faq.id} className="border border-gray-100 rounded-xl overflow-hidden">
          <button
            className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors"
            onClick={(e) => { e.stopPropagation(); setOpenId(openId === faq.id ? null : faq.id); }}
          >
            <span className="text-gray-700 text-sm font-medium">{faq.q}</span>
            <ChevronDown className={`w-4 h-4 text-gray-300 transition-transform flex-shrink-0 ml-2 ${openId === faq.id ? "rotate-180" : ""}`} />
          </button>
          <AnimatePresence>
            {openId === faq.id && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
                className="overflow-hidden"
              >
                <p className="px-4 pb-3 text-gray-500 text-xs leading-relaxed">{faq.a}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

/* ── News Demo ── */
function NewsDemo() {
  const [tab, setTab] = useState<string>("すべて");
  const tabs = ["すべて", "お知らせ", "竣工", "受賞"];
  const news = [
    { date: "2025.04.08", cat: "受賞", title: "千代田区庁舎改修が建築技術賞を受賞", isNew: true },
    { date: "2025.03.25", cat: "お知らせ", title: "GW期間の営業日のご案内", isNew: false },
    { date: "2025.03.15", cat: "竣工", title: "渋谷メディカルモールが竣工しました", isNew: false },
  ];
  const catColors: Record<string, string> = {
    "お知らせ": "bg-blue-100 text-blue-600",
    "竣工": "bg-emerald-100 text-emerald-600",
    "受賞": "bg-amber-100 text-amber-600",
  };
  const filtered = tab === "すべて" ? news : news.filter((n) => n.cat === tab);

  return (
    <div>
      <p className="text-[10px] text-gray-400 mb-2">タブを切り替えてみてください</p>
      <div className="flex gap-1.5 mb-3">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={(e) => { e.stopPropagation(); setTab(t); }}
            className={`px-3 py-1.5 rounded-full text-[11px] font-medium transition-all ${
              tab === t ? "bg-gray-800 text-white" : "bg-gray-50 text-gray-400 hover:bg-gray-100"
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="space-y-1.5">
        {filtered.map((n, i) => (
          <motion.div
            key={`${n.date}-${n.cat}`}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.05 }}
          >
            <span className="text-gray-300 text-[11px] font-mono w-20 flex-shrink-0">{n.date}</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full flex-shrink-0 ${catColors[n.cat] || "bg-gray-100 text-gray-500"}`}>{n.cat}</span>
            <span className="text-gray-600 text-xs truncate">{n.title}</span>
            {n.isNew && <span className="text-[9px] text-red-500 font-bold flex-shrink-0">NEW</span>}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ── Testimonials Demo ── */
function TestimonialsDemo() {
  const [idx, setIdx] = useState(0);
  const testimonials = [
    { name: "S様ご家族", area: "世田谷区", type: "注文住宅", comment: "断熱性能には大満足。冬でもエアコン1台で家全体が暖かいです。", rating: 5 },
    { name: "T様", area: "横浜市", type: "リフォーム", comment: "耐震補強も同時にお願いでき、想像以上の仕上がりに感動しています。", rating: 5 },
  ];
  const t = testimonials[idx];

  return (
    <div>
      <div className="bg-gray-50 rounded-xl p-4 relative">
        <div className="flex items-start gap-3 mb-3">
          <img src="/features/testimonials.jpg" alt="" className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
          <div>
            <div className="text-amber-400 text-sm">{"★".repeat(t.rating)}</div>
            <p className="text-gray-400 text-xs mt-0.5">{t.name} / {t.area} / {t.type}</p>
          </div>
        </div>
        <p className="text-gray-600 text-sm leading-relaxed">「{t.comment}」</p>
        <div className="flex gap-2 mt-3">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); setIdx(i); }}
              className={`w-2 h-2 rounded-full transition-colors ${i === idx ? "bg-[#6c5ce7]" : "bg-gray-200"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Chatbot Demo ── */
function ChatbotDemo() {
  const [messages, setMessages] = useState<{ role: "bot" | "user"; text: string }[]>([
    { role: "bot", text: "こんにちは！ご質問をどうぞ。" },
  ]);
  const [input, setInput] = useState("");
  const faqs: Record<string, string> = {
    "料金": "坪単価60〜80万円が目安です。30坪で1,800〜2,400万円程度。お見積もりは無料です。",
    "営業時間": "9:00〜18:00（日曜・祝日定休）です。",
    "エリア": "東京都23区・多摩地域、神奈川県北部が主な対応エリアです。",
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user" as const, text: userMsg }]);
    setTimeout(() => {
      const match = Object.entries(faqs).find(([key]) => userMsg.includes(key));
      setMessages((prev) => [
        ...prev,
        { role: "bot" as const, text: match ? match[1] : "詳しくはお問い合わせフォームからご連絡ください。" },
      ]);
    }, 600);
  };

  return (
    <div>
      <p className="text-[10px] text-gray-400 mb-2">「料金」「営業時間」「エリア」と入力してみてください</p>
      <div className="border border-gray-100 rounded-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="bg-gray-800 text-white px-4 py-2.5 text-xs font-medium">AIチャット</div>
        <div className="h-40 overflow-y-auto p-3 space-y-2 bg-gray-50">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <span className={`inline-block px-3 py-1.5 rounded-xl text-xs max-w-[80%] ${
                m.role === "user" ? "bg-[#6c5ce7] text-white" : "bg-white text-gray-600 border border-gray-100"
              }`}>
                {m.text}
              </span>
            </div>
          ))}
        </div>
        <div className="flex border-t border-gray-100">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="メッセージを入力..."
            className="flex-1 px-3 py-2.5 text-xs text-gray-700 placeholder-gray-300 focus:outline-none"
          />
          <button onClick={handleSend} className="px-4 text-[#6c5ce7] text-xs font-medium hover:bg-[#f3f0ff] transition-colors">送信</button>
        </div>
      </div>
    </div>
  );
}

/* ── Booking Demo ── */
function BookingDemo() {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const times = [
    { time: "10:00", slots: 3 },
    { time: "11:00", slots: 1 },
    { time: "14:00", slots: 0 },
    { time: "15:00", slots: 2 },
  ];

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <p className="text-[10px] text-gray-400 mb-2">日付と時間を選んでみてください</p>
      {step === 1 && (
        <div>
          <p className="text-xs text-gray-500 mb-2 font-medium">日付を選択</p>
          <div className="grid grid-cols-7 gap-1 mb-3">
            {Array.from({ length: 14 }, (_, i) => i + 15).map((day) => {
              const isPast = day < 18;
              const isSelected = selectedDate === day;
              return (
                <button
                  key={day}
                  disabled={isPast}
                  onClick={() => setSelectedDate(day)}
                  className={`py-2 rounded-lg text-xs transition-all ${
                    isPast ? "text-gray-200 cursor-not-allowed" :
                    isSelected ? "bg-[#6c5ce7] text-white" :
                    "text-gray-600 hover:bg-[#f3f0ff]"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
          {selectedDate && (
            <>
              <p className="text-xs text-gray-500 mb-2 font-medium">時間帯を選択</p>
              <div className="flex gap-2 mb-3">
                {times.map((t) => (
                  <button
                    key={t.time}
                    disabled={t.slots === 0}
                    onClick={() => setSelectedTime(t.time)}
                    className={`flex-1 py-2.5 rounded-lg text-xs transition-all ${
                      t.slots === 0 ? "bg-gray-50 text-gray-300 cursor-not-allowed" :
                      selectedTime === t.time ? "bg-[#6c5ce7] text-white" :
                      "bg-gray-50 text-gray-600 hover:bg-[#f3f0ff]"
                    }`}
                  >
                    {t.time}
                    <br />
                    <span className="text-[10px]">{t.slots === 0 ? "満席" : `残${t.slots}`}</span>
                  </button>
                ))}
              </div>
              {selectedTime && (
                <button
                  onClick={() => setStep(2)}
                  className="w-full py-2.5 rounded-xl bg-[#6c5ce7] text-white text-xs font-medium hover:bg-[#5b4bd6] transition-colors"
                >
                  4月{selectedDate}日 {selectedTime} で予約する →
                </button>
              )}
            </>
          )}
        </div>
      )}
      {step === 2 && (
        <div className="text-center py-6">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
            <Check className="w-6 h-6 text-green-500" />
          </div>
          <p className="text-gray-700 text-sm font-medium">予約が完了しました</p>
          <p className="text-gray-400 text-xs mt-1">4月{selectedDate}日 {selectedTime}〜</p>
          <button
            onClick={() => { setStep(1); setSelectedDate(null); setSelectedTime(null); }}
            className="text-[#6c5ce7] text-xs mt-3 hover:underline"
          >
            もう一度試す
          </button>
        </div>
      )}
    </div>
  );
}

/* ── Dark Mode Demo ── */
function DarkModeDemo() {
  const [isDark, setIsDark] = useState(false);

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <p className="text-[10px] text-gray-400 mb-2">トグルを切り替えてみてください</p>
      <div className={`rounded-xl p-4 transition-colors duration-300 ${isDark ? "bg-gray-800" : "bg-gray-50"}`}>
        <div className="flex items-center justify-between mb-3">
          <span className={`text-sm font-medium ${isDark ? "text-white" : "text-gray-700"}`}>
            {isDark ? "ダークモード" : "ライトモード"}
          </span>
          <button
            onClick={() => setIsDark(!isDark)}
            className={`w-12 h-6 rounded-full relative transition-colors ${isDark ? "bg-purple-500" : "bg-gray-200"}`}
          >
            <motion.div
              className="w-5 h-5 rounded-full bg-white shadow absolute top-0.5"
              animate={{ left: isDark ? "26px" : "2px" }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </button>
        </div>
        <div className={`rounded-lg p-3 transition-colors ${isDark ? "bg-gray-700" : "bg-white"}`}>
          <div className={`h-3 rounded w-3/4 mb-2 ${isDark ? "bg-gray-600" : "bg-gray-100"}`} />
          <div className={`h-3 rounded w-1/2 ${isDark ? "bg-gray-600" : "bg-gray-100"}`} />
        </div>
      </div>
    </div>
  );
}

/* ── Before/After Demo ── */
function BeforeAfterDemo() {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setPosition((x / rect.width) * 100);
  };

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <p className="text-[10px] text-gray-400 mb-2">スライダーをドラッグしてみてください</p>
      <div
        ref={containerRef}
        className="relative rounded-xl overflow-hidden h-40 cursor-col-resize select-none"
        onMouseMove={(e) => e.buttons === 1 && handleMove(e.clientX)}
        onTouchMove={(e) => handleMove(e.touches[0].clientX)}
      >
        {/* Before */}
        <div className="absolute inset-0">
          <img src="/features/before-after.jpg" alt="Before" className="w-full h-full object-cover brightness-75 grayscale" />
          <span className="absolute top-2 left-2 text-white/80 text-[10px] font-medium bg-black/40 px-2 py-0.5 rounded">BEFORE</span>
        </div>
        {/* After */}
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
          <img src="/features/before-after.jpg" alt="After" className="w-full h-full object-cover" />
          <span className="absolute top-2 left-2 text-white/80 text-[10px] font-medium bg-black/40 px-2 py-0.5 rounded">AFTER</span>
        </div>
        {/* Handle */}
        <div className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg" style={{ left: `${position}%` }}>
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center">
            <SlidersHorizontal className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Contact Form Demo ── */
function ContactFormDemo() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="text-center py-6" onClick={(e) => e.stopPropagation()}>
        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
          <Check className="w-6 h-6 text-green-500" />
        </div>
        <p className="text-gray-700 text-sm font-medium">送信しました</p>
        <p className="text-gray-400 text-xs mt-1">3営業日以内にご連絡いたします。</p>
        <button onClick={() => setSubmitted(false)} className="text-[#6c5ce7] text-xs mt-3 hover:underline">もう一度試す</button>
      </div>
    );
  }

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <p className="text-[10px] text-gray-400 mb-2">送信ボタンを押してみてください（デモ用・実際には送信されません）</p>
      <div className="space-y-2">
        <input type="text" placeholder="お名前" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs text-gray-700 placeholder-gray-300 focus:outline-none focus:border-purple-300" />
        <input type="email" placeholder="メールアドレス" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs text-gray-700 placeholder-gray-300 focus:outline-none focus:border-purple-300" />
        <textarea placeholder="お問い合わせ内容" rows={2} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs text-gray-700 placeholder-gray-300 focus:outline-none focus:border-purple-300 resize-none" />
        <button
          onClick={() => setSubmitted(true)}
          className="w-full py-2.5 rounded-xl bg-[#6c5ce7] text-white text-xs font-medium hover:bg-[#5b4bd6] transition-colors"
        >
          送信する
        </button>
      </div>
    </div>
  );
}

/* ── Cookie Demo ── */
function CookieDemo() {
  const [visible, setVisible] = useState(true);

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <p className="text-[10px] text-gray-400 mb-2">承諾・拒否ボタンを押してみてください</p>
      {visible ? (
        <div className="bg-gray-800 rounded-xl p-4 text-white">
          <p className="text-xs mb-3 leading-relaxed">
            当サイトではCookieを使用しています。サイトの利用を続けることで、Cookieの使用に同意したものとみなします。
          </p>
          <div className="flex gap-2">
            <button onClick={() => setVisible(false)} className="px-4 py-2 bg-white text-gray-800 rounded-lg text-xs font-medium hover:bg-gray-100 transition-colors">承諾する</button>
            <button onClick={() => setVisible(false)} className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg text-xs hover:bg-gray-600 transition-colors">拒否</button>
          </div>
        </div>
      ) : (
        <div className="text-center py-4">
          <p className="text-gray-400 text-xs">バナーが消えました</p>
          <button onClick={() => setVisible(true)} className="text-[#6c5ce7] text-xs mt-2 hover:underline">もう一度表示</button>
        </div>
      )}
    </div>
  );
}

/* ── Hero Demo ── */
function HeroDemo() {
  return (
    <div className="rounded-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
      <div className="relative h-48 rounded-xl overflow-hidden">
        <img src="/features/hero-section.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
        <div className="relative z-10 h-full flex flex-col justify-end p-5">
          <motion.p className="text-white/60 text-[10px] tracking-wider mb-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>YAMADA CONSTRUCTION</motion.p>
          <motion.p className="text-white font-bold text-lg mb-1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>家族の暮らしに寄り添う家づくり</motion.p>
          <motion.p className="text-white/60 text-xs mb-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>創業30年、500棟以上の施工実績</motion.p>
          <motion.div className="flex gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
            <span className="px-3 py-1.5 bg-[#7BA23F] text-white rounded-lg text-[10px] font-medium">無料相談</span>
            <span className="px-3 py-1.5 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-lg text-[10px]">施工実績を見る</span>
          </motion.div>
        </div>
        <motion.div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10" animate={{ y: [0, 4, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <div className="w-px h-4 bg-gradient-to-b from-white/30 to-transparent" />
        </motion.div>
      </div>
    </div>
  );
}

/* ── Works Gallery Demo ── */
function WorksGalleryDemo() {
  const [filter, setFilter] = useState("すべて");
  const cats = ["すべて", "新築", "リフォーム"];
  const works = [
    { title: "世田谷の家", cat: "新築", img: "/features/works-gallery.jpg" },
    { title: "杉並リノベーション", cat: "リフォーム", img: "/features/before-after.jpg" },
    { title: "練馬の二世帯住宅", cat: "新築", img: "/features/panorama-viewer.jpg" },
  ];
  const filtered = filter === "すべて" ? works : works.filter(w => w.cat === filter);

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <div className="flex gap-1.5 mb-3">
        {cats.map(c => (
          <button key={c} onClick={() => setFilter(c)} className={`px-3 py-1 rounded-full text-[11px] transition-all ${filter === c ? "bg-[#7BA23F] text-white" : "bg-gray-50 text-gray-400"}`}>{c}</button>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {filtered.map((w) => (
          <div key={w.title} className="rounded-xl overflow-hidden cursor-pointer group">
            <div className="h-20 overflow-hidden">
              <img src={w.img} alt={w.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
            <div className="p-2 bg-white border border-gray-100 rounded-b-xl">
              <p className="text-gray-700 text-[10px] font-medium truncate">{w.title}</p>
              <p className="text-gray-400 text-[9px]">{w.cat}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Service Demo ── */
function ServiceDemo() {
  const services = [
    { icon: "🏠", title: "自然素材の家", desc: "無垢材と漆喰で" },
    { icon: "🛡️", title: "耐震等級3", desc: "全棟で構造計算" },
    { icon: "🔨", title: "自社大工", desc: "丸投げしない施工" },
    { icon: "👥", title: "永年アフター", desc: "10年定期点検" },
  ];
  return (
    <div onClick={(e) => e.stopPropagation()}>
      <p className="text-[10px] text-gray-400 mb-2">ホバーでアイコンが変化します</p>
      <div className="grid grid-cols-2 gap-2">
        {services.map((s, i) => (
          <motion.div key={s.title} className="group p-3 rounded-xl border border-gray-100 hover:border-[#e84393]/20 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <div className="w-8 h-8 rounded-lg bg-[#fdf2f8] group-hover:bg-[#e84393] flex items-center justify-center mb-2 transition-colors">
              <span className="text-sm group-hover:brightness-200">{s.icon}</span>
            </div>
            <p className="text-gray-700 text-xs font-bold">{s.title}</p>
            <p className="text-gray-400 text-[10px]">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ── Review Demo ── */
function ReviewDemo() {
  const reviews = [
    { stars: 5, name: "S様", text: "大満足の仕上がりです" },
    { stars: 4, name: "T様", text: "対応が丁寧でした" },
    { stars: 5, name: "M様", text: "期待以上の品質" },
  ];
  return (
    <div onClick={(e) => e.stopPropagation()}>
      <div className="flex items-center gap-3 mb-3">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-800">4.8</p>
          <div className="text-amber-400 text-xs">{"★".repeat(5)}</div>
          <p className="text-gray-400 text-[10px]">3件の評価</p>
        </div>
        <div className="flex-1 space-y-1">
          {[5, 4, 3].map(n => (
            <div key={n} className="flex items-center gap-2">
              <span className="text-[10px] text-gray-400 w-3">{n}</span>
              <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full" style={{ width: n === 5 ? "66%" : n === 4 ? "33%" : "0%" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
      {reviews.map((r, i) => (
        <div key={i} className="flex items-start gap-2 py-2 border-t border-gray-50">
          <div className="w-7 h-7 rounded-full bg-[#f3f0ff] flex items-center justify-center text-[10px] text-[#6c5ce7] font-bold flex-shrink-0">{r.name[0]}</div>
          <div>
            <div className="text-amber-400 text-[10px]">{"★".repeat(r.stars)}</div>
            <p className="text-gray-600 text-xs">{r.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Site Search Demo ── */
function SiteSearchDemo() {
  const [query, setQuery] = useState("");
  const suggestions = ["施工実績", "料金プラン", "会社概要", "採用情報", "お問い合わせ", "ブログ"];
  const filtered = query ? suggestions.filter(s => s.includes(query)) : [];

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <p className="text-[10px] text-gray-400 mb-2">「施工」「料金」等を入力してみてください</p>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
        <input
          type="text" value={query} onChange={(e) => setQuery(e.target.value)}
          placeholder="サイト内検索..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:border-[#6c5ce7]/40"
        />
        {filtered.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden z-10">
            {filtered.map(s => (
              <button key={s} onClick={() => setQuery(s)} className="w-full text-left px-4 py-2.5 text-xs text-gray-600 hover:bg-[#f3f0ff] transition-colors">{s}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Multilingual Demo ── */
function MultilingualDemo() {
  const [lang, setLang] = useState<"ja" | "en">("ja");
  const texts = {
    ja: { title: "会社概要", desc: "創業30年の実績と信頼", btn: "お問い合わせ" },
    en: { title: "About Us", desc: "30 years of proven track record", btn: "Contact" },
  };
  const t = texts[lang];

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <p className="text-[10px] text-gray-400 mb-2">言語を切り替えてみてください</p>
      <div className="flex gap-1 mb-3">
        {(["ja", "en"] as const).map(l => (
          <button key={l} onClick={() => setLang(l)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${lang === l ? "bg-[#6c5ce7] text-white" : "bg-gray-50 text-gray-400"}`}>
            {l === "ja" ? "🇯🇵 日本語" : "🇺🇸 English"}
          </button>
        ))}
      </div>
      <div className="bg-gray-50 rounded-xl p-4">
        <p className="text-gray-800 font-bold text-sm mb-1">{t.title}</p>
        <p className="text-gray-500 text-xs mb-3">{t.desc}</p>
        <span className="px-3 py-1.5 bg-[#6c5ce7] text-white rounded-lg text-[10px] font-medium">{t.btn}</span>
      </div>
    </div>
  );
}

/* ── Gallery Demo ── */
function GalleryDemo() {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const images = [
    "/features/works-gallery.jpg",
    "/features/panorama-viewer.jpg",
    "/features/before-after.jpg",
    "/features/hero-section.jpg",
    "/features/company-info.jpg",
    "/features/image-gallery.jpg",
  ];

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <div className="grid grid-cols-3 gap-1.5">
        {images.map((src, i) => (
          <div key={i} onClick={() => setLightbox(i)} className="h-16 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
            <img src={src} alt="" className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/70" onClick={() => setLightbox(null)} />
            <div className="relative w-64 h-64 rounded-2xl overflow-hidden">
              <img src={images[lightbox]} alt="" className="w-full h-full object-cover" />
              <button onClick={() => setLightbox(null)} className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center text-sm">x</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Header Demo ── */
function HeaderDemo() {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <div onClick={(e) => e.stopPropagation()}>
      <p className="text-[10px] text-gray-400 mb-2">ハンバーガーメニューをタップしてみてください</p>
      <div className="rounded-xl border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 bg-white">
          <span className="text-xs font-bold text-gray-800">YAMADA</span>
          <div className="hidden sm:flex gap-4">
            {["施工実績", "強み", "会社案内", "お問い合わせ"].map(n => (
              <span key={n} className="text-[10px] text-gray-500 hover:text-[#e84393] cursor-pointer transition-colors">{n}</span>
            ))}
          </div>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="sm:hidden w-7 h-7 flex flex-col justify-center items-center gap-1">
            <span className={`w-4 h-0.5 bg-gray-600 transition-transform ${mobileOpen ? "rotate-45 translate-y-[3px]" : ""}`} />
            <span className={`w-4 h-0.5 bg-gray-600 transition-opacity ${mobileOpen ? "opacity-0" : ""}`} />
            <span className={`w-4 h-0.5 bg-gray-600 transition-transform ${mobileOpen ? "-rotate-45 -translate-y-[3px]" : ""}`} />
          </button>
        </div>
        <AnimatePresence>
          {mobileOpen && (
            <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden border-t border-gray-50">
              {["施工実績", "私たちの強み", "会社案内", "お問い合わせ"].map(n => (
                <div key={n} className="px-4 py-3 text-xs text-gray-600 hover:bg-[#fdf2f8] transition-colors cursor-pointer border-b border-gray-50 last:border-0">{n}</div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ── CTA Demo ── */
function CTADemo() {
  return (
    <div onClick={(e) => e.stopPropagation()}>
      <p className="text-[10px] text-gray-400 mb-2">モバイルでは画面下部に固定表示されるCTAバー</p>
      <div className="rounded-xl overflow-hidden">
        <div className="bg-gradient-to-r from-[#e84393] via-[#6c5ce7] to-[#f39c12] p-4 flex items-center justify-between">
          <div>
            <p className="text-white font-bold text-sm">お気軽にご相談ください</p>
            <p className="text-white/70 text-[10px]">無料でお見積り・ご相談を承ります</p>
          </div>
          <div className="flex gap-2">
            <span className="px-3 py-2 bg-white text-[#6c5ce7] rounded-lg text-[10px] font-bold cursor-pointer hover:bg-white/90">電話する</span>
            <span className="px-3 py-2 bg-white/20 text-white rounded-lg text-[10px] border border-white/30 cursor-pointer hover:bg-white/30">メールする</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Animation Demo ── */
function AnimationDemo() {
  const [key, setKey] = useState(0);
  return (
    <div onClick={(e) => e.stopPropagation()}>
      <p className="text-[10px] text-gray-400 mb-2">「再生」でアニメーションを確認できます</p>
      <button onClick={() => setKey(k => k + 1)} className="text-[10px] text-[#6c5ce7] mb-3 hover:underline">再生する</button>
      <div className="space-y-2" key={key}>
        {["フェードイン", "スライドアップ", "スケール"].map((label, i) => (
          <motion.div
            key={label}
            className="h-10 rounded-lg bg-gradient-to-r from-[#fdf2f8] to-[#f3f0ff] flex items-center px-4"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, delay: i * 0.15 }}
          >
            <span className="text-xs text-gray-500">{label} (delay: {i * 0.15}s)</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ── Product Lineup Demo ── */
function ProductLineupDemo() {
  const products = [
    { name: "スタンダードプラン", price: "¥2,800万〜", tag: "人気No.1", img: "/features/hero-section.jpg" },
    { name: "ぜんぶおまかせプラン", price: "¥3,800万〜", tag: "充実設備", img: "/features/works-gallery.jpg" },
    { name: "コンパクトプラン", price: "¥1,800万〜", tag: "初めての方", img: "/features/product-lineup.jpg" },
    { name: "二世帯プラン", price: "¥4,200万〜", tag: "大家族向け", img: "/features/panorama-viewer.jpg" },
  ];
  return (
    <div onClick={(e) => e.stopPropagation()}>
      <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory">
        {products.map((p) => (
          <div key={p.name} className="min-w-[160px] snap-start rounded-xl border border-gray-100 overflow-hidden flex-shrink-0 hover:shadow-md transition-shadow">
            <div className="h-20 relative">
              <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
              <span className="absolute top-2 left-2 text-[10px] bg-white/90 px-2 py-0.5 rounded-full font-medium text-gray-600">{p.tag}</span>
            </div>
            <div className="p-3">
              <p className="text-xs font-bold text-gray-700">{p.name}</p>
              <p className="text-[#e84393] text-sm font-bold mt-1">{p.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Technology Demo ── */
function TechnologyDemo() {
  const [visible, setVisible] = useState(false);
  const stats = [
    { value: 500, suffix: "棟+", label: "施工実績" },
    { value: 98, suffix: "%", label: "顧客満足度" },
    { value: 30, suffix: "年", label: "創業" },
  ];
  return (
    <div onClick={(e) => { e.stopPropagation(); setVisible(true); }}>
      <p className="text-[10px] text-gray-400 mb-2">{visible ? "カウントアップアニメーション" : "タップでカウント開始"}</p>
      <div className="grid grid-cols-3 gap-3">
        {stats.map((s, i) => (
          <div key={s.label} className="text-center p-3 rounded-xl bg-gradient-to-br from-[#fdf2f8] to-[#f3f0ff]">
            <motion.p className="text-2xl font-bold text-[#6c5ce7]" initial={{ opacity: 0 }} animate={visible ? { opacity: 1 } : {}} transition={{ delay: i * 0.2 }}>
              {visible ? s.value : 0}{s.suffix}
            </motion.p>
            <p className="text-[10px] text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Pickup Demo ── */
function PickupDemo() {
  const [idx, setIdx] = useState(0);
  const items = [
    { title: "春の完成見学会", badge: "NEW", date: "4/20-21", img: "/features/pickup-section.jpg" },
    { title: "GWモデルハウスフェア", badge: "予約受付中", date: "5/3-6", img: "/features/works-gallery.jpg" },
    { title: "リフォーム相談会", badge: "毎月開催", date: "毎月第2土曜", img: "/features/company-info.jpg" },
  ];
  return (
    <div onClick={(e) => e.stopPropagation()}>
      <div className="rounded-xl overflow-hidden h-28 relative">
        <img src={items[idx].img} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute inset-0 p-4 flex flex-col justify-between z-10">
          <span className="text-[10px] bg-white/90 px-2 py-0.5 rounded-full font-bold w-fit text-gray-700">{items[idx].badge}</span>
          <div>
            <p className="text-sm font-bold text-white">{items[idx].title}</p>
            <p className="text-[10px] text-white/70">{items[idx].date}</p>
          </div>
        </div>
      </div>
      <div className="flex justify-center gap-1.5 mt-2">
        {items.map((_, i) => (
          <button key={i} onClick={() => setIdx(i)} className={`w-2 h-2 rounded-full transition-colors ${i === idx ? "bg-[#e84393]" : "bg-gray-200"}`} />
        ))}
      </div>
    </div>
  );
}

/* ── Location Search Demo ── */
function LocationSearchDemo() {
  const [region, setRegion] = useState("すべて");
  const locations = [
    { name: "世田谷展示場", region: "東京", addr: "世田谷区1-2-3", time: "10:00-18:00" },
    { name: "横浜モデルハウス", region: "神奈川", addr: "横浜市中区4-5-6", time: "10:00-17:00" },
    { name: "大宮ショールーム", region: "埼玉", addr: "さいたま市大宮区7-8", time: "10:00-18:00" },
  ];
  const filtered = region === "すべて" ? locations : locations.filter(l => l.region === region);
  return (
    <div onClick={(e) => e.stopPropagation()}>
      <p className="text-[10px] text-gray-400 mb-2">エリアで絞り込んでみてください</p>
      <div className="flex gap-1.5 mb-3">
        {["すべて", "東京", "神奈川", "埼玉"].map(r => (
          <button key={r} onClick={() => setRegion(r)} className={`px-3 py-1 rounded-full text-[11px] transition-all ${region === r ? "bg-[#e84393] text-white" : "bg-gray-50 text-gray-400"}`}>{r}</button>
        ))}
      </div>
      <div className="space-y-2">
        {filtered.map(l => (
          <div key={l.name} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-[#e84393]/20 transition-colors">
            <MapPin className="w-4 h-4 text-[#e84393] flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-gray-700">{l.name}</p>
              <p className="text-[10px] text-gray-400">{l.addr} / {l.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Company Info Demo ── */
function CompanyInfoDemo() {
  const info = [["社名", "山田工務店"], ["創業", "1996年"], ["代表", "山田 太郎"], ["所在地", "東京都世田谷区○○町1-2-3"], ["許可", "建設業許可 東京都知事（般-5）第00000号"]];
  return (
    <div onClick={(e) => e.stopPropagation()}>
      <p className="text-[10px] text-gray-400 mb-2">会社概要テーブル</p>
      <div className="rounded-xl border border-gray-100 overflow-hidden">
        {info.map(([k, v], i) => (
          <div key={k} className={`flex text-xs ${i % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
            <span className="w-20 px-3 py-2.5 text-gray-400 font-medium flex-shrink-0">{k}</span>
            <span className="px-3 py-2.5 text-gray-700">{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Video Demo ── */
function VideoDemo() {
  const [playing, setPlaying] = useState(false);
  return (
    <div onClick={(e) => e.stopPropagation()}>
      <p className="text-[10px] text-gray-400 mb-2">再生ボタンを押してみてください</p>
      <div className="relative rounded-xl overflow-hidden h-40 flex items-center justify-center cursor-pointer" onClick={() => setPlaying(!playing)}>
        <img src="/features/video-section.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40" />
        {playing ? (
          <div className="text-center"><div className="w-8 h-8 border-2 border-white/40 border-t-white rounded-full animate-spin mx-auto mb-2" /><p className="text-white/60 text-xs">動画を読み込み中...</p></div>
        ) : (
          <motion.div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center" whileHover={{ scale: 1.1 }}>
            <Play className="w-7 h-7 text-white ml-1" />
          </motion.div>
        )}
        <div className="absolute bottom-3 left-3 text-white/50 text-[10px]">会社紹介ムービー — 3:24</div>
      </div>
    </div>
  );
}

/* ── Recruit Demo ── */
function RecruitDemo() {
  const jobs = [{ title: "施工管理", type: "正社員", salary: "月給28〜45万円" }, { title: "設計スタッフ", type: "正社員", salary: "月給25〜40万円" }];
  return (
    <div onClick={(e) => e.stopPropagation()}>
      <p className="text-[10px] text-gray-400 mb-2">募集職種一覧</p>
      <div className="space-y-2">
        {jobs.map(j => (
          <div key={j.title} className="p-3 rounded-xl border border-gray-100 hover:border-[#6c5ce7]/20 transition-colors">
            <div className="flex items-center gap-2 mb-1">
              <Briefcase className="w-3.5 h-3.5 text-[#6c5ce7]" />
              <span className="text-xs font-bold text-gray-700">{j.title}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#f3f0ff] text-[#6c5ce7]">{j.type}</span>
            </div>
            <p className="text-[10px] text-gray-500 ml-6">{j.salary}</p>
          </div>
        ))}
        <button className="w-full py-2 rounded-xl bg-[#6c5ce7] text-white text-xs font-medium hover:bg-[#5b4bd6] transition-colors">応募する</button>
      </div>
    </div>
  );
}

/* ── Blog Demo ── */
function BlogDemo() {
  const posts = [
    { title: "注文住宅の費用相場 2025年版", cat: "コラム", date: "2025.04.05", img: "/features/blog-section.jpg" },
    { title: "完成見学会レポート — 世田谷の家", cat: "現場レポート", date: "2025.03.28", img: "/features/works-gallery.jpg" },
    { title: "ZEH住宅のメリット・デメリット", cat: "コラム", date: "2025.03.15", img: "/features/technology-section.jpg" },
  ];
  return (
    <div onClick={(e) => e.stopPropagation()}>
      <div className="space-y-2">
        {posts.map(p => (
          <div key={p.title} className="flex gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
            <img src={p.img} alt={p.title} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <span className="text-[10px] text-[#e84393] font-medium">{p.cat}</span>
              <p className="text-xs font-bold text-gray-700 truncate">{p.title}</p>
              <p className="text-[10px] text-gray-400">{p.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Breadcrumbs Demo ── */
function BreadcrumbsDemo() {
  return (
    <div onClick={(e) => e.stopPropagation()}>
      <p className="text-[10px] text-gray-400 mb-2">パンくずリストの表示例</p>
      <div className="flex items-center gap-1.5 text-xs bg-gray-50 rounded-xl px-4 py-3">
        <span className="text-[#6c5ce7] hover:underline cursor-pointer">トップ</span>
        <ChevronRight className="w-3 h-3 text-gray-300" />
        <span className="text-[#6c5ce7] hover:underline cursor-pointer">施工実績</span>
        <ChevronRight className="w-3 h-3 text-gray-300" />
        <span className="text-gray-500">世田谷の家</span>
      </div>
    </div>
  );
}

/* ── Google Maps Demo ── */
function GoogleMapsDemo() {
  return (
    <div onClick={(e) => e.stopPropagation()}>
      <p className="text-[10px] text-gray-400 mb-2">Google Maps埋め込みプレビュー</p>
      <div className="rounded-xl overflow-hidden border border-gray-100">
        <div className="h-32 relative">
          <img src="/features/google-maps.jpg" alt="地図" className="w-full h-full object-cover" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
            <MapPin className="w-8 h-8 text-red-500 mx-auto mb-1 drop-shadow-lg" />
          </div>
        </div>
        <div className="p-3 bg-white">
          <p className="text-xs text-gray-700">東京都世田谷区○○町1-2-3</p>
          <p className="text-[10px] text-[#6c5ce7] mt-1 cursor-pointer hover:underline">Google Mapsで開く →</p>
        </div>
      </div>
    </div>
  );
}

/* ── SNS Demo ── */
function SNSDemo() {
  return (
    <div onClick={(e) => e.stopPropagation()}>
      <div className="flex gap-4 justify-center items-center py-2">
        {/* Instagram */}
        <a href="#" className="w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 hover:opacity-80 transition-opacity">
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-white fill-current"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
        </a>
        {/* X (Twitter) */}
        <a href="#" className="w-10 h-10 flex items-center justify-center rounded-xl bg-black hover:opacity-80 transition-opacity">
          <svg viewBox="0 0 24 24" className="w-4 h-4 text-white fill-current"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
        </a>
        {/* YouTube */}
        <a href="#" className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-600 hover:opacity-80 transition-opacity">
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-white fill-current"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
        </a>
        {/* LINE */}
        <a href="#" className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#06C755] hover:opacity-80 transition-opacity">
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-white fill-current"><path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/></svg>
        </a>
      </div>
    </div>
  );
}

/* ── Panorama Demo ── */
function PanoramaDemo() {
  const [rotation, setRotation] = useState(0);
  return (
    <div onClick={(e) => e.stopPropagation()}>
      <div className="h-32 rounded-xl overflow-hidden cursor-grab active:cursor-grabbing relative"
        onMouseMove={(e) => e.buttons === 1 && setRotation(r => r + e.movementX * 0.5)}
      >
        <img src="/features/panorama-viewer.jpg" alt="" className="absolute inset-0 w-[200%] h-full object-cover" style={{ transform: `translateX(${(rotation % 100) - 50}px)` }} />
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 text-white text-[9px] px-2 py-1 rounded-full">← ドラッグで回転 →</div>
      </div>
    </div>
  );
}

/* ── PDF Demo ── */
function PDFDemo() {
  const [downloaded, setDownloaded] = useState(false);
  const docs = [{ name: "会社案内", size: "2.4MB" }, { name: "施工実績集", size: "5.1MB" }];
  return (
    <div onClick={(e) => e.stopPropagation()}>
      <p className="text-[10px] text-gray-400 mb-2">ダウンロードボタンを押してみてください</p>
      <div className="space-y-2">
        {docs.map(d => (
          <div key={d.name} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100">
            <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0"><FileText className="w-5 h-5 text-red-400" /></div>
            <div className="flex-1"><p className="text-xs font-bold text-gray-700">{d.name}</p><p className="text-[10px] text-gray-400">PDF / {d.size}</p></div>
            <button onClick={() => setDownloaded(true)} className="px-3 py-1.5 rounded-lg bg-[#6c5ce7] text-white text-[10px] font-medium hover:bg-[#5b4bd6] transition-colors"><Download className="w-3 h-3 inline mr-1" />DL</button>
          </div>
        ))}
        {downloaded && <p className="text-[10px] text-green-500 text-center">ダウンロードを開始しました（デモ）</p>}
      </div>
    </div>
  );
}

/* ── File Upload Demo ── */
function FileUploadDemo() {
  const [files, setFiles] = useState<string[]>([]);
  const [dragOver, setDragOver] = useState(false);
  return (
    <div onClick={(e) => e.stopPropagation()}>
      <p className="text-[10px] text-gray-400 mb-2">クリックしてみてください（デモ）</p>
      <div className={`h-28 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors ${dragOver ? "border-[#6c5ce7] bg-[#f3f0ff]" : "border-gray-200 hover:border-gray-300"}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); setFiles(["履歴書.pdf"]); }}
        onClick={() => setFiles(["履歴書.pdf"])}
      >
        <Upload className={`w-6 h-6 mb-1 ${dragOver ? "text-[#6c5ce7]" : "text-gray-300"}`} />
        <p className="text-xs text-gray-400">ドラッグ&ドロップまたはクリック</p>
        <p className="text-[10px] text-gray-300">PDF, DOC, JPG（5MB以下）</p>
      </div>
      {files.length > 0 && <div className="mt-2 flex items-center gap-2 p-2 rounded-lg bg-green-50"><Check className="w-3.5 h-3.5 text-green-500" /><span className="text-xs text-green-700">{files[0]}</span></div>}
    </div>
  );
}

/* ── Notification Demo ── */
function NotificationDemo() {
  const [sent, setSent] = useState(false);
  return (
    <div onClick={(e) => e.stopPropagation()}>
      <p className="text-[10px] text-gray-400 mb-2">通知の流れを体験</p>
      {!sent ? (
        <button onClick={() => setSent(true)} className="w-full py-3 rounded-xl bg-gradient-to-r from-[#e84393] via-[#6c5ce7] to-[#f39c12] text-white text-xs font-medium hover:opacity-90 transition-opacity">お問い合わせを送信（デモ）</button>
      ) : (
        <div className="space-y-2">
          {[{ icon: "📧", label: "お客様にメール送信", d: 0 }, { icon: "🔔", label: "管理者にSlack通知", d: 0.3 }, { icon: "💬", label: "LINE通知を送信", d: 0.6 }].map(n => (
            <motion.div key={n.label} className="flex items-center gap-3 p-3 rounded-xl bg-green-50" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: n.d }}>
              <span>{n.icon}</span><span className="text-xs text-green-700">{n.label}</span><Check className="w-3.5 h-3.5 text-green-500 ml-auto" />
            </motion.div>
          ))}
          <button onClick={() => setSent(false)} className="text-[10px] text-[#6c5ce7] hover:underline">リセット</button>
        </div>
      )}
    </div>
  );
}

/* ── Analytics Demo ── */
function AnalyticsDemo() {
  const data = [30, 45, 38, 52, 48, 65, 58];
  const days = ["月", "火", "水", "木", "金", "土", "日"];
  const max = Math.max(...data);
  return (
    <div onClick={(e) => e.stopPropagation()}>
      <p className="text-[10px] text-gray-400 mb-2">アクセス解析（ミニ版）</p>
      <div className="grid grid-cols-3 gap-2 mb-3">
        {[{ label: "PV", value: "1,284" }, { label: "UU", value: "342" }, { label: "CVR", value: "2.8%" }].map(k => (
          <div key={k.label} className="text-center p-2 rounded-lg bg-[#f3f0ff]"><p className="text-sm font-bold text-[#6c5ce7]">{k.value}</p><p className="text-[10px] text-gray-400">{k.label}</p></div>
        ))}
      </div>
      <div className="flex items-end gap-1 h-20 px-2">
        {data.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <motion.div className="w-full bg-gradient-to-t from-[#6c5ce7] to-[#e84393] rounded-t" initial={{ height: 0 }} animate={{ height: `${(d / max) * 100}%` }} transition={{ delay: i * 0.08 }} />
            <span className="text-[9px] text-gray-400">{days[i]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Footer Demo ── */
function FooterDemo() {
  return (
    <div onClick={(e) => e.stopPropagation()}>
      <p className="text-[10px] text-gray-400 mb-2">フッター構造</p>
      <div className="rounded-xl bg-gray-800 p-4 text-white">
        <div className="grid grid-cols-3 gap-3 mb-3 text-[10px]">
          <div><p className="text-gray-400 font-medium mb-1">会社情報</p><p className="text-gray-500">会社概要</p><p className="text-gray-500">沿革</p></div>
          <div><p className="text-gray-400 font-medium mb-1">サービス</p><p className="text-gray-500">施工実績</p><p className="text-gray-500">技術力</p></div>
          <div><p className="text-gray-400 font-medium mb-1">お問い合わせ</p><p className="text-gray-500">TEL: 0120-000-000</p><p className="text-gray-500">9:00-18:00</p></div>
        </div>
        <div className="border-t border-gray-700 pt-2 flex justify-between items-center">
          <span className="text-[9px] text-gray-500">© 2025 山田工務店</span>
          <div className="flex gap-2"><span className="text-[9px] text-gray-500">プライバシー</span><span className="text-[9px] text-gray-500">利用規約</span></div>
        </div>
      </div>
    </div>
  );
}

/* ── SEO Check Demo ── */
function SEOCheckDemo() {
  const checks = [{ label: "title タグ", ok: true }, { label: "meta description", ok: true }, { label: "OGP設定", ok: true }, { label: "JSON-LD構造化データ", ok: false }, { label: "見出し階層", ok: true }, { label: "sitemap.xml", ok: false }];
  return (
    <div onClick={(e) => e.stopPropagation()}>
      <p className="text-[10px] text-gray-400 mb-2">SEOチェック結果</p>
      <div className="space-y-1.5">
        {checks.map(c => (
          <div key={c.label} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50">
            {c.ok ? <Check className="w-3.5 h-3.5 text-green-500" /> : <X className="w-3.5 h-3.5 text-red-400" />}
            <span className={`text-xs ${c.ok ? "text-gray-600" : "text-red-500 font-medium"}`}>{c.label}</span>
          </div>
        ))}
      </div>
      <p className="text-center text-xs mt-2"><span className="text-green-500 font-bold">4</span> / <span className="text-gray-400">6 項目クリア</span></p>
    </div>
  );
}

/* ── Responsive Check Demo ── */
function ResponsiveCheckDemo() {
  const [device, setDevice] = useState<"sp" | "tablet" | "pc">("sp");
  const widths = { sp: "w-[100px]", tablet: "w-[160px]", pc: "w-full" };
  return (
    <div onClick={(e) => e.stopPropagation()}>
      <p className="text-[10px] text-gray-400 mb-2">デバイスを切り替えてみてください</p>
      <div className="flex gap-2 justify-center mb-3">
        {([["sp", "SP"], ["tablet", "Tablet"], ["pc", "PC"]] as const).map(([k, label]) => (
          <button key={k} onClick={() => setDevice(k)} className={`px-3 py-1.5 rounded-lg text-[11px] transition-all ${device === k ? "bg-[#6c5ce7] text-white" : "bg-gray-50 text-gray-400"}`}>{label}</button>
        ))}
      </div>
      <div className="flex justify-center">
        <motion.div className={`${widths[device]} h-24 rounded-xl bg-gradient-to-br from-[#fdf2f8] to-[#f3f0ff] border border-gray-200 flex items-center justify-center`} layout>
          <span className="text-[10px] text-gray-400">{device === "sp" ? "375px" : device === "tablet" ? "768px" : "1280px"}</span>
        </motion.div>
      </div>
    </div>
  );
}

/* ── Accessibility Check Demo ── */
function A11yCheckDemo() {
  const checks = [{ label: "コントラスト比", ok: true, detail: "7.2:1" }, { label: "キーボード操作", ok: true, detail: "全要素対応" }, { label: "alt属性", ok: false, detail: "2箇所欠落" }, { label: "ARIA属性", ok: true, detail: "正常" }, { label: "フォーカス表示", ok: true, detail: "visible" }];
  return (
    <div onClick={(e) => e.stopPropagation()}>
      <p className="text-[10px] text-gray-400 mb-2">アクセシビリティチェック</p>
      <div className="space-y-1.5">
        {checks.map(c => (
          <div key={c.label} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50">
            {c.ok ? <Check className="w-3.5 h-3.5 text-green-500 flex-shrink-0" /> : <X className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />}
            <span className="text-xs text-gray-600 flex-1">{c.label}</span>
            <span className={`text-[10px] ${c.ok ? "text-green-500" : "text-red-400"}`}>{c.detail}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Performance Check Demo ── */
function PerformanceCheckDemo() {
  const metrics = [{ label: "LCP", value: "1.8s", target: "≤2.5s", ok: true, pct: 72 }, { label: "FID", value: "45ms", target: "≤100ms", ok: true, pct: 55 }, { label: "CLS", value: "0.05", target: "≤0.1", ok: true, pct: 50 }];
  return (
    <div onClick={(e) => e.stopPropagation()}>
      <p className="text-[10px] text-gray-400 mb-2">Core Web Vitals</p>
      <div className="space-y-3">
        {metrics.map(m => (
          <div key={m.label}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-gray-700">{m.label}</span>
              <span className="text-xs"><span className="text-green-500 font-bold">{m.value}</span> <span className="text-gray-300">/ {m.target}</span></span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <motion.div className="h-full rounded-full bg-green-400" initial={{ width: 0 }} animate={{ width: `${m.pct}%` }} transition={{ duration: 0.8 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Default Demo ── */
function DefaultDemo({ feature }: { feature: FeatureItem }) {
  return (
    <div className="rounded-xl overflow-hidden">
      <NextImage
        src={`/features/${feature.id}.png`}
        alt={`${feature.label}のプレビュー`}
        width={800}
        height={400}
        className="w-full h-auto rounded-xl border border-gray-100"
        unoptimized
      />
      <p className="text-gray-400 text-xs mt-2 text-center">{feature.desc}</p>
      <div className="mt-4 flex justify-center gap-2">
        <span className={`text-[10px] px-2.5 py-1 rounded-full ${PLAN_COLORS[feature.plan].bg} ${PLAN_COLORS[feature.plan].text}`}>
          {PLAN_COLORS[feature.plan].label}プラン〜
        </span>
        <span className="text-[10px] px-2.5 py-1 rounded-full bg-gray-100 text-gray-500">
          {CATEGORY_INFO[feature.category].label}
        </span>
      </div>
    </div>
  );
}
