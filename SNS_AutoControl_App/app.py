"""
SNS AutoControl App - Flask WebUI
管理画面・承認UI・ログ閲覧・Webhook受信
"""
import logging
import requests
from flask import Flask, render_template, request, jsonify, redirect, url_for, session
from database import Database
from config import (
    FLASK_HOST, FLASK_PORT, SECRET_KEY, WEBHOOK_VERIFY_TOKEN,
    INSTAGRAM_APP_ID, INSTAGRAM_APP_SECRET, INSTAGRAM_REDIRECT_URI,
    INSTAGRAM_ACCESS_TOKEN, INSTAGRAM_BUSINESS_ACCOUNT_ID,
    THREADS_APP_ID, THREADS_APP_SECRET, THREADS_REDIRECT_URI,
    THREADS_ACCESS_TOKEN, THREADS_USER_ID,
)

logger = logging.getLogger(__name__)

app = Flask(__name__)
app.secret_key = SECRET_KEY
db = Database()


@app.route("/")
def index():
    """ダッシュボード（OAuth コールバック兼用）"""
    code = request.args.get("code")
    if code:
        # stateパラメータでInstagram/Threadsを区別
        state = request.args.get("state", "")
        if state == "threads":
            return threads_callback_handler(code)
        return instagram_callback_handler(code)

    pending_replies = db.get_pending_replies()
    pending_posts = db.get_pending_posts()
    webhook_events = db.get_unprocessed_webhook_events()
    return render_template(
        "index.html",
        pending_replies=pending_replies,
        pending_posts=pending_posts,
        webhook_events=webhook_events,
    )


@app.route("/api/pending-replies")
def api_pending_replies():
    """承認待ちの返信一覧をJSON取得"""
    pending = db.get_pending_replies()
    return jsonify(pending)


@app.route("/api/approve-reply", methods=["POST"])
def api_approve_reply():
    """返信を承認して投稿する"""
    data = request.json
    comment_id = data.get("comment_id")
    if not comment_id:
        return jsonify({"error": "comment_id is required"}), 400

    # 承認待ちから返信テキストを取得
    pending = db.get_pending_reply_by_comment_id(comment_id)
    if not pending:
        return jsonify({"error": "pending reply not found"}), 404

    reply_text = pending.get("reply_text", "")
    platform = pending.get("platform", "")

    # 実際のAPI投稿
    posted = False
    try:
        if platform == "instagram" and INSTAGRAM_ACCESS_TOKEN:
            from platforms.instagram import InstagramPlatform
            ig = InstagramPlatform(INSTAGRAM_ACCESS_TOKEN, INSTAGRAM_BUSINESS_ACCOUNT_ID)
            posted = ig.reply_to_comment(comment_id, reply_text)
        elif platform == "threads" and THREADS_ACCESS_TOKEN:
            from platforms.threads import ThreadsPlatform
            th = ThreadsPlatform(THREADS_ACCESS_TOKEN, THREADS_USER_ID)
            posted = th.reply_to_comment(comment_id, reply_text)
    except Exception as e:
        return jsonify({"error": f"投稿失敗: {str(e)}"}), 500

    if posted:
        db.approve_reply(comment_id)
        db.save_reply(comment_id, reply_text, platform)
        return jsonify({"status": "posted", "comment_id": comment_id})
    else:
        db.approve_reply(comment_id)
        return jsonify({"status": "approved_but_post_failed", "comment_id": comment_id})


@app.route("/api/reject-reply", methods=["POST"])
def api_reject_reply():
    """返信を却下する"""
    data = request.json
    comment_id = data.get("comment_id")
    if not comment_id:
        return jsonify({"error": "comment_id is required"}), 400

    db.reject_reply(comment_id)
    return jsonify({"status": "rejected", "comment_id": comment_id})


# === 投稿承認API（Phase 3） ===

@app.route("/api/pending-posts")
def api_pending_posts():
    """承認待ちの投稿一覧をJSON取得"""
    pending = db.get_pending_posts()
    return jsonify(pending)


