# SNS AutoControl App — 引き継ぎメモ

## プロジェクト概要
- **場所**: `C:/Users/ryoya/OneDrive/AI/Claude/Shikumiya-saas/SNS_AutoControl_App`
- **親プロジェクト**: `C:/Users/ryoya/OneDrive/AI/Claude/Shikumiya-saas/`（しくみやSaaS）
- **目的**: Instagram / Threads / X の投稿・エンゲージメント自動化 → noteへの集客導線
- **レポート**: `C:/Users/ryoya/OneDrive/AI/Claude/tmp_uploads/sns_autocontrol_report.html`（v7）

## SNSコンテンツ制作ワークフロー

テーマ1つから全SNS投稿+画像+note記事を一括で作る流れ。

### 全体フロー
```
1. リサーチ（並行3エージェント）
   /market-research + /art-trend + /article-research
   → 市場動向・競合・ファクト調査
     ↓
2. SNSパイプライン
   /sns-pipeline テーマ名
   → 投稿文5種（X通常・長文・スレッド・IG・Threads）
   → 必要な画像リスト（自動生成 / 手動スクショ）
   → 画像プロンプト
   → 投稿スケジュール
     ↓
3. 画像一括生成（Gemini API）
   run_sns_image_gen.py
   → サムネ・漫画・BA・図解・比較表・数字カード・チェックリスト（最大7種）
   → noteセクション画像（記事のh2ごと）
   → noteサムネ（16:9）
     ↓
4. 投稿
   run_auto_post.py --images 画像1.png 画像2.png ...
   → 画像自動分類・順序判定（image_classifier.py）
   → GitHubに画像アップロード → 公開URL取得
   → IGカルーセル投稿（最大10枚）
   → Threadsテキスト投稿
   → Xは手動
```

### コマンドまとめ
```bash
# リサーチ → パイプライン（Claude Code内で）
/sns-pipeline テーマ名

# 画像生成
python run_sns_image_gen.py --prompt "プロンプト" --platform all

# 投稿（IG+Threads）
python run_auto_post.py --images サムネ.png 漫画.png 図解.png --auto-approve

# カルーセル投稿（複数画像→自動順序判定）
python run_auto_post.py --images *.png
```

### 画像タイプ（7種）
| タイプ | 順序 | 用途 |
|---|---|---|
| サムネ（thumbnail） | 1番目 | スクロールを止める |
| 結果画面（result） | 2番目 | 証拠を見せる |
| 図解（diagram） | 3番目 | 仕組みを説明 |
| ちびキャラ漫画（comic） | — | 感情で伝える |
| Before/After | — | 変化を一目で |
| 比較表（comparison） | — | 2つの違いを明確に |
| 数字カード（number_card） | — | インパクト数字 |
| チェックリスト（checklist） | — | 保存用まとめ |

### 判断基準（自動選択）
- `lyo_preferences.md` に記載
- 選択肢は出さない。Lyoが選びそうな1案に絞る
- スクショはLyoの気まぐれで追加（なくても投稿可能）

### note記事の管理
- フォルダ名: 番号付き（004_タイトル）— 管理用
- 記事タイトル: 番号なし — 独立記事として
- セクション画像: Gemini APIで自動生成、imagesフォルダに格納

### メンバーシップ配布物
記事にコード・設計書を含める場合、有料ライン以下に配置:
1. 記事内のソースコード+設計書を `download/` フォルダにまとめる
2. config等のテンプレートは個人情報を除いた汎用版を作る
3. README.htmlを作成（セットアップガイド+設計書+トラブルシューティング）
4. ZIPに圧縮
5. 記事の有料パートはコード直貼りではなく「ZIPの中身説明+導入手順」のみ

```
記事フォルダ/
├── article.md
├── thumbnail.png
├── images/
│   └── section_XX.png ...
└── download/
    └── プロジェクト名/
        ├── ソースコード一式
        ├── config.json（テンプレート）
        ├── .env.example
        ├── README.html（設計書+ガイド）
        └── → ZIP化して配布
```

## 現在の進行状況（最終更新: 2026-04-05）

### 2026-04-05 011 comic-panel記事制作+しくみやMVPテスト

**011 comic-panel テンプレート記事 完成:**
- フォルダ: `note-drafts/publish-ready/011_comic-panel/`
- article.md: 無料パート（各セクション紹介）+ 有料パート（手順1〜4+トラブルシューティング）
- 配布物: download.zip + README.html
- サムネ: thumbnail.png（Gemini API生成）
- セクション画像: スクショ6枚 + Gemini生成画像で配置
- SNS投稿文: sns_posts.md
- 価格: 980円（Xプロモーションでリポスト0円）

**制作フロー10ステップを確立（メモリに記録済み）:**
- feedback_template_article_flow.md — 素材収集→配布物→記事→画像→SNSの正しい順番
- feedback_full_pipeline_flow.md — 配布物を記事より先に作る教訓

