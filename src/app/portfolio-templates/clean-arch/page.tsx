"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  X,
  ArrowRight,
  Camera,
  Send,
  Check,
} from "lucide-react";
import DemoBanner from "@/components/portfolio-templates/DemoBanner";
import type { SiteConfig } from "@/lib/site-config-schema";
import siteConfig from "./site.config.json";

/* ═══════════════════════════════════════
   データ読み込み — site.config.json から取得
   ═══════════════════════════════════════ */
const config = siteConfig as SiteConfig;
const OFFICE = {
  name: config.company.nameEn || config.company.name,
  nameJa: config.company.name,
  tagline: config.company.tagline,
  subtitle: config.company.description,
  email: config.company.email,
  phone: config.company.phone,
  address: config.company.address,
  instagram: "@takahashi_design",
  bio: config.company.bio,
  ceo: config.company.ceo,
  title: config.company.ceoTitle || "",
  since: config.company.since,
  license: config.company.license || "",
  domain: config.company.domain,
};
const WORKS = config.projects.map((p) => ({
  id: p.id,
  title: p.titleEn || p.title,
  titleJa: p.title,
  year: p.year,
  type: p.category,
  desc: p.description,
  size: (p.size || "landscape") as "landscape" | "portrait" | "square",
}));

/* ─── SVG architectural illustrations ─── */
const archGradients = [
  ["#D4CFC5", "#C4B8A6"],
  ["#C8C2B5", "#B8AE96"],
  ["#D1CBC1", "#BFB7A5"],
  ["#CCC7BC", "#BAB2A0"],
  ["#D6D0C6", "#C6BDA9"],
  ["#C9C3B6", "#B5AD9A"],
  ["#D2CCC2", "#C0B8A6"],
  ["#CDCAB9", "#BDB5A3"],
];

function ArchIllustration({ index, className }: { index: number; className?: string }) {
  const [c1, c2] = archGradients[index % archGradients.length];
  const patterns = [
    // Pattern 0: Minimal house with large window
    <>
      <rect x="200" y="200" width="400" height="220" fill={c1} />
      <rect x="200" y="190" width="400" height="15" fill={c2} />
      <rect x="240" y="230" width="160" height="160" fill="white" opacity="0.4" />
      <line x1="320" y1="230" x2="320" y2="390" stroke={c2} strokeWidth="1.5" />
      <rect x="460" y="280" width="100" height="140" fill={c2} opacity="0.6" />
    </>,
    // Pattern 1: Multi-level structure
    <>
      <rect x="150" y="260" width="200" height="160" fill={c1} />
      <rect x="350" y="180" width="250" height="240" fill={c2} opacity="0.9" />
      <rect x="180" y="290" width="80" height="100" fill="white" opacity="0.35" />
      <rect x="390" y="210" width="60" height="80" fill="white" opacity="0.35" />
      <rect x="490" y="210" width="60" height="80" fill="white" opacity="0.35" />
      <rect x="350" y="310" width="100" height="110" fill="white" opacity="0.25" />
    </>,
    // Pattern 2: Horizontal villa
    <>
      <rect x="100" y="280" width="600" height="120" fill={c1} />
      <rect x="100" y="270" width="600" height="14" fill={c2} />
      <rect x="140" y="300" width="200" height="80" fill="white" opacity="0.4" />
      <line x1="240" y1="300" x2="240" y2="380" stroke={c1} strokeWidth="1" />
      <rect x="420" y="310" width="60" height="90" fill={c2} opacity="0.5" />
      <rect x="520" y="310" width="40" height="50" fill="white" opacity="0.3" />
    </>,
    // Pattern 3: Box composition
    <>
      <rect x="200" y="150" width="180" height="270" fill={c1} />
      <rect x="380" y="220" width="220" height="200" fill={c2} opacity="0.85" />
      <rect x="230" y="180" width="120" height="80" fill="white" opacity="0.4" />
      <rect x="410" y="250" width="80" height="60" fill="white" opacity="0.35" />
      <rect x="510" y="250" width="60" height="60" fill="white" opacity="0.35" />
    </>,
  ];

  return (
    <svg viewBox="0 0 800 500" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect width="800" height="500" fill="#EDEBE5" />
      <rect y="420" width="800" height="80" fill={c2} opacity="0.3" />
      {patterns[index % patterns.length]}
      {/* Minimal trees */}
      <circle cx={650 + (index % 3) * 20} cy={380} r={20 + (index % 2) * 8} fill={c2} opacity="0.25" />
    </svg>
  );
}

/* ═══════════════════════════════════════
   Header — Ultra minimal
   ═══════════════════════════════════════ */
