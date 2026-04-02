/**
 * テンプレートごとの編集可能フィールド定義
 *
 * 用途:
 * 1. 注文フォーム — テンプレ選択時に質問内容を切り替え
 * 2. 会員ページの編集フォーム — テンプレに合った編集項目を表示
 * 3. order-watcher.mjs — Claude Code CLIに渡すプロンプト生成
 */

export interface FormField {
  id: string;
  label: string;
  type: "text" | "textarea" | "color" | "image" | "images" | "select" | "tags";
  placeholder?: string;
  help?: string;
  required?: boolean;
  maxLength?: number;
  options?: string[]; // select用
  max?: number; // images用（最大枚数）
  min?: number; // images用（最小枚数）
  section: "hero" | "works" | "about" | "contact" | "style" | "unique";
}

export interface TemplateFormDef {
  id: string;
  name: string;
  nameJa: string;
  description: string;
  sections: string[]; // このテンプレが持つセクション
  fields: FormField[];
}

// ━━━━━━━━━━━━━━━━━━━━
// 共通フィールド（全テンプレートで使う）
// ━━━━━━━━━━━━━━━━━━━━

const commonFields: FormField[] = [
  // Hero
  {
    id: "artistName",
    label: "アーティスト名",
    type: "text",
    placeholder: "例: Lyo",
    help: "サイトに表示される名前です",
    required: true,
    section: "hero",
  },
  {
    id: "catchcopy",
    label: "キャッチコピー",
    type: "text",
    placeholder: "例: 光と影で紡ぐ幻想世界",
    help: "サイトのトップに大きく表示されます",
    section: "hero",
  },
  {
    id: "subtitle",
    label: "サブタイトル",
    type: "text",
    placeholder: "例: AI Art Creator",
    help: "キャッチコピーの下に小さく表示されます",
    section: "hero",
  },

  // Works
  {
    id: "works",
    label: "作品画像",
    type: "images",
    help: "ギャラリーに表示されます。JPG/PNG/WebP、1枚5MBまで",
    required: true,
    min: 3,
    max: 10,
    section: "works",
  },

  // About
  {
    id: "bio",
    label: "自己紹介文",
    type: "textarea",
    placeholder: "例: AI画像生成を始めて3年。ファンタジーの世界観を中心に制作しています。",
    help: "あなたのことを教えてください",
    maxLength: 400,
    section: "about",
  },
  {
    id: "profileImage",
    label: "プロフィール画像",
    type: "image",
    help: "About欄に表示されます",
    section: "about",
  },
  {
    id: "motto",
    label: "好きな言葉・モットー",
    type: "text",
    placeholder: "例: 想像の先にある世界を描く",
    help: "About欄に引用として表示されます",
    section: "about",
  },

  // Contact
  {
    id: "email",
    label: "メールアドレス",
    type: "text",
    placeholder: "例: your-email@example.com",
    help: "問い合わせ先として表示されます",
    required: true,
    section: "contact",
  },
  {
    id: "snsX",
    label: "X (Twitter)",
    type: "text",
    placeholder: "https://x.com/your_handle",
    section: "contact",
  },
  {
    id: "snsInstagram",
    label: "Instagram",
    type: "text",
    placeholder: "https://instagram.com/your_handle",
    section: "contact",
  },
  {
    id: "snsPixiv",
    label: "Pixiv",
    type: "text",
    placeholder: "https://pixiv.net/users/your_id",
    section: "contact",
  },
  {
    id: "snsNote",
    label: "note",
    type: "text",
    placeholder: "https://note.com/your_id",
    section: "contact",
  },

  // Style
  {
    id: "colorPrimary",
    label: "メインカラー",
    type: "color",
    help: "アクセントカラーを選んでください",
    section: "style",
  },
  {
    id: "colorBackground",
    label: "背景色",
    type: "color",
    help: "サイト全体の背景色",
    section: "style",
  },
];

// ━━━━━━━━━━━━━━━━━━━━
// テンプレート固有フィールド
// ━━━━━━━━━━━━━━━━━━━━

const templateSpecificFields: Record<string, FormField[]> = {
  "warm-natural": [
    {
      id: "services",
      label: "サービス内容",
      type: "tags",
      placeholder: "例: デザイン, 開発, イラスト",
      help: "提供しているサービスをカンマ区切りで（3つまで）",
      max: 3,
      section: "unique",
    },
  ],
  "stack-cards": [
    {
      id: "skills",
      label: "スキル・得意分野",
      type: "tags",
      placeholder: "例: イラスト, 3Dモデリング, 写真",
      help: "スキルセクションに表示されます（最大6つ）",
      max: 6,
      section: "unique",
    },
  ],
  "minimal-grid": [
    {
      id: "workCategories",
      label: "作品カテゴリ",
      type: "tags",
      placeholder: "例: Fantasy, Portrait, Landscape",
      help: "ギャラリーのフィルター用カテゴリ",
      max: 5,
      section: "works",
    },
  ],
  "horizontal-scroll": [
    {
      id: "stats",
      label: "実績数字",
      type: "tags",
      placeholder: "例: 60+ Projects, 5 Years, 10 Awards",
      help: "Aboutセクションに表示される実績（3つ）",
      max: 3,
      section: "about",
    },
  ],
  "elegant-mono": [
    {
      id: "stats",
      label: "実績数字",
      type: "tags",
      placeholder: "例: 150+ Projects, 8 Years, 40+ Clients, 12 Awards",
      help: "Aboutセクションに表示される実績（4つ）",
      max: 4,
      section: "about",
    },
  ],
  "ai-art-portfolio": [
    {
      id: "tools",
      label: "使用ツール",
      type: "tags",
      placeholder: "例: Midjourney, Stable Diffusion, Flux",
      help: "About欄に表示されます",
      max: 8,
      section: "about",
    },
  ],
};

