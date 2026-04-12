"""
エンゲージメント自動化モジュール（X特化）
リサーチ結果に基づく全自動エンゲージメント:
- ターゲット発見（キーワード検索 → ユーザープロフィール取得 → tier分類）
- いいね（レート制限付き）
- リプライ（Claude CLI生成 + 多様性チェック）
- フォロー（レート制限付き）
- 引用RT（Claude CLI生成）

レート制限（リサーチ結果に基づく安全マージン）:
  いいね: 40/15min, 120/hour, 800/day
  リプライ: 15/hour, 50/day
  フォロー: 30/hour, 100/day
  アクション間: 15-90秒ランダム待機
"""
import logging
import random
import time
from datetime import datetime, timedelta
from pathlib import Path

from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

from ai.claude_cli import generate_reply
from database import Database
from platforms.x_twitter import XTwitterPlatform

logger = logging.getLogger(__name__)


# === レート制限 ===

RATE_LIMITS = {
    "like": {"per_hour": 120, "per_day": 800},
    "reply": {"per_hour": 15, "per_day": 50},
    "follow": {"per_hour": 30, "per_day": 100},
    "quote_rt": {"per_hour": 10, "per_day": 30},
    "retweet": {"per_hour": 20, "per_day": 50},
}

# アクション間のランダム待機（秒）
DELAY_RANGE = (8, 25)

# リプライ対象の配分
TARGET_RATIO = {
    "large": 0.4,   # 50K+ フォロワー → インプレッション獲得
    "medium": 0.4,  # 5K-50K → 相互エンゲージメント
    "small": 0.2,   # <5K → コミュニティ形成
}

# tier分類の閾値
TIER_THRESHOLDS = {
    "large": 50000,
    "medium": 5000,
    # small: 5000未満
}

# 自分が運用しているアカウント（エンゲージメント対象外）
OWN_ACCOUNTS = {
    "ando_lyo", "shikumiya_ai", "tohkaai",
}



def classify_tier(followers: int) -> str:
    if followers >= TIER_THRESHOLDS["large"]:
        return "large"
    elif followers >= TIER_THRESHOLDS["medium"]:
        return "medium"
    return "small"


# === ターゲット適合スコアリング ===
# ターゲット: AIクリエイター（AI画像生成・AIイラストを作ってる人）

# アカウント別のターゲットペルソナ定義
# NOTE: shikumiya_ai は封印中（2026-04時点）。定義は残すがフォールバック用
TARGET_PERSONAS = {
    "shikumiya_ai": {
        "description": "⚠️ 封印中（2026-04）— AIクリエイター（AI画像生成・AIイラストを作ってる人）",
        "bio_keywords": {
            "high": ["AI画像", "AIアート", "AIイラスト", "画像生成", "プロンプト",
                      "StableDiffusion", "Stable Diffusion", "Midjourney", "NovelAI",
                      "DALL-E", "SDXL", "Flux", "ComfyUI", "AIクリエイター",
                      "AI絵師", "生成AI", "AI art"],
            "medium": ["イラストレーター", "絵描き", "クリエイター", "アーティスト",
                        "同人", "作品", "創作", "漫画家", "デザイナー"],
            "low": ["ポートフォリオ", "制作", "個展", "展示", "note", "発信"],
        },
        "bio_negative": ["企業公式", "PR", "広告", "マーケティング会社", "代行業者",
                          "bot", "懸賞", "プレゼント企画", "FX", "投資", "物販",
                          "コンサル", "副業で月収"],
        "post_keywords": {
            "high": ["AI画像", "AIアート", "AIイラスト", "画像生成", "プロンプト",
                      "Stable Diffusion", "Midjourney", "NovelAI", "生成AI",
                      "txt2img", "img2img", "LoRA", "ControlNet", "ComfyUI"],
            "medium": ["作品できた", "描いた", "生成した", "出力した", "ガチャ",
                        "見てもらえない", "サイト欲しい", "ポートフォリオ"],
        },
        "ideal_followers": (50, 15000),
    },
    # 旧アカウント名（互換用）
    "ando_lyo": {
        "description": "AIクリエイター（AI画像生成・AIイラストを作ってる人）",
        "bio_keywords": {
            "high": ["AI画像", "AIアート", "AIイラスト", "画像生成", "プロンプト",
                      "StableDiffusion", "Stable Diffusion", "Midjourney", "NovelAI",
                      "DALL-E", "SDXL", "Flux", "ComfyUI", "AIクリエイター",
                      "AI絵師", "生成AI", "AI art"],
            "medium": ["イラストレーター", "絵描き", "クリエイター", "アーティスト",
                        "同人", "作品", "創作", "漫画家"],
            "low": ["ポートフォリオ", "制作", "個展", "note", "発信", "自動化"],
        },
        "bio_negative": ["企業公式", "PR", "広告", "bot", "懸賞", "FX", "投資",
                          "物販", "コンサル", "副業で月収"],
        "post_keywords": {
            "high": ["AI画像", "AIアート", "AIイラスト", "画像生成", "プロンプト",
                      "Stable Diffusion", "Midjourney", "NovelAI", "生成AI",
                      "txt2img", "img2img", "LoRA", "ControlNet", "ComfyUI"],
            "medium": ["作品できた", "生成した", "出力した", "見てもらえない",
                        "サイト欲しい", "ポートフォリオ", "AI使って"],
        },
        "ideal_followers": (50, 15000),
    },
    # 現在のメインアカウント
    "ando_lyo_ai": {
        "description": "AIクリエイター（AI画像生成・AIイラストを作ってる人）",
        "bio_keywords": {
            "high": ["AI画像", "AIアート", "AIイラスト", "画像生成", "プロンプト",
                      "StableDiffusion", "Stable Diffusion", "Midjourney", "NovelAI",
                      "DALL-E", "SDXL", "Flux", "ComfyUI", "AIクリエイター",
                      "AI絵師", "生成AI", "AI art"],
            "medium": ["イラストレーター", "絵描き", "クリエイター", "アーティスト",
                        "同人", "作品", "創作", "漫画家"],
            "low": ["ポートフォリオ", "制作", "個展", "note", "発信", "自動化"],
        },
        "bio_negative": ["企業公式", "PR", "広告", "bot", "懸賞", "FX", "投資",
                          "物販", "コンサル", "副業で月収"],
        "post_keywords": {
            "high": ["AI画像", "AIアート", "AIイラスト", "画像生成", "プロンプト",
                      "Stable Diffusion", "Midjourney", "NovelAI", "生成AI",
                      "txt2img", "img2img", "LoRA", "ControlNet", "ComfyUI"],
            "medium": ["作品できた", "生成した", "出力した", "見てもらえない",
                        "サイト欲しい", "ポートフォリオ", "AI使って"],
        },
        "ideal_followers": (50, 15000),
    },
}