function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-white/95 backdrop-blur-md" : "bg-transparent"
      }`}>
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 h-14 flex items-center justify-between">
          <a href="#" className={`text-sm font-light tracking-[0.25em] transition-colors ${scrolled ? "text-black" : "text-gray-400"}`}>
            {OFFICE.name}
          </a>

          <nav className="hidden md:flex items-center gap-8 text-xs tracking-[0.15em]">
            {[["WORKS","#works"],["ABOUT","#about"],["CONTACT","#contact"]].map(([label, href]) => (
              <a key={href} href={href} className={`transition-colors ${scrolled ? "text-gray-400 hover:text-black" : "text-gray-400 hover:text-gray-600"}`}>
                {label}
              </a>
            ))}
          </nav>

          <button onClick={() => setOpen(!open)} className="md:hidden text-xs tracking-[0.2em] text-gray-400 hover:text-black transition-colors">
            {open ? "CLOSE" : "MENU"}
          </button>
        </div>
        <div className={`w-full h-px transition-colors ${scrolled ? "bg-gray-100" : "bg-transparent"}`} />
      </header>

      {/* Fullscreen mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 bg-white flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <nav className="flex flex-col items-center gap-10">
              {[["WORKS","#works"],["ABOUT","#about"],["CONTACT","#contact"]].map(([label, href]) => (
                <a key={href} href={href} onClick={() => setOpen(false)} className="text-3xl font-light tracking-[0.2em] text-gray-800 hover:text-gray-400 transition-colors">
                  {label}
                </a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ═══════════════════════════════════════
   Hero — Full-screen typography
   ═══════════════════════════════════════ */
function HeroSection() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center px-6 py-24">
        <motion.p
          className="text-gray-300 text-[10px] tracking-[0.5em] mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
        >
          ARCHITECTURE + DESIGN
        </motion.p>

        <motion.h1
          className="text-gray-800 font-light leading-[1.5]"
          style={{ fontSize: "clamp(2.2rem, 7vw, 4.5rem)", letterSpacing: "0.08em" }}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          {OFFICE.tagline}
        </motion.h1>

        <motion.div
          className="w-12 h-px bg-gray-200 mx-auto my-8"
          initial={{ width: 0 }}
          animate={{ width: 48 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        />

        <motion.p
          className="text-gray-400 text-sm tracking-[0.1em] leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          {OFFICE.nameJa}
          <span className="mx-3 text-gray-200">|</span>
          {OFFICE.subtitle}
        </motion.p>

        <motion.div
          className="mt-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
        >
          <a href="#works" className="inline-flex flex-col items-center gap-3 text-gray-300 hover:text-gray-500 transition-colors">
            <span className="text-[10px] tracking-[0.4em]">SCROLL</span>
            <motion.div
              className="w-px h-10 bg-gray-200"
              animate={{ scaleY: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════
   Works — Grid + Fullscreen detail
   ═══════════════════════════════════════ */
function WorksSection() {
  const [selected, setSelected] = useState<number | null>(null);
  const [filter, setFilter] = useState("ALL");
  const types = ["ALL", "住宅", "店舗", "オフィス"];
  const filtered = filter === "ALL" ? WORKS : WORKS.filter((w) => w.type === filter);

  return (
    <section id="works" className="py-24 sm:py-32 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10">
        <motion.div
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-16 gap-6"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div>
            <p className="text-gray-300 text-[10px] tracking-[0.4em] mb-3">SELECTED WORKS</p>
            <h2 className="text-gray-800 text-2xl font-light tracking-[0.1em]">作品一覧</h2>
          </div>
          <div className="flex gap-4">
            {types.map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`text-xs tracking-[0.15em] transition-colors pb-1 ${
                  filter === t ? "text-gray-800 border-b border-gray-800" : "text-gray-300 hover:text-gray-500"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {filtered.map((w, i) => (
            <motion.div
              key={w.id}
              className={`group relative cursor-pointer overflow-hidden ${
                w.size === "portrait" ? "row-span-2" : ""
              }`}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.7, delay: i * 0.06 }}
              onClick={() => setSelected(filtered.indexOf(w))}
            >
              <div className={`${
                w.size === "portrait" ? "h-[400px] sm:h-[540px]" :
                w.size === "square" ? "h-[200px] sm:h-[260px]" :
                "h-[200px] sm:h-[260px]"
              } overflow-hidden`}>
                <ArchIllustration index={WORKS.indexOf(w)} className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700" />
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-500 flex items-end p-5 sm:p-6">
                <div className="translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  <p className="text-white text-sm sm:text-base font-light tracking-[0.1em]">{w.title}</p>
                  <p className="text-white/50 text-xs mt-1 tracking-wider">{w.type}　{w.year}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Fullscreen detail */}
      <AnimatePresence>
        {selected !== null && (
          <motion.div
            className="fixed inset-0 z-50 bg-white flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Top bar */}
            <div className="flex items-center justify-between px-6 sm:px-10 h-14 border-b border-gray-100">
              <p className="text-xs tracking-[0.2em] text-gray-300">
                {String(selected + 1).padStart(2, "0")} / {String(filtered.length).padStart(2, "0")}
              </p>
              <button onClick={() => setSelected(null)} className="text-xs tracking-[0.2em] text-gray-400 hover:text-black transition-colors">
                CLOSE
              </button>
            </div>

            <div className="flex-1 flex flex-col lg:flex-row overflow-y-auto">
              {/* Image */}
              <div className="lg:flex-1 min-h-[300px] lg:min-h-0">
                <ArchIllustration index={WORKS.indexOf(filtered[selected])} className="w-full h-full min-h-[300px]" />
              </div>

              {/* Info */}
              <div className="lg:w-[420px] p-8 sm:p-12 flex flex-col justify-center">
                <p className="text-gray-300 text-[10px] tracking-[0.4em] mb-5">{filtered[selected].type}</p>
                <h2 className="text-3xl font-light tracking-[0.08em] text-gray-800 mb-2">
                  {filtered[selected].title}
                </h2>
                <p className="text-gray-400 text-sm mb-8">{filtered[selected].titleJa}</p>

                <div className="w-8 h-px bg-gray-200 mb-8" />

                <p className="text-gray-500 text-sm leading-[2]">{filtered[selected].desc}</p>

                <div className="mt-6 text-gray-300 text-xs tracking-[0.15em]">{filtered[selected].year}</div>

                {/* Nav */}
                <div className="mt-auto pt-12 flex gap-6">
                  <button
                    onClick={() => setSelected(selected > 0 ? selected - 1 : filtered.length - 1)}
                    className="text-xs tracking-[0.2em] text-gray-300 hover:text-black transition-colors"
                  >
                    ← PREV
                  </button>
                  <button
                    onClick={() => setSelected(selected < filtered.length - 1 ? selected + 1 : 0)}
                    className="text-xs tracking-[0.2em] text-gray-300 hover:text-black transition-colors"
                  >
                    NEXT →
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ═══════════════════════════════════════
   About — Profile + Bio
   ═══════════════════════════════════════ */
function AboutSection() {
  return (
    <section id="about" className="py-24 sm:py-32 bg-white border-t border-gray-100">
      <div className="max-w-[1000px] mx-auto px-6 sm:px-10">
        <motion.p
          className="text-gray-300 text-[10px] tracking-[0.4em] mb-14"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          ABOUT
        </motion.p>

        <div className="grid md:grid-cols-2 gap-14 md:gap-20">
          {/* Portrait */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="w-full aspect-[3/4] bg-gradient-to-b from-[#E8E4DC] to-[#D4CFC5] overflow-hidden">
              <svg viewBox="0 0 400 530" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <rect width="400" height="530" fill="#E0DCD4" />
                {/* Stylized portrait */}
                <circle cx="200" cy="180" r="60" fill="#C4B8A6" />
                <ellipse cx="200" cy="370" rx="80" ry="100" fill="#C4B8A6" />
                {/* Architecture sketch in background */}
                <line x1="50" y1="480" x2="350" y2="480" stroke="#D4CFC5" strokeWidth="1" />
                <rect x="280" y="430" width="60" height="50" fill="#D4CFC5" opacity="0.5" />
                <text x="200" y="520" textAnchor="middle" fill="#B8AE96" fontSize="11" fontFamily="sans-serif" letterSpacing="0.2em">PORTRAIT</text>
              </svg>
            </div>
            <div className="mt-6">
              <h3 className="text-gray-800 text-xl font-light tracking-[0.1em]">{OFFICE.ceo}</h3>
              <p className="text-gray-400 text-xs tracking-[0.1em] mt-1.5">{OFFICE.title}</p>
            </div>
          </motion.div>

          {/* Bio + Info */}
          <motion.div
            className="flex flex-col justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
          >
            <div className="text-gray-600 text-sm leading-[2.4]">
              {OFFICE.bio.split("\n\n").map((para, i) => (
                <p key={i} className={i > 0 ? "mt-6" : ""}>{para}</p>
              ))}
            </div>

            <div className="w-8 h-px bg-gray-200 my-10" />

            <div className="space-y-4 text-xs text-gray-400">
              {[
                ["設立", `${OFFICE.since}年`],
                ["所在地", OFFICE.address],
                ["資格", OFFICE.title],
                ["登録", OFFICE.license],
              ].map(([label, value]) => (
                <div key={label} className="flex gap-8">
                  <span className="w-12 text-gray-300 flex-shrink-0">{label}</span>
                  <span>{value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════
   Contact — Minimal form
   ═══════════════════════════════════════ */
function ContactSection() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <section id="contact" className="py-24 sm:py-32 bg-white border-t border-gray-100">
      <div className="max-w-[700px] mx-auto px-6 sm:px-10">
        <motion.p
          className="text-gray-300 text-[10px] tracking-[0.4em] mb-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          CONTACT
        </motion.p>

        <motion.p
          className="text-gray-500 text-sm leading-relaxed mb-14"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          設計のご依頼・ご相談はお気軽にお問い合わせください。
          <br />
          住宅・店舗・オフィスなど、規模を問わず対応いたします。
        </motion.p>

        {/* Direct contacts */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 mb-14"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <a href={`mailto:${OFFICE.email}`} className="flex-1 flex items-center gap-3 py-4 px-5 border border-gray-200 text-gray-600 text-sm hover:bg-gray-50 hover:border-gray-300 transition-all">
            <Mail className="w-4 h-4 text-gray-300" strokeWidth={1.5} />
            {OFFICE.email}
          </a>
          <a href={`tel:${OFFICE.phone}`} className="flex-1 flex items-center gap-3 py-4 px-5 border border-gray-200 text-gray-600 text-sm hover:bg-gray-50 hover:border-gray-300 transition-all">
            <Phone className="w-4 h-4 text-gray-300" strokeWidth={1.5} />
            {OFFICE.phone}
          </a>
        </motion.div>

        {/* Form */}
        {submitted ? (
          <motion.div
            className="text-center py-16 border border-gray-100"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-12 h-12 border border-gray-200 flex items-center justify-center mx-auto mb-4">
              <Check className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-gray-800 text-base font-light tracking-wider mb-2">送信ありがとうございます</p>
            <p className="text-gray-400 text-xs tracking-wider">3営業日以内にご返信いたします。</p>
          </motion.div>
        ) : (
          <motion.form
            onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
            className="space-y-6"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="grid sm:grid-cols-2 gap-6">
              {[
                { id: "name", label: "お名前", placeholder: "高橋 花子", required: true },
                { id: "email", label: "メールアドレス", placeholder: "hello@example.com", required: true },
              ].map((f) => (
                <div key={f.id}>
                  <label className="block text-[10px] text-gray-300 tracking-[0.2em] mb-2">{f.label}</label>
                  <input
                    type={f.id === "email" ? "email" : "text"}
                    required={f.required}
                    placeholder={f.placeholder}
                    className="w-full px-0 py-3 border-0 border-b border-gray-200 text-gray-800 text-sm placeholder:text-gray-300 focus:outline-none focus:border-gray-800 transition-colors bg-transparent"
                  />
                </div>
              ))}
            </div>

            <div>
              <label className="block text-[10px] text-gray-300 tracking-[0.2em] mb-2">ご相談の種類</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {["住宅の設計", "店舗の設計", "オフィスの設計", "リノベーション", "その他"].map((type) => (
                  <label key={type} className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 text-xs text-gray-500 cursor-pointer hover:border-gray-400 transition-colors has-[:checked]:bg-gray-800 has-[:checked]:text-white has-[:checked]:border-gray-800">
                    <input type="radio" name="type" value={type} className="sr-only" />
                    {type}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[10px] text-gray-300 tracking-[0.2em] mb-2">ご相談内容</label>
              <textarea
                rows={5}
                placeholder="ご計画の概要、敷地の場所、ご予算、ご希望の時期などをお聞かせください。"
                className="w-full px-0 py-3 border-0 border-b border-gray-200 text-gray-800 text-sm placeholder:text-gray-300 focus:outline-none focus:border-gray-800 transition-colors bg-transparent resize-none"
              />
            </div>

            <div className="pt-4">
              <button type="submit" className="w-full py-4 bg-gray-800 text-white text-xs tracking-[0.2em] hover:bg-gray-700 transition-colors">
                SEND MESSAGE
              </button>
            </div>

            <p className="text-gray-300 text-[10px] tracking-wider text-center">
              ※ 3営業日以内にご返信いたします
            </p>
          </motion.form>
        )}

        {/* Social */}
        <div className="mt-16 flex items-center gap-6 text-gray-300">
          <a href="#" className="flex items-center gap-1.5 text-xs tracking-[0.15em] hover:text-gray-600 transition-colors">
            <Camera className="w-3.5 h-3.5" /> Instagram
          </a>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════
   Footer
   ═══════════════════════════════════════ */
function Footer() {
  return (
    <footer className="py-10 border-t border-gray-100 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="text-xs font-light tracking-[0.25em] text-gray-400">{OFFICE.name}</p>
          <p className="text-[10px] text-gray-300 tracking-wider mt-0.5">{OFFICE.address}</p>
        </div>
        <p className="text-[10px] text-gray-300 tracking-wider">
          © {new Date().getFullYear()} {OFFICE.nameJa}
        </p>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════
   Page
   ═══════════════════════════════════════ */
export default function CleanArchPage() {
  return (
    <>
      <DemoBanner />
      <Header />
      <main>
        <HeroSection />
        <WorksSection />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
