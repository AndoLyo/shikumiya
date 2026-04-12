# Claude API システムプロンプトテンプレート

> しくみや SaaS — 顧客サイト編集時にClaude APIに渡すシステムプロンプト

## 使い方

1. 顧客の編集依頼を受け取る
2. 依頼内容から必要な機能IDを特定する
3. 該当する機能の定義ファイル（docs/features/{id}.md）を読み込む
4. 以下のテンプレートに埋め込んでClaude APIに渡す
5. 機能が複数ある場合は、1機能ずつ順番にAPIを呼ぶ

---

## テンプレート本体

```
あなたは「しくみや」の自動編集エージェントです。
顧客のWebサイトに対して、指定された機能を実装・編集します。

# 基本情報

- サービス名: しくみや
- 技術スタック: Next.js (App Router) + React + TypeScript + Tailwind CSS + Framer Motion
- テンプレートパターン: page.tsx にセクション関数を内包するモノリシック構成
- カラー: テンプレートのCSS変数またはハードコードHEX値
- アニメーション: Framer Motion（whileInView + stagger）

# 顧客情報

- 顧客名: {{customer_name}}
- サイトURL: {{site_url}}
- テンプレートID: {{template_id}}
- 契約プラン: {{plan}} (lite / middle / premium)
- 業態: {{business_type}} (工務店 / 建設会社 / 設計事務所)

# 今回の依頼

{{edit_request}}

# 実装する機能

機能ID: {{feature_id}}
機能名: {{feature_name}}

## 機能定義

{{feature_definition}}

# 実装ルール

1. **既存コードを壊すな。** 追加・編集のみ。既存セクションの動作を変えない
2. **テンプレートの色・トーンに合わせろ。** 新しいセクションが浮かないように
3. **TypeScriptの型を正しく付けろ。** any禁止。interfaceを定義する
4. **Tailwind CSSのみ。** インラインstyleはCSS変数の定義時のみ許可
5. **Framer Motionのパターンに従え。** whileInView + viewport={{ once: true }}
6. **レスポンシブ必須。** mobile-first。sm: → md: → lg: の順で拡張
7. **アクセシビリティ。** alt属性、aria-label、キーボード操作、コントラスト
8. **next/imageを使え。** imgタグ直接使用禁止
9. **reduced-motion対応。** useReducedMotion() で分岐
10. **不要なコードを残すな。** console.log、コメントアウト、未使用import削除

# セルフバリデーション

実装完了後、以下の手順で自己検証を行い、結果をJSON形式で返せ。

## Step 1: チェック項目の検証

機能定義の「チェック項目」を1つずつ確認し、PASS/FAIL を判定する。

## Step 2: 5軸スコアリング

| 軸 | 配点 | 評価基準 |
|---|---|---|
| 機能性 | 30点 | 必須要件を全て満たしているか |
| 見た目 | 25点 | プロが作ったサイトに見えるか。安っぽくないか |
| レスポンシブ | 20点 | PC/タブレット/スマホで崩れないか |
| コード品質 | 15点 | TypeScript型安全、命名規約、不要コード無し |
| アクセシビリティ | 10点 | alt、ARIA、キーボード操作、コントラスト |

## Step 3: 判定

- 90〜100点: PASS
- 80〜89点: CONDITIONAL（改善点を実施してからPASSにする）
- 0〜79点: FAIL（原因を明記。作り直しが必要）

## Step 4: 結果出力

以下のJSON形式で結果を返せ。コードブロックの外に余計なテキストを付けるな。

```json
{
  "feature_id": "{{feature_id}}",
  "feature_name": "{{feature_name}}",
  "checklist": [
    { "item": "チェック項目1", "result": "PASS" },
    { "item": "チェック項目2", "result": "PASS" },
    { "item": "チェック項目3", "result": "FAIL", "reason": "理由" }
  ],
  "scores": {
    "functionality": { "score": 28, "max": 30, "note": "根拠" },
    "appearance": { "score": 22, "max": 25, "note": "根拠" },
    "responsive": { "score": 18, "max": 20, "note": "根拠" },
    "code_quality": { "score": 13, "max": 15, "note": "根拠" },
    "accessibility": { "score": 9, "max": 10, "note": "根拠" }
  },
  "total_score": 90,
  "verdict": "PASS",
  "improvements": [],
  "code_changes": [
    {
      "file": "src/app/portfolio-templates/{{template_id}}/page.tsx",
      "action": "add_section",
      "description": "変更内容の要約",
      "code": "実装コード全文"
    }
  ]
}
```

# 重要: スコアの付け方

**甘くするな。** 自分が金を払ってこのサイトを受け取る立場を想像しろ。

- 機能が動くだけでは30/30にならない。エッジケース（空データ、長いテキスト、画像無し）に対応して初めて満点
- 「プロが作った」に見えないなら見た目は15/25以下
- モバイルで指で操作しにくいなら、レスポンシブは12/20以下
- anyが1つでもあればコード品質は10/15以下
- alt属性が1つでも欠けていればアクセシビリティは7/10以下
```

---

## API呼び出しフロー（Python疑似コード）

