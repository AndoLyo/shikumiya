"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check, X, Eye, Clock, ChevronDown, ExternalLink,
  MessageSquare, Send, Wrench, Bot, AlertCircle,
} from "lucide-react";

const INITIAL_REQUESTS = [
  { id: "req-101", company: "山田工務店", plan: "おまかせ", date: "2025-04-10", category: "画像差替", text: "施工実績「世田谷の家」の写真を添付の3枚に差替してください。", status: "pending", revisions: [] as { text: string; date: string }[] },
  { id: "req-102", company: "鈴木建設", plan: "ぜんぶ", date: "2025-04-10", category: "テキスト変更", text: "採用ページの施工管理（建築）の給与を「年収450万〜700万」から「年収500万〜750万」に変更。", status: "pending", revisions: [] as { text: string; date: string }[] },
  { id: "req-103", company: "高橋設計事務所", plan: "まるっと", date: "2025-04-09", category: "コンテンツ追加", text: "WORKSに「目黒の集合住宅」と「渋谷のカフェ」の2件を追加したい。写真は添付済み。", status: "pending", revisions: [] as { text: string; date: string }[] },
  { id: "req-104", company: "山田工務店", plan: "おまかせ", date: "2025-04-08", category: "テキスト変更", text: "トップページのキャッチコピーを変更。", status: "completed", revisions: [] as { text: string; date: string }[] },
  { id: "req-105", company: "鈴木建設", plan: "ぜんぶ", date: "2025-04-05", category: "機能追加", text: "AIチャットボットのFAQに「BIM対応について」の質問を追加。", status: "completed", revisions: [] as { text: string; date: string }[] },
];

const planColor: Record<string, string> = {
  "おまかせ": "text-gray-600 bg-gray-100",
  "まるっと": "text-purple-600 bg-purple-100",
  "ぜんぶ": "text-orange-600 bg-orange-100",
};

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: "未対応", color: "text-orange-500", bg: "bg-orange-50" },
  revision: { label: "修正中", color: "text-blue-500", bg: "bg-blue-50" },
  completed: { label: "完了", color: "text-green-500", bg: "bg-green-50" },
};

