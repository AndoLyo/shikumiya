"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  X,
  Menu,
  ArrowRight,
  Shield,
  Award,
  Building2,
  Wrench,
  Users,
  ChevronLeft,
  ChevronRight,
  Send,
  Check,
  Briefcase,
} from "lucide-react";
import DemoBanner from "@/components/portfolio-templates/DemoBanner";
import type { SiteConfig } from "@/lib/site-config-schema";
import { usePreviewName } from "@/lib/use-preview-name";
import siteConfig from "./site.config.json";

/* ═══════════════════════════════════════
   データ読み込み — site.config.json から取得
   ═══════════════════════════════════════ */
const SERVICE_ICON_MAP: Record<string, typeof Building2> = { Building2, Wrench, Shield, Briefcase };
const PROJECT_GRADS = [
  "from-[#1B3A5C] to-[#2A5080]",
  "from-[#2A5080] to-[#3D6A9E]",
  "from-[#3D5A80] to-[#1B3A5C]",
  "from-[#4A6FA5] to-[#2A5080]",
  "from-[#1B3A5C] to-[#0D2440]",
  "from-[#2A5080] to-[#1B3A5C]",
];

const config = siteConfig as SiteConfig;
const COMPANY = { ...config.company, subtitle: config.company.description, tagline: config.company.tagline };
const STATS = config.stats || [];
const SERVICES = (config.services || []).map((s) => ({
  ...s,
  desc: s.description,
  icon: SERVICE_ICON_MAP[s.icon || "Building2"] || Building2,
}));
const PROJECTS = config.projects.map((p, i) => ({
  ...p,
  scale: p.specs || "",
  grad: PROJECT_GRADS[i % PROJECT_GRADS.length],
}));

/* ═══════════════════════════════════════
   SVG Illustrations
   ═══════════════════════════════════════ */
