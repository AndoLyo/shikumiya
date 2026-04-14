"use client";

import { useState, useEffect } from "react";
import { useParams, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  FileEdit,
  ClipboardList,
  BarChart3,
  MessageSquare,
  Newspaper,
  Bot,
  CalendarDays,
  Users,
  Globe,
  Settings2,
  User,
  Lock,
  Menu,
  X,
  Sparkles,
  ArrowRight,
  Crown,
  Zap,
  ChevronRight,
} from "lucide-react";
import { MemberCtx, useMember, type Plan, type MemberContextType } from "@/lib/member-context";

/* ═══════════════════════════════════════
   Navigation Definition
   ═══════════════════════════════════════ */
interface NavItem {
  id: string;
  label: string;
  icon: typeof LayoutDashboard;
  href: string;
  minPlan: Plan;
  upgradeTitle?: string;
  upgradeDesc?: string;
  upgradePlan?: string;
  upgradePrice?: string;
}

const PLAN_LEVEL: Record<Plan, number> = { otameshi: 1, omakase: 2, "omakase-pro": 3 };

function hasAccess(userPlan: Plan, minPlan: Plan): boolean {
  return PLAN_LEVEL[userPlan] >= PLAN_LEVEL[minPlan];
}

function getNavItems(orderId: string): NavItem[] {
  const base = `/member/${orderId}`;
  return [
    // 全プラン共通
    { id: "dashboard", label: "ダッシュボード", icon: LayoutDashboard, href: base, minPlan: "otameshi" },
    { id: "edit-request", label: "サイト編集依頼", icon: FileEdit, href: `${base}/edit-request`, minPlan: "otameshi" },
    { id: "history", label: "依頼履歴", icon: ClipboardList, href: `${base}/history`, minPlan: "otameshi" },
    // おまかせ以上
    { id: "analytics", label: "アクセス解析", icon: BarChart3, href: `${base}/analytics`, minPlan: "omakase",
      upgradeTitle: "アクセス解析", upgradeDesc: "サイトのPV数、検索キーワード、問い合わせ数などをグラフで確認できます。「どのページが見られているか」が一目でわかります。", upgradePlan: "おまかせプラン", upgradePrice: "¥1,480/月" },
    { id: "inquiries", label: "お問い合わせ一覧", icon: MessageSquare, href: `${base}/analytics`, minPlan: "omakase",
      upgradeTitle: "お問い合わせ管理", upgradeDesc: "サイト経由の問い合わせを一覧で確認。対応状況の管理もできます。見逃し防止に。", upgradePlan: "おまかせプラン", upgradePrice: "¥1,480/月" },
    { id: "blog", label: "ブログ/お知らせ", icon: Newspaper, href: `${base}/analytics`, minPlan: "omakase",
      upgradeTitle: "ブログ/お知らせ", upgradeDesc: "施工レポートや見学会の告知を掲載。更新するほど検索に強いサイトに育ちます。", upgradePlan: "おまかせプラン", upgradePrice: "¥1,480/月" },
    // おまかせプロ
    { id: "chatbot", label: "AIチャットボット", icon: Bot, href: `${base}/analytics`, minPlan: "omakase-pro",
      upgradeTitle: "AIチャットボット", upgradeDesc: "よくある質問に24時間自動対応。「費用は？」「対応エリアは？」にも即座に回答します。", upgradePlan: "おまかせプロプラン", upgradePrice: "¥4,980/月" },
    { id: "bookings", label: "予約管理", icon: CalendarDays, href: `${base}/analytics`, minPlan: "omakase-pro",
      upgradeTitle: "予約システム", upgradeDesc: "見学会や相談会のオンライン予約。残枠管理、自動メール通知まで対応。電話対応を減らせます。", upgradePlan: "おまかせプロプラン", upgradePrice: "¥4,980/月" },
    { id: "recruit", label: "採用ページ管理", icon: Users, href: `${base}/analytics`, minPlan: "omakase-pro",
      upgradeTitle: "採用ページ", upgradeDesc: "募集要項の掲載、履歴書のオンライン受付。人手不足の建設業界に必須の機能。", upgradePlan: "おまかせプロプラン", upgradePrice: "¥4,980/月" },
    { id: "i18n", label: "多言語設定", icon: Globe, href: `${base}/analytics`, minPlan: "omakase-pro",
      upgradeTitle: "多言語対応", upgradeDesc: "サイトの日本語/英語切替。海外クライアントやインバウンド対応に。", upgradePlan: "おまかせプロプラン", upgradePrice: "¥4,980/月" },
    // 全プラン共通（下部）
    { id: "features", label: "サイト機能管理", icon: Settings2, href: `${base}/features`, minPlan: "otameshi" },
    { id: "settings", label: "アカウント設定", icon: User, href: `${base}/settings`, minPlan: "otameshi" },
  ];
}

