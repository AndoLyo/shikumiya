"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Check, Camera, Send } from "lucide-react";
import type { SiteConfig } from "@/lib/site-config-schema";

/**
 * clean-arch テンプレートの描画コンポーネント
 * site.config.json のデータを props で受け取って描画
 */

const archGradients = [
  ["#D4CFC5", "#C4B8A6"], ["#C8C2B5", "#B8AE96"],
  ["#D1CBC1", "#BFB7A5"], ["#CCC7BC", "#BAB2A0"],
  ["#D6D0C6", "#C6BDA9"], ["#C9C3B6", "#B5AD9A"],
  ["#D2CCC2", "#C0B8A6"], ["#CDCAB9", "#BDB5A3"],
];

interface Props {
  config: SiteConfig;
  editMode?: boolean;
  onFieldClick?: (fieldId: string, currentValue: string, fieldType: "text" | "image") => void;
  changedFields?: Set<string>;
}

export default function CleanArchRenderer({ config, editMode = false, onFieldClick, changedFields }: Props) {
  const c = config.company;
  const name = c.nameEn || c.name;
  const works = config.projects.map((p, i) => ({
    id: p.id, title: p.titleEn || p.title, titleJa: p.title,
    year: p.year, type: p.category, desc: p.description,
    size: (p.size || "landscape") as string,
    colors: archGradients[i % archGradients.length],
  }));

  const [submitted, setSubmitted] = useState(false);

  function E({ fieldId, value, type = "text", children }: {
    fieldId: string; value: string; type?: "text" | "image"; children: React.ReactNode;
  }) {
    if (!editMode) return <>{children}</>;
    const changed = changedFields?.has(fieldId);
    return (
      <div
        data-field-id={fieldId}
        onClick={(e) => { e.stopPropagation(); onFieldClick?.(fieldId, value, type); }}
        style={{
          cursor: "pointer", position: "relative", borderRadius: 4,
          outline: changed ? "2px solid #6c5ce7" : "1px dashed transparent",
          transition: "outline 0.15s",
        }}
        onMouseEnter={(e) => { if (!changed) (e.currentTarget as HTMLElement).style.outline = "1px dashed #a29bfe"; }}
        onMouseLeave={(e) => { if (!changed) (e.currentTarget as HTMLElement).style.outline = "1px dashed transparent"; }}
      >
        {changed && (
          <div style={{ position: "absolute", top: -6, right: -6, zIndex: 10, width: 16, height: 16, borderRadius: "50%", background: "#6c5ce7", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Check size={9} color="#fff" />
          </div>
        )}
        {children}
      </div>
    );
  }

  return (
    <div style={{ background: "#fff", fontFamily: "system-ui, sans-serif" }}>

      {/* ── Header ── */}
      <header style={{
        position: editMode ? "relative" : "sticky", top: 0, zIndex: 40,
        background: "rgba(255,255,255,0.95)", backdropFilter: "blur(8px)",
      }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 24px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <E fieldId="company.name" value={c.name}>
            <span style={{ fontSize: 14, fontWeight: 300, letterSpacing: "0.25em", color: "#333" }}>{name}</span>
          </E>
          <nav style={{ display: "flex", gap: 32, fontSize: 12, letterSpacing: "0.15em", color: "#999" }}>
            {["WORKS", "ABOUT", "CONTACT"].map((l) => (
              <a key={l} href={`#${l.toLowerCase()}`} style={{ color: "#999", textDecoration: "none" }}>{l}</a>
            ))}
          </nav>
        </div>
        <div style={{ height: 1, background: "#f0f0f0" }} />
      </header>

      {/* ── Hero ── */}
      <section style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#fff" }}>
        <div style={{ textAlign: "center", padding: "48px 24px" }}>
          <p style={{ color: "#ccc", fontSize: 10, letterSpacing: "0.5em", marginBottom: 24 }}>
            ARCHITECTURE + DESIGN
          </p>
          <E fieldId="company.tagline" value={c.tagline}>
            <h1 style={{ color: "#333", fontWeight: 300, lineHeight: 1.5, fontSize: "clamp(1.8rem, 5vw, 3.5rem)", letterSpacing: "0.08em" }}>
              {c.tagline}
            </h1>
          </E>
          <div style={{ width: 48, height: 1, background: "#ddd", margin: "24px auto" }} />
          <E fieldId="company.description" value={c.description}>
            <p style={{ color: "#999", fontSize: 14, letterSpacing: "0.1em" }}>
              {c.name}<span style={{ margin: "0 12px", color: "#ddd" }}>|</span>{c.description}
            </p>
          </E>
        </div>
      </section>

      {/* ── Works ── */}
      <section id="works" style={{ padding: "64px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <div style={{ marginBottom: 48 }}>
            <p style={{ color: "#ccc", fontSize: 10, letterSpacing: "0.4em", marginBottom: 8 }}>SELECTED WORKS</p>
            <h2 style={{ color: "#333", fontSize: 24, fontWeight: 300, letterSpacing: "0.1em" }}>作品一覧</h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
            {works.map((w, i) => (
              <E key={w.id} fieldId={`projects.${i}.title`} value={w.titleJa}>
                <div style={{ overflow: "hidden", cursor: "pointer" }}>
                  <svg viewBox="0 0 800 500" style={{ width: "100%", display: "block" }}>
                    <rect width="800" height="500" fill="#EDEBE5" />
                    <rect y="420" width="800" height="80" fill={w.colors[1]} opacity="0.3" />
                    <rect x="200" y="200" width="400" height="220" fill={w.colors[0]} />
                    <rect x="200" y="190" width="400" height="15" fill={w.colors[1]} />
                    <rect x="240" y="230" width="160" height="160" fill="white" opacity="0.4" />
                  </svg>
                  <div style={{ padding: "12px 4px" }}>
                    <p style={{ fontSize: 14, fontWeight: 300, color: "#333", letterSpacing: "0.1em" }}>{w.title}</p>
                    <p style={{ fontSize: 11, color: "#999", marginTop: 2 }}>{w.type}　{w.year}</p>
                  </div>
                </div>
              </E>
            ))}
          </div>
        </div>
      </section>

      {/* ── About ── */}
      <section id="about" style={{ padding: "64px 24px", background: "#fff", borderTop: "1px solid #f0f0f0" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <p style={{ color: "#ccc", fontSize: 10, letterSpacing: "0.4em", marginBottom: 48 }}>ABOUT</p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48 }}>
            <div>
              <div style={{ width: "100%", aspectRatio: "3/4", background: "linear-gradient(to bottom, #E8E4DC, #D4CFC5)", borderRadius: 0 }}>
                <svg viewBox="0 0 400 530" style={{ width: "100%", height: "100%" }}>
                  <rect width="400" height="530" fill="#E0DCD4" />
                  <circle cx="200" cy="180" r="60" fill="#C4B8A6" />
                  <ellipse cx="200" cy="370" rx="80" ry="100" fill="#C4B8A6" />
                </svg>
              </div>
              <div style={{ marginTop: 16 }}>
                <E fieldId="company.ceo" value={c.ceo || ""}>
                  <h3 style={{ fontSize: 18, fontWeight: 300, color: "#333", letterSpacing: "0.1em" }}>{c.ceo}</h3>
                </E>
                <p style={{ fontSize: 12, color: "#999", marginTop: 4, letterSpacing: "0.1em" }}>{c.ceoTitle || ""}</p>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <E fieldId="company.bio" value={c.bio}>
                <div style={{ fontSize: 14, color: "#666", lineHeight: 2.4 }}>
                  {c.bio.split("\n\n").map((para, i) => (
                    <p key={i} style={{ marginBottom: i > 0 ? 0 : 16 }}>{para}</p>
                  ))}
                </div>
              </E>

              <div style={{ width: 32, height: 1, background: "#ddd", margin: "24px 0" }} />

              <div style={{ fontSize: 12, color: "#999" }}>
                <E fieldId="company.address" value={c.address}>
                  <p style={{ marginBottom: 8 }}>所在地: {c.address}</p>
                </E>
                <p>設立: {c.since}年</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Contact ── */}
      <section id="contact" style={{ padding: "64px 24px", background: "#fff", borderTop: "1px solid #f0f0f0" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <p style={{ color: "#ccc", fontSize: 10, letterSpacing: "0.4em", marginBottom: 16 }}>CONTACT</p>
          <p style={{ fontSize: 14, color: "#666", marginBottom: 32, lineHeight: 1.8 }}>
            お気軽にお問い合わせください。
          </p>

          <div style={{ display: "flex", gap: 12, marginBottom: 32 }}>
            <a href={`mailto:${c.email}`} style={{
              flex: 1, display: "flex", alignItems: "center", gap: 8,
              padding: "12px 16px", border: "1px solid #ddd", fontSize: 13, color: "#666", textDecoration: "none",
            }}>
              <Mail size={14} color="#ccc" /> {c.email}
            </a>
            <a href={`tel:${c.phone}`} style={{
              flex: 1, display: "flex", alignItems: "center", gap: 8,
              padding: "12px 16px", border: "1px solid #ddd", fontSize: 13, color: "#666", textDecoration: "none",
            }}>
              <Phone size={14} color="#ccc" /> {c.phone}
            </a>
          </div>

          {submitted ? (
            <div style={{ textAlign: "center", padding: "40px 0", border: "1px solid #f0f0f0" }}>
              <Check size={20} color="#999" style={{ margin: "0 auto 8px" }} />
              <p style={{ fontSize: 14, fontWeight: 300, color: "#333" }}>送信ありがとうございます</p>
              <p style={{ fontSize: 11, color: "#999", marginTop: 4 }}>3営業日以内にご返信いたします。</p>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label style={{ fontSize: 10, color: "#ccc", letterSpacing: "0.2em", display: "block", marginBottom: 6 }}>お名前</label>
                  <input type="text" placeholder="高橋 花子" style={{ width: "100%", padding: "10px 0", border: "none", borderBottom: "1px solid #ddd", fontSize: 14, color: "#333", outline: "none", background: "transparent" }} />
                </div>
                <div>
                  <label style={{ fontSize: 10, color: "#ccc", letterSpacing: "0.2em", display: "block", marginBottom: 6 }}>メール</label>
                  <input type="email" placeholder="hello@example.com" style={{ width: "100%", padding: "10px 0", border: "none", borderBottom: "1px solid #ddd", fontSize: 14, color: "#333", outline: "none", background: "transparent" }} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: 10, color: "#ccc", letterSpacing: "0.2em", display: "block", marginBottom: 6 }}>ご相談内容</label>
                <textarea rows={4} placeholder="ご計画の概要をお聞かせください。" style={{ width: "100%", padding: "10px 0", border: "none", borderBottom: "1px solid #ddd", fontSize: 14, color: "#333", outline: "none", background: "transparent", resize: "none" }} />
              </div>
              <button type="submit" style={{
                width: "100%", padding: "14px", background: "#333", color: "#fff",
                fontSize: 12, letterSpacing: "0.2em", border: "none", cursor: "pointer",
              }}>
                SEND MESSAGE
              </button>
            </form>
          )}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ padding: "24px", borderTop: "1px solid #f0f0f0", background: "#fff" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p style={{ fontSize: 12, fontWeight: 300, letterSpacing: "0.25em", color: "#999" }}>{name}</p>
            <p style={{ fontSize: 10, color: "#ccc", marginTop: 2 }}>{c.address}</p>
          </div>
          <p style={{ fontSize: 10, color: "#ccc" }}>© {new Date().getFullYear()} {c.name}</p>
        </div>
      </footer>
    </div>
  );
}
