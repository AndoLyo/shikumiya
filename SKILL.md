# しくみや — プロジェクトスキル/フロー定義

> 最終更新: 2026-04-09

## 「note書いて」→ note記事フルフロー

### トリガー
「note書いて」「記事書いて」「○○の記事作って」

### フロー（Phase 0〜7・途中で止めない）

```
Phase 0: リサーチ      — テーマの関連コード・既存記事・仕様を実際に読む
Phase 1: 記事本文      — /note-outline → /note-writing。LP型構造（knowhow_lp_article_pattern.md）
Phase 2: スクショ      — Playwright自動撮影（deviceScaleFactor: 2, networkidle + 3秒待機）
Phase 3: 画像プロンプト — /thumbnail-design でサムネ+セクション画像プロンプト（thumbnails.md）
Phase 4: 画像生成      — generate_images.py（Gemini API）で実際に生成。プロンプトで止めない
Phase 5: マニフェスト   — image_manifest.json 作成
Phase 6: X投稿         — /x-draft で4パターン（140文字以内・URL込み）
Phase 7: note下書き投稿 — run_note_post.py --folder {フォルダ} --price {価格} --generate-images
```

### 使用スキル（必須）
| Phase | スキル | 備考 |
|---|---|---|
| 1 | `/note-outline` → `/note-writing` | 構成→本文。LP型構造に従う |
| 3 | `/thumbnail-design` | サムネ+セクション画像プロンプト。キャラ比率ルール付き |
| 6 | `/x-draft` | lyo_tone_guide.md+SEOナレッジを自動参照 |

### 成果物チェックリスト
```
{番号}_{スラッグ}/
├── article.md           ← 記事本文（画像配置ガイド付き）
├── thumbnails.md        ← サムネ + セクション画像プロンプト
├── image_manifest.json  ← 画像マニフェスト
├── X投稿.md             ← X投稿ドラフト（4パターン）
├── thumbnail.png        ← サムネイル画像（Gemini API生成済み）
├── README.html          ← セットアップガイド（該当する場合）
├── download.zip         ← ソースコード（該当する場合）
└── 画像/                ← スクショ + セクション画像
    ├── screenshot_*.png  ← Playwright自動撮影
    └── section_*.png     ← Gemini API生成
```

### ルール
- 記事構造: LP型（90%無料=LP、有料=データのみ）
- 有料ライン: 「興味あればこちらもどうぞ。」+ プロンプト集embed の後
- 有料パート: 「ここから先は有料パートです。」+ ハッシュタグ + 添付ファイル案内だけ
- 全note記事の末尾にプロンプト集記事（250回購入）のembedを必ず入れる
- 各Phase完了時にチェックゲートを通す（TodoWriteで記録）
- 詳細: memory/feedback_note_full_flow.md

---

## コレクション記事の特殊フロー（2026-04-09〜）

### 方針
- テンプレートは個別記事ではなく **コレクション（集）記事** で一括販売
- プロンプト集記事（250回購入/¥1,500）の成功構造を踏襲
- 価格: ¥980（10テンプレート一括）

### Phase 2 の特殊対応（コレクション記事）
- 10テンプレ全てのスクショを一括撮影（screenshot.mjs）
- 各テンプレートから hero + fullpage を撮影
- スナップスクロール系（cyber-neon, dark-elegance）は各セクション個別撮影が必要
- viewport: 1280x800, deviceScaleFactor: 2

### ZIP準備（コレクション記事固有）
- 10テンプレート全てのソースコードをバンドル
- README.html にセットアップ手順を記載

---

## スキルリレー順序（1つずつ・同時呼び出し禁止）

**スキルは同時に2つ呼べない。必ず1つ完了してから次を呼ぶ。**
**各スキルの出力末尾に「📌 次のスキル: /xxx」が表示される。**

```
「note書いて」
  ↓
【director】 Phase 0: リサーチ（ディレクター直接）
  ↓
① /note-outline    — 構成設計
  ↓
② /note-writing    — 本文執筆+課金設計
  ↓
③ /note-seo        — タイトル・ハッシュタグ・リード文
  ↓
④ /note-links      — 内部リンク挿入
  ↓
【director】 Phase 2: Playwrightスクショ自動撮影（ディレクター直接）
  │  → 撮影した画像/screenshot_*.png, hero_*.png を以降で活用:
  │    ⑥⑦: テンプレの色味・レイアウト参考
  │    ⑨: README.htmlの見本画像として同梱
  │    記事本文: 「こんなサイトが作れます」の証拠画像
  ↓
⑥ /thumbnail-design — サムネイル画像プロンプト
  ↓
⑦ /section-design  — セクション画像プロンプト
  ↓
【director】 Phase 4: generate_images.py で画像生成（ディレクター直接）
  ↓
【director】 Phase 5: image_manifest.json 生成（ディレクター直接）
  ↓
⑨ /distribution-prep — 配布物準備（download.zip + README.html）※有料記事のみ
  ↓
⑩ /auditor         — 記事・画像・配布物の品質監査
  ↓
⑪ /x-draft         — X投稿ドラフト
  ↓
【director】 Phase 7: run_note_post.py でnote下書き投稿（ディレクター直接）
  ↓
【完了報告】 — 成果物一覧を提示
```

---

## ポートフォリオテンプレート情報（パス注意）

- **正しいパス**: `/portfolio-templates/`（`src/app/portfolio-templates/`）
- **旧テンプレート**: `/templates/`（`src/app/templates/`）→ 別物。混同注意
- **10種**: comic-panel, cyber-neon, dark-elegance, floating-gallery, ink-wash, mosaic-bold, pastel-pop, retro-pop, studio-white, watercolor-soft
- **デモURL**: `https://lyo-vision-site.vercel.app/portfolio-templates/{テンプレ名}`
