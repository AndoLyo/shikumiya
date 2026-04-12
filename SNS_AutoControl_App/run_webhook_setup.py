"""
Webhook Setup Script
FlaskをHTTPで起動 + ngrokトンネルで公開URLを取得する。

使い方:
  python run_webhook_setup.py

前提:
  - .env に WEBHOOK_VERIFY_TOKEN, NGROK_AUTH_TOKEN が設定済み
  - メインのapp.py(HTTPS:8081)とは別にHTTP:8082でWebhook専用サーバーを起動
"""
import os
import sys
import time
import signal
import threading

WEBHOOK_PORT = 8082


def ensure_pyngrok():
    """pyngrokがなければインストールする"""
    try:
        import pyngrok  # noqa: F401
        return True
    except ImportError:
        print("[setup] pyngrok がインストールされていません。インストールします...")
        import subprocess
        result = subprocess.run(
            [sys.executable, "-m", "pip", "install", "pyngrok"],
            capture_output=True, text=True,
        )
        if result.returncode != 0:
            print(f"[error] pip install 失敗:\n{result.stderr}")
            return False
        print("[setup] pyngrok インストール完了")
        return True


def start_flask_http():
    """Webhook専用のFlaskサーバーをHTTPで起動（別スレッド）"""
    sys.path.insert(0, os.path.dirname(__file__))
    from app import app
    # HTTPで起動（ngrokがHTTPSを担当するのでここはHTTPでOK）
    app.run(host="0.0.0.0", port=WEBHOOK_PORT, debug=False, use_reloader=False)


def main():
    if not ensure_pyngrok():
        sys.exit(1)

    from dotenv import load_dotenv
    load_dotenv()

    from pyngrok import ngrok, conf

    # authtoken設定
    authtoken = os.getenv("NGROK_AUTH_TOKEN")
    if authtoken:
        ngrok.set_auth_token(authtoken)

    # Flask HTTPサーバーをバックグラウンドで起動
    print(f"[flask] Webhook専用HTTPサーバーを port {WEBHOOK_PORT} で起動中...")
    flask_thread = threading.Thread(target=start_flask_http, daemon=True)
    flask_thread.start()
    time.sleep(3)  # Flask起動待ち

    print(f"[ngrok] localhost:{WEBHOOK_PORT} へのトンネルを起動中...")

    try:
        tunnel = ngrok.connect(WEBHOOK_PORT, "http", bind_tls=True)
        public_url = tunnel.public_url

        webhook_verify_token = os.getenv("WEBHOOK_VERIFY_TOKEN", "sns-autocontrol-webhook-verify")

        print("\n" + "=" * 60)
        print("  Webhook セットアップ完了!")
        print("=" * 60)
        print(f"\n  公開URL: {public_url}")
        print(f"  Webhook URL: {public_url}/webhook")
        print()
        print("  === Meta Dashboard 設定 ===")
        print(f"  コールバックURL: {public_url}/webhook")
        print(f"  トークンを認証:  {webhook_verify_token}")
        print()
        print("  Ctrl+C で終了")
        print("=" * 60)

        def shutdown(sig, frame):
            print("\n[shutdown] 終了中...")
            ngrok.disconnect(tunnel.public_url)
            ngrok.kill()
            sys.exit(0)

        signal.signal(signal.SIGINT, shutdown)
        signal.signal(signal.SIGTERM, shutdown)

        while True:
            time.sleep(1)

    except Exception as e:
        print(f"\n[error] 起動失敗: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
