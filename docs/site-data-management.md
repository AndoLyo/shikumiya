# 顧客サイトデータ管理設計

## 現状の問題

サイトの現在コンテンツ（テキスト・画像・スタイル）がGitHubリポジトリ内のコードにハードコード。
→ 管理ページからテキスト変更するとき、現在の値をAPIで取得できない
→ テンプレートごとにデータの場所が違い、個別対応が必要

## 解決策: GAS + site.config.json の二重管理

### データの流れ

```
[顧客がサイト注文]
    ↓
Webhook → site.config.json をGitHubリポに生成
    ↓
同時に GAS の site_content シートにも保存
    ↓
[管理ページ]
    ↓
GASから現在のコンテンツを取得（API経由）
    ↓
[顧客が編集依頼]
    ↓
テキスト/スタイル変更 → GAS更新 + GitHub更新 → Vercelデプロイ
画像差替 → GitHub画像更新 + GASのパス更新 → Vercelデプロイ
```

### GAS シート設計

#### site_content シート
| orderId | siteId | template | contentJson | styleJson | updatedAt |
|---------|--------|----------|-------------|-----------|-----------|

**contentJson の構造:**
```json
{
  "hero": {
    "tagline": "家族の暮らしに寄り添う家づくり",
    "description": "創業30年、世田谷区を中心に...",
    "backgroundImage": "/images/hero-bg.jpg"
  },
  "works": [
    {
      "id": "work-1",
      "title": "世田谷の家",
      "category": "新築",
      "year": "2025",
      "description": "自然光をたっぷり...",
      "image": "/images/work-1.jpg",
      "specs": "木造2階建 / 120㎡ / 4LDK"
    }
  ],
  "strengths": [...],
  "about": {
    "ceoName": "山田 太郎",
    "bio": "...",
    "companyName": "山田工務店",
    "address": "東京都世田谷区...",
    "phone": "0120-000-000",
    "ceoPhoto": "/images/ceo.jpg"
  },
  "contact": {
    "email": "info@yamada-koumuten.jp",
    "phone": "0120-000-000"
  }
}
```

**styleJson の構造:**
```json
{
  "fonts": {
    "heading": "'Noto Sans JP', sans-serif",
    "body": "'Noto Sans JP', sans-serif"
  },
  "sizes": {
    "heading": "lg",
    "body": "md"
  },
  "colors": {
    "primary": "#7BA23F",
    "accent": "#D4A76A",
    "background": "#FAF7F2",
    "text": "#3D3226",
    "textMuted": "#8B7D6B"
  },
  "weights": {
    "heading": "bold",
    "body": "normal"
  }
}
```

### API エンドポイント

#### GET /api/site-content/[orderId]
GASからsite_contentシートのデータを取得。管理ページの編集依頼フォームで使用。

#### POST /api/site-update
テキスト/スタイル/画像の変更を受け取り:
1. GASのsite_contentシートを更新
2. GitHubリポのsite.config.jsonを更新
3. Vercelが自動デプロイ

### テンプレート側の改修

現在: データがpage.tsxにハードコード
改修後: site.config.jsonを読み込んで描画

```typescript
// site.config.json から読み込み
import siteConfig from './site.config.json';

// コンポーネントはconfigの値を使う
<h1>{siteConfig.hero.tagline}</h1>
<p>{siteConfig.hero.description}</p>
```

### 移行手順

1. site.config.json のスキーマを確定
2. 既存9テンプレートからデータを抽出してJSON化
3. テンプレートのコードをJSON読み込み方式に改修
4. GASにsite_contentシートを追加
5. Webhookでsite作成時にGASにも保存するよう改修
6. /api/site-content エンドポイント作成
7. /api/site-update エンドポイント作成
8. 管理ページの編集依頼フォームをAPI連携
