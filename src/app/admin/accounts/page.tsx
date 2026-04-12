"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, ChevronRight, Search, Loader2, AlertCircle } from "lucide-react";

const planLabel: Record<string, { label: string; color: string; bg: string }> = {
  lite: { label: "おまかせ", color: "text-gray-600", bg: "bg-gray-100" },
  middle: { label: "まるっと", color: "text-purple-600", bg: "bg-purple-100" },
  premium: { label: "ぜんぶ", color: "text-orange-600", bg: "bg-orange-100" },
};

interface Account {
  orderId: string;
  company: string;
  email: string;
  plan: string;
  template: string;
  siteUrl: string;
  status: string;
  date: string;
}

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/admin?action=accounts")
      .then((res) => res.json())
      .then((d) => { setAccounts(d.accounts || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = accounts.filter((a) =>
    a.company.toLowerCase().includes(search.toLowerCase()) ||
    a.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 text-purple-400 animate-spin" /></div>;
  }

  return (
    <div className="max-w-[1100px] mx-auto">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-gray-800 text-xl font-bold mb-1">顧客アカウント</h2>
        <p className="text-gray-400 text-sm mb-6">全顧客の一覧</p>
      </motion.div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
          <p className="text-gray-800 text-2xl font-bold">{accounts.length}</p>
          <p className="text-gray-400 text-xs">総アカウント</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
          <p className="text-gray-800 text-2xl font-bold">{accounts.filter((a) => a.status === "制作中").length}</p>
          <p className="text-gray-400 text-xs">制作中</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
          <p className="text-gray-800 text-2xl font-bold">{accounts.filter((a) => a.status === "完了").length}</p>
          <p className="text-gray-400 text-xs">公開中</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="会社名・メールで検索..." className="w-full pl-11 pr-4 py-3 rounded-xl bg-white border border-gray-200 text-sm text-gray-700 placeholder:text-gray-300 focus:outline-none focus:border-purple-300 focus:ring-2 focus:ring-purple-100" />
      </div>

      {/* Table */}
      <motion.div className="bg-white rounded-2xl border border-gray-100 overflow-hidden" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">
            {accounts.length === 0 ? "まだ顧客がいません" : "該当する顧客が見つかりません"}
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filtered.map((acc) => {
              const pl = planLabel[acc.plan] || planLabel.lite;
              return (
                <div key={acc.orderId} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
                    <Users className="w-4 h-4 text-purple-400" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-800 text-sm font-medium truncate">{acc.company || acc.orderId}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${pl.bg} ${pl.color}`}>{pl.label}</span>
                    </div>
                    <p className="text-gray-400 text-xs truncate">{acc.email} | {acc.date}</p>
                  </div>
                  <span className={`text-xs ${acc.status === "完了" ? "text-green-500" : "text-blue-500"}`}>{acc.status}</span>
                  <ChevronRight className="w-4 h-4 text-gray-300" />
                </div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
}
