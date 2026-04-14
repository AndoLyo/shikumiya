"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Cormorant_Garamond, Shippori_Mincho } from "next/font/google";
import DemoBanner from "@/components/portfolio-templates/DemoBanner";
import { usePreviewName } from "@/lib/use-preview-name";
import type { SiteConfig } from "@/lib/site-config-schema";
import siteConfig from "./site.config.json";

/* ═══════════════════════════════════════
   Fonts — Cormorant Garamond + Shippori Mincho
   Phase 2: タイポグラフィ定義に準拠
   ═══════════════════════════════════════ */
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400"],
  display: "swap",
  variable: "--font-cormorant",
});

const shippori = Shippori_Mincho({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  variable: "--font-shippori",
});

/* ═══════════════════════════════════════
   Data — site.config.json
   ═══════════════════════════════════════ */
const config = siteConfig as SiteConfig;
const SALON = {
  name: config.company.nameEn || config.company.name,
  tagline: config.company.tagline,
  description: config.company.description,
  phone: config.company.phone,
  email: config.company.email,
  address: config.company.address,
  hours: config.company.hours,
  since: config.company.since,
  ceo: config.company.ceo,
  ceoTitle: config.company.ceoTitle || "",
  bio: config.company.bio,
  domain: config.company.domain,
  mapEmbedUrl: config.company.mapEmbedUrl || "",
};
const STYLES = config.projects.map((p) => ({
  id: p.id,
  title: p.title,
  category: p.category,
  description: p.description,
  image: p.image || "",
}));

/* Staff data (not in SiteConfig — salon-specific) */
const STAFF = [
  { name: "佐藤 あかり", role: "スタイリスト", note: "休日は古本屋巡り。お客様の「似合う」を、髪質から読み取ります。", image: "/images/lumiere/staff-hands-1.jpg" },
  { name: "山本 翔太", role: "スタイリスト", note: "趣味はフィルムカメラ。光の入り方を考えるのが好きです。", image: "/images/lumiere/staff-hands-2.jpg" },
];

/* Menu data */
const MENU = [
  { category: "Cut", items: [{ name: "Cut", time: "60 min" }, { name: "Cut + Shampoo & Blow", time: "90 min" }] },
  { category: "Color", items: [{ name: "Full Color", time: "120 min" }, { name: "Highlight", time: "150 min" }, { name: "Color + Cut", time: "150 min" }] },
  { category: "Treatment", items: [{ name: "Moisture Treatment", time: "30 min" }, { name: "Deep Repair", time: "60 min" }] },
];

const PRICES = [
  { name: "Cut", price: "¥7,700" },
  { name: "Cut + Shampoo & Blow", price: "¥9,900" },
  { name: "Full Color", price: "¥11,000" },
  { name: "Highlight", price: "¥14,300" },
  { name: "Color + Cut", price: "¥16,500" },
  { name: "Moisture Treatment", price: "¥4,400" },
  { name: "Deep Repair", price: "¥7,700" },
];

/* ═══════════════════════════════════════
   Design Tokens — Phase 2 + 4c
   ═══════════════════════════════════════ */
const T = {
  ink: "#3D3630",
  sub: "#7A7267",
  mute: "#8A7F73",   // Phase 4c: WCAG AA修正済み
  accent: "#8B6F5C",
  line: "#D4CEC6",
  paper: "#EDE8E0",
  wall: "#F6F3EE",
  ease: "cubic-bezier(0.25, 0.1, 0.25, 1.0)",
  durSubtle: "150ms",
  durStandard: "300ms",
  durSlow: "600ms",
};

/* ═══════════════════════════════════════
   Intersection Observer Hook
   Phase 4b: 出現アニメーション
   ═══════════════════════════════════════ */
function useReveal<T extends HTMLElement = HTMLElement>(rootMargin = "0px 0px -20% 0px") {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.unobserve(el); } },
      { rootMargin }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [rootMargin]);

  return { ref, visible };
}

/* ═══════════════════════════════════════
   Grain Texture Overlay — Phase 4b Step 1
   ═══════════════════════════════════════ */
