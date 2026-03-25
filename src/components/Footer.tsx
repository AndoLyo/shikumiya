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
    { label: "お問い合わせ", href: "mailto:ando.lyo.ai@gmail.com" },
  ],
};

export default function Footer() {
  return (
    <footer className="relative border-t border-white/[0.06] bg-[#080810]">
      <div className="max-w-[1200px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <motion.div
            className="md:col-span-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-8 bg-primary rounded-full" />
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
            <p className="text-text-muted text-[10px] font-mono">
              &copy; 2025-2026 Lyo Vision. All rights reserved.
            </p>
          </motion.div>

          {/* Content links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h4 className="font-mono text-xs text-primary tracking-widest uppercase mb-4">
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
            <h4 className="font-mono text-xs text-primary tracking-widest uppercase mb-4">
              More
            </h4>
            <ul className="space-y-2.5">
              {links.other.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    target={l.href.startsWith("mailto:") || l.href.startsWith("/") ? undefined : "_blank"}
                    rel={l.href.startsWith("mailto:") || l.href.startsWith("/") ? undefined : "noopener noreferrer"}
                    className="text-text-secondary text-sm hover:text-primary transition-colors duration-300"
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
            <h4 className="font-mono text-xs text-primary tracking-widest uppercase mb-4">
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
            Built with Next.js + Tailwind CSS + Framer Motion
          </p>
          <p className="text-text-muted text-[10px] font-mono tracking-wider">
            Designed & Developed by Lyo
          </p>
        </div>
      </div>
    </footer>
  );
}
