"use client";

import { motion } from "framer-motion";

const links = {
  content: [
    { label: "note (記事一覧)", href: "https://note.com/ando_lyo_ai" },
    { label: "開発日記マガジン", href: "https://note.com/ando_lyo_ai/m/m3294daf5f300" },
    { label: "プロンプト集マガジン", href: "https://note.com/ando_lyo_ai/m/m039aea8b90ac" },
  ],
  social: [
    { label: "X (Twitter)", href: "https://x.com/ando_lyo" },
    { label: "GitHub", href: "https://github.com/ando-lyo" },
    { label: "Instagram", href: "https://www.instagram.com/ando_lyo_ai/" },
  ],
  other: [
    { label: "Lab Member (¥500/月)", href: "https://note.com/ando_lyo_ai/membership" },
    { label: "AIアートギャラリー", href: "/portfolio" },
    { label: "プライバシーポリシー", href: "/privacy" },
    { label: "お問い合わせ", href: "mailto:ando.lyo.ai@gmail.com" },
  ],
};

export default function Footer() {
  return (
    <footer className="relative border-t border-white/[0.06] bg-[#070710]">
      {/* Geometric top decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rotate-45 bg-[#070710] border-t border-l border-white/[0.06]" />

      <div className="max-w-[1200px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand column */}
          <motion.div
            className="md:col-span-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-4">
              {/* Logo accent (hiraomakoto red dot adapted to cyan) */}
              <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-primary" />
              </div>
              <div>
                <p className="font-serif text-lg font-bold text-white tracking-wide">
                  しくみや
                </p>
                <p className="font-mono text-[10px] tracking-[0.2em] text-text-muted">
                  by Lyo Vision
                </p>
              </div>
            </div>
            <p className="text-text-muted text-xs leading-relaxed mb-4">
              AIで仕組みを作り、全部公開する。
            </p>

            {/* Geometric decoration */}
            <div className="flex items-center gap-2 mt-6">
              <div className="w-2 h-2 rotate-45 bg-primary/20" />
              <div className="w-1.5 h-1.5 rounded-full bg-gold/20" />
              <div className="w-2 h-2 rotate-45 bg-primary/10" />
            </div>
          </motion.div>

          {/* Content links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h4 className="font-mono text-xs text-primary tracking-widest uppercase mb-4 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rotate-45 bg-primary/40" />
              Content
            </h4>
            <ul className="space-y-2.5">
              {links.content.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-secondary text-sm hover:text-primary transition-colors duration-300"
                    data-cursor="pointer"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* More links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 className="font-mono text-xs text-primary tracking-widest uppercase mb-4 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rotate-45 bg-primary/40" />
              More
            </h4>
            <ul className="space-y-2.5">
              {links.other.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    target={
                      l.href.startsWith("mailto:") || l.href.startsWith("/")
                        ? undefined
                        : "_blank"
                    }
                    rel={
                      l.href.startsWith("mailto:") || l.href.startsWith("/")
                        ? undefined
                        : "noopener noreferrer"
                    }
                    className="text-text-secondary text-sm hover:text-primary transition-colors duration-300"
                    data-cursor="pointer"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Social */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h4 className="font-mono text-xs text-primary tracking-widest uppercase mb-4 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rotate-45 bg-primary/40" />
              Social
            </h4>
            <ul className="space-y-2.5">
              {links.social.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-secondary text-sm hover:text-primary transition-colors duration-300"
                    data-cursor="pointer"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-text-muted text-[10px] font-mono tracking-wider">
            &copy; 2025-2026 Lyo Vision. All rights reserved.
          </p>
          <p className="text-text-muted text-[10px] font-mono tracking-wider flex items-center gap-2">
            <span>Built with Next.js + Tailwind CSS + Framer Motion</span>
            <span className="w-1 h-1 rounded-full bg-primary/30" />
            <span>Designed & Developed by Lyo</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
