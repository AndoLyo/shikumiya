"use client";

import { useState } from "react";
import Link from "next/link";
import { Cormorant_Garamond, Shippori_Mincho } from "next/font/google";
import DemoBanner from "@/components/portfolio-templates/DemoBanner";

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

const T = {
  ink: "#3D3630",
  sub: "#7A7267",
  mute: "#8A7F73",
  accent: "#8B6F5C",
  line: "#D4CEC6",
  paper: "#EDE8E0",
  wall: "#F6F3EE",
  ease: "cubic-bezier(0.25, 0.1, 0.25, 1.0)",
};

const MENUS = [
  "Cut",
  "Cut + Shampoo & Blow",
  "Full Color",
  "Highlight",
  "Color + Cut",
  "Moisture Treatment",
  "Deep Repair",
  "決まっていない",
];

export default function ReservePage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className={`${cormorant.variable} ${shippori.variable}`} style={{ backgroundColor: T.wall, minHeight: "100vh" }}>
      <style>{`
        .lm-input {
          width: 100%;
          padding: 12px 0;
          border: none;
          border-bottom: 1px solid ${T.line};
          background: transparent;
          color: ${T.ink};
          font-size: 15px;
          letter-spacing: 0.04em;
          outline: none;
          transition: border-color 150ms ${T.ease};
        }
        .lm-input::placeholder { color: ${T.mute}; }
        .lm-input:focus { border-bottom-color: ${T.ink}; }
        .lm-input:focus-visible {
          border-bottom-color: ${T.ink};
          box-shadow: -2px 0 0 0 ${T.accent};
        }
        .lm-select {
          width: 100%;
          padding: 12px 0;
          border: none;
          border-bottom: 1px solid ${T.line};
          background: transparent;
          color: ${T.ink};
          font-size: 15px;
          letter-spacing: 0.04em;
          outline: none;
          appearance: none;
          cursor: pointer;
          transition: border-color 150ms ${T.ease};
        }
        .lm-select:focus { border-bottom-color: ${T.ink}; }
        .lm-label {
          display: block;
          font-size: 13px;
          color: ${T.sub};
          letter-spacing: 0.04em;
          margin-bottom: 4px;
        }
        .lm-submit {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: none;
          border: none;
          color: ${T.accent};
          font-size: 16px;
          letter-spacing: 0.08em;
          cursor: pointer;
          padding: 12px 0;
          transition: opacity 150ms ${T.ease};
        }
        .lm-submit:hover { opacity: 0.7; }
        .lm-submit:active { opacity: 0.5; }
        .lm-submit:focus-visible {
          outline: 2px solid ${T.accent};
          outline-offset: 4px;
        }
        .lm-back {
          font-size: 13px;
          color: ${T.sub};
          text-decoration: none;
          letter-spacing: 0.04em;
          transition: color 150ms ${T.ease};
        }
        .lm-back:hover { color: ${T.accent}; }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      <DemoBanner />

      {/* Header */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        backgroundColor: `${T.wall}f2`, backdropFilter: "blur(8px)",
        borderBottom: `1px solid ${T.paper}`,
      }}>
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 24px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link
            href="/portfolio-templates/lumiere"
            className={`${cormorant.className} lm-back`}
          >
            ← LUMIÈRE
          </Link>
        </div>
      </header>

      <main style={{ maxWidth: 560, margin: "0 auto", padding: "64px 24px 128px" }}>
        {submitted ? (
          /* 送信完了 */
          <div style={{ textAlign: "center", animation: `fadeIn 300ms ${T.ease}` }}>
            <h1
              className={cormorant.className}
              style={{ fontWeight: 300, fontSize: "clamp(1.5rem, 4vw, 2rem)", letterSpacing: "0.08em", color: T.ink, marginBottom: 24 }}
            >
              ありがとうございます。
            </h1>
            <p className={shippori.className} style={{ fontSize: 15, lineHeight: 2.0, color: T.sub, letterSpacing: "0.04em" }}>
              24時間以内にお電話で<br />確認のご連絡をいたします。
            </p>
            <div style={{ marginTop: 48 }}>
              <Link
                href="/portfolio-templates/lumiere"
                className={`${cormorant.className} lm-back`}
                style={{ fontSize: 14 }}
              >
                ← トップページへ
              </Link>
            </div>
          </div>
        ) : (
          /* 予約フォーム */
          <>
            <h1
              className={cormorant.className}
              style={{
                fontWeight: 300,
                fontSize: "clamp(1.5rem, 4vw, 2rem)",
                letterSpacing: "0.08em",
                color: T.ink,
                marginBottom: 8,
              }}
            >
              ご予約
            </h1>
            <p className={shippori.className} style={{ fontSize: 13, color: T.sub, letterSpacing: "0.04em", marginBottom: 48 }}>
              内容を確認後、お電話でご連絡いたします。
            </p>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 32 }}>
              {/* 名前 */}
              <div>
                <label className={`${shippori.className} lm-label`} htmlFor="name">お名前</label>
                <input
                  id="name"
                  type="text"
                  required
                  placeholder="田中"
                  className={`${shippori.className} lm-input`}
                  autoComplete="family-name"
                />
              </div>

              {/* 電話番号 */}
              <div>
                <label className={`${shippori.className} lm-label`} htmlFor="phone">お電話番号</label>
                <input
                  id="phone"
                  type="tel"
                  required
                  placeholder="090-0000-0000"
                  className={`${shippori.className} lm-input`}
                  autoComplete="tel"
                />
              </div>

              {/* 希望日時 第1 */}
              <div>
                <label className={`${shippori.className} lm-label`} htmlFor="date1">希望日時（第1希望）</label>
                <input
                  id="date1"
                  type="datetime-local"
                  required
                  className={`${shippori.className} lm-input`}
                />
              </div>

              {/* 希望日時 第2 */}
              <div>
                <label className={`${shippori.className} lm-label`} htmlFor="date2">希望日時（第2希望）</label>
                <input
                  id="date2"
                  type="datetime-local"
                  className={`${shippori.className} lm-input`}
                />
              </div>

              {/* メニュー選択 */}
              <div>
                <label className={`${shippori.className} lm-label`} htmlFor="menu">メニュー</label>
                <select id="menu" className={`${shippori.className} lm-select`} defaultValue="">
                  <option value="" disabled>選択してください</option>
                  {MENUS.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              {/* ご要望 */}
              <div>
                <label className={`${shippori.className} lm-label`} htmlFor="note">ご要望</label>
                <textarea
                  id="note"
                  rows={4}
                  placeholder="なんでもどうぞ。"
                  className={`${shippori.className} lm-input`}
                  style={{ resize: "vertical" }}
                />
              </div>

              {/* 送信 */}
              <div style={{ paddingTop: 16 }}>
                <button type="submit" className={`${cormorant.className} lm-submit`}>
                  この内容で予約する →
                </button>
              </div>
            </form>

            <p className={shippori.className} style={{ fontSize: 12, color: T.mute, marginTop: 32, letterSpacing: "0.02em" }}>
              24時間以内にお電話で確認のご連絡をいたします。
            </p>
          </>
        )}
      </main>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
