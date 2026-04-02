import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "あなた専用のギャラリーサイト｜しくみや",
  description:
    "AIアーティスト向けギャラリーサイト制作。フォーム入力だけで完成、¥980から。ポートフォリオサイトとは何かも丁寧に解説。",
  openGraph: {
    title: "あなた専用のギャラリーサイト｜しくみや",
    description:
      "フォーム入力だけであなただけのギャラリーサイトが完成。¥980から。",
    images: ["/lp-service.webp"],
    type: "website",
    siteName: "しくみや by Lyo Vision",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary_large_image",
    title: "あなた専用のギャラリーサイト｜しくみや",
    description:
      "フォーム入力だけであなただけのギャラリーサイトが完成。¥980から。",
    images: ["/lp-service.webp"],
    creator: "@ando_lyo",
  },
};

export default function LPLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
