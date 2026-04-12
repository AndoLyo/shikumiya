"""
Claude Code CLI 連携モジュール
Maxプランの範囲内でClaude品質のテキスト生成を行う（APIキー不要）
"""
import shutil
import subprocess
import logging

logger = logging.getLogger(__name__)


_recent_replies = []  # 直近のリプライ文を保持（重複防止用）

def generate_reply(comment_text: str, author: str, persona: str = None, tone: str = None) -> str | None:
    """
    コメントに対する返信をGemini APIで生成する

    Args:
        comment_text: 元コメントのテキスト
        author: コメント投稿者名
        persona: 返信キャラクター設定
        tone: トーン指定

    Returns:
        生成された返信テキスト or None（失敗時）
    """
    global _recent_replies
    if persona is None:
        persona = (
            "Lyo — AI画像生成歴3年のクリエイター。"
            "Stable Diffusionの144万行プロンプト集を作って250人以上に販売した実績がある。"
            "AI画像生成・プロンプト設計・ポートフォリオサイト構築に詳しい。"
            "初心者ではなく経験者。教える側の立場。"
        )
    if tone is None:
        tone = ""

    # 過去リプライとの重複防止
    avoid_block = ""
    if _recent_replies:
        avoid_block = "\n絶対に使うな（直近で使った表現）:\n"
        for r in _recent_replies[-5:]:
            avoid_block += f"- 「{r[:30]}」\n"

    prompt = f"""あなたは{persona}
以下のツイートに日本語でリプライしてください。

重要ルール:
- 経験者として、相手に役立つ情報や知見を短く返す
- 初対面の相手。丁寧語ベース（ですます調）だが堅すぎない
- 一人称は「自分」
- 1-2文で短く返す
- 相手の投稿内容に直接関連する具体的な返信だけ書く
- 自分の経験（3年間のAI画像生成、プロンプト設計等）に基づいた発言をする
- 毎回全く違う書き出し・表現にする

禁止:
- 初心者のフリ（「自分もまだよくわかってない」「始めたばかり」等）← Lyoは経験者
- タメ口（「マジで？」「すごくない？」等）← 初対面には失礼
- 「すごいですね！」「共感します！」等の定型リアクション
- emダッシュ（——）
- 導線誘導（「プロフに詳しく」等）
- 相手の投稿と無関係な内容
- 絵文字
{avoid_block}
{tone}

返信テキストのみを出力。説明・補足・引用記号・マークダウンは一切不要。

投稿者: @{author}
投稿: {comment_text}"""

    # Claude CLI優先、ハングしたらGeminiにフォールバック
    result = _call_claude_cli(prompt, timeout=30)
    if not result:
        logger.info("[フォールバック] Claude CLI失敗 → Gemini APIで生成")
        result = _call_gemini(prompt)
    if result:
        _recent_replies.append(result)
        if len(_recent_replies) > 10:
            _recent_replies.pop(0)
    return result


def generate_post_text(image_description: str, platform: str, note_url: str = None) -> str | None:
    """
    投稿テキストをClaude Code CLIで生成する

    Args:
        image_description: 画像の説明（またはテーマ）
        platform: 投稿先プラットフォーム（instagram/threads/x）
        note_url: note記事URLがあれば含める

    Returns:
        生成された投稿テキスト or None
    """
    platform_rules = {
        "instagram": "Instagram向け。ハッシュタグ5〜10個付き。キャプションは読みやすく改行多め。",
        "threads": "Threads向け。テキスト主体で簡潔に。ハッシュタグは3個以内。",
        "x": "X(Twitter)向け。140文字以内推奨。インパクトある一言＋ハッシュタグ2〜3個。",
    }

    note_line = ""
    if note_url:
        note_line = f"\n【note記事リンク】投稿内に自然な形で以下のリンクを含めてください: {note_url}"

    prompt = f"""以下の内容でSNS投稿テキストを作成してください。

【投稿者】Lyo（AIアート×自動化クリエイター）
【トーン】丁寧で親しみやすく、楽観的
【プラットフォーム】{platform_rules.get(platform, platform)}
【テーマ・画像内容】{image_description}
{note_line}

投稿テキストのみを出力してください。"""

    return _call_claude_cli(prompt)


def _call_claude_cli(prompt: str, timeout: int = 60) -> str | None:
    """
    Claude Code CLIを呼び出してテキストを生成する

    Args:
        prompt: プロンプト
        timeout: タイムアウト秒数

    Returns:
        生成されたテキスト or None
    """
    try:
        import os
        import tempfile

        cli_path = shutil.which("claude") or "claude"
        env = dict(os.environ)
        env.pop("CLAUDECODE", None)
        if "CLAUDE_CODE_GIT_BASH_PATH" not in env:
            env["CLAUDE_CODE_GIT_BASH_PATH"] = r"E:\Git\usr\bin\bash.exe"

        # プロンプトをstdinで渡す（引数が長すぎるとWindowsで切れる）
        result = subprocess.run(
            [cli_path, "-p", "-", "--output-format", "text"],
            input=prompt,
            capture_output=True,
            text=True,
            timeout=timeout,
            encoding="utf-8",
            env=env,
        )

        if result.returncode != 0:
            logger.error(f"Claude CLI error: {result.stderr}")
            return None

        output = result.stdout.strip()
        if not output:
            logger.warning("Claude CLI returned empty output")
            return None

        return output

    except subprocess.TimeoutExpired:
        logger.error(f"Claude CLI timed out after {timeout}s")
        return None
    except FileNotFoundError:
        logger.error("Claude CLI not found. Is it installed and in PATH?")
        return None
    except Exception as e:
        logger.error(f"Claude CLI unexpected error: {e}")
        return None


def _call_gemini(prompt: str, timeout: int = 30) -> str | None:
    """
    Gemini APIでテキストを生成する

    Args:
        prompt: プロンプト
        timeout: タイムアウト秒数（未使用、互換性のため）

    Returns:
        生成されたテキスト or None
    """
    try:
        import os
        import google.generativeai as genai

        # .envからAPIキーを読み込み
        env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), ".env")
        api_key = os.environ.get("GEMINI_API_KEY", "")
        if not api_key and os.path.exists(env_path):
            with open(env_path, "r", encoding="utf-8") as f:
                for line in f:
                    if line.strip().startswith("GEMINI_API_KEY="):
                        api_key = line.strip().split("=", 1)[1]
                        break

        if not api_key:
            # autonomous/.envも確認
            alt_env = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
                                   "..", "autonomous", ".env")
            if os.path.exists(alt_env):
                with open(alt_env, "r", encoding="utf-8") as f:
                    for line in f:
                        if line.strip().startswith("GEMINI_API_KEY="):
                            api_key = line.strip().split("=", 1)[1]
                            break

        if not api_key:
            logger.error("GEMINI_API_KEY not found")
            return None

        genai.configure(api_key=api_key)
        model = genai.GenerativeModel("gemini-2.0-flash")
        response = model.generate_content(prompt)

        if response and response.text:
            output = response.text.strip()
            # マークダウン記号を除去
            output = output.strip('"\'`')
            if output.startswith("```"):
                output = output.split("\n", 1)[-1].rsplit("```", 1)[0].strip()
            return output

        logger.warning("Gemini returned empty response")
        return None

    except Exception as e:
        logger.error(f"Gemini API error: {e}")
        return None
