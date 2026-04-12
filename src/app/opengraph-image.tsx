import { ImageResponse } from "next/og";

export const alt = "しくみや｜クリエイターのためのオリジナルサイト制作";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0a0a0f 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {/* Top accent line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg, transparent, #00e5ff, #d4a853, transparent)",
          }}
        />

        {/* Corner decorations */}
        <div style={{ position: "absolute", top: "40px", left: "40px", width: "60px", height: "60px", borderTop: "2px solid rgba(212, 168, 83, 0.4)", borderLeft: "2px solid rgba(212, 168, 83, 0.4)" }} />
        <div style={{ position: "absolute", bottom: "40px", right: "40px", width: "60px", height: "60px", borderBottom: "2px solid rgba(212, 168, 83, 0.4)", borderRight: "2px solid rgba(212, 168, 83, 0.4)" }} />

        {/* Subtitle */}
        <div style={{ fontSize: "18px", color: "#00e5ff", letterSpacing: "0.3em", marginBottom: "20px" }}>
          クリエイターのためのサイト制作
        </div>

        {/* Main title */}
        <div style={{ fontSize: "80px", fontWeight: "bold", color: "#ffffff", letterSpacing: "0.15em", textShadow: "0 0 40px rgba(0, 229, 255, 0.3)" }}>
          しくみや
        </div>

        {/* Decorative line */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "24px" }}>
          <div style={{ width: "60px", height: "1px", background: "rgba(0, 229, 255, 0.4)" }} />
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#00e5ff", boxShadow: "0 0 12px rgba(0, 229, 255, 0.6)" }} />
          <div style={{ width: "60px", height: "1px", background: "rgba(0, 229, 255, 0.4)" }} />
        </div>

        {/* Tagline */}
        <div style={{ fontSize: "20px", color: "#999999", marginTop: "28px", textAlign: "center" as const }}>
          あなただけのオリジナルサイト
        </div>

        {/* Description */}
        <div style={{ fontSize: "14px", color: "#666666", marginTop: "12px" }}>
          制作費0円のホームページ制作SaaS — by Lyo Vision
        </div>
      </div>
    ),
    { ...size }
  );
}