**しくみやサイト自動生成MVPテスト成功:**
- `lyo-vision-site/tmp_orders/` で顧客注文3件テスト
- `.claude-prompt.md` 方式（顧客データ+要望→Claude Code自動カスタマイズ）
- 全件Next.jsビルド成功

**comic-panelコンポーネント全7ファイル更新:**
- Header, HeroSection, WorksSection, AboutSection, ContactSection, Footer, SiteDataContext
- パス: `lyo-vision-site/src/components/portfolio-templates/comic-panel/`

### 2026-04-08 note_publisher日本語対応 + 013記事投稿

**note_publisher.py 日本語ファイル名対応:**
- `parse_article()` に3つのフォールバック追加
  1. `article.md` → なければ `記事.md` を読む
  2. 画像パス正規表現: `images/([\w.]+\.png)` → `(.+?\.png)` に（`画像/セクション_01.png` 等に対応）
  3. `sns_posts.md` → なければ `X投稿.md` を読む
- 011/012/013の全フォルダがrun_note_post.pyで投稿可能に

**013_スクショ自動化 note記事 下書き投稿済み:**
- フォルダ: `note-drafts/publish-ready/013_スクショ自動化/`
- テーマ: Playwrightでnote記事用スクショを自動撮影する方法
- ターゲット: 層B（AI開発・自動化勢）
- 価格: 無料
- サムネイル + セクション画像8枚（Gemini API生成）
- マガジン「AIで何か作ってみる開発日記」追加済み
- 注意: noteのSNSプロモーションUIが変わった模様。ラジオボタンが見つからずスキップされた → 手動設定必要

**012_パステルポップ note記事:**
- 記事完成、画像プロンプト完成、X投稿ドラフト完成
- 画像生成・note投稿は未実施（013を先行したため）

**注意: 記事フォルダの命名規則:**
- 011以降は日本語名（011_コミックパネル, 012_パステルポップ, 013_スクショ自動化）
- 010以前は英語名（article.md, images/, sns_posts.md）
- note_publisherは両方に対応済み

### 次セッションでやること
1. **012_パステルポップのnote投稿**（画像生成 → run_note_post.py）
2. **011_コミックパネルのnote投稿**（画像は生成済み）
3. **各記事のSNS告知**（X/IG/Threads）
4. **noteのXプロモーション機能のUI変更に対応**（note_publisher.py修正）

### 2026-03-29 note自動投稿システム完成

**note_publisher.py を新規作成（Discord BOTのpublisher.pyは触ってない）:**
- `actions/note_publisher.py` — NotePublisherクラス + parse_article()
- `run_note_post.py` — CLI実行スクリプト

**実装済み機能（全自動、投稿ボタンだけ手動）:**
1. ログイン
2. タイトル入力（React nativeValueSetter）
3. 本文入力（Markdown→HTML変換、無料/有料分割）
4. 有料ライン挿入（「+」メニュー→「有料エリア指定」）
5. 添付ファイル（「+」メニュー→「ファイル」、README.html→download.zipの順、手順1の直下）
6. セクション画像7枚（クリップボード貼り付け方式 — ファイルダイアログが開かない）
7. アイキャッチ画像アップロード
8. 公開設定画面（「公開に進む」クリック）
9. ハッシュタグ入力
10. 有料設定（「有料」ラジオ選択 + 価格入力）
11. SNSプロモーション機能（ActionChainsでラジオクリック + 割引0円 + プロモ投稿文入力 + 保存）
12. マガジン追加（「AIで何か作ってみる開発日記」）
13. 「試し読みエリアを設定」クリック（有料ラインの位置確認画面で停止）
14. **投稿ボタンは押さない** → Lyoが確認して手動で押す

**技術的な発見・解決策:**
- セクション画像: ファイルダイアログが開くとブロックされる → PowerShellでクリップボードコピー+Ctrl+V方式に変更
- Reactのラジオボタン: JS click()では切り替わらない → ActionChains.move_to_element().click()で解決
- textarea入力: send_keysでは反映されない場合がある → nativeValueSetterでReact stateを直接更新
- ファイルダイアログ閉じ: pyautoguiのEscapeは他ウィンドウに影響 → 使用禁止。Win32 API（FindWindowW #32770）で安全に閉じる
- 有料ライン位置: 分割マーカーを「今のうちにリポストして受け取ってください。」の後に変更

**使い方:**
```bash
# テスト投稿（ブラウザ表示、投稿ボタンは押さない）
python run_note_post.py --folder "010_コマンドは使う必要ない" --price 500

# ドライラン（解析結果のみ）
python run_note_post.py --folder "010_コマンドは使う必要ない" --dry-run

# 記事一覧
python run_note_post.py --list
```