@app.route("/api/approve-post", methods=["POST"])
def api_approve_post():
    """投稿を承認して実際に投稿する"""
    data = request.json
    post_id = data.get("post_id")
    if not post_id:
        return jsonify({"error": "post_id is required"}), 400

    pending = db.get_pending_post_by_id(int(post_id))
    if not pending:
        return jsonify({"error": "pending post not found"}), 404

    text = pending.get("text", "")
    platform = pending.get("platform", "")
    image_path = pending.get("image_path")
    note_url = pending.get("note_url")
    account = pending.get("account", "")

    posted = False
    post_result = None
    try:
        if platform == "instagram" and INSTAGRAM_ACCESS_TOKEN:
            from platforms.instagram import InstagramPlatform
            ig = InstagramPlatform(INSTAGRAM_ACCESS_TOKEN, INSTAGRAM_BUSINESS_ACCOUNT_ID)
            from platforms.base import Post
            # IG APIは公開URLが必要 → ngrokでローカル画像を一時公開
            actual_image_url = image_path
            if image_path and not image_path.startswith("http"):
                from actions.auto_post import serve_image_via_ngrok
                actual_image_url = serve_image_via_ngrok(image_path, timeout=120)
                if not actual_image_url:
                    return jsonify({"error": "画像の公開URL化に失敗しました"}), 500
                import time; time.sleep(3)  # ngrokトンネル安定待ち
            post_result = ig.post(Post(text=text, image_path=actual_image_url))
            posted = post_result is not None
        elif platform == "threads" and THREADS_ACCESS_TOKEN:
            from platforms.threads import ThreadsPlatform
            th = ThreadsPlatform(THREADS_ACCESS_TOKEN, THREADS_USER_ID)
            from platforms.base import Post
            post_result = th.post(Post(text=text, image_path=image_path))
            posted = post_result is not None
    except Exception as e:
        return jsonify({"error": f"投稿失敗: {str(e)}"}), 500

    if posted:
        db.approve_post(int(post_id))
        db.save_post(platform=platform, post_id=str(post_result),
                     text=text, image_path=image_path, note_url=note_url,
                     account=account)
        return jsonify({"status": "posted", "post_id": post_id, "result": str(post_result)})
    else:
        db.approve_post(int(post_id))
        return jsonify({"status": "approved_but_post_failed", "post_id": post_id})


@app.route("/api/reject-post", methods=["POST"])
def api_reject_post():
    """投稿を却下する"""
    data = request.json
    post_id = data.get("post_id")
    if not post_id:
        return jsonify({"error": "post_id is required"}), 400

    db.reject_post(int(post_id))
    return jsonify({"status": "rejected", "post_id": post_id})


@app.route("/serve-image/<path:filename>")
def serve_image(filename):
    """ローカル画像を配信するエンドポイント（IG API用の一時公開URL）"""
    import os
    from flask import send_file, abort
    # セキュリティ: ファイル名にパストラバーサルがないか確認
    if ".." in filename or filename.startswith("/"):
        abort(403)
    # _served_images に登録された画像のみ配信
    full_path = _served_images.get(filename)
    if not full_path or not os.path.exists(full_path):
        abort(404)
    return send_file(full_path, mimetype="image/png")


# 配信許可された画像のレジストリ（セキュリティ: 登録された画像のみ配信）
_served_images: dict[str, str] = {}


def get_public_image_url(local_path: str) -> str | None:
    """ローカル画像パスをngrok経由の公開URLに変換する

    Flaskアプリ + 既存ngrokトンネルを利用。
    新しいトンネルは作らない。
    """
    import os
    import hashlib
    if not os.path.exists(local_path):
        logger.error(f"[画像配信] ファイルが見つかりません: {local_path}")
        return None

    # ファイル名をハッシュ化（パス情報を隠す）
    path_hash = hashlib.md5(local_path.encode()).hexdigest()[:12]
    ext = os.path.splitext(local_path)[1] or ".png"
    served_name = f"{path_hash}{ext}"

    # レジストリに登録
    _served_images[served_name] = os.path.abspath(local_path)

    # ngrokの公開URLを取得
    try:
        from pyngrok import ngrok
        tunnels = ngrok.get_tunnels()
        public_url = None
        for t in tunnels:
            if "ngrok" in t.public_url:
                public_url = t.public_url
                break
        if not public_url:
            logger.error("[画像配信] ngrokトンネルが見つかりません。run_webhook_setup.pyを先に起動してください。")
            return None
        image_url = f"{public_url}/serve-image/{served_name}"
        logger.info(f"[画像配信] {local_path} → {image_url}")
        return image_url
    except Exception as e:
        logger.error(f"[画像配信] ngrok取得失敗: {e}")
        return None