export default function RequestsPage() {
  const [filter, setFilter] = useState("all");
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [revisionText, setRevisionText] = useState<Record<string, string>>({});
  const [showRevisionInput, setShowRevisionInput] = useState<Record<string, boolean>>({});

  const filtered = filter === "all" ? requests : requests.filter((r) => r.status === filter);

  const markComplete = (id: string) => {
    setRequests((prev) => prev.map((r) => r.id === id ? { ...r, status: "completed" } : r));
  };

  const addRevision = (id: string) => {
    const text = revisionText[id]?.trim();
    if (!text) return;

    setRequests((prev) => prev.map((r) =>
      r.id === id
        ? { ...r, status: "revision", revisions: [...r.revisions, { text, date: new Date().toLocaleDateString("ja-JP") }] }
        : r
    ));
    setRevisionText((prev) => ({ ...prev, [id]: "" }));
    setShowRevisionInput((prev) => ({ ...prev, [id]: false }));
    // TODO: Claude APIに修正指示を送信
  };

  return (
    <div className="max-w-[1000px] mx-auto">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-gray-800 text-xl font-bold mb-1">編集依頼キュー</h2>
        <p className="text-gray-400 text-sm mb-6">顧客からの編集依頼を確認・対応します。</p>
      </motion.div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {[
          { id: "all", label: `全て (${requests.length})` },
          { id: "pending", label: `未対応 (${requests.filter((r) => r.status === "pending").length})` },
          { id: "revision", label: `修正中 (${requests.filter((r) => r.status === "revision").length})` },
          { id: "completed", label: `完了 (${requests.filter((r) => r.status === "completed").length})` },
        ].map((f) => (
          <button key={f.id} onClick={() => setFilter(f.id)} className={`px-4 py-1.5 rounded-full text-xs transition-colors ${filter === f.id ? "bg-gray-800 text-white" : "bg-white border border-gray-200 text-gray-500 hover:border-gray-300"}`}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Request list */}
      <div className="space-y-3">
        {filtered.map((req, i) => {
          const sc = statusConfig[req.status] || statusConfig.pending;
          const isExpanded = expanded === req.id;
          const isShowingRevision = showRevisionInput[req.id];

          return (
            <motion.div key={req.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              {/* Header */}
              <button onClick={() => setExpanded(isExpanded ? null : req.id)} className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-gray-50/50 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-gray-800 text-sm font-bold">{req.company}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${planColor[req.plan]}`}>{req.plan}</span>
                    <span className="text-gray-300 text-xs">{req.date}</span>
                  </div>
                  <p className="text-gray-500 text-sm truncate">{req.text}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${sc.bg} ${sc.color} flex-shrink-0`}>{sc.label}</span>
                <ChevronDown className={`w-4 h-4 text-gray-300 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
              </button>

              {/* Expanded content */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    className="border-t border-gray-100 px-5 py-4"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                  >
                    {/* Original request */}
                    <div className="mb-4">
                      <p className="text-gray-400 text-xs mb-1">依頼内容</p>
                      <p className="text-gray-700 text-sm leading-relaxed">{req.text}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="px-2 py-0.5 rounded bg-gray-50 text-gray-500 text-xs">{req.category}</span>
                      </div>
                    </div>

                    {/* Revision history */}
                    {req.revisions.length > 0 && (
                      <div className="mb-4 space-y-2">
                        <p className="text-blue-500 text-xs font-medium flex items-center gap-1">
                          <Wrench className="w-3.5 h-3.5" /> 修正履歴
                        </p>
                        {req.revisions.map((rev, j) => (
                          <div key={j} className="px-4 py-3 rounded-lg bg-blue-50 border border-blue-100">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-blue-400 text-[10px]">{rev.date}</span>
                              <span className="text-blue-500 text-[10px] font-medium">修正指示 #{j + 1}</span>
                            </div>
                            <p className="text-blue-700 text-sm">{rev.text}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Action buttons */}
                    {req.status !== "completed" && (
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          {/* 完了ボタン */}
                          <button
                            onClick={() => markComplete(req.id)}
                            className="px-4 py-2.5 rounded-lg bg-green-500 text-white text-xs font-medium hover:bg-green-600 transition-colors flex items-center gap-1.5"
                          >
                            <Check className="w-3.5 h-3.5" /> 完了にする
                          </button>

                          {/* 修正を加えるボタン */}
                          <button
                            onClick={() => setShowRevisionInput((prev) => ({ ...prev, [req.id]: !prev[req.id] }))}
                            className={`px-4 py-2.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
                              isShowingRevision
                                ? "bg-blue-100 text-blue-600 border border-blue-200"
                                : "bg-blue-500 text-white hover:bg-blue-600"
                            }`}
                          >
                            <Wrench className="w-3.5 h-3.5" /> 修正を加える
                          </button>
                        </div>

                        {/* 修正指示入力欄 */}
                        <AnimatePresence>
                          {isShowingRevision && (
                            <motion.div
                              className="bg-blue-50 border border-blue-100 rounded-xl p-4"
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <Bot className="w-4 h-4 text-blue-500" />
                                <p className="text-blue-600 text-xs font-medium">修正指示を入力 → Claude APIに送信</p>
                              </div>
                              <textarea
                                value={revisionText[req.id] || ""}
                                onChange={(e) => setRevisionText((prev) => ({ ...prev, [req.id]: e.target.value }))}
                                rows={3}
                                className="w-full px-4 py-3 rounded-lg bg-white border border-blue-200 text-gray-800 text-sm placeholder:text-blue-300 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none mb-3"
                                placeholder="例：キャッチコピーのフォントサイズを大きくして、色を#333に変更してください。"
                              />
                              <div className="flex items-center justify-between">
                                <p className="text-blue-400 text-[10px] flex items-center gap-1">
                                  <AlertCircle className="w-3 h-3" />
                                  この指示がClaude APIに追加の修正依頼として送信されます
                                </p>
                                <button
                                  onClick={() => addRevision(req.id)}
                                  disabled={!revisionText[req.id]?.trim()}
                                  className="px-4 py-2 rounded-lg bg-blue-500 text-white text-xs font-medium hover:bg-blue-600 transition-colors flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                  <Send className="w-3.5 h-3.5" /> 送信
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}

                    {req.status === "completed" && (
                      <p className="text-green-500 text-xs flex items-center gap-1"><Check className="w-3.5 h-3.5" /> 対応完了</p>
                    )}
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