function GrainOverlay() {
  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 9999, opacity: 0.03, willChange: "transform" }}
    >
      <svg width="100%" height="100%">
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={4} />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
    </div>
  );
}

/* ═══════════════════════════════════════
   Signature Line — Phase 2 署名要素
   ═══════════════════════════════════════ */
function SignatureLine({ width = 120, duration = 800 }: { width?: number; duration?: number }) {
  const { ref, visible } = useReveal<HTMLDivElement>("0px 0px -40% 0px");
  return (
    <div ref={ref} className="flex justify-center" style={{ padding: "64px 0" }}>
      <div
        style={{
          width: `${width}px`,
          height: "1px",
          backgroundColor: T.line,
          transform: visible ? "scaleX(1)" : "scaleX(0)",
          transition: `transform ${duration}ms ${T.ease}`,
        }}
      />
    </div>
  );
}

/* ═══════════════════════════════════════
   Header — Phase 3: Section nav
   Appears on scroll. Hidden initially.
   ═══════════════════════════════════════ */
function Header() {
  const displayName = usePreviewName(SALON.name);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const navLinks = [
    ["Style", "#style"],
    ["People", "#people"],
    ["Menu", "#menu"],
    ["Access", "#access"],
    ["Reserve", "/portfolio-templates/lumiere/reserve"],
  ] as const;

  return (
    <>
      <header
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
          opacity: scrolled ? 1 : 0,
          pointerEvents: scrolled ? "auto" : "none",
          transition: `opacity ${T.durStandard} ${T.ease}`,
          backgroundColor: `${T.wall}f2`,
          backdropFilter: "blur(8px)",
        }}
      >
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 24px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <a href="#" className={cormorant.className} style={{ fontSize: 14, fontWeight: 300, letterSpacing: "0.12em", color: T.ink, textDecoration: "none" }}>
            {displayName}
          </a>
          {/* Desktop nav */}
          <nav className="hidden md:flex" style={{ gap: 32 }}>
            {navLinks.map(([label, href]) => (
              <a
                key={href}
                href={href}
                className={`${cormorant.className} lm-nav-link`}
                style={{ fontSize: 14, fontWeight: 400, letterSpacing: "0.12em", color: T.mute, textDecoration: "none", position: "relative", paddingBottom: 2 }}
              >
                {label}
              </a>
            ))}
          </nav>
          {/* Mobile hamburger */}
          <button
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ fontSize: 12, letterSpacing: "0.15em", color: T.mute, background: "none", border: "none", cursor: "pointer" }}
            aria-label={menuOpen ? "メニューを閉じる" : "メニューを開く"}
          >
            {menuOpen ? "CLOSE" : "MENU"}
          </button>
        </div>
        <div style={{ height: 1, backgroundColor: T.paper }} />
      </header>

      {/* Mobile fullscreen menu — Phase 3: 背景は漆喰白、暗転しない */}
      {menuOpen && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 40,
            backgroundColor: T.wall,
            display: "flex", alignItems: "center", justifyContent: "center",
            animation: `fadeIn ${T.durStandard} ${T.ease}`,
          }}
        >
          <nav style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
            {navLinks.map(([label, href], i) => (
              <a
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className={cormorant.className}
                style={{
                  fontSize: 28, fontWeight: 300, letterSpacing: "0.12em",
                  color: T.ink, textDecoration: "none",
                  opacity: 0, animation: `slideUp ${T.durStandard} ${T.ease} ${i * 50}ms forwards`,
                }}
              >
                {label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}

/* ═══════════════════════════════════════
   Section 1: Hero — 静寂の入口
   Phase 3: 100vh, テキストなし, 写真のみ
   ═══════════════════════════════════════ */
function HeroSection() {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Fallback: if onLoad doesn't fire (Next.js Image optimization), check after mount
  useEffect(() => {
    const img = imgRef.current;
    if (img?.complete) setLoaded(true);
    const timer = setTimeout(() => setLoaded(true), 2000); // absolute fallback
    return () => clearTimeout(timer);
  }, []);

  return (
    <section style={{ height: "max(100vh, 400px)", position: "relative", backgroundColor: T.paper, overflow: "hidden" }}>
      <Image
        ref={imgRef}
        src="/images/lumiere/hero.jpg"
        alt="LUMIÈRE salon interior"
        fill
        priority
        sizes="100vw"
        style={{
          objectFit: "cover",
          opacity: loaded ? 1 : 0,
          transition: `opacity 1200ms ${T.ease}`,
          filter: "saturate(0.8) contrast(0.95) brightness(1.05)",
        }}
        onLoad={() => setLoaded(true)}
      />
      {/* Bottom fade to wall color */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: "40%",
        background: `linear-gradient(transparent 0%, ${T.wall} 100%)`,
      }} />
    </section>
  );
}

/* ═══════════════════════════════════════
   Section 2: ブランドの一言
   Phase 3: 80vh, 余白の中に一文だけ
   ═══════════════════════════════════════ */
function BrandStatementSection() {
  return (
    <section style={{
      minHeight: "80vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "64px 24px", backgroundColor: T.wall,
    }}>
      <h1
        className={cormorant.className}
        style={{
          fontWeight: 300, color: T.ink,
          fontSize: "clamp(1.75rem, 5vw, 2.5rem)",
          lineHeight: 1.4, letterSpacing: "0.08em",
          textAlign: "center", maxWidth: 600,
        }}
      >
        髪を整えると、<br />気持ちも少し軽くなる。
      </h1>
      <p
        className={shippori.className}
        style={{
          marginTop: 32, color: T.sub,
          fontSize: "clamp(0.875rem, 1.5vw, 1rem)",
          lineHeight: 2.0, letterSpacing: "0.04em",
          textAlign: "center", maxWidth: 400,
        }}
      >
        そういうことを、大切にしています。
      </p>
    </section>
  );
}

/* ═══════════════════════════════════════
   Section 3: 鏡の写真（呼吸）
   Phase 3: 60vh, 写真1枚, テキストなし
   ═══════════════════════════════════════ */
function MirrorSection() {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <section style={{ padding: "0 24px", backgroundColor: T.wall }}>
      <div
        ref={ref}
        style={{
          maxWidth: 480, margin: "0 auto",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(8px)",
          transition: `opacity ${T.durStandard} ${T.ease}, transform ${T.durStandard} ${T.ease}`,
        }}
      >
        <div style={{ position: "relative", aspectRatio: "3/4" }}>
          <Image
            src="/images/lumiere/mirror.jpg"
            alt="鏡越しの店内"
            fill
            sizes="(max-width: 767px) 100vw, 480px"
            style={{ objectFit: "cover", filter: "saturate(0.8) contrast(0.95) brightness(1.05)" }}
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════
   Section 4: Style Gallery
   Phase 3: 2col mobile / 3col desktop, gap 4px
   ═══════════════════════════════════════ */
function StyleSection() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  return (
    <>
      <section id="style" style={{ padding: "128px 24px 0", backgroundColor: T.wall }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p className={cormorant.className} style={{ fontSize: 14, letterSpacing: "0.12em", color: T.sub, marginBottom: 32 }}>
            Style
          </p>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 4,
          }}
          className="md:!grid-cols-3"
          >
            {STYLES.map((s, i) => (
              <StyleCard key={s.id} style={s} index={i} onClick={() => setSelectedIndex(i)} />
            ))}
          </div>
        </div>
      </section>

      {/* Fullscreen lightbox — Phase 4b: 漆喰白背景 */}
      {selectedIndex !== null && (
        <StyleLightbox
          styles={STYLES}
          currentIndex={selectedIndex}
          onClose={() => setSelectedIndex(null)}
          onNavigate={setSelectedIndex}
        />
      )}
    </>
  );
}

function StyleCard({ style, index, onClick }: { style: typeof STYLES[0]; index: number; onClick: () => void }) {
  const { ref, visible } = useReveal<HTMLButtonElement>("0px 0px -10% 0px"); // StyleCard uses button
  return (
    <button
      ref={ref}
      onClick={onClick}
      style={{
        position: "relative", aspectRatio: "3/4", border: "none", padding: 0,
        cursor: "pointer", overflow: "hidden", background: T.paper,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(8px)",
        transition: `opacity ${T.durStandard} ${T.ease} ${index * 100}ms, transform ${T.durStandard} ${T.ease} ${index * 100}ms`,
      }}
      className="lm-style-card"
      aria-label={`${style.title}を拡大表示`}
    >
      <Image
        src={style.image}
        alt={style.title}
        fill
        sizes="(max-width: 767px) 50vw, 33vw"
        style={{ objectFit: "cover", filter: "saturate(0.8) contrast(0.95) brightness(1.05)" }}
        loading="lazy"
      />
    </button>
  );
}

function StyleLightbox({ styles, currentIndex, onClose, onNavigate }: {
  styles: typeof STYLES;
  currentIndex: number;
  onClose: () => void;
  onNavigate: (i: number) => void;
}) {
  const s = styles[currentIndex];

  // Swipe support
  const touchStart = useRef(0);
  const handleTouchStart = useCallback((e: React.TouchEvent) => { touchStart.current = e.touches[0].clientX; }, []);
  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentIndex < styles.length - 1) onNavigate(currentIndex + 1);
      if (diff < 0 && currentIndex > 0) onNavigate(currentIndex - 1);
    }
  }, [currentIndex, styles.length, onNavigate]);

  // Keyboard
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" && currentIndex < styles.length - 1) onNavigate(currentIndex + 1);
      if (e.key === "ArrowLeft" && currentIndex > 0) onNavigate(currentIndex - 1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [currentIndex, styles.length, onClose, onNavigate]);

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 60,
        backgroundColor: T.wall,
        display: "flex", flexDirection: "column",
        animation: `fadeIn ${T.durStandard} ${T.ease}`,
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div style={{ display: "flex", justifyContent: "flex-end", padding: "16px 24px" }}>
        <button
          onClick={onClose}
          className={shippori.className}
          style={{ fontSize: 13, color: T.sub, background: "none", border: "none", cursor: "pointer", letterSpacing: "0.04em" }}
        >
          閉じる
        </button>
      </div>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 24px 64px" }}>
        <div style={{ position: "relative", width: "100%", maxWidth: 480, aspectRatio: "3/4" }}>
          <Image
            key={s.id}
            src={s.image}
            alt={s.title}
            fill
            sizes="(max-width: 767px) 100vw, 480px"
            style={{
              objectFit: "cover",
              filter: "saturate(0.8) contrast(0.95) brightness(1.05)",
              animation: `fadeIn 200ms ${T.ease}`,
            }}
            priority
          />
        </div>
      </div>
      <div style={{ padding: "0 24px 32px", textAlign: "center" }}>
        <p className={shippori.className} style={{ fontSize: 13, color: T.sub }}>
          {currentIndex + 1} / {styles.length}
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   Section 6: People — スタイリスト + スタッフ
   Phase 3: 120vh, 人柄で信頼を形成
   ═══════════════════════════════════════ */
