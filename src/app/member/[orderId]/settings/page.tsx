"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Mail, Phone, Building2, Globe, Lock, Check, Save,
  Crown, ArrowUp, ArrowDown, Sparkles, X, Zap,
} from "lucide-react";

type Plan = "lite" | "middle" | "premium";

const PLANS = [
  {
    id: "lite" as Plan,
    name: "おまかせプラン",
    price: "¥3,000",
    priceNum: 3000,
    features: [
      "業種に合ったテンプレートを選択",
      "施工写真を最大10枚",
      "お問い合わせフォーム",
      "SSL/レスポンシブ対応",
      "独自ドメイン対応",
      "月1回の内容更新",
    ],
  },
  {
    id: "middle" as Plan,
    name: "まるっとおまかせプラン",
    price: "¥8,000",
    priceNum: 8000,
    recommended: true,
    features: [
      "おまかせプランの全機能",
      "施工実績の詳細ページ",
      "お客様の声セクション",
      "ブログ/お知らせ機能",
      "Google Maps埋め込み",
      "SEO強化（JSON-LD/OGP）",
      "アクセス解析",
      "月3回の内容更新",
    ],
  },
  {
    id: "premium" as Plan,
    name: "ぜんぶおまかせプラン",
    price: "¥15,000~",
    priceNum: 15000,
    features: [
      "まるっとおまかせプランの全機能",
      "AIチャットボット",
      "予約システム",
      "採用ページ",
      "多言語対応",
      "360°ビューア",
      "PDF資料ダウンロード",
      "動画セクション",
      "LINE通知連携",
      "更新回数無制限",
    ],
  },
];

