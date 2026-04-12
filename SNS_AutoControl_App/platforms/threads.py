"""
Threads API 連携モジュール
Threads API (v1.0) を使用
"""
import time
import requests
from .base import PlatformBase, Post, Comment


class ThreadsPlatform(PlatformBase):
    """Threads API を使った投稿・コメント管理"""

    def __init__(self, access_token: str, user_id: str):
        self.access_token = access_token
        self.user_id = user_id
        self.api_base = "https://graph.threads.net/v1.0"

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
        """Threadsに投稿（テキスト or 画像+テキスト）"""
        text = post.text or ""
        if post.hashtags:
            text += "\n" + " ".join(f"#{tag}" for tag in post.hashtags)

        # Step 1: メディアコンテナ作成
        create_params = {"media_type": "TEXT", "text": text}

        if post.image_path:
            create_params["media_type"] = "IMAGE"
            create_params["image_url"] = post.image_path

        container = self._request(
            "POST",
            f"{self.user_id}/threads",
            params=create_params,
        )
        container_id = container.get("id")

        # Step 2: 公開（少し待つ必要がある場合あり）
        time.sleep(2)
        result = self._request(
            "POST",
            f"{self.user_id}/threads_publish",
            params={"creation_id": container_id},
        )
        return result.get("id")

    # --- 返信（コメント）取得 ---

    def get_comments(self, post_id: str) -> list[Comment]:
        """指定投稿の返信一覧を取得"""
        data = self._request(
            "GET",
            f"{post_id}/replies",
            params={"fields": "id,text,username,timestamp"},
        )
        comments = []
        for item in data.get("data", []):
            comments.append(Comment(
                id=item["id"],
                text=item.get("text", ""),
                author=item.get("username", ""),
                post_id=post_id,
                created_at=item.get("timestamp", ""),
                platform="threads",
            ))
        return comments

    def reply_to_comment(self, comment_id: str, text: str) -> bool:
        """返信に返信する"""
        # Step 1: 返信コンテナ作成
        container = self._request(
            "POST",
            f"{self.user_id}/threads",
            params={
                "media_type": "TEXT",
                "text": text,
                "reply_to_id": comment_id,
            },
        )
        container_id = container.get("id")

        # Step 2: 公開
        time.sleep(2)
        result = self._request(
            "POST",
            f"{self.user_id}/threads_publish",
            params={"creation_id": container_id},
        )
        return "id" in result

    def like_comment(self, comment_id: str) -> bool:
        """返信にいいね（Threads APIでは未サポートの場合あり）"""
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
            f"{self.user_id}/threads",
            params={
                "fields": "id,text,media_type,media_url,timestamp,permalink",
                "limit": limit,
            },
        )
        return data.get("data", [])

    # --- プロフィール ---

    def get_profile(self) -> dict:
        """アカウント情報を取得"""
        return self._request(
            "GET",
            "me",
            params={"fields": "id,username,name,threads_profile_picture_url"},
        )

    # --- インサイト ---

    def get_insights(self, metric: str = "views") -> dict:
        """アカウントインサイトを取得"""
        return self._request(
            "GET",
            f"{self.user_id}/threads_insights",
            params={"metric": metric},
        )

    # --- 投稿削除 ---

    def delete_post(self, post_id: str) -> bool:
        """投稿を削除"""
        try:
            self._request("DELETE", post_id)
            return True
        except requests.HTTPError:
            return False

    # --- キーワード検索 ---

    def search(self, query: str, limit: int = 20) -> list[dict]:
        """キーワード検索"""
        try:
            data = self._request(
                "GET",
                f"{self.user_id}/threads",
                params={
                    "fields": "id,text,username,timestamp",
                    "limit": limit,
                    "q": query,
                },
            )
            return data.get("data", [])
        except requests.HTTPError:
            return []