/* ═══════════════════════════════════════
   Upgrade Modal
   ═══════════════════════════════════════ */
interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  planName: string;
  price: string;
}

function UpgradeModal({ isOpen, onClose, title, description, planName, price }: UpgradeModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-2xl max-w-[440px] w-full overflow-hidden shadow-2xl"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with gradient */}
            <div className="bg-gradient-to-r from-[#e84393] via-[#6c5ce7] to-[#f39c12] p-6 text-white">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-5 h-5" />
                <span className="text-sm font-medium tracking-wider">{planName}</span>
              </div>
              <h3 className="text-xl font-bold">{title}</h3>
            </div>

            <div className="p-6">
              <p className="text-gray-600 text-sm leading-relaxed mb-6">{description}</p>

              {/* Price */}
              <div className="flex items-baseline gap-2 mb-6 px-4 py-3 rounded-xl bg-purple-50 border border-purple-100">
                <span className="text-2xl font-bold text-purple-600">{price}</span>
                <span className="text-gray-500 text-xs">から利用可能</span>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-500 text-sm hover:bg-gray-50 transition-colors"
                >
                  閉じる
                </button>
                <a
                  href="settings"
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#e84393] via-[#6c5ce7] to-[#f39c12] text-white text-sm font-bold text-center hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4" /> アップグレード
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ═══════════════════════════════════════
   Sidebar
   ═══════════════════════════════════════ */
function Sidebar({
  navItems,
  plan,
  currentPath,
  onLockedClick,
  isOpen,
  onClose,
  siteUrl,
}: {
  navItems: NavItem[];
  plan: Plan;
  currentPath: string;
  onLockedClick: (item: NavItem) => void;
  isOpen: boolean;
  onClose: () => void;
  siteUrl: string;
}) {
  const planLabels: Record<Plan, { label: string; color: string; bg: string }> = {
    otameshi: { label: "おためし", color: "text-gray-600", bg: "bg-gray-100" },
    omakase: { label: "おまかせ", color: "text-purple-600", bg: "bg-purple-100" },
    "omakase-pro": { label: "おまかせプロ", color: "text-orange-600", bg: "bg-orange-100" },
  };

  const mainItems = navItems.filter((n) => !["features", "settings"].includes(n.id));
  const bottomItems = navItems.filter((n) => ["features", "settings"].includes(n.id));

  const renderItem = (item: NavItem) => {
    const Icon = item.icon;
    const isActive = currentPath === item.href || (item.id === "dashboard" && currentPath.endsWith(`/${navItems[0].href.split("/").pop()}`));
    const locked = !hasAccess(plan, item.minPlan);

    if (locked) {
      return (
        <button
          key={item.id}
          onClick={() => onLockedClick(item)}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-300 hover:text-gray-400 hover:bg-gray-50 transition-all text-sm group relative"
        >
          <Icon className="w-4.5 h-4.5" strokeWidth={1.5} />
          <span className="flex-1 text-left">{item.label}</span>
          <Lock className="w-3.5 h-3.5 text-gray-300 group-hover:text-purple-400 transition-colors" />
        </button>
      );
    }

    return (
      <Link
        key={item.id}
        href={item.href}
        onClick={onClose}
        className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all ${
          isActive
            ? "bg-purple-50 text-purple-600 font-medium"
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
        }`}
      >
        <Icon className="w-4.5 h-4.5" strokeWidth={1.5} />
        <span>{item.label}</span>
      </Link>
    );
  };

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-[#e84393] via-[#6c5ce7] to-[#f39c12] flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-800">しくみや</p>
            <p className="text-[9px] text-gray-400">管理ページ</p>
          </div>
        </div>
      </div>

      {/* Plan badge */}
      <div className="px-5 py-3 border-b border-gray-100">
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${planLabels[plan].bg} ${planLabels[plan].color}`}>
          {plan === "omakase-pro" && <Crown className="w-3 h-3" />}
          {planLabels[plan].label}プラン
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {mainItems.map(renderItem)}

        <div className="my-4 mx-4 h-px bg-gray-100" />

        {bottomItems.map(renderItem)}
      </nav>

      {/* Site link */}
      <div className="px-4 py-3 border-t border-gray-100">
        <a
          href={siteUrl || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-400 text-xs hover:text-purple-500 hover:bg-purple-50 transition-all"
        >
          サイトを表示 <ArrowRight className="w-3 h-3" />
        </a>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-gray-100 flex-col flex-shrink-0 h-screen sticky top-0">
        {sidebarContent}
      </aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/30 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            />
            <motion.aside
              className="fixed top-0 left-0 bottom-0 z-50 w-72 bg-white flex flex-col lg:hidden"
              initial={{ x: -288 }}
              animate={{ x: 0 }}
              exit={{ x: -288 }}
              transition={{ type: "spring", damping: 25 }}
            >
              <div className="flex items-center justify-end p-3">
                <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

/* ═══════════════════════════════════════
   Layout
   ═══════════════════════════════════════ */
export default function MemberLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const pathname = usePathname();
  const orderId = params.orderId as string;

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [upgradeModal, setUpgradeModal] = useState<NavItem | null>(null);

  const { data: session } = useSession();

  const plan: Plan = (() => {
    const p = session?.plan;
    if (p === "omakase" || p === "omakase-pro") return p;
    // Legacy compatibility
    if (p === "middle") return "omakase";
    if (p === "premium") return "omakase-pro";
    return "otameshi";
  })();
  const companyName = session?.companyName || "";
  const siteUrl = session?.siteUrl || `https://shikumiya-${orderId}.vercel.app`;

  const navItems = getNavItems(orderId);

  const memberCtx: MemberContextType = {
    plan,
    companyName,
    orderId,
    siteUrl,
  };

  // /edit ページはフルスクリーンエディタなのでサイドバーなし
  const isEditPage = pathname.includes("/edit");
  if (isEditPage) {
    return <>{children}</>;
  }

  return (
    <MemberCtx.Provider value={memberCtx}>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar
          navItems={navItems}
          plan={plan}
          currentPath={pathname}
          onLockedClick={(item) => setUpgradeModal(item)}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          siteUrl={siteUrl}
        />

        <div className="flex-1 flex flex-col min-w-0">
          {/* Top bar */}
          <header className="bg-white border-b border-gray-100 px-5 h-14 flex items-center justify-between sticky top-0 z-30">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-1.5 text-gray-400 hover:text-gray-600">
                <Menu className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span className="hidden sm:block">{memberCtx.companyName}</span>
              <div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-purple-500" />
              </div>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 p-5 sm:p-6">
            {children}
          </main>
        </div>

        {/* Upgrade modal */}
        {upgradeModal && (
          <UpgradeModal
            isOpen={!!upgradeModal}
            onClose={() => setUpgradeModal(null)}
            title={upgradeModal.upgradeTitle || upgradeModal.label}
            description={upgradeModal.upgradeDesc || ""}
            planName={upgradeModal.upgradePlan || ""}
            price={upgradeModal.upgradePrice || ""}
          />
        )}
      </div>
    </MemberCtx.Provider>
  );
}
