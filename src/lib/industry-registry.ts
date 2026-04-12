/**
 * 業種・テンプレート登録レジストリ
 *
 * 新業種追加 = このファイルにエントリを足すだけ
 * /start、トップページ、管理ページ等はここから読む
 */

/** テンプレートが1つ以上あれば表示、なければ非表示。statusは不要 */

export interface TemplateEntry {
  id: string;           // warm-craft, warm-craft-mid, warm-craft-pro
  plan: "lite" | "middle" | "premium";
  name: string;         // ウォームクラフト（おまかせ）
  description: string;  // 温もりのある、地域密着型の工務店に
  previewPath: string;  // /portfolio-templates/warm-craft
}

export interface IndustryEntry {
  id: string;
  category: string;     // 建築・不動産, 医療・健康, etc.
  name: string;         // 工務店・リフォーム
  description: string;  // 施工実績を魅力的に見せるサイト
  icon: string;         // lucide-react icon name
  templates: TemplateEntry[];  // 空なら非表示。テンプレ追加で自動的に表示される
}

/* ═══════════════════════════════════════
   業種カテゴリ
   ═══════════════════════════════════════ */
export const INDUSTRY_CATEGORIES = [
  "建築・不動産",
  "医療・健康",
  "美容",
  "飲食",
  "士業・専門",
  "教育",
  "クリエイター",
  "IT・Web",
  "小売・EC",
  "サービス",
  "フィットネス",
  "宿泊・観光",
  "自動車",
  "農業・食品",
  "無形商材",
] as const;

/* ═══════════════════════════════════════
   全業種レジストリ
   ═══════════════════════════════════════ */