**010記事の状態: 投稿完了（2026-03-30）**
- 記事: `010_コマンドは使う必要ない`
- URL: https://note.com/ando_lyo_ai/n/n9cc925c465bb
- 価格: 500円（SNSプロモーション: リポストで0円）
- 全自動投稿テスト成功 → Lyoが確認して手動投稿済み
- Xプロモ投稿: 自動（noteが公開時に自動投稿）
- Xリプ（noteリンク）: 自動投稿済み
- SNS投稿文: 記事告知+普段投稿2本+IG+Threads更新済み（sns_posts.md）
- 記事内容: README.html+download.zipありきの構成にリライト済み
- 埋め込みカード: SD144万行プロンプト集（250件売上実績）を有料ライン手前に配置
- マガジン: 「AIで何か作ってみる開発日記」に追加済み

**今後のnote投稿フロー:**
1. downloadフォルダ内のHTMLを除く全ファイルをZIPにまとめる
2. README.htmlはdownloadフォルダと同じ階層に置く
3. 記事内に埋め込みカードを入れる場合は `<!-- embed:URL -->` コメントで指定
4. 有料ライン手前にSD記事の誘導（前置き+カード）を入れる
5. `python run_note_post.py --folder "XXX" --price YYY` で自動投稿
6. ブラウザで確認 → 有料ライン位置調整 → 手動で「投稿」
7. 投稿後: `published_articles.json` のstatusをpublishedに更新、URL・日付を記録
8. Xリプでnoteリンクを投稿
9. `/note-links` で記事一覧・ステータス確認可能

**埋め込みカードの仕組み:**
- article.mdに `<!-- embed:URL -->` を書くと、その位置にnote埋め込みカードが挿入される
- ClipboardEvent paste方式（ProseMirrorがURL検知→カード化）
- 本文を embed前後で分割して入力→paste→残りを追加の3段階で正しい位置に挿入

**記事ステータス管理:**
- ファイル: `.claude/skills/note-links/knowledge/published_articles.json`
- ステータス: `draft`（未投稿） → `tested`（テスト済み） → `published`（公開済み）
- `/note-links 一覧` で全記事の状態を確認できる

### 次セッションでやること

1. **IG/Threads投稿**（010記事の告知）
2. **エンゲージメント実行**（スコアリング付き）
3. **X普段投稿**（sns_posts.mdの普段投稿①②を投稿）

### 2026-03-28〜29 の大幅改善

**エンゲージメント改善:**
- キーワードを「困りごと」ベースに変更（「作品 見てもらえない」「依頼 どこから来る」等）
- ターゲット適合スコア（0-100点）導入 — bio/投稿内容/フォロワー数/FF比で判定
- アクション品質スコア（0-100点）導入 — 全アクション（like/reply/follow/quote_rt）に記録
- DB拡張: engagement_targets に relevance_score/relevance_reasons、engagement_actions に quality_score/quality_reasons 追加
- 日次スコアサマリー（get_daily_score_summary）追加

**アカウント体制変更:**
- 「サブ垢」概念を廃止。**両アカウントともメイン**
- 18ファイルから「サブ垢」「集客用」表記を一掃
- 対象: _shared-rules.md, x-draft, sns-pipeline, accounts, HANDOFF.md, strategy, auto-generated系

**スキル修正（11件）:**
- メンバーシップ「停止中」を4スキルに反映
- 層D（クリエイター層）をCLAUDE.mdに追加
- thumbnail-design のフレーズ制限撤廃
- x-draft のトーン・アカウント定義更新
- note-seo, note-outline のマガジン→AI開発ジャーニーに統一

**full-workflow 全面改修:**
- Phase順序を最適化: 0→1→2→3→4→5→6→7（逆流ループ解消）
- Phase 0: テーマ判定（新設）
- Phase 1: リサーチ（A〜F 6カテゴリ22項目の選択式に拡張）
- Phase 2: 記事設計に導線設計+配布物設計を統合
- Phase 4: 配布物準備（記事より先にZIPを作る）
- Phase 5: 記事化（ZIPベースで手順を書く。リンク差し替えも統合）
- Phase 6: サムネ+セクション図解+SNS画像の3分類（6-A/6-B/6-C）
- Phase 7: SNS全投稿+DB登録
- article-research スキルもA〜Fカテゴリに同期更新

**ライティング改善:**
- AI多用ワード禁止リスト追加（正直/本音/実は/まさに等）
- 「構えずに出る感情」ルール追加（テンプレ化しない。ネガティブに偏らない）
- lyo_tone_guide.md、メモリ（グローバル）に記録

**導線設計（みかっち4回目の指摘）:**
- 「導線も考えられてる、というのがマーケティング。顧客を迷わせない」
- auto_reply/auto_quote_rt のプロンプトに導線意識を追加
- feedback_funnel_design.md（メモリ）に記録

**IG投稿の画像URL問題:**
- IG APIは公開URLが必要（ローカルファイルパスは使えない）
- GitHubアップロード方式を廃止（規約違反リスク）
- Flask `/serve-image/` エンドポイント + 既存ngrokトンネル経由で自動公開URL化に変更
- app.py に get_public_image_url() 関数追加
- 未テスト（ngrokトンネル競合問題あり。run_webhook_setup.pyが起動していること前提）

