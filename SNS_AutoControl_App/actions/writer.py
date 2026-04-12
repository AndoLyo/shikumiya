"""
ライターエージェント — 品質スコア+類似度チェック付き投稿生成
ナレッジファイルを読み込み、パターンローテーション＋品質採点で投稿を生成する
"""
import json
import logging
import os
import sqlite3
from datetime import datetime
from difflib import SequenceMatcher

from ai.claude_cli import _call_claude_cli

logger = logging.getLogger(__name__)

PROJECT_ROOT = os.path.dirname(os.path.dirname(__file__))


def _read_file(path: str) -> str:
    """ファイルを読み込む（存在しなければ空文字）"""
    try:
        with open(path, "r", encoding="utf-8") as f:
            return f.read()
    except FileNotFoundError:
        return ""


def _load_account_knowledge(account: str) -> dict:
    """アカウントのナレッジファイルを全部読む"""
    base = os.path.join(PROJECT_ROOT, "accounts", account)
    shared = os.path.join(PROJECT_ROOT, "accounts", "_shared")
    return {
        "profile": _read_file(os.path.join(base, "profile.md")),
        "target": _read_file(os.path.join(base, "target.md")),
        "genre": _read_file(os.path.join(base, "genre.md")),
        "ng_words": _read_file(os.path.join(base, "ng_words.md")),
        "tone_guide": _read_file(os.path.join(base, "tone_guide.md")),
        "theme_tree": _read_file(os.path.join(base, "theme_tree.md")),
        "domain_knowledge": _read_file(os.path.join(base, "domain_knowledge.md")),
        "posting_rules": _read_file(os.path.join(shared, "posting_rules.md")),
        "post_patterns": _read_file(os.path.join(shared, "post_patterns.md")),
        "quality_scoring": _read_file(os.path.join(shared, "quality_scoring.md")),
    }


def _get_recent_posts(db_path: str, platform: str, account: str, limit: int = 100) -> list[str]:
    """直近N件の投稿テキストを取得（類似度チェック用・アカウント別）"""
    try:
        with sqlite3.connect(db_path) as conn:
            rows = conn.execute(
                "SELECT text FROM posts WHERE platform = ? AND (account = ? OR account = '') ORDER BY created_at DESC LIMIT ?",
                (platform, account, limit),
            ).fetchall()
            return [row[0] for row in rows if row[0]]
    except Exception:
        return []


def _get_recent_patterns(db_path: str, platform: str, limit: int = 3) -> list[str]:
    """直近N件で使ったパターン名を取得"""
    try:
        drafts_dir = os.path.join(PROJECT_ROOT, "accounts", "_shared", "pattern_log.json")
        if os.path.exists(drafts_dir):
            with open(drafts_dir, "r", encoding="utf-8") as f:
                log = json.load(f)
            entries = [e for e in log if e.get("platform") == platform]
            entries.sort(key=lambda x: x.get("created_at", ""), reverse=True)
            return [e["pattern"] for e in entries[:limit]]
    except Exception:
        pass
    return []


def _save_pattern_log(platform: str, pattern: str):
    """使ったパターンを記録"""
    log_path = os.path.join(PROJECT_ROOT, "accounts", "_shared", "pattern_log.json")
    log = []
    if os.path.exists(log_path):
        try:
            with open(log_path, "r", encoding="utf-8") as f:
                log = json.load(f)
        except Exception:
            log = []
    log.append({
        "platform": platform,
        "pattern": pattern,
        "created_at": datetime.now().isoformat(),
    })
    # 最新200件だけ保持
    log = log[-200:]
    with open(log_path, "w", encoding="utf-8") as f:
        json.dump(log, f, ensure_ascii=False, indent=2)


def check_similarity(new_text: str, past_texts: list[str], threshold: float = 0.85) -> tuple[bool, float, str]:
    """類似度チェック

    Returns:
        (is_similar, max_score, most_similar_text)
    """
    max_score = 0.0
    most_similar = ""
    for past in past_texts:
        score = SequenceMatcher(None, new_text, past).ratio()
        if score > max_score:
            max_score = score
            most_similar = past[:50]
    return max_score >= threshold, max_score, most_similar


