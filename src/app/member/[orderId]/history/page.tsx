"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check, Clock, Eye, AlertCircle, ChevronDown, X,
  ExternalLink, MessageSquare,
} from "lucide-react";

const MOCK_REQUESTS = [
  {
    id: "req-001",
    date: "2025-04-10",
    category: "テキスト変更",
    text: "トップページのキャッチコピーを「家族の暮らしに寄り添う家づくり」から「自然素材でつくる、世界にひとつの住まい」に変更してください。",
    status: "completed" as const,
    statusLabel: "反映済み",
    demoUrl: null,
    completedAt: "2025-04-10",
    note: "キャッチコピーを変更し、本番サイトに反映しました。",
  },
  {
    id: "req-002",
    date: "2025-04-08",
    category: "画像の差替",
    text: "施工実績の「世田谷の家」の写真を添付の3枚に差し替えてください。外観1枚、LDK1枚、キッチン1枚です。",
    status: "demo_ready" as const,
    statusLabel: "デモ確認待ち",
    demoUrl: "https://shikumiya-yamada-preview-123.vercel.app",
    completedAt: null,
    note: "写真を差し替えたデモサイトをご用意しました。ご確認ください。",
  },
  {
    id: "req-003",
    date: "2025-04-05",
    category: "機能追加",
    text: "会社案内のセクションにGoogle Mapsを埋め込みたいです。住所は「東京都世田谷区〇〇町1-2-3」です。",
    status: "processing" as const,
    statusLabel: "対応中",
    demoUrl: null,
    completedAt: null,
    note: null,
  },
  {
    id: "req-004",
    date: "2025-03-28",
    category: "テキスト変更",
    text: "営業時間を「9:00〜18:00」から「9:00〜19:00」に変更してください。",
    status: "completed" as const,
    statusLabel: "反映済み",
    demoUrl: null,
    completedAt: "2025-03-28",
    note: "営業時間を更新し、本番サイトに反映しました。",
  },
];

const STATUS_CONFIG = {
  completed: { icon: Check, color: "text-green-500", bg: "bg-green-50", border: "border-green-100" },
  demo_ready: { icon: Eye, color: "text-orange-500", bg: "bg-orange-50", border: "border-orange-100" },
  processing: { icon: Clock, color: "text-blue-500", bg: "bg-blue-50", border: "border-blue-100" },
  pending: { icon: AlertCircle, color: "text-gray-400", bg: "bg-gray-50", border: "border-gray-100" },
};

export default function HistoryPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="max-w-[800px] mx-auto">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-gray-800 text-xl font-bold mb-1">依頼履歴</h2>
        <p className="text-gray-400 text-sm mb-6">過去の編集依頼と対応状況を確認できます。</p>
      </motion.div>

      {/* Status summary */}
      <motion.div className="grid grid-cols-3 gap-3 mb-6" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        {[
          { label: "全依頼", count: MOCK_REQUESTS.length, color: "text-gray-700" },
          { label: "対応中", count: MOCK_REQUESTS.filter((r) => r.status === "processing" || r.status === "demo_ready").length, color: "text-blue-500" },
          { label: "完了", count: MOCK_REQUESTS.filter((r) => r.status === "completed").length, color: "text-green-500" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.count}</p>
            <p className="text-gray-400 text-xs mt-0.5">{s.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Request list */}
      <div className="space-y-3">
        {MOCK_REQUESTS.map((req, i) => {
          const config = STATUS_CONFIG[req.status];
          const Icon = config.icon;
          const isExpanded = expandedId === req.id;

          return (
            <motion.div
              key={req.id}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
            >
              {/* Header */}
              <button
                onClick={() => setExpandedId(isExpanded ? null : req.id)}
                className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-gray-50/50 transition-colors"
              >
                <div className={`w-8 h-8 rounded-lg ${config.bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-4 h-4 ${config.color}`} strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-gray-400 text-xs font-mono">{req.date}</span>
                    <span className="px-2 py-0.5 rounded bg-gray-50 text-gray-500 text-[10px]">{req.category}</span>
                  </div>
                  <p className="text-gray-700 text-sm truncate">{req.text}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.color} flex-shrink-0`}>
                  {req.statusLabel}
                </span>
                <ChevronDown className={`w-4 h-4 text-gray-300 flex-shrink-0 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
              </button>

              {/* Detail */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    className="border-t border-gray-100"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                  >
                    <div className="px-5 py-4 space-y-3">
                      {/* Full text */}
                      <div>
                        <p className="text-gray-400 text-xs mb-1">依頼内容</p>
                        <p className="text-gray-700 text-sm leading-relaxed">{req.text}</p>
                      </div>

                      {/* Note */}
                      {req.note && (
                        <div className={`px-4 py-3 rounded-xl ${config.bg} ${config.border} border`}>
                          <div className="flex items-center gap-1.5 mb-1">
                            <MessageSquare className={`w-3.5 h-3.5 ${config.color}`} />
                            <p className={`text-xs font-medium ${config.color}`}>対応メモ</p>
                          </div>
                          <p className="text-gray-600 text-sm">{req.note}</p>
                        </div>
                      )}

                      {/* Demo URL */}
                      {req.demoUrl && (
                        <div className="flex items-center gap-3">
                          <a
                            href={req.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-50 border border-orange-100 text-orange-600 text-sm hover:bg-orange-100 transition-colors"
                          >
                            <Eye className="w-4 h-4" /> デモサイトを確認する <ExternalLink className="w-3 h-3" />
                          </a>
                          <button className="px-4 py-2 rounded-lg bg-green-50 border border-green-100 text-green-600 text-sm hover:bg-green-100 transition-colors">
                            <Check className="w-4 h-4 inline mr-1" /> 承認する
                          </button>
                        </div>
                      )}

                      {/* Completed date */}
                      {req.completedAt && (
                        <p className="text-gray-400 text-xs">完了日: {req.completedAt}</p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
