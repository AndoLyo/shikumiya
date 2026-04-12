"""
コメント返信チェック — 定期実行用スクリプト
Windowsタスクスケジューラから呼び出す想定

使い方:
  python run_reply_check.py                  # 全プラットフォーム（承認制）
  python run_reply_check.py --platform ig    # Instagramのみ
  python run_reply_check.py --platform th    # Threadsのみ
  python run_reply_check.py --auto-approve   # 承認なし即投稿
"""
import argparse
import logging
import sys

from config import (
    INSTAGRAM_ACCESS_TOKEN, INSTAGRAM_BUSINESS_ACCOUNT_ID,
    THREADS_ACCESS_TOKEN, THREADS_USER_ID,
    REPLY_SETTINGS,
)
from database import Database
from actions.auto_reply import AutoReply

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler("reply_check.log", encoding="utf-8"),
    ],
)
logger = logging.getLogger(__name__)


def run_instagram(db: Database, auto_approve: bool) -> list[dict]:
    """Instagramのコメントチェック"""
    if not INSTAGRAM_ACCESS_TOKEN or not INSTAGRAM_BUSINESS_ACCOUNT_ID:
        logger.warning("Instagram credentials not set, skipping")
        return []

    from platforms.instagram import InstagramPlatform
    platform = InstagramPlatform(INSTAGRAM_ACCESS_TOKEN, INSTAGRAM_BUSINESS_ACCOUNT_ID)
    replier = AutoReply(platform, db, REPLY_SETTINGS)
    results = replier.check_and_reply(auto_approve=auto_approve)
    logger.info(f"Instagram: {len(results)} comments processed")
    return results


def run_threads(db: Database, auto_approve: bool) -> list[dict]:
    """Threadsのコメントチェック"""
    if not THREADS_ACCESS_TOKEN or not THREADS_USER_ID:
        logger.warning("Threads credentials not set, skipping")
        return []

    from platforms.threads import ThreadsPlatform
    platform = ThreadsPlatform(THREADS_ACCESS_TOKEN, THREADS_USER_ID)
    replier = AutoReply(platform, db, REPLY_SETTINGS)
    results = replier.check_and_reply(auto_approve=auto_approve)
    logger.info(f"Threads: {len(results)} comments processed")
    return results


def main():
    parser = argparse.ArgumentParser(description="コメント返信チェック")
    parser.add_argument("--platform", choices=["ig", "th", "all"], default="all",
                        help="対象プラットフォーム (ig=Instagram, th=Threads, all=全部)")
    parser.add_argument("--auto-approve", action="store_true",
                        help="承認なしで即投稿")
    args = parser.parse_args()

    auto_approve = args.auto_approve or REPLY_SETTINGS.get("auto_approve", False)
    db = Database()
    all_results = []

    logger.info(f"=== コメント返信チェック開始 (platform={args.platform}, auto_approve={auto_approve}) ===")

    if args.platform in ("ig", "all"):
        all_results.extend(run_instagram(db, auto_approve))

    if args.platform in ("th", "all"):
        all_results.extend(run_threads(db, auto_approve))

    # 集計
    pending = sum(1 for r in all_results if r["status"] == "pending_approval")
    posted = sum(1 for r in all_results if r["status"] == "posted")
    failed = sum(1 for r in all_results if r["status"] == "failed")

    logger.info(f"=== 完了: 承認待ち={pending}, 投稿済み={posted}, 失敗={failed} ===")

    if pending > 0:
        logger.info(f"承認待ちの返信が{pending}件あります。https://localhost:8081 で確認してください。")


if __name__ == "__main__":
    main()
