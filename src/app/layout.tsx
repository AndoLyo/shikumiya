import type { Metadata } from "next";
import { Playfair_Display, Noto_Sans_JP, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const notoSansJP = Noto_Sans_JP({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: "しくみや｜AIでコンテンツ制作を自動化する仕組みと作り方",
  description:
    "SNS投稿・記事執筆・サムネ設計をAIエージェントで自動化。その仕組みと作り方を、すべて公開しています。",
  openGraph: {
    title: "しくみや｜AIでコンテンツ制作を自動化する仕組みと作り方",
    description:
      "SNS投稿・記事執筆・サムネ設計をAIエージェントで自動化。その仕組みと作り方を、すべて公開しています。",
    type: "website",
    siteName: "しくみや by Lyo Vision",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary_large_image",
    title: "しくみや｜AIでコンテンツ制作を自動化する仕組みと作り方",
    description:
      "SNS投稿・記事執筆・サムネ設計をAIエージェントで自動化。仕組みと作り方をすべて公開。",
    creator: "@ando_lyo",
  },
  metadataBase: new URL("https://lyo-vision.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${playfair.variable} ${notoSansJP.variable} ${jetbrainsMono.variable} antialiased`}
    >
      <body className="min-h-screen bg-[#0a0a0f] text-white font-sans overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
