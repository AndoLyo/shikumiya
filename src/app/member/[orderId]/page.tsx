"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Globe, FileEdit, BarChart3, Clock,
  ArrowRight, Crown, Zap, Sparkles, ExternalLink, CheckCircle2,
  TrendingUp, AlertCircle, RefreshCw, Construction,
} from "lucide-react";

/* ═══════════════════════════════════════
   定数
   ═══════════════════════════════════════ */
import { normalizePlanId, PLAN_LABELS as STRIPE_PLAN_LABELS, PLAN_EDIT_LIMITS } from "@/lib/stripe";

const EDIT_LIMITS: Record<string, number> = { otameshi: 0, omakase: 3, "omakase-pro": 999 };

const PLAN_LABELS: Record<string, string> = {
  otameshi: "おためし",
  omakase: "おまかせ",
  "omakase-pro": "おまかせプロ",
};

const TEMPLATE_LABELS: Record<string, string> = {
  "warm-craft": "ウォームクラフト",
  "warm-craft-mid": "ウォームクラフト",
  "warm-craft-pro": "ウォームクラフト",
  "trust-navy": "トラストネイビー",
  "trust-navy-mid": "トラストネイビー",
  "trust-navy-pro": "トラストネイビー",
  "clean-arch": "クリーンアーチ",
  "clean-arch-mid": "クリーンアーチ",
  "clean-arch-pro": "クリーンアーチ",
};

function formatDate(raw: string): string {
  if (!raw) return "—";
  try {
    const d = new Date(raw);
    if (isNaN(d.getTime())) return raw;
    return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`;
  } catch {
    return raw;
  }
}

/* ═══════════════════════════════════════
   型
   ═══════════════════════════════════════ */
interface SiteData {
  companyName: string;
  template: string;
  domain: string;
  siteUrl: string;
  status: string;
  createdAt: string;
  plan: string;
  editsUsed: number;
}

/* ═══════════════════════════════════════
   スケルトン Loading
   ═══════════════════════════════════════ */
function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-200 rounded ${className}`} />;
}

