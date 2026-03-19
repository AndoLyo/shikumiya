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
  title: "Lyo Vision — AI Art & Autonomous Systems",
  description:
    "AIアートプロンプトエンジニア Lyo のポートフォリオ＆活動拠点。3年間の研究と自律型AIエージェント開発の軌跡。",
  openGraph: {
    title: "Lyo Vision — AI Art & Autonomous Systems",
    description:
      "AIアートプロンプトエンジニア Lyo のポートフォリオ＆活動拠点",
    type: "website",
  },
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