def score_target_relevance(profile: dict, post_text: str, account: str) -> tuple[int, list[str]]:
    """ターゲットの適合度をスコアリング（0-100点）

    Args:
        profile: {"bio": str, "followers": int, "following": int, ...}
        post_text: 発見元の投稿テキスト
        account: アカウント名

    Returns:
        (score, reasons): スコアと加減点理由のリスト
    """
    persona = TARGET_PERSONAS.get(account, TARGET_PERSONAS["ando_lyo_ai"])
    score = 0
    reasons = []
    bio = (profile.get("bio") or "").lower()
    text = (post_text or "").lower()
    followers = profile.get("followers", 0)

    # --- bioキーワードマッチ（最大40点）---
    bio_score = 0
    for kw in persona["bio_keywords"].get("high", []):
        if kw.lower() in bio:
            bio_score += 15
            reasons.append(f"bio:'{kw}'(+15)")
    for kw in persona["bio_keywords"].get("medium", []):
        if kw.lower() in bio:
            bio_score += 8
            reasons.append(f"bio:'{kw}'(+8)")
    for kw in persona["bio_keywords"].get("low", []):
        if kw.lower() in bio:
            bio_score += 4
            reasons.append(f"bio:'{kw}'(+4)")
    score += min(bio_score, 40)

    # --- bioネガティブキーワード（-30点）---
    for kw in persona.get("bio_negative", []):
        if kw.lower() in bio:
            score -= 30
            reasons.append(f"bio:'{kw}'(-30)")
            break  # 1つ見つかれば十分

    # --- 投稿内容マッチ（最大30点）---
    post_score = 0
    for kw in persona.get("post_keywords", {}).get("high", []):
        if kw.lower() in text:
            post_score += 15
            reasons.append(f"post:'{kw}'(+15)")
    for kw in persona.get("post_keywords", {}).get("medium", []):
        if kw.lower() in text:
            post_score += 8
            reasons.append(f"post:'{kw}'(+8)")
    score += min(post_score, 30)

    # --- フォロワー数の適正範囲（最大20点）---
    ideal_min, ideal_max = persona.get("ideal_followers", (100, 10000))
    if ideal_min <= followers <= ideal_max:
        score += 20
        reasons.append(f"followers:{followers}(理想範囲+20)")
    elif followers < ideal_min:
        score += 5
        reasons.append(f"followers:{followers}(少なすぎ+5)")
    else:
        score += 10
        reasons.append(f"followers:{followers}(多め+10)")

    # --- FF比（フォロワー/フォロイー）で発信力チェック（最大10点）---
    following = profile.get("following", 1) or 1
    ff_ratio = followers / following
    if ff_ratio < 0.1:
        # フォロワーが極端に少ない＝スパムか無活動
        score -= 10
        reasons.append(f"FF比:{ff_ratio:.2f}(-10)")
    elif ff_ratio >= 0.5:
        score += 10
        reasons.append(f"FF比:{ff_ratio:.2f}(+10)")
    else:
        score += 5
        reasons.append(f"FF比:{ff_ratio:.2f}(+5)")

    # 0-100にクランプ
    score = max(0, min(100, score))

    return score, reasons


