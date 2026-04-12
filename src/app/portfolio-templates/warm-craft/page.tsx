"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  X,
  Menu,
  Shield,
  Home,
  Hammer,
  Users,
  ChevronLeft,
  ChevronRight,
  Send,
  Check,
} from "lucide-react";
import DemoBanner from "@/components/portfolio-templates/DemoBanner";
import type { SiteConfig } from "@/lib/site-config-schema";
import siteConfig from "./site.config.json";

/* ═══════════════════════════════════════
   データ読み込み — site.config.json から取得
   顧客サイトではこのJSONが顧客データに差し替わる
   ═══════════════════════════════════════ */

/* アイコンマッピング（JSONではコンポーネントを保存できないため） */
const ICON_MAP: Record<string, typeof Home> = { Home, Shield, Hammer, Users };

/* 施工実績のカラーパレット（SVGイラスト用） */
const PROJECT_COLORS = [
  { from: "#C4B5A0", to: "#A69279", accent: "#8B7355" },
  { from: "#7BA23F", to: "#5A7A2D", accent: "#4A6741" },
  { from: "#D4A76A", to: "#B8894A", accent: "#A07D4F" },
  { from: "#8B7D6B", to: "#6B5D4B", accent: "#5C4F3D" },
  { from: "#6B8E4E", to: "#4A6E33", accent: "#3D5A29" },
  { from: "#B8A088", to: "#9A826A", accent: "#7D6A55" },
];

const config = siteConfig as SiteConfig;
const COMPANY = config.company;
const PROJECTS = config.projects.map((p, i) => ({
  ...p,
  desc: p.description,
  colors: PROJECT_COLORS[i % PROJECT_COLORS.length],
}));
const STRENGTHS = config.strengths.map((s) => ({
  ...s,
  desc: s.description,
  icon: ICON_MAP[s.icon || "Home"] || Home,
}));

/* ═══════════════════════════════════════
   SVG Image Placeholders — リアルな建築イメージ
   ═══════════════════════════════════════ */
