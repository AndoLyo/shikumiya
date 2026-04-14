"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Eye, MousePointer, TrendingUp, Clock, BarChart3, ArrowUp,
  ArrowDown, Home, Users, FileText, Calendar, Bell, Settings,
  LogOut, ChevronRight, Globe, Search, Smartphone, Monitor,
} from "lucide-react";

/* ═══════════════════════════════════════
   管理画面 — アクセス解析ダッシュボード
   ※ おまかせプロプラン限定機能
   ═══════════════════════════════════════ */

const COMPANY = { name: "山田工務店" };

/* ─── Mock data ─── */
const overviewStats = [
  { icon: Eye, label: "今月のPV", value: "2,847", change: "+18%", up: true, color: "text-[#7BA23F]", bg: "bg-[#7BA23F]/10" },
  { icon: MousePointer, label: "お問い合わせ", value: "12件", change: "+3件", up: true, color: "text-blue-500", bg: "bg-blue-50" },
  { icon: TrendingUp, label: "検索流入", value: "1,203", change: "+24%", up: true, color: "text-purple-500", bg: "bg-purple-50" },
  { icon: Clock, label: "平均滞在", value: "2:34", change: "+12%", up: true, color: "text-orange-500", bg: "bg-orange-50" },
];

const pageViews = [
  { page: "トップページ", views: 1240, pct: 43 },
  { page: "施工実績", views: 620, pct: 22 },
  { page: "お問い合わせ", views: 380, pct: 13 },
  { page: "私たちの強み", views: 310, pct: 11 },
  { page: "会社案内", views: 297, pct: 10 },
];

const searchKeywords = [
  { keyword: "世田谷 工務店", count: 180 },
  { keyword: "自然素材 注文住宅 東京", count: 120 },
  { keyword: "リフォーム 世田谷区", count: 95 },
  { keyword: "耐震等級3 工務店", count: 72 },
  { keyword: "無垢材 家づくり", count: 58 },
];

const inquiries = [
  { date: "4/10", name: "佐藤様", type: "新築相談", status: "未対応" },
  { date: "4/9", name: "田中様", type: "リフォーム見積り", status: "対応中" },
  { date: "4/8", name: "鈴木様", type: "見学会予約", status: "完了" },
  { date: "4/7", name: "高橋様", type: "新築相談", status: "完了" },
  { date: "4/5", name: "伊藤様", type: "リフォーム見積り", status: "完了" },
];

const bookingStats = [
  { event: "4/19 世田谷の家 完成見学会", total: 6, booked: 3 },
  { event: "4/20 世田谷の家 完成見学会", total: 8, booked: 3 },
  { event: "5/10 リフォーム相談会", total: 10, booked: 2 },
];

const deviceBreakdown = [
  { device: "スマートフォン", pct: 68, icon: Smartphone },
  { device: "PC", pct: 28, icon: Monitor },
  { device: "タブレット", pct: 4, icon: Monitor },
];

const monthlyPV = [
  { month: "11月", value: 1520 },
  { month: "12月", value: 1780 },
  { month: "1月", value: 1650 },
  { month: "2月", value: 2100 },
  { month: "3月", value: 2480 },
  { month: "4月", value: 2847 },
];