// ━━━━━━━━━━━━━━━━━━━━
// カラースキーム定義
// ━━━━━━━━━━━━━━━━━━━━

export const templateColorDefaults: Record<string, { primary: string; accent: string; background: string }> = {
  "cinematic-dark": { primary: "#00bbdd", accent: "#d42d83", background: "#0a0a1a" },
  "minimal-grid": { primary: "#A28D69", accent: "#A28D69", background: "#f5f3ef" },
  "warm-natural": { primary: "#fffe3e", accent: "#a28d69", background: "#f2eee7" },
  "horizontal-scroll": { primary: "#e63946", accent: "#EFE8D7", background: "#0a0a0a" },
  "elegant-mono": { primary: "#00bbdd", accent: "#d42d83", background: "#1a1a1a" },
  "ai-art-portfolio": { primary: "#00e5ff", accent: "#d4a853", background: "#0a0a0f" },
  "split-showcase": { primary: "#c9a96e", accent: "#f0ede6", background: "#111111" },
  "stack-cards": { primary: "#6366f1", accent: "#a78bfa", background: "#0c0c0c" },
  "neo-brutalist": { primary: "#ff5722", accent: "#2563eb", background: "#fffdf5" },
  "glass-morphism": { primary: "#8b5cf6", accent: "#06b6d4", background: "#0f0f1a" },
};

// ━━━━━━━━━━━━━━━━━━━━
// 全テンプレート定義を生成
// ━━━━━━━━━━━━━━━━━━━━

const templateMeta: Array<{ id: string; name: string; nameJa: string; description: string; sections: string[] }> = [
  { id: "cinematic-dark", name: "Cinematic Dark", nameJa: "シネマティック・ダーク", description: "没入感のあるフルスクリーン", sections: ["hero", "works", "about", "contact", "style"] },
  { id: "minimal-grid", name: "Minimal Grid", nameJa: "ミニマル・グリッド", description: "作品を主役にするグリッド", sections: ["hero", "works", "about", "contact", "style", "unique"] },
  { id: "warm-natural", name: "Warm Natural", nameJa: "ウォーム・ナチュラル", description: "温かみのあるカード型", sections: ["hero", "works", "about", "contact", "style", "unique"] },
  { id: "horizontal-scroll", name: "Horizontal Scroll", nameJa: "ホリゾンタル・スクロール", description: "横に流れるエディトリアル", sections: ["hero", "works", "about", "contact", "style"] },
  { id: "elegant-mono", name: "Elegant Mono", nameJa: "エレガント・モノ", description: "ギャラリーのような空間", sections: ["hero", "works", "about", "contact", "style"] },
  { id: "ai-art-portfolio", name: "AI Art Portfolio", nameJa: "AIアート・ポートフォリオ", description: "AIアート特化の世界観", sections: ["hero", "works", "about", "contact", "style"] },
  { id: "split-showcase", name: "Split Showcase", nameJa: "スプリット・ショーケース", description: "左右分割の構図美", sections: ["hero", "works", "about", "contact", "style"] },
  { id: "stack-cards", name: "Stack Cards", nameJa: "スタック・カード", description: "カードが重なるスクロール", sections: ["hero", "works", "about", "contact", "style", "unique"] },
  { id: "neo-brutalist", name: "Neo Brutalist", nameJa: "ネオ・ブルータリスト", description: "太字と原色のインパクト", sections: ["hero", "works", "about", "contact", "style"] },
  { id: "glass-morphism", name: "Glass Morphism", nameJa: "グラス・モーフィズム", description: "透過グラスの近未来感", sections: ["hero", "works", "about", "contact", "style"] },
];

export const templateForms: TemplateFormDef[] = templateMeta.map((meta) => ({
  ...meta,
  fields: [
    ...commonFields,
    ...(templateSpecificFields[meta.id] || []),
  ],
}));

export function getTemplateForm(templateId: string): TemplateFormDef | undefined {
  return templateForms.find((t) => t.id === templateId);
}

export function getEditableFields(templateId: string, section?: string): FormField[] {
  const form = getTemplateForm(templateId);
  if (!form) return [];
  if (section) return form.fields.filter((f) => f.section === section);
  return form.fields;
}
