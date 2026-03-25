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
  title: "Lyo Vision — しくみや｜AIで仕組みを作り、全部公開する人",
  description:
    "コード書けない個人事業主がAI24体で事業を回している。Claude Code × 自律型AIエージェント × SNS自動化の全記録。",
  openGraph: {
    title: "Lyo Vision — しくみや｜AIで仕組みを作り、全部公開する人",
    description:
      "コード書けない個人事業主がAI24体で事業を回している。Claude Code × 自律型AIエージェント × SNS自動化の全記録。",
    type: "website",
    siteName: "Lyo Vision",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lyo Vision — しくみや｜AIで仕組みを作り、全部公開する人",
    description:
      "AIで仕組みを作り、全部公開する人｜しくみや Lyo Vision",
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