@app.route("/privacy")
def privacy():
    """プライバシーポリシー"""
    return render_template("privacy.html")


# === Instagram OAuth ===

@app.route("/auth/instagram/callback")
def instagram_callback():
    """Instagram OAuthコールバック"""
    code = request.args.get("code")
    if not code:
        return jsonify({"error": "認証コードがありません"}), 400
    return instagram_callback_handler(code)


@app.route("/auth/instagram")
def instagram_auth():
    """Instagram OAuth認証を開始"""
    auth_url = (
        "https://www.instagram.com/oauth/authorize"
        f"?client_id={INSTAGRAM_APP_ID}"
        f"&redirect_uri={INSTAGRAM_REDIRECT_URI}"
        "&scope=instagram_business_basic,instagram_business_manage_comments,instagram_business_manage_messages"
        "&response_type=code"
    )
    return redirect(auth_url)


def instagram_callback_handler(code: str):
    """認証コードをアクセストークンに交換する共通処理"""
    # 短期トークンを取得
    token_resp = requests.post(
        "https://api.instagram.com/oauth/access_token",
        data={
            "client_id": INSTAGRAM_APP_ID,
            "client_secret": INSTAGRAM_APP_SECRET,
            "grant_type": "authorization_code",
            "redirect_uri": INSTAGRAM_REDIRECT_URI,
            "code": code,
        },
    )

    if token_resp.status_code != 200:
        return jsonify({"error": "トークン取得失敗", "detail": token_resp.json()}), 400

    short_token_data = token_resp.json()
    short_token = short_token_data.get("access_token")
    user_id = short_token_data.get("user_id")

    # 長期トークンに交換
    long_resp = requests.get(
        "https://graph.instagram.com/access_token",
        params={
            "grant_type": "ig_exchange_token",
            "client_secret": INSTAGRAM_APP_SECRET,
            "access_token": short_token,
        },
    )

    if long_resp.status_code == 200:
        long_token_data = long_resp.json()
        access_token = long_token_data.get("access_token")
        expires_in = long_token_data.get("expires_in")  # 約60日
    else:
        access_token = short_token
        expires_in = 3600

    session["instagram_access_token"] = access_token
    session["instagram_user_id"] = user_id

    return jsonify({
        "status": "success",
        "user_id": user_id,
        "token_type": "long_lived" if long_resp.status_code == 200 else "short_lived",
        "expires_in_seconds": expires_in,
        "message": "アクセストークンを取得しました。.envのINSTAGRAM_ACCESS_TOKENに設定してください。",
        "access_token": access_token,
    })


# === Threads OAuth ===

@app.route("/auth/threads")
def threads_auth():
    """Threads OAuth認証を開始"""
    auth_url = (
        "https://threads.net/oauth/authorize"
        f"?client_id={THREADS_APP_ID}"
        f"&redirect_uri={THREADS_REDIRECT_URI}"
        "&scope=threads_basic,threads_content_publish,threads_manage_replies,threads_manage_insights,threads_read_replies"
        "&response_type=code"
        "&state=threads"
    )
    return redirect(auth_url)


