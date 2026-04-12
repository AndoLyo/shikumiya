"""
引用リポスト監視スクリプト
監視アカウントの直近投稿をチェック → ポートフォリオ関連キーワードでフィルタ →
Claude CLIで引用文生成 → 引用リポスト

使い方:
  # ando_lyoアカウントで監視＆引用RT
  python run_quote_watch.py --account ando_lyo

  # ドライラン（投稿しない、候補の確認のみ）
  python run_quote_watch.py --account ando_lyo --dry-run

  # 最大引用数を指定
  python run_quote_watch.py --account ando_lyo --max-quotes 3

  # 特定アカウントだけ監視
  python run_quote_watch.py --account ando_lyo --watch konmari_tweet kawai_design
"""
import argparse
import logging
import re
import sys
from pathlib import Path

ROOT = Path(__file__).parent
sys.path.insert(0, str(ROOT))

from config import get_x_account, get_account_dir, X_COOKIES_PATH, ACCOUNTS_DIR
from database import Database
from platforms.x_twitter import XTwitterPlatform
from ai.claude_cli import generate_reply

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler("quote_watch.log", encoding="utf-8"),
    ],
)
logger = logging.getLogger(__name__)


# === 設定ファイル読み込み ===

def load_watch_targets(watch_filter: list[str] = None) -> list[str]:
    """quote_watch_targets.md から監視アカウントリストを取得"""
    targets_path = Path(ACCOUNTS_DIR) / "_shared" / "quote_watch_targets.md"
    if not targets_path.exists():
        logger.error(f"監視設定ファイルが見つかりません: {targets_path}")
        return []

    text = targets_path.read_text(encoding="utf-8")
    usernames = []
    in_table = False
    for line in text.split("\n"):
        if "| username |" in line:
            in_table = True
            continue
        if in_table and line.startswith("|"):
            if "---" in line:
                continue
            cols = [c.strip() for c in line.split("|")]
            if len(cols) >= 3 and cols[1]:
                username = cols[1].strip()
                if username:
                    usernames.append(username)
        elif in_table and not line.startswith("|"):
            in_table = False

    if watch_filter:
        usernames = [u for u in usernames if u in watch_filter]

    return usernames


def load_keywords() -> dict[str, list[str]]:
    """quote_watch_targets.md からTier別キーワードを取得"""
    targets_path = Path(ACCOUNTS_DIR) / "_shared" / "quote_watch_targets.md"
    if not targets_path.exists():
        return {}

    text = targets_path.read_text(encoding="utf-8")
    tiers = {}
    current_tier = None
    for line in text.split("\n"):
        m = re.match(r"^### (Tier \d+)", line)
        if m:
            current_tier = m.group(1)
            tiers[current_tier] = []
            continue
        if current_tier and line.startswith("- "):
            kw = line[2:].strip()
            if kw:
                tiers[current_tier].append(kw)

    return tiers


def matches_keywords(post_text: str, tiers: dict[str, list[str]]) -> tuple[bool, str, int]:
    """投稿テキストがキーワードにマッチするかチェック

    Returns:
        (matched, matched_keyword, tier_number)
    """
    for tier_name, keywords in tiers.items():
        tier_num = int(re.search(r"\d+", tier_name).group())
        for kw in keywords:
            if kw in post_text:
                return True, kw, tier_num
    return False, "", 0


# === メイン処理 ===