function DashboardSkeleton() {
  return (
    <div className="max-w-[1000px] mx-auto space-y-6">
      <div>
        <Skeleton className="h-7 w-64 mb-2" />
        <Skeleton className="h-4 w-48" />
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="p-6 flex items-center gap-4">
          <Skeleton className="w-12 h-12 rounded-xl" />
          <div>
            <Skeleton className="h-5 w-40 mb-2" />
            <Skeleton className="h-3 w-56" />
          </div>
        </div>
        <div className="grid grid-cols-4 border-t border-gray-100">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="px-6 py-4 border-r border-gray-100 last:border-0">
              <Skeleton className="h-3 w-16 mb-2" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <Skeleton className="h-36 rounded-2xl" />
        <Skeleton className="h-36 rounded-2xl" />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   ページ本体
   ═══════════════════════════════════════ */
export default function MemberDashboard() {
  const params = useParams();
  const orderId = params.orderId as string;

  const { data: session } = useSession();

  const [site, setSite] = useState<SiteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(() => {
    const email = session?.user?.email;
    if (!email) {
      setError("ログインが必要です");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    fetch(`/api/member/${orderId}?email=${encodeURIComponent(email)}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!data.valid) {
          setError("会員情報が見つかりません。注文IDとメールアドレスを確認してください。");
          return;
        }
        setSite({
          companyName: data.companyName || "",
          template: data.template || "",
          domain: data.domain || "",
          siteUrl: data.siteUrl || "",
          status: data.status || "制作中",
          createdAt: data.createdAt || "",
          plan: normalizePlanId(data.plan || "otameshi"),
          editsUsed: data.editsUsed || 0,
        });
      })
      .catch((err) => {
        console.error("Failed to fetch member data:", err);
        setError("データの取得に失敗しました。ネットワーク接続を確認してください。");
      })
      .finally(() => setLoading(false));
  }, [orderId, session]);

  useEffect(() => { fetchData(); }, [fetchData]);

  /* ─── Loading ─── */
  if (loading) return <DashboardSkeleton />;

  /* ─── Error ─── */
  if (error || !site) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
          <AlertCircle className="w-7 h-7 text-red-400" />
        </div>
        <p className="text-gray-600 text-sm text-center max-w-xs">{error || "データを取得できませんでした"}</p>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-50 text-purple-600 text-sm font-medium hover:bg-purple-100 transition-colors"
          >
            <RefreshCw className="w-4 h-4" /> もう一度試す
          </button>
          <Link href="/member" className="text-gray-400 text-sm hover:text-gray-600 transition-colors">
            ログインに戻る
          </Link>
        </div>
      </div>
    );
  }

  /* ─── 表示用変数 ─── */
  const editsMax = EDIT_LIMITS[site.plan] || 0;
  const editsRemaining = Math.max(0, editsMax - site.editsUsed);
  const planLabel = PLAN_LABELS[site.plan] || "おためし";
  const templateLabel = TEMPLATE_LABELS[site.template] || site.template;
  const isBuilding = site.status === "制作中";
  const isPremium = site.plan === "omakase-pro";

  const statusStyles: Record<string, { color: string; icon: typeof CheckCircle2 }> = {
    "公開中": { color: "text-green-600 bg-green-50", icon: CheckCircle2 },
    "制作中": { color: "text-blue-600 bg-blue-50", icon: Construction },
    "停止": { color: "text-red-600 bg-red-50", icon: AlertCircle },
    "停止予定": { color: "text-orange-600 bg-orange-50", icon: Clock },
  };
  const st = statusStyles[site.status] || statusStyles["制作中"];
  const StatusIcon = st.icon;

  return (
    <div className="max-w-[1000px] mx-auto space-y-6">
      {/* Welcome */}
      <div>
        <h2 className="text-gray-800 text-xl font-bold mb-1">こんにちは、{site.companyName}さん</h2>
        <p className="text-gray-400 text-sm">サイトの状況を確認できます。</p>
      </div>

      {/* 制作中バナー */}
      {isBuilding && (
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
            <Construction className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <h3 className="text-blue-700 font-bold text-sm mb-1">サイトを制作中です</h3>
            <p className="text-blue-600 text-xs leading-relaxed">
              現在ホームページを制作中です。完成次第メールでお知らせします。通常1営業日以内に完成します。
            </p>
          </div>
        </div>
      )}

      {/* Site status */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
              <Globe className="w-6 h-6 text-purple-500" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-gray-800 font-bold text-base">{site.companyName}</h3>
              <p className="text-gray-400 text-xs mt-0.5">{site.domain || site.siteUrl || "URL未定"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${st.color}`}>
              <StatusIcon className="w-3.5 h-3.5" /> {site.status}
            </div>
            {site.siteUrl && !isBuilding && (
              <a href={site.siteUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 text-xs hover:border-purple-200 hover:text-purple-500 transition-all">
                サイトを表示 <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 border-t border-gray-100">
          {[
            ["テンプレート", templateLabel],
            ["開設日", formatDate(site.createdAt)],
            ["プラン", planLabel],
            ["今月の残り編集", editsMax >= 99 ? "無制限" : `${editsRemaining}/${editsMax}回`],
          ].map(([label, value]) => (
            <div key={label} className="px-6 py-4 border-r border-gray-100 last:border-0">
              <p className="text-gray-400 text-[10px] tracking-wider mb-1">{label}</p>
              <p className="text-gray-700 text-sm font-medium">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Link
          href={isBuilding ? "#" : `/member/${orderId}/editor`}
          className={`block p-5 bg-white rounded-2xl border border-gray-100 transition-all group ${isBuilding ? "opacity-50 cursor-not-allowed" : "hover:border-purple-200"}`}
          onClick={(e) => isBuilding && e.preventDefault()}
        >
          <FileEdit className="w-8 h-8 text-purple-400 mb-3" strokeWidth={1.5} />
          <h3 className="text-gray-800 font-bold text-sm mb-1">サイト編集を依頼する</h3>
          <p className="text-gray-400 text-xs leading-relaxed mb-3">
            {isBuilding ? "サイト完成後にご利用いただけます" : "テキスト変更、写真追加、レイアウト変更など"}
          </p>
          {!isBuilding && (
            <span className="text-purple-500 text-xs font-medium flex items-center gap-1">依頼する <ArrowRight className="w-3 h-3" /></span>
          )}
        </Link>
        <Link href={`/member/${orderId}/features`} className="block p-5 bg-white rounded-2xl border border-gray-100 hover:border-purple-200 transition-all group">
          <Sparkles className="w-8 h-8 text-orange-400 mb-3" strokeWidth={1.5} />
          <h3 className="text-gray-800 font-bold text-sm mb-1">サイト機能を管理する</h3>
          <p className="text-gray-400 text-xs leading-relaxed mb-3">機能のオン/オフ、利用可能な機能の確認</p>
          <span className="text-purple-500 text-xs font-medium flex items-center gap-1">管理する <ArrowRight className="w-3 h-3" /></span>
        </Link>
      </div>

      {/* Upgrade suggestion — premium 以外のみ */}
      {!isPremium && (
        <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 rounded-2xl border border-purple-100/50 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Crown className="w-4 h-4 text-purple-400" />
            <h3 className="text-gray-700 font-bold text-sm">プランアップグレードのご案内</h3>
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              { icon: BarChart3, title: "アクセス解析", desc: "PVや検索キーワードが丸わかり", plan: "おまかせ", color: "text-blue-500", bg: "bg-blue-50", minPlan: "omakase" },
              { icon: TrendingUp, title: "ブログ/お知らせ", desc: "更新するほど検索に強くなる", plan: "おまかせ", color: "text-green-500", bg: "bg-green-50", minPlan: "omakase" },
              { icon: Zap, title: "AIチャットボット", desc: "24時間自動でお客様に対応", plan: "おまかせプロ", color: "text-orange-500", bg: "bg-orange-50", minPlan: "omakase-pro" },
            ]
              .filter((f) => {
                // 既に持っている機能は表示しない
                const levels: Record<string, number> = { otameshi: 1, omakase: 2, "omakase-pro": 3 };
                return levels[f.minPlan] > (levels[site.plan] || 1);
              })
              .map((f, i) => {
                const Icon = f.icon;
                return (
                  <div key={i} className="bg-white/80 rounded-xl p-4 border border-white">
                    <div className={`w-9 h-9 rounded-lg ${f.bg} flex items-center justify-center mb-3`}>
                      <Icon className={`w-4.5 h-4.5 ${f.color}`} strokeWidth={1.5} />
                    </div>
                    <h4 className="text-gray-700 font-medium text-xs mb-1">{f.title}</h4>
                    <p className="text-gray-400 text-[10px] leading-relaxed mb-2">{f.desc}</p>
                    <span className="text-purple-500 text-[10px] font-medium">{f.plan}プランで利用可能</span>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}
