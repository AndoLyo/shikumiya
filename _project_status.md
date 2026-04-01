# lyo-vision-site — プロジェクトステータス

> 最終更新: 2026-03-31 (自動更新)

## 概要
Lyo Vision（AIアート×自動化の個人事業）の公式サイト。Next.js製LP型サイトで、24体のAIエージェントチームによる「しくみや」サービスを訴求する構成。

## 状態
- ステータス: active
- 進捗: 90%
- ブランチ: main（origin/mainと同期済み）

## サイト構成（現在のセクション順）
1. **Header** — ナビゲーション
2. **HeroSection** — メインビジュアル＋キャッチコピー（パララックス、パーティクル演出）
3. **TrustBarSection** — 信頼指標
4. **ProblemSection** — 課題提示
5. **PillarsSection** — 3つの柱（サービス概要）
6. **ProductSection** — 具体的なプロダクト紹介
7. **ResourcesSection** — リソース・記事紹介
8. **MembershipSection** — メンバーシップCTA
9. **FAQSection** — よくある質問
10. **AboutSection** — 自己紹介＋実績数値（アニメーションカウンター）
11. **ContactSection** — CTA4種（note / メンバーシップ / Discord / メール）＋SNSリンク
12. **Footer** — フッター
13. **MobileCTA** — スマホ固定CTA
14. **ScrollProgress** — スクロール進捗バー

## 技術スタック
- Next.js 16, React 19, TypeScript, Tailwind CSS 4
- Framer Motion（アニメーション）, Lucide React（アイコン）
- フォント: Playfair Display / Noto Sans JP / JetBrains Mono
- デプロイ先: Vercel（予定）

## 直近の変更履歴
1. `81a43e0` — web-designナレッジベースに基づく17項目の監査修正
2. `275208d` — Heroコピー改善（24体→専門特化したAIエージェントチーム）
3. `8fcefd8` — プロレベルビジュアル刷新（アニメーションボーダー、ベントグリッド、メッシュグラデーション）
4. `48b3645` — emoji → Lucide SVGアイコン＋グロー効果
5. `8f97d94` — しくみや特化×相手視点に全面リニューアル

## ワーキングツリーの状態
- `deleted: public/portfolio/sns_test.png` — 未コミットの削除（テスト画像、不要）
- **未追跡ディレクトリ:**
  - `.claude/` — Claude Code設定・メモリ（.gitignore推奨）
  - `_project_status.md` — 本ファイル（.gitignore推奨）
  - `src/app/test/` — テストページ（開発用、不要なら削除可）
  - `template-site/` — テンプレートサイト（別プロジェクトのコピー？）
  - `test/` — テスト用ファイル（image0.jpg, image1.jpg等）
  - `tmp_uploads/` — 一時アップロード用（.gitignore推奨）

## 未使用コンポーネント（page.tsxで未参照）
- `AchievementsSection.tsx`
- `IntroSplash.tsx`
- `PortfolioSection.tsx`
- `TimelineSection.tsx`

## 残タスク
- [ ] 本番デプロイ・Vercelホスティング設定
- [ ] OGP画像の作成・設定
- [ ] `.gitignore` に `.claude/`, `_project_status.md`, `tmp_uploads/`, `test/` を追加
- [ ] 未使用コンポーネントの整理（削除 or 再利用判断）
- [ ] `template-site/` の扱い決定（別リポジトリに移動 or 削除）
- [ ] Discord コミュニティリンクの設定（現在 Coming Soon）
- [ ] ポートフォリオ実績の充実（画像・事例追加）

## 重要ファイル
- `src/app/page.tsx` — メインページ（セクション構成）
- `src/app/layout.tsx` — レイアウト・メタデータ・フォント設定
- `src/app/globals.css` — グローバルスタイル
- `src/components/HeroSection.tsx` — ファーストビュー
- `src/components/AboutSection.tsx` — 自己紹介・実績数値
- `src/components/ContactSection.tsx` — CTA・SNSリンク
- `public/portfolio/` — 画像アセット

## 特記事項
- ポートフォリオ型 → しくみや（AI自動化）特化LPにリニューアル済み
- web-designスキル（25ファイル/9111行のナレッジベース）を活用して品質監査済み
- ダークテーマ基調（#0a0a0f）、シアン（#06b6d4）をアクセントカラーに使用