**note自動投稿:**
- `.env` に NOTE_EMAIL/NOTE_PASSWORD/NOTE_USERNAME 追加（ando_lyo_ai）
- 既存の publisher.py（`C:\Users\ryoya\OneDrive1\Discord\BOT\note\publisher.py`）でテスト投稿成功
- 足りない機能: セクション画像の差し込み、Xプロモーション設定、プロモ投稿文入力

**日次運用ゴール（全エージェント共通）:**
- 第一目標: noteの記事を読んでもらって知名度を上げる
- 最終目標: 高単価ファネルで毎月100万以上の売上
- 今はPhase 1（認知・信頼構築）

### 旧タスク（完了）

- ~~publisher.pyをSNS_AutoControl_Appに移植~~ → `actions/note_publisher.py` として新規作成済み
- ~~010記事をnoteに投稿~~ → テスト完了、未投稿

### Phase 0: 企画・設計 — 完了
- プロジェクト企画・設計完了
- スケルトン構築完了（全モジュール作成済み）

### Phase 1: API基盤構築 — 完了

**Meta開発者環境:**
- Metaアプリ「SNS_AutoControl_App」作成・公開済み（ライブモード）
- ビジネスポートフォリオ「Lyo Vision」作成済み
- IG/Threads API権限追加済み
- プライバシーポリシーページ作成・デプロイ済み（https://lyo-vision-site.vercel.app/privacy）

**Instagram — 完了（2アカウント）:**
- instagram.py API実装完了（投稿・コメント取得・返信・いいね・DM送信・プロフィール取得）
- OAuth認証フロー実装済み（app.py `/auth/instagram` + `/auth/instagram/callback`）
- @ando_lyo_ai: トークン取得済み（account_id: `27157152183874428`）
- @shikumiya.ai: トークン取得済み（account_id: `26169215136021957`）

**Threads — 完了（2アカウント）:**
- threads.py API実装完了（投稿・返信取得・リプライ・いいね・プロフィール・インサイト・削除・検索）
- OAuth認証フロー実装済み（app.py `/auth/threads`）
- @ando_lyo_ai: トークン取得済み（user_id: `25755694914113720`）
- @shikumiya.ai: トークン取得済み（user_id: `25733750896303497`）

**X — 完了（2アカウント・全機能テスト済み）:**
- undetected-chromedriver + Chrome専用プロファイルで自動化検出を回避
- アカウント別Chromeプロファイル:
  - shikumiya_ai: `C:/Users/ryoya/AppData/Local/Google/Chrome/AutomationProfile`
  - ando_lyo: `C:/Users/ryoya/AppData/Local/Google/Chrome/AutomationProfile_ando_lyo`
- テスト済み機能: テキスト投稿 / 画像付き投稿 / いいね / リプライ / フォロー / リポスト / 引用リポスト / 記事作成（Xプレミアム）
- 通常Seleniumはcdc_変数で検出されるため使用不可。詳細はmemory参照

**config.py — アカウント統合管理（2026-03-26）:**
- `ACCOUNTS`辞書で全アカウントの認証情報を一元管理
- `get_account(name)` / `get_ig_account(name)` / `get_threads_account(name)` / `get_x_account(name)` で切り替え
- 後方互換: 既存コードが参照する変数（INSTAGRAM_ACCESS_TOKEN等）も維持

**Webhook設定 — 完了（2026-03-26）:**
- Webhook via ngrok connected to Meta dashboard
- `run_webhook_setup.py`: Flask HTTPサーバー（port 8082）+ ngrokトンネルを起動
- `database.py`: `webhook_events`テーブルでイベントを永続保存

### WebUI Dashboard — 完了（2026-03-26）

- `templates/index.html` を3タブ構成にアップグレード: **投稿キュー / 返信キュー / 通知**
- 投稿の承認・却下UI（Pending posts approval/rejection）
- Webhookイベント表示機能
- 30秒ごとの自動リフレッシュ
- 画面上部にStats cards（統計サマリー）表示

### Task Scheduler — 登録済み（2026-03-26）

8タスク登録済み（`setup_tasks.ps1` で再登録可能）:

| トリガー | タスク |
|---|---|
| ログオン時 | WebUI起動（app.py） |
| ログオン時 | Webhook起動（run_webhook_setup.py） |
| 毎月1日 | トークン自動更新 |
| 毎日 7:00 | リサーチ（run_research.py） |
| 毎日 8:00 | ライター（run_writer.py） |
| 毎日 10:00 | 自動投稿（run_auto_post.py） |
| 毎日 22:00 | フェッチャー（run_fetcher.py） |
| 毎日 23:00 | アナリスト（run_analyst.py） |

### Phase 2: コメント返信自動化 — 実装完了・Instagram動作確認済み

**実装済みモジュール:**
- `auto_reply.py`: 自投稿コメントへの自動いいね＋返信生成（Claude CLI連携）
- `run_reply_check.py`: 定期実行スクリプト（`--platform ig/th/all`, `--auto-approve`）
- `app.py`: 承認API（`/api/approve-reply`）→ 実際のAPI投稿、却下API（`/api/reject-reply`）
- `database.py`: `pending_replies`テーブル、`get_pending_reply_by_comment_id()`, `reject_reply()`, `approve_reply()`

