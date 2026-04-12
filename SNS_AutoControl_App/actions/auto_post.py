"""
自動投稿モジュール
フォルダ監視で画像検出 → Claude CLIでテキスト生成 → 各プラットフォームに投稿
"""
import logging
import os
import threading
import time
from pathlib import Path
from platforms.base import PlatformBase, Post
from ai.claude_cli import generate_post_text

logger = logging.getLogger(__name__)


def serve_image_via_ngrok(image_path: str, timeout: int = 60) -> str | None:
    """ローカル画像をngrokで一時公開してURLを返す

    投稿完了後にサーバーとトンネルは自動で閉じる。
    画像がネットに残らない。

    Args:
        image_path: ローカル画像ファイルパス
        timeout: サーバーの自動停止までの秒数

    Returns:
        公開URL (例: https://xxxx.ngrok-free.app/image.png) or None
    """
    from http.server import HTTPServer, SimpleHTTPRequestHandler
    import functools

    image_path = os.path.abspath(image_path)
    if not os.path.exists(image_path):
        logger.error(f"[ngrok] 画像が見つかりません: {image_path}")
        return None

    image_dir = os.path.dirname(image_path)
    image_name = os.path.basename(image_path)

    # 簡易HTTPサーバーを起動
    handler = functools.partial(SimpleHTTPRequestHandler, directory=image_dir)
    server = HTTPServer(("127.0.0.1", 0), handler)
    port = server.server_address[1]

    server_thread = threading.Thread(target=server.serve_forever, daemon=True)
    server_thread.start()
    logger.info(f"[ngrok] ローカルサーバー起動: port={port}")

    try:
        from pyngrok import ngrok
        tunnel = ngrok.connect(port, "http")
        public_url = tunnel.public_url
        image_url = f"{public_url}/{image_name}"
        logger.info(f"[ngrok] 画像公開URL: {image_url}")

        # 自動停止タイマー
        def _cleanup():
            time.sleep(timeout)
            try:
                ngrok.disconnect(tunnel.public_url)
                server.shutdown()
                logger.info("[ngrok] トンネル・サーバー停止完了")
            except Exception:
                pass

        cleanup_thread = threading.Thread(target=_cleanup, daemon=True)
        cleanup_thread.start()

        return image_url

    except Exception as e:
        logger.error(f"[ngrok] トンネル作成失敗: {e}")
        server.shutdown()
        return None


def upload_image_to_github(image_path: str) -> str | None:
    """非推奨: GitHubに画像をアップロードして公開URLを返す
    → serve_image_via_ngrok() を使うこと
    """
    logger.warning("[非推奨] upload_image_to_github は使わないでください。serve_image_via_ngrok を使用してください。")
    return serve_image_via_ngrok(image_path)


class AutoPost:
    """フォルダ監視ベースの自動投稿"""

    def __init__(self, platforms: dict[str, PlatformBase]):
        """
        Args:
            platforms: {"instagram": InstagramPlatform, "threads": ..., "x": ...}
        """
        self.platforms = platforms

    def create_draft(self, image_path: str, note_url: str = None) -> dict:
        """
        画像から各プラットフォーム向けの投稿ドラフトを生成する

        Args:
            image_path: 投稿画像パス
            note_url: note記事URLがあれば含める

        Returns:
            {"instagram": "テキスト...", "threads": "テキスト...", "x": "テキスト..."}
        """
        drafts = {}
        for platform_name in self.platforms:
            text = generate_post_text(
                image_description=f"画像ファイル: {image_path}",
                platform=platform_name,
                note_url=note_url,
            )
            drafts[platform_name] = text

        return drafts

    def publish(self, platform_name: str, text: str, image_path: str = None) -> str | None:
        """
        指定プラットフォームに投稿する（承認後に呼ばれる）

        Args:
            platform_name: "instagram", "threads", "x"
            text: 投稿テキスト
            image_path: 画像パス

        Returns:
            投稿URLまたはID
        """
        platform = self.platforms.get(platform_name)
        if not platform:
            logger.error(f"Unknown platform: {platform_name}")
            return None

        post = Post(text=text, image_path=image_path)
        return platform.post(post)

    def publish_all(self, drafts: dict, image_path: str = None) -> dict:
        """
        全プラットフォームに投稿する

        Returns:
            {"instagram": "url_or_id", "threads": ..., "x": ...}
        """
        results = {}
        for platform_name, text in drafts.items():
            if text:
                results[platform_name] = self.publish(platform_name, text, image_path)
            else:
                results[platform_name] = None
        return results
