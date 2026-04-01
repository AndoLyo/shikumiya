"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const links = {
  site: [
    { label: "制作実績", href: "#showcase" },
    { label: "制作の流れ", href: "#service" },
    { label: "料金プラン", href: "#pricing" },
    { label: "テンプレート一覧", href: "/templates" },
    { label: "お問い合わせ", href: "mailto:ando.lyo.ai@gmail.com" },
  ],
  note: [
    { label: "note（記事一覧）", href: "https://note.com/ando_lyo_ai" },
    { label: "開発日記マガジン", href: "https://note.com/ando_lyo_ai/m/m3294daf5f300" },
    { label: "プロンプト集マガジン", href: "https://note.com/ando_lyo_ai/m/m039aea8b90ac" },
  ],
  social: [
    { label: "X（Twitter）", href: "https://x.com/ando_lyo" },
    { label: "GitHub", href: "https://github.com/ando-lyo" },
    { label: "Instagram", href: "https://www.instagram.com/ando_lyo_ai/" },
  ],
};

export default function Footer() {
  return (
    <footer className="relative border-t border-white/[0.06] bg-[#080810]">
      <div className="max-w-[1200px] mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <motion.div
            className="md:col-span-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-8 bg-primary rounded-full" />
              <div>
                <p className="font-serif text-lg font-bold text-white tracking-wide">しくみや</p>
                <p className="font-mono text-[10px] tracking-[0.2em] text-text-muted">by Lyo Vision</p>
              </div>
            </div>
            <p className="text-text-muted text-xs leading-relaxed mb-3">
              AIアーティストのためのギャラリーサイト制作
            </p>
            <p className="text-text-muted text-[10px] font-mono">
              &copy; 2025-2026 Lyo Vision. All rights reserved.
            </p>
          </motion.div>

          {/* Site links */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
            <h4 className="text-xs text-primary tracking-widest mb-4">サイト</h4>
            <ul className="space-y-2.5">
              {links.site.map((l) =>
                l.href.startsWith("/") ? (
                  <li key={l.label}><Link href={l.href} className="text-text-secondary text-sm hover:text-primary transition-colors">{l.label}</Link></li>
                ) : l.href.startsWith("#") ? (
                  <li key={l.label}><a href={l.href} className="text-text-secondary text-sm hover:text-primary transition-colors">{l.label}</a></li>
                ) : (
                  <li key={l.label}><a href={l.href} className="text-text-secondary text-sm hover:text-primary transition-colors">{l.label}</a></li>
                )
              )}
              <li><Link href="/privacy" className="text-text-secondary text-sm hover:text-primary transition-colors">プライバシーポリシー</Link></li>
              <li><Link href="/legal" className="text-text-secondary text-sm hover:text-primary transition-colors">特定商取引法に基づく表示</Link></li>
            </ul>
          </motion.div>

          {/* Note links */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            <h4 className="text-xs text-primary tracking-widest mb-4">note</h4>
            <ul className="space-y-2.5">
              {links.note.map((l) => (
                <li key={l.label}><a href={l.href} target="_blank" rel="noopener noreferrer" className="text-text-secondary text-sm hover:text-primary transition-colors">{l.label}</a></li>
              ))}
            </ul>
          </motion.div>

          {/* Social */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
            <h4 className="text-xs text-primary tracking-widest mb-4">SNS</h4>
            <ul className="space-y-2.5">
              {links.social.map((l) => (
                <li key={l.label}><a href={l.href} target="_blank" rel="noopener noreferrer" className="text-text-secondary text-sm hover:text-primary transition-colors">{l.label}</a></li>
              ))}
            </ul>
          </motion.div>
        </div>

        <div className="mt-10 pt-5 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-text-muted text-[10px] font-mono tracking-wider">
            Next.js + Tailwind CSS + Framer Motion
          </p>
          <p className="text-text-muted text-[10px] tracking-wider">
            設計・開発：Lyo
          </p>
        </div>
      </div>
    </footer>
  );
}
