"""
フェッチャー実行スクリプト — 投稿メトリクスを自動取得
Usage:
    python run_fetcher.py --account shikumiya_ai
    python run_fetcher.py --account ando_lyo --limit 20
"""
import argparse
import logging
import sys

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.FileHandler("fetcher.log", encoding="utf-8"),
        logging.StreamHandler(),
    ],
)
logger = logging.getLogger(__name__)


def main():
    parser = argparse.ArgumentParser(description="投稿メトリクス自動取得")
    parser.add_argument("--account", default="shikumiya_ai", help="アカウント名")
    parser.add_argument("--limit", type=int, default=10, help="取得する投稿数")
    args = parser.parse_args()

    from config import (
        DB_PATH,
        INSTAGRAM_ACCESS_TOKEN,
        INSTAGRAM_BUSINESS_ACCOUNT_ID,
        THREADS_ACCESS_TOKEN,
        THREADS_USER_ID,
    )
    from actions.fetcher import fetch_all_recent

    ig_platform = None
    th_platform = None

    if INSTAGRAM_ACCESS_TOKEN and INSTAGRAM_BUSINESS_ACCOUNT_ID:
        from platforms.instagram import InstagramPlatform
        ig_platform = InstagramPlatform(INSTAGRAM_ACCESS_TOKEN, INSTAGRAM_BUSINESS_ACCOUNT_ID)
        logger.info("Instagram platform initialized")

    if THREADS_ACCESS_TOKEN and THREADS_USER_ID:
        from platforms.threads import ThreadsPlatform
        th_platform = ThreadsPlatform(THREADS_ACCESS_TOKEN, THREADS_USER_ID)
        logger.info("Threads platform initialized")

    if not ig_platform and not th_platform:
        logger.error("No platform configured. Check .env")
        sys.exit(1)

    results = fetch_all_recent(
        db_path=DB_PATH,
        ig_platform=ig_platform,
        th_platform=th_platform,
        account=args.account,
        limit=args.limit,
    )
    logger.info(f"Done: {results}")


if __name__ == "__main__":
    main()
