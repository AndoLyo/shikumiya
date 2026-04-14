"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Check, Sparkles, Mail, ArrowRight } from "lucide-react";

/**
 * /start/success — 決済完了ページ
 * Stripe Checkoutから戻ってきた顧客に表示
 */
export default function StartSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdf2f8] via-[#f3f0ff] to-[#fff7ed] flex items-center justify-center p-5">
      <motion.div
        className="bg-white rounded-3xl shadow-xl p-10 max-w-[520px] w-full text-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <motion.div
          className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
        >
          <Check className="w-10 h-10 text-green-500" />
        </motion.div>

        <h1 className="text-gray-800 text-2xl font-bold mb-3">
          お申し込みありがとうございます
        </h1>

        <p className="text-gray-500 text-sm leading-relaxed mb-6">
          ご入力いただいた内容をもとに、ホームページの制作を開始します。
          <br />
          最短翌日にはあなたのサイトが完成します。
        </p>

        {/* What happens next */}
        <div className="bg-gray-50 rounded-2xl p-5 text-left space-y-4 mb-6">
          <h3 className="text-gray-700 font-bold text-sm flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            今後の流れ
          </h3>
          <div className="space-y-3">
            {[
              { num: "1", text: "確認メールをお送りしました。受信トレイをご確認ください" },
              { num: "2", text: "ホームページを制作中です（最短翌日に完成）" },
              { num: "3", text: "完成したらサイトURLを記載したメールをお届けします" },
            ].map((step) => (
              <div key={step.num} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-purple-600 text-xs font-bold">{step.num}</span>
                </div>
                <p className="text-gray-600 text-sm">{step.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Email notice */}
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-50 border border-blue-100 mb-6">
          <Mail className="w-5 h-5 text-blue-400 flex-shrink-0" />
          <p className="text-blue-600 text-xs text-left">
            確認メールが届かない場合は、迷惑メールフォルダもご確認ください
          </p>
        </div>

        {/* 会員ページ案内 */}
        <div className="bg-purple-50 border border-purple-100 rounded-2xl p-5 text-left mb-6">
          <h3 className="text-purple-700 font-bold text-sm mb-2">サイト完成後のご案内</h3>
          <p className="text-purple-600 text-xs leading-relaxed mb-3">
            完成メールに記載される「注文ID」と「メールアドレス」で会員ページにログインできます。
            サイトの編集依頼や機能管理はそちらから行えます。
          </p>
          <Link
            href="/member"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500 text-white text-xs font-medium hover:bg-purple-600 transition-colors"
          >
            会員ページはこちら <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-400 text-sm hover:text-gray-600 transition-colors"
        >
          トップページに戻る
        </Link>
      </motion.div>
    </div>
  );
}
