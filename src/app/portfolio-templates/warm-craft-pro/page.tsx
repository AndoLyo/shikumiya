"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  Phone, Mail, MapPin, Clock, X, Menu, Shield, Home, Hammer, Users,
  ChevronLeft, ChevronRight, Send, Check, Star, Quote, Calendar,
  ArrowRight, Newspaper, Tag, MessageCircle, Bot, BarChart3, TrendingUp,
  Eye, MousePointer, Download, Bell, Video,
} from "lucide-react";
import Script from "next/script";
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
const TESTIMONIALS = config.testimonials || [];
const NEWS = config.news || [];

/* ─── SVG reuse from Lite ─── */
function HouseIllustration({ colors, className }: { colors: { from: string; to: string; accent: string }; className?: string }) {
  return (
    <svg viewBox="0 0 800 500" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id={`sky-m-${colors.from}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#E8E4DC" /><stop offset="100%" stopColor="#D4CFC5" /></linearGradient></defs>
      <rect width="800" height="500" fill={`url(#sky-m-${colors.from})`} />
      <rect y="350" width="800" height="150" fill="#C5BDA8" />
      <rect y="350" width="800" height="4" fill="#B8AE96" />
      <rect x="180" y="180" width="440" height="170" fill={colors.from} rx="2" />
      <polygon points="150,185 400,60 650,185" fill={colors.accent} />
      <polygon points="160,185 400,70 640,185" fill={colors.to} />
      <rect x="360" y="250" width="80" height="100" fill={colors.accent} rx="2" />
      <circle cx="425" cy="300" r="4" fill="#D4CFC5" />
      <rect x="220" y="220" width="90" height="70" fill="#F5F0E8" rx="2" stroke={colors.accent} strokeWidth="3" />
      <line x1="265" y1="220" x2="265" y2="290" stroke={colors.accent} strokeWidth="2" />
      <line x1="220" y1="255" x2="310" y2="255" stroke={colors.accent} strokeWidth="2" />
      <rect x="490" y="220" width="90" height="70" fill="#F5F0E8" rx="2" stroke={colors.accent} strokeWidth="3" />
      <line x1="535" y1="220" x2="535" y2="290" stroke={colors.accent} strokeWidth="2" />
      <line x1="490" y1="255" x2="580" y2="255" stroke={colors.accent} strokeWidth="2" />
      <circle cx="100" cy="280" r="50" fill="#7BA23F" opacity="0.8" />
      <rect x="95" y="310" width="10" height="40" fill="#8B7355" />
      <circle cx="720" cy="290" r="40" fill="#6B8E4E" opacity="0.8" />
      <rect x="716" y="315" width="8" height="35" fill="#8B7355" />
      <path d="M 370 350 L 340 500 L 460 500 L 430 350" fill="#D4CFC5" />
    </svg>
  );
}

function HeroIllustration() {
  return (
    <svg viewBox="0 0 1200 700" className="w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
      <defs><linearGradient id="heroSkyM" x1="0" y1="0" x2="0.3" y2="1"><stop offset="0%" stopColor="#8B7D6B" /><stop offset="50%" stopColor="#6B8E4E" /><stop offset="100%" stopColor="#4A6741" /></linearGradient><linearGradient id="heroGroundM" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#C5BDA8" /><stop offset="100%" stopColor="#A69279" /></linearGradient></defs>
      <rect width="1200" height="700" fill="url(#heroSkyM)" />
      <polygon points="0,450 200,200 400,380 600,250 800,350 1000,180 1200,400 1200,700 0,700" fill="#5A7A2D" opacity="0.3" />
      <polygon points="0,500 300,300 500,420 700,320 900,400 1200,350 1200,700 0,700" fill="#4A6741" opacity="0.4" />
      <rect y="520" width="1200" height="180" fill="url(#heroGroundM)" />
      <rect x="300" y="320" width="600" height="200" fill="#F5F0E8" rx="3" />
      <rect x="300" y="310" width="600" height="15" fill="#8B7355" />
      <rect x="340" y="350" width="200" height="150" fill="#A8C5D8" rx="2" opacity="0.7" />
      <line x1="440" y1="350" x2="440" y2="500" stroke="#F5F0E8" strokeWidth="3" />
      <rect x="600" y="370" width="80" height="150" fill="#D4A76A" rx="2" />
      <circle cx="665" cy="445" r="5" fill="#8B7355" />
      <rect x="730" y="360" width="70" height="60" fill="#A8C5D8" rx="2" opacity="0.6" />
      <ellipse cx="150" cy="400" rx="70" ry="90" fill="#6B8E4E" opacity="0.7" />
      <rect x="145" y="470" width="10" height="50" fill="#8B7355" />
      <ellipse cx="1050" cy="420" rx="55" ry="70" fill="#7BA23F" opacity="0.6" />
      <rect x="1046" y="475" width="8" height="45" fill="#8B7355" />
      <ellipse cx="200" cy="100" rx="80" ry="25" fill="white" opacity="0.15" />
    </svg>
  );
}

/* ═══════════════════════════════════════
   Header
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
    { label: "お客様の声", href: "#testimonials" },
    { label: "私たちの強み", href: "#strength" },
    { label: "お知らせ", href: "#news" },
    { label: "会社案内", href: "#about" },
    { label: "お問い合わせ", href: "#contact" },
  ];

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-[#FAF7F2]/95 backdrop-blur-md shadow-sm" : "bg-transparent"}`}>
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

          <nav className="hidden xl:flex items-center gap-5">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className={`text-xs transition-colors ${scrolled ? "text-[#8B7D6B] hover:text-[#7BA23F]" : "text-white/80 hover:text-white"}`}>{item.label}</a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a href={`tel:${COMPANY.phone}`} className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#7BA23F] text-white text-sm font-medium hover:bg-[#5C7A2E] transition-colors shadow-sm">
              <Phone className="w-3.5 h-3.5" /><span className="tracking-wider">{COMPANY.phone}</span>
            </a>
            <button onClick={() => setOpen(!open)} className="xl:hidden p-2" aria-label="メニュー">
              {open ? <X className={`w-5 h-5 ${scrolled ? "text-[#3D3226]" : "text-white"}`} /> : <Menu className={`w-5 h-5 ${scrolled ? "text-[#3D3226]" : "text-white"}`} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div className="xl:hidden bg-[#FAF7F2] border-t border-[#E8DFD3] px-5 py-4 space-y-1" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
              {navItems.map((item) => (
                <a key={item.href} href={item.href} onClick={() => setOpen(false)} className="block py-3 px-4 text-[#3D3226] rounded-lg hover:bg-[#7BA23F]/5">{item.label}</a>
              ))}
              <a href={`tel:${COMPANY.phone}`} className="block mt-3 text-center py-3.5 rounded-lg bg-[#7BA23F] text-white font-medium"><Phone className="w-4 h-4 inline mr-2" />{COMPANY.phone}</a>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* SP fixed bottom phone bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#7BA23F]">
        <a href={`tel:${COMPANY.phone}`} className="flex items-center justify-center gap-2 py-3.5 text-white font-bold text-base"><Phone className="w-5 h-5" /> 今すぐ電話で相談</a>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════
   Hero
   ═══════════════════════════════════════ */
function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} className="relative h-screen min-h-[600px] max-h-[900px] overflow-hidden">
      <motion.div className="absolute inset-0" style={{ y }}>
        <HeroIllustration />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/10" />
      </motion.div>

      <motion.div className="relative z-10 h-full flex flex-col justify-end max-w-[1200px] mx-auto px-5 pb-20 sm:pb-24" style={{ opacity }}>
        <motion.div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 w-fit mb-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="w-1.5 h-1.5 rounded-full bg-[#7BA23F]" />
          <span className="text-white/80 text-xs tracking-wider">創業{new Date().getFullYear() - parseInt(COMPANY.since)}年 / 施工実績500棟以上</span>
        </motion.div>

        <motion.h1 className="text-white font-bold leading-[1.25] mb-4" style={{ fontSize: "clamp(1.8rem, 5vw, 3.2rem)" }} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.15 }}>
          {COMPANY.tagline}
        </motion.h1>

        <motion.p className="text-white/75 text-sm sm:text-base max-w-[560px] leading-relaxed mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          {COMPANY.description}
        </motion.p>

        <motion.div className="flex flex-col sm:flex-row gap-3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <a href="#contact" className="px-8 py-3.5 rounded-lg bg-[#7BA23F] text-white font-medium text-sm hover:bg-[#5C7A2E] transition-colors text-center shadow-lg shadow-[#7BA23F]/20">無料相談・お見積り</a>
          <a href="#works" className="px-8 py-3.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/25 text-white text-sm hover:bg-white/20 transition-colors text-center">施工実績を見る →</a>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ═══════════════════════════════════════
   Works — ★ミドル版: 詳細ページ付き（Before/After）
   ═══════════════════════════════════════ */
