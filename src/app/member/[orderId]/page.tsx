"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Globe, FileEdit, BarChart3, Eye, MousePointer, Clock,
  ArrowRight, Crown, Zap, Sparkles, ExternalLink, CheckCircle2,
  TrendingUp,
} from "lucide-react";

/* ═══════════════════════════════════════
   顧客ダッシュボード
   ═══════════════════════════════════════ */
export default function MemberDashboard() {
  const params = useParams();
  const orderId = params.orderId as string;

  // デモデータ
  const site = {
    companyName: "山田工務店",
    template: "warm-craft",
    domain: "yamada-koumuten.jp",
    status: "公開中",
    createdAt: "2025-04-01",
    lastUpdated: "2025-04-10",
    editsUsed: 0,
    editsMax: 1,
  };

  const recentRequests = [
    { date: "2025-04-10", text: "トップページのキャッチコピーを変更したい", status: "完了" },
    { date: "2025-04-05", text: "施工実績の写真を3枚追加したい", status: "処理中" },
  ];

  const statusColor: Record<string, string> = {
    "完了": "text-green-500 bg-green-50",
    "処理中": "text-blue-500 bg-blue-50",
    "確認待ち": "text-orange-500 bg-orange-50",
  };

  return (
    <div className="max-w-[1000px] mx-auto space-y-6">
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-gray-800 text-xl font-bold mb-1">こんにちは、{site.companyName}さん</h2>
        <p className="text-gray-400 text-sm">サイトの状況と最近の依頼を確認できます。</p>
      </motion.div>

      {/* Site status */}
      <motion.div className="bg-white rounded-2xl border border-gray-100 overflow-hidden" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
              <Globe className="w-6 h-6 text-purple-500" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-gray-800 font-bold text-base">{site.companyName}</h3>
              <p className="text-gray-400 text-xs mt-0.5">{site.domain}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-600 text-xs font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" /> {site.status}
            </div>
            <a href="#" target="_blank" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 text-xs hover:border-purple-200 hover:text-purple-500 transition-all">
              サイトを表示 <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 border-t border-gray-100">
          {[["テンプレート", site.template], ["開設日", site.createdAt], ["最終更新", site.lastUpdated], ["編集回数", `${site.editsUsed}/${site.editsMax}回`]].map(([label, value]) => (
            <div key={label} className="px-6 py-4 border-r border-gray-100 last:border-0">
              <p className="text-gray-400 text-[10px] tracking-wider mb-1">{label}</p>
              <p className="text-gray-700 text-sm font-medium">{value}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Quick actions */}
      <div className="grid sm:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Link href={`/member/${orderId}/edit-request`} className="block p-5 bg-white rounded-2xl border border-gray-100 hover:border-purple-200 hover:shadow-lg hover:shadow-purple-50 transition-all group">
            <FileEdit className="w-8 h-8 text-purple-400 mb-3" strokeWidth={1.5} />
            <h3 className="text-gray-800 font-bold text-sm mb-1">サイト編集を依頼する</h3>
            <p className="text-gray-400 text-xs leading-relaxed mb-3">テキスト変更、写真追加、レイアウト変更など</p>
            <span className="text-purple-500 text-xs font-medium flex items-center gap-1 group-hover:gap-2 transition-all">依頼する <ArrowRight className="w-3 h-3" /></span>
          </Link>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Link href={`/member/${orderId}/features`} className="block p-5 bg-white rounded-2xl border border-gray-100 hover:border-purple-200 hover:shadow-lg hover:shadow-purple-50 transition-all group">
            <Sparkles className="w-8 h-8 text-orange-400 mb-3" strokeWidth={1.5} />
            <h3 className="text-gray-800 font-bold text-sm mb-1">サイト機能を管理する</h3>
            <p className="text-gray-400 text-xs leading-relaxed mb-3">機能のオン/オフ、利用可能な機能の確認</p>
            <span className="text-purple-500 text-xs font-medium flex items-center gap-1 group-hover:gap-2 transition-all">管理する <ArrowRight className="w-3 h-3" /></span>
          </Link>
        </motion.div>
      </div>

      {/* Recent requests */}
      <motion.div className="bg-white rounded-2xl border border-gray-100 overflow-hidden" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-gray-800 font-bold text-sm">最近の依頼</h3>
          <Link href={`/member/${orderId}/history`} className="text-purple-500 text-xs hover:underline">すべて見る →</Link>
        </div>
        <div className="divide-y divide-gray-100">
          {recentRequests.map((req, i) => (
            <div key={i} className="px-6 py-4 flex items-center gap-4">
              <span className="text-gray-400 text-xs font-mono flex-shrink-0">{req.date}</span>
              <p className="text-gray-700 text-sm flex-1 truncate">{req.text}</p>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor[req.status] || "text-gray-500 bg-gray-50"}`}>{req.status}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Upgrade suggestion (D pattern) */}
      <motion.div className="bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 rounded-2xl border border-purple-100/50 p-6" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <div className="flex items-center gap-2 mb-4">
          <Crown className="w-4 h-4 text-purple-400" />
          <h3 className="text-gray-700 font-bold text-sm">プランアップグレードのご案内</h3>
        </div>
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { icon: BarChart3, title: "アクセス解析", desc: "PVや検索キーワードが丸わかり", plan: "まるっと", color: "text-blue-500", bg: "bg-blue-50" },
            { icon: TrendingUp, title: "ブログ/お知らせ", desc: "更新するほど検索に強くなる", plan: "まるっと", color: "text-green-500", bg: "bg-green-50" },
            { icon: Zap, title: "AIチャットボット", desc: "24時間自動でお客様に対応", plan: "ぜんぶ", color: "text-orange-500", bg: "bg-orange-50" },
          ].map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="bg-white/80 rounded-xl p-4 border border-white">
                <div className={`w-9 h-9 rounded-lg ${f.bg} flex items-center justify-center mb-3`}><Icon className={`w-4.5 h-4.5 ${f.color}`} strokeWidth={1.5} /></div>
                <h4 className="text-gray-700 font-medium text-xs mb-1">{f.title}</h4>
                <p className="text-gray-400 text-[10px] leading-relaxed mb-2">{f.desc}</p>
                <span className="text-purple-500 text-[10px] font-medium">{f.plan}プランで利用可能</span>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