function BuildingIllustration({ gradient, className }: { gradient: string; className?: string }) {
  const colorMap: Record<string, [string, string]> = {
    "from-[#1B3A5C] to-[#2A5080]": ["#1B3A5C", "#2A5080"],
    "from-[#2A5080] to-[#3D6A9E]": ["#2A5080", "#3D6A9E"],
    "from-[#3D5A80] to-[#1B3A5C]": ["#3D5A80", "#1B3A5C"],
    "from-[#4A6FA5] to-[#2A5080]": ["#4A6FA5", "#2A5080"],
    "from-[#1B3A5C] to-[#0D2440]": ["#1B3A5C", "#0D2440"],
  };
  const [c1, c2] = colorMap[gradient] || ["#1B3A5C", "#2A5080"];

  return (
    <svg viewBox="0 0 800 500" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`bsky-${c1}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E8EDF2" />
          <stop offset="100%" stopColor="#D1D9E3" />
        </linearGradient>
      </defs>
      <rect width="800" height="500" fill={`url(#bsky-${c1})`} />
      {/* Ground */}
      <rect y="380" width="800" height="120" fill="#C8CDD4" />
      {/* Main building */}
      <rect x="250" y="80" width="300" height="300" fill={c1} />
      {/* Floors */}
      {[120, 160, 200, 240, 280, 320, 340].map((yy) => (
        <line key={yy} x1="250" y1={yy} x2="550" y2={yy} stroke={c2} strokeWidth="1" opacity="0.3" />
      ))}
      {/* Windows grid */}
      {[280, 320, 360, 400, 440, 480, 510].map((xPos) =>
        [100, 140, 180, 220, 260, 300, 340].map((yPos) => (
          <rect key={`${xPos}-${yPos}`} x={xPos} y={yPos} width="20" height="15" fill="#A8C5D8" opacity="0.6" rx="1" />
        ))
      )}
      {/* Entrance */}
      <rect x="360" y="330" width="80" height="50" fill={c2} />
      <rect x="370" y="335" width="25" height="45" fill="#A8C5D8" opacity="0.5" />
      <rect x="405" y="335" width="25" height="45" fill="#A8C5D8" opacity="0.5" />
      {/* Side building */}
      <rect x="550" y="200" width="120" height="180" fill={c2} opacity="0.8" />
      {[230, 260, 290, 320, 350].map((yy) =>
        [565, 600, 635].map((xx) => (
          <rect key={`s-${xx}-${yy}`} x={xx} y={yy} width="15" height="12" fill="#A8C5D8" opacity="0.5" rx="1" />
        ))
      )}
      {/* Left small building */}
      <rect x="130" y="280" width="120" height="100" fill={c1} opacity="0.6" />
      {[300, 330, 350].map((yy) =>
        [145, 175, 205].map((xx) => (
          <rect key={`l-${xx}-${yy}`} x={xx} y={yy} width="14" height="10" fill="#A8C5D8" opacity="0.4" rx="1" />
        ))
      )}
      {/* Crane */}
      <line x1="700" y1="50" x2="700" y2="380" stroke={c1} strokeWidth="3" opacity="0.3" />
      <line x1="620" y1="60" x2="750" y2="60" stroke={c1} strokeWidth="2" opacity="0.3" />
      <line x1="700" y1="60" x2="620" y2="380" stroke={c1} strokeWidth="1" opacity="0.15" />
      {/* Road */}
      <rect y="400" width="800" height="30" fill="#A8B0BA" />
      <line x1="0" y1="415" x2="800" y2="415" stroke="#C8CDD4" strokeWidth="2" strokeDasharray="20 10" />
    </svg>
  );
}

function HeroIllustration() {
  return (
    <svg viewBox="0 0 1200 700" className="w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="navySky" x1="0" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#0D2440" />
          <stop offset="50%" stopColor="#1B3A5C" />
          <stop offset="100%" stopColor="#1E4573" />
        </linearGradient>
      </defs>
      <rect width="1200" height="700" fill="url(#navySky)" />
      {/* City skyline */}
      <rect x="50" y="300" width="80" height="300" fill="#2A5080" opacity="0.4" />
      <rect x="140" y="250" width="100" height="350" fill="#1B3A5C" opacity="0.5" />
      <rect x="260" y="200" width="120" height="400" fill="#2A5080" opacity="0.6" />
      <rect x="400" y="150" width="140" height="450" fill="#3D6A9E" opacity="0.5" />
      {/* Main building (highlighted) */}
      <rect x="560" y="120" width="180" height="480" fill="#2A5080" opacity="0.8" />
      {/* Windows on main */}
      {Array.from({ length: 12 }, (_, row) =>
        Array.from({ length: 5 }, (_, col) => (
          <rect key={`mw-${row}-${col}`} x={575 + col * 32} y={140 + row * 35} width="16" height="20" fill="#C8A96E" opacity={0.15 + Math.random() * 0.3} rx="1" />
        ))
      ).flat()}
      <rect x="760" y="280" width="100" height="320" fill="#1B3A5C" opacity="0.5" />
      <rect x="880" y="320" width="80" height="280" fill="#2A5080" opacity="0.4" />
      <rect x="980" y="280" width="120" height="320" fill="#1B3A5C" opacity="0.3" />
      <rect x="1110" y="350" width="90" height="250" fill="#2A5080" opacity="0.3" />
      {/* Ground */}
      <rect y="600" width="1200" height="100" fill="#0D2440" />
      {/* Road */}
      <rect y="620" width="1200" height="40" fill="#1B3A5C" opacity="0.6" />
      <line x1="0" y1="640" x2="1200" y2="640" stroke="#C8A96E" strokeWidth="1" strokeDasharray="30 15" opacity="0.3" />
      {/* Stars */}
      {[100, 300, 500, 700, 900, 1100].map((x, i) => (
        <circle key={i} cx={x + Math.random() * 50} cy={40 + Math.random() * 100} r="1.5" fill="white" opacity={0.2 + Math.random() * 0.3} />
      ))}
      {/* Geometric accent lines */}
      <line x1="0" y1="580" x2="1200" y2="580" stroke="#C8A96E" strokeWidth="1" opacity="0.15" />
    </svg>
  );
}

/* ═══════════════════════════════════════
   Header
   ═══════════════════════════════════════ */
function Header() {
  const displayName = usePreviewName(COMPANY.name);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const navItems = [
    { label: "事業内容", href: "#service" },
    { label: "施工実績", href: "#works" },
    { label: "会社概要", href: "#about" },
    { label: "お問い合わせ", href: "#contact" },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? "bg-white/95 backdrop-blur-md shadow-sm" : "bg-transparent"
    }`}>
      {/* Top info bar — desktop only */}
      {!scrolled && (
        <div className="hidden lg:block border-b border-white/10">
          <div className="max-w-[1200px] mx-auto px-5 flex items-center justify-end gap-6 py-1.5 text-white/50 text-xs">
            <span className="flex items-center gap-1.5"><Phone className="w-3 h-3" />{COMPANY.phone}</span>
            <span className="flex items-center gap-1.5"><Mail className="w-3 h-3" />{COMPANY.email}</span>
            <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" />{COMPANY.hours}</span>
          </div>
        </div>
      )}

      <div className="max-w-[1200px] mx-auto px-5 h-14 flex items-center justify-between">
        <a href="#" className="flex flex-col">
          <span className={`font-bold text-sm tracking-wide transition-colors ${scrolled ? "text-[#1B3A5C]" : "text-white"}`}>{displayName}</span>
          <span className={`text-[8px] tracking-[0.15em] transition-colors ${scrolled ? "text-gray-400" : "text-white/40"}`}>{COMPANY.nameEn}</span>
        </a>

        <nav className="hidden lg:flex items-center gap-6">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className={`text-sm transition-colors ${scrolled ? "text-gray-500 hover:text-[#1B3A5C]" : "text-white/70 hover:text-white"}`}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="#contact"
            className={`hidden md:flex items-center gap-1.5 px-5 py-2 text-xs tracking-wider transition-all ${
              scrolled
                ? "bg-[#1B3A5C] text-white hover:bg-[#2A5080]"
                : "border border-[#C8A96E]/50 text-[#C8A96E] hover:bg-[#C8A96E]/10"
            }`}
          >
            お問い合わせ <ArrowRight className="w-3 h-3" />
          </a>
          <button onClick={() => setOpen(!open)} className="lg:hidden" aria-label="メニュー">
            {open
              ? <X className={`w-5 h-5 ${scrolled ? "text-[#1B3A5C]" : "text-white"}`} />
              : <Menu className={`w-5 h-5 ${scrolled ? "text-[#1B3A5C]" : "text-white"}`} />
            }
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="lg:hidden bg-white border-t border-gray-200 px-5 py-4 space-y-1"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            {navItems.map((item) => (
              <a key={item.href} href={item.href} onClick={() => setOpen(false)} className="block py-3 px-4 text-gray-700 rounded hover:bg-gray-50">
                {item.label}
              </a>
            ))}
            <a href={`tel:${COMPANY.phone}`} className="block mt-2 text-center py-3 bg-[#1B3A5C] text-white text-sm">
              <Phone className="w-4 h-4 inline mr-2" />{COMPANY.phone}
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

/* ═══════════════════════════════════════
   Hero
   ═══════════════════════════════════════ */
function HeroSection() {
  return (
    <section className="relative h-[85vh] min-h-[600px] max-h-[850px] overflow-hidden">
      <HeroIllustration />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0D2440]/80 via-[#1B3A5C]/40 to-transparent" />

      <div className="relative z-10 h-full flex flex-col justify-center max-w-[1200px] mx-auto px-5 pt-16">
        <motion.div
          className="inline-flex items-center gap-2 px-3 py-1.5 border border-[#C8A96E]/30 w-fit mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-[#C8A96E]" />
          <span className="text-[#C8A96E] text-xs tracking-[0.2em]">since {COMPANY.since}</span>
        </motion.div>

        <motion.h1
          className="text-white font-bold leading-[1.2] mb-5"
          style={{ fontSize: "clamp(2rem, 5.5vw, 3.5rem)" }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          {COMPANY.tagline}
        </motion.h1>

        <motion.p
          className="text-white/55 text-sm sm:text-base max-w-[520px] leading-relaxed mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
        >
          {COMPANY.subtitle}
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <a href="#contact" className="px-8 py-3.5 bg-[#C8A96E] text-[#0D2440] font-bold text-sm hover:bg-[#D4B87A] transition-colors text-center">
            お問い合わせ
          </a>
          <a href="#works" className="px-8 py-3.5 border border-white/25 text-white text-sm hover:bg-white/10 transition-colors text-center">
            施工実績を見る →
          </a>
        </motion.div>
      </div>

      {/* Stats bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-[#0D2440]/80 backdrop-blur-sm border-t border-white/5">
        <div className="max-w-[1200px] mx-auto px-5 py-5 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {STATS.map((s, i) => (
            <motion.div
              key={i}
              className="text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
            >
              <p className="text-white font-bold text-2xl sm:text-3xl">
                {s.num}<span className="text-[#C8A96E] text-sm ml-0.5">{s.unit}</span>
              </p>
              <p className="text-white/40 text-[10px] tracking-wider mt-0.5">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════
   Services (事業内容)
   ═══════════════════════════════════════ */
function ServicesSection() {
  return (
    <section id="service" className="py-20 sm:py-28 bg-white">
      <div className="max-w-[1100px] mx-auto px-5">
        <motion.div className="text-center mb-14" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-[#C8A96E] text-xs tracking-[0.3em] mb-2 font-medium">SERVICE</p>
          <h2 className="text-[#1B3A5C] font-bold text-2xl sm:text-3xl mb-3">事業内容</h2>
          <p className="text-gray-500 text-sm">幅広い分野で、確かな技術と実績を積み重ねています。</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SERVICES.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={i}
                className="group p-7 border border-gray-200 hover:border-[#1B3A5C]/20 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <div className="w-14 h-14 bg-[#F0F4F8] flex items-center justify-center mb-5 group-hover:bg-[#1B3A5C] transition-colors duration-300">
                  <Icon className="w-7 h-7 text-[#1B3A5C] group-hover:text-white transition-colors duration-300" strokeWidth={1.5} />
                </div>
                <h3 className="font-bold text-[#1B3A5C] text-base mb-3">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════
   Projects (施工実績) — フィルター + ライトボックス
   ═══════════════════════════════════════ */
function ProjectsSection() {
  const [filter, setFilter] = useState("すべて");
  const [lightbox, setLightbox] = useState<number | null>(null);
  const categories = ["すべて", ...Array.from(new Set(PROJECTS.map((p) => p.category)))];
  const filtered = filter === "すべて" ? PROJECTS : PROJECTS.filter((p) => p.category === filter);

  return (
    <section id="works" className="py-20 sm:py-28 bg-[#F0F4F8]">
      <div className="max-w-[1100px] mx-auto px-5">
        <motion.div className="text-center mb-10" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-[#C8A96E] text-xs tracking-[0.3em] mb-2 font-medium">WORKS</p>
          <h2 className="text-[#1B3A5C] font-bold text-2xl sm:text-3xl mb-3">施工実績</h2>
          <p className="text-gray-500 text-sm">信頼と技術で完成させた、代表的なプロジェクト。</p>
        </motion.div>

        {/* Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`px-4 py-1.5 text-xs tracking-wider transition-all ${
                filter === c ? "bg-[#1B3A5C] text-white" : "bg-white border border-gray-200 text-gray-500 hover:border-[#1B3A5C]/30"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((p, i) => (
            <motion.div
              key={p.id}
              className="group bg-white border border-gray-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              onClick={() => setLightbox(i)}
            >
              <div className="h-52 overflow-hidden">
                <BuildingIllustration gradient={p.grad} className="w-full h-full group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 bg-[#F0F4F8] text-[#1B3A5C] text-[10px] font-medium tracking-wider">{p.category}</span>
                  <span className="text-gray-400 text-xs">{p.year}</span>
                </div>
                <h3 className="font-bold text-[#1B3A5C] text-sm mb-1">{p.title}</h3>
                <p className="text-gray-400 text-xs">{p.scale}</p>
                <p className="mt-3 text-[#C8A96E] text-xs font-medium">詳しく見る →</p>
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
              className="bg-white max-w-[700px] w-full overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => setLightbox(null)} className="absolute top-4 right-4 z-10 w-8 h-8 bg-white/90 flex items-center justify-center shadow-sm hover:bg-white">
                <X className="w-4 h-4" />
              </button>

              <div className="h-72">
                <BuildingIllustration gradient={filtered[lightbox].grad} className="w-full h-full" />
              </div>
              <div className="p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-3 py-1 bg-[#1B3A5C] text-white text-xs">{filtered[lightbox].category}</span>
                  <span className="text-gray-400 text-xs">{filtered[lightbox].year}</span>
                </div>
                <h3 className="font-bold text-[#1B3A5C] text-xl mb-4">{filtered[lightbox].title}</h3>
                <div className="px-4 py-3 bg-[#F0F4F8] border-l-3 border-[#C8A96E]">
                  <p className="text-gray-500 text-xs mb-1">施工概要</p>
                  <p className="text-[#1B3A5C] text-sm font-medium">{filtered[lightbox].scale}</p>
                </div>
              </div>

              <div className="flex border-t border-gray-200">
                <button className="flex-1 py-4 text-sm text-gray-500 hover:bg-[#F0F4F8] transition-colors flex items-center justify-center gap-2"
                  onClick={() => setLightbox(lightbox > 0 ? lightbox - 1 : filtered.length - 1)}>
                  <ChevronLeft className="w-4 h-4" /> 前の実績
                </button>
                <div className="w-px bg-gray-200" />
                <button className="flex-1 py-4 text-sm text-gray-500 hover:bg-[#F0F4F8] transition-colors flex items-center justify-center gap-2"
                  onClick={() => setLightbox(lightbox < filtered.length - 1 ? lightbox + 1 : 0)}>
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
   About (会社概要)
   ═══════════════════════════════════════ */
function AboutSection() {
  const displayName = usePreviewName(COMPANY.name);
  return (
    <section id="about" className="py-20 sm:py-28 bg-white">
      <div className="max-w-[1000px] mx-auto px-5">
        <motion.div className="text-center mb-14" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-[#C8A96E] text-xs tracking-[0.3em] mb-2 font-medium">COMPANY</p>
          <h2 className="text-[#1B3A5C] font-bold text-2xl sm:text-3xl">会社概要</h2>
        </motion.div>

        {/* CEO message */}
        <motion.div
          className="mb-12 p-8 sm:p-10 bg-[#F0F4F8] border-l-4 border-[#C8A96E]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-[#C8A96E] text-xs tracking-[0.2em] mb-5 font-medium">代表メッセージ</p>
          <div className="text-[#1B3A5C] text-sm sm:text-base leading-[2]">
            {COMPANY.bio.split("\n\n").map((para, i) => (
              <p key={i} className={i > 0 ? "mt-4" : ""}>{para}</p>
            ))}
          </div>
          <p className="text-gray-500 text-sm mt-6">代表取締役　{COMPANY.ceo}</p>
        </motion.div>

        {/* Company table */}
        <motion.div
          className="border border-gray-200 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {[
            ["商号", displayName],
            ["英文社名", COMPANY.nameEn],
            ["代表者", `代表取締役 ${COMPANY.ceo}`],
            ["設立", `${COMPANY.since}年`],
            ["資本金", COMPANY.capital],
            ["従業員数", COMPANY.employees],
            ["所在地", COMPANY.address],
            ["TEL / FAX", `${COMPANY.phone} / ${COMPANY.fax}`],
            ["許認可", COMPANY.license],
            ["認証", COMPANY.iso],
            ["Webサイト", COMPANY.domain],
          ].map(([label, value], i) => (
            <div key={label} className={`flex flex-col sm:flex-row ${i > 0 ? "border-t border-gray-200" : ""}`}>
              <div className="sm:w-44 px-6 py-3.5 bg-[#1B3A5C] text-white text-sm font-medium">{label}</div>
              <div className="flex-1 px-6 py-3.5 text-gray-700 text-sm bg-white">{value}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════
   Contact
   ═══════════════════════════════════════ */
function ContactSection() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <section id="contact" className="py-20 sm:py-28 bg-[#F0F4F8]">
      <div className="max-w-[900px] mx-auto px-5">
        <motion.div className="text-center mb-14" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-[#C8A96E] text-xs tracking-[0.3em] mb-2 font-medium">CONTACT</p>
          <h2 className="text-[#1B3A5C] font-bold text-2xl sm:text-3xl mb-3">お問い合わせ</h2>
          <p className="text-gray-500 text-sm">ご質問・お見積りなど、お気軽にご連絡ください。</p>
        </motion.div>

        {/* Phone / Email cards */}
        <div className="grid sm:grid-cols-2 gap-5 mb-10">
          <motion.a
            href={`tel:${COMPANY.phone}`}
            className="block p-6 bg-white border border-gray-200 text-center hover:shadow-lg hover:border-[#1B3A5C]/20 transition-all"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Phone className="w-6 h-6 text-[#C8A96E] mx-auto mb-3" strokeWidth={1.5} />
            <p className="text-gray-500 text-xs mb-2">お電話でのお問い合わせ</p>
            <p className="text-[#1B3A5C] text-2xl font-bold tracking-wider">{COMPANY.phone}</p>
            <p className="text-gray-400 text-xs mt-1">{COMPANY.hours}</p>
          </motion.a>

          <motion.a
            href={`mailto:${COMPANY.email}`}
            className="block p-6 bg-white border border-gray-200 text-center hover:shadow-lg hover:border-[#1B3A5C]/20 transition-all"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <Mail className="w-6 h-6 text-[#C8A96E] mx-auto mb-3" strokeWidth={1.5} />
            <p className="text-gray-500 text-xs mb-2">メールでのお問い合わせ</p>
            <p className="text-[#1B3A5C] text-lg font-bold">{COMPANY.email}</p>
            <p className="text-gray-400 text-xs mt-1">24時間受付</p>
          </motion.a>
        </div>

        {/* Form */}
        <motion.div
          className="bg-white border border-gray-200 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="px-6 py-4 bg-[#1B3A5C]">
            <h3 className="text-white font-bold text-sm">フォームでのお問い合わせ</h3>
          </div>

          {submitted ? (
            <div className="p-10 text-center">
              <div className="w-14 h-14 bg-[#1B3A5C]/10 flex items-center justify-center mx-auto mb-4">
                <Check className="w-7 h-7 text-[#1B3A5C]" />
              </div>
              <p className="text-[#1B3A5C] text-lg font-bold mb-2">送信ありがとうございます</p>
              <p className="text-gray-500 text-sm">担当者より2営業日以内にご連絡いたします。</p>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="p-6 sm:p-8 space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                {[
                  { id: "company", label: "会社名・団体名", placeholder: "例：○○株式会社", required: true },
                  { id: "name", label: "ご担当者名", placeholder: "例：鈴木 太郎", required: true },
                ].map((f) => (
                  <div key={f.id}>
                    <label className="block text-xs text-gray-500 mb-2 font-medium">
                      {f.label} {f.required && <span className="text-red-400">*</span>}
                    </label>
                    <input
                      type="text"
                      required={f.required}
                      className="w-full px-4 py-3 border border-gray-200 text-sm text-gray-700 placeholder:text-gray-300 focus:outline-none focus:border-[#1B3A5C] focus:ring-1 focus:ring-[#1B3A5C]/20 transition-all"
                      placeholder={f.placeholder}
                    />
                  </div>
                ))}
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs text-gray-500 mb-2 font-medium">メールアドレス <span className="text-red-400">*</span></label>
                  <input type="email" required className="w-full px-4 py-3 border border-gray-200 text-sm text-gray-700 placeholder:text-gray-300 focus:outline-none focus:border-[#1B3A5C] focus:ring-1 focus:ring-[#1B3A5C]/20" placeholder="info@example.com" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-2 font-medium">電話番号</label>
                  <input type="tel" className="w-full px-4 py-3 border border-gray-200 text-sm text-gray-700 placeholder:text-gray-300 focus:outline-none focus:border-[#1B3A5C] focus:ring-1 focus:ring-[#1B3A5C]/20" placeholder="03-0000-0000" />
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-2 font-medium">お問い合わせ種別</label>
                <select className="w-full px-4 py-3 border border-gray-200 text-sm text-gray-700 focus:outline-none focus:border-[#1B3A5C] appearance-none bg-white">
                  <option>選択してください</option>
                  <option>新築工事のご相談</option>
                  <option>改修・リノベーション</option>
                  <option>耐震診断・補強工事</option>
                  <option>お見積りのご依頼</option>
                  <option>採用について</option>
                  <option>その他</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-2 font-medium">お問い合わせ内容</label>
                <textarea rows={5} className="w-full px-4 py-3 border border-gray-200 text-sm text-gray-700 placeholder:text-gray-300 focus:outline-none focus:border-[#1B3A5C] focus:ring-1 focus:ring-[#1B3A5C]/20 resize-none" placeholder="工事の概要、ご予算、ご希望の時期などをお書きください。" />
              </div>

              <button type="submit" className="w-full flex items-center justify-center gap-2 py-4 bg-[#1B3A5C] text-white font-bold text-sm tracking-wider hover:bg-[#2A5080] transition-colors">
                <Send className="w-4 h-4" /> 送信する
              </button>
              <p className="text-gray-400 text-xs text-center">※ 2営業日以内にご返信いたします</p>
            </form>
          )}
        </motion.div>

        {/* Access */}
        <motion.div
          className="mt-10 p-6 bg-white border border-gray-200 flex flex-col sm:flex-row items-start gap-4"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <MapPin className="w-5 h-5 text-[#C8A96E] flex-shrink-0 mt-0.5" strokeWidth={1.5} />
          <div>
            <p className="text-gray-500 text-xs mb-1">所在地</p>
            <p className="text-[#1B3A5C] text-sm font-medium">{COMPANY.address}</p>
            <p className="text-gray-400 text-xs mt-1">※ お打ち合わせはご来社・オンラインどちらでも対応可能です</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════
   Footer
   ═══════════════════════════════════════ */
function Footer() {
  const displayName = usePreviewName(COMPANY.name);
  return (
    <footer className="bg-[#0D2440] py-10 px-5">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8 pb-8 border-b border-white/10">
          <div>
            <p className="text-white font-bold text-sm">{displayName}</p>
            <p className="text-white/25 text-[9px] tracking-[0.15em]">{COMPANY.nameEn}</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-5 text-white/40 text-xs">
            {["事業内容", "施工実績", "会社概要", "お問い合わせ"].map((label, i) => (
              <a key={label} href={`#${["service","works","about","contact"][i]}`} className="hover:text-white transition-colors">{label}</a>
            ))}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-white/25 text-[10px]">
          <p>{COMPANY.address}　TEL: {COMPANY.phone}</p>
          <p>© {new Date().getFullYear()} {displayName}</p>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════
   Page
   ═══════════════════════════════════════ */
export default function TrustNavyPage() {
  return (
    <>
      <DemoBanner />
      <Header />
      <main>
        <HeroSection />
        <ServicesSection />
        <ProjectsSection />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