export const INDUSTRIES: IndustryEntry[] = [
  // ─── 建築・不動産（完成済み） ───
  {
    id: "construction",
    category: "建築・不動産",
    name: "工務店・リフォーム",
    description: "施工実績を魅力的に見せるサイト",
    icon: "Building2",
    templates: [
      { id: "warm-craft", plan: "lite", name: "ウォームクラフト（おまかせ）", description: "温もりのある、地域密着型の工務店に", previewPath: "/portfolio-templates/warm-craft" },
      { id: "warm-craft-mid", plan: "middle", name: "ウォームクラフト（まるっと）", description: "ブログ・お客様の声・Maps付き", previewPath: "/portfolio-templates/warm-craft-mid" },
      { id: "warm-craft-pro", plan: "premium", name: "ウォームクラフト（ぜんぶ）", description: "AIチャット・予約システム搭載", previewPath: "/portfolio-templates/warm-craft-pro" },
    ],
  },
  {
    id: "builder",
    category: "建築・不動産",
    name: "建設会社",
    description: "信頼と実績を伝えるコーポレートサイト",
    icon: "Building2",
    templates: [
      { id: "trust-navy", plan: "lite", name: "トラストネイビー（おまかせ）", description: "信頼感のあるネイビー×ゴールド", previewPath: "/portfolio-templates/trust-navy" },
      { id: "trust-navy-mid", plan: "middle", name: "トラストネイビー（まるっと）", description: "ニュース・実績詳細・Maps付き", previewPath: "/portfolio-templates/trust-navy-mid" },
      { id: "trust-navy-pro", plan: "premium", name: "トラストネイビー（ぜんぶ）", description: "採用ページ・動画・AI搭載", previewPath: "/portfolio-templates/trust-navy-pro" },
    ],
  },
  {
    id: "architect",
    category: "建築・不動産",
    name: "設計事務所",
    description: "作品が映えるミニマルなポートフォリオ",
    icon: "Palette",
    templates: [
      { id: "clean-arch", plan: "lite", name: "クリーンアーチ（おまかせ）", description: "余白を活かしたミニマルデザイン", previewPath: "/portfolio-templates/clean-arch" },
      { id: "clean-arch-mid", plan: "middle", name: "クリーンアーチ（まるっと）", description: "受賞歴・ニュース・詳細ページ付き", previewPath: "/portfolio-templates/clean-arch-mid" },
      { id: "clean-arch-pro", plan: "premium", name: "クリーンアーチ（ぜんぶ）", description: "多言語・360°ビュー・PDF搭載", previewPath: "/portfolio-templates/clean-arch-pro" },
    ],
  },
  {
    id: "real-estate",
    category: "建築・不動産",
    name: "不動産",
    description: "物件情報を効果的に見せるサイト",
    icon: "Home",
    templates: [],
  },

  // ─── 医療・健康 ───
  {
    id: "clinic",
    category: "医療・健康",
    name: "クリニック・病院",
    description: "安心感と信頼を伝える医療機関サイト",
    icon: "Heart",
    templates: [],
  },
  {
    id: "dental",
    category: "医療・健康",
    name: "歯科医院",
    description: "予約しやすい歯科サイト",
    icon: "Heart",
    templates: [],
  },
  {
    id: "chiropractic",
    category: "医療・健康",
    name: "整骨院・整体",
    description: "施術内容と料金が伝わるサイト",
    icon: "Heart",
    templates: [],
  },
  {
    id: "veterinary",
    category: "医療・健康",
    name: "動物病院",
    description: "ペットオーナーに安心を届けるサイト",
    icon: "Heart",
    templates: [],
  },

  // ─── 美容 ───
  {
    id: "hair-salon",
    category: "美容",
    name: "美容室",
    description: "スタイリストの技術が映えるサイト",
    icon: "Scissors",
    templates: [],
  },
  {
    id: "nail-salon",
    category: "美容",
    name: "ネイルサロン",
    description: "デザインギャラリーで魅せるサイト",
    icon: "Sparkles",
    templates: [],
  },
  {
    id: "esthetic",
    category: "美容",
    name: "エステ・脱毛",
    description: "メニューと料金がわかりやすいサイト",
    icon: "Sparkles",
    templates: [],
  },

  // ─── 飲食 ───
  {
    id: "restaurant",
    category: "飲食",
    name: "レストラン・カフェ",
    description: "メニューと雰囲気が伝わるサイト",
    icon: "UtensilsCrossed",
    templates: [],
  },
  {
    id: "izakaya",
    category: "飲食",
    name: "居酒屋・バー",
    description: "お店の個性が光るサイト",
    icon: "Wine",
    templates: [],
  },
  {
    id: "bakery",
    category: "飲食",
    name: "パン屋・ケーキ屋",
    description: "商品写真が食欲をそそるサイト",
    icon: "Cake",
    templates: [],
  },

  // ─── 士業・専門 ───
  {
    id: "lawyer",
    category: "士業・専門",
    name: "弁護士・法律事務所",
    description: "専門性と信頼を伝えるサイト",
    icon: "Scale",
    templates: [],
  },
  {
    id: "tax-accountant",
    category: "士業・専門",
    name: "税理士・会計事務所",
    description: "サービス内容が明確なサイト",
    icon: "Calculator",
    templates: [],
  },
  {
    id: "consultant",
    category: "士業・専門",
    name: "コンサルティング",
    description: "実績と専門性をアピールするサイト",
    icon: "Briefcase",
    templates: [],
  },

  // ─── 教育 ───
  {
    id: "cram-school",
    category: "教育",
    name: "学習塾・教室",
    description: "合格実績と教育方針が伝わるサイト",
    icon: "GraduationCap",
    templates: [],
  },
  {
    id: "language-school",
    category: "教育",
    name: "英会話・語学教室",
    description: "レッスン内容と講師紹介のサイト",
    icon: "Globe",
    templates: [],
  },

  // ─── クリエイター ───
  {
    id: "photographer",
    category: "クリエイター",
    name: "写真家・映像制作",
    description: "作品が主役のポートフォリオサイト",
    icon: "Camera",
    templates: [],
  },
  {
    id: "designer",
    category: "クリエイター",
    name: "デザイナー・イラストレーター",
    description: "世界観を表現するポートフォリオ",
    icon: "Palette",
    templates: [],
  },
  {
    id: "handmade",
    category: "クリエイター",
    name: "ハンドメイド作家",
    description: "作品の魅力を伝えるショップサイト",
    icon: "Scissors",
    templates: [],
  },

  // ─── IT・Web ───
  {
    id: "web-agency",
    category: "IT・Web",
    name: "Web制作・システム開発",
    description: "制作実績と技術力をアピールするサイト",
    icon: "Code",
    templates: [],
  },
  {
    id: "freelance-engineer",
    category: "IT・Web",
    name: "フリーランスエンジニア",
    description: "スキルと実績をまとめたポートフォリオ",
    icon: "Terminal",
    templates: [],
  },

  // ─── 小売・EC ───
  {
    id: "apparel",
    category: "小売・EC",
    name: "アパレル・雑貨",
    description: "商品の世界観を伝えるサイト",
    icon: "ShoppingBag",
    templates: [],
  },
  {
    id: "flower-shop",
    category: "小売・EC",
    name: "花屋",
    description: "季節の花と店舗の雰囲気を伝えるサイト",
    icon: "Flower2",
    templates: [],
  },

  // ─── サービス ───
  {
    id: "cleaning",
    category: "サービス",
    name: "クリーニング・清掃",
    description: "サービスエリアと料金が明確なサイト",
    icon: "Sparkles",
    templates: [],
  },
  {
    id: "pet-salon",
    category: "サービス",
    name: "ペットサロン",
    description: "かわいい仕上がり写真で魅せるサイト",
    icon: "Dog",
    templates: [],
  },

  // ─── フィットネス ───
  {
    id: "gym",
    category: "フィットネス",
    name: "ジム・パーソナルトレーニング",
    description: "ビフォーアフターで成果を見せるサイト",
    icon: "Dumbbell",
    templates: [],
  },
  {
    id: "yoga",
    category: "フィットネス",
    name: "ヨガ・ピラティス",
    description: "心地よい空間を伝えるサイト",
    icon: "Heart",
    templates: [],
  },

  // ─── 宿泊・観光 ───
  {
    id: "hotel",
    category: "宿泊・観光",
    name: "ホテル・旅館・民泊",
    description: "宿泊体験を魅力的に伝えるサイト",
    icon: "Bed",
    templates: [],
  },

  // ─── 自動車 ───
  {
    id: "auto-repair",
    category: "自動車",
    name: "自動車整備・中古車販売",
    description: "在庫情報とサービスを伝えるサイト",
    icon: "Car",
    templates: [],
  },

  // ─── 農業・食品 ───
  {
    id: "farm",
    category: "農業・食品",
    name: "農園・直売所",
    description: "生産者の顔が見えるサイト",
    icon: "Leaf",
    templates: [],
  },

  // ─── 無形商材 ───
  {
    id: "coaching",
    category: "無形商材",
    name: "コーチング・カウンセリング",
    description: "信頼と実績で選ばれるサイト",
    icon: "MessageCircle",
    templates: [],
  },
  {
    id: "seminar",
    category: "無形商材",
    name: "セミナー講師・研修",
    description: "実績と受講者の声で魅せるサイト",
    icon: "Presentation",
    templates: [],
  },
];

/* ═══════════════════════════════════════
   ヘルパー関数
   ═══════════════════════════════════════ */

/** テンプレートがある（申込可能な）業種のみ取得 */
export function getActiveIndustries(): IndustryEntry[] {
  return INDUSTRIES.filter((i) => i.templates.length > 0);
}

/** カテゴリ別にグルーピング（テンプレありのみ） */
export function getIndustriesByCategory(): Record<string, IndustryEntry[]> {
  const result: Record<string, IndustryEntry[]> = {};
  for (const ind of getActiveIndustries()) {
    if (!result[ind.category]) result[ind.category] = [];
    result[ind.category].push(ind);
  }
  return result;
}

/** テンプレIDから業種を逆引き */
export function getIndustryByTemplateId(templateId: string): IndustryEntry | undefined {
  return INDUSTRIES.find((i) => i.templates.some((t) => t.id === templateId));
}

/** テンプレIDからテンプレ情報を取得 */
export function getTemplateById(templateId: string): TemplateEntry | undefined {
  for (const ind of INDUSTRIES) {
    const tpl = ind.templates.find((t) => t.id === templateId);
    if (tpl) return tpl;
  }
  return undefined;
}
