/**
 * テンプレートごとのセクション・フィールド定義（v3 — セクションベース）
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
  section: string;
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

export interface SectionDef {
  id: string;
  label: string;
  description: string;
  required: boolean;
  fields: FormField[];
  component: string;
}

export interface TemplateFormDef {
  id: string;
  name: string;
  nameJa: string;
  description: string;
  imageSpec: ImageSpec;
  colorPresets: ColorPreset[];
  defaultColors: { primary: string; accent: string; background: string };
  sectionDefs: SectionDef[];
  moodFields: FormField[];
}

// ━━━━━━━━━━━━━━━━━━━━
// 共通セクション定義
// ━━━━━━━━━━━━━━━━━━━━

const heroSection: SectionDef = {
  id: "hero",
  label: "トップ画面",
  description: "サイトを開いた時に最初に表示される画面です",
  required: true,
  component: "HeroSection",
  fields: [
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
  ],
};

const worksSection: SectionDef = {
  id: "works",
  label: "作品ギャラリー",
  description: "あなたの作品を並べて表示するセクションです",
  required: true,
  component: "WorksSection",
  fields: [
    {
      id: "works",
      label: "作品画像",
      type: "images",
      help: "ギャラリーに表示する作品画像をアップロードしてください",
      required: true,
      section: "works",
    },
  ],
};

const aboutSection: SectionDef = {
  id: "about",
  label: "自己紹介",
  description: "あなた自身について紹介するセクションです",
  required: false,
  component: "AboutSection",
  fields: [
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
      id: "profileImage",
      label: "プロフィール画像",
      type: "image",
      help: "About欄に表示されるアイコン画像です",
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
      id: "location",
      label: "拠点",
      type: "text",
      placeholder: "例: 東京",
      help: "活動拠点が表示されます",
      section: "about",
    },
    {
      id: "artStyle",
      label: "作風・スタイル",
      type: "text",
      placeholder: "例: ファンタジー、SF、少年マンガ",
      help: "あなたの作品のジャンルやスタイル",
      section: "about",
    },
    {
      id: "tools",
      label: "使用ツール",
      type: "tags",
      placeholder: "例: Midjourney, Stable Diffusion, CLIP STUDIO",
      help: "制作に使っているツール（最大8つ）",
      max: 8,
      section: "about",
    },
  ],
};

const contactSection: SectionDef = {
  id: "contact",
  label: "お問い合わせ・SNS",
  description: "メールやSNSの連絡先を表示するセクションです",
  required: false,
  component: "ContactSection",
  fields: [
    {
      id: "email",
      label: "メールアドレス",
      type: "text",
      placeholder: "例: your-email@example.com",
      help: "サイトの問い合わせ先として表示されます",
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
  ],
};

// ━━━━━━━━━━━━━━━━━━━━
// テンプレート固有セクション
// ━━━━━━━━━━━━━━━━━━━━

const skillsSection: SectionDef = {
  id: "skills",
  label: "スキル・得意分野",
  description: "あなたのスキルをビジュアルで表示します",
  required: false,
  component: "SkillsSection",
  fields: [
    {
      id: "skills",
      label: "スキル・得意ジャンル",
      type: "tags",
      placeholder: "例: 漫画, イラスト, キャラデザ",
      help: "プロフィールに表示されます（最大6つ）",
      max: 6,
      section: "skills",
    },
  ],
};

const statsSection: SectionDef = {
  id: "stats",
  label: "実績・数字",
  description: "作品数や活動年数などを数字で表示します",
  required: false,
  component: "StatsSection",
  fields: [
    {
      id: "stats",
      label: "実績・数字",
      type: "tags",
      placeholder: "例: 180+ Works, 6 Years, 40+ Awards",
      help: "プロフィールに表示されます（最大3つ）",
      max: 3,
      section: "stats",
    },
  ],
};

const categoriesSection: SectionDef = {
  id: "categories",
  label: "作品カテゴリ",
  description: "ギャラリーのフィルター用カテゴリです",
  required: false,
  component: "CategoriesSection",
  fields: [
    {
      id: "workCategories",
      label: "作品カテゴリ",
      type: "tags",
      placeholder: "例: Portrait, Landscape, Abstract",
      help: "ライトボックスで作品情報として表示されます（最大5つ）",
      max: 5,
      section: "categories",
    },
  ],
};

const toolsSection: SectionDef = {
  id: "tools",
  label: "使用ツール",
  description: "使用しているツールをタグで表示します",
  required: false,
  component: "ToolsSection",
  fields: [
    {
      id: "tools",
      label: "使用ツール",
      type: "tags",
      placeholder: "例: Midjourney, Stable Diffusion, ComfyUI",
      help: "プロフィールにスキルバーとして表示されます（最大8つ）",
      max: 8,
      section: "tools",
    },
  ],
};

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
  "comic-panel": {
    recommendedCount: { min: 6, max: 9 },
    recommendedRatio: "自由",
    ratioNote: "マンガパネル風グリッド。正方形・縦長・横長、どれでも映えます",
    acceptRatios: ["1:1", "4:3", "3:4", "16:9", "9:16"],
  },
  "cyber-neon": {
    recommendedCount: { min: 4, max: 6 },
    recommendedRatio: "16:9 or 1:1",
    ratioNote: "カルーセル表示。横長か正方形が推奨です",
    acceptRatios: ["16:9", "1:1", "4:3"],
  },
  "dark-elegance": {
    recommendedCount: { min: 5, max: 8 },
    recommendedRatio: "3:4（縦長）",
    ratioNote: "フルスクリーンスライダー。縦長画像が最も美しく表示されます",
    acceptRatios: ["3:4", "9:16", "1:1", "4:3"],
  },
  "floating-gallery": {
    recommendedCount: { min: 4, max: 8 },
    recommendedRatio: "自由",
    ratioNote: "フローティングカード。どんなアスペクト比でもOK",
    acceptRatios: ["1:1", "4:3", "3:4", "16:9", "9:16"],
  },
  "ink-wash": {
    recommendedCount: { min: 4, max: 8 },
    recommendedRatio: "4:3 or 1:1",
    ratioNote: "水墨画風レイアウト。正方形か横長が推奨です",
    acceptRatios: ["4:3", "1:1", "3:4", "16:9"],
  },
  "mosaic-bold": {
    recommendedCount: { min: 6, max: 8 },
    recommendedRatio: "自由",
    ratioNote: "モザイクグリッド。どんなサイズでも大胆に配置されます",
    acceptRatios: ["1:1", "4:3", "3:4", "16:9"],
  },
  "pastel-pop": {
    recommendedCount: { min: 4, max: 6 },
    recommendedRatio: "1:1 or 4:3",
    ratioNote: "丸みのあるカード型。正方形か横長が推奨",
    acceptRatios: ["1:1", "4:3", "16:9"],
  },
  "retro-pop": {
    recommendedCount: { min: 4, max: 6 },
    recommendedRatio: "1:1 or 4:3",
    ratioNote: "レトロカード。正方形か横長が映えます",
    acceptRatios: ["1:1", "4:3", "16:9"],
  },
  "studio-white": {
    recommendedCount: { min: 6, max: 12 },
    recommendedRatio: "自由（混在OK）",
    ratioNote: "マソンリーギャラリー。正方形・縦長・横長を混ぜるとリズムが出ます",
    acceptRatios: ["1:1", "3:4", "16:9", "4:3", "9:16"],
  },
  "watercolor-soft": {
    recommendedCount: { min: 4, max: 8 },
    recommendedRatio: "4:3 or 1:1",
    ratioNote: "水彩画風。優しい雰囲気の横長か正方形が推奨",
    acceptRatios: ["4:3", "1:1", "3:4", "16:9"],
  },
};

// ━━━━━━━━━━━━━━━━━━━━
// カラープリセット
// ━━━━━━━━━━━━━━━━━━━━

const darkPresets: ColorPreset[] = [
  { name: "シアン", primary: "#00e5ff", accent: "#d4a853", background: "#0a0a0f", text: "#e5e5e5" },
  { name: "ロイヤルブルー", primary: "#3b82f6", accent: "#93c5fd", background: "#0a0a14", text: "#e5e5e5" },
  { name: "ネイビー × ゴールド", primary: "#d4a853", accent: "#60a5fa", background: "#0c1222", text: "#e5e5e5" },
  { name: "パープル", primary: "#8b5cf6", accent: "#a78bfa", background: "#0a0a0f", text: "#e5e5e5" },
  { name: "ラベンダー", primary: "#a78bfa", accent: "#c4b5fd", background: "#0f0a1a", text: "#e5e5e5" },
  { name: "ディープパープル", primary: "#7c3aed", accent: "#ddd6fe", background: "#1a0a2e", text: "#e5e5e5" },
  { name: "ピンク", primary: "#ec4899", accent: "#f9a8d4", background: "#0a0a0f", text: "#e5e5e5" },
  { name: "ローズ", primary: "#f43f5e", accent: "#fda4af", background: "#0f0a0a", text: "#e5e5e5" },
  { name: "マゼンタ", primary: "#d946ef", accent: "#e879f9", background: "#140a18", text: "#e5e5e5" },
  { name: "グリーン", primary: "#10b981", accent: "#34d399", background: "#0a0a0f", text: "#e5e5e5" },
  { name: "エメラルド", primary: "#059669", accent: "#6ee7b7", background: "#0a0f0c", text: "#e5e5e5" },
  { name: "ライム", primary: "#84cc16", accent: "#bef264", background: "#0a0f0a", text: "#e5e5e5" },
  { name: "レッド", primary: "#ef4444", accent: "#f87171", background: "#0a0a0f", text: "#e5e5e5" },
  { name: "オレンジ", primary: "#f97316", accent: "#fb923c", background: "#0f0a06", text: "#e5e5e5" },
  { name: "サンセット", primary: "#f59e0b", accent: "#fbbf24", background: "#0f0c06", text: "#e5e5e5" },
  { name: "ゴールド", primary: "#d4a853", accent: "#e8c878", background: "#0a0a0f", text: "#e5e5e5" },
  { name: "シルバー", primary: "#94a3b8", accent: "#cbd5e1", background: "#0a0a0f", text: "#e5e5e5" },
  { name: "モノクローム", primary: "#ffffff", accent: "#a1a1aa", background: "#09090b", text: "#fafafa" },
];

const lightPresets: ColorPreset[] = [
  { name: "ホワイト × ブルー", primary: "#2563eb", accent: "#3b82f6", background: "#ffffff", text: "#1a1a1a" },
  { name: "ホワイト × パープル", primary: "#7c3aed", accent: "#8b5cf6", background: "#ffffff", text: "#1a1a1a" },
  { name: "ホワイト × ピンク", primary: "#ec4899", accent: "#f472b6", background: "#ffffff", text: "#1a1a1a" },
  { name: "ホワイト × グリーン", primary: "#059669", accent: "#34d399", background: "#ffffff", text: "#1a1a1a" },
  { name: "ホワイト × オレンジ", primary: "#ea580c", accent: "#f97316", background: "#ffffff", text: "#1a1a1a" },
  { name: "ホワイト × レッド", primary: "#dc2626", accent: "#ef4444", background: "#ffffff", text: "#1a1a1a" },
  { name: "ホワイト × ゴールド", primary: "#a28d69", accent: "#c9b896", background: "#f5f3ef", text: "#2a2a2a" },
  { name: "ベージュ × ブラック", primary: "#1a1a1a", accent: "#a28d69", background: "#f2eee7", text: "#333333" },
  { name: "クリーム × ブラウン", primary: "#92400e", accent: "#b45309", background: "#fefce8", text: "#422006" },
  { name: "ミント × ダークグリーン", primary: "#065f46", accent: "#059669", background: "#ecfdf5", text: "#064e3b" },
  { name: "パステルピンク", primary: "#db2777", accent: "#ec4899", background: "#fff1f2", text: "#4a3548" },
  { name: "パステルブルー", primary: "#0369a1", accent: "#0284c7", background: "#f0f9ff", text: "#1e3a5f" },
  { name: "パステルパープル", primary: "#7e22ce", accent: "#9333ea", background: "#faf5ff", text: "#3b0764" },
  { name: "ライトモノ", primary: "#000000", accent: "#525252", background: "#fafafa", text: "#171717" },
  { name: "グレー × ブラック", primary: "#18181b", accent: "#3f3f46", background: "#f4f4f5", text: "#27272a" },
];

// ━━━━━━━━━━━━━━━━━━━━
// テンプレートごとのセクション割り当て
// ━━━━━━━━━━━━━━━━━━━━

const sectionAssignments: Record<string, SectionDef[]> = {
  "comic-panel":      [heroSection, worksSection, aboutSection, skillsSection, statsSection, contactSection],
  "cyber-neon":       [heroSection, worksSection, aboutSection, toolsSection, contactSection],
  "dark-elegance":    [heroSection, worksSection, aboutSection, statsSection, contactSection],
  "floating-gallery": [heroSection, worksSection, aboutSection, contactSection],
  "ink-wash":         [heroSection, worksSection, aboutSection, statsSection, contactSection],
  "mosaic-bold":      [heroSection, worksSection, aboutSection, statsSection, contactSection],
  "pastel-pop":       [heroSection, worksSection, aboutSection, contactSection],
  "retro-pop":        [heroSection, worksSection, aboutSection, contactSection],
  "studio-white":     [heroSection, worksSection, aboutSection, categoriesSection, contactSection],
  "watercolor-soft":  [heroSection, worksSection, aboutSection, contactSection],
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
  { id: "comic-panel", name: "Comic Panel", nameJa: "コミック・パネル", description: "マンガ風パネルレイアウト", defaultColors: { primary: "#E63946", accent: "#2563EB", background: "#FFFEF5" }, isDark: false },
  { id: "cyber-neon", name: "Cyber Neon", nameJa: "サイバー・ネオン", description: "ネオンが光るサイバー空間", defaultColors: { primary: "#00F0FF", accent: "#FF00E5", background: "#0A0A14" }, isDark: true },
  { id: "dark-elegance", name: "Dark Elegance", nameJa: "ダーク・エレガンス", description: "ゴールドが映える高級感", defaultColors: { primary: "#C9A96E", accent: "#E4D5B7", background: "#0D0D0D" }, isDark: true },
  { id: "floating-gallery", name: "Floating Gallery", nameJa: "フローティング・ギャラリー", description: "浮遊する3Dカード", defaultColors: { primary: "#6C63FF", accent: "#A5A0FF", background: "#111118" }, isDark: true },
  { id: "ink-wash", name: "Ink Wash", nameJa: "水墨画", description: "和風水墨画の世界観", defaultColors: { primary: "#C73E3A", accent: "#3D6B5E", background: "#F5F0E8" }, isDark: false },
  { id: "mosaic-bold", name: "Mosaic Bold", nameJa: "モザイク・ボールド", description: "大胆なモザイクグリッド", defaultColors: { primary: "#FF3D00", accent: "#0A0A0A", background: "#F5F5F5" }, isDark: false },
  { id: "pastel-pop", name: "Pastel Pop", nameJa: "パステル・ポップ", description: "やわらかいパステルカラー", defaultColors: { primary: "#FF7EB3", accent: "#7EC8E3", background: "#FFF5F9" }, isDark: false },
  { id: "retro-pop", name: "Retro Pop", nameJa: "レトロ・ポップ", description: "レトロでカラフルなデザイン", defaultColors: { primary: "#FF6B35", accent: "#00B4D8", background: "#FFFDF0" }, isDark: false },
  { id: "studio-white", name: "Studio White", nameJa: "スタジオ・ホワイト", description: "ミニマルな白基調ギャラリー", defaultColors: { primary: "#000000", accent: "#999999", background: "#FAFAFA" }, isDark: false },
  { id: "watercolor-soft", name: "Watercolor Soft", nameJa: "ウォーターカラー・ソフト", description: "水彩画のようなやさしさ", defaultColors: { primary: "#7FB5D5", accent: "#8FBFA0", background: "#F8F5F0" }, isDark: false },
];

// ━━━━━━━━━━━━━━━━━━━━
// 全テンプレート定義を生成
// ━━━━━━━━━━━━━━━━━━━━

export const templateForms: TemplateFormDef[] = templateMeta.map((meta) => ({
  id: meta.id,
  name: meta.name,
  nameJa: meta.nameJa,
  description: meta.description,
  imageSpec: imageSpecs[meta.id],
  colorPresets: meta.isDark ? darkPresets : lightPresets,
  defaultColors: meta.defaultColors,
  sectionDefs: sectionAssignments[meta.id] || [],
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
  const sectionFields = form.sectionDefs.flatMap((s) => s.fields);
  const allFields = [...sectionFields, ...form.moodFields];
  if (section) return allFields.filter((f) => f.section === section);
  return allFields;
}

export function getSectionDefs(templateId: string): SectionDef[] {
  const form = getTemplateForm(templateId);
  return form?.sectionDefs || [];
}

export function getRequiredSections(templateId: string): SectionDef[] {
  return getSectionDefs(templateId).filter((s) => s.required);
}

export function getOptionalSections(templateId: string): SectionDef[] {
  return getSectionDefs(templateId).filter((s) => !s.required);
}

export function getImageSpec(templateId: string): ImageSpec {
  return imageSpecs[templateId] || imageSpecs["studio-white"];
}

export function getColorPresets(templateId: string): ColorPreset[] {
  const form = getTemplateForm(templateId);
  return form?.colorPresets || darkPresets;
}