**動作確認結果（2026-03-22〜23）:**
- Instagram: コメント3件検出 → いいね成功 → 返信生成 → 承認待ち3件
- 承認待ちの返信がFlask WebUI（https://localhost:8081）で確認可能

**既知の問題:**
- Claude CLI は Claude Code セッション内からは実行不可（`CLAUDECODE`環境変数によるネスト防止）
  - → スタンドアロンのターミナルから実行するか、`CLAUDECODE`環境変数をunsetする必要あり
- Windows環境では `CLAUDE_CODE_GIT_BASH_PATH` の設定が必要な場合あり

### Phase 3: 自動投稿 — 実装完了・IG/Threads実投稿成功

**実装済みモジュール:**
- `run_auto_post.py`: 自動投稿実行スクリプト（`--image`, `--images`, `--platform ig_th`, `--auto-approve`, `--dry-run`）
- `auto_post.py`: 画像→テキスト生成→投稿（IG/Threads）、GitHub経由の画像ホスティング自動化
- `instagram.py`: `post_carousel()` カルーセル投稿対応（最大10枚）
- `image_classifier.py`: Gemini APIで画像タイプ自動分類・最適順序判定
- `database.py`: `pending_posts`テーブル、承認/却下API

**SNS画像自動生成（7種）:**
- サムネ（ちびデフォルメ+テキスト）
- ちびキャラ漫画（3コマ: 困る→気づき→解決）
- Before/After（変化の対比）
- フロー図（ステップ解説）
- 比較表（2方式の比較）
- 数字カード（インパクト数字）
- チェックリスト（保存用まとめ）

**実投稿結果:**
- Threads テキスト投稿: 成功
- Instagram 単体画像投稿: 成功
- Instagram カルーセル（サムネ+図解）: 成功

**運用フロー:**
```
/sns-pipeline テーマ名
  → 投稿文5種（X通常・長文・スレッド・IG・Threads）
  → 画像7種を一括生成
  → IGカルーセルとして一括投稿
  → Xは手動運用
```

### 次にやること（旧・優先度低）
1. **アイコン・ヘッダー画像の生成**（Lyo担当 — 各SNSアカウント用）
2. **固定ポストの投稿**（各アカウントのピン留め投稿）
3. **各SNSプロフィールの実際の変更**（bio・表示名・リンク等の反映）
4. **WebUIのパフォーマンスダッシュボード追加**（analyst.py分析結果の可視化）

### Phase 8: 自走サイクル — 実装完了（2026-03-25）

シロウ式6エージェント構成をLyo向けに実装。既存コードには一切触れていない。

**新規モジュール（actions/）:**
| ファイル | 役割 | 実行コマンド |
|---|---|---|
| `researcher.py` | テーマツリーからネタ収集（Claude CLI） | `python run_research.py --account shikumiya_ai` |
| `writer.py` | 品質スコア+類似度チェック付き投稿生成 | `python run_writer.py --account shikumiya_ai --platform threads --batch 5` |
| `fetcher.py` | 投稿メトリクス自動取得（1h/6h/24h） | `python run_fetcher.py --account shikumiya_ai` |
| `analyst.py` | パフォーマンス分析→フィードバックループ | `python run_analyst.py --account shikumiya_ai` |

**フィードバックループ:**
```
リサーチャー → ライター → [人間チェック] → ポスター → フェッチャー → アナリスト
    ↑                                                                    ↓
    └──────────── 分析結果が次のリサーチ＋ライターに自動で戻る ──────────┘
```

**ナレッジファイル（accounts/）:**
```
accounts/
├── _shared/                  # 全アカウント共通
│   ├── posting_rules.md       # プラットフォーム別ルール・8ブロック構成・スケジュール
│   ├── post_patterns.md       # 投稿パターン15種+ローテーションルール
│   └── quality_scoring.md     # 10項目品質スコア+類似度チェック+棄却ルール
├── shikumiya_ai/             # クリエイター界隈向け
│   ├── profile.md / target.md / genre.md / ng_words.md / tone_guide.md
│   ├── theme_tree.md / domain_knowledge.md
│   ├── research/ / analysis/ / drafts/
└── ando_lyo/                 # AI界隈向け（同構造）
```

**品質管理:**
- 10項目×10点スコアリング（平均7.0未満→棄却、最大2回書き直し）
- 過去100件との類似度チェック（0.85以上→棄却）
- 投稿パターンローテーション（直近3件と同じパターン禁止）
- tone_guide.mdによるAI臭さ排除チェック

**日次運用フロー（Task Scheduler用）:**
```
 7:00  python run_research.py --account shikumiya_ai
 8:00  python run_writer.py --account shikumiya_ai --platform threads --batch 10 --use-research --use-analysis
 9:00  人間がWebUIでOK/NG（5%の人間チェック = 10分）
10:00  python run_auto_post.py --platform ig_th（2時間おきに1本ずつ）
22:00  python run_fetcher.py --account shikumiya_ai
23:00  python run_analyst.py --account shikumiya_ai
```