def threads_callback_handler(code: str):
    """Threads認証コードをアクセストークンに交換"""
    # 短期トークンを取得
    token_resp = requests.post(
        "https://graph.threads.net/oauth/access_token",
        data={
            "client_id": THREADS_APP_ID,
            "client_secret": THREADS_APP_SECRET,
            "grant_type": "authorization_code",
            "redirect_uri": THREADS_REDIRECT_URI,
            "code": code,
        },
    )

    if token_resp.status_code != 200:
        return jsonify({"error": "トークン取得失敗", "detail": token_resp.text}), 400

    short_token_data = token_resp.json()
    short_token = short_token_data.get("access_token")
    user_id = short_token_data.get("user_id")

    # 長期トークンに交換
    long_resp = requests.get(
        "https://graph.threads.net/access_token",
        params={
            "grant_type": "th_exchange_token",
            "client_secret": THREADS_APP_SECRET,
            "access_token": short_token,
        },
    )

    if long_resp.status_code == 200:
        long_token_data = long_resp.json()
        access_token = long_token_data.get("access_token")
        expires_in = long_token_data.get("expires_in")
    else:
        access_token = short_token
        expires_in = 3600

    session["threads_access_token"] = access_token
    session["threads_user_id"] = user_id

    return jsonify({
        "status": "success",
        "user_id": user_id,
        "token_type": "long_lived" if long_resp.status_code == 200 else "short_lived",
        "expires_in_seconds": expires_in,
        "message": "Threadsアクセストークンを取得しました。.envのTHREADS_ACCESS_TOKENに設定してください。",
        "access_token": access_token,
    })


# === Webhook（Meta: Instagram / Threads） ===

@app.route("/webhook", methods=["GET"])
def webhook_verify():
    """Meta Webhook検証エンドポイント
    Meta側がsubscribe時にGETでchallenge値を送ってくるので、それを返す。
    """
    mode = request.args.get("hub.mode")
    token = request.args.get("hub.verify_token")
    challenge = request.args.get("hub.challenge")

    if mode == "subscribe" and token == WEBHOOK_VERIFY_TOKEN:
        logger.info("Webhook verified successfully")
        return challenge, 200
    else:
        logger.warning("Webhook verification failed: mode=%s token=%s", mode, token)
        return "Forbidden", 403


@app.route("/webhook", methods=["POST"])
def webhook_handler():
    """Meta Webhookイベント受信エンドポイント
    Instagram: comments, mentions
    Threads: replies
    """
    payload = request.get_json(silent=True)
    if not payload:
        return "Bad Request", 400

    obj = payload.get("object", "")
    entries = payload.get("entry", [])

    logger.info("Webhook received: object=%s, entries=%d", obj, len(entries))

    for entry in entries:
        entry_id = entry.get("id", "")

        # --- Instagram イベント ---
        if obj == "instagram":
            for change in entry.get("changes", []):
                field = change.get("field", "")
                value = change.get("value", {})

                if field == "comments":
                    # 新しいコメントが付いた
                    db.save_webhook_event(
                        platform="instagram",
                        event_type="comment",
                        object_id=value.get("id"),
                        sender_id=value.get("from", {}).get("id"),
                        comment_text=value.get("text"),
                        media_id=value.get("media", {}).get("id"),
                        parent_id=value.get("parent_id"),
                        raw_payload=change,
                    )
                    logger.info("IG comment saved: %s", value.get("id"))

                elif field == "mentions":
                    # メンションされた
                    db.save_webhook_event(
                        platform="instagram",
                        event_type="mention",
                        object_id=value.get("comment_id") or value.get("media_id"),
                        sender_id=None,
                        comment_text=None,
                        media_id=value.get("media_id"),
                        raw_payload=change,
                    )
                    logger.info("IG mention saved: media=%s", value.get("media_id"))

                else:
                    # 未対応フィールドも記録しておく
                    db.save_webhook_event(
                        platform="instagram",
                        event_type=f"unknown_{field}",
                        raw_payload=change,
                    )

            # Instagram DM（messaging）
            for msg_event in entry.get("messaging", []):
                sender_id = msg_event.get("sender", {}).get("id")
                message = msg_event.get("message", {})
                db.save_webhook_event(
                    platform="instagram",
                    event_type="dm",
                    object_id=message.get("mid"),
                    sender_id=sender_id,
                    comment_text=message.get("text"),
                    raw_payload=msg_event,
                )
                logger.info("IG DM saved from %s", sender_id)

        # --- Threads イベント ---
        elif obj == "page" or obj == "threads":
            # Threads webhookはchanges配列で届く
            for change in entry.get("changes", []):
                field = change.get("field", "")
                value = change.get("value", {})

                if field == "replies" or field == "threads":
                    db.save_webhook_event(
                        platform="threads",
                        event_type="reply",
                        object_id=value.get("id"),
                        sender_id=value.get("from", {}).get("id") if isinstance(value.get("from"), dict) else None,
                        comment_text=value.get("text"),
                        parent_id=value.get("parent_id") or value.get("root_post", {}).get("id") if isinstance(value.get("root_post"), dict) else value.get("parent_id"),
                        raw_payload=change,
                    )
                    logger.info("Threads reply saved: %s", value.get("id"))
                else:
                    db.save_webhook_event(
                        platform="threads",
                        event_type=f"unknown_{field}",
                        raw_payload=change,
                    )

        else:
            # 未対応objectも記録
            db.save_webhook_event(
                platform=obj or "unknown",
                event_type="unknown",
                raw_payload=payload,
            )

    # Metaには常に200を返す（返さないとリトライされる）
    return "OK", 200