def generate_draft(account: str, platform: str, theme: str = None,
                   research_data: str = None, analysis_data: str = None,
                   db_path: str = None) -> dict | None:
    """投稿の下書きを1本生成する

    Args:
        account: アカウント名（shikumiya_ai / ando_lyo）
        platform: プラットフォーム（x / x_longform / x_thread / instagram / threads）
        theme: テーマ（指定なしならテーマツリーから自動選択）
        research_data: リサーチャーからのネタ（あれば）
        analysis_data: アナリストからのフィードバック（あれば）
        db_path: DBパス

    Returns:
        {
            "text": 投稿テキスト,
            "platform": プラットフォーム,
            "account": アカウント,
            "pattern": 使ったパターン名,
            "scores": {項目: 点数},
            "avg_score": 平均スコア,
            "similar": {"is_similar": bool, "score": float},
        }
    """
    knowledge = _load_account_knowledge(account)

    # 直近パターンを取得して避ける
    recent_patterns = _get_recent_patterns(db_path, platform) if db_path else []
    avoid_patterns = ", ".join(recent_patterns) if recent_patterns else "なし"

    # 分析フィードバックがあれば含める
    analysis_section = ""
    if analysis_data:
        analysis_section = f"\n【直近の分析結果（参考にすること）】\n{analysis_data}\n"

    research_section = ""
    if research_data:
        research_section = f"\n【リサーチネタ（これをベースに書くこと）】\n{research_data}\n"

    theme_section = ""
    if theme:
        theme_section = f"\n【今回のテーマ】\n{theme}\n"

    prompt = f"""あなたはSNS投稿のライターです。以下のナレッジに従って投稿を1本生成してください。

【アカウント情報】
{knowledge['profile']}

【ターゲット】
{knowledge['target']}

【ジャンル】
{knowledge['genre']}

【NGワード】
{knowledge['ng_words']}

【トーンガイド】
{knowledge['tone_guide']}

【プラットフォームルール】
{knowledge['posting_rules']}

【投稿パターン一覧】
{knowledge['post_patterns']}

【直近3件で使ったパターン（これは避けること）】
{avoid_patterns}
{theme_section}{research_section}{analysis_section}
【テーマツリー（テーマ指定がない場合ここから選ぶ）】
{knowledge['theme_tree']}

【プラットフォーム】{platform}

---

以下のJSON形式で出力してください。JSON以外は出力しないでください。

{{
  "text": "投稿テキスト本文",
  "pattern": "使ったパターン名（例: 体験報告型、質問型 等）",
  "theme": "このテーマ",
  "scores": {{
    "hook": 8,
    "usefulness": 7,
    "specificity": 8,
    "tempo": 7,
    "emotion": 8,
    "originality": 7,
    "cta": 8,
    "platform_fit": 9,
    "target_fit": 8,
    "anti_ai": 8
  }}
}}"""

    result = _call_claude_cli(prompt, timeout=120)
    if not result:
        logger.error("Claude CLI returned no output")
        return None

    # JSON解析
    try:
        # JSONブロックを抽出（```json ... ``` 対応）
        text = result.strip()
        if "```json" in text:
            text = text.split("```json")[1].split("```")[0]
        elif "```" in text:
            text = text.split("```")[1].split("```")[0]

        draft = json.loads(text.strip())
    except (json.JSONDecodeError, IndexError) as e:
        logger.error(f"Failed to parse Claude output as JSON: {e}\nRaw: {result[:200]}")
        return None

    # スコア計算
    scores = draft.get("scores", {})
    score_values = list(scores.values())
    avg_score = sum(score_values) / len(score_values) if score_values else 0

    # 類似度チェック
    past_texts = _get_recent_posts(db_path, platform, account) if db_path else []
    is_similar, sim_score, sim_text = check_similarity(draft.get("text", ""), past_texts)

    draft["account"] = account
    draft["platform"] = platform
    draft["avg_score"] = round(avg_score, 1)
    draft["similar"] = {
        "is_similar": is_similar,
        "score": round(sim_score, 3),
        "similar_to": sim_text,
    }
    draft["created_at"] = datetime.now().isoformat()

    return draft


def generate_batch(account: str, platform: str, batch_size: int = 5,
                   theme: str = None, research_data: str = None,
                   analysis_data: str = None, db_path: str = None,
                   max_retries: int = 2) -> list[dict]:
    """投稿を複数本バッチ生成し、品質フィルタを通す

    Returns:
        合格した投稿のリスト
    """
    accepted = []
    rejected = []

    for i in range(batch_size):
        logger.info(f"Generating draft {i+1}/{batch_size}...")
        retries = 0
        while retries <= max_retries:
            draft = generate_draft(
                account=account,
                platform=platform,
                theme=theme,
                research_data=research_data,
                analysis_data=analysis_data,
                db_path=db_path,
            )
            if draft is None:
                retries += 1
                continue

            # 品質チェック
            if draft["avg_score"] < 7.0:
                logger.info(f"Draft {i+1} rejected: score {draft['avg_score']}")
                retries += 1
                continue

            # 類似度チェック
            if draft["similar"]["is_similar"]:
                logger.info(f"Draft {i+1} rejected: similar ({draft['similar']['score']})")
                retries += 1
                continue

            # 合格
            accepted.append(draft)
            _save_pattern_log(platform, draft.get("pattern", "unknown"))
            logger.info(f"Draft {i+1} accepted: score {draft['avg_score']}, pattern={draft.get('pattern')}")
            break
        else:
            rejected.append({"index": i + 1, "reason": "max_retries_exceeded"})
            logger.warning(f"Draft {i+1} exhausted retries")

    # 下書きファイルに保存
    drafts_dir = os.path.join(PROJECT_ROOT, "accounts", account, "drafts")
    os.makedirs(drafts_dir, exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_path = os.path.join(drafts_dir, f"batch_{platform}_{timestamp}.json")
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump({
            "accepted": accepted,
            "rejected": rejected,
            "generated_at": datetime.now().isoformat(),
        }, f, ensure_ascii=False, indent=2)

    logger.info(f"Batch complete: {len(accepted)} accepted, {len(rejected)} rejected → {output_path}")
    return accepted
