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
  weight: ["400", "500", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "しくみや｜AIでコンテンツ制作を自動化する仕組みと作り方",
  description:
    "SNS投稿・記事執筆・サムネ設計をAIエージェントで自動化。コードが書けなくても仕組みは作れる。その作り方を、失敗も含めてすべて公開しています。",
  openGraph: {
    title: "しくみや｜AIでコンテンツ制作を自動化する仕組みと作り方",
    description:
      "SNS投稿・記事執筆・サムネ設計をAIエージェントで自動化。コードが書けなくても仕組みは作れる。その作り方を、失敗も含めてすべて公開しています。",
    type: "website",
    siteName: "しくみや by Lyo Vision",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary_large_image",
    title: "しくみや｜AIでコンテンツ制作を自動化する仕組みと作り方",
    description:
      "SNS投稿・記事執筆・サムネ設計をAIエージェントで自動化。コードが書けなくても仕組みは作れる。その作り方を、失敗も含めてすべて公開しています。",
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
      <body className="min-h-screen bg-[#0a0a0f] text-text-primary font-sans overflow-x-hidden">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "しくみや by Lyo Vision",
              url: "https://lyo-vision.com",
              description: "AIでコンテンツ制作を自動化する仕組みと作り方を公開",
              founder: {
                "@type": "Person",
                name: "Lyo",
              },
              sameAs: [
                "https://note.com/ando_lyo_ai",
                "https://x.com/ando_lyo",
                "https://github.com/ando-lyo",
                "https://www.instagram.com/ando_lyo_ai/",
              ],
            }),
          }}
        />
        {children}
      </body>
    </html>
  );
}