function PeopleSection() {
  const ownerReveal = useReveal<HTMLDivElement>();

  return (
    <section id="people" style={{ padding: "0 24px 128px", backgroundColor: T.wall }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <p className={cormorant.className} style={{ fontSize: 14, letterSpacing: "0.12em", color: T.sub, marginBottom: 64 }}>
          People
        </p>

        {/* Owner */}
        <div
          ref={ownerReveal.ref}
          style={{
            opacity: ownerReveal.visible ? 1 : 0,
            transform: ownerReveal.visible ? "translateY(0)" : "translateY(8px)",
            transition: `opacity ${T.durStandard} ${T.ease}, transform ${T.durStandard} ${T.ease}`,
          }}
        >
          <div style={{ width: 280, maxWidth: "100%", aspectRatio: "1/1", position: "relative", backgroundColor: T.paper }}>
            <Image
              src="/images/lumiere/stylist.jpg"
              alt={SALON.ceo}
              fill
              sizes="280px"
              style={{ objectFit: "cover", filter: "saturate(0.8) contrast(0.95) brightness(1.05)" }}
              loading="lazy"
            />
          </div>
          <div style={{ marginTop: 24 }}>
            <h3 className={cormorant.className} style={{ fontSize: "clamp(1.375rem, 3vw, 1.75rem)", fontWeight: 400, letterSpacing: "0.06em", color: T.ink }}>
              {SALON.ceo}
            </h3>
            <p className={shippori.className} style={{ fontSize: 13, color: T.sub, marginTop: 6, letterSpacing: "0.04em" }}>
              {SALON.ceoTitle}
            </p>
          </div>
          <p className={shippori.className} style={{ fontSize: 16, lineHeight: 2.0, color: T.ink, marginTop: 24, letterSpacing: "0.04em", maxWidth: 480 }}>
            {SALON.bio.split("\n\n").map((para, i) => (
              <span key={i}>{i > 0 && <><br /><br /></>}{para}</span>
            ))}
          </p>
        </div>

        {/* Staff */}
        {STAFF.map((staff, i) => (
          <StaffCard key={staff.name} staff={staff} align={i % 2 === 0 ? "right" : "left"} />
        ))}
      </div>
    </section>
  );
}

function StaffCard({ staff, align }: { staff: typeof STAFF[0]; align: "left" | "right" }) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <>
      <SignatureLine width={80} duration={600} />
      <div
        ref={ref}
        style={{
          display: "flex", flexDirection: "column",
          alignItems: align === "right" ? "flex-end" : "flex-start",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(8px)",
          transition: `opacity ${T.durStandard} ${T.ease}, transform ${T.durStandard} ${T.ease}`,
        }}
      >
        <div style={{ width: 240, maxWidth: "100%", aspectRatio: "3/4", position: "relative", backgroundColor: T.paper }}>
          <Image
            src={staff.image}
            alt={staff.name}
            fill
            sizes="240px"
            style={{ objectFit: "cover", filter: "saturate(0.8) contrast(0.95) brightness(1.05)" }}
            loading="lazy"
          />
        </div>
        <div style={{ marginTop: 16, textAlign: align }}>
          <h4 className={cormorant.className} style={{ fontSize: 20, fontWeight: 400, letterSpacing: "0.06em", color: T.ink }}>
            {staff.name}
          </h4>
          <p className={shippori.className} style={{ fontSize: 13, color: T.sub, marginTop: 6 }}>
            {staff.role}
          </p>
          <p className={shippori.className} style={{ fontSize: 15, lineHeight: 2.0, color: T.ink, marginTop: 16, maxWidth: 360, letterSpacing: "0.04em" }}>
            {staff.note}
          </p>
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════
   Section 7: Menu / Price / Access
   Phase 3: 実務情報。演出なし。
   ═══════════════════════════════════════ */
function MenuSection() {
  return (
    <section id="menu" style={{ padding: "128px 24px", backgroundColor: T.wall }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        {/* Menu */}
        <p className={cormorant.className} style={{ fontSize: 14, letterSpacing: "0.12em", color: T.sub, marginBottom: 16 }}>
          Menu
        </p>
        <p className={shippori.className} style={{ fontSize: 16, lineHeight: 2.0, color: T.ink, marginBottom: 48, letterSpacing: "0.04em" }}>
          まず、お話を聞かせてください。<br />メニューは、そのあとに決まります。
        </p>

        {/* Menu background image */}
        <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", marginBottom: 48, backgroundColor: T.paper }}>
          <Image
            src="/images/lumiere/menu-bg.jpg"
            alt=""
            fill
            sizes="720px"
            style={{ objectFit: "cover", filter: "saturate(0.8) contrast(0.95) brightness(1.05) blur(2px)" }}
            loading="lazy"
          />
        </div>

        {MENU.map((cat) => (
          <div key={cat.category} style={{ marginBottom: 48 }}>
            <h3 className={cormorant.className} style={{ fontSize: 20, fontWeight: 400, letterSpacing: "0.06em", color: T.ink, marginBottom: 16 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                {cat.category === "Cut" && (
                  <Image src="/images/lumiere/icon-scissors.png" alt="" width={20} height={20} style={{ opacity: 0.7 }} />
                )}
                {cat.category}
              </span>
            </h3>
            {cat.items.map((item) => (
              <div
                key={item.name}
                className={shippori.className}
                style={{
                  display: "flex", justifyContent: "space-between", alignItems: "baseline",
                  padding: "12px 0",
                  borderBottom: `1px solid ${T.paper}`,
                  fontSize: 15, color: T.ink, letterSpacing: "0.04em",
                }}
              >
                <span>{item.name}</span>
                <span style={{ color: T.sub, fontSize: 13 }}>{item.time}</span>
              </div>
            ))}
          </div>
        ))}

        {/* Signature line between Menu and Price */}
        <SignatureLine />

        {/* Price */}
        <p className={cormorant.className} style={{ fontSize: 14, letterSpacing: "0.12em", color: T.sub, marginBottom: 16 }}>
          Price
        </p>
        <p className={shippori.className} style={{ fontSize: 15, color: T.sub, marginBottom: 32, letterSpacing: "0.04em" }}>
          表示価格は全て税込です。
        </p>

        {PRICES.map((item) => (
          <div
            key={item.name}
            style={{
              display: "flex", justifyContent: "space-between", alignItems: "baseline",
              padding: "12px 0",
              borderBottom: `1px solid ${T.paper}`,
            }}
          >
            <span className={shippori.className} style={{ fontSize: 15, color: T.ink, letterSpacing: "0.04em" }}>
              {item.name}
            </span>
            <span
              className={cormorant.className}
              style={{
                fontSize: 16, fontWeight: 400, color: T.ink,
                minWidth: "7ch", textAlign: "right",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {item.price}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function AccessSection() {
  return (
    <section id="access" style={{ padding: "0 24px 128px", backgroundColor: T.wall }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <p className={cormorant.className} style={{ fontSize: 14, letterSpacing: "0.12em", color: T.sub, marginBottom: 32 }}>
          Access
        </p>

        <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 16 }}>
          <Image src="/images/lumiere/icon-pin.png" alt="" width={20} height={20} style={{ opacity: 0.7, marginTop: 2 }} />
          <p className={shippori.className} style={{ fontSize: 15, color: T.ink, letterSpacing: "0.04em", lineHeight: 1.8 }}>
            {SALON.address}
          </p>
        </div>

        <p className={shippori.className} style={{ fontSize: 15, color: T.ink, letterSpacing: "0.04em", marginBottom: 8 }}>
          表参道駅 A2出口から徒歩4分
        </p>
        <p className={shippori.className} style={{ fontSize: 13, color: T.sub, letterSpacing: "0.04em", marginBottom: 32 }}>
          A2出口を出て右へ。2つ目の角を左折、白いビルの2階です。
        </p>

        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <Image src="/images/lumiere/icon-clock.png" alt="" width={20} height={20} style={{ opacity: 0.7 }} />
          <p className={shippori.className} style={{ fontSize: 15, color: T.ink, letterSpacing: "0.04em" }}>
            {SALON.hours}
          </p>
        </div>

        {/* Map */}
        {SALON.mapEmbedUrl && (
          <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", marginTop: 32 }}>
            <iframe
              src={SALON.mapEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0, filter: "saturate(0.5) brightness(1.1)" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="LUMIÈRE へのアクセス"
            />
          </div>
        )}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════
   Section 8: CTA — 最後の一押し
   Phase 3: 朝→夕のストーリー完結
   ═══════════════════════════════════════ */
function CTASection() {
  const { ref, visible } = useReveal<HTMLDivElement>("0px 0px -30% 0px");

  return (
    <section style={{ position: "relative", minHeight: "80vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
      {/* Background: evening light */}
      <div
        ref={ref}
        style={{
          position: "absolute", inset: 0,
          opacity: visible ? 1 : 0,
          transition: `opacity ${T.durSlow} ${T.ease}`,
        }}
      >
        <Image
          src="/images/lumiere/cta-bg.jpg"
          alt=""
          fill
          sizes="100vw"
          style={{ objectFit: "cover", filter: "saturate(0.7) contrast(0.9) brightness(1.1)" }}
          loading="lazy"
        />
        <div style={{
          position: "absolute", inset: 0,
          background: `linear-gradient(transparent 40%, ${T.wall} 100%)`,
        }} />
      </div>

      {/* Content */}
      <div style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "64px 24px" }}>
        <h2
          className={cormorant.className}
          style={{
            fontWeight: 300, color: T.ink,
            fontSize: "clamp(1.5rem, 4vw, 2.25rem)",
            lineHeight: 1.4, letterSpacing: "0.08em",
          }}
        >
          あなたの席を、<br />ご用意しています。
        </h2>
        <div style={{ marginTop: 48 }}>
          <Link
            href="/portfolio-templates/lumiere/reserve"
            className={`${cormorant.className} lm-cta-link`}
            style={{
              fontSize: 16, fontWeight: 400, letterSpacing: "0.08em",
              color: T.ink, textDecoration: "none",
              display: "inline-flex", alignItems: "center", gap: 12,
            }}
          >
            予約する
            <Image src="/images/lumiere/icon-arrow.png" alt="" width={24} height={24} style={{ opacity: 0.8 }} />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════
   Footer — Phase 3: 裏面
   ═══════════════════════════════════════ */
function Footer() {
  const displayName = usePreviewName(SALON.name);
  return (
    <footer style={{ backgroundColor: T.paper, padding: "48px 24px" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <p className={shippori.className} style={{ fontSize: 13, color: T.sub, lineHeight: 1.8, letterSpacing: "0.02em" }}>
            {SALON.address}
          </p>
          <p className={shippori.className} style={{ fontSize: 13, color: T.sub, letterSpacing: "0.02em" }}>
            {SALON.hours}
          </p>
          <p className={shippori.className} style={{ fontSize: 13, color: T.sub, letterSpacing: "0.02em" }}>
            {SALON.phone}
          </p>
          <a
            href="#"
            className={shippori.className}
            style={{ fontSize: 13, color: T.sub, textDecoration: "none", letterSpacing: "0.02em" }}
          >
            Instagram
          </a>
        </div>
        <div style={{ marginTop: 48, borderTop: `1px solid ${T.line}`, paddingTop: 24 }}>
          <p className={shippori.className} style={{ fontSize: 11, color: T.mute, letterSpacing: "0.02em" }}>
            © {new Date().getFullYear()} {displayName}
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════
   Page — 全セクション統合
   ═══════════════════════════════════════ */
export default function LumierePage() {
  return (
    <div className={`${cormorant.variable} ${shippori.variable}`} style={{ backgroundColor: T.wall }}>
      {/* Global styles for interactions */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Nav link hover — 署名の線の縮小版 */
        .lm-nav-link::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 50%;
          right: 50%;
          height: 1px;
          background-color: ${T.line};
          transition: left 180ms ${T.ease}, right 180ms ${T.ease};
        }
        .lm-nav-link:hover::after,
        .lm-nav-link:focus-visible::after {
          left: 0;
          right: 0;
        }

        /* CTA link hover — 触れると染まる */
        .lm-cta-link {
          transition: color ${T.durSubtle} ${T.ease};
        }
        .lm-cta-link:hover {
          color: ${T.accent} !important;
        }

        /* Style card hover — 光が差し込む */
        .lm-style-card {
          transition: opacity ${T.durStandard} ${T.ease};
        }
        @media (hover: hover) {
          .lm-style-card:hover img {
            opacity: 1 !important;
            filter: saturate(0.85) contrast(0.97) brightness(1.08) !important;
          }
        }

        /* Focus visible */
        .lm-nav-link:focus-visible,
        .lm-cta-link:focus-visible {
          outline: 2px solid ${T.accent};
          outline-offset: 4px;
        }
        .lm-style-card:focus-visible {
          outline: 2px solid ${T.line};
          outline-offset: 2px;
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

        /* Responsive grid override */
        @media (min-width: 768px) {
          .md\\:!grid-cols-3 {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
      `}</style>

      <GrainOverlay />
      <DemoBanner />
      <Header />
      <main>
        <HeroSection />
        <BrandStatementSection />
        <MirrorSection />
        <StyleSection />
        <SignatureLine />
        <PeopleSection />
        <MenuSection />
        <AccessSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