def run_quote_watch(account: str, max_quotes: int = 3, dry_run: bool = False,
                    watch_filter: list[str] = None):
    """監視アカウントの投稿をチェックしてポートフォリオ関連を引用RT"""

    # 監視アカウント読み込み
    watch_accounts = load_watch_targets(watch_filter)
    if not watch_accounts:
        logger.error("監視アカウントが0件")
        return

    logger.info(f"[監視開始] アカウント: {account}, 監視対象: {watch_accounts}")

    # キーワード読み込み
    tiers = load_keywords()
    all_kw_count = sum(len(v) for v in tiers.values())
    logger.info(f"[キーワード] {len(tiers)}Tier, 合計{all_kw_count}キーワード")

    # X接続
    x_creds = get_x_account(account)
    cookies_path = str(ROOT / f"x_cookies_{account}.json") if account != "shikumiya_ai" else X_COOKIES_PATH
    x = XTwitterPlatform(
        username=x_creds["username"],
        password=x_creds["password"],
        cookies_path=cookies_path,
    )
    db = Database()

    # ペルソナ読み込み
    account_dir = get_account_dir(account)
    tone_path = Path(account_dir) / "tone_guide.md"
    persona = None
    if tone_path.exists():
        persona = tone_path.read_text(encoding="utf-8")[:500]

    # 監視アカウントごとに直近投稿を取得
    candidates = []
    for target_user in watch_accounts:
        logger.info(f"[取得中] @{target_user} の直近投稿...")
        try:
            posts = x.get_user_posts(target_user, limit=5)
            for post in posts:
                post_text = post.get("text", "")
                post_id = post.get("id", "")

                # 既に引用済みならスキップ
                if db.has_engaged_post(post_id, "quote_rt", account):
                    continue

                # キーワードマッチ
                matched, kw, tier = matches_keywords(post_text, tiers)
                if matched:
                    post["_matched_kw"] = kw
                    post["_tier"] = tier
                    candidates.append(post)
                    logger.info(
                        f"  [HIT] Tier{tier} '{kw}' | @{target_user}: "
                        f"{post_text[:60]}..."
                    )
        except Exception as e:
            logger.error(f"  [エラー] @{target_user}: {e}")
            continue

    if not candidates:
        logger.info("[結果] マッチする投稿なし。監視完了。")
        x.close()
        return

    # Tier番号でソート（小さいほど優先）
    candidates.sort(key=lambda p: p["_tier"])
    logger.info(f"[候補] {len(candidates)}件見つかった")

    # 引用RT実行
    quoted = 0
    for post in candidates:
        if quoted >= max_quotes:
            break

        post_url = post.get("url", "")
        post_text = post.get("text", "")
        author = post.get("author", "")
        post_id = post.get("id", "")
        tier = post["_tier"]
        kw = post["_matched_kw"]

        logger.info(f"\n[引用候補] Tier{tier} '{kw}' | @{author}")
        logger.info(f"  元投稿: {post_text[:100]}...")

        # Claude CLIで引用文生成
        quote_text = generate_reply(
            comment_text=post_text,
            author=author,
            persona=persona,
            tone=(
                "引用リポストとして。ルール:\n"
                "- 共感から入り、自分の実体験を1つ入れる\n"
                "- 自分視点（体験・失敗談）と相手視点（読み手が得るもの）を織り交ぜる\n"
                "- 最後の1行でLyoの専門性（AI自動化・Claude Code・ポートフォリオサイト構築）が残るように締める\n"
                "- 否定・マウントは絶対NG、共感ベース\n"
                "- 「ポートフォリオサイト」「クリエイターが届ける仕組み」に自然に繋がる一言を入れる\n"
                "- 140字以内\n"
                "- 返信テキストのみ出力（説明・補足は不要）"
            ),
        )
        if not quote_text:
            logger.warning(f"  [スキップ] 引用文生成失敗")
            continue

        logger.info(f"  [引用文] {quote_text}")

        if dry_run:
            logger.info(f"  [ドライラン] 投稿スキップ")
            quoted += 1
            continue

        # 引用リポスト実行
        try:
            success = x.quote_repost(post_url, quote_text)
            if success:
                db.save_engagement_action(
                    "x", "quote_rt", author, post_id, post_url,
                    post_text[:200], quote_text, account=account,
                    quality_score=100 - (tier * 10),
                    quality_reasons=f"quote_watch:Tier{tier}:{kw}",
                )
                quoted += 1
                logger.info(f"  [投稿完了] {quoted}/{max_quotes}")
            else:
                logger.error(f"  [投稿失敗] {post_url}")
        except Exception as e:
            logger.error(f"  [エラー] {e}")

    logger.info(f"\n[完了] {quoted}/{max_quotes}件引用RT")
    x.close()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="引用リポスト監視")
    parser.add_argument("--account", default="ando_lyo", help="投稿アカウント")
    parser.add_argument("--max-quotes", type=int, default=3, help="最大引用数")
    parser.add_argument("--dry-run", action="store_true", help="ドライラン（投稿しない）")
    parser.add_argument("--watch", nargs="*", help="監視対象アカウント（指定なしで全部）")
    args = parser.parse_args()

    run_quote_watch(
        account=args.account,
        max_quotes=args.max_quotes,
        dry_run=args.dry_run,
        watch_filter=args.watch,
    )
