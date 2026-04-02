import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "こんなサイトが、980円。｜しくみや",
  description:
    "外注すると5〜10万円のギャラリーサイトが、フォーム入力だけで¥980。AIアーティスト向け。",
  openGraph: {
    title: "こんなサイトが、980円。｜しくみや",
    description:
      "外注すると5〜10万円のギャラリーサイトが¥980。フォーム入力だけで完成。",
    images: ["/lp-impact.webp"],
    type: "website",
    siteName: "しくみや by Lyo Vision",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary_large_image",
    title: "こんなサイトが、980円。｜しくみや",
    description:
      "外注すると5〜10万円のギャラリーサイトが¥980。フォーム入力だけで完成。",
    images: ["/lp-impact.webp"],
    creator: "@ando_lyo",
  },
};

export default function LPImpactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
