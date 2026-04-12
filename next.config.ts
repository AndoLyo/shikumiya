import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      // C1: /order → /start（旧申込フロー）
      { source: "/order", destination: "/start", permanent: true },
      { source: "/order/:path*", destination: "/start", permanent: true },
      // C2: /preview → /start（旧プレビュー）
      { source: "/preview/:path*", destination: "/start", permanent: true },
      // C3: /templates → /start（旧テンプレート一覧）
      { source: "/templates", destination: "/start", permanent: true },
      { source: "/templates/:path*", destination: "/start", permanent: true },
      // C4: /portfolio → /（旧ポートフォリオ）
      { source: "/portfolio", destination: "/", permanent: true },
      // C5: /lp/impact → /lp/construction（旧AIアーティスト向けLP）
      { source: "/lp/impact", destination: "/lp/construction", permanent: true },
      // E1: /lp → /lp/construction（旧LP。¥980表記が残存）
      { source: "/lp", destination: "/lp/construction", permanent: true },
      // E2: 旧アートテンプレ10種 → /start（建築SaaSと無関係）
      { source: "/portfolio-templates/pastel-pop", destination: "/start", permanent: true },
      { source: "/portfolio-templates/retro-pop", destination: "/start", permanent: true },
      { source: "/portfolio-templates/comic-panel", destination: "/start", permanent: true },
      { source: "/portfolio-templates/cyber-neon", destination: "/start", permanent: true },
      { source: "/portfolio-templates/dark-elegance", destination: "/start", permanent: true },
      { source: "/portfolio-templates/floating-gallery", destination: "/start", permanent: true },
      { source: "/portfolio-templates/ink-wash", destination: "/start", permanent: true },
      { source: "/portfolio-templates/mosaic-bold", destination: "/start", permanent: true },
      { source: "/portfolio-templates/studio-white", destination: "/start", permanent: true },
      { source: "/portfolio-templates/watercolor-soft", destination: "/start", permanent: true },
      // C6: /test → /（テストページ）
      { source: "/test", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
