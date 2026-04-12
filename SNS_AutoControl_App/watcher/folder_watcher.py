"""
フォルダ監視モジュール
images_to_post/ に画像が追加されたら検出し、投稿フローを開始する
"""
import os
import time
import shutil
import logging
from pathlib import Path

logger = logging.getLogger(__name__)

SUPPORTED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp"}


class FolderWatcher:
    """投稿画像フォルダを監視する"""

    def __init__(self, watch_dir: str, archive_dir: str):
        self.watch_dir = Path(watch_dir)
        self.archive_dir = Path(archive_dir)
        self.watch_dir.mkdir(parents=True, exist_ok=True)
        self.archive_dir.mkdir(parents=True, exist_ok=True)

    def get_new_images(self) -> list[Path]:
        """未処理の画像ファイルを取得"""
        images = []
        for f in self.watch_dir.iterdir():
            if f.is_file() and f.suffix.lower() in SUPPORTED_EXTENSIONS:
                images.append(f)
        return sorted(images, key=lambda f: f.stat().st_mtime)

    def archive_image(self, image_path: Path):
        """投稿済み画像をアーカイブフォルダに移動"""
        dest = self.archive_dir / image_path.name
        if dest.exists():
            # 重複名の場合はタイムスタンプ付与
            stem = image_path.stem
            suffix = image_path.suffix
            timestamp = int(time.time())
            dest = self.archive_dir / f"{stem}_{timestamp}{suffix}"
        shutil.move(str(image_path), str(dest))
        logger.info(f"Archived: {image_path.name} → {dest.name}")
