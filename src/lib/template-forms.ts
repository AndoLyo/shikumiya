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
  type: "text" | "textarea" | "color" | "image" | "images" | "select" | "tags" | "radio" | "number";
  placeholder?: string;
  help?: string;
  required?: boolean;
  maxLength?: number;
  options?: { value: string; label: string }[];
  max?: number;
  min?: number;
  section: "hero" | "works" | "about" | "contact" | "style" | "unique" | "mood";
}

export interface ImageSpec {
  recommendedCount: { min: number; max: number };
  recommendedRatio: string;
  ratioNote: string;
  acceptRatios: string[];
}

export interface ColorPreset {
  name: string;
  primary: string;
  accent: string;
  background: string;
  text: string;
}

export interface TemplateFormDef {
  id: string;
  name: string;
  nameJa: string;
  description: string;
  imageSpec: ImageSpec;
  colorPresets: ColorPreset[];
  defaultColors: { primary: string; accent: string; background: string };
  sections: string[];
  commonFields: FormField[];
  uniqueFields: FormField[];
  moodFields: FormField[];
}

// ━━━━━━━━━━━━━━━━━━━━
// 共通フィールド（全テンプレートで使う）
// ━━━━━━━━━━━━━━━━━━━━

const sharedCommonFields: FormField[] = [
  {
    id: "artistName",
    label: "アーティスト名",
    type: "text",
    placeholder: "例: Lyo",
    help: "サイトに表示される名前です（本名でもペンネームでもOK）",
    required: true,
    section: "hero",
  },
  {
    id: "siteTitle",
    label: "サイトタイトル",
    type: "text",
    placeholder: "例: Lyo — AI Art Gallery",
    help: "ブラウザのタブに表示されます。空欄なら「アーティスト名 — Gallery」になります",
    section: "hero",
  },
  {
    id: "catchcopy",
    label: "キャッチコピー",
    type: "text",
    placeholder: "例: 光と影で紡ぐ幻想世界",
    help: "サイトのトップに大きく表示されます。あなたの世界観を一言で",
    section: "hero",
  },
  {
    id: "subtitle",
    label: "肩書き・サブタイトル",
    type: "text",
    placeholder: "例: AI Art Creator / Digital Artist",
    help: "名前の下に小さく表示されます",
    section: "hero",
  },
  {
    id: "bio",
    label: "自己紹介文",
    type: "textarea",
    placeholder: "例: AI画像生成を始めて3年。ファンタジーの世界観を中心に制作しています。光の表現にこだわりがあります。",
    help: "あなたのことを教えてください。活動のきっかけ、こだわり、好きなテーマなど",
    maxLength: 500,
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
  {
    id: "email",
    label: "メールアドレス",
    type: "text",
    placeholder: "例: your-email@example.com",
    help: "サイトの問い合わせ先として表示されます",
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
  {
    id: "snsOther",
    label: "その他SNS",
    type: "text",
    placeholder: "https://...",
    section: "contact",
  },
];

// ━━━━━━━━━━━━━━━━━━━━
// 雰囲気・スタイル質問（AIが自動で反映する）
// ━━━━━━━━━━━━━━━━━━━━

const sharedMoodFields: FormField[] = [
  {
    id: "moodTone",
    label: "サイト全体の雰囲気",
    type: "radio",
    help: "あなたの作品に合う雰囲気を選んでください",
    options: [
      { value: "dark", label: "ダーク — 重厚感・没入感" },
      { value: "light", label: "ライト — 明るく・爽やか" },
      { value: "warm", label: "ウォーム — 温かみ・親しみやすさ" },
      { value: "cool", label: "クール — シャープ・洗練" },
      { value: "pop", label: "ポップ — 元気・カラフル" },
      { value: "elegant", label: "エレガント — 上品・高級感" },
    ],
    section: "mood",
  },
  {
    id: "moodFont",
    label: "文字の雰囲気",
    type: "radio",
    help: "タイトルや見出しの雰囲気です",
    options: [
      { value: "serif", label: "上品・伝統的（明朝体系）" },
      { value: "sans", label: "モダン・すっきり（ゴシック体系）" },
      { value: "mono", label: "テック・デジタル（等幅フォント）" },
      { value: "handwritten", label: "手書き・温かみ" },
    ],
    section: "mood",
  },
  {
    id: "moodAnimation",
    label: "アニメーションの強さ",
    type: "radio",
    options: [
      { value: "none", label: "なし — シンプルに" },
      { value: "subtle", label: "控えめ — ふわっと表示" },
      { value: "moderate", label: "普通 — スクロールで動く" },
      { value: "dynamic", label: "しっかり — 印象に残る演出" },
    ],
    section: "mood",
  },
  {
    id: "referenceUrl",
    label: "参考サイトURL",
    type: "text",
    placeholder: "https://example.com",
    help: "「こんな感じにしたい」というサイトがあれば教えてください",
    section: "mood",
  },
  {
    id: "requests",
    label: "その他のご要望",
    type: "textarea",
    placeholder: "例: 青と紫を基調にしてほしい、背景を白にしたい、等",
    help: "色の好み、レイアウトの希望、特別なリクエストなど自由にお書きください",
    maxLength: 500,
    section: "mood",
  },
];

// ━━━━━━━━━━━━━━━━━━━━
// テンプレートごとの画像仕様
// ━━━━━━━━━━━━━━━━━━━━

const imageSpecs: Record<string, ImageSpec> = {
  "cinematic-dark": {
    recommendedCount: { min: 3, max: 6 },
    recommendedRatio: "16:9",
    ratioNote: "横長画像が映えるテンプレートです。正方形や縦長も使えます",
    acceptRatios: ["16:9", "4:3", "1:1", "3:4"],
  },
  "minimal-grid": {
    recommendedCount: { min: 6, max: 12 },
    recommendedRatio: "自由",
    ratioNote: "グリッド表示のため、どんなアスペクト比でもOK。枚数が多いほど見栄えがします",
    acceptRatios: ["1:1", "4:3", "3:4", "16:9", "9:16"],
  },
  "warm-natural": {
    recommendedCount: { min: 3, max: 6 },
    recommendedRatio: "4:3 or 16:9",
    ratioNote: "カード型レイアウト。横長画像が推奨です",
    acceptRatios: ["4:3", "16:9", "1:1"],
  },
  "horizontal-scroll": {
    recommendedCount: { min: 5, max: 8 },
    recommendedRatio: "3:4（縦長）",
    ratioNote: "縦長画像が最も映えます。横スクロールで大きく表示されます",
    acceptRatios: ["3:4", "9:16", "1:1", "4:3"],
  },
  "elegant-mono": {
    recommendedCount: { min: 6, max: 9 },
    recommendedRatio: "1:1 or 4:3",
    ratioNote: "ギャラリー風。正方形か横長が推奨です",
    acceptRatios: ["1:1", "4:3", "3:4", "16:9"],
  },
  "ai-art-portfolio": {
    recommendedCount: { min: 4, max: 8 },
    recommendedRatio: "自由",
    ratioNote: "どんなアスペクト比でもOK。ライトボックスで拡大表示されます",
    acceptRatios: ["1:1", "4:3", "3:4", "16:9", "9:16"],
  },
  "split-showcase": {
    recommendedCount: { min: 3, max: 6 },
    recommendedRatio: "3:4（縦長）",
    ratioNote: "左右分割画面で大きく表示。縦長画像が映えます",
    acceptRatios: ["3:4", "9:16", "1:1"],
  },
  "stack-cards": {
    recommendedCount: { min: 3, max: 5 },
    recommendedRatio: "16:9",
    ratioNote: "カード内に横長で表示。少数精鋭がベスト",
    acceptRatios: ["16:9", "4:3", "1:1"],
  },
  "neo-brutalist": {
    recommendedCount: { min: 4, max: 6 },
    recommendedRatio: "自由",
    ratioNote: "非対称グリッド。どんなサイズでもダイナミックに配置されます",
    acceptRatios: ["1:1", "4:3", "3:4", "16:9"],
  },
  "glass-morphism": {
    recommendedCount: { min: 4, max: 6 },
    recommendedRatio: "16:10 or 4:3",
    ratioNote: "ガラスカード上に表示。やや横長が推奨",
    acceptRatios: ["16:9", "4:3", "1:1"],
  },
};

// ━━━━━━━━━━━━━━━━━━━━
// カラープリセット
// ━━━━━━━━━━━━━━━━━━━━

const darkPresets: ColorPreset[] = [
  { name: "シアン", primary: "#00e5ff", accent: "#d4a853", background: "#0a0a0f", text: "#e5e5e5" },
  { name: "パープル", primary: "#8b5cf6", accent: "#a78bfa", background: "#0a0a0f", text: "#e5e5e5" },
  { name: "ピンク", primary: "#ec4899", accent: "#f9a8d4", background: "#0a0a0f", text: "#e5e5e5" },
  { name: "グリーン", primary: "#10b981", accent: "#34d399", background: "#0a0a0f", text: "#e5e5e5" },
  { name: "レッド", primary: "#ef4444", accent: "#f87171", background: "#0a0a0f", text: "#e5e5e5" },
  { name: "ゴールド", primary: "#d4a853", accent: "#e8c878", background: "#0a0a0f", text: "#e5e5e5" },
];

const lightPresets: ColorPreset[] = [
  { name: "ホワイト × ブルー", primary: "#2563eb", accent: "#3b82f6", background: "#ffffff", text: "#1a1a1a" },
  { name: "ホワイト × ゴールド", primary: "#a28d69", accent: "#c9b896", background: "#f5f3ef", text: "#2a2a2a" },
  { name: "ベージュ × ブラック", primary: "#1a1a1a", accent: "#a28d69", background: "#f2eee7", text: "#333333" },
  { name: "ホワイト × グリーン", primary: "#059669", accent: "#34d399", background: "#ffffff", text: "#1a1a1a" },
];

// ━━━━━━━━━━━━━━━━━━━━
// テンプレート固有フィールド
// ━━━━━━━━━━━━━━━━━━━━

const uniqueFieldsByTemplate: Record<string, FormField[]> = {
  "warm-natural": [
    {
      id: "services",
      label: "提供しているサービス",
      type: "tags",
      placeholder: "例: イラスト制作, キャラデザ, 背景アート",
      help: "提供しているサービスをカンマ区切りで（最大3つ）",
      max: 3,
      section: "unique",
    },
  ],
  "stack-cards": [
    {
      id: "skills",
      label: "スキル・得意分野",
      type: "tags",
      placeholder: "例: キャラクター, 背景, コンセプトアート",
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
      help: "ギャラリーのフィルター用。英語推奨（最大5つ）",
      max: 5,
      section: "works",
    },
  ],
  "horizontal-scroll": [
    {
      id: "stats",
      label: "実績・数字",
      type: "tags",
      placeholder: "例: 60+ Works, 3 Years, 5 Awards",
      help: "Aboutセクションに表示されます（最大3つ。後から追加可能）",
      max: 3,
      section: "about",
    },
  ],
  "elegant-mono": [
    {
      id: "stats",
      label: "実績・数字",
      type: "tags",
      placeholder: "例: 150+ Works, 8 Years, 40+ Clients",
      help: "Aboutセクションに表示されます（最大3つ。後から追加可能）",
      max: 3,
      section: "about",
    },
  ],
  "ai-art-portfolio": [
    {
      id: "tools",
      label: "使用ツール",
      type: "tags",
      placeholder: "例: Midjourney, Stable Diffusion, Flux",
      help: "About欄に表示されます（最大8つ）",
      max: 8,
      section: "about",
    },
  ],
};

// ━━━━━━━━━━━━━━━━━━━━
// テンプレートメタデータ
// ━━━━━━━━━━━━━━━━━━━━

const templateMeta: Array<{
  id: string;
  name: string;
  nameJa: string;
  description: string;
  defaultColors: { primary: string; accent: string; background: string };
  isDark: boolean;
}> = [
  { id: "cinematic-dark", name: "Cinematic Dark", nameJa: "シネマティック・ダーク", description: "没入感のあるフルスクリーン", defaultColors: { primary: "#00bbdd", accent: "#d42d83", background: "#0a0a1a" }, isDark: true },
  { id: "minimal-grid", name: "Minimal Grid", nameJa: "ミニマル・グリッド", description: "作品を主役にするグリッド", defaultColors: { primary: "#A28D69", accent: "#A28D69", background: "#f5f3ef" }, isDark: false },
  { id: "warm-natural", name: "Warm Natural", nameJa: "ウォーム・ナチュラル", description: "温かみのあるカード型", defaultColors: { primary: "#fffe3e", accent: "#a28d69", background: "#f2eee7" }, isDark: false },
  { id: "horizontal-scroll", name: "Horizontal Scroll", nameJa: "ホリゾンタル・スクロール", description: "横に流れるエディトリアル", defaultColors: { primary: "#e63946", accent: "#EFE8D7", background: "#0a0a0a" }, isDark: true },
  { id: "elegant-mono", name: "Elegant Mono", nameJa: "エレガント・モノ", description: "ギャラリーのような空間", defaultColors: { primary: "#00bbdd", accent: "#d42d83", background: "#1a1a1a" }, isDark: true },
  { id: "ai-art-portfolio", name: "AI Art Portfolio", nameJa: "AIアート・ポートフォリオ", description: "AIアート特化の世界観", defaultColors: { primary: "#00e5ff", accent: "#d4a853", background: "#0a0a0f" }, isDark: true },
  { id: "split-showcase", name: "Split Showcase", nameJa: "スプリット・ショーケース", description: "左右分割の構図美", defaultColors: { primary: "#c9a96e", accent: "#f0ede6", background: "#111111" }, isDark: true },
  { id: "stack-cards", name: "Stack Cards", nameJa: "スタック・カード", description: "カードが重なるスクロール", defaultColors: { primary: "#6366f1", accent: "#a78bfa", background: "#0c0c0c" }, isDark: true },
  { id: "neo-brutalist", name: "Neo Brutalist", nameJa: "ネオ・ブルータリスト", description: "太字と原色のインパクト", defaultColors: { primary: "#ff5722", accent: "#2563eb", background: "#fffdf5" }, isDark: false },
  { id: "glass-morphism", name: "Glass Morphism", nameJa: "グラス・モーフィズム", description: "透過グラスの近未来感", defaultColors: { primary: "#8b5cf6", accent: "#06b6d4", background: "#0f0f1a" }, isDark: true },
];

// ━━━━━━━━━━━━━━━━━━━━
// 全テンプレート定義を生成
// ━━━━━━━━━━━━━━━━━━━━

export const templateForms: TemplateFormDef[] = templateMeta.map((meta) => ({
  id: meta.id,
  name: meta.name,
  nameJa: meta.nameJa,
  description: meta.description,
  imageSpec: imageSpecs[meta.id] || imageSpecs["ai-art-portfolio"],
  colorPresets: meta.isDark ? darkPresets : lightPresets,
  defaultColors: meta.defaultColors,
  sections: ["hero", "works", "about", "contact", "style", "mood", ...(uniqueFieldsByTemplate[meta.id] ? ["unique"] : [])],
  commonFields: sharedCommonFields,
  uniqueFields: uniqueFieldsByTemplate[meta.id] || [],
  moodFields: sharedMoodFields,
}));

// ━━━━━━━━━━━━━━━━━━━━
// ユーティリティ
// ━━━━━━━━━━━━━━━━━━━━

export function getTemplateForm(templateId: string): TemplateFormDef | undefined {
  return templateForms.find((t) => t.id === templateId);
}

export function getEditableFields(templateId: string, section?: string): FormField[] {
  const form = getTemplateForm(templateId);
  if (!form) return [];
  const allFields = [...form.commonFields, ...form.uniqueFields, ...form.moodFields];
  if (section) return allFields.filter((f) => f.section === section);
  return allFields;
}

export function getImageSpec(templateId: string): ImageSpec {
  return imageSpecs[templateId] || imageSpecs["ai-art-portfolio"];
}

export function getColorPresets(templateId: string): ColorPreset[] {
  const form = getTemplateForm(templateId);
  return form?.colorPresets || darkPresets;
}
