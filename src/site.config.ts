// ============================================================
// site.config.ts — このファイルだけ書き換えれば、あなたのサイトが完成します
// ============================================================

export const siteConfig = {
  // ---------- 基本情報 ----------
  name: "Your Name",                        // あなたの名前・アーティスト名
  siteTitle: "Your Name — AI Art Portfolio", // ブラウザタブに表示されるタイトル
  description: "AI画像生成で世界観を紡ぐアーティスト。Midjourney・Stable Diffusion・Fluxで制作。",
  url: "https://your-domain.com",           // デプロイ後のURL（なければそのままでOK）
  lang: "ja",                               // "ja" or "en"

  // ---------- テーマカラー ----------
  // お好みの色に変更してください（HEX形式）
  colors: {
    primary: "#00e5ff",    // メインの差し色（シアン系）
    accent: "#d4a853",     // サブの差し色（ゴールド系）
    background: "#0a0a0f", // 背景色（ダーク）
  },

  // ---------- Hero セクション ----------
  hero: {
    tagline: "AI Art Portfolio",               // 小さいタグライン
    catchcopy: "AIで、世界観を紡ぐ。",           // キャッチコピー
    subtitle: "Creating Worlds with AI",       // 英語サブタイトル
    description: "Midjourney・Stable Diffusion・Fluxなどを駆使し、ファンタジーからサイバーパンクまで幅広い世界観を表現しています。",
    backgroundImage: "/images/hero.webp",      // Hero背景画像（public/images/に配置）
    cta: {
      text: "作品を見る",
      href: "#gallery",
    },
  },

  // ---------- Gallery セクション ----------
  // public/images/ に画像を配置して、ここにパスとタイトルを追加するだけ
  gallery: {
    title: "GALLERY",
    subtitle: "作品ギャラリー",
    description: "AI画像生成ツールで制作した作品コレクション。",
    works: [
      { src: "/images/work_01.webp", title: "作品タイトル 01" },
      { src: "/images/work_02.webp", title: "作品タイトル 02" },
      { src: "/images/work_03.webp", title: "作品タイトル 03" },
      { src: "/images/work_04.webp", title: "作品タイトル 04" },
      { src: "/images/work_05.webp", title: "作品タイトル 05" },
      { src: "/images/work_06.webp", title: "作品タイトル 06" },
      { src: "/images/work_07.webp", title: "作品タイトル 07" },
      { src: "/images/work_08.webp", title: "作品タイトル 08" },
      // ↓ 作品を追加するときはここにコピペして増やす
      // { src: "/images/work_09.webp", title: "作品タイトル 09" },
    ],
    initialDisplay: 8, // 最初に表示する枚数（残りは「もっと見る」で展開）
  },

  // ---------- About セクション ----------
  about: {
    title: "ABOUT",
    subtitle: "アーティストについて",
    image: "/images/about.webp",          // プロフィール画像
    paragraphs: [
      "ここにあなたの自己紹介を書いてください。どんなアーティストで、何を作っているのか。",
      "AIアートとの出会い、こだわり、使用ツールなど、あなたのストーリーを伝えましょう。",
    ],
    quote: "あなたの好きな言葉やモットーをここに。",
    tools: ["Midjourney", "Stable Diffusion", "Flux", "Magnific AI"], // 使用ツール
  },

  // ---------- Contact セクション ----------
  contact: {
    title: "CONTACT",
    subtitle: "お問い合わせ・SNS",
    description: "お仕事のご依頼・コラボレーション・ご質問はお気軽にどうぞ。",
    email: "your-email@example.com", // メールアドレス（不要なら空文字""にする）
    social: [
      { label: "X (Twitter)", href: "https://x.com/your_handle" },
      { label: "Instagram", href: "https://instagram.com/your_handle" },
      // { label: "Pixiv", href: "https://pixiv.net/users/your_id" },
      // { label: "note", href: "https://note.com/your_id" },
      // ↓ 他のSNSを追加するときはここにコピペ
    ],
  },

  // ---------- ナビゲーション ----------
  nav: [
    { label: "Gallery", href: "#gallery" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ],

  // ---------- フッター ----------
  footer: {
    credit: "Built with Next.js — Template by Lyo Vision",
    copyright: `© ${new Date().getFullYear()} Your Name. All rights reserved.`,
  },
};

export type SiteConfig = typeof siteConfig;