function HouseIllustration({ colors, className }: { colors: { from: string; to: string; accent: string }; className?: string }) {
  return (
    <svg viewBox="0 0 800 500" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`sky-${colors.from}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E8E4DC" />
          <stop offset="100%" stopColor="#D4CFC5" />
        </linearGradient>
      </defs>
      {/* Sky */}
      <rect width="800" height="500" fill={`url(#sky-${colors.from})`} />
      {/* Ground */}
      <rect y="350" width="800" height="150" fill="#C5BDA8" />
      <rect y="350" width="800" height="4" fill="#B8AE96" />
      {/* House body */}
      <rect x="180" y="180" width="440" height="170" fill={colors.from} rx="2" />
      {/* Roof */}
      <polygon points="150,185 400,60 650,185" fill={colors.accent} />
      <polygon points="160,185 400,70 640,185" fill={colors.to} />
      {/* Door */}
      <rect x="360" y="250" width="80" height="100" fill={colors.accent} rx="2" />
      <circle cx="425" cy="300" r="4" fill="#D4CFC5" />
      {/* Windows */}
      <rect x="220" y="220" width="90" height="70" fill="#F5F0E8" rx="2" stroke={colors.accent} strokeWidth="3" />
      <line x1="265" y1="220" x2="265" y2="290" stroke={colors.accent} strokeWidth="2" />
      <line x1="220" y1="255" x2="310" y2="255" stroke={colors.accent} strokeWidth="2" />
      <rect x="490" y="220" width="90" height="70" fill="#F5F0E8" rx="2" stroke={colors.accent} strokeWidth="3" />
      <line x1="535" y1="220" x2="535" y2="290" stroke={colors.accent} strokeWidth="2" />
      <line x1="490" y1="255" x2="580" y2="255" stroke={colors.accent} strokeWidth="2" />
      {/* Chimney */}
      <rect x="500" y="80" width="40" height="70" fill={colors.accent} />
      {/* Trees */}
      <circle cx="100" cy="280" r="50" fill="#7BA23F" opacity="0.8" />
      <rect x="95" y="310" width="10" height="40" fill="#8B7355" />
      <circle cx="720" cy="290" r="40" fill="#6B8E4E" opacity="0.8" />
      <rect x="716" y="315" width="8" height="35" fill="#8B7355" />
      {/* Path */}
      <path d="M 370 350 L 340 500 L 460 500 L 430 350" fill="#D4CFC5" />
    </svg>
  );
}

function HeroIllustration() {
  return (
    <svg viewBox="0 0 1200 700" className="w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="heroSky" x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0%" stopColor="#8B7D6B" />
          <stop offset="50%" stopColor="#6B8E4E" />
          <stop offset="100%" stopColor="#4A6741" />
        </linearGradient>
        <linearGradient id="heroGround" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C5BDA8" />
          <stop offset="100%" stopColor="#A69279" />
        </linearGradient>
      </defs>
      {/* Background */}
      <rect width="1200" height="700" fill="url(#heroSky)" />
      {/* Mountains */}
      <polygon points="0,450 200,200 400,380 600,250 800,350 1000,180 1200,400 1200,700 0,700" fill="#5A7A2D" opacity="0.3" />
      <polygon points="0,500 300,300 500,420 700,320 900,400 1200,350 1200,700 0,700" fill="#4A6741" opacity="0.4" />
      {/* Ground */}
      <rect y="520" width="1200" height="180" fill="url(#heroGround)" />
      {/* Modern house */}
      <rect x="300" y="320" width="600" height="200" fill="#F5F0E8" rx="3" />
      <rect x="300" y="310" width="600" height="15" fill="#8B7355" />
      {/* House shadow */}
      <rect x="310" y="520" width="580" height="15" fill="#B8AE96" opacity="0.5" />
      {/* Large window */}
      <rect x="340" y="350" width="200" height="150" fill="#A8C5D8" rx="2" opacity="0.7" />
      <line x1="440" y1="350" x2="440" y2="500" stroke="#F5F0E8" strokeWidth="3" />
      {/* Door */}
      <rect x="600" y="370" width="80" height="150" fill="#D4A76A" rx="2" />
      <circle cx="665" cy="445" r="5" fill="#8B7355" />
      {/* Small windows */}
      <rect x="730" y="360" width="70" height="60" fill="#A8C5D8" rx="2" opacity="0.6" />
      <rect x="830" y="360" width="40" height="60" fill="#A8C5D8" rx="2" opacity="0.6" />
      {/* Deck */}
      <rect x="300" y="510" width="250" height="15" fill="#C4A97D" />
      {/* Trees */}
      <ellipse cx="150" cy="400" rx="70" ry="90" fill="#6B8E4E" opacity="0.7" />
      <rect x="145" y="470" width="10" height="50" fill="#8B7355" />
      <ellipse cx="1050" cy="420" rx="55" ry="70" fill="#7BA23F" opacity="0.6" />
      <rect x="1046" y="475" width="8" height="45" fill="#8B7355" />
      <ellipse cx="1120" cy="440" rx="40" ry="55" fill="#5A7A2D" opacity="0.5" />
      {/* Garden elements */}
      <circle cx="220" cy="510" r="15" fill="#7BA23F" opacity="0.5" />
      <circle cx="260" cy="505" r="12" fill="#6B8E4E" opacity="0.5" />
      {/* Clouds */}
      <ellipse cx="200" cy="100" rx="80" ry="25" fill="white" opacity="0.15" />
      <ellipse cx="800" cy="80" rx="100" ry="30" fill="white" opacity="0.12" />
    </svg>
  );
}

/* ═══════════════════════════════════════
   Header — 固定ヘッダー + 電話ボタン
   ═══════════════════════════════════════ */
function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const navItems = [
    { label: "施工実績", href: "#works" },
    { label: "私たちの強み", href: "#strength" },
    { label: "会社案内", href: "#about" },
    { label: "お問い合わせ", href: "#contact" },
  ];

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-[#FAF7F2]/95 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}>
        <div className="max-w-[1200px] mx-auto px-5 h-16 flex items-center justify-between">
          <a href="#" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#7BA23F] flex items-center justify-center shadow-sm">
              <Home className="w-4.5 h-4.5 text-white" strokeWidth={2} />
            </div>
            <div>
              <p className={`font-bold text-sm tracking-wide transition-colors ${scrolled ? "text-[#3D3226]" : "text-white"}`}>{COMPANY.name}</p>
              <p className={`text-[9px] tracking-wider transition-colors ${scrolled ? "text-[#8B7D6B]" : "text-white/60"}`}>since {COMPANY.since}</p>
            </div>
          </a>

          <nav className="hidden lg:flex items-center gap-6">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className={`text-sm transition-colors ${scrolled ? "text-[#8B7D6B] hover:text-[#7BA23F]" : "text-white/80 hover:text-white"}`}>
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={`tel:${COMPANY.phone}`}
              className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#7BA23F] text-white text-sm font-medium hover:bg-[#5C7A2E] transition-colors shadow-sm"
            >
              <Phone className="w-3.5 h-3.5" />
              <span className="tracking-wider">{COMPANY.phone}</span>
            </a>

            <button onClick={() => setOpen(!open)} className="lg:hidden p-2" aria-label="メニュー">
              {open ? (
                <X className={`w-5 h-5 ${scrolled ? "text-[#3D3226]" : "text-white"}`} />
              ) : (
                <Menu className={`w-5 h-5 ${scrolled ? "text-[#3D3226]" : "text-white"}`} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {open && (
            <motion.div
              className="lg:hidden bg-[#FAF7F2] border-t border-[#E8DFD3] px-5 py-5 space-y-1"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 px-4 text-[#3D3226] text-base rounded-lg hover:bg-[#7BA23F]/5 transition-colors"
                >
                  {item.label}
                </a>
              ))}
              <a
                href={`tel:${COMPANY.phone}`}
                className="block mt-3 text-center py-3.5 rounded-lg bg-[#7BA23F] text-white font-medium"
              >
                <Phone className="w-4 h-4 inline mr-2" />{COMPANY.phone}
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* SP fixed bottom phone bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#7BA23F] safe-area-bottom">
        <a href={`tel:${COMPANY.phone}`} className="flex items-center justify-center gap-2 py-3.5 text-white font-bold text-base">
          <Phone className="w-5 h-5" /> 今すぐ電話で相談
        </a>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════
   Hero — パララックス + SVGイラスト
   ═══════════════════════════════════════ */
function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} className="relative h-screen min-h-[600px] max-h-[900px] overflow-hidden">
      {/* Background illustration */}
      <motion.div className="absolute inset-0" style={{ y }}>
        <HeroIllustration />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/10" />
      </motion.div>

      <motion.div
        className="relative z-10 h-full flex flex-col justify-end max-w-[1200px] mx-auto px-5 pb-20 sm:pb-24"
        style={{ opacity }}
      >
        {/* Since badge */}
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 w-fit mb-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-[#7BA23F]" />
          <span className="text-white/80 text-xs tracking-wider">創業{new Date().getFullYear() - parseInt(COMPANY.since)}年の実績</span>
        </motion.div>

        <motion.h1
          className="text-white font-bold leading-[1.25] mb-4"
          style={{ fontSize: "clamp(1.8rem, 5vw, 3.2rem)" }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
        >
          {COMPANY.tagline}
        </motion.h1>

        <motion.p
          className="text-white/75 text-sm sm:text-base max-w-[560px] leading-relaxed mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {COMPANY.description}
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <a href="#contact" className="px-8 py-3.5 rounded-lg bg-[#7BA23F] text-white font-medium text-sm hover:bg-[#5C7A2E] transition-colors text-center shadow-lg shadow-[#7BA23F]/20">
            無料相談・お見積り
          </a>
          <a href="#works" className="px-8 py-3.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/25 text-white text-sm hover:bg-white/20 transition-colors text-center">
            施工実績を見る →
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 hidden sm:flex flex-col items-center gap-2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="text-white/40 text-[10px] tracking-[0.3em]">SCROLL</span>
        <div className="w-px h-8 bg-gradient-to-b from-white/40 to-transparent" />
      </motion.div>
    </section>
  );
}

/* ═══════════════════════════════════════
   Works (施工実績) — カード + ライトボックス
   ═══════════════════════════════════════ */
function WorksSection() {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [filter, setFilter] = useState("すべて");
  const categories = ["すべて", "新築", "リフォーム"];
  const filtered = filter === "すべて" ? PROJECTS : PROJECTS.filter((p) => p.category === filter);

  return (
    <section id="works" className="py-20 sm:py-28 bg-[#FAF7F2]">
      <div className="max-w-[1200px] mx-auto px-5">
        {/* Heading */}
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-[#7BA23F] text-xs tracking-[0.3em] mb-2 font-medium">WORKS</p>
          <h2 className="text-[#3D3226] font-bold text-2xl sm:text-3xl mb-3">施工実績</h2>
          <p className="text-[#8B7D6B] text-sm">心を込めてつくりあげた、家族の住まい。</p>
        </motion.div>

        {/* Filter */}
        <div className="flex justify-center gap-2 mb-10">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`px-5 py-2 rounded-full text-sm transition-all ${
                filter === c
                  ? "bg-[#7BA23F] text-white shadow-sm"
                  : "bg-white text-[#8B7D6B] border border-[#E8DFD3] hover:border-[#7BA23F]/30"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p, i) => (
            <motion.div
              key={p.id}
              className="group cursor-pointer rounded-2xl overflow-hidden bg-white border border-[#E8DFD3] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              onClick={() => setLightbox(i)}
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <HouseIllustration colors={p.colors} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs font-medium text-[#3D3226] shadow-sm">
                  {p.category}
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              </div>

              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-[#3D3226] text-base">{p.title}</h3>
                  <span className="text-[#8B7D6B] text-xs">{p.year}</span>
                </div>
                <p className="text-[#8B7D6B] text-sm leading-relaxed line-clamp-2">{p.desc}</p>
                <p className="mt-3 text-[#7BA23F] text-xs font-medium">詳しく見る →</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
          >
            <motion.div
              className="bg-white rounded-2xl max-w-[700px] w-full overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close */}
              <button onClick={() => setLightbox(null)} className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-sm hover:bg-white">
                <X className="w-4 h-4 text-[#3D3226]" />
              </button>

              <div className="h-72 sm:h-80">
                <HouseIllustration colors={filtered[lightbox].colors} className="w-full h-full" />
              </div>

              <div className="p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-3 py-1 rounded-full bg-[#7BA23F]/10 text-[#7BA23F] text-xs font-medium">{filtered[lightbox].category}</span>
                  <span className="text-[#8B7D6B] text-xs">{filtered[lightbox].year}</span>
                </div>
                <h3 className="font-bold text-[#3D3226] text-xl sm:text-2xl mb-3">{filtered[lightbox].title}</h3>
                <p className="text-[#8B7D6B] text-sm leading-relaxed mb-4">{filtered[lightbox].desc}</p>
                <div className="px-4 py-3 rounded-lg bg-[#FAF7F2] border border-[#E8DFD3]">
                  <p className="text-[#8B7D6B] text-xs mb-1">施工概要</p>
                  <p className="text-[#3D3226] text-sm font-medium">{filtered[lightbox].specs}</p>
                </div>
              </div>

              {/* Nav */}
              <div className="flex border-t border-[#E8DFD3]">
                <button
                  className="flex-1 py-4 text-sm text-[#8B7D6B] hover:bg-[#FAF7F2] transition-colors flex items-center justify-center gap-2"
                  onClick={() => setLightbox(lightbox > 0 ? lightbox - 1 : filtered.length - 1)}
                >
                  <ChevronLeft className="w-4 h-4" /> 前の実績
                </button>
                <div className="w-px bg-[#E8DFD3]" />
                <button
                  className="flex-1 py-4 text-sm text-[#8B7D6B] hover:bg-[#FAF7F2] transition-colors flex items-center justify-center gap-2"
                  onClick={() => setLightbox(lightbox < filtered.length - 1 ? lightbox + 1 : 0)}
                >
                  次の実績 <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ═══════════════════════════════════════
   Strengths (私たちの強み)
   ═══════════════════════════════════════ */
function StrengthsSection() {
  return (
    <section id="strength" className="py-20 sm:py-28 bg-white">
      <div className="max-w-[1000px] mx-auto px-5">
        <motion.div className="text-center mb-14" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-[#7BA23F] text-xs tracking-[0.3em] mb-2 font-medium">STRENGTH</p>
          <h2 className="text-[#3D3226] font-bold text-2xl sm:text-3xl mb-3">私たちの強み</h2>
          <p className="text-[#8B7D6B] text-sm">大手にはできない、工務店だからこそできること。</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-6">
          {STRENGTHS.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={i}
                className="p-7 rounded-2xl bg-[#FAF7F2] border border-[#E8DFD3] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-[#7BA23F]/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-7 h-7 text-[#7BA23F]" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#3D3226] text-base mb-2">{s.title}</h3>
                    <p className="text-[#8B7D6B] text-sm leading-[1.9]">{s.desc}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════
   About (会社案内) — 代表挨拶 + 会社概要
   ═══════════════════════════════════════ */
function AboutSection() {
  return (
    <section id="about" className="py-20 sm:py-28 bg-[#FAF7F2]">
      <div className="max-w-[1000px] mx-auto px-5">
        <motion.div className="text-center mb-14" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-[#7BA23F] text-xs tracking-[0.3em] mb-2 font-medium">ABOUT</p>
          <h2 className="text-[#3D3226] font-bold text-2xl sm:text-3xl">会社案内</h2>
        </motion.div>

        {/* CEO message */}
        <motion.div
          className="bg-white rounded-2xl border border-[#E8DFD3] overflow-hidden mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="p-8 sm:p-10">
            <p className="text-[#7BA23F] text-xs tracking-[0.2em] mb-4 font-medium">代表挨拶</p>

            {/* CEO portrait placeholder */}
            <div className="float-right ml-6 mb-4 hidden sm:block">
              <div className="w-[160px] h-[200px] rounded-xl bg-gradient-to-b from-[#D4CFC5] to-[#C4B5A0] overflow-hidden">
                <svg viewBox="0 0 160 200" xmlns="http://www.w3.org/2000/svg">
                  <rect width="160" height="200" fill="#D4CFC5" />
                  <circle cx="80" cy="70" r="30" fill="#B8AE96" />
                  <ellipse cx="80" cy="160" rx="50" ry="45" fill="#B8AE96" />
                  <text x="80" y="195" textAnchor="middle" fill="#8B7D6B" fontSize="10" fontFamily="sans-serif">代表写真</text>
                </svg>
              </div>
              <p className="text-center text-[#8B7D6B] text-xs mt-2">代表　{COMPANY.ceo}</p>
            </div>

            <div className="text-[#3D3226] text-sm sm:text-base leading-[2.2]">
              {COMPANY.bio.split("\n\n").map((para, i) => (
                <p key={i} className={i > 0 ? "mt-5" : ""}>{para}</p>
              ))}
            </div>

            <p className="sm:hidden text-[#8B7D6B] text-sm mt-6">代表　{COMPANY.ceo}</p>
          </div>
        </motion.div>

        {/* Company info table */}
        <motion.div
          className="bg-white rounded-2xl border border-[#E8DFD3] overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="p-5 sm:p-6 bg-[#FAF7F2] border-b border-[#E8DFD3]">
            <h3 className="text-[#3D3226] font-bold text-base">会社概要</h3>
          </div>
          <div className="divide-y divide-[#E8DFD3]">
            {[
              ["商号", COMPANY.name],
              ["代表者", COMPANY.ceo],
              ["設立", `${COMPANY.since}年`],
              ["所在地", COMPANY.address],
              ["電話番号", COMPANY.phone],
              ["メール", COMPANY.email],
              ["営業時間", COMPANY.hours],
              ["許認可", COMPANY.license],
              ["Webサイト", COMPANY.domain],
            ].map(([label, value]) => (
              <div key={label} className="flex flex-col sm:flex-row">
                <div className="sm:w-40 px-6 py-3 sm:py-4 bg-[#FDFCFA] text-[#8B7D6B] text-sm font-medium">{label}</div>
                <div className="flex-1 px-6 py-3 sm:py-4 text-[#3D3226] text-sm">{value}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════
   Contact — フォーム + 電話CTA + 地図エリア
   ═══════════════════════════════════════ */
function ContactSection() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <section id="contact" className="py-20 sm:py-28 bg-white">
      <div className="max-w-[900px] mx-auto px-5">
        <motion.div className="text-center mb-14" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-[#7BA23F] text-xs tracking-[0.3em] mb-2 font-medium">CONTACT</p>
          <h2 className="text-[#3D3226] font-bold text-2xl sm:text-3xl mb-3">お問い合わせ</h2>
          <p className="text-[#8B7D6B] text-sm">家づくりのこと、まずはお気軽にご相談ください。お見積りは無料です。</p>
        </motion.div>

        {/* Phone CTA */}
        <motion.div
          className="text-center mb-12 p-8 rounded-2xl bg-gradient-to-br from-[#7BA23F]/5 to-[#7BA23F]/10 border border-[#7BA23F]/20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-[#7BA23F] text-xs tracking-wider mb-3 font-medium">お電話でのお問い合わせ</p>
          <a
            href={`tel:${COMPANY.phone}`}
            className="inline-block text-[#3D3226] text-3xl sm:text-4xl font-bold tracking-wider hover:text-[#7BA23F] transition-colors"
          >
            {COMPANY.phone}
          </a>
          <p className="text-[#8B7D6B] text-xs mt-2">{COMPANY.hours}</p>
        </motion.div>

        {/* Contact form */}
        <motion.div
          className="bg-white rounded-2xl border border-[#E8DFD3] shadow-sm overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="p-5 sm:p-6 bg-[#FAF7F2] border-b border-[#E8DFD3]">
            <h3 className="text-[#3D3226] font-bold text-base">メールでのお問い合わせ</h3>
          </div>

          {submitted ? (
            <div className="p-10 text-center">
              <div className="w-14 h-14 rounded-full bg-[#7BA23F]/10 flex items-center justify-center mx-auto mb-4">
                <Check className="w-7 h-7 text-[#7BA23F]" />
              </div>
              <p className="text-[#3D3226] text-lg font-bold mb-2">送信ありがとうございます</p>
              <p className="text-[#8B7D6B] text-sm">2営業日以内にご連絡いたします。</p>
            </div>
          ) : (
            <form
              onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
              className="p-6 sm:p-8 space-y-5"
            >
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs text-[#8B7D6B] mb-2 font-medium">
                    お名前 <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 rounded-lg bg-[#FAF7F2] border border-[#E8DFD3] text-[#3D3226] text-sm placeholder:text-[#C4B5A0] focus:outline-none focus:border-[#7BA23F] focus:ring-2 focus:ring-[#7BA23F]/10 transition-all"
                    placeholder="山田 花子"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#8B7D6B] mb-2 font-medium">
                    電話番号
                  </label>
                  <input
                    type="tel"
                    className="w-full px-4 py-3 rounded-lg bg-[#FAF7F2] border border-[#E8DFD3] text-[#3D3226] text-sm placeholder:text-[#C4B5A0] focus:outline-none focus:border-[#7BA23F] focus:ring-2 focus:ring-[#7BA23F]/10 transition-all"
                    placeholder="090-1234-5678"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-[#8B7D6B] mb-2 font-medium">
                  メールアドレス <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-[#FAF7F2] border border-[#E8DFD3] text-[#3D3226] text-sm placeholder:text-[#C4B5A0] focus:outline-none focus:border-[#7BA23F] focus:ring-2 focus:ring-[#7BA23F]/10 transition-all"
                  placeholder="example@email.com"
                />
              </div>

              <div>
                <label className="block text-xs text-[#8B7D6B] mb-2 font-medium">
                  お問い合わせ種別
                </label>
                <div className="flex flex-wrap gap-2">
                  {["新築のご相談", "リフォームのご相談", "お見積り依頼", "その他"].map((type) => (
                    <label key={type} className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#E8DFD3] text-sm text-[#3D3226] cursor-pointer hover:border-[#7BA23F]/30 hover:bg-[#7BA23F]/5 transition-all has-[:checked]:bg-[#7BA23F]/10 has-[:checked]:border-[#7BA23F]/30 has-[:checked]:text-[#7BA23F]">
                      <input type="radio" name="type" value={type} className="sr-only" />
                      {type}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs text-[#8B7D6B] mb-2 font-medium">
                  ご相談内容
                </label>
                <textarea
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg bg-[#FAF7F2] border border-[#E8DFD3] text-[#3D3226] text-sm placeholder:text-[#C4B5A0] focus:outline-none focus:border-[#7BA23F] focus:ring-2 focus:ring-[#7BA23F]/10 transition-all resize-none"
                  placeholder="ご予算、ご希望の時期、土地の有無など、わかる範囲でお気軽にお書きください。"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-4 rounded-lg bg-[#7BA23F] text-white font-bold text-sm tracking-wider hover:bg-[#5C7A2E] transition-colors shadow-sm"
              >
                <Send className="w-4 h-4" />
                送信する
              </button>

              <p className="text-[#8B7D6B] text-xs text-center">
                ※ 通常2営業日以内にご返信いたします
              </p>
            </form>
          )}
        </motion.div>

        {/* Info cards */}
        <div className="grid sm:grid-cols-3 gap-4 mt-10">
          {[
            { icon: MapPin, label: "所在地", value: COMPANY.address },
            { icon: Mail, label: "メール", value: COMPANY.email },
            { icon: Clock, label: "営業時間", value: COMPANY.hours },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={i}
                className="text-center p-5 rounded-xl bg-[#FAF7F2] border border-[#E8DFD3]"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Icon className="w-5 h-5 text-[#7BA23F] mx-auto mb-2" strokeWidth={1.5} />
                <p className="text-[#8B7D6B] text-xs mb-1">{item.label}</p>
                <p className="text-[#3D3226] text-sm font-medium">{item.value}</p>
              </motion.div>
            );
          })}
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
    <footer className="py-10 bg-[#3D3226] pb-24 md:pb-10">
      <div className="max-w-[1200px] mx-auto px-5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8 pb-8 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#7BA23F] flex items-center justify-center">
              <Home className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-sm">{COMPANY.name}</p>
              <p className="text-white/40 text-[9px] tracking-wider">since {COMPANY.since}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-5">
            {["施工実績", "私たちの強み", "会社案内", "お問い合わせ"].map((label) => (
              <a key={label} href={`#${label === "施工実績" ? "works" : label === "私たちの強み" ? "strength" : label === "会社案内" ? "about" : "contact"}`} className="text-white/50 text-xs hover:text-white transition-colors">
                {label}
              </a>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-white/30 text-xs">
          <p>〒000-0000 {COMPANY.address}</p>
          <p>© {new Date().getFullYear()} {COMPANY.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════
   Page
   ═══════════════════════════════════════ */
export default function WarmCraftPage() {
  return (
    <>
      <DemoBanner />
      <Header />
      <main>
        <HeroSection />
        <WorksSection />
        <StrengthsSection />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
