"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, MessageSquare, Share2, Newspaper, Users, Code2,
  Image, Bot, CalendarDays, Briefcase, Globe, Eye, Download,
  Video, Lock, Crown, Zap, Check, X, Sparkles, FileEdit,
  ArrowRight, CheckCircle2, Circle,
} from "lucide-react";
import { useMember, type Plan } from "@/lib/member-context";

const PLAN_LEVEL: Record<Plan, number> = { otameshi: 1, omakase: 2, "omakase-pro": 3 };

interface Feature {
  id: string;
  label: string;
  desc: string;
  icon: typeof MapPin;
  minPlan: Plan;
  category: "basic" | "omakase" | "omakase-pro";
}

const FEATURES: Feature[] = [
  // Basic
  { id: "contact-form", label: "お問い合わせフォーム", desc: "サイト訪問者からのお問い合わせを受け付けるフォーム", icon: MessageSquare, minPlan: "otameshi", category: "basic" },
  { id: "sns-links", label: "SNSリンク", desc: "X、Instagram、LINE等のリンクをサイトに表示", icon: Share2, minPlan: "otameshi", category: "basic" },
  { id: "gallery", label: "施工実績ギャラリー", desc: "写真をギャラリー形式で表示（最大10枚）", icon: Image, minPlan: "otameshi", category: "basic" },
  // Omakase
  { id: "google-maps", label: "Google Maps埋め込み", desc: "会社の所在地をGoogleマップで表示", icon: MapPin, minPlan: "omakase", category: "omakase" },
  { id: "blog", label: "ブログ/お知らせ", desc: "現場レポートや見学会の告知を掲載", icon: Newspaper, minPlan: "omakase", category: "omakase" },
  { id: "testimonials", label: "お客様の声", desc: "施主様からの感想・レビューを掲載", icon: Users, minPlan: "omakase", category: "omakase" },
  { id: "json-ld", label: "構造化データ (JSON-LD)", desc: "Google検索で会社情報がリッチに表示される", icon: Code2, minPlan: "omakase", category: "omakase" },
  { id: "ogp", label: "OGP設定", desc: "SNSシェア時にサムネイルと説明文が表示される", icon: Share2, minPlan: "omakase", category: "omakase" },
  // Omakase Pro
  { id: "chatbot", label: "AIチャットボット", desc: "よくある質問に24時間自動で回答", icon: Bot, minPlan: "omakase-pro", category: "omakase-pro" },
  { id: "booking", label: "予約システム", desc: "見学会・相談会のオンライン予約", icon: CalendarDays, minPlan: "omakase-pro", category: "omakase-pro" },
  { id: "recruit", label: "採用ページ", desc: "求人情報の掲載、オンライン応募受付", icon: Briefcase, minPlan: "omakase-pro", category: "omakase-pro" },
  { id: "i18n", label: "多言語対応", desc: "日本語/英語の切り替え", icon: Globe, minPlan: "omakase-pro", category: "omakase-pro" },
  { id: "panorama", label: "360°ビューア", desc: "完成物件のパノラマ写真を表示", icon: Eye, minPlan: "omakase-pro", category: "omakase-pro" },
  { id: "pdf", label: "PDF資料ダウンロード", desc: "会社案内等のPDFをサイトから配布", icon: Download, minPlan: "omakase-pro", category: "omakase-pro" },
  { id: "video", label: "動画セクション", desc: "YouTube動画の埋め込み表示", icon: Video, minPlan: "omakase-pro", category: "omakase-pro" },
];

// デモ用：現在オンになっている機能
const ENABLED_FEATURES: Record<Plan, Set<string>> = {
  otameshi: new Set(["contact-form", "sns-links", "gallery"]),
  omakase: new Set(["contact-form", "sns-links", "gallery", "google-maps", "blog", "testimonials", "json-ld", "ogp"]),
  "omakase-pro": new Set(["contact-form", "sns-links", "gallery", "google-maps", "blog", "testimonials", "json-ld", "ogp", "chatbot", "booking", "recruit", "video"]),
};