def score_action_quality(action_type: str, target: dict, post: dict,
                          reply_text: str = "", account: str = "") -> tuple[int, list[str]]:
    """アクションの品質をスコアリング（0-100点）

    「届けたい人にちゃんと届いたか」を数値化する。

    Args:
        action_type: "like", "reply", "follow", "quote_rt"
        target: ターゲット情報（relevance_score含む）
        post: 対象投稿情報（text, metrics等）
        reply_text: 生成したリプライ/引用テキスト
        account: アカウント名

    Returns:
        (score, reasons): スコアと理由リスト
    """
    score = 0
    reasons = []
    metrics = post.get("metrics", {})

    # --- ターゲット適合度の引き継ぎ（最大40点）---
    rel_score = int(target.get("relevance_score", 0) or 0)
    target_contrib = int(rel_score * 0.4)
    score += target_contrib
    reasons.append(f"ターゲット適合:{rel_score}→{target_contrib}pt")

    # --- 投稿の反応ポテンシャル（最大20点）---
    likes = metrics.get("likes", 0)
    replies_count = metrics.get("replies", 0)
    if action_type == "like":
        # いいねは投稿が新しくてまだ少ないほど効果的（初速に乗れる）
        if likes < 5:
            score += 20
            reasons.append(f"初速いいね(likes:{likes})(+20)")
        elif likes < 20:
            score += 15
            reasons.append(f"中期いいね(likes:{likes})(+15)")
        else:
            score += 5
            reasons.append(f"既に伸びてる(likes:{likes})(+5)")
    elif action_type == "reply":
        # リプライは会話が少ない投稿ほど目立つ
        if replies_count < 3:
            score += 20
            reasons.append(f"会話少ない(replies:{replies_count})(+20)")
        elif replies_count < 10:
            score += 10
            reasons.append(f"会話中程度(replies:{replies_count})(+10)")
        else:
            score += 5
            reasons.append(f"会話多い(replies:{replies_count})(+5)")
    elif action_type == "follow":
        # フォローはフォロワー少ない人ほど通知に気づく
        followers = target.get("followers", 0)
        if followers < 1000:
            score += 20
            reasons.append(f"小規模アカウント(+20)")
        elif followers < 5000:
            score += 15
            reasons.append(f"中規模アカウント(+15)")
        else:
            score += 5
            reasons.append(f"大規模アカウント(+5)")
    elif action_type == "quote_rt":
        # 引用RTは元投稿のインプレッション高いほど効果的
        if likes >= 20:
            score += 20
            reasons.append(f"高エンゲージ引用(likes:{likes})(+20)")
        elif likes >= 5:
            score += 15
            reasons.append(f"中エンゲージ引用(likes:{likes})(+15)")
        else:
            score += 10
            reasons.append(f"低エンゲージ引用(likes:{likes})(+10)")

    # --- リプライ/引用の文章品質（最大20点）---
    if reply_text and action_type in ("reply", "quote_rt"):
        text_len = len(reply_text)
        # 長さチェック（短すぎも長すぎもNG）
        if 40 <= text_len <= 200:
            score += 10
            reasons.append(f"文長適切({text_len}字)(+10)")
        elif text_len < 40:
            score += 3
            reasons.append(f"文短い({text_len}字)(+3)")
        else:
            score += 5
            reasons.append(f"文やや長い({text_len}字)(+5)")

        # 質問で終わっているか（会話誘発）
        if reply_text.rstrip().endswith("？") or reply_text.rstrip().endswith("?"):
            score += 10
            reasons.append("質問で終了(+10)")
        else:
            score += 3
            reasons.append("質問なし(+3)")

    # --- ターゲットペルソナとの整合性（最大10点）---
    # 両アカウントともメイン。ペルソナに合ったアクションかで加点
    persona = TARGET_PERSONAS.get(account, {})
    if persona and rel_score >= 40:
        score += 10
        reasons.append("ペルソナ高適合(+10)")
    elif persona:
        score += 5
        reasons.append("ペルソナ低適合(+5)")

    score = max(0, min(100, score))
    return score, reasons


