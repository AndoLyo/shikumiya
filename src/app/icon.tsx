import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
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
          borderRadius: "6px",
        }}
      >
        <div
          style={{
            fontSize: "20px",
            fontWeight: "bold",
            color: "#00e5ff",
            textShadow: "0 0 8px rgba(0, 229, 255, 0.6)",
          }}
        >
          L
        </div>
      </div>
    ),
    { ...size }
  );
}
