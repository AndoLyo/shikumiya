"use client";

import { useState } from "react";
import { Mail, Phone, Check, Send } from "lucide-react";
import type { SiteConfig } from "@/lib/site-config-schema";

/**
 * clean-arch テンプレートの描画コンポーネント（本物に忠実な再現版）
 * 全テキスト・全画像が編集可能
 */

const archGradients = [
  ["#D4CFC5", "#C4B8A6"], ["#C8C2B5", "#B8AE96"],
  ["#D1CBC1", "#BFB7A5"], ["#CCC7BC", "#BAB2A0"],
  ["#D6D0C6", "#C6BDA9"], ["#C9C3B6", "#B5AD9A"],
  ["#D2CCC2", "#C0B8A6"], ["#CDCAB9", "#BDB5A3"],
];

const archPatterns = [
  (c1: string, c2: string) => (
    <>
      <rect x="200" y="200" width="400" height="220" fill={c1} />
      <rect x="200" y="190" width="400" height="15" fill={c2} />
      <rect x="240" y="230" width="160" height="160" fill="white" opacity="0.4" />
      <line x1="320" y1="230" x2="320" y2="390" stroke={c2} strokeWidth="1.5" />
      <rect x="460" y="280" width="100" height="140" fill={c2} opacity="0.6" />
    </>
  ),
  (c1: string, c2: string) => (
    <>
      <rect x="150" y="260" width="200" height="160" fill={c1} />
      <rect x="350" y="180" width="250" height="240" fill={c2} opacity="0.9" />
      <rect x="180" y="290" width="80" height="100" fill="white" opacity="0.35" />
      <rect x="390" y="210" width="60" height="80" fill="white" opacity="0.35" />
    </>
  ),
  (c1: string, c2: string) => (
    <>
      <rect x="100" y="280" width="600" height="120" fill={c1} />
      <rect x="100" y="270" width="600" height="14" fill={c2} />
      <rect x="140" y="300" width="200" height="80" fill="white" opacity="0.4" />
      <rect x="420" y="310" width="60" height="90" fill={c2} opacity="0.5" />
    </>
  ),
  (c1: string, c2: string) => (
    <>
      <rect x="200" y="150" width="180" height="270" fill={c1} />
      <rect x="380" y="220" width="220" height="200" fill={c2} opacity="0.85" />
      <rect x="230" y="180" width="120" height="80" fill="white" opacity="0.4" />
    </>
  ),
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
    pattern: i % archPatterns.length,
  }));

  const [submitted, setSubmitted] = useState(false);

  /* 編集可能ラッパー */
  function E({ fieldId, value, type = "text" as "text" | "image", children }: {
    fieldId: string; value: string; type?: "text" | "image"; children: React.ReactNode;
  }) {
    if (!editMode) return <>{children}</>;
    const changed = changedFields?.has(fieldId);
    return (
      <div
        data-field-id={fieldId}
        onClick={(e) => { e.stopPropagation(); onFieldClick?.(fieldId, value, type); }}
        style={{
          cursor: "pointer", position: "relative",
          borderRadius: 2,
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
    <div
      style={{ background: "#fff", fontFamily: "system-ui, -apple-system, sans-serif", color: "#333" }}
      onClick={(e) => {
        // 編集モード時、aタグのリンク遷移を無効化
        if (editMode && (e.target as HTMLElement).closest("a")) {
          e.preventDefault();
        }
      }}
    >

      {/* ═══ Header ═══ */}
      <header style={{
        position: editMode ? "relative" : "sticky", top: 0, zIndex: 50,
        backgroundColor: "rgba(255,255,255,0.95)", backdropFilter: "blur(12px)",
      }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 24px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <E fieldId="company.nameEn" value={c.nameEn || c.name}>
            <span style={{ fontSize: 14, fontWeight: 300, letterSpacing: "0.25em", color: "#333" }}>{name}</span>
          </E>
          <nav style={{ display: "flex", alignItems: "center", gap: 32 }}>
            {[["WORKS", "#works"], ["ABOUT", "#about"], ["CONTACT", "#contact"]].map(([label, href]) => (
              <a key={href} href={href} style={{ fontSize: 12, letterSpacing: "0.15em", color: "#aaa", textDecoration: "none", transition: "color 0.2s" }}>{label}</a>
            ))}
          </nav>
        </div>
        <div style={{ width: "100%", height: 1, backgroundColor: "#f0f0f0" }} />
      </header>

      {/* ═══ Hero — フルスクリーン ═══ */}
      <section style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#fff" }}>
        <div style={{ textAlign: "center", padding: "48px 24px", maxWidth: 800 }}>
          <p style={{ color: "#ccc", fontSize: 10, letterSpacing: "0.5em", marginBottom: 32 }}>
            ARCHITECTURE + DESIGN
          </p>

          <E fieldId="company.tagline" value={c.tagline}>
            <h1 style={{ color: "#333", fontWeight: 300, lineHeight: 1.5, fontSize: "clamp(2rem, 6vw, 4rem)", letterSpacing: "0.08em", margin: 0 }}>
              {c.tagline}
            </h1>
          </E>

          <div style={{ width: 48, height: 1, backgroundColor: "#ddd", margin: "28px auto" }} />

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
            <E fieldId="company.name" value={c.name}>
              <span style={{ color: "#aaa", fontSize: 14, letterSpacing: "0.1em" }}>{c.name}</span>
            </E>
            <span style={{ color: "#ddd" }}>|</span>
            <E fieldId="company.description" value={c.description}>
              <span style={{ color: "#aaa", fontSize: 14, letterSpacing: "0.1em" }}>{c.description}</span>
            </E>
          </div>
        </div>
      </section>

      {/* ═══ Works ═══ */}
      <section id="works" style={{ padding: "80px 24px", backgroundColor: "#fff" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 48 }}>
            <p style={{ color: "#ccc", fontSize: 10, letterSpacing: "0.4em" }}>SELECTED WORKS</p>
            <h2 style={{ color: "#333", fontSize: 24, fontWeight: 300, letterSpacing: "0.1em", margin: 0 }}>作品一覧</h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 12 }}>
            {works.map((w, i) => {
              const [c1, c2] = w.colors;
              const PatternSvg = archPatterns[w.pattern];
              return (
                <div key={w.id} style={{ overflow: "hidden" }}>
                  <E fieldId={`projects.${i}.image`} value="" type="image">
                    <div style={{
                      height: w.size === "portrait" ? 400 : w.size === "square" ? 260 : 260,
                      overflow: "hidden",
                    }}>
                      <svg viewBox="0 0 800 500" style={{ width: "100%", height: "100%", display: "block" }} xmlns="http://www.w3.org/2000/svg">
                        <rect width="800" height="500" fill="#EDEBE5" />
                        <rect y="420" width="800" height="80" fill={c2} opacity="0.3" />
                        {PatternSvg(c1, c2)}
                        <circle cx={650 + (i % 3) * 20} cy={380} r={20 + (i % 2) * 8} fill={c2} opacity="0.25" />
                      </svg>
                    </div>
                  </E>

                  <div style={{ padding: "12px 4px 24px" }}>
                    <E fieldId={`projects.${i}.title`} value={w.titleJa}>
                      <p style={{ fontSize: 14, fontWeight: 300, color: "#333", letterSpacing: "0.1em", margin: "0 0 2px" }}>{w.title}</p>
                    </E>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", margin: "2px 0 0" }}>
                      <E fieldId={`projects.${i}.category`} value={w.type}>
                        <span style={{ fontSize: 11, color: "#aaa" }}>{w.type}</span>
                      </E>
                      <E fieldId={`projects.${i}.year`} value={w.year}>
                        <span style={{ fontSize: 11, color: "#aaa" }}>{w.year}</span>
                      </E>
                    </div>
                    <E fieldId={`projects.${i}.description`} value={w.desc}>
                      <p style={{ fontSize: 13, color: "#888", marginTop: 8, lineHeight: 1.8 }}>{w.desc}</p>
                    </E>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ About ═══ */}
      <section id="about" style={{ padding: "80px 24px", backgroundColor: "#fff", borderTop: "1px solid #f0f0f0" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <p style={{ color: "#ccc", fontSize: 10, letterSpacing: "0.4em", marginBottom: 48 }}>ABOUT</p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48 }}>
            {/* Portrait */}
            <div>
              <E fieldId="company.ceoPhoto" value="" type="image">
                <div style={{ width: "100%", aspectRatio: "3/4", overflow: "hidden" }}>
                  <svg viewBox="0 0 400 530" style={{ width: "100%", height: "100%", display: "block" }} xmlns="http://www.w3.org/2000/svg">
                    <rect width="400" height="530" fill="#E0DCD4" />
                    <circle cx="200" cy="180" r="60" fill="#C4B8A6" />
                    <ellipse cx="200" cy="370" rx="80" ry="100" fill="#C4B8A6" />
                    <line x1="50" y1="480" x2="350" y2="480" stroke="#D4CFC5" strokeWidth="1" />
                    <text x="200" y="520" textAnchor="middle" fill="#B8AE96" fontSize="11" fontFamily="sans-serif" letterSpacing="0.2em">PORTRAIT</text>
                  </svg>
                </div>
              </E>
              <div style={{ marginTop: 20 }}>
                <E fieldId="company.ceo" value={c.ceo || ""}>
                  <h3 style={{ fontSize: 20, fontWeight: 300, color: "#333", letterSpacing: "0.1em", margin: 0 }}>{c.ceo}</h3>
                </E>
                <E fieldId="company.ceoTitle" value={c.ceoTitle || ""}>
                  <p style={{ fontSize: 12, color: "#aaa", letterSpacing: "0.1em", marginTop: 6 }}>{c.ceoTitle || ""}</p>
                </E>
              </div>
            </div>

            {/* Bio + Info */}
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <E fieldId="company.bio" value={c.bio}>
                <div style={{ fontSize: 14, color: "#666", lineHeight: 2.4 }}>
                  {c.bio.split("\n\n").map((para, i) => (
                    <p key={i} style={{ margin: 0, marginTop: i > 0 ? 20 : 0 }}>{para}</p>
                  ))}
                </div>
              </E>

              <div style={{ width: 32, height: 1, backgroundColor: "#ddd", margin: "32px 0" }} />

              <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 12, color: "#aaa" }}>
                {[
                  { label: "設立", fieldId: "company.since", value: `${c.since}年` },
                  { label: "所在地", fieldId: "company.address", value: c.address },
                  { label: "資格", fieldId: "company.ceoTitle", value: c.ceoTitle || "" },
                  { label: "登録", fieldId: "company.license", value: c.license || "" },
                ].filter(item => item.value).map((item) => (
                  <E key={item.fieldId} fieldId={item.fieldId} value={item.value}>
                    <div style={{ display: "flex", gap: 24 }}>
                      <span style={{ width: 48, color: "#ccc", flexShrink: 0 }}>{item.label}</span>
                      <span>{item.value}</span>
                    </div>
                  </E>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Contact ═══ */}
      <section id="contact" style={{ padding: "80px 24px", backgroundColor: "#fff", borderTop: "1px solid #f0f0f0" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <p style={{ color: "#ccc", fontSize: 10, letterSpacing: "0.4em", marginBottom: 16 }}>CONTACT</p>

          <p style={{ fontSize: 14, color: "#888", lineHeight: 1.8, marginBottom: 40 }}>
            お気軽にお問い合わせください。
          </p>

          {/* 連絡先 */}
          <div style={{ display: "flex", gap: 12, marginBottom: 40 }}>
            <E fieldId="company.email" value={c.email}>
              <a href={`mailto:${c.email}`} style={{
                flex: 1, display: "flex", alignItems: "center", gap: 12,
                padding: "14px 16px", border: "1px solid #e5e5e5",
                fontSize: 14, color: "#666", textDecoration: "none",
              }}>
                <Mail size={16} color="#ccc" strokeWidth={1.5} />
                {c.email}
              </a>
            </E>
            <E fieldId="company.phone" value={c.phone}>
              <a href={`tel:${c.phone}`} style={{
                flex: 1, display: "flex", alignItems: "center", gap: 12,
                padding: "14px 16px", border: "1px solid #e5e5e5",
                fontSize: 14, color: "#666", textDecoration: "none",
              }}>
                <Phone size={16} color="#ccc" strokeWidth={1.5} />
                {c.phone}
              </a>
            </E>
          </div>

          {/* フォーム */}
          {submitted ? (
            <div style={{ textAlign: "center", padding: "48px 0", border: "1px solid #f0f0f0" }}>
              <div style={{ width: 48, height: 48, border: "1px solid #e5e5e5", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                <Check size={20} color="#aaa" />
              </div>
              <p style={{ fontSize: 15, fontWeight: 300, color: "#333", letterSpacing: "0.05em" }}>送信ありがとうございます</p>
              <p style={{ fontSize: 12, color: "#aaa", marginTop: 4 }}>3営業日以内にご返信いたします。</p>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                {[
                  { label: "お名前", placeholder: "高橋 花子", type: "text" },
                  { label: "メールアドレス", placeholder: "hello@example.com", type: "email" },
                ].map((f) => (
                  <div key={f.label}>
                    <label style={{ display: "block", fontSize: 10, color: "#ccc", letterSpacing: "0.2em", marginBottom: 8 }}>{f.label}</label>
                    <input type={f.type} placeholder={f.placeholder} style={{
                      width: "100%", padding: "10px 0", border: "none", borderBottom: "1px solid #e5e5e5",
                      fontSize: 14, color: "#333", outline: "none", background: "transparent",
                    }} />
                  </div>
                ))}
              </div>
              <div>
                <label style={{ display: "block", fontSize: 10, color: "#ccc", letterSpacing: "0.2em", marginBottom: 8 }}>ご相談内容</label>
                <textarea rows={5} placeholder="ご計画の概要をお聞かせください。" style={{
                  width: "100%", padding: "10px 0", border: "none", borderBottom: "1px solid #e5e5e5",
                  fontSize: 14, color: "#333", outline: "none", background: "transparent", resize: "none",
                }} />
              </div>
              <button type="submit" style={{
                width: "100%", padding: "14px", backgroundColor: "#333", color: "#fff",
                fontSize: 12, letterSpacing: "0.2em", border: "none", cursor: "pointer",
              }}>
                SEND MESSAGE
              </button>
              <p style={{ fontSize: 10, color: "#ccc", textAlign: "center" }}>※ 3営業日以内にご返信いたします</p>
            </form>
          )}

          <div style={{ marginTop: 40, fontSize: 12, color: "#ccc", letterSpacing: "0.15em" }}>
            Instagram
          </div>
        </div>
      </section>

      {/* ═══ Footer ═══ */}
      <footer style={{ padding: "28px 24px", borderTop: "1px solid #f0f0f0", backgroundColor: "#fff" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <span style={{ fontSize: 12, fontWeight: 300, letterSpacing: "0.25em", color: "#aaa" }}>{name}</span>
            <E fieldId="company.address" value={c.address}>
              <span style={{ fontSize: 10, color: "#ccc" }}>{c.address}</span>
            </E>
          </div>
          <p style={{ fontSize: 10, color: "#ccc" }}>© {new Date().getFullYear()} {c.name}</p>
        </div>
      </footer>
    </div>
  );
}
