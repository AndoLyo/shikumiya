"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  DollarSign, Users, FileEdit, TrendingUp, ArrowUp,
  Clock, AlertCircle, ChevronRight, Loader2,
} from "lucide-react";

/* ═══════════════════════════════════════
   Lyo管理ダッシュボード — 実データ取得版
   ═══════════════════════════════════════ */

const planColor: Record<string, string> = {
  "おためし": "text-gray-600 bg-gray-100",
  "おまかせ": "text-purple-600 bg-purple-100",
  "おまかせプロ": "text-orange-600 bg-orange-100",
  "otameshi": "text-gray-600 bg-gray-100",
  "omakase": "text-purple-600 bg-purple-100",
  "omakase-pro": "text-orange-600 bg-orange-100",
};

const planLabels: Record<string, string> = {
  otameshi: "おためし",
  omakase: "おまかせ",
  "omakase-pro": "おまかせプロ",
};

interface DashboardData {
  pendingCount: number;
  pendingOrders: { id: string; company: string; plan: string; date: string; template: string }[];
  note?: string;
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin?action=dashboard")
      .then((res) => res.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch((err) => { setError(err.message); setLoading(false); });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-[600px] mx-auto p-6 bg-red-50 rounded-2xl border border-red-100 text-center">
        <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-3" />
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1100px] mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-gray-800 text-xl font-bold mb-1">ダッシュボード</h2>
        <p className="text-gray-400 text-sm">しくみやの運営状況</p>
      </motion.div>

      {/* Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: FileEdit, label: "未対応の依頼", value: `${data?.pendingCount || 0}件`, color: "text-orange-500", bg: "bg-orange-50" },
          { icon: Users, label: "制作中", value: `${data?.pendingOrders?.length || 0}件`, color: "text-blue-500", bg: "bg-blue-50" },
          { icon: DollarSign, label: "MRR", value: "—", color: "text-green-500", bg: "bg-green-50" },
          { icon: TrendingUp, label: "今月の総PV", value: "—", color: "text-purple-500", bg: "bg-purple-50" },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div key={i} className="bg-white rounded-2xl border border-gray-100 p-5" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
                <Icon className={`w-5 h-5 ${s.color}`} strokeWidth={1.5} />
              </div>
              <p className="text-gray-800 text-2xl font-bold">{s.value}</p>
              <p className="text-gray-400 text-xs mt-1">{s.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Pending orders */}
      <motion.div className="bg-white rounded-2xl border border-gray-100 overflow-hidden" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-gray-800 font-bold text-sm">制作中の注文</h3>
            {data && data.pendingOrders.length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-orange-50 text-orange-500 text-xs font-medium">{data.pendingOrders.length}件</span>
            )}
          </div>
          <Link href="/admin/accounts" className="text-purple-500 text-xs hover:underline">すべて見る →</Link>
        </div>
        {data && data.pendingOrders.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {data.pendingOrders.map((order) => (
              <div key={order.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-gray-700 text-sm font-medium">{order.company || order.id}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${planColor[order.plan] || "text-gray-600 bg-gray-100"}`}>
                      {planLabels[order.plan] || order.plan}
                    </span>
                  </div>
                  <p className="text-gray-400 text-xs">{order.template} | {order.date}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300" />
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-400 text-sm">制作中の注文はありません</div>
        )}
      </motion.div>

      {/* Auto-approve score (placeholder) */}
      <motion.div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 text-white" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <div className="flex items-center gap-2 mb-3">
          <AlertCircle className="w-4 h-4 text-yellow-400" />
          <h3 className="font-bold text-sm">自動承認スコア</h3>
          <span className="text-gray-500 text-xs ml-auto">Coming soon</span>
        </div>
        <p className="text-gray-400 text-sm">
          Claude APIによる自動編集の精度スコアを記録し、80点を超えたサイトは自動承認に移行します。
        </p>
      </motion.div>
    </div>
  );
}
