import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%)",
          borderRadius: "36px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <div
            style={{
              fontSize: "80px",
              fontWeight: "bold",
              color: "#00e5ff",
              lineHeight: 1,
              textShadow: "0 0 20px rgba(0, 229, 255, 0.5)",
            }}
          >
            L
          </div>
          <div
            style={{
              width: "40px",
              height: "2px",
              background: "linear-gradient(90deg, transparent, #d4a853, transparent)",
            }}
          />
        </div>
      </div>
    ),
    { ...size }
  );
}