/* ═══════ Sidebar ═══════ */
function Sidebar({ active, setActive }: { active: string; setActive: (s: string) => void }) {
  const navItems = [
    { id: "dashboard", label: "ダッシュボード", icon: BarChart3 },
    { id: "inquiries", label: "お問い合わせ", icon: FileText },
    { id: "bookings", label: "見学会予約", icon: Calendar },
    { id: "notifications", label: "通知設定", icon: Bell },
  ];

  return (
    <aside className="w-64 bg-[#3D3226] min-h-screen flex-shrink-0 hidden lg:flex flex-col">
      <div className="px-5 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#7BA23F] flex items-center justify-center">
            <Home className="w-4.5 h-4.5 text-white" strokeWidth={2} />
          </div>
          <div>
            <p className="text-white font-bold text-sm">{COMPANY.name}</p>
            <p className="text-white/40 text-[9px]">管理画面</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 py-4 space-y-1 px-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${
                active === item.id
                  ? "bg-[#7BA23F] text-white"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className="w-4 h-4" strokeWidth={1.5} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-white/10">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white/40 text-sm hover:text-white/60 transition-colors">
          <Settings className="w-4 h-4" strokeWidth={1.5} />
          設定
        </button>
        <a href="/portfolio-templates/warm-craft-pro" className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white/40 text-sm hover:text-white/60 transition-colors">
          <LogOut className="w-4 h-4" strokeWidth={1.5} />
          サイトに戻る
        </a>
      </div>
    </aside>
  );
}

/* ═══════ Dashboard Content ═══════ */
function DashboardContent() {
  const maxPV = Math.max(...monthlyPV.map((m) => m.value));

  return (
    <div className="space-y-6">
      {/* Overview cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {overviewStats.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={i}
              className="bg-white rounded-xl border border-[#E8DFD3] p-5"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <div className={`w-10 h-10 rounded-lg ${s.bg} flex items-center justify-center mb-3`}>
                <Icon className={`w-5 h-5 ${s.color}`} strokeWidth={1.5} />
              </div>
              <p className="text-[#3D3226] text-2xl font-bold">{s.value}</p>
              <div className="flex items-center justify-between mt-1">
                <p className="text-[#8B7D6B] text-xs">{s.label}</p>
                <p className={`text-xs font-medium flex items-center gap-0.5 ${s.up ? "text-[#7BA23F]" : "text-red-400"}`}>
                  {s.up ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                  {s.change}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* PV Chart */}
        <motion.div
          className="lg:col-span-2 bg-white rounded-xl border border-[#E8DFD3] p-6"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[#3D3226] font-bold text-sm">月間PV推移</h3>
            <span className="text-[#8B7D6B] text-xs">過去6ヶ月</span>
          </div>
          <div className="flex items-end gap-4 h-40">
            {monthlyPV.map((m, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-[#3D3226] text-xs font-medium">{(m.value / 1000).toFixed(1)}k</span>
                <motion.div
                  className="w-full rounded-t-lg bg-gradient-to-t from-[#7BA23F] to-[#7BA23F]/60"
                  initial={{ height: 0 }}
                  animate={{ height: `${(m.value / maxPV) * 100}%` }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 0.6 }}
                />
                <span className="text-[#8B7D6B] text-[10px]">{m.month}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Device breakdown */}
        <motion.div
          className="bg-white rounded-xl border border-[#E8DFD3] p-6"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-[#3D3226] font-bold text-sm mb-6">デバイス別</h3>
          <div className="space-y-4">
            {deviceBreakdown.map((d, i) => {
              const Icon = d.icon;
              return (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-[#8B7D6B]" strokeWidth={1.5} />
                      <span className="text-[#3D3226] text-sm">{d.device}</span>
                    </div>
                    <span className="text-[#7BA23F] text-sm font-bold">{d.pct}%</span>
                  </div>
                  <div className="h-2 bg-[#FAF7F2] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-[#7BA23F] rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${d.pct}%` }}
                      transition={{ delay: 0.6 + i * 0.1, duration: 0.5 }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Popular pages */}
        <motion.div
          className="bg-white rounded-xl border border-[#E8DFD3] p-6"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-[#3D3226] font-bold text-sm mb-4">人気ページ</h3>
          <div className="space-y-3">
            {pageViews.map((p, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="w-6 text-[#8B7D6B] text-xs text-right">{i + 1}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[#3D3226] text-sm">{p.page}</span>
                    <span className="text-[#8B7D6B] text-xs">{p.views.toLocaleString()} PV</span>
                  </div>
                  <div className="h-1.5 bg-[#FAF7F2] rounded-full overflow-hidden">
                    <div className="h-full bg-[#7BA23F]/60 rounded-full" style={{ width: `${p.pct}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Search keywords */}
        <motion.div
          className="bg-white rounded-xl border border-[#E8DFD3] p-6"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-[#3D3226] font-bold text-sm mb-4">検索キーワード</h3>
          <div className="space-y-3">
            {searchKeywords.map((k, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-[#E8DFD3] last:border-0">
                <div className="flex items-center gap-3">
                  <Search className="w-3.5 h-3.5 text-[#8B7D6B]" strokeWidth={1.5} />
                  <span className="text-[#3D3226] text-sm">{k.keyword}</span>
                </div>
                <span className="text-[#7BA23F] text-sm font-medium">{k.count}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ═══════ Inquiries Content ═══════ */
function InquiriesContent() {
  const statusColor: Record<string, string> = {
    "未対応": "bg-red-50 text-red-500",
    "対応中": "bg-yellow-50 text-yellow-600",
    "完了": "bg-green-50 text-green-500",
  };

  return (
    <div className="bg-white rounded-xl border border-[#E8DFD3] overflow-hidden">
      <div className="px-6 py-4 border-b border-[#E8DFD3] flex items-center justify-between">
        <h3 className="text-[#3D3226] font-bold text-sm">お問い合わせ一覧</h3>
        <span className="px-3 py-1 rounded-full bg-red-50 text-red-500 text-xs font-medium">1件 未対応</span>
      </div>
      <div className="divide-y divide-[#E8DFD3]">
        {inquiries.map((inq, i) => (
          <motion.div
            key={i}
            className="px-6 py-4 flex items-center gap-4 hover:bg-[#FAF7F2] transition-colors cursor-pointer"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <span className="text-[#8B7D6B] text-xs font-mono w-12">{inq.date}</span>
            <span className="text-[#3D3226] text-sm font-medium w-20">{inq.name}</span>
            <span className="text-[#8B7D6B] text-sm flex-1">{inq.type}</span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor[inq.status]}`}>{inq.status}</span>
            <ChevronRight className="w-4 h-4 text-[#8B7D6B]" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ═══════ Bookings Content ═══════ */
function BookingsContent() {
  return (
    <div className="space-y-4">
      {bookingStats.map((b, i) => (
        <motion.div
          key={i}
          className="bg-white rounded-xl border border-[#E8DFD3] p-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-[#3D3226] font-medium text-sm">{b.event}</h4>
            <span className="text-[#7BA23F] text-sm font-bold">{b.booked}/{b.total} 予約</span>
          </div>
          <div className="h-3 bg-[#FAF7F2] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[#7BA23F] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(b.booked / b.total) * 100}%` }}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
            />
          </div>
          <p className="text-[#8B7D6B] text-xs mt-2">残り {b.total - b.booked} 枠</p>
        </motion.div>
      ))}
    </div>
  );
}

/* ═══════ Notifications Content ═══════ */
function NotificationsContent() {
  const [lineEnabled, setLineEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);

  return (
    <div className="bg-white rounded-xl border border-[#E8DFD3] p-6 space-y-6">
      <h3 className="text-[#3D3226] font-bold text-sm">通知設定</h3>

      {[
        { label: "LINE通知", desc: "お問い合わせ・予約が入ったらLINEに即通知", enabled: lineEnabled, toggle: setLineEnabled },
        { label: "メール通知", desc: "お問い合わせ内容をメールに転送", enabled: emailEnabled, toggle: setEmailEnabled },
      ].map((n, i) => (
        <div key={i} className="flex items-center justify-between py-4 border-b border-[#E8DFD3] last:border-0">
          <div>
            <p className="text-[#3D3226] text-sm font-medium">{n.label}</p>
            <p className="text-[#8B7D6B] text-xs mt-0.5">{n.desc}</p>
          </div>
          <button
            onClick={() => n.toggle(!n.enabled)}
            className={`w-12 h-7 rounded-full transition-colors relative ${n.enabled ? "bg-[#7BA23F]" : "bg-gray-200"}`}
          >
            <div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-all ${n.enabled ? "left-6" : "left-1"}`} />
          </button>
        </div>
      ))}
    </div>
  );
}

/* ═══════ Admin Page ═══════ */
export default function AdminDashboard() {
  const [active, setActive] = useState("dashboard");

  const titles: Record<string, string> = {
    dashboard: "ダッシュボード",
    inquiries: "お問い合わせ管理",
    bookings: "見学会予約管理",
    notifications: "通知設定",
  };

  return (
    <div className="flex min-h-screen bg-[#FAF7F2]">
      <Sidebar active={active} setActive={setActive} />

      <div className="flex-1">
        {/* Top bar */}
        <div className="bg-white border-b border-[#E8DFD3] px-6 py-4 flex items-center justify-between">
          {/* Mobile nav */}
          <div className="lg:hidden flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#7BA23F] flex items-center justify-center">
              <Home className="w-4 h-4 text-white" />
            </div>
            <span className="text-[#3D3226] font-bold text-sm">{COMPANY.name}</span>
          </div>

          <h1 className="hidden lg:block text-[#3D3226] font-bold text-lg">{titles[active]}</h1>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#7BA23F]/10 text-[#7BA23F] text-xs font-medium">
              <div className="w-2 h-2 rounded-full bg-[#7BA23F] animate-pulse" />
              リアルタイム更新中
            </div>
          </div>
        </div>

        {/* Mobile tabs */}
        <div className="lg:hidden flex border-b border-[#E8DFD3] bg-white overflow-x-auto">
          {[
            { id: "dashboard", label: "ダッシュ" },
            { id: "inquiries", label: "問合せ" },
            { id: "bookings", label: "予約" },
            { id: "notifications", label: "通知" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={`px-4 py-3 text-xs whitespace-nowrap transition-colors ${
                active === tab.id
                  ? "text-[#7BA23F] border-b-2 border-[#7BA23F]"
                  : "text-[#8B7D6B]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6">
          {active === "dashboard" && <DashboardContent />}
          {active === "inquiries" && <InquiriesContent />}
          {active === "bookings" && <BookingsContent />}
          {active === "notifications" && <NotificationsContent />}
        </div>
      </div>
    </div>
  );
}
