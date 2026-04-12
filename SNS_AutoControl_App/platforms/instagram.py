"""
Instagram Graph API 連携モジュール
Instagram Business API (v21.0) を使用
"""
import requests
from .base import PlatformBase, Post, Comment


class InstagramPlatform(PlatformBase):
    """Instagram Graph API を使った投稿・コメント管理"""

    def __init__(self, access_token: str, business_account_id: str):
        self.access_token = access_token
        self.account_id = business_account_id
        self.api_base = "https://graph.instagram.com/v21.0"

    def _request(self, method: str, endpoint: str, **kwargs) -> dict:
        """API共通リクエスト"""
        url = f"{self.api_base}/{endpoint}"
        params = kwargs.pop("params", {})
        params["access_token"] = self.access_token
        resp = requests.request(method, url, params=params, **kwargs)
        resp.raise_for_status()
        return resp.json()

    # --- 投稿 ---

    def post(self, post: Post) -> str | None:
        """画像投稿（コンテナ作成 → 公開の2ステップ）"""
        if not post.image_path:
            raise ValueError("Instagram投稿には画像URLが必要です")

        caption = post.text or ""
        if post.hashtags:
            caption += "\n" + " ".join(f"#{tag}" for tag in post.hashtags)

        # Step 1: メディアコンテナ作成
        container = self._request(
            "POST",
            f"{self.account_id}/media",
            params={
                "image_url": post.image_path,
                "caption": caption,
            },
        )
        container_id = container.get("id")

        # Step 2: 公開
        result = self._request(
            "POST",
            f"{self.account_id}/media_publish",
            params={"creation_id": container_id},
        )
        return result.get("id")

    def post_carousel(self, image_urls: list[str], caption: str) -> str | None:
        """カルーセル投稿（複数画像）

        Args:
            image_urls: 公開画像URLのリスト（順番通りに投稿される）
            caption: キャプション（1つだけ、カルーセル全体に付く）

        Returns:
            投稿ID or None
        """
        import time

        # Step 1: 各画像のコンテナを作成
        child_ids = []
        for url in image_urls:
            container = self._request(
                "POST",
                f"{self.account_id}/media",
                params={
                    "image_url": url,
                    "is_carousel_item": "true",
                },
            )
            child_ids.append(container["id"])

        time.sleep(2)

        # Step 2: カルーセルコンテナを作成
        carousel = self._request(
            "POST",
            f"{self.account_id}/media",
            params={
                "media_type": "CAROUSEL",
                "children": ",".join(child_ids),
                "caption": caption,
            },
        )
        carousel_id = carousel["id"]

        time.sleep(3)

        # Step 3: 公開
        result = self._request(
            "POST",
            f"{self.account_id}/media_publish",
            params={"creation_id": carousel_id},
        )
        return result.get("id")

    # --- コメント ---

    def get_comments(self, post_id: str) -> list[Comment]:
        """指定投稿のコメント一覧を取得"""
        data = self._request(
            "GET",
            f"{post_id}/comments",
            params={"fields": "id,text,timestamp,from{username}"},
        )
        comments = []
        for item in data.get("data", []):
            from_data = item.get("from", {})
            comments.append(Comment(
                id=item["id"],
                text=item["text"],
                author=from_data.get("username", ""),
                post_id=post_id,
                created_at=item.get("timestamp", ""),
                platform="instagram",
            ))
        return comments

    def reply_to_comment(self, comment_id: str, text: str) -> bool:
        """コメントに返信"""
        result = self._request(
            "POST",
            f"{comment_id}/replies",
            params={"message": text},
        )
        return "id" in result

    def like_comment(self, comment_id: str) -> bool:
        """コメントにいいね（※IG APIでは未サポートの場合あり）"""
        try:
            self._request("POST", f"{comment_id}/likes")
            return True
        except requests.HTTPError:
            return False

    # --- 投稿一覧 ---

    def get_my_posts(self, limit: int = 20) -> list[dict]:
        """自分の投稿一覧を取得"""
        data = self._request(
            "GET",
            f"{self.account_id}/media",
            params={
                "fields": "id,caption,media_type,media_url,thumbnail_url,timestamp,permalink",
                "limit": limit,
            },
        )
        return data.get("data", [])

    # --- メッセージ送信 ---

    def send_message(self, recipient_id: str, text: str) -> bool:
        """Instagram DMを送信"""
        result = self._request(
            "POST",
            "me/messages",
            json={
                "recipient": {"id": recipient_id},
                "message": {"text": text},
            },
        )
        return "message_id" in result or "id" in result

    # --- プロフィール ---

    def get_profile(self) -> dict:
        """アカウント情報を取得"""
        return self._request(
            "GET",
            "me",
            params={"fields": "id,username,name,profile_picture_url,followers_count,media_count"},
        )