const PLAN_LEVEL: Record<Plan, number> = { lite: 1, middle: 2, premium: 3 };

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<Plan>("lite");

  useEffect(() => {
    const p = new URL(window.location.href).searchParams.get("plan");
    if (p === "middle" || p === "premium") setCurrentPlan(p);
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-[700px] mx-auto">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-gray-800 text-xl font-bold mb-1">アカウント設定</h2>
        <p className="text-gray-400 text-sm mb-6">会社情報やプラン設定を管理します。</p>
      </motion.div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Company info */}
        <motion.div className="bg-white rounded-2xl border border-gray-100 p-6" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <h3 className="text-gray-700 font-bold text-sm mb-4 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-purple-400" /> 会社情報
          </h3>
          <div className="space-y-4">
            {[
              { id: "company", label: "会社名・屋号", value: "山田工務店" },
              { id: "email", label: "メールアドレス", value: "info@yamada-koumuten.jp" },
              { id: "phone", label: "電話番号", value: "0120-000-000" },
              { id: "domain", label: "ドメイン", value: "yamada-koumuten.jp" },
            ].map((f) => (
              <div key={f.id}>
                <label className="block text-xs text-gray-500 mb-1.5 font-medium">{f.label}</label>
                <input type="text" defaultValue={f.value} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 text-sm focus:outline-none focus:border-purple-300 focus:ring-2 focus:ring-purple-100 transition-all" />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Plan info */}
        <motion.div className="bg-white rounded-2xl border border-gray-100 p-6" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h3 className="text-gray-700 font-bold text-sm mb-4 flex items-center gap-2">
            <Crown className="w-4 h-4 text-purple-400" /> プラン情報
          </h3>
          <div className="space-y-3">
            {[
              ["現在のプラン", PLANS.find((p) => p.id === currentPlan)?.name || "おまかせプラン"],
              ["月額", PLANS.find((p) => p.id === currentPlan)?.price + "/月" || "¥3,000/月"],
              ["次回請求日", "2025年5月1日"],
              ["編集回数（今月）", currentPlan === "premium" ? "無制限" : currentPlan === "middle" ? "1 / 3回" : "0 / 1回"],
            ].map(([label, value], i) => (
              <div key={label} className={`flex items-center justify-between py-3 ${i < 3 ? "border-b border-gray-100" : ""}`}>
                <span className="text-gray-500 text-sm">{label}</span>
                {i === 0 ? (
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    currentPlan === "premium" ? "bg-orange-100 text-orange-600" :
                    currentPlan === "middle" ? "bg-purple-100 text-purple-600" :
                    "bg-gray-100 text-gray-600"
                  }`}>{value}</span>
                ) : (
                  <span className="text-gray-800 text-sm font-medium">{value}</span>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setShowPlanModal(true)}
            className="w-full mt-4 py-3 rounded-xl border border-purple-200 text-purple-500 text-sm font-medium hover:bg-purple-50 transition-colors flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" /> プランを管理
          </button>
        </motion.div>

        {/* Login info */}
        <motion.div className="bg-white rounded-2xl border border-gray-100 p-6" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <h3 className="text-gray-700 font-bold text-sm mb-4 flex items-center gap-2">
            <Lock className="w-4 h-4 text-purple-400" /> ログイン情報
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1.5 font-medium">注文ID</label>
              <input type="text" value="test-order" readOnly className="w-full px-4 py-3 rounded-xl bg-gray-100 border border-gray-200 text-gray-500 text-sm" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5 font-medium">登録メールアドレス</label>
              <input type="text" value="info@yamada-koumuten.jp" readOnly className="w-full px-4 py-3 rounded-xl bg-gray-100 border border-gray-200 text-gray-500 text-sm" />
            </div>
          </div>
        </motion.div>

        {/* Save */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <button type="submit" className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-r from-[#e84393] via-[#6c5ce7] to-[#f39c12] text-white font-bold text-sm tracking-wider hover:opacity-90 transition-all shadow-lg shadow-purple-200/30">
            {saved ? <><Check className="w-4 h-4" /> 保存しました</> : <><Save className="w-4 h-4" /> 変更を保存</>}
          </button>
        </motion.div>
      </form>

      {/* ═══ プラン管理モーダル ═══ */}
      <AnimatePresence>
        {showPlanModal && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowPlanModal(false)}
          >
            <motion.div
              className="bg-white rounded-2xl max-w-[900px] w-full overflow-hidden shadow-2xl my-8"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="text-gray-800 text-lg font-bold">プランを管理</h3>
                  <p className="text-gray-400 text-xs mt-0.5">ご利用状況に合わせてプランを変更できます</p>
                </div>
                <button onClick={() => setShowPlanModal(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              {/* Plans grid */}
              <div className="p-6">
                <div className="grid sm:grid-cols-3 gap-4">
                  {PLANS.map((plan) => {
                    const isCurrent = plan.id === currentPlan;
                    const isUpgrade = PLAN_LEVEL[plan.id] > PLAN_LEVEL[currentPlan];
                    const isDowngrade = PLAN_LEVEL[plan.id] < PLAN_LEVEL[currentPlan];

                    return (
                      <div
                        key={plan.id}
                        className={`rounded-2xl border-2 p-5 relative ${
                          isCurrent
                            ? "border-purple-300 bg-purple-50/30"
                            : plan.recommended
                              ? "border-purple-100 bg-white"
                              : "border-gray-100 bg-white"
                        }`}
                      >
                        {/* Current badge */}
                        {isCurrent && (
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-purple-500 text-white text-[10px] font-medium">
                            現在のプラン
                          </div>
                        )}

                        {/* Recommended badge */}
                        {plan.recommended && !isCurrent && (
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-[#e84393] via-[#6c5ce7] to-[#f39c12] text-white text-[10px] font-medium">
                            おすすめ
                          </div>
                        )}

                        <h4 className="text-gray-800 font-bold text-sm mb-1 mt-1">{plan.name}</h4>
                        <div className="flex items-baseline gap-1 mb-4">
                          <span className="text-gray-800 text-2xl font-bold">{plan.price}</span>
                          <span className="text-gray-400 text-xs">/月</span>
                        </div>

                        {/* Features */}
                        <ul className="space-y-2 mb-5">
                          {plan.features.map((f) => (
                            <li key={f} className="flex items-start gap-2 text-xs text-gray-600">
                              <Check className="w-3.5 h-3.5 text-green-400 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                              {f}
                            </li>
                          ))}
                        </ul>

                        {/* Action button */}
                        {isCurrent ? (
                          <button disabled className="w-full py-2.5 rounded-xl bg-gray-100 text-gray-400 text-xs font-medium cursor-not-allowed">
                            現在のプラン
                          </button>
                        ) : isUpgrade ? (
                          <button className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#e84393] via-[#6c5ce7] to-[#f39c12] text-white text-xs font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5">
                            <ArrowUp className="w-3.5 h-3.5" /> アップグレードする
                          </button>
                        ) : (
                          <button className="w-full py-2.5 rounded-xl border border-gray-200 text-gray-500 text-xs font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5">
                            <ArrowDown className="w-3.5 h-3.5" /> ダウングレードする
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                <p className="text-gray-400 text-[10px] text-center mt-4">
                  ※ プラン変更は次回請求日から適用されます。ダウングレードの場合、上位プランの機能は次回請求日以降に無効になります。
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