class XEngagement:
    """X（Twitter）全自動エンゲージメント"""

    def __init__(self, x_platform: XTwitterPlatform, db: Database,
                 account: str = "", account_dir: str = ""):
        self.x = x_platform
        self.db = db
        self.account = account
        self.account_dir = account_dir
        self._hourly_counts = {"like": 0, "reply": 0, "follow": 0, "quote_rt": 0, "retweet": 0}
        self._hour_start = datetime.now()

    # === レート制限チェック ===

    def _check_rate_limit(self, action_type: str) -> bool:
        """レート制限をチェック。超過していたらFalse"""
        # 1時間リセット
        if datetime.now() - self._hour_start > timedelta(hours=1):
            self._hourly_counts = {k: 0 for k in self._hourly_counts}
            self._hour_start = datetime.now()

        limits = RATE_LIMITS.get(action_type, {})
        hourly_limit = limits.get("per_hour", 999)
        daily_limit = limits.get("per_day", 999)

        # 時間制限
        if self._hourly_counts.get(action_type, 0) >= hourly_limit:
            logger.warning(f"[レート制限] {action_type} hourly上限 ({hourly_limit}) に到達")
            return False

        # 日次制限
        stats = self.db.get_daily_stats("x", self.account)
        col_map = {"like": "likes", "reply": "replies", "follow": "follows",
                    "quote_rt": "quote_rts", "retweet": "retweets"}
        current_daily = stats.get(col_map.get(action_type, ""), 0)
        if current_daily >= daily_limit:
            logger.warning(f"[レート制限] {action_type} daily上限 ({daily_limit}) に到達")
            return False

        return True

    def _record_action(self, action_type: str):
        """アクション実行を記録"""
        self._hourly_counts[action_type] = self._hourly_counts.get(action_type, 0) + 1
        self.db.increment_daily_stat("x", self.account, action_type)

    # 投稿内容がAI画像生成に関連するか判定するキーワード
    RELEVANT_POST_KEYWORDS = [
        "AI画像", "AIアート", "AIイラスト", "画像生成", "プロンプト",
        "Stable Diffusion", "Midjourney", "NovelAI", "DALL-E", "SDXL",
        "Flux", "ComfyUI", "LoRA", "ControlNet", "txt2img", "img2img",
        "生成AI", "AI art", "AI絵", "AI生成", "画像AI",
    ]

    def _is_relevant_post(self, post_text: str) -> bool:
        """投稿内容がAI画像生成に関連するかチェック"""
        text_lower = post_text.lower()
        return any(kw.lower() in text_lower for kw in self.RELEVANT_POST_KEYWORDS)

    def _human_delay(self):
        """ランダム待機"""
        delay = random.uniform(*DELAY_RANGE)
        logger.debug(f"[待機] {delay:.1f}秒")
        time.sleep(delay)

    # === ターゲット発見 ===

    def discover_targets(self, keywords: list[str], limit_per_keyword: int = 10) -> list[dict]:
        """キーワード検索でエンゲージメント対象を発見しDBに保存

        各キーワードの適合率（ヒット率）を計測し、低品質ワードをログに記録。
        keyword_stats に蓄積して次回以降の改善に使う。

        Args:
            keywords: 検索キーワードリスト
            limit_per_keyword: キーワードごとの取得件数

        Returns:
            発見したユーザー一覧
        """
        discovered = {}  # username -> profile
        keyword_stats = {}  # kw -> {searched, matched, avg_score, skipped}

        for kw in keywords:
            logger.info(f"[検索] キーワード: {kw}")
            kw_stat = {"searched": 0, "matched": 0, "skipped": 0,
                       "scores": [], "avg_score": 0}
            try:
                posts = self.x.search_posts(kw, tab="Latest", limit=limit_per_keyword)
            except Exception as e:
                logger.error(f"[検索エラー] {kw}: {e}")
                keyword_stats[kw] = kw_stat
                continue

            for post in posts:
                author = post.get("author", "")
                if not author or author == self.x.username:
                    continue
                if author.lower() in OWN_ACCOUNTS:
                    continue
                if author in discovered:
                    continue

                kw_stat["searched"] += 1
                post_text = post.get("text", "")

                # 投稿内容だけでスコアリング（プロフィールページには遷移しない）
                post_score = 0
                reasons = []
                persona = TARGET_PERSONAS.get(self.account, TARGET_PERSONAS["ando_lyo_ai"])
                for pkw in persona.get("post_keywords", {}).get("high", []):
                    if pkw.lower() in post_text.lower():
                        post_score += 15
                        reasons.append(f"post:'{pkw}'(+15)")
                for pkw in persona.get("post_keywords", {}).get("medium", []):
                    if pkw.lower() in post_text.lower():
                        post_score += 8
                        reasons.append(f"post:'{pkw}'(+8)")
                # 検索キーワード自体が投稿に含まれていれば加点
                if kw.lower().replace("#", "") in post_text.lower():
                    post_score += 10
                    reasons.append(f"kw:'{kw}'(+10)")

                kw_stat["scores"].append(post_score)

                if post_score < 5:
                    kw_stat["skipped"] += 1
                    continue

                kw_stat["matched"] += 1
                self.db.upsert_engagement_target(
                    platform="x",
                    username=author,
                    account=self.account,
                    display_name="",
                    bio="",
                    followers=0,
                    following=0,
                    tier="unknown",
                    category=kw,
                    relevance_score=post_score,
                    relevance_reasons=", ".join(reasons[:5]),
                )
                discovered[author] = {
                    "username": author, "keyword": kw,
                    "relevance_score": post_score, "relevance_reasons": reasons,
                }
                logger.info(f"  [発見] @{author} (投稿スコア:{post_score}点)")

            # キーワード品質を集計
            if kw_stat["scores"]:
                kw_stat["avg_score"] = sum(kw_stat["scores"]) / len(kw_stat["scores"])
            keyword_stats[kw] = kw_stat

        # === キーワード品質レポート ===
        logger.info("=" * 50)
        logger.info("[キーワード品質レポート]")
        for kw, stat in sorted(keyword_stats.items(),
                                key=lambda x: x[1]["avg_score"], reverse=True):
            hit_rate = (stat["matched"] / stat["searched"] * 100) if stat["searched"] > 0 else 0
            quality = "◎" if hit_rate >= 50 else "○" if hit_rate >= 25 else "△" if hit_rate > 0 else "✗"
            logger.info(
                f"  {quality} 「{kw}」: "
                f"検索{stat['searched']}件 → 適合{stat['matched']}件 "
                f"(適合率{hit_rate:.0f}%, 平均スコア{stat['avg_score']:.0f})"
            )
            if hit_rate < 10 and stat["searched"] >= 3:
                logger.warning(f"  ⚠ 「{kw}」は適合率が低すぎます。別のワードへの切り替えを推奨")
        logger.info("=" * 50)

        # キーワード品質をファイルに蓄積
        self._save_keyword_stats(keyword_stats)

        logger.info(f"[発見完了] 新規ターゲット: {len(discovered)}件")
        return list(discovered.values())

    def _save_keyword_stats(self, keyword_stats: dict):
        """キーワード品質統計をJSONに蓄積（改善ループ用）"""
        import json
        stats_path = Path(self.account_dir) / "keyword_quality.json" if self.account_dir else None
        if not stats_path:
            return

        existing = {}
        if stats_path.exists():
            try:
                existing = json.loads(stats_path.read_text(encoding="utf-8"))
            except Exception:
                existing = {}

        today = datetime.now().strftime("%Y-%m-%d")
        if today not in existing:
            existing[today] = {}

        for kw, stat in keyword_stats.items():
            hit_rate = (stat["matched"] / stat["searched"] * 100) if stat["searched"] > 0 else 0
            existing[today][kw] = {
                "searched": stat["searched"],
                "matched": stat["matched"],
                "hit_rate": round(hit_rate, 1),
                "avg_score": round(stat["avg_score"], 1),
            }

        stats_path.write_text(json.dumps(existing, ensure_ascii=False, indent=2), encoding="utf-8")
        logger.info(f"[保存] キーワード品質統計 → {stats_path}")

    def add_targets_manual(self, usernames: list[str], category: str = "manual") -> int:
        """手動でターゲットを追加（プロフィール自動取得）"""
        added = 0
        for username in usernames:
            username = username.lstrip("@")
            try:
                profile = self.x.get_user_profile(username)
                if not profile:
                    logger.warning(f"[スキップ] @{username}: プロフィール取得失敗")
                    continue

                tier = classify_tier(profile["followers"])
                self.db.upsert_engagement_target(
                    platform="x",
                    username=username,
                    account=self.account,
                    display_name=profile.get("display_name", ""),
                    bio=profile.get("bio", ""),
                    followers=profile["followers"],
                    following=profile["following"],
                    tier=tier,
                    category=category,
                )
                added += 1
                logger.info(f"[追加] @{username} ({tier}, {profile['followers']}フォロワー)")
                self._human_delay()
            except Exception as e:
                logger.warning(f"[エラー] @{username}: {e}")
        return added

    # === いいね（廃止: アルゴリズム上最弱シグナル(1x)のため） ===
    # auto_like は 2026-04-10 に廃止。リプライ(75-150x)に集中する。

    # === リプライ ===

    def auto_reply(self, keywords: list[str] = None, targets: list[dict] = None,
                   max_replies: int = 10, persona: str = None, tone: str = None) -> int:
        """自動リプライ（Claude CLI生成 + 投稿）

        Args:
            keywords: 検索キーワード
            targets: ターゲットリスト
            max_replies: 最大リプライ数
            persona: Claude CLIに渡すペルソナ
            tone: Claude CLIに渡すトーン

        Returns:
            リプライした件数
        """
        replied = 0
        posts_to_reply = []

        if keywords:
            for kw in keywords:
                try:
                    results = self.x.search_posts(kw, tab="Latest", limit=10)
                    posts_to_reply.extend(results)
                    self._human_delay()
                except Exception as e:
                    logger.error(f"[検索エラー] {kw}: {e}")

        # ターゲットのプロフィールには遷移しない（検索結果の投稿だけ使う）

        random.shuffle(posts_to_reply)

        # ナレッジからトーン・ペルソナ読み込み
        if not persona and self.account_dir:
            tone_path = Path(self.account_dir) / "tone_guide.md"
            if tone_path.exists():
                persona = tone_path.read_text(encoding="utf-8")[:500]

        for post in posts_to_reply:
            if replied >= max_replies:
                break
            if not self._check_rate_limit("reply"):
                break

            post_id = post.get("id", "")
            post_url = post.get("url", "")
            author = post.get("author", "")
            post_text = post.get("text", "")

            if not post_url or author == self.x.username or author.lower() in OWN_ACCOUNTS:
                continue
            if self.db.has_engaged_post(post_id, "reply", self.account):
                continue

            # 投稿内容がAI画像生成に関連するかチェック
            if not self._is_relevant_post(post_text):
                logger.info(f"[リプライスキップ] @{author}: 投稿内容がターゲット外")
                continue

            # Gemini APIでリプライ生成
            try:
                reply_text = generate_reply(
                    comment_text=post_text,
                    author=author,
                    persona=persona,
                    tone=tone,
                )
                if not reply_text:
                    logger.warning(f"[リプライ生成失敗] @{author}")
                    continue

                # スコアリング + 投稿
                target_info = self.db.get_engagement_targets("x", self.account)
                target = next((t for t in target_info if t.get("username") == author), {})
                q_score, q_reasons = score_action_quality(
                    "reply", target, post, reply_text=reply_text, account=self.account
                )

                success = self.x.reply_to_post(post_url, reply_text)
                if success:
                    self.db.save_engagement_action(
                        "x", "reply", author, post_id, post_url,
                        post_text[:200], reply_text, account=self.account,
                        quality_score=q_score,
                        quality_reasons=", ".join(q_reasons[:5]),
                    )
                    self._record_action("reply")
                    replied += 1
                    logger.info(f"[リプライ] @{author} (品質:{q_score}点): {reply_text[:50]}...")
                    self._human_delay()
            except Exception as e:
                logger.error(f"[リプライエラー] {post_url}: {e}")

        logger.info(f"[リプライ完了] {replied}/{max_replies}件")
        return replied

    # === フォロー ===

    def auto_follow(self, targets: list[dict] = None, max_follows: int = 15) -> int:
        """ターゲットリストから自動フォロー

        Args:
            targets: ターゲットリスト（DB or 引数）
            max_follows: 最大フォロー数

        Returns:
            フォローした件数
        """
        if targets is None:
            targets = self.db.get_engagement_targets("x", self.account)

        followed = 0

        # tier比率に従ってシャッフル
        by_tier = {"large": [], "medium": [], "small": []}
        for t in targets:
            tier = t.get("tier", "medium")
            by_tier.setdefault(tier, []).append(t)

        ordered = []
        for tier, ratio in TARGET_RATIO.items():
            pool = by_tier.get(tier, [])
            random.shuffle(pool)
            n = max(1, int(max_follows * ratio))
            ordered.extend(pool[:n])

        random.shuffle(ordered)

        for target in ordered:
            if followed >= max_follows:
                break
            if not self._check_rate_limit("follow"):
                break

            username = target.get("username", "")
            if not username:
                continue

            try:
                q_score, q_reasons = score_action_quality(
                    "follow", target, {}, account=self.account
                )

                success = self.x.follow_user(username)
                if success:
                    self.db.save_engagement_action(
                        "x", "follow", username, account=self.account,
                        quality_score=q_score,
                        quality_reasons=", ".join(q_reasons[:5]),
                    )
                    self._record_action("follow")
                    followed += 1
                    logger.info(f"[フォロー] @{username} (品質:{q_score}点)")
                    self._human_delay()
            except Exception as e:
                logger.error(f"[フォローエラー] @{username}: {e}")

        logger.info(f"[フォロー完了] {followed}/{max_follows}件")
        return followed

    # === 引用RT ===

    def auto_quote_rt(self, keywords: list[str] = None, targets: list[dict] = None,
                      max_quotes: int = 5, persona: str = None) -> int:
        """自動引用RT（Claude CLI生成）"""
        quoted = 0
        posts_to_quote = []

        if keywords:
            for kw in keywords:
                try:
                    results = self.x.search_posts(kw, tab="Top", limit=5)
                    posts_to_quote.extend(results)
                    self._human_delay()
                except Exception as e:
                    logger.error(f"[検索エラー] {kw}: {e}")

        # ターゲットのプロフィールには遷移しない（検索結果の投稿だけ使う）

        random.shuffle(posts_to_quote)

        if not persona and self.account_dir:
            tone_path = Path(self.account_dir) / "tone_guide.md"
            if tone_path.exists():
                persona = tone_path.read_text(encoding="utf-8")[:500]

        for post in posts_to_quote:
            if quoted >= max_quotes:
                break
            if not self._check_rate_limit("quote_rt"):
                break

            post_id = post.get("id", "")
            post_url = post.get("url", "")
            author = post.get("author", "")
            post_text = post.get("text", "")

            if not post_url or author == self.x.username or author.lower() in OWN_ACCOUNTS:
                continue
            if self.db.has_engaged_post(post_id, "quote_rt", self.account):
                continue

            try:
                quote_text = generate_reply(
                    comment_text=post_text,
                    author=author,
                    persona=persona,
                    tone=(
                        "引用RTとして。ルール:\n"
                        "- 自分の体験・データ・独自視点を必ず加える\n"
                        "- 元ツイートの内容を補足・発展させる形で\n"
                        "- 「これ知らなかった」「保存した」と思わせる有益情報を含める\n"
                        "- 最後に問いかけで会話を誘う\n"
                        "- 導線意識: 読んだ人が「この人のプロフ見よう」と思える一言を自然に\n"
                        "- 140字以内"
                    ),
                )
                if not quote_text:
                    continue

                target_info = self.db.get_engagement_targets("x", self.account)
                target = next((t for t in target_info if t.get("username") == author), {})
                q_score, q_reasons = score_action_quality(
                    "quote_rt", target, post, reply_text=quote_text, account=self.account
                )

                success = self.x.quote_repost(post_url, quote_text)
                if success:
                    self.db.save_engagement_action(
                        "x", "quote_rt", author, post_id, post_url,
                        post_text[:200], quote_text, account=self.account,
                        quality_score=q_score,
                        quality_reasons=", ".join(q_reasons[:5]),
                    )
                    self._record_action("quote_rt")
                    quoted += 1
                    logger.info(f"[引用RT] @{author} (品質:{q_score}点): {quote_text[:50]}...")
                    self._human_delay()
            except Exception as e:
                logger.error(f"[引用RTエラー] {post_url}: {e}")

        logger.info(f"[引用RT完了] {quoted}/{max_quotes}件")
        return quoted

    # === 一括実行 ===

    def run_engagement_cycle(self, keywords: list[str],
                              discover: bool = True,
                              like: bool = True,
                              reply: bool = True,
                              follow: bool = True,
                              quote_rt: bool = True,
                              max_likes: int = 20,
                              max_replies: int = 10,
                              max_follows: int = 15,
                              max_quotes: int = 5) -> dict:
        """1サイクル分のエンゲージメントを一括実行

        Returns:
            {"discovered", "liked", "replied", "followed", "quoted", "stats"}
        """
        result = {"discovered": 0, "liked": 0, "replied": 0, "followed": 0, "quoted": 0}

        logger.info(f"=== エンゲージメントサイクル開始 ({self.account}) ===")
        logger.info(f"キーワード: {keywords}")

        # 1. ターゲット発見（これは最初に必ず実行）
        if discover:
            targets = self.discover_targets(keywords, limit_per_keyword=5)
            result["discovered"] = len(targets)

        # DBからターゲット取得
        all_targets = self.db.get_engagement_targets("x", self.account)

        # 2-5. アクションをランダム順で実行（人間は一種類を連続しない）
        actions_to_run = []
        if like:
            actions_to_run.append(("like", lambda: self.auto_like(
                keywords=keywords, targets=all_targets, max_likes=max_likes,
            )))
        if reply:
            actions_to_run.append(("reply", lambda: self.auto_reply(
                keywords=keywords, targets=all_targets, max_replies=max_replies,
            )))
        if follow:
            actions_to_run.append(("follow", lambda: self.auto_follow(
                targets=all_targets, max_follows=max_follows,
            )))
        if quote_rt:
            actions_to_run.append(("quote_rt", lambda: self.auto_quote_rt(
                keywords=keywords, targets=all_targets, max_quotes=max_quotes,
            )))

        random.shuffle(actions_to_run)
        action_key_map = {"like": "liked", "reply": "replied", "follow": "followed", "quote_rt": "quoted"}

        for action_name, action_fn in actions_to_run:
            logger.info(f"--- 次のアクション: {action_name} ---")
            result_key = action_key_map.get(action_name, action_name)
            try:
                result[result_key] = action_fn()
            except RuntimeError as e:
                logger.error(f"[致命的エラー] {action_name}: {e}")
                logger.error("ブラウザ接続に失敗。残りのアクションをスキップします")
                break
            except Exception as e:
                logger.error(f"[アクションエラー] {action_name}: {e}")
                result[result_key] = 0

        # 日次統計 + スコアサマリー
        result["stats"] = self.db.get_daily_stats("x", self.account)
        result["scores"] = self.db.get_daily_score_summary("x", self.account)

        logger.info(f"=== エンゲージメントサイクル完了 ===")
        logger.info(f"  発見: {result['discovered']}, いいね: {result['liked']}, "
                     f"リプライ: {result['replied']}, フォロー: {result['followed']}, "
                     f"引用RT: {result['quoted']}")
        scores = result["scores"]
        logger.info(f"  ターゲット適合: 平均{scores['target_avg_relevance']}点 "
                     f"(高適合:{scores['target_high']}件, 低適合:{scores['target_low']}件)")
        logger.info(f"  アクション品質: 平均{scores['action_avg_quality']}点")
        for atype, info in scores.get("action_scores_by_type", {}).items():
            logger.info(f"    {atype}: 平均{info['avg']}点 ({info['count']}件)")

        return result

    # === 初速ブースト（2アカウント相互エンゲージ） ===

    def boost_own_post(self, post_url: str, boost_platform: XTwitterPlatform) -> dict:
        """自投稿にもう1アカウントから即いいね+リプライでアルゴリズム初速を稼ぐ

        Args:
            post_url: ブースト対象の投稿URL
            boost_platform: もう1アカウントのXTwitterPlatformインスタンス

        Returns:
            {"liked": bool, "replied": bool, "reply_text": str}
        """
        result = {"liked": False, "replied": False, "reply_text": ""}

        logger.info(f"[初速ブースト] {post_url}")

        # いいね
        try:
            result["liked"] = boost_platform.like_post(post_url)
            if result["liked"]:
                logger.info("[ブースト] いいね成功")
            time.sleep(random.uniform(3, 8))
        except Exception as e:
            logger.error(f"[ブーストいいねエラー] {e}")

        # リプライ（会話成立 = +75の重み）
        try:
            reply_text = generate_reply(
                comment_text="（自投稿へのブーストリプライ）",
                author=self.x.username,
                persona=None,
                tone="同じチームのもう1アカウントとして、投稿に共感や補足をする自然なリプライ。宣伝臭ゼロ。2-3文。",
            )
            if reply_text:
                result["replied"] = boost_platform.reply_to_post(post_url, reply_text)
                result["reply_text"] = reply_text
                if result["replied"]:
                    logger.info(f"[ブースト] リプライ成功: {reply_text[:50]}...")
        except Exception as e:
            logger.error(f"[ブーストリプライエラー] {e}")

        return result

    # === スマートアンフォロー ===

    def smart_unfollow(self, max_unfollows: int = 30, days_inactive: int = 30) -> int:
        """フォローバックなし・非アクティブアカウントを自動アンフォロー

        Args:
            max_unfollows: 1回の実行での最大アンフォロー数
            days_inactive: この日数以上投稿なしのアカウントを対象

        Returns:
            アンフォローした件数
        """
        self._ensure_logged_in_wrapper()

        unfollowed = 0

        # フォロー中リストを取得
        self.x.driver.get(f"https://x.com/{self.x.username}/following")
        time.sleep(5)

        # スクロールしてフォロー中ユーザーを収集
        users = []
        seen = set()
        for _ in range(3):
            cells = self.x.driver.find_elements(By.CSS_SELECTOR, '[data-testid="UserCell"]')
            for cell in cells:
                try:
                    link = cell.find_element(By.CSS_SELECTOR, 'a[href^="/"]')
                    username = link.get_attribute("href").split("/")[-1]
                    if username and username not in seen:
                        seen.add(username)
                        users.append(username)
                except Exception:
                    continue
            self.x.driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
            time.sleep(3)

        logger.info(f"[アンフォロー] フォロー中: {len(users)}件を検査")

        for username in users:
            if unfollowed >= max_unfollows:
                break

            try:
                # プロフィール確認
                profile = self.x.get_user_profile(username)
                if not profile:
                    continue

                should_unfollow = False
                reason = ""

                # 条件1: フォロワー0でフォロー数が多い（スパム垢）
                if profile["followers"] == 0 and profile["following"] > 100:
                    should_unfollow = True
                    reason = "スパム疑い"

                # 条件2: 最新投稿チェック（非アクティブ）
                if not should_unfollow:
                    posts = self.x.get_user_posts(username, limit=1)
                    if not posts:
                        should_unfollow = True
                        reason = "投稿なし"

                if should_unfollow:
                    # アンフォロー実行
                    self.x.driver.get(f"https://x.com/{username}")
                    time.sleep(3)
                    try:
                        unfollow_btn = self.x.driver.find_element(
                            By.CSS_SELECTOR, '[data-testid$="-unfollow"]'
                        )
                        unfollow_btn.click()
                        time.sleep(1)
                        # 確認ダイアログ
                        confirm = WebDriverWait(self.x.driver, 5).until(
                            EC.element_to_be_clickable((By.CSS_SELECTOR, '[data-testid="confirmationSheetConfirm"]'))
                        )
                        confirm.click()
                        unfollowed += 1
                        logger.info(f"[アンフォロー] @{username} ({reason})")
                        self._human_delay()
                    except Exception:
                        pass

            except Exception as e:
                logger.warning(f"[アンフォローエラー] @{username}: {e}")

        logger.info(f"[アンフォロー完了] {unfollowed}/{max_unfollows}件")
        return unfollowed

    def _ensure_logged_in_wrapper(self):
        """x_platformのログイン状態を確認"""
        self.x._ensure_logged_in()

    # === エバーグリーンリサイクル ===

    def recycle_top_posts(self, min_likes: int = 5, max_recycles: int = 3) -> int:
        """過去に高エンゲージメントだった自分の投稿をリライトして再投稿

        Args:
            min_likes: 最低いいね数（この以上がリサイクル対象）
            max_recycles: 最大リサイクル数

        Returns:
            リサイクル投稿した件数
        """
        recycled = 0

        # 自分の過去投稿を取得
        try:
            my_posts = self.x.get_user_posts(self.x.username, limit=20)
        except Exception as e:
            logger.error(f"[リサイクル] 自投稿取得エラー: {e}")
            return 0

        # いいね数でフィルタ+ソート
        candidates = [p for p in my_posts if p.get("metrics", {}).get("likes", 0) >= min_likes]
        candidates.sort(key=lambda p: p.get("metrics", {}).get("likes", 0), reverse=True)

        if not candidates:
            logger.info("[リサイクル] 対象投稿なし")
            return 0

        # リライトして再投稿
        for post in candidates[:max_recycles]:
            if not self._check_rate_limit("reply"):
                break

            original_text = post.get("text", "")
            post_id = post.get("id", "")

            # 既にリサイクル済みかチェック
            if self.db.has_engaged_post(post_id, "recycle", self.account):
                continue

            try:
                rewritten = generate_reply(
                    comment_text=original_text,
                    author=self.x.username,
                    persona=None,
                    tone="以下の自分の過去投稿をリライトして。同じメッセージを別の表現で。元の投稿より良くする。140字以内。",
                )
                if not rewritten:
                    continue

                from platforms.base import Post
                result = self.x.post(Post(text=rewritten))
                if result is not None or True:  # post()はNone返すが成功する場合あり
                    self.db.save_engagement_action(
                        "x", "recycle", self.x.username, post_id,
                        post_text=original_text[:200], reply_text=rewritten,
                        account=self.account,
                    )
                    recycled += 1
                    logger.info(f"[リサイクル] 元: {original_text[:40]}... → 新: {rewritten[:40]}...")
                    self._human_delay()
            except Exception as e:
                logger.error(f"[リサイクルエラー] {e}")

        logger.info(f"[リサイクル完了] {recycled}/{max_recycles}件")
        return recycled
