"""
アナリスト実行スクリプト — 投稿パフォーマンス分析
Usage:
    python run_analyst.py --account shikumiya_ai
    python run_analyst.py --account ando_lyo --days 14
"""
import argparse
import json
import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.FileHandler("analyst.log", encoding="utf-8"),
        logging.StreamHandler(),
    ],
)
logger = logging.getLogger(__name__)


def main():
    parser = argparse.ArgumentParser(description="投稿パフォーマンス分析")
    parser.add_argument("--account", default="shikumiya_ai", help="アカウント名")
    parser.add_argument("--days", type=int, default=7, help="分析対象日数")
    args = parser.parse_args()

    from config import DB_PATH
    from actions.analyst import analyze

    report = analyze(db_path=DB_PATH, account=args.account, days=args.days)

    if report:
        print("\n=== 分析レポート ===")
        print(f"概要: {report.get('summary', '')}")
        print(f"伸びてるパターン: {report.get('top_patterns', [])}")
        print(f"伸びてないパターン: {report.get('weak_patterns', [])}")
        print(f"熱いテーマ: {report.get('hot_themes', [])}")
        print(f"飽きられてきたテーマ: {report.get('tired_themes', [])}")
        print(f"\n改善提案:")
        for r in report.get("recommendations", []):
            print(f"  - {r}")
        print(f"\n次のアクション:")
        for a in report.get("next_actions", []):
            print(f"  - {a}")
    else:
        print("分析データが不足しています。先にrun_fetcher.pyを実行してください。")


if __name__ == "__main__":
    main()
