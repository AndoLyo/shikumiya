"""
アナリストエージェント — 投稿パフォーマンス分析＋フィードバックループ
メトリクスを分析して「何が伸びたか」「何を改善すべきか」をレポートする
リサーチャーとライターが次回参照するファイルに結果を書き出す
"""
import json
import logging
import os
from datetime import datetime

from ai.claude_cli import _call_claude_cli
from actions.fetcher import get_metrics_summary

logger = logging.getLogger(__name__)

PROJECT_ROOT = os.path.dirname(os.path.dirname(__file__))


def _read_file(path: str) -> str:
    try:
        with open(path, "r", encoding="utf-8") as f:
            return f.read()
    except FileNotFoundError:
        return ""


def _load_recent_drafts(account: str, limit: int = 20) -> list[dict]:
    """直近の下書きバッチから投稿テキストとスコアを取得"""
    drafts_dir = os.path.join(PROJECT_ROOT, "accounts", account, "drafts")
    if not os.path.exists(drafts_dir):
        return []

    files = sorted(
        [f for f in os.listdir(drafts_dir) if f.startswith("batch_") and f.endswith(".json")],
        reverse=True,
    )
    all_drafts = []
    for fname in files[:5]:  # 直近5バッチ
        try:
            with open(os.path.join(drafts_dir, fname), "r", encoding="utf-8") as f:
                data = json.load(f)
            for draft in data.get("accepted", []):
                all_drafts.append(draft)
        except Exception:
            continue
    return all_drafts[:limit]


def analyze(db_path: str, account: str, days: int = 7) -> dict | None:
    """メトリクスと下書きデータを分析し、改善レポートを生成する

    Returns:
        {
            "summary": "全体の傾向",
            "top_posts": [...],
            "weak_patterns": [...],
            "recommendations": [...],
            "theme_feedback": "テーマに関するフィードバック",
        }
    """
    # データ収集
    metrics = get_metrics_summary(db_path, account=account, days=days)
    drafts = _load_recent_drafts(account)
    pattern_log_path = os.path.join(PROJECT_ROOT, "accounts", "_shared", "pattern_log.json")
    pattern_log = _read_file(pattern_log_path)

    if not metrics and not drafts:
        logger.warning("No data to analyze")
        return None

    # メトリクスをJSON化
    metrics_text = json.dumps(metrics[:50], ensure_ascii=False, indent=2) if metrics else "データなし"
    drafts_text = json.dumps(
        [{"text": d.get("text", "")[:100], "pattern": d.get("pattern"), "avg_score": d.get("avg_score"),
          "platform": d.get("platform")} for d in drafts],
        ensure_ascii=False, indent=2,
    ) if drafts else "データなし"

    prompt = f"""あなたはSNS投稿のアナリストです。以下のデータを分析して改善レポートを作成してください。

【直近{days}日間のメトリクス（投稿のパフォーマンス）】
{metrics_text}

【直近の投稿下書き（スコア付き）】
{drafts_text}

【パターン使用ログ】
{pattern_log[:2000] if pattern_log else "ログなし"}

---

以下のJSON形式で分析結果を出力してください。JSON以外は出力しないでください。

{{
  "summary": "全体の傾向（2〜3文）",
  "top_patterns": ["伸びてるパターン名1", "パターン名2"],
  "weak_patterns": ["伸びてないパターン名1"],
  "hot_themes": ["今伸びてるテーマ1", "テーマ2"],
  "tired_themes": ["飽きられてきたテーマ1"],
  "recommendations": [
    "具体的な改善提案1",
    "具体的な改善提案2",
    "具体的な改善提案3"
  ],
  "hook_feedback": "1行目のフックについてのフィードバック",
  "tone_feedback": "トーン・口調についてのフィードバック",
  "next_actions": [
    "リサーチャーへの指示（何を調べるべきか）",
    "ライターへの指示（何を意識すべきか）"
  ]
}}"""

    result = _call_claude_cli(prompt, timeout=120)
    if not result:
        logger.error("Claude CLI returned no output for analysis")
        return None

    try:
        text = result.strip()
        if "```json" in text:
            text = text.split("```json")[1].split("```")[0]
        elif "```" in text:
            text = text.split("```")[1].split("```")[0]
        report = json.loads(text.strip())
    except (json.JSONDecodeError, IndexError) as e:
        logger.error(f"Failed to parse analysis JSON: {e}\nRaw: {result[:200]}")
        return None

    report["analyzed_at"] = datetime.now().isoformat()
    report["account"] = account
    report["days"] = days

    # 分析結果をファイルに保存（ライターとリサーチャーが読む）
    analysis_dir = os.path.join(PROJECT_ROOT, "accounts", account, "analysis")
    os.makedirs(analysis_dir, exist_ok=True)

    # 最新の分析結果（常に上書き = ライター/リサーチャーはこれを読む）
    latest_path = os.path.join(analysis_dir, "latest.json")
    with open(latest_path, "w", encoding="utf-8") as f:
        json.dump(report, f, ensure_ascii=False, indent=2)

    # 履歴（追記）
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    history_path = os.path.join(analysis_dir, f"report_{timestamp}.json")
    with open(history_path, "w", encoding="utf-8") as f:
        json.dump(report, f, ensure_ascii=False, indent=2)

    logger.info(f"Analysis complete → {latest_path}")
    return report


def get_latest_analysis(account: str) -> str:
    """ライター/リサーチャーが参照する最新分析テキストを返す"""
    latest_path = os.path.join(PROJECT_ROOT, "accounts", account, "analysis", "latest.json")
    if not os.path.exists(latest_path):
        return ""
    try:
        with open(latest_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        # ライターが読みやすい形式に変換
        lines = []
        lines.append(f"## 直近の分析結果（{data.get('analyzed_at', '不明')}）")
        lines.append(f"概要: {data.get('summary', '')}")
        if data.get("top_patterns"):
            lines.append(f"伸びてるパターン: {', '.join(data['top_patterns'])}")
        if data.get("weak_patterns"):
            lines.append(f"伸びてないパターン: {', '.join(data['weak_patterns'])}")
        if data.get("hot_themes"):
            lines.append(f"今熱いテーマ: {', '.join(data['hot_themes'])}")
        if data.get("tired_themes"):
            lines.append(f"飽きられてきたテーマ: {', '.join(data['tired_themes'])}")
        if data.get("hook_feedback"):
            lines.append(f"フックの改善: {data['hook_feedback']}")
        if data.get("next_actions"):
            lines.append("改善アクション:")
            for action in data["next_actions"]:
                lines.append(f"  - {action}")
        return "\n".join(lines)
    except Exception:
        return ""
