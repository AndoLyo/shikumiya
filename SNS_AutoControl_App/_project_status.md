# SNS AutoControl App — プロジェクトステータス

> 最終更新: 2026-03-29 22:20

## 概要
Instagram/Threads/Xの投稿・コメント返信・エンゲージメントを自動化し、noteへの集客導線を構築するPython製SNS自動運用システム。2アカウント（ando_lyo / shikumiya_ai）を並行運用。

## 状態
- ステータス: active
- 進捗: 65%

## 直近の変更
Phase 8（自走サイクル）実装完了 — researcher/writer/fetcher/analystの6エージェント構成。戦略ピボット（AI界隈→クリエイター界隈）確定、ターゲットを「ポートフォリオサイトがないクリエイター」に絞り込み。WebUI 3タブ構成・Task Scheduler 8タスク登録済み。

## 残タスク
  - Phase 4: Flask WebUI管理画面の拡充（パフォーマンスダッシュボード追加）
  - Phase 5: エンゲージメント戦略の実装（戦略ピボット済み・未実装）
  - Phase 6: note連携パイプライン実装
  - Phase 7: 完全自動化移行
  - アイコン・ヘッダー画像の生成、固定ポストのピン留め、各SNSプロフィール反映

## 技術スタック
Python, Flask, SQLite, Meta Graph API (IG/Threads), undetected-chromedriver (X), Claude CLI, Gemini API, Windows Task Scheduler, ngrok

## 重要ファイル
HANDOFF.md, config.py, app.py, database.py, actions/writer.py, actions/researcher.py, actions/auto_post.py, ai/claude_cli.py, platforms/x_twitter.py

## 特記事項
Phase 0-3+8完了、Phase 4-7未着手。みかっちメンターからの戦略フィードバックに基づきピボット済み。Claude CLI はClaude Codeセッション内から実行不可（ネスト防止）の制約あり。
