/**
 * site.config.json のTypeScript型定義
 *
 * 全テンプレート共通のデータスキーマ。
 * テンプレートのpage.tsxはこの型のデータを受け取って描画する。
 * 顧客のデータ変更はこのJSONを更新するだけで即反映される。
 */

/* ═══════════════════════════════════════
   会社情報（全テンプレート共通）
   ═══════════════════════════════════════ */
export interface CompanyInfo {
  name: string;               // 山田工務店
  nameEn?: string;            // YAMADA CONSTRUCTION（trust-navy用）
  tagline: string;            // 家族の暮らしに寄り添う家づくり
  description: string;        // サイトの説明文
  phone: string;
  fax?: string;
  email: string;
  address: string;
  hours: string;              // 9:00〜18:00（日曜・祝日定休）
  since: string;              // 1996
  ceo: string;                // 代表者名
  ceoTitle?: string;          // 一級建築士 / 代表取締役
  bio: string;                // 代表挨拶（改行は\n\nで区切る）
  license?: string;           // 許認可
  capital?: string;           // 資本金
  employees?: string;         // 従業員数
  iso?: string;               // ISO認証
  domain: string;             // yamada-koumuten.jp
  ceoPhoto?: string;          // /images/ceo.jpg
  mapEmbedUrl?: string;       // Google Maps embed URL
}

/* ═══════════════════════════════════════
   施工実績 / 作品
   ═══════════════════════════════════════ */
export interface Project {
  id: number;
  title: string;              // 世田谷の家
  titleEn?: string;           // House in Setagaya（clean-arch用）
  category: string;           // 新築 / リフォーム / 住宅 / 店舗
  year: string;               // 2025
  description: string;
  specs?: string;             // 木造2階建 / 延床面積 120㎡ / 4LDK
  image?: string;             // /images/work-1.jpg
  // ミドル以上
  client?: string;            // S様ご家族
  beforeDesc?: string;        // Before説明
  afterDesc?: string;         // After説明
  // clean-arch用
  size?: "landscape" | "portrait" | "square";
}

/* ═══════════════════════════════════════
   強み / サービス
   ═══════════════════════════════════════ */
export interface Strength {
  title: string;
  description: string;
  icon?: string;              // lucide-reactのアイコン名: "Home" | "Shield" | etc.
}

export interface Service {
  title: string;
  description: string;
  icon?: string;
}

/* ═══════════════════════════════════════
   お客様の声（ミドル以上）
   ═══════════════════════════════════════ */
export interface Testimonial {
  name: string;               // S様（世田谷区）
  project: string;            // 新築
  text: string;
  rating?: number;            // 1-5
}

/* ═══════════════════════════════════════
   ニュース / お知らせ（ミドル以上）
   ═══════════════════════════════════════ */
export interface NewsItem {
  date: string;               // 2025.04.05
  category: string;           // 完成見学会 / お知らせ / メディア
  title: string;
}

/* ═══════════════════════════════════════
   受賞歴（clean-arch用）
   ═══════════════════════════════════════ */
export interface Award {
  year: string;
  title: string;
  project: string;
}

/* ═══════════════════════════════════════
   数字実績（trust-navy用）
   ═══════════════════════════════════════ */
export interface Stat {
  num: string;                // 50
  unit: string;               // 年
  label: string;              // 創業からの歴史
}

/* ═══════════════════════════════════════
   予約イベント（プレミアム）
   ═══════════════════════════════════════ */
export interface BookingEvent {
  id: number;
  date: string;               // 4/19（土）
  time: string;               // 10:00〜16:00
  title: string;
  location: string;
  spots: number;
}

/* ═══════════════════════════════════════
   AIチャットボットFAQ（プレミアム）
   ═══════════════════════════════════════ */
export interface ChatFAQ {
  question: string;
  answer: string;
}

/* ═══════════════════════════════════════
   採用情報（trust-navy-pro用）
   ═══════════════════════════════════════ */
export interface JobPosting {
  id: string;
  title: string;              // 施工管理（建築）
  type: string;               // 正社員
  location: string;
  salary: string;
  description: string;
  duties: string[];
  requirements: string[];
  preferred: string[];
  licenses: string[];
}

/* ═══════════════════════════════════════
   スタイル設定
   ═══════════════════════════════════════ */
export interface StyleConfig {
  colors: {
    primary: string;          // #7BA23F
    accent: string;           // #D4A76A
    background: string;       // #FAF7F2
    text: string;             // #3D3226
    textMuted: string;        // #8B7D6B
    border: string;           // #E8DFD3
  };
  fonts: {
    heading: string;          // "'Noto Sans JP', sans-serif"
    body: string;
  };
  sizes: {
    heading: "sm" | "md" | "lg";
    body: "sm" | "md" | "lg";
  };
  weights: {
    heading: "normal" | "bold" | "light";
    body: "normal" | "bold";
  };
}

/* ═══════════════════════════════════════
   メイン設定（全体）
   ═══════════════════════════════════════ */
export interface SiteConfig {
  // メタ情報
  templateId: string;         // warm-craft | trust-navy | clean-arch
  plan: "otameshi" | "omakase" | "omakase-pro";
  orderId: string;
  siteUrl: string;

  // 会社情報
  company: CompanyInfo;

  // コンテンツ
  projects: Project[];
  strengths: Strength[];
  services?: Service[];       // trust-navy用
  stats?: Stat[];             // trust-navy用

  // おまかせ以上
  testimonials?: Testimonial[];
  news?: NewsItem[];
  awards?: Award[];           // clean-arch用

  // おまかせプロ
  bookingEvents?: BookingEvent[];
  chatFAQs?: ChatFAQ[];
  jobs?: JobPosting[];        // trust-navy-pro用

  // スタイル
  style: StyleConfig;
}

/* ═══════════════════════════════════════
   デフォルト値
   ═══════════════════════════════════════ */
export const DEFAULT_STYLE: Record<string, StyleConfig> = {
  "warm-craft": {
    colors: { primary: "#7BA23F", accent: "#D4A76A", background: "#FAF7F2", text: "#3D3226", textMuted: "#8B7D6B", border: "#E8DFD3" },
    fonts: { heading: "'Noto Sans JP', sans-serif", body: "'Noto Sans JP', sans-serif" },
    sizes: { heading: "lg", body: "md" },
    weights: { heading: "bold", body: "normal" },
  },
  "trust-navy": {
    colors: { primary: "#1B3A5C", accent: "#C8A96E", background: "#F0F4F8", text: "#1B3A5C", textMuted: "#6B7B8D", border: "#D1D9E3" },
    fonts: { heading: "'Noto Sans JP', sans-serif", body: "'Noto Sans JP', sans-serif" },
    sizes: { heading: "lg", body: "md" },
    weights: { heading: "bold", body: "normal" },
  },
  "clean-arch": {
    colors: { primary: "#333333", accent: "#999999", background: "#FFFFFF", text: "#333333", textMuted: "#999999", border: "#E5E5E5" },
    fonts: { heading: "'Noto Sans JP', sans-serif", body: "'Noto Sans JP', sans-serif" },
    sizes: { heading: "lg", body: "md" },
    weights: { heading: "light", body: "normal" },
  },
};