**統合元:** スキルのルールファイルから抽出・統合
- `_shared-rules.md` → `accounts/_shared/posting_rules.md` + `quality_scoring.md`
- `lyo_tone_guide.md` → `accounts/*/tone_guide.md`
- `lyo_preferences.md` → `accounts/_shared/post_patterns.md`
- `longform_structure.md` → `accounts/_shared/posting_rules.md`（8ブロック構成）

### Phase 5: エンゲージメント自動化（X） — 実装完了（2026-03-27）

**リサーチベースの全自動エンゲージメント。** Xアルゴリズム公式ソースコード分析+各種成長戦略レポートに基づく設計。

**リサーチレポート:**
- `C:/Users/ryoya/OneDrive/AI/Claude/knowledge/x-growth-strategy-2025-2026.md`
- `C:/Users/ryoya/OneDrive/AI/Claude/SNS_AutoControl_App/strategy/instagram-growth-research-2026.md`
- `C:/Users/ryoya/OneDrive/AI/Claude/knowledge/threads-growth-research-2026-03-27.md`

**新規・変更ファイル:**
| ファイル | 内容 |
|---|---|
| `actions/engagement.py` | XEngagementクラス — 発見・いいね・リプライ・フォロー・引用RT全自動 |
| `run_engagement.py` | 実行スクリプト（--account, --keywords, --only, --add-targets, --dry-run, --stats） |
| `accounts/_shared/engagement_rules.md` | レート制限・リプライルール・ターゲット配分・シャドウバン回避ルール |
| `platforms/x_twitter.py` | search_posts, get_user_profile, get_user_posts, like_post, reply_to_post 追加 |
| `database.py` | engagement_targets, engagement_actions, engagement_daily_stats テーブル追加 |

**使い方:**
```bash
# フルサイクル（発見→いいね→リプライ→フォロー→引用RT）
python run_engagement.py --account shikumiya_ai

# いいね+リプライのみ
python run_engagement.py --account ando_lyo --only like,reply

# ターゲット手動追加
python run_engagement.py --account shikumiya_ai --add-targets @user1 @user2

# 日次統計
python run_engagement.py --account shikumiya_ai --stats
```

**レート制限（安全マージン込み）:**
- いいね: 120/hour, 800/day
- リプライ: 15/hour, 50/day（Claude CLI生成、毎回異なるテキスト）
- フォロー: 30/hour, 100/day
- 引用RT: 10/hour, 30/day
- アクション間: 15-90秒ランダム待機

**ターゲット配分:** 大(50K+): 40% / 中(5K-50K): 40% / 小(<5K): 20%

**重要な発見（リサーチ結果）:**
- 会話成立(+75)がいいね(x1)の150倍の重み → リプライ最優先
- 投稿後30分の初速が全て → フレッシュな投稿を狙う
- Premium課金でリーチ2-4倍
- テキスト投稿がXでは動画より30%高パフォーマンス
- Dwell Time（滞在2分+）= いいねの22倍の重み → リプライは読み応え重視

**追加機能（2026-03-27）:**

| 機能 | コマンド | 説明 |
|---|---|---|
| 初速ブースト | `--boost URL` | 自投稿にもう1アカウントから即いいね+リプ。アルゴリズム初速(+75)を自動確保 |
| スマートアンフォロー | `--unfollow` | 非アクティブ・スパム垢を自動検出→アンフォロー。フォロー/フォロワー比率維持 |
| エバーグリーンリサイクル | `--recycle` | 過去バズ投稿をClaude CLIでリライト→再投稿。コンテンツ資産の再活用 |
| 滞在時間ハック | (自動) | リプライを3-4文+問いかけで終わる形に改善。ブックマーク誘発情報を含める |

```bash
# 初速ブースト（投稿直後にもう1アカウントからいいね+リプ）
python run_engagement.py --account shikumiya_ai --boost https://x.com/shikumiya_ai/status/123

# スマートアンフォロー
python run_engagement.py --account shikumiya_ai --unfollow --max-unfollows 50

# エバーグリーンリサイクル
python run_engagement.py --account shikumiya_ai --recycle --min-likes 10
```

### Phase 4: WebUI拡充 — 実装完了（2026-03-27）

- **エンゲージメントタブ追加**: 直近アクション一覧+ターゲットリスト表示
- **スタッツカード拡充**: 今日の投稿数・いいね・リプライ・フォロー・ターゲット数をライブ表示
- **新規API**: `/api/dashboard-stats`, `/api/engagement-stats`, `/api/engagement-targets`, `/api/engagement-actions`
- **自動リフレッシュ改善**: ページ全体リロード → 統計のみ30秒ごとAjax更新

### Phase 6: note連携パイプライン — 実装完了（2026-03-27）

note記事公開後 → 全SNS告知+初速ブーストを自動化。

