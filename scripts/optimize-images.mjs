import sharp from 'sharp';
import { readdir, stat, unlink } from 'fs/promises';
import { join } from 'path';

const dir = 'public/portfolio';
const MAX_WIDTH = 1920;
const QUALITY = 80;

const files = await readdir(dir);
const imageFiles = files.filter(f => /\.(jpg|jpeg|png)$/i.test(f));

// Only keep work_XX, hero-main, about, hero
const keep = imageFiles.filter(f =>
  f.startsWith('work_') || f === 'hero-main.jpeg' || f === 'about.jpeg' || f === 'hero.jpeg'
);

// Delete files we don't need
for (const f of imageFiles) {
  if (!keep.includes(f)) {
    await unlink(join(dir, f));
    console.log(`Deleted: ${f}`);
  }
}

// Optimize kept files
for (const f of keep) {
  const filepath = join(dir, f);
  const s = await stat(filepath);
  const ext = f.split('.').pop().toLowerCase();

  try {
    const img = sharp(filepath);
    const meta = await img.metadata();

    if (meta.width > MAX_WIDTH || s.size > 500_000) {
      const outPath = filepath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
      await img
        .resize({ width: Math.min(meta.width, MAX_WIDTH), withoutEnlargement: true })
        .webp({ quality: QUALITY })
        .toFile(outPath);

      const newStat = await stat(outPath);
      console.log(`${f} → ${f.replace(/\.(jpg|jpeg|png)$/i, '.webp')} (${(s.size/1024/1024).toFixed(1)}MB → ${(newStat.size/1024/1024).toFixed(1)}MB)`);

      // Delete original
      await unlink(filepath);
    } else {
      console.log(`${f} - OK (${(s.size/1024).toFixed(0)}KB)`);
    }
  } catch(e) {
    console.log(`Error processing ${f}: ${e.message}`);
  }
}
