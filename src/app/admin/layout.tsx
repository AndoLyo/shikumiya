"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutDashboard, FileEdit, Users, BarChart3, AlertTriangle,
  Settings, Menu, X, Shield, LogOut, Sparkles,
} from "lucide-react";

const NAV = [
  { id: "dashboard", label: "ダッシュボード", icon: LayoutDashboard, href: "/admin" },
  { id: "requests", label: "編集依頼キュー", icon: FileEdit, href: "/admin/requests" },
  { id: "accounts", label: "顧客アカウント", icon: Users, href: "/admin/accounts" },
  { id: "scores", label: "スコア管理", icon: BarChart3, href: "/admin/scores", disabled: true },
  { id: "errors", label: "エラー分析", icon: AlertTriangle, href: "/admin/errors", disabled: true },
  { id: "settings", label: "システム設定", icon: Settings, href: "/admin/settings", disabled: true },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sidebar = (
    <>
      <div className="px-5 py-4 border-b border-gray-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-[#e84393] via-[#6c5ce7] to-[#f39c12] flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">しくみや Admin</p>
            <p className="text-[9px] text-gray-500">運営管理</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.id}
              href={item.disabled ? "#" : item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all ${
                item.disabled
                  ? "text-gray-600 cursor-not-allowed"
                  : isActive
                    ? "bg-purple-600 text-white"
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
            >
              <Icon className="w-4.5 h-4.5" strokeWidth={1.5} />
              {item.label}
              {item.disabled && <span className="text-[9px] text-gray-600 ml-auto">Coming</span>}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-gray-800">
        <Link href="/" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-500 text-sm hover:text-gray-300 transition-colors">
          <LogOut className="w-4 h-4" /> 公開サイトに戻る
        </Link>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 bg-gray-900 flex-col flex-shrink-0 h-screen sticky top-0">
        {sidebar}
      </aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div className="fixed inset-0 z-40 bg-black/50 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSidebarOpen(false)} />
            <motion.aside className="fixed top-0 left-0 bottom-0 z-50 w-64 bg-gray-900 flex flex-col lg:hidden" initial={{ x: -256 }} animate={{ x: 0 }} exit={{ x: -256 }}>
              <div className="flex justify-end p-2">
                <button onClick={() => setSidebarOpen(false)} className="p-2 text-gray-500"><X className="w-5 h-5" /></button>
              </div>
              {sidebar}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-gray-100 px-5 h-14 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-1.5 text-gray-400"><Menu className="w-5 h-5" /></button>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Lyo
          </div>
        </header>
        <main className="flex-1 p-5 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