**フロー:**
```
記事フォルダ（article.md + thumbnail.png）
  → Claude CLIでX/IG/Threads各告知文を自動生成
  → サムネをGitHub経由でURL化
  → IG投稿（API） + Threads投稿（API） + X投稿（Selenium）
  → Xはリンクをリプライで（リーチ減回避）
  → 初速ブースト（もう1アカウントからいいね+リプ）
```

**使い方:**
```bash
# フルパイプライン
python run_note_pipeline.py --folder "007_テーマ1つで..." --url https://note.com/xxx/n/xxx

# Xだけ
python run_note_pipeline.py --folder "007_..." --url https://note.com/... --only x

# テキスト生成のみ（投稿しない）
python run_note_pipeline.py --folder "007_..." --url https://note.com/... --dry-run

# 記事フォルダ一覧
python run_note_pipeline.py --list
```

**ファイル:**
| ファイル | 内容 |
|---|---|
| `actions/note_pipeline.py` | NotePipelineクラス — 記事読み込み・テキスト生成・全SNS投稿・ブースト |
| `run_note_pipeline.py` | CLI実行スクリプト |

### 未着手フェーズ
- Phase 5b: エンゲージメント自動化（IG/Threads — Selenium実装予定）
- Phase 7: 完全自動化移行

## 戦略ピボット（2026-03-25 確定）

**詳細ドキュメント:** `strategy/` フォルダに全資料あり

### 方針
- AI界隈 → クリエイター界隈（イラストレーター、デザイナー等）へピボット
- 2アカウント並行運用:
  - @ando_lyo = **メイン**（AI×自動化の切り口）表示名: `Lyo🏵️AI画像の仕組み屋`
  - @shikumiya_ai = **メイン**（クリエイター向け・今注力中）表示名: `しくみや（Lyo）`
- ブランド構造: しくみや（お店）→ Lyo（管理者）→ AI Creation Lab（コンテンツ）
- note: 名前「Ando Lyo🏵️しくみや」（確定）
  - bio: 「画像生成もAI開発もやる、しくみやのLyoです。作品づくりに集中できる仕組みを作って全部公開してます。AI画像生成歴3年 / ポートフォリオ・SNS・発信の自動化」
- 固定ポスト: 投稿済み（両アカウント、要ピン留め）

### ターゲット絞り込み（2026-03-26 決定）
- **最初のターゲット: 「作れるのに、ポートフォリオサイトがなくて届けられてないクリエイター」**
- konmari型アプローチ: 「作る力はあるのに、届ける・見せるの部分が止まってる人」を助ける
- Lyoの実体験: AIアートを作っていたがSNSにしか出せず、サイトがなかった → Claude Codeで自分のサイト（しくみや）を作った
- 競合: お名前.com AI HPパック（月2,855円）→ **競合ではない**（SaaS=借り物 vs Lyo=作れるようになる体験）
- 本当の競合は「めんどくさいからやらない」という無行動
- みかっちから3回「ターゲットが広すぎる」と指摘を受けてようやく絞れた。みかっちOK済み

### 収益化方針（2026-03-26 確定）
- **今はPhase 1（認知・信頼構築）に全集中**。高単価商品の設計は後回し
- note有料記事はXプロモーション（リポストで0円）で拡散 → 認知優先
- テンプレ・設計図は無料で全公開 → 「渡してもできない → 直接聞きたい」→ 将来の高単価に繋がる
- Lyoの実力証明は**ビフォーアフター**を見せるだけで十分（みかっち助言）
- 詳細: `strategy/mikacchi-feedback-2026-03-26.md`

### メンバーシップ方針（2026-03-26 確定）
- みかっちの問い: 「そもそもメンバーシップの存在意義は？」→ Lyo: 「今は、ほぼないですね」
- 元々やってみたかっただけで始めた → 存在意義が薄い
- **現実的な運用**: 有料記事の価格を少し高めに設定して、メンバーシップに入れば読める形で残す
- メンバーシップ専用コンテンツを無理に作る必要はない

### ファネル（確定）
```
Phase 1（今）:
  note有料記事 → Xプロモーション（リポストで無料・期間限定）→ 認知+価値提供

Phase 2（フォロワー目標達成後）:
  メンバーシップ移行 or 高単価マガジン販売 or Discordコミュニティ
```

### Xプロモーション用記事の要件（みかっち指示）
- **読んだ人を行動させる仕掛け**を必ず入れる
  - Xについて投稿したくなる仕掛け
  - 感想を書きたくなる仕掛け
  - すぐにできそうなこと（例: 画像生成してみた、Midjourneyのv8でマンガ作成）
- プロモーション用記事は新規作成する（既存記事の流用ではない）
- プロモ = 認知 + 価値提供

### みかっちからの宿題
- **競合のローンチ手法を研究する**: Claude Code系セミナーやコンテンツ販売者のLINEに登録して、販売導線の情報を取る
- **Hakushiさんのnote記事を参考にする**: https://note.com/kawakijourney_ai/n/n8c4fd58c7660

