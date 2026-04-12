"""
リサーチャー実行スクリプト — テーマツリーに基づくネタ収集
Usage:
    python run_research.py --account shikumiya_ai
    python run_research.py --account ando_lyo --focus "Claude Codeの使い方"
"""
import argparse
import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.FileHandler("research.log", encoding="utf-8"),
        logging.StreamHandler(),
    ],
)
logger = logging.getLogger(__name__)


def main():
    parser = argparse.ArgumentParser(description="テーマツリーに基づくネタ収集")
    parser.add_argument("--account", default="shikumiya_ai", help="アカウント名")
    parser.add_argument("--focus", default=None, help="重点テーマ（指定なしなら自動判定）")
    args = parser.parse_args()

    from actions.researcher import research

    result = research(account=args.account, focus_theme=args.focus)

    if result:
        items = result.get("items", [])
        print(f"\n=== リサーチ結果: {len(items)}件 ===")
        print(f"選定理由: {result.get('focus_reason', '')}")
        for i, item in enumerate(items, 1):
            print(f"\n--- {i}. {item.get('topic', '')} ---")
            print(f"  テーマ: {item.get('theme', '')}")
            print(f"  切り口: {item.get('angle', '')}")
            print(f"  フック: {item.get('hook', '')}")
            print(f"  刺さる悩み: {item.get('target_pain', '')}")
            print(f"  プラットフォーム: {', '.join(item.get('platforms', []))}")
        gaps = result.get("gaps_identified", [])
        if gaps:
            print(f"\n足りてないテーマ: {', '.join(gaps)}")
    else:
        print("リサーチに失敗しました。ログを確認してください。")


if __name__ == "__main__":
    main()