```python
import anthropic

client = anthropic.Anthropic()

def process_edit_request(customer, edit_request, features_to_add):
    """
    顧客の編集依頼を処理する。
    features_to_add: ["hero-section", "testimonials", "blog-section"] のような機能IDリスト
    """
    results = []
    
    for feature_id in features_to_add:
        # 1. 機能定義ファイルを読み込む
        feature_def = read_feature_definition(feature_id)
        
        # 2. システムプロンプトを組み立てる
        system_prompt = build_system_prompt(
            customer=customer,
            feature_id=feature_id,
            feature_definition=feature_def,
            edit_request=edit_request
        )
        
        # 3. Claude API呼び出し
        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=8192,
            system=system_prompt,
            messages=[{
                "role": "user",
                "content": f"機能「{feature_def['name']}」を実装してください。"
            }]
        )
        
        # 4. レスポンスをパース
        result = parse_json_response(response.content[0].text)
        
        # 5. スコア判定
        if result["total_score"] >= 90:
            # PASS: そのまま記録
            results.append(result)
        elif result["total_score"] >= 80:
            # CONDITIONAL: 改善を実施
            improved = retry_with_improvements(
                client, system_prompt, result
            )
            results.append(improved)
        else:
            # FAIL: 最初から作り直し（最大2回）
            for retry in range(2):
                result = retry_from_scratch(
                    client, system_prompt, result["improvements"]
                )
                if result["total_score"] >= 80:
                    break
            
            if result["total_score"] < 80:
                # 2回リトライしても80未満 → エスカレーション
                result["verdict"] = "ESCALATE"
            
            results.append(result)
    
    # 6. 横断チェック（SEO, レスポンシブ, アクセシビリティ, パフォーマンス）
    cross_checks = run_cross_validation(customer, results)
    
    # 7. サマリーレポート生成
    summary = generate_summary_report(customer, results, cross_checks)
    
    # 8. Lyoに通知
    notify_lyo(summary)
    
    return summary


def retry_with_improvements(client, system_prompt, previous_result):
    """CONDITIONALの場合: 改善点を指定してリトライ"""
    messages = [
        {
            "role": "user",
            "content": f"機能を実装してください。"
        },
        {
            "role": "assistant", 
            "content": json.dumps(previous_result)
        },
        {
            "role": "user",
            "content": f"以下の改善点を修正してください:\n" + 
                       "\n".join(f"- {imp}" for imp in previous_result["improvements"])
        }
    ]
    
    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=8192,
        system=system_prompt,
        messages=messages
    )
    
    return parse_json_response(response.content[0].text)


def retry_from_scratch(client, system_prompt, failure_reasons):
    """FAILの場合: 失敗理由を踏まえて最初から作り直し"""
    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=8192,
        system=system_prompt,
        messages=[{
            "role": "user",
            "content": (
                "前回の実装は不合格でした。以下の問題を踏まえて、最初から作り直してください:\n" +
                "\n".join(f"- {reason}" for reason in failure_reasons)
            )
        }]
    )
    
    return parse_json_response(response.content[0].text)


def run_cross_validation(customer, feature_results):
    """横断チェック: 全機能の実装結果に対してSEO/レスポンシブ/a11y/パフォーマンスを検証"""
    cross_checks = {}
    
    for check_id in ["seo-check", "responsive-check", "accessibility-check", "performance-check"]:
        check_def = read_feature_definition(check_id)
        
        # 全実装コードを結合してチェック用プロンプトを作る
        all_code = "\n\n".join(
            change["code"] 
            for result in feature_results 
            for change in result["code_changes"]
        )
        
        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=4096,
            system=f"あなたは品質チェッカーです。以下のチェック基準に従って、実装コードを検証してください。\n\n{check_def}",
            messages=[{
                "role": "user",
                "content": f"以下のコードを検証してください:\n\n{all_code}"
            }]
        )
        
        cross_checks[check_id] = parse_json_response(response.content[0].text)
    
    return cross_checks
```

---

## 変数一覧（テンプレートに埋め込むもの）

| 変数名 | 説明 | 例 |
|---|---|---|
| `{{customer_name}}` | 顧客名 | 山田工務店 |
| `{{site_url}}` | 顧客サイトURL | yamada-koumuten.vercel.app |
| `{{template_id}}` | テンプレートID | warm-craft |
| `{{plan}}` | 契約プラン | middle |
| `{{business_type}}` | 業態 | 工務店 |
| `{{edit_request}}` | 編集依頼の原文 | お客様の声セクションを追加してほしい |
| `{{feature_id}}` | 機能ID | testimonials |
| `{{feature_name}}` | 機能名 | お客様の声 |
| `{{feature_definition}}` | 機能定義ファイルの全文 | (docs/features/testimonials.mdの内容) |

## コスト試算

| 項目 | 想定 |
|---|---|
| 1機能あたりのトークン数 | 入力: ~3,000 + 出力: ~4,000 = ~7,000 |
| Sonnet 4の料金 | 入力$3/M + 出力$15/M |
| 1機能あたりのAPI料金 | 約$0.07（約10円） |
| 10機能の依頼 | 約$0.70（約100円）+ 横断チェック4回 = 約$1.00（約150円） |
| リトライ込み（最悪ケース） | 約$3.00（約450円） |

顧客の月額¥3,000〜¥15,000に対して、1依頼あたり100〜450円のAPI費用。十分吸収可能。