function WorksSection() {
  const [detail, setDetail] = useState<number | null>(null);
  const [filter, setFilter] = useState("すべて");
  const categories = ["すべて", "新築", "リフォーム"];
  const filtered = filter === "すべて" ? PROJECTS : PROJECTS.filter((p) => p.category === filter);

  return (
    <section id="works" className="py-20 sm:py-28 bg-[#FAF7F2]">
      <div className="max-w-[1200px] mx-auto px-5">
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-[#7BA23F] text-xs tracking-[0.3em] mb-2 font-medium">WORKS</p>
          <h2 className="text-[#3D3226] font-bold text-2xl sm:text-3xl mb-3">施工実績</h2>
          <p className="text-[#8B7D6B] text-sm">心を込めてつくりあげた、家族の住まい。</p>
        </motion.div>

        <div className="flex justify-center gap-2 mb-10">
          {categories.map((c) => (
            <button key={c} onClick={() => setFilter(c)} className={`px-5 py-2 rounded-full text-sm transition-all ${filter === c ? "bg-[#7BA23F] text-white shadow-sm" : "bg-white text-[#8B7D6B] border border-[#E8DFD3] hover:border-[#7BA23F]/30"}`}>{c}</button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p, i) => (
            <motion.div key={p.id} className="group cursor-pointer rounded-2xl overflow-hidden bg-white border border-[#E8DFD3] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300" initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.5, delay: i * 0.08 }} onClick={() => setDetail(PROJECTS.indexOf(p))}>
              <div className="relative h-56 overflow-hidden">
                <HouseIllustration colors={p.colors} className="w-full h-full group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs font-medium text-[#3D3226] shadow-sm">{p.category}</div>
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

      {/* ★ミドル版: 詳細モーダル（Before/After + 施工概要 + お客様の声） */}
      <AnimatePresence>
        {detail !== null && (
          <motion.div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm overflow-y-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDetail(null)}>
            <div className="min-h-full flex items-start justify-center p-4 pt-10 pb-20">
              <motion.div className="bg-white rounded-2xl max-w-[800px] w-full overflow-hidden shadow-2xl" initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0 }} onClick={(e) => e.stopPropagation()}>
                <button onClick={() => setDetail(null)} className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow hover:bg-white"><X className="w-4 h-4 text-[#3D3226]" /></button>

                {/* Main image */}
                <div className="h-64 sm:h-80">
                  <HouseIllustration colors={PROJECTS[detail].colors} className="w-full h-full" />
                </div>

                <div className="p-6 sm:p-8">
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-3 py-1 rounded-full bg-[#7BA23F]/10 text-[#7BA23F] text-xs font-medium">{PROJECTS[detail].category}</span>
                    <span className="text-[#8B7D6B] text-xs">{PROJECTS[detail].year}</span>
                    <span className="text-[#8B7D6B] text-xs">| {PROJECTS[detail].client}</span>
                  </div>
                  <h3 className="font-bold text-[#3D3226] text-xl sm:text-2xl mb-4">{PROJECTS[detail].title}</h3>
                  <p className="text-[#8B7D6B] text-sm leading-relaxed mb-6">{PROJECTS[detail].desc}</p>

                  {/* Specs */}
                  <div className="px-4 py-3 rounded-lg bg-[#FAF7F2] border border-[#E8DFD3] mb-6">
                    <p className="text-[#8B7D6B] text-xs mb-1">施工概要</p>
                    <p className="text-[#3D3226] text-sm font-medium">{PROJECTS[detail].specs}</p>
                  </div>

                  {/* ★ Before / After */}
                  <div className="mb-6">
                    <p className="text-[#7BA23F] text-xs tracking-wider font-medium mb-3">BEFORE → AFTER</p>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="p-4 rounded-lg bg-red-50/50 border border-red-100/50">
                        <p className="text-red-400 text-xs font-medium mb-1">Before</p>
                        <p className="text-[#3D3226] text-sm leading-relaxed">{PROJECTS[detail].beforeDesc}</p>
                      </div>
                      <div className="p-4 rounded-lg bg-green-50/50 border border-green-100/50">
                        <p className="text-[#7BA23F] text-xs font-medium mb-1">After</p>
                        <p className="text-[#3D3226] text-sm leading-relaxed">{PROJECTS[detail].afterDesc}</p>
                      </div>
                    </div>
                  </div>

                  {/* CTA */}
                  <a href="#contact" onClick={() => setDetail(null)} className="block text-center py-3.5 rounded-lg bg-[#7BA23F] text-white font-medium text-sm hover:bg-[#5C7A2E] transition-colors">
                    この事例について相談する
                  </a>
                </div>

                {/* Nav */}
                <div className="flex border-t border-[#E8DFD3]">
                  <button className="flex-1 py-4 text-sm text-[#8B7D6B] hover:bg-[#FAF7F2] transition-colors flex items-center justify-center gap-2" onClick={() => setDetail(detail > 0 ? detail - 1 : PROJECTS.length - 1)}>
                    <ChevronLeft className="w-4 h-4" /> 前の実績
                  </button>
                  <div className="w-px bg-[#E8DFD3]" />
                  <button className="flex-1 py-4 text-sm text-[#8B7D6B] hover:bg-[#FAF7F2] transition-colors flex items-center justify-center gap-2" onClick={() => setDetail(detail < PROJECTS.length - 1 ? detail + 1 : 0)}>
                    次の実績 <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ═══════════════════════════════════════
   ★ Testimonials (お客様の声) — ミドル限定
   ═══════════════════════════════════════ */
function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20 sm:py-28 bg-white">
      <div className="max-w-[1000px] mx-auto px-5">
        <motion.div className="text-center mb-14" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-[#7BA23F] text-xs tracking-[0.3em] mb-2 font-medium">VOICE</p>
          <h2 className="text-[#3D3226] font-bold text-2xl sm:text-3xl mb-3">お客様の声</h2>
          <p className="text-[#8B7D6B] text-sm">家を建ててくださったお客様から、うれしい声が届いています。</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <motion.div key={i} className="p-7 rounded-2xl bg-[#FAF7F2] border border-[#E8DFD3]" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-30px" }} transition={{ duration: 0.5, delay: i * 0.1 }}>
              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.rating || 5 }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 text-[#D4A76A] fill-[#D4A76A]" />
                ))}
              </div>
              {/* Quote */}
              <div className="relative mb-4">
                <Quote className="absolute -top-1 -left-1 w-6 h-6 text-[#7BA23F]/20" />
                <p className="text-[#3D3226] text-sm leading-[1.9] pl-4">{t.text}</p>
              </div>
              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-[#E8DFD3]">
                <div className="w-10 h-10 rounded-full bg-[#7BA23F]/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-[#7BA23F]" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-[#3D3226] text-sm font-medium">{t.name}</p>
                  <p className="text-[#8B7D6B] text-xs">{t.project}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════
   Strengths (私たちの強み) — ライトと同じ
   ═══════════════════════════════════════ */
function StrengthsSection() {
  return (
    <section id="strength" className="py-20 sm:py-28 bg-[#FAF7F2]">
      <div className="max-w-[1000px] mx-auto px-5">
        <motion.div className="text-center mb-14" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-[#7BA23F] text-xs tracking-[0.3em] mb-2 font-medium">STRENGTH</p>
          <h2 className="text-[#3D3226] font-bold text-2xl sm:text-3xl mb-3">私たちの強み</h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-6">
          {STRENGTHS.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div key={i} className="p-7 rounded-2xl bg-white border border-[#E8DFD3] hover:shadow-lg transition-all" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-30px" }} transition={{ duration: 0.5, delay: i * 0.1 }}>
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-[#7BA23F]/10 flex items-center justify-center flex-shrink-0"><Icon className="w-7 h-7 text-[#7BA23F]" strokeWidth={1.5} /></div>
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
   ★ News (お知らせ) — ミドル限定
   ═══════════════════════════════════════ */
function NewsSection() {
  return (
    <section id="news" className="py-20 sm:py-28 bg-white">
      <div className="max-w-[900px] mx-auto px-5">
        <motion.div className="text-center mb-14" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-[#7BA23F] text-xs tracking-[0.3em] mb-2 font-medium">NEWS</p>
          <h2 className="text-[#3D3226] font-bold text-2xl sm:text-3xl mb-3">お知らせ</h2>
        </motion.div>

        <div className="space-y-1">
          {NEWS.map((n, i) => (
            <motion.a key={i} href="#" className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-5 px-5 py-4 rounded-xl hover:bg-[#FAF7F2] transition-colors group" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
              <span className="text-[#8B7D6B] text-xs font-mono flex-shrink-0">{n.date}</span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#7BA23F]/10 text-[#7BA23F] text-[10px] font-medium flex-shrink-0 w-fit">{n.category}</span>
              <span className="text-[#3D3226] text-sm group-hover:text-[#7BA23F] transition-colors">{n.title}</span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════
   About — ライトと同じ（代表挨拶 + 会社概要）
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
        <motion.div className="bg-white rounded-2xl border border-[#E8DFD3] overflow-hidden mb-10" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="p-8 sm:p-10">
            <p className="text-[#7BA23F] text-xs tracking-[0.2em] mb-4 font-medium">代表挨拶</p>
            <div className="text-[#3D3226] text-sm sm:text-base leading-[2.2]">
              {COMPANY.bio.split("\n\n").map((para, i) => (<p key={i} className={i > 0 ? "mt-5" : ""}>{para}</p>))}
            </div>
            <p className="text-[#8B7D6B] text-sm mt-6">代表　{COMPANY.ceo}</p>
          </div>
        </motion.div>

        {/* Table */}
        <motion.div className="bg-white rounded-2xl border border-[#E8DFD3] overflow-hidden" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="p-5 bg-[#FAF7F2] border-b border-[#E8DFD3]"><h3 className="text-[#3D3226] font-bold text-base">会社概要</h3></div>
          <div className="divide-y divide-[#E8DFD3]">
            {[["商号", COMPANY.name],["代表者", COMPANY.ceo],["設立", `${COMPANY.since}年`],["所在地", COMPANY.address],["電話番号", COMPANY.phone],["メール", COMPANY.email],["営業時間", COMPANY.hours],["許認可", COMPANY.license],["Webサイト", COMPANY.domain]].map(([label, value]) => (
              <div key={label} className="flex flex-col sm:flex-row">
                <div className="sm:w-40 px-6 py-3 sm:py-4 bg-[#FDFCFA] text-[#8B7D6B] text-sm font-medium">{label}</div>
                <div className="flex-1 px-6 py-3 sm:py-4 text-[#3D3226] text-sm">{value}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ★ Google Maps embed area */}
        <motion.div className="mt-10 rounded-2xl overflow-hidden border border-[#E8DFD3]" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="p-4 bg-white border-b border-[#E8DFD3] flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#7BA23F]" />
            <span className="text-[#3D3226] text-sm font-medium">アクセス</span>
          </div>
          {/* Google Maps placeholder — 実際のサイトでは本物のGoogle Mapsを埋め込み */}
          <div className="h-[300px] bg-gradient-to-b from-[#E8E4DC] to-[#D4CFC5] flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-10 h-10 text-[#7BA23F] mx-auto mb-3" strokeWidth={1} />
              <p className="text-[#8B7D6B] text-sm font-medium">{COMPANY.address}</p>
              <p className="text-[#8B7D6B] text-xs mt-1">※ 実際のサイトではGoogle Mapsが表示されます</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════
   Contact — ライトと同じ（フォーム付き）
   ═══════════════════════════════════════ */
function ContactSection() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <section id="contact" className="py-20 sm:py-28 bg-white">
      <div className="max-w-[900px] mx-auto px-5">
        <motion.div className="text-center mb-14" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-[#7BA23F] text-xs tracking-[0.3em] mb-2 font-medium">CONTACT</p>
          <h2 className="text-[#3D3226] font-bold text-2xl sm:text-3xl mb-3">お問い合わせ</h2>
          <p className="text-[#8B7D6B] text-sm">まずはお気軽にご相談ください。お見積りは無料です。</p>
        </motion.div>

        {/* Phone CTA */}
        <motion.div className="text-center mb-12 p-8 rounded-2xl bg-gradient-to-br from-[#7BA23F]/5 to-[#7BA23F]/10 border border-[#7BA23F]/20" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-[#7BA23F] text-xs tracking-wider mb-3 font-medium">お電話でのお問い合わせ</p>
          <a href={`tel:${COMPANY.phone}`} className="inline-block text-[#3D3226] text-3xl sm:text-4xl font-bold tracking-wider hover:text-[#7BA23F] transition-colors">{COMPANY.phone}</a>
          <p className="text-[#8B7D6B] text-xs mt-2">{COMPANY.hours}</p>
        </motion.div>

        {/* Form */}
        <motion.div className="bg-white rounded-2xl border border-[#E8DFD3] shadow-sm overflow-hidden" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="p-5 bg-[#FAF7F2] border-b border-[#E8DFD3]"><h3 className="text-[#3D3226] font-bold text-base">メールでのお問い合わせ</h3></div>

          {submitted ? (
            <div className="p-10 text-center">
              <div className="w-14 h-14 rounded-full bg-[#7BA23F]/10 flex items-center justify-center mx-auto mb-4"><Check className="w-7 h-7 text-[#7BA23F]" /></div>
              <p className="text-[#3D3226] text-lg font-bold mb-2">送信ありがとうございます</p>
              <p className="text-[#8B7D6B] text-sm">2営業日以内にご連絡いたします。</p>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="p-6 sm:p-8 space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div><label className="block text-xs text-[#8B7D6B] mb-2 font-medium">お名前 <span className="text-red-400">*</span></label><input type="text" required className="w-full px-4 py-3 rounded-lg bg-[#FAF7F2] border border-[#E8DFD3] text-[#3D3226] text-sm placeholder:text-[#C4B5A0] focus:outline-none focus:border-[#7BA23F] focus:ring-2 focus:ring-[#7BA23F]/10" placeholder="山田 花子" /></div>
                <div><label className="block text-xs text-[#8B7D6B] mb-2 font-medium">電話番号</label><input type="tel" className="w-full px-4 py-3 rounded-lg bg-[#FAF7F2] border border-[#E8DFD3] text-[#3D3226] text-sm placeholder:text-[#C4B5A0] focus:outline-none focus:border-[#7BA23F] focus:ring-2 focus:ring-[#7BA23F]/10" placeholder="090-1234-5678" /></div>
              </div>
              <div><label className="block text-xs text-[#8B7D6B] mb-2 font-medium">メールアドレス <span className="text-red-400">*</span></label><input type="email" required className="w-full px-4 py-3 rounded-lg bg-[#FAF7F2] border border-[#E8DFD3] text-[#3D3226] text-sm placeholder:text-[#C4B5A0] focus:outline-none focus:border-[#7BA23F] focus:ring-2 focus:ring-[#7BA23F]/10" placeholder="example@email.com" /></div>
              <div><label className="block text-xs text-[#8B7D6B] mb-2 font-medium">お問い合わせ種別</label>
                <div className="flex flex-wrap gap-2">
                  {["新築のご相談", "リフォームのご相談", "お見積り依頼", "完成見学会", "その他"].map((type) => (
                    <label key={type} className="px-4 py-2 rounded-full border border-[#E8DFD3] text-sm text-[#3D3226] cursor-pointer hover:border-[#7BA23F]/30 hover:bg-[#7BA23F]/5 transition-all has-[:checked]:bg-[#7BA23F]/10 has-[:checked]:border-[#7BA23F]/30 has-[:checked]:text-[#7BA23F]"><input type="radio" name="type" value={type} className="sr-only" />{type}</label>
                  ))}
                </div>
              </div>
              <div><label className="block text-xs text-[#8B7D6B] mb-2 font-medium">ご相談内容</label><textarea rows={5} className="w-full px-4 py-3 rounded-lg bg-[#FAF7F2] border border-[#E8DFD3] text-[#3D3226] text-sm placeholder:text-[#C4B5A0] focus:outline-none focus:border-[#7BA23F] focus:ring-2 focus:ring-[#7BA23F]/10 resize-none" placeholder="ご予算、ご希望の時期、土地の有無など、わかる範囲でお気軽にお書きください。" /></div>
              <button type="submit" className="w-full flex items-center justify-center gap-2 py-4 rounded-lg bg-[#7BA23F] text-white font-bold text-sm tracking-wider hover:bg-[#5C7A2E] transition-colors shadow-sm"><Send className="w-4 h-4" /> 送信する</button>
              <p className="text-[#8B7D6B] text-xs text-center">※ 通常2営業日以内にご返信いたします</p>
            </form>
          )}
        </motion.div>
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
            <div className="w-8 h-8 rounded-lg bg-[#7BA23F] flex items-center justify-center"><Home className="w-4 h-4 text-white" /></div>
            <div><p className="text-white font-bold text-sm">{COMPANY.name}</p><p className="text-white/40 text-[9px] tracking-wider">since {COMPANY.since}</p></div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-5">
            {[["施工実績","works"],["お客様の声","testimonials"],["私たちの強み","strength"],["お知らせ","news"],["会社案内","about"],["お問い合わせ","contact"]].map(([label, id]) => (
              <a key={id} href={`#${id}`} className="text-white/50 text-xs hover:text-white transition-colors">{label}</a>
            ))}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-white/30 text-xs">
          <p>{COMPANY.address}　TEL: {COMPANY.phone}</p>
          <p>© {new Date().getFullYear()} {COMPANY.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════
   ★ JSON-LD 構造化データ — ミドル限定
   ═══════════════════════════════════════ */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "GeneralContractor",
  "name": COMPANY.name,
  "url": `https://${COMPANY.domain}`,
  "telephone": COMPANY.phone,
  "email": COMPANY.email,
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "世田谷区",
    "addressRegion": "東京都",
    "addressCountry": "JP",
  },
  "openingHours": "Mo-Sa 09:00-18:00",
  "foundingDate": COMPANY.since,
  "description": COMPANY.description,
};

/* ═══════════════════════════════════════
   ★★ AIチャットボット — プレミアム限定
   ═══════════════════════════════════════ */
const FAQ_DATA = (config.chatFAQs || []).map((f) => ({ q: f.question, a: f.answer }));

function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: "bot" | "user"; text: string }[]>([
    { role: "bot", text: "こんにちは！山田工務店のAIアシスタントです。\nご質問をお選びいただくか、お気軽にメッセージをどうぞ。" },
  ]);
  const [input, setInput] = useState("");

  const handleFAQ = (faq: typeof FAQ_DATA[0]) => {
    setMessages((prev) => [...prev, { role: "user", text: faq.q }, { role: "bot", text: faq.a }]);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    // Simple keyword matching for demo
    const match = FAQ_DATA.find((f) => userMsg.includes(f.q.replace("？", "").slice(0, 4)));
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "bot", text: match ? match.a : "ありがとうございます。詳しいご相談は、お電話（" + COMPANY.phone + "）またはお問い合わせフォームからお気軽にどうぞ。担当者が丁寧にお答えいたします。" }]);
    }, 800);
  };

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-20 md:bottom-6 right-4 z-40 w-14 h-14 rounded-full bg-[#7BA23F] text-white shadow-lg shadow-[#7BA23F]/30 flex items-center justify-center hover:bg-[#5C7A2E] transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? <X className="w-5 h-5" /> : <MessageCircle className="w-6 h-6" />}
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-36 md:bottom-24 right-4 z-40 w-[340px] max-h-[480px] bg-white rounded-2xl shadow-2xl border border-[#E8DFD3] overflow-hidden flex flex-col"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
          >
            {/* Header */}
            <div className="px-4 py-3 bg-[#7BA23F] text-white flex items-center gap-2">
              <Bot className="w-5 h-5" />
              <div>
                <p className="text-sm font-medium">AIアシスタント</p>
                <p className="text-[10px] text-white/70">24時間対応</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[280px]">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] px-3 py-2 rounded-xl text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-[#7BA23F] text-white rounded-br-none"
                      : "bg-[#FAF7F2] text-[#3D3226] rounded-bl-none"
                  }`}>
                    {m.text.split("\n").map((line, j) => (<span key={j}>{line}<br /></span>))}
                  </div>
                </div>
              ))}

              {/* Quick replies */}
              {messages.length <= 2 && (
                <div className="flex flex-wrap gap-1.5">
                  {FAQ_DATA.slice(0, 3).map((faq) => (
                    <button key={faq.q} onClick={() => handleFAQ(faq)} className="px-3 py-1.5 rounded-full border border-[#7BA23F]/30 text-[#7BA23F] text-xs hover:bg-[#7BA23F]/5 transition-colors">
                      {faq.q}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-[#E8DFD3] flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="メッセージを入力..."
                className="flex-1 px-3 py-2 rounded-lg bg-[#FAF7F2] border border-[#E8DFD3] text-sm text-[#3D3226] placeholder:text-[#C4B5A0] focus:outline-none focus:border-[#7BA23F]"
              />
              <button onClick={handleSend} className="w-9 h-9 rounded-lg bg-[#7BA23F] text-white flex items-center justify-center hover:bg-[#5C7A2E] transition-colors flex-shrink-0">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ═══════════════════════════════════════
   ★★ 見学会予約セクション — プレミアム限定
   予約ポップアップフォーム + 残枠自動減少
   ═══════════════════════════════════════ */
const INITIAL_EVENTS = config.bookingEvents || [];

function BookingSection() {
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);
  const [bookedIds, setBookedIds] = useState<Set<number>>(new Set());
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedEvent === null) return;

    // 残枠を1減らす
    setEvents((prev) =>
      prev.map((ev) =>
        ev.id === selectedEvent ? { ...ev, spots: Math.max(0, ev.spots - 1) } : ev
      )
    );
    // 予約済みに追加
    setBookedIds((prev) => new Set([...prev, selectedEvent]));
    setFormSubmitted(true);
  };

  const closeModal = () => {
    setSelectedEvent(null);
    setFormSubmitted(false);
  };

  return (
    <section id="booking" className="py-20 sm:py-28 bg-[#FAF7F2]">
      <div className="max-w-[800px] mx-auto px-5">
        <motion.div className="text-center mb-14" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-[#7BA23F] text-xs tracking-[0.3em] mb-2 font-medium">RESERVATION</p>
          <h2 className="text-[#3D3226] font-bold text-2xl sm:text-3xl mb-3">見学会・相談会予約</h2>
          <p className="text-[#8B7D6B] text-sm">実際の家を見て、触れて、感じてください。</p>
        </motion.div>

        <div className="space-y-4">
          {events.map((ev, i) => (
            <motion.div
              key={ev.id}
              className="bg-white rounded-2xl border border-[#E8DFD3] p-6 flex flex-col sm:flex-row sm:items-center gap-4"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <div className="flex-shrink-0 text-center sm:text-left">
                <p className="text-[#7BA23F] font-bold text-lg">{ev.date}</p>
                <p className="text-[#8B7D6B] text-xs">{ev.time}</p>
              </div>
              <div className="flex-1">
                <p className="text-[#3D3226] font-medium text-sm">{ev.title}</p>
                <p className="text-[#8B7D6B] text-xs mt-0.5">
                  📍 {ev.location}
                </p>
                <p className={`text-xs mt-1 font-medium ${ev.spots <= 2 ? "text-red-400" : "text-[#8B7D6B]"}`}>
                  {ev.spots === 0 ? "満席" : `残り${ev.spots}枠`}
                  {ev.spots > 0 && ev.spots <= 2 && " — お早めに！"}
                </p>
              </div>
              {bookedIds.has(ev.id) ? (
                <div className="flex items-center gap-2 text-[#7BA23F] text-sm font-medium px-4 py-2 rounded-lg bg-[#7BA23F]/10">
                  <Check className="w-4 h-4" /> 予約済み
                </div>
              ) : ev.spots === 0 ? (
                <div className="text-[#8B7D6B] text-sm px-4 py-2">満席</div>
              ) : (
                <button
                  onClick={() => { setSelectedEvent(ev.id); setFormSubmitted(false); }}
                  className="px-6 py-2.5 rounded-lg bg-[#7BA23F] text-white text-sm font-medium hover:bg-[#5C7A2E] transition-colors flex-shrink-0"
                >
                  <Calendar className="w-4 h-4 inline mr-1.5" />予約する
                </button>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* ★ 予約申し込みポップアップ */}
      <AnimatePresence>
        {selectedEvent !== null && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className="bg-white rounded-2xl max-w-[500px] w-full overflow-hidden shadow-2xl"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-5 bg-[#7BA23F] text-white flex items-center justify-between">
                <div>
                  <p className="font-bold text-sm">見学会予約</p>
                  <p className="text-white/70 text-xs mt-0.5">
                    {events.find((e) => e.id === selectedEvent)?.title} — {events.find((e) => e.id === selectedEvent)?.date}
                  </p>
                </div>
                <button onClick={closeModal} className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {formSubmitted ? (
                /* 予約完了画面 */
                <div className="p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-[#7BA23F]/10 flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-[#7BA23F]" />
                  </div>
                  <h3 className="text-[#3D3226] text-lg font-bold mb-2">ご予約ありがとうございます</h3>
                  <p className="text-[#8B7D6B] text-sm leading-relaxed mb-4">
                    ご入力いただいたメールアドレスに確認メールをお送りしました。<br />
                    当日お会いできることを楽しみにしております。
                  </p>
                  <div className="px-4 py-3 rounded-lg bg-[#FAF7F2] border border-[#E8DFD3] text-left mb-6">
                    <p className="text-[#8B7D6B] text-xs mb-1">予約内容</p>
                    <p className="text-[#3D3226] text-sm font-medium">
                      {events.find((e) => e.id === selectedEvent)?.title}<br />
                      {events.find((e) => e.id === selectedEvent)?.date} {events.find((e) => e.id === selectedEvent)?.time}<br />
                      {events.find((e) => e.id === selectedEvent)?.location}
                    </p>
                  </div>
                  <button onClick={closeModal} className="px-8 py-2.5 rounded-lg border border-[#E8DFD3] text-[#3D3226] text-sm hover:bg-[#FAF7F2] transition-colors">
                    閉じる
                  </button>
                </div>
              ) : (
                /* 予約フォーム */
                <form onSubmit={handleBookingSubmit} className="p-6 space-y-4">
                  <div className="px-4 py-3 rounded-lg bg-[#FAF7F2] border border-[#E8DFD3]">
                    <p className="text-[#8B7D6B] text-xs">イベント</p>
                    <p className="text-[#3D3226] text-sm font-medium">
                      {events.find((e) => e.id === selectedEvent)?.title}
                    </p>
                    <p className="text-[#8B7D6B] text-xs mt-0.5">
                      {events.find((e) => e.id === selectedEvent)?.date} {events.find((e) => e.id === selectedEvent)?.time} | 📍 {events.find((e) => e.id === selectedEvent)?.location}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-[#8B7D6B] mb-1.5 font-medium">お名前 <span className="text-red-400">*</span></label>
                      <input type="text" required className="w-full px-4 py-2.5 rounded-lg bg-[#FAF7F2] border border-[#E8DFD3] text-[#3D3226] text-sm placeholder:text-[#C4B5A0] focus:outline-none focus:border-[#7BA23F]" placeholder="山田 花子" />
                    </div>
                    <div>
                      <label className="block text-xs text-[#8B7D6B] mb-1.5 font-medium">参加人数 <span className="text-red-400">*</span></label>
                      <select required className="w-full px-4 py-2.5 rounded-lg bg-[#FAF7F2] border border-[#E8DFD3] text-[#3D3226] text-sm focus:outline-none focus:border-[#7BA23F] appearance-none">
                        <option value="">選択</option>
                        <option>1名</option>
                        <option>2名</option>
                        <option>3名</option>
                        <option>4名以上</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-[#8B7D6B] mb-1.5 font-medium">電話番号 <span className="text-red-400">*</span></label>
                    <input type="tel" required className="w-full px-4 py-2.5 rounded-lg bg-[#FAF7F2] border border-[#E8DFD3] text-[#3D3226] text-sm placeholder:text-[#C4B5A0] focus:outline-none focus:border-[#7BA23F]" placeholder="090-1234-5678" />
                  </div>

                  <div>
                    <label className="block text-xs text-[#8B7D6B] mb-1.5 font-medium">メールアドレス <span className="text-red-400">*</span></label>
                    <input type="email" required className="w-full px-4 py-2.5 rounded-lg bg-[#FAF7F2] border border-[#E8DFD3] text-[#3D3226] text-sm placeholder:text-[#C4B5A0] focus:outline-none focus:border-[#7BA23F]" placeholder="example@email.com" />
                  </div>

                  <div>
                    <label className="block text-xs text-[#8B7D6B] mb-1.5 font-medium">ご質問・ご要望（任意）</label>
                    <textarea rows={3} className="w-full px-4 py-2.5 rounded-lg bg-[#FAF7F2] border border-[#E8DFD3] text-[#3D3226] text-sm placeholder:text-[#C4B5A0] focus:outline-none focus:border-[#7BA23F] resize-none" placeholder="お子さま連れでの参加可能ですか？など" />
                  </div>

                  <div className="pt-2 flex gap-3">
                    <button type="button" onClick={closeModal} className="flex-1 py-3 rounded-lg border border-[#E8DFD3] text-[#8B7D6B] text-sm hover:bg-[#FAF7F2] transition-colors">
                      キャンセル
                    </button>
                    <button type="submit" className="flex-1 py-3 rounded-lg bg-[#7BA23F] text-white text-sm font-bold hover:bg-[#5C7A2E] transition-colors flex items-center justify-center gap-2">
                      <Calendar className="w-4 h-4" /> 予約を確定する
                    </button>
                  </div>

                  <p className="text-[#8B7D6B] text-[10px] text-center">
                    ※ 予約確定後、確認メールをお送りします。キャンセルは前日までにお電話ください。
                  </p>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ═══════════════════════════════════════
   Page — プレミアム版
   ═══════════════════════════════════════ */
export default function WarmCraftProPage() {
  return (
    <>
      <DemoBanner />
      <Script id="json-ld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header />
      <main>
        <HeroSection />
        <WorksSection />
        <TestimonialsSection />
        <StrengthsSection />
        <BookingSection />
        <NewsSection />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
      <AIChatbot />
    </>
  );
}