export default function FeaturesPage() {
  const { plan } = useMember();
  const params = useParams();
  const orderId = params.orderId as string;
  const [upgradeModal, setUpgradeModal] = useState<Feature | null>(null);

  const hasAccess = (minPlan: Plan) => PLAN_LEVEL[plan] >= PLAN_LEVEL[minPlan];
  const enabledSet = ENABLED_FEATURES[plan];

  const categories = [
    { key: "basic", label: "基本機能", planLabel: "全プラン" },
    { key: "omakase", label: "拡張機能", planLabel: "おまかせプラン以上" },
    { key: "omakase-pro", label: "高機能", planLabel: "おまかせプロプラン" },
  ];

  return (
    <div className="max-w-[800px] mx-auto">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-gray-800 text-xl font-bold mb-1">サイト機能一覧</h2>
        <p className="text-gray-400 text-sm mb-6">現在のサイトに搭載されている機能の一覧です。変更は編集依頼からお申し付けください。</p>
      </motion.div>

      {categories.map((cat, ci) => (
        <motion.div key={cat.key} className="mb-8" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: ci * 0.08 }}>
          <div className="flex items-center gap-2 mb-3">
            <h3 className="text-gray-700 font-bold text-sm">{cat.label}</h3>
            <span className="text-gray-400 text-[10px] px-2 py-0.5 rounded-full bg-gray-50">{cat.planLabel}</span>
          </div>

          <div className="space-y-2">
            {FEATURES.filter((f) => f.category === cat.key).map((feature) => {
              const Icon = feature.icon;
              const locked = !hasAccess(feature.minPlan);
              const isOn = !locked && enabledSet.has(feature.id);

              return (
                <div
                  key={feature.id}
                  className={`flex items-center gap-4 px-5 py-4 rounded-xl border transition-all ${
                    locked
                      ? "bg-gray-50/50 border-gray-100 cursor-pointer hover:border-purple-100"
                      : "bg-white border-gray-100"
                  }`}
                  onClick={locked ? () => setUpgradeModal(feature) : undefined}
                >
                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    locked ? "bg-gray-100" : isOn ? "bg-purple-50" : "bg-gray-50"
                  }`}>
                    <Icon className={`w-5 h-5 ${locked ? "text-gray-300" : isOn ? "text-purple-500" : "text-gray-400"}`} strokeWidth={1.5} />
                  </div>

                  {/* Label */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`text-sm font-medium ${locked ? "text-gray-300" : "text-gray-700"}`}>{feature.label}</p>
                      {locked && <Lock className="w-3 h-3 text-gray-300" />}
                    </div>
                    <p className={`text-xs mt-0.5 ${locked ? "text-gray-300" : "text-gray-400"}`}>{feature.desc}</p>
                  </div>

                  {/* Status */}
                  {locked ? (
                    <span className="text-purple-400 text-xs font-medium flex items-center gap-1 flex-shrink-0">
                      <Crown className="w-3 h-3" /> 解放
                    </span>
                  ) : isOn ? (
                    <span className="flex items-center gap-1.5 text-green-500 text-xs font-medium flex-shrink-0">
                      <CheckCircle2 className="w-4 h-4" /> ON
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-gray-300 text-xs flex-shrink-0">
                      <Circle className="w-4 h-4" /> OFF
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>
      ))}

      {/* 機能変更の案内 */}
      <motion.div
        className="bg-purple-50 border border-purple-100 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
          <FileEdit className="w-5 h-5 text-purple-500" strokeWidth={1.5} />
        </div>
        <div className="flex-1">
          <p className="text-gray-700 text-sm font-medium">機能の追加・削除をご希望の場合</p>
          <p className="text-gray-500 text-xs mt-0.5">編集依頼フォームからお申し付けください。担当者が対応いたします。</p>
        </div>
        <a
          href={`/member/${orderId}/edit-request`}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#e84393] via-[#6c5ce7] to-[#f39c12] text-white text-xs font-bold hover:opacity-90 transition-opacity flex items-center gap-1.5 flex-shrink-0"
        >
          <FileEdit className="w-3.5 h-3.5" /> 編集依頼する
        </a>
      </motion.div>

      {/* Upgrade modal */}
      <AnimatePresence>
        {upgradeModal && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setUpgradeModal(null)}
          >
            <motion.div
              className="bg-white rounded-2xl max-w-[420px] w-full overflow-hidden shadow-2xl"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-[#e84393] via-[#6c5ce7] to-[#f39c12] p-6 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="w-5 h-5" />
                  <span className="text-sm font-medium">
                    {upgradeModal.minPlan === "omakase" ? "おまかせプラン" : "おまかせプロプラン"}
                  </span>
                </div>
                <h3 className="text-xl font-bold">{upgradeModal.label}</h3>
              </div>
              <div className="p-6">
                <p className="text-gray-600 text-sm leading-relaxed mb-6">{upgradeModal.desc}</p>
                <div className="flex items-baseline gap-2 mb-6 px-4 py-3 rounded-xl bg-purple-50 border border-purple-100">
                  <span className="text-2xl font-bold text-purple-600">
                    {upgradeModal.minPlan === "omakase" ? "¥1,480" : "¥4,980"}
                  </span>
                  <span className="text-gray-500 text-xs">/月 から利用可能</span>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setUpgradeModal(null)} className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-500 text-sm hover:bg-gray-50 transition-colors">閉じる</button>
                  <a href={`/member/${orderId}/settings`} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#e84393] via-[#6c5ce7] to-[#f39c12] text-white text-sm font-bold text-center hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                    <Zap className="w-4 h-4" /> アップグレード
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
