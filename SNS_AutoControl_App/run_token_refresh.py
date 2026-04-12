"""
SNS AutoControl App - トークン自動リフレッシュ
Instagram / Threads の長期トークン（60日）を更新し、.envを書き換える。

Usage:
    python run_token_refresh.py            # 全トークンをリフレッシュ
    python run_token_refresh.py --dry-run  # 状態確認のみ（更新しない）

Windows Task Scheduler で月1回実行を推奨。
"""

import argparse
import os
import re
import sys
from datetime import datetime, timedelta

import requests

# ─── 定数 ──────────────────────────────────────────────
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
ENV_PATH = os.path.join(SCRIPT_DIR, ".env")

# リフレッシュ対象の定義: (表示名, .envキー名, プラットフォーム)
TOKEN_DEFS = [
    ("ando_lyo / Instagram",   "INSTAGRAM_ACCESS_TOKEN",           "instagram"),
    ("ando_lyo / Threads",     "THREADS_ACCESS_TOKEN",             "threads"),
    ("shikumiya_ai / Instagram", "INSTAGRAM_SHIKUMIYA_ACCESS_TOKEN", "instagram"),
    ("shikumiya_ai / Threads",   "THREADS_SHIKUMIYA_ACCESS_TOKEN",   "threads"),
]

REFRESH_URLS = {
    "instagram": "https://graph.instagram.com/refresh_access_token",
    "threads":   "https://graph.threads.net/refresh_access_token",
}

GRANT_TYPES = {
    "instagram": "ig_refresh_token",
    "threads":   "th_refresh_token",
}

REQUEST_TIMEOUT = 30  # seconds


# ─── ヘルパー ──────────────────────────────────────────
def log(msg: str) -> None:
    ts = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"[{ts}] {msg}")


def read_env() -> str:
    """Read .env file contents."""
    with open(ENV_PATH, "r", encoding="utf-8") as f:
        return f.read()


def get_env_value(env_text: str, key: str) -> str:
    """Extract a value for a given key from .env text."""
    pattern = rf"^{re.escape(key)}=(.+)$"
    match = re.search(pattern, env_text, re.MULTILINE)
    return match.group(1).strip() if match else ""


def set_env_value(env_text: str, key: str, new_value: str) -> str:
    """Replace a key's value in .env text."""
    pattern = rf"^({re.escape(key)}=)(.+)$"
    return re.sub(pattern, rf"\g<1>{new_value}", env_text, flags=re.MULTILINE)


def write_env(env_text: str) -> None:
    """Write .env file."""
    with open(ENV_PATH, "w", encoding="utf-8") as f:
        f.write(env_text)


def check_token(platform: str, token: str) -> dict:
    """
    Check token validity by calling the debug endpoint.
    Returns a dict with status info.
    """
    if not token:
        return {"valid": False, "error": "Token is empty"}

    # Use the refresh endpoint itself — a successful call means the token is valid.
    # For dry-run, we just try a lightweight me request.
    if platform == "instagram":
        url = "https://graph.instagram.com/me"
        params = {"fields": "id,username", "access_token": token}
    else:
        url = "https://graph.threads.net/me"
        params = {"fields": "id,username", "access_token": token}

    try:
        resp = requests.get(url, params=params, timeout=REQUEST_TIMEOUT)
        data = resp.json()
        if "error" in data:
            return {"valid": False, "error": data["error"].get("message", str(data["error"]))}
        return {"valid": True, "user": data.get("username") or data.get("id", "?")}
    except requests.RequestException as e:
        return {"valid": False, "error": f"Network error: {e}"}


def refresh_token(platform: str, token: str) -> dict:
    """
    Call the refresh endpoint.
    Returns {"access_token": ..., "expires_in": ...} on success,
    or {"error": ...} on failure.
    """
    url = REFRESH_URLS[platform]
    params = {
        "grant_type": GRANT_TYPES[platform],
        "access_token": token,
    }

    try:
        resp = requests.get(url, params=params, timeout=REQUEST_TIMEOUT)
        data = resp.json()
        if "error" in data:
            err_msg = data["error"].get("message", str(data["error"]))
            return {"error": err_msg}
        if "access_token" not in data:
            return {"error": f"Unexpected response: {data}"}
        return data
    except requests.RequestException as e:
        return {"error": f"Network error: {e}"}


# ─── メイン処理 ─────────────────────────────────────────
def run_dry_run() -> int:
    """Check all tokens without refreshing. Returns 0 if all OK, 1 otherwise."""
    log("=== DRY RUN: トークン状態チェック ===")
    env_text = read_env()
    all_ok = True

    for display_name, env_key, platform in TOKEN_DEFS:
        token = get_env_value(env_text, env_key)
        masked = token[:12] + "..." if len(token) > 12 else "(empty)"
        result = check_token(platform, token)

        if result["valid"]:
            log(f"  OK   {display_name} [{masked}] user={result['user']}")
        else:
            log(f"  NG   {display_name} [{masked}] error={result['error']}")
            all_ok = False

    log("=== 結果: " + ("全トークン有効" if all_ok else "無効なトークンあり") + " ===")
    return 0 if all_ok else 1


def run_refresh() -> int:
    """Refresh all tokens and update .env. Returns 0 if all OK, 1 otherwise."""
    log("=== トークンリフレッシュ開始 ===")
    env_text = read_env()
    updated = False
    all_ok = True

    for display_name, env_key, platform in TOKEN_DEFS:
        token = get_env_value(env_text, env_key)
        if not token:
            log(f"  SKIP {display_name} — トークンが空です")
            all_ok = False
            continue

        result = refresh_token(platform, token)

        if "error" in result:
            log(f"  FAIL {display_name} — {result['error']}")
            all_ok = False
            continue

        new_token = result["access_token"]
        expires_in = result.get("expires_in", 5184000)  # default 60 days
        expiry_date = datetime.now() + timedelta(seconds=expires_in)
        expiry_str = expiry_date.strftime("%Y-%m-%d")

        env_text = set_env_value(env_text, env_key, new_token)
        updated = True

        masked_new = new_token[:12] + "..."
        log(f"  OK   {display_name} — 更新完了 [{masked_new}] 有効期限: {expiry_str} ({expires_in // 86400}日)")

    if updated:
        write_env(env_text)
        log(".env ファイルを更新しました")
    else:
        log(".env ファイルの変更はありません")

    log("=== リフレッシュ完了: " + ("全成功" if all_ok else "一部失敗あり") + " ===")
    return 0 if all_ok else 1


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Instagram / Threads 長期トークンのリフレッシュ"
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="トークンの状態確認のみ（更新しない）",
    )
    args = parser.parse_args()

    if not os.path.exists(ENV_PATH):
        log(f"ERROR: .env ファイルが見つかりません: {ENV_PATH}")
        return 1

    if args.dry_run:
        return run_dry_run()
    else:
        return run_refresh()


if __name__ == "__main__":
    sys.exit(main())
