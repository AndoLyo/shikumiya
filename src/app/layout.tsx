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
  title: "しくみや｜AIアーティストのためのギャラリーサイト制作",
  description:
    "AIアーティスト向けオリジナルギャラリーサイト制作。フォーム入力だけで完成、¥980から。テンプレート10種を公開中。",
  keywords: ["AIアーティスト", "ポートフォリオサイト", "AI画像", "ギャラリーサイト", "作成", "AIアート"],
  openGraph: {
    title: "しくみや｜AIアーティストのためのギャラリーサイト制作",
    description:
      "フォーム入力だけであなただけのギャラリーサイトが完成。¥980から。テンプレート10種を公開中。",
    type: "website",
    siteName: "しくみや by Lyo Vision",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary_large_image",
    title: "しくみや｜AIアーティストのためのギャラリーサイト制作",
    description:
      "フォーム入力だけであなただけのギャラリーサイトが完成。¥980から。テンプレート10種を公開中。",
    creator: "@ando_lyo",
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
      description: "AIアーティスト向けオリジナルギャラリーサイト制作サービス",
    },
    {
      "@type": "Service",
      name: "しくみや ギャラリーサイト制作",
      provider: {
        "@type": "Organization",
        name: "しくみや by Lyo Vision",
        url: "https://lyo-vision.com",
      },
      description: "AIアーティスト向けオリジナルギャラリーサイト制作。フォーム入力だけで完成。¥980買い切りから。",
      offers: [
        {
          "@type": "Offer",
          name: "テンプレートプラン",
          price: "980",
          priceCurrency: "JPY",
          description: "フォーム入力→サイト自動完成。買い切り。",
        },
        {
          "@type": "Offer",
          name: "おまかせプラン",
          price: "2980",
          priceCurrency: "JPY",
          description: "独自ドメイン・カスタマイズ無制限・会員コンテンツ付き。月額。",
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
          name: "サイトはどのくらいで完成しますか？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "テンプレートプラン（¥980）はフォーム入力後、最短で当日〜翌日に完成します。おまかせプラン（¥2,980/月）のカスタマイズは随時対応します。",
          },
        },
        {
          "@type": "Question",
          name: "解約したらサイトは消えますか？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "いいえ。解約後もサイトは公開されたまま残ります。カスタマイズや会員コンテンツの利用が停止されるだけです。再開はいつでも可能です。",
          },
        },
        {
          "@type": "Question",
          name: "コードの知識は必要ですか？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "一切不要です。フォームに名前・画像・SNSリンクなどを入力するだけでサイトが完成します。",
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
