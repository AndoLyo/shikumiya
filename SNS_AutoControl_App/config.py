"""
SNS AutoControl App - 設定管理
環境変数の読み込みと設定値の一元管理
"""
import os
from dotenv import load_dotenv

load_dotenv()


# ╔══════════════════════════════════════════════╗
# ║          Meta API（共通）                    ║
# ╚══════════════════════════════════════════════╝
INSTAGRAM_APP_ID = os.getenv("INSTAGRAM_APP_ID", "")
INSTAGRAM_APP_SECRET = os.getenv("INSTAGRAM_APP_SECRET", "")
INSTAGRAM_REDIRECT_URI = os.getenv("INSTAGRAM_REDIRECT_URI", "https://localhost:8081/auth/instagram/callback")
THREADS_APP_ID = os.getenv("THREADS_APP_ID", "")
THREADS_APP_SECRET = os.getenv("THREADS_APP_SECRET", "")
THREADS_REDIRECT_URI = os.getenv("THREADS_REDIRECT_URI", "https://localhost:8081/")

# ╔══════════════════════════════════════════════╗
# ║          アカウント別設定                      ║
# ╚══════════════════════════════════════════════╝
ACCOUNTS = {
    "ando_lyo": {
        "ig_access_token": os.getenv("INSTAGRAM_ACCESS_TOKEN", ""),
        "ig_account_id": os.getenv("INSTAGRAM_BUSINESS_ACCOUNT_ID", ""),
        "threads_access_token": os.getenv("THREADS_ACCESS_TOKEN", ""),
        "threads_user_id": os.getenv("THREADS_USER_ID", ""),
        "x_username": os.getenv("X_ANDO_LYO_USERNAME", "ando_lyo"),
        "x_password": os.getenv("X_ANDO_LYO_PASSWORD", ""),
    },
    "shikumiya_ai": {
        "ig_access_token": os.getenv("INSTAGRAM_SHIKUMIYA_ACCESS_TOKEN", ""),
        "ig_account_id": os.getenv("INSTAGRAM_SHIKUMIYA_BUSINESS_ACCOUNT_ID", ""),
        "threads_access_token": os.getenv("THREADS_SHIKUMIYA_ACCESS_TOKEN", ""),
        "threads_user_id": os.getenv("THREADS_SHIKUMIYA_USER_ID", ""),
        "x_username": os.getenv("X_SHIKUMIYA_USERNAME", "shikumiya_ai"),
        "x_password": os.getenv("X_SHIKUMIYA_PASSWORD", ""),
    },
}

# デフォルトアカウント
ACTIVE_ACCOUNT = os.getenv("ACTIVE_ACCOUNT", "shikumiya_ai")


def get_account(account: str = None) -> dict:
    """アカウントの全認証情報を返す"""
    account = account or ACTIVE_ACCOUNT
    return ACCOUNTS.get(account, ACCOUNTS["shikumiya_ai"])


def get_ig_account(account: str = None) -> tuple[str, str]:
    """(access_token, account_id)を返す"""
    acc = get_account(account)
    return acc["ig_access_token"], acc["ig_account_id"]


def get_threads_account(account: str = None) -> tuple[str, str]:
    """(access_token, user_id)を返す"""
    acc = get_account(account)
    return acc["threads_access_token"], acc["threads_user_id"]


def get_x_account(account: str = None) -> dict:
    """Xアカウントの認証情報を返す"""
    acc = get_account(account)
    return {"username": acc["x_username"], "password": acc["x_password"]}


# 後方互換: 既存コードが直接参照してる変数
INSTAGRAM_ACCESS_TOKEN = ACCOUNTS["ando_lyo"]["ig_access_token"]
INSTAGRAM_BUSINESS_ACCOUNT_ID = ACCOUNTS["ando_lyo"]["ig_account_id"]
THREADS_ACCESS_TOKEN = ACCOUNTS["ando_lyo"]["threads_access_token"]
THREADS_USER_ID = ACCOUNTS["ando_lyo"]["threads_user_id"]
X_USERNAME = os.getenv("X_USERNAME", "")
X_PASSWORD = os.getenv("X_PASSWORD", "")
X_COOKIES_PATH = os.path.join(os.path.dirname(__file__), "x_cookies.json")

# X アカウント別設定（後方互換）
X_ACCOUNTS = {
    "shikumiya_ai": get_x_account("shikumiya_ai"),
    "ando_lyo": get_x_account("ando_lyo"),
}

# ╔══════════════════════════════════════════════╗
# ║          その他                              ║
# ╚══════════════════════════════════════════════╝
CLAUDE_CLI_PATH = os.getenv("CLAUDE_CLI_PATH", "claude")
NOTE_BOT_PATH = os.getenv("NOTE_BOT_PATH", r"C:\Users\ryoya\OneDrive1\Discord\BOT\note")
NOTE_EMAIL = os.getenv("NOTE_EMAIL", "")
NOTE_PASSWORD = os.getenv("NOTE_PASSWORD", "")
NOTE_USERNAME = os.getenv("NOTE_USERNAME", "")
PORTFOLIO_URL = "https://lyo-vision-site.vercel.app"
IMAGES_TO_POST_DIR = os.path.join(os.path.dirname(__file__), "images_to_post")
POSTED_IMAGES_DIR = os.path.join(os.path.dirname(__file__), "posted_images")
FLASK_HOST = os.getenv("FLASK_HOST", "127.0.0.1")
FLASK_PORT = int(os.getenv("FLASK_PORT", "8081"))
SECRET_KEY = os.getenv("SECRET_KEY", "sns-autocontrol-dev-key")
WEBHOOK_VERIFY_TOKEN = os.getenv("WEBHOOK_VERIFY_TOKEN", "sns-autocontrol-webhook-verify")
DB_PATH = os.path.join(os.path.dirname(__file__), "sns_history.db")
ACCOUNTS_DIR = os.path.join(os.path.dirname(__file__), "accounts")


def get_account_dir(account: str = None) -> str:
    """アカウントのナレッジフォルダパスを返す"""
    account = account or ACTIVE_ACCOUNT
    return os.path.join(ACCOUNTS_DIR, account)


def get_account_file(filename: str, account: str = None) -> str:
    """アカウントのナレッジファイルパスを返す"""
    return os.path.join(get_account_dir(account), filename)


# ╔══════════════════════════════════════════════╗
# ║          コメント返信設定                      ║
# ╚══════════════════════════════════════════════╝
REPLY_SETTINGS = {
    "enabled": True,
    "max_length_sentences": 3,
    "min_length_sentences": 2,
    "tone": "丁寧な敬語で親しみやすく、楽観的な性格のクリエイター",
    "persona": "Lyo（AIアート×自動化クリエイター）",
    "auto_like": True,
    "auto_approve": False,
}
