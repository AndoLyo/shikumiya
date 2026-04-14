import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "施工実績が映えるホームページ｜月0円から｜しくみや",
  description:
    "工務店・リフォーム会社向けホームページ制作。写真を送るだけでプロ品質のサイトが完成。月額0円、最短翌日公開。",
  openGraph: {
    title: "施工実績が映えるホームページ｜月0円から｜しくみや",
    description:
      "写真を送るだけでプロ品質のホームページが完成。月額0円から。",
    type: "website",
    siteName: "しくみや by Lyo Vision",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary_large_image",
    title: "施工実績が映えるホームページ｜月0円から｜しくみや",
    description:
      "写真を送るだけでプロ品質のホームページが完成。月額0円から。",
    creator: "@ando_lyo",
  },
};

export default function ConstructionLPLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
