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
  title: "しくみや｜ホームページ制作 制作費0円・月額3,000円から",
  description:
    "全業種対応のホームページ制作SaaS。制作費0円、月額3,000円から。写真を送るだけで最短翌日完成。独自ドメイン全プラン対応。",
  keywords: ["ホームページ制作 安い", "ホームページ制作 0円", "ウェブサイト制作 月額", "工務店 ホームページ", "建設会社 ホームページ"],
  openGraph: {
    title: "しくみや｜ホームページ制作 制作費0円・月額3,000円から",
    description:
      "写真を送るだけでホームページが完成。制作費0円、月額3,000円から。全業種対応。",
    type: "website",
    siteName: "しくみや by Lyo Vision",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary_large_image",
    title: "しくみや｜ホームページ制作 制作費0円",
    description:
      "写真を送るだけでホームページが完成。制作費0円、月額3,000円から。全業種対応。",
    creator: "@shikumiya_ai",
  },
  metadataBase: new URL("https://lyo-vision.com"),
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: "しくみや",
      url: "https://lyo-vision.com",
      description: "建築業向けホームページ制作サービス。制作費0円、月額3,000円から。",
    },
    {
      "@type": "Service",
      name: "しくみや ホームページ制作",
      provider: {
        "@type": "Organization",
        name: "しくみや by Lyo Vision",
        url: "https://lyo-vision.com",
      },
      description: "工務店・建設会社・設計事務所のホームページ制作。写真を送るだけで最短翌日完成。制作費0円。",
      offers: [
        {
          "@type": "Offer",
          name: "おまかせプラン",
          price: "3000",
          priceCurrency: "JPY",
          description: "テンプレート選択、施工写真10枚、会社概要、お問い合わせフォーム、独自ドメイン対応。月額。",
        },
        {
          "@type": "Offer",
          name: "まるっとおまかせプラン",
          price: "8000",
          priceCurrency: "JPY",
          description: "施工実績詳細、お客様の声、ブログ、Google Maps、SEO強化。月額。",
        },
        {
          "@type": "Offer",
          name: "ぜんぶおまかせプラン",
          price: "15000",
          priceCurrency: "JPY",
          description: "AIチャットボット、予約システム、採用ページ、多言語対応、360°ビューア。月額。",
        },
      ],
      areaServed: { "@type": "Country", name: "JP" },
      serviceType: "ウェブサイト制作",
    },
    {
      "@type": "Person",
      name: "Lyo",
      jobTitle: "Webサイトデザイナー / クリエイター",
      url: "https://lyo-vision.com",
      sameAs: [
        "https://note.com/ando_lyo_ai",
        "https://x.com/ando_lyo",
        "https://github.com/ando-lyo",
        "https://www.instagram.com/ando_lyo_ai/",
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "ホームページはどのくらいで完成しますか？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "写真をお送りいただいてから最短翌日で完成します。制作費は0円、月額3,000円からご利用いただけます。",
          },
        },
        {
          "@type": "Question",
          name: "解約したらサイトは消えますか？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "解約月末までサイトは公開されます。再開はいつでも可能です。データは一定期間保管されます。",
          },
        },
        {
          "@type": "Question",
          name: "パソコンが苦手でも大丈夫ですか？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "はい。写真を送るだけで、あとは全部おまかせです。更新や変更もこちらで対応します。",
          },
        },
      ],
    },
  ],
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
