@AGENTS.md

## 自動実行ルール

### 「note書いて」→ note記事フルフロー
1. まず memory/feedback_note_full_flow.md を読む
2. Phase 0〜7 + note下書き投稿を全て実行する（途中で止めない）
3. Phase 3で /thumbnail-design、Phase 6で /x-draft を必ずスキル経由で使う
4. Phase 4で generate_images.py を実行し、画像を実際に生成する（プロンプトで止めない）
5. 全成果物が揃ったら run_note_post.py でnote下書き投稿まで完了する
6. 記事構造は knowhow_lp_article_pattern.md のLP型に従う
7. 有料ラインは「興味あればこちらもどうぞ。」+ embed の後。有料パートはデータだけ

## 方針転換（2026-04-09〜04-12 確定）

### B2B SaaSサブスクリプションモデル
- **テンプレート販売は終了。B2B SaaSサブスクに完全移行**
- ターゲット: **全業種の中小零細企業**（建築業がv1パック。今後、無形商材・飲食・士業等に展開）
- 制作費: **0円**（初期費用ゼロ）
- 月額: おためし¥0 / おまかせ¥1,480 / おまかせプロ¥4,980
- 独自ドメイン: 全プラン対応
- 差別化: 「写真を送るだけ。あとは全部おまかせ」
- 全CTA → `/start` に統一。「無料相談」は不要

### テンプレートのパス（重要）
- **正しいパス**: `src/app/portfolio-templates/` + `src/components/portfolio-templates/`
- **本番URL**: `https://shikumiya.vercel.app/portfolio-templates/{テンプレ名}`
- **建築パック（9種）**: warm-craft, trust-navy, clean-arch × otameshi/omakase/omakase-pro (URL: base/base-mid/base-pro)
- **旧テンプレート**（studio-white, pastel-pop等）は308リダイレクト済み。将来削除
- **業種レジストリ**: `src/lib/industry-registry.ts`（35業種登録）

## 実行ファイル
- エントリーポイント: ./ (プロジェクトルート直下)
- 仮想環境: なし (Node.js)
- コマンド一覧:
  - npm run dev → 開発サーバー起動.bat
  - npm run build → ビルド.bat