# === エンゲージメント統計API（Phase 4） ===

@app.route("/api/engagement-stats")
def api_engagement_stats():
    """エンゲージメント日次統計"""
    account = request.args.get("account", "")
    stats = db.get_daily_stats("x", account)
    return jsonify(stats)


@app.route("/api/engagement-targets")
def api_engagement_targets():
    """登録済みターゲット一覧"""
    account = request.args.get("account", "")
    targets = db.get_engagement_targets("x", account)
    return jsonify(targets)


@app.route("/api/engagement-actions")
def api_engagement_actions():
    """直近のエンゲージメントアクション一覧"""
    account = request.args.get("account", "")
    limit = int(request.args.get("limit", 50))
    with db._get_conn() as conn:
        conn.row_factory = __import__("sqlite3").Row
        rows = conn.execute(
            """SELECT * FROM engagement_actions
               WHERE account = ? ORDER BY created_at DESC LIMIT ?""",
            (account, limit),
        ).fetchall()
    return jsonify([dict(r) for r in rows])


@app.route("/api/dashboard-stats")
def api_dashboard_stats():
    """ダッシュボード用の統合統計"""
    from datetime import datetime
    today = datetime.now().strftime("%Y-%m-%d")

    pending_posts = len(db.get_pending_posts())
    pending_replies = len(db.get_pending_replies())
    webhook_events = len(db.get_unprocessed_webhook_events())

    # 今日の投稿数
    with db._get_conn() as conn:
        row = conn.execute(
            "SELECT COUNT(*) as cnt FROM posts WHERE date(created_at) = ?", (today,)
        ).fetchone()
        today_posts = row[0] if row else 0

    # エンゲージメント統計（全アカウント合算）
    eng_stats = {"likes": 0, "replies": 0, "follows": 0, "quote_rts": 0}
    for acc in ["shikumiya_ai", "ando_lyo"]:
        s = db.get_daily_stats("x", acc, today)
        for k in eng_stats:
            eng_stats[k] += s.get(k, 0)

    # ターゲット数
    targets_count = 0
    for acc in ["shikumiya_ai", "ando_lyo"]:
        targets_count += len(db.get_engagement_targets("x", acc))

    return jsonify({
        "pending_posts": pending_posts,
        "pending_replies": pending_replies,
        "webhook_events": webhook_events,
        "today_posts": today_posts,
        "engagement": eng_stats,
        "targets_count": targets_count,
    })


@app.route("/api/webhook-events")
def api_webhook_events():
    """未処理のWebhookイベント一覧をJSON取得"""
    platform = request.args.get("platform")
    events = db.get_unprocessed_webhook_events(platform)
    return jsonify(events)


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO,
                        format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
    app.run(host=FLASK_HOST, port=FLASK_PORT, debug=True, ssl_context="adhoc")
