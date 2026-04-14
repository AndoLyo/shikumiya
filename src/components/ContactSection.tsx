"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import SectionHeading from "./SectionHeading";

export default function ContactSection() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <section id="contact" className="relative section-padding overflow-hidden">
      <div className="absolute inset-0 bg-[#0a0a0f]" />

      <div className="relative z-10 max-w-[700px] mx-auto px-6">
        <SectionHeading
          title="お問い合わせ・お申し込み"
          subtitle="サイト制作のご依頼・ご質問はこちらから"
          number="— 08"
          align="center"
        />

        {submitted ? (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-white text-lg font-medium mb-2">送信ありがとうございます</p>
            <p className="text-text-secondary text-sm">1〜2営業日以内に返信いたします。</p>
          </motion.div>
        ) : (
          <motion.form
            action="https://formspree.io/f/xaqlblqa"
            method="POST"
            onSubmit={() => setSubmitted(true)}
            className="space-y-5"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {/* お名前 */}
            <div>
              <label htmlFor="name" className="block text-xs text-text-secondary mb-2 tracking-wider">
                お名前
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full px-5 py-3.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white text-sm placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-colors"
                placeholder="お名前を入力"
              />
            </div>

            {/* メールアドレス */}
            <div>
              <label htmlFor="email" className="block text-xs text-text-secondary mb-2 tracking-wider">
                メールアドレス
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full px-5 py-3.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white text-sm placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-colors"
                placeholder="example@email.com"
              />
            </div>

            {/* お問い合わせ種別 */}
            <div>
              <label htmlFor="type" className="block text-xs text-text-secondary mb-2 tracking-wider">
                お問い合わせ種別
              </label>
              <select
                id="type"
                name="type"
                className="w-full px-5 py-3.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white text-sm focus:outline-none focus:border-primary/50 transition-colors appearance-none"
              >
                <option value="サイト制作の相談">サイト制作の相談</option>
                <option value="おまかせプランの申し込み">おまかせプランの申し込み</option>
                <option value="おまかせプロプランの相談">おまかせプロプランの相談</option>
                <option value="その他">その他</option>
              </select>
            </div>

            {/* メッセージ */}
            <div>
              <label htmlFor="message" className="block text-xs text-text-secondary mb-2 tracking-wider">
                メッセージ
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                className="w-full px-5 py-3.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white text-sm placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-colors resize-none"
                placeholder="ご依頼内容やご質問をお書きください"
              />
            </div>

            {/* 送信ボタン */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-3 px-10 py-4 rounded-xl bg-primary text-[#0a0a0f] font-bold text-sm tracking-wider hover:bg-primary/90 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
              >
                <Send className="w-4 h-4" strokeWidth={2} />
                送信する
              </button>
            </div>

            <p className="text-text-muted text-xs text-center">
              ※ 通常1〜2営業日以内に返信します
            </p>
          </motion.form>
        )}

        {/* Social links */}
        <motion.div
          className="mt-12 flex items-center justify-center gap-6 text-text-muted text-sm"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <a href="https://x.com/ando_lyo" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">X</a>
          <span className="w-1 h-1 rounded-full bg-primary/30" />
          <a href="https://github.com/ando-lyo" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">GitHub</a>
          <span className="w-1 h-1 rounded-full bg-primary/30" />
          <a href="https://www.instagram.com/ando_lyo_ai/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Instagram</a>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 section-divider" />
    </section>
  );
}
