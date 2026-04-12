"""
リサーチャーエージェント — テーマツリーに基づくネタ収集
Claude CLIを使って、テーマツリーの足りないネタを重点的に調査する
"""
import json
import logging
import os
from datetime import datetime

from ai.claude_cli import _call_claude_cli

logger = logging.getLogger(__name__)

PROJECT_ROOT = os.path.dirname(os.path.dirname(__file__))


def _read_file(path: str) -> str:
    try:
        with open(path, "r", encoding="utf-8") as f:
            return f.read()
    except FileNotFoundError:
        return ""


def _load_existing_research(account: str) -> str:
    """既存リサーチ結果を読み込む"""
    research_dir = os.path.join(PROJECT_ROOT, "accounts", account, "research")
    if not os.path.exists(research_dir):
        return ""

    files = sorted(
        [f for f in os.listdir(research_dir) if f.endswith(".json")],
        reverse=True,
    )
    summaries = []
    for fname in files[:3]:  # 直近3件
        try:
            with open(os.path.join(research_dir, fname), "r", encoding="utf-8") as f:
                data = json.load(f)
            themes = [item.get("theme", "") for item in data.get("items", [])]
            summaries.append(f"{fname}: {', '.join(themes)}")
        except Exception:
            continue
    return "\n".join(summaries)


def research(account: str, focus_theme: str = None) -> dict | None:
    """テーマツリーに基づいてネタを収集する

    Args:
        account: アカウント名
        focus_theme: 特定テーマに集中する場合（なしなら自動判定）

    Returns:
        {
            "items": [
                {"theme": "テーマ", "angle": "切り口", "hook": "1行目案", "source": "情報源"},
                ...
            ],
            "focus_reason": "このテーマに注力した理由",
        }
    """
    base = os.path.join(PROJECT_ROOT, "accounts", account)
    theme_tree = _read_file(os.path.join(base, "theme_tree.md"))
    target = _read_file(os.path.join(base, "target.md"))
    genre = _read_file(os.path.join(base, "genre.md"))
    domain = _read_file(os.path.join(base, "domain_knowledge.md"))

    # アナリストのフィードバックがあれば含める
    analysis_path = os.path.join(base, "analysis", "latest.json")
    analysis_feedback = ""
    if os.path.exists(analysis_path):
        try:
            with open(analysis_path, "r", encoding="utf-8") as f:
                analysis = json.load(f)
            if analysis.get("next_actions"):
                analysis_feedback = "\n【アナリストからの指示】\n"
                for action in analysis["next_actions"]:
                    analysis_feedback += f"- {action}\n"
            if analysis.get("hot_themes"):
                analysis_feedback += f"今熱いテーマ: {', '.join(analysis['hot_themes'])}\n"
            if analysis.get("tired_themes"):
                analysis_feedback += f"飽きられてきたテーマ: {', '.join(analysis['tired_themes'])}\n"
        except Exception:
            pass

    # 既存リサーチの要約（重複ネタを避ける）
    existing = _load_existing_research(account)
    existing_section = f"\n【過去のリサーチ済みテーマ（重複を避ける）】\n{existing}\n" if existing else ""

    focus_section = ""
    if focus_theme:
        focus_section = f"\n【重点テーマ（優先して調査する）】\n{focus_theme}\n"

    prompt = f"""あなたはSNSコンテンツのリサーチャーです。以下のテーマツリーとターゲット情報を元に、投稿ネタを5〜8個収集してください。

【テーマツリー】
{theme_tree}

【ターゲット】
{target}

【ジャンル情報】
{genre}

【ドメイン知識】
{domain}
{analysis_feedback}{existing_section}{focus_section}
---

ルール:
1. テーマツリーの中から「まだネタが少ない」ブランチを重点的に選ぶ
2. アナリストの指示があればそれを優先する
3. 各ネタには「1行目のフック案」を必ず付ける
4. 過去のリサーチ済みテーマと被らないようにする
5. ターゲットが「知りたい」と思う切り口にする

以下のJSON形式で出力してください。JSON以外は出力しないでください。

{{
  "items": [
    {{
      "theme": "テーマ（テーマツリーのどのブランチか）",
      "topic": "具体的なトピック",
      "angle": "切り口（どういう視点で書くか）",
      "hook": "1行目のフック案",
      "target_pain": "ターゲットのどの悩みに刺さるか",
      "platforms": ["このネタが合うプラットフォーム（x/threads/instagram）"]
    }}
  ],
  "focus_reason": "このテーマ選定の理由",
  "gaps_identified": ["テーマツリー内でまだ足りてないブランチ"]
}}"""

    result = _call_claude_cli(prompt, timeout=120)
    if not result:
        logger.error("Claude CLI returned no output for research")
        return None

    try:
        text = result.strip()
        if "```json" in text:
            text = text.split("```json")[1].split("```")[0]
        elif "```" in text:
            text = text.split("```")[1].split("```")[0]
        research_data = json.loads(text.strip())
    except (json.JSONDecodeError, IndexError) as e:
        logger.error(f"Failed to parse research JSON: {e}\nRaw: {result[:200]}")
        return None

    research_data["researched_at"] = datetime.now().isoformat()
    research_data["account"] = account

    # 保存
    research_dir = os.path.join(base, "research")
    os.makedirs(research_dir, exist_ok=True)

    # 最新結果（ライターが読む）
    latest_path = os.path.join(research_dir, "latest.json")
    with open(latest_path, "w", encoding="utf-8") as f:
        json.dump(research_data, f, ensure_ascii=False, indent=2)

    # 履歴
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    history_path = os.path.join(research_dir, f"research_{timestamp}.json")
    with open(history_path, "w", encoding="utf-8") as f:
        json.dump(research_data, f, ensure_ascii=False, indent=2)

    logger.info(f"Research complete: {len(research_data.get('items', []))} items → {latest_path}")
    return research_data


def get_latest_research(account: str) -> str:
    """ライターが参照する最新リサーチテキストを返す"""
    latest_path = os.path.join(PROJECT_ROOT, "accounts", account, "research", "latest.json")
    if not os.path.exists(latest_path):
        return ""
    try:
        with open(latest_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        lines = [f"## リサーチ結果（{data.get('researched_at', '不明')}）"]
        for item in data.get("items", []):
            lines.append(f"\n### {item.get('topic', '')}")
            lines.append(f"テーマ: {item.get('theme', '')}")
            lines.append(f"切り口: {item.get('angle', '')}")
            lines.append(f"フック案: {item.get('hook', '')}")
            lines.append(f"刺さる悩み: {item.get('target_pain', '')}")
            lines.append(f"プラットフォーム: {', '.join(item.get('platforms', []))}")
        return "\n".join(lines)
    except Exception:
        return ""