### 戦略ドキュメント一覧
| ファイル | 内容 |
|---|---|
| `strategy/pivot_self_view.html` | 自分視点レポート（プロモーション含む）— **source of truth** |
| `strategy/pivot_target_view.html` | ターゲット視点レポート |
| `strategy/knowhow_distributable.html` | メンバーシップ配布用ノウハウ |
| `strategy/knowhow_strategy_process.md` | 思考プロセスの記録 |
| `strategy/mikacchi_pivot_raw.md` | みかっちコンサル会話の生データ |
| `strategy/mikacchi-feedback-2026-03-26.md` | 収益化・メンバーシップ相談+ターゲット決定（回答待ち） |

### スキル更新済み
- `_shared-rules.md`: 層D（クリエイター層）を追加、アカウント切り分けルール追加
- `x-draft/knowledge/lyo_tone_guide.md`: @shikumiya_ai用トーンガイド追加
- `sns-pipeline/knowledge/lyo_preferences.md`: アカウント判定ルール追加
- `content-goals/SKILL.md`: 再成長期の具体例更新

## 技術方針（確定事項）
- **Instagram/Threads**: Meta公式API（無料）— 2アカウント対応
- **X**: undetected-chromedriver + Chrome専用プロファイル（API不使用・BAN覚悟）— 2アカウント対応
- **AI生成**: Claude Code CLI（`claude -p`でサブプロセス呼び出し、APIキー不要）
- **スケジューリング**: Windowsタスクスケジューラー
- **管理画面**: Flask WebUI（承認制 → 将来的に完全自動）
- **投稿画像**: フォルダ監視方式
- **コメント返信**: 全コメントにいいね＋返信 / 2-3文 / 変更前提設計
- **返信トーン**: 丁寧な敬語、親しみやすく、楽観的なクリエイター
- **note連携**: 既存note自動投稿システム（`C:\Users\ryoya\OneDrive1\Discord\BOT\note`）と連携
- **ポートフォリオ**: https://lyo-vision-site.vercel.app
- **Discord連携**: 投稿ネタとしてのみ（システムには組み込まない）

## アカウント情報

### @ando_lyo（メイン — AI×自動化の切り口）
- X: @ando_lyo（Xプレミアム・記事作成可能）
- Instagram: @ando_lyo_ai（プロアカウント済み・IG account_id: `27157152183874428`）
- Threads: @ando_lyo_ai（user_id: `25755694914113720`）
- note: Ando Lyo🏵️しくみや（統合1アカウント。EMAIL: ryoya112@gmail.com）

### @shikumiya_ai（メイン — クリエイター向け・今注力中）
- X: @shikumiya_ai
- Instagram: @shikumiya.ai（クリエイターアカウント・IG account_id: `26169215136021957`）
- Threads: @shikumiya.ai（user_id: `25733750896303497`）

### Metaアプリ情報
- アプリ名: SNS_AutoControl_App
- InstagramアプリID: 2198289261003047
- ThreadsアプリID: 1990673371886235
- ビジネスポートフォリオ: Lyo Vision
- 両アカウント（ando_lyo_ai / shikumiya.ai）がIG・Threadsテスターとして登録済み

## ファイル構成
```
SNS_AutoControl_App/
├── app.py                  # Flask WebUI + Instagram OAuth
├── config.py               # 設定管理（REDIRECT_URI追加済み）
├── database.py             # SQLite履歴管理
├── requirements.txt
├── .env.example
├── .gitignore
├── platforms/
│   ├── base.py             # 共通インターフェース
│   ├── instagram.py        # Instagram Graph API（実装済み）
│   ├── threads.py          # Threads API（実装済み）
│   └── x_twitter.py        # X Selenium（実装済み）
├── actions/
│   ├── auto_reply.py       # コメント返信（実装済み）
│   ├── auto_post.py        # 自動投稿（実装済み）
│   ├── auto_like.py        # 自動いいね（実装済み）
│   ├── engagement.py       # エンゲージメント（スキル枠）
│   ├── note_pipeline.py    # note連携（設計済み）
│   ├── researcher.py       # リサーチャー（NEW: ネタ収集）
│   ├── writer.py           # ライター（NEW: 品質スコア付き投稿生成）
│   ├── fetcher.py          # フェッチャー（NEW: メトリクス取得）
│   └── analyst.py          # アナリスト（NEW: 分析フィードバック）
├── accounts/                # NEW: マルチアカウントナレッジ
│   ├── _shared/             # 共通ルール（投稿ルール・品質基準）
│   ├── shikumiya_ai/        # @shikumiya_ai ナレッジ
│   └── ando_lyo/            # @ando_lyo ナレッジ
├── ai/
│   ├── claude_cli.py        # Claude Code CLI呼び出し（実装済み）
│   └── image_classifier.py  # 画像分類（実装済み）
├── watcher/
│   └── folder_watcher.py   # フォルダ監視（実装済み）
└── templates/
    └── index.html          # ダッシュボードUI（実装済み）
```
