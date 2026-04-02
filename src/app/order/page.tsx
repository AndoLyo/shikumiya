"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  User,
  Mail,
  Palette,
  Wrench,
  Layout,
  Type,
  FileText,
  Quote,
  ImagePlus,
  UserCircle,
  Share2,
  MessageSquare,
  CreditCard,
  Check,
  ChevronRight,
  ChevronLeft,
  Upload,
  X,
  ExternalLink,
  Sparkles,
  Shield,
} from "lucide-react";

// ─── Template Data ──────────────────────────────────────────
const templates = [
  { id: "cinematic-dark", name: "Cinematic Dark", desc: "没入感のあるフルスクリーン", colors: ["#0a0a1a", "#00bbdd", "#d42d83"] },
  { id: "minimal-grid", name: "Minimal Grid", desc: "作品を主役にするグリッド", colors: ["#f5f3ef", "#A28D69", "#2a2a2a"] },
  { id: "warm-natural", name: "Warm Natural", desc: "温かみのあるカード型", colors: ["#f2eee7", "#fffe3e", "#333333"] },
  { id: "horizontal-scroll", name: "Horizontal Scroll", desc: "横に流れるエディトリアル", colors: ["#0a0a0a", "#e63946", "#EFE8D7"] },
  { id: "elegant-mono", name: "Elegant Mono", desc: "ギャラリーのような空間", colors: ["#1a1a1a", "#00bbdd", "#d42d83"] },
  { id: "ai-art-portfolio", name: "AI Art Portfolio", desc: "AIアート特化の世界観", colors: ["#0a0a0f", "#6366f1", "#f59e0b"] },
  { id: "split-showcase", name: "Split Showcase", desc: "左右分割の構図美", colors: ["#111111", "#ff6b6b", "#4ecdc4"] },
  { id: "stack-cards", name: "Stack Cards", desc: "カードが重なるスクロール", colors: ["#0d0d0d", "#a855f7", "#ec4899"] },
  { id: "neo-brutalist", name: "Neo Brutalist", desc: "太字と原色のインパクト", colors: ["#fffbe6", "#ff5722", "#222222"] },
  { id: "glass-morphism", name: "Glass Morphism", desc: "透過グラスの近未来感", colors: ["#0f172a", "#38bdf8", "#818cf8"] },
];

const genreOptions = ["AIアート", "イラスト", "写真", "デザイン", "3D"];
const toolOptions = ["Midjourney", "Stable Diffusion", "DALL-E", "Flux", "ComfyUI", "NovelAI"];

// ─── Types ──────────────────────────────────────────────────
interface WorkImage {
  data: string;
  name: string;
  title: string;
}

interface ProfileImage {
  data: string;
  name: string;
}

// ─── Utility: file to base64 ────────────────────────────────
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ─── Shared Styles ──────────────────────────────────────────
const inputClass =
  "w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm placeholder:text-text-muted focus:border-primary/50 focus:outline-none transition-colors";
const labelClass = "block text-sm font-medium text-white mb-1";
const helpClass = "text-text-muted text-xs mt-1";

// ─── Step Indicator ─────────────────────────────────────────
function StepIndicator({ current }: { current: number }) {
  const steps = [
    { num: 1, label: "基本情報" },
    { num: 2, label: "サイト内容" },
    { num: 3, label: "確認・お支払い" },
  ];

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3">
      {steps.map((step, i) => {
        const isCompleted = step.num < current;
        const isActive = step.num === current;
        return (
          <div key={step.num} className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1.5">
              <span
                className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-colors ${
                  isActive
                    ? "bg-primary text-[#0a0a0f]"
                    : isCompleted
                    ? "bg-primary/20 text-primary"
                    : "bg-white/[0.06] text-text-muted"
                }`}
              >
                {isCompleted ? <Check className="w-3.5 h-3.5" /> : step.num}
              </span>
              <span
                className={`text-xs tracking-wider hidden sm:inline ${
                  isActive ? "text-primary" : isCompleted ? "text-primary/60" : "text-text-muted"
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <span className="text-text-muted/30 text-xs">→</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Slide animation variants ───────────────────────────────
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -80 : 80,
    opacity: 0,
  }),
};

// ═════════════════════════════════════════════════════════════
// Main Component
// ═════════════════════════════════════════════════════════════
export default function OrderPage() {
  // Step management
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);

  // Step 1 fields
  const [artistName, setArtistName] = useState("");
  const [siteTitle, setSiteTitle] = useState("");
  const [email, setEmail] = useState("");
  const [genres, setGenres] = useState<string[]>([]);
  const [genreOther, setGenreOther] = useState("");
  const [genreOtherChecked, setGenreOtherChecked] = useState(false);
  const [tools, setTools] = useState<string[]>([]);
  const [toolOther, setToolOther] = useState("");
  const [toolOtherChecked, setToolOtherChecked] = useState(false);

  // Step 2 fields
  const [template, setTemplate] = useState("");
  const [catchcopy, setCatchcopy] = useState("");
  const [bio, setBio] = useState("");
  const [motto, setMotto] = useState("");
  const [works, setWorks] = useState<WorkImage[]>([]);
  const [profileImage, setProfileImage] = useState<ProfileImage | null>(null);
  const [snsX, setSnsX] = useState("");
  const [snsInstagram, setSnsInstagram] = useState("");
  const [snsPixiv, setSnsPixiv] = useState("");
  const [snsNote, setSnsNote] = useState("");
  const [snsOther, setSnsOther] = useState("");
  const [requests, setRequests] = useState("");

  // Step 3 fields
  const [plan, setPlan] = useState<"template" | "omakase" | "">("");

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const worksInputRef = useRef<HTMLInputElement>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);

  // ─── Navigation ─────────────────────────────────────────
  const goNext = () => {
    setError("");
    if (step === 1) {
      if (!artistName.trim()) { setError("アーティスト名を入力してください"); return; }
      if (!email.trim()) { setError("メールアドレスを入力してください"); return; }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) { setError("メールアドレスの形式が正しくありません"); return; }
      const allGenres = [...genres, ...(genreOtherChecked && genreOther.trim() ? [genreOther.trim()] : [])];
      if (allGenres.length === 0) { setError("ジャンルを1つ以上選んでください"); return; }
    }
    if (step === 2) {
      if (!template) { setError("テンプレートを選んでください"); return; }
      if (works.length < 3) { setError("作品画像を3枚以上アップロードしてください"); return; }
    }
    setDirection(1);
    setStep((s) => Math.min(s + 1, 3));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goBack = () => {
    setError("");
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ─── Genre toggle ───────────────────────────────────────
  const toggleGenre = (g: string) => {
    setGenres((prev) => (prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]));
  };

  const toggleTool = (t: string) => {
    setTools((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  };

  // ─── Image handling ─────────────────────────────────────
  const handleWorkFiles = useCallback(async (files: FileList | null) => {
    if (!files) return;
    const remaining = 10 - works.length;
    const toProcess = Array.from(files).slice(0, remaining);
    const maxSize = 5 * 1024 * 1024;

    for (const file of toProcess) {
      if (file.size > maxSize) {
        setError(`${file.name} は5MBを超えています`);
        continue;
      }
      if (!file.type.match(/^image\/(jpeg|png|webp)$/)) {
        setError(`${file.name} はJPG/PNG/WebP形式ではありません`);
        continue;
      }
      const data = await fileToBase64(file);
      const idx = works.length + toProcess.indexOf(file) + 1;
      setWorks((prev) => [
        ...prev,
        { data, name: file.name, title: `作品 ${String(prev.length + 1).padStart(2, "0")}` },
      ]);
    }
  }, [works.length]);

  const removeWork = (idx: number) => {
    setWorks((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateWorkTitle = (idx: number, title: string) => {
    setWorks((prev) => prev.map((w, i) => (i === idx ? { ...w, title } : w)));
  };

  const handleProfileFile = useCallback(async (files: FileList | null) => {
    if (!files || !files[0]) return;
    const file = files[0];
    if (file.size > 5 * 1024 * 1024) { setError("プロフィール画像は5MBまでです"); return; }
    if (!file.type.match(/^image\/(jpeg|png|webp)$/)) { setError("JPG/PNG/WebP形式の画像を選択してください"); return; }
    const data = await fileToBase64(file);
    setProfileImage({ data, name: file.name });
  }, []);

  // ─── Drop handler factory ──────────────────────────────
  const onDrop = (handler: (files: FileList | null) => void) => (e: React.DragEvent) => {
    e.preventDefault();
    handler(e.dataTransfer.files);
  };

  const preventDefault = (e: React.DragEvent) => e.preventDefault();

  // ─── Submit ─────────────────────────────────────────────
  const handleSubmit = async () => {
    setError("");
    if (!plan) { setError("プランを選んでください"); return; }

    setIsSubmitting(true);

    const allGenres = [...genres, ...(genreOtherChecked && genreOther.trim() ? [genreOther.trim()] : [])];
    const allTools = [...tools, ...(toolOtherChecked && toolOther.trim() ? [toolOther.trim()] : [])];

    try {
      // Step 1: Upload images one by one to a Gist (avoid body size limit)
      let imageGistId = "";
      setError("画像をアップロード中...");

      for (let i = 0; i < works.length; i++) {
        const w = works[i];
        setError(`画像をアップロード中... (${i + 1}/${works.length})`);
        const uploadRes = await fetch("/api/upload-images", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            gistId: imageGistId || undefined,
            fileName: `work_${String(i + 1).padStart(2, "0")}`,
            imageData: w.data,
            orderId: `${artistName.trim()}-${Date.now()}`,
          }),
        });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadData.error || "画像アップロードに失敗しました");
        imageGistId = uploadData.gistId;
      }

      // Upload profile image if present
      if (profileImage) {
        setError("プロフィール画像をアップロード中...");
        const profileRes = await fetch("/api/upload-images", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            gistId: imageGistId || undefined,
            fileName: "profile",
            imageData: profileImage.data,
          }),
        });
        const profileData = await profileRes.json();
        if (!profileRes.ok) throw new Error(profileData.error || "プロフィール画像のアップロードに失敗しました");
        imageGistId = profileData.gistId;
      }

      setError("決済ページを準備中...");

      // Step 2: Send metadata (no images) to checkout
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          artistName: artistName.trim(),
          siteTitle: siteTitle.trim(),
          email: email.trim(),
          genres: allGenres,
          tools: allTools,
          template,
          catchcopy: catchcopy.trim(),
          bio: bio.trim(),
          motto: motto.trim(),
          worksMeta: works.map((w, i) => ({ name: `work_${String(i + 1).padStart(2, "0")}`, title: w.title })),
          hasProfileImage: !!profileImage,
          imageGistId,
          snsX: snsX.trim(),
          snsInstagram: snsInstagram.trim(),
          snsPixiv: snsPixiv.trim(),
          snsNote: snsNote.trim(),
          snsOther: snsOther.trim(),
          requests: requests.trim(),
          plan,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "エラーが発生しました");
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
      setIsSubmitting(false);
    }
  };

  // ═══════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════
  return (
    <main className="min-h-screen bg-[#0a0a0f] pt-12 pb-20">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(0,229,255,0.06),transparent)] pointer-events-none" />

      <div className="relative z-10 max-w-[800px] mx-auto px-4 sm:px-6">
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-text-muted text-xs tracking-wider hover:text-primary transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>しくみやに戻る</span>
          </Link>
        </motion.div>

        {/* Page title */}
        <motion.div
          className="mt-8 mb-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h1 className="font-serif text-white text-2xl sm:text-3xl font-bold tracking-wide">
            サイトを作る
          </h1>
          <div className="mt-6">
            <StepIndicator current={step} />
          </div>
        </motion.div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              className="mb-6 glass-card border-red-500/30 p-4 text-red-400 text-sm text-center"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step content with slide animation */}
        <AnimatePresence mode="wait" custom={direction}>
          {/* ═══════════════════════════════════════════ */}
          {/* STEP 1: 基本情報                           */}
          {/* ═══════════════════════════════════════════ */}
          {step === 1 && (
            <motion.div
              key="step1"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="space-y-8"
            >
              {/* Artist Name */}
              <section className="glass-card p-6 sm:p-8">
                <div className="flex items-center gap-2 mb-5">
                  <User className="w-4 h-4 text-primary" />
                  <h2 className="text-white text-sm font-bold tracking-wider">アーティスト名</h2>
                  <span className="text-red-400 text-xs">*必須</span>
                </div>
                <input
                  type="text"
                  value={artistName}
                  onChange={(e) => setArtistName(e.target.value)}
                  placeholder="例: Lyo"
                  className={inputClass}
                />
                <p className={helpClass}>サイトに表示される名前です（本名でもペンネームでもOK）</p>
              </section>

              {/* Site Title */}
              <section className="glass-card p-6 sm:p-8">
                <div className="flex items-center gap-2 mb-5">
                  <Layout className="w-4 h-4 text-primary" />
                  <h2 className="text-white text-sm font-bold tracking-wider">サイトタイトル</h2>
                </div>
                <input
                  type="text"
                  value={siteTitle}
                  onChange={(e) => setSiteTitle(e.target.value)}
                  placeholder="例: Lyo — AI Art Gallery"
                  className={inputClass}
                />
                <p className={helpClass}>ブラウザのタブに表示されます。空欄なら「アーティスト名 — Gallery」になります</p>
              </section>

              {/* Email */}
              <section className="glass-card p-6 sm:p-8">
                <div className="flex items-center gap-2 mb-5">
                  <Mail className="w-4 h-4 text-primary" />
                  <h2 className="text-white text-sm font-bold tracking-wider">メールアドレス</h2>
                  <span className="text-red-400 text-xs">*必須</span>
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="例: your-email@example.com"
                  className={inputClass}
                />
                <p className={helpClass}>完成通知をお送りします</p>
              </section>

              {/* Genres */}
              <section className="glass-card p-6 sm:p-8">
                <div className="flex items-center gap-2 mb-5">
                  <Palette className="w-4 h-4 text-primary" />
                  <h2 className="text-white text-sm font-bold tracking-wider">ジャンル（複数選択可）</h2>
                  <span className="text-red-400 text-xs">*1つ以上</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {genreOptions.map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => toggleGenre(g)}
                      className={`px-4 py-2 rounded-lg text-sm border transition-all duration-200 ${
                        genres.includes(g)
                          ? "bg-primary/10 border-primary/50 text-primary"
                          : "bg-white/[0.03] border-white/[0.08] text-text-secondary hover:border-white/20"
                      }`}
                    >
                      {genres.includes(g) && <Check className="w-3 h-3 inline mr-1" />}
                      {g}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setGenreOtherChecked(!genreOtherChecked)}
                    className={`px-4 py-2 rounded-lg text-sm border transition-all duration-200 ${
                      genreOtherChecked
                        ? "bg-primary/10 border-primary/50 text-primary"
                        : "bg-white/[0.03] border-white/[0.08] text-text-secondary hover:border-white/20"
                    }`}
                  >
                    {genreOtherChecked && <Check className="w-3 h-3 inline mr-1" />}
                    その他
                  </button>
                </div>
                {genreOtherChecked && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-3"
                  >
                    <input
                      type="text"
                      value={genreOther}
                      onChange={(e) => setGenreOther(e.target.value)}
                      placeholder="ジャンル名を入力"
                      className={inputClass}
                    />
                  </motion.div>
                )}
              </section>

              {/* Tools */}
              <section className="glass-card p-6 sm:p-8">
                <div className="flex items-center gap-2 mb-5">
                  <Wrench className="w-4 h-4 text-primary" />
                  <h2 className="text-white text-sm font-bold tracking-wider">使用ツール（複数選択可）</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {toolOptions.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => toggleTool(t)}
                      className={`px-4 py-2 rounded-lg text-sm border transition-all duration-200 ${
                        tools.includes(t)
                          ? "bg-primary/10 border-primary/50 text-primary"
                          : "bg-white/[0.03] border-white/[0.08] text-text-secondary hover:border-white/20"
                      }`}
                    >
                      {tools.includes(t) && <Check className="w-3 h-3 inline mr-1" />}
                      {t}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setToolOtherChecked(!toolOtherChecked)}
                    className={`px-4 py-2 rounded-lg text-sm border transition-all duration-200 ${
                      toolOtherChecked
                        ? "bg-primary/10 border-primary/50 text-primary"
                        : "bg-white/[0.03] border-white/[0.08] text-text-secondary hover:border-white/20"
                    }`}
                  >
                    {toolOtherChecked && <Check className="w-3 h-3 inline mr-1" />}
                    その他
                  </button>
                </div>
                {toolOtherChecked && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-3"
                  >
                    <input
                      type="text"
                      value={toolOther}
                      onChange={(e) => setToolOther(e.target.value)}
                      placeholder="ツール名を入力"
                      className={inputClass}
                    />
                  </motion.div>
                )}
              </section>

              {/* Next button */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={goNext}
                  className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-[#0a0a0f] font-bold text-sm tracking-wider hover:bg-primary/90 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
                >
                  次へ：サイト内容を入力
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* ═══════════════════════════════════════════ */}
          {/* STEP 2: サイト内容                          */}
          {/* ═══════════════════════════════════════════ */}
          {step === 2 && (
            <motion.div
              key="step2"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="space-y-8"
            >
              {/* Template Selection */}
              <section className="glass-card p-6 sm:p-8">
                <div className="flex items-center gap-2 mb-2">
                  <Layout className="w-4 h-4 text-primary" />
                  <h2 className="text-white text-sm font-bold tracking-wider">テンプレートを選んでください</h2>
                  <span className="text-red-400 text-xs">*必須</span>
                </div>
                <p className={`${helpClass} mb-5`}>クリックで選択、「デモを見る」で別タブでプレビューできます</p>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  {templates.map((tpl) => (
                    <div key={tpl.id} className="flex flex-col">
                      <button
                        type="button"
                        onClick={() => setTemplate(tpl.id)}
                        className={`group rounded-xl overflow-hidden border transition-all duration-300 text-left ${
                          template === tpl.id
                            ? "border-primary shadow-lg shadow-primary/10"
                            : "border-white/[0.06] hover:border-white/[0.15]"
                        }`}
                      >
                        {/* Live iframe preview */}
                        <div
                          className="h-24 sm:h-28 relative overflow-hidden"
                          style={{ background: tpl.colors[0] }}
                        >
                          <iframe
                            src={`/templates/${tpl.id}`}
                            className="absolute top-0 left-0 border-none pointer-events-none"
                            style={{
                              width: "1280px",
                              height: "800px",
                              transform: "scale(0.12)",
                              transformOrigin: "top left",
                            }}
                            tabIndex={-1}
                            loading="lazy"
                            title={tpl.name}
                          />
                          {template === tpl.id && (
                            <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                              <Check className="w-3 h-3 text-[#0a0a0f]" />
                            </div>
                          )}
                        </div>
                        <div className={`px-2.5 py-2 ${template === tpl.id ? "bg-primary/5" : "bg-[#0d0d15]"}`}>
                          <p className={`text-[10px] tracking-wider font-medium transition-colors ${
                            template === tpl.id ? "text-primary" : "text-text-secondary group-hover:text-white"
                          }`}>
                            {tpl.name}
                          </p>
                          <p className="text-[9px] text-text-muted mt-0.5 leading-tight">{tpl.desc}</p>
                        </div>
                      </button>
                      <a
                        href={`/templates/${tpl.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 flex items-center justify-center gap-1 text-[10px] text-text-muted hover:text-primary transition-colors"
                      >
                        デモを見る <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                  ))}
                </div>
              </section>

              {/* Catchcopy */}
              <section className="glass-card p-6 sm:p-8">
                <div className="flex items-center gap-2 mb-5">
                  <Type className="w-4 h-4 text-primary" />
                  <h2 className="text-white text-sm font-bold tracking-wider">キャッチコピー</h2>
                </div>
                <input
                  type="text"
                  value={catchcopy}
                  onChange={(e) => setCatchcopy(e.target.value)}
                  placeholder="例: 光と影で紡ぐ幻想世界"
                  className={inputClass}
                />
                <p className={helpClass}>サイトのトップに大きく表示されます。空欄なら「アーティスト名の作品」になります</p>
              </section>

              {/* Bio */}
              <section className="glass-card p-6 sm:p-8">
                <div className="flex items-center gap-2 mb-5">
                  <FileText className="w-4 h-4 text-primary" />
                  <h2 className="text-white text-sm font-bold tracking-wider">自己紹介文</h2>
                </div>
                <textarea
                  value={bio}
                  onChange={(e) => {
                    if (e.target.value.length <= 400) setBio(e.target.value);
                  }}
                  placeholder="例: AI画像生成を始めて3年。ファンタジーとサイバーパンクの世界観を中心に作品を制作しています。光の表現にこだわりがあります。"
                  rows={5}
                  className={`${inputClass} resize-none`}
                />
                <div className="flex justify-between mt-1">
                  <p className={helpClass}>あなたのことを教えてください。活動のきっかけ、こだわり、好きなテーマなど</p>
                  <span className={`text-xs ${bio.length > 380 ? "text-red-400" : "text-text-muted"}`}>
                    {bio.length}/400
                  </span>
                </div>
              </section>

              {/* Motto */}
              <section className="glass-card p-6 sm:p-8">
                <div className="flex items-center gap-2 mb-5">
                  <Quote className="w-4 h-4 text-primary" />
                  <h2 className="text-white text-sm font-bold tracking-wider">好きな言葉・モットー</h2>
                </div>
                <input
                  type="text"
                  value={motto}
                  onChange={(e) => setMotto(e.target.value)}
                  placeholder="例: 想像の先にある世界を描く"
                  className={inputClass}
                />
                <p className={helpClass}>About欄に引用として表示されます</p>
              </section>

              {/* Works Upload */}
              <section className="glass-card p-6 sm:p-8">
                <div className="flex items-center gap-2 mb-2">
                  <ImagePlus className="w-4 h-4 text-primary" />
                  <h2 className="text-white text-sm font-bold tracking-wider">作品画像（3〜10枚）</h2>
                  <span className="text-red-400 text-xs">*必須</span>
                </div>
                <p className={`${helpClass} mb-5`}>ギャラリーに表示されます。JPG / PNG / WebP、1枚5MBまで</p>

                {/* Drop zone */}
                {works.length < 10 && (
                  <div
                    onDrop={onDrop(handleWorkFiles)}
                    onDragOver={preventDefault}
                    onClick={() => worksInputRef.current?.click()}
                    className="border-2 border-dashed border-white/[0.1] rounded-xl p-8 text-center hover:border-primary/30 transition-colors cursor-pointer"
                  >
                    <Upload className="w-8 h-8 text-text-muted mx-auto mb-3" />
                    <p className="text-text-secondary text-sm">ドラッグ&ドロップ、またはクリックして選択</p>
                    <p className="text-text-muted text-xs mt-1">{works.length}/10枚</p>
                    <input
                      ref={worksInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      multiple
                      onChange={(e) => handleWorkFiles(e.target.files)}
                      className="hidden"
                    />
                  </div>
                )}

                {/* Thumbnails */}
                {works.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {works.map((w, i) => (
                      <div key={i} className="relative group">
                        <div className="aspect-square rounded-lg overflow-hidden bg-white/[0.03] border border-white/[0.08]">
                          <img src={w.data} alt={w.title} className="w-full h-full object-cover" />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeWork(i)}
                          className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        <input
                          type="text"
                          value={w.title}
                          onChange={(e) => updateWorkTitle(i, e.target.value)}
                          placeholder={`作品 ${String(i + 1).padStart(2, "0")}`}
                          className="mt-1.5 w-full bg-transparent border-b border-white/[0.08] text-white text-xs py-1 focus:border-primary/50 focus:outline-none transition-colors placeholder:text-text-muted"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Profile Image */}
              <section className="glass-card p-6 sm:p-8">
                <div className="flex items-center gap-2 mb-2">
                  <UserCircle className="w-4 h-4 text-primary" />
                  <h2 className="text-white text-sm font-bold tracking-wider">プロフィール画像</h2>
                </div>
                <p className={`${helpClass} mb-5`}>About欄に表示されます。未設定でもOK</p>

                {!profileImage ? (
                  <div
                    onDrop={onDrop(handleProfileFile)}
                    onDragOver={preventDefault}
                    onClick={() => profileInputRef.current?.click()}
                    className="border-2 border-dashed border-white/[0.1] rounded-xl p-6 text-center hover:border-primary/30 transition-colors cursor-pointer max-w-[240px]"
                  >
                    <Upload className="w-6 h-6 text-text-muted mx-auto mb-2" />
                    <p className="text-text-secondary text-xs">クリックまたはドロップ</p>
                    <input
                      ref={profileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={(e) => handleProfileFile(e.target.files)}
                      className="hidden"
                    />
                  </div>
                ) : (
                  <div className="relative group inline-block">
                    <div className="w-24 h-24 rounded-full overflow-hidden border border-white/[0.08]">
                      <img src={profileImage.data} alt="Profile" className="w-full h-full object-cover" />
                    </div>
                    <button
                      type="button"
                      onClick={() => setProfileImage(null)}
                      className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </section>

              {/* SNS Links */}
              <section className="glass-card p-6 sm:p-8">
                <div className="flex items-center gap-2 mb-2">
                  <Share2 className="w-4 h-4 text-primary" />
                  <h2 className="text-white text-sm font-bold tracking-wider">SNSリンク</h2>
                </div>
                <p className={`${helpClass} mb-5`}>サイトのContactセクションに表示されます</p>

                <div className="space-y-4">
                  {[
                    { label: "X (Twitter)", value: snsX, set: setSnsX, placeholder: "https://x.com/your_handle" },
                    { label: "Instagram", value: snsInstagram, set: setSnsInstagram, placeholder: "https://instagram.com/your_handle" },
                    { label: "Pixiv", value: snsPixiv, set: setSnsPixiv, placeholder: "https://pixiv.net/users/your_id" },
                    { label: "note", value: snsNote, set: setSnsNote, placeholder: "https://note.com/your_id" },
                    { label: "その他", value: snsOther, set: setSnsOther, placeholder: "https://..." },
                  ].map((sns) => (
                    <div key={sns.label} className="flex items-center gap-3">
                      <span className="text-text-muted text-xs w-20 shrink-0 text-right tracking-wider">
                        {sns.label}
                      </span>
                      <input
                        type="text"
                        value={sns.value}
                        onChange={(e) => sns.set(e.target.value)}
                        placeholder={sns.placeholder}
                        className={inputClass}
                      />
                    </div>
                  ))}
                </div>
              </section>

              {/* Requests */}
              <section className="glass-card p-6 sm:p-8">
                <div className="flex items-center gap-2 mb-5">
                  <MessageSquare className="w-4 h-4 text-primary" />
                  <h2 className="text-white text-sm font-bold tracking-wider">ご要望・備考</h2>
                </div>
                <textarea
                  value={requests}
                  onChange={(e) => setRequests(e.target.value)}
                  placeholder="例: 青と紫を基調にしてほしい、参考にしたいサイトがある、等"
                  rows={4}
                  className={`${inputClass} resize-none`}
                />
                <p className={helpClass}>色の好み、参考サイト、特別なリクエストなど自由にお書きください</p>
              </section>

              {/* Navigation buttons */}
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={goBack}
                  className="flex items-center gap-2 px-6 py-3.5 rounded-xl border border-white/[0.08] text-text-secondary text-sm tracking-wider hover:border-white/20 hover:text-white transition-all duration-300"
                >
                  <ChevronLeft className="w-4 h-4" />
                  戻る
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-[#0a0a0f] font-bold text-sm tracking-wider hover:bg-primary/90 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
                >
                  次へ：確認画面
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* ═══════════════════════════════════════════ */}
          {/* STEP 3: 確認・お支払い                       */}
          {/* ═══════════════════════════════════════════ */}
          {step === 3 && (
            <motion.div
              key="step3"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="space-y-8"
            >
              {/* Summary */}
              <section className="glass-card p-6 sm:p-8">
                <h2 className="text-white text-sm font-bold tracking-wider mb-6 flex items-center gap-2">
                  <span className="w-1 h-4 bg-primary rounded-full" />
                  入力内容の確認
                </h2>

                <div className="space-y-4 text-sm">
                  {/* Basic info summary */}
                  <SummaryRow label="アーティスト名" value={artistName} />
                  {siteTitle && <SummaryRow label="サイトタイトル" value={siteTitle} />}
                  <SummaryRow label="メールアドレス" value={email} />
                  <SummaryRow
                    label="ジャンル"
                    value={[...genres, ...(genreOtherChecked && genreOther.trim() ? [genreOther.trim()] : [])].join("、")}
                  />
                  {(tools.length > 0 || (toolOtherChecked && toolOther.trim())) && (
                    <SummaryRow
                      label="使用ツール"
                      value={[...tools, ...(toolOtherChecked && toolOther.trim() ? [toolOther.trim()] : [])].join("、")}
                    />
                  )}

                  <div className="border-t border-white/[0.06] my-4" />

                  {/* Site content summary */}
                  <SummaryRow
                    label="テンプレート"
                    value={templates.find((t) => t.id === template)?.name || template}
                  />
                  {catchcopy && <SummaryRow label="キャッチコピー" value={catchcopy} />}
                  {bio && <SummaryRow label="自己紹介文" value={bio} />}
                  {motto && <SummaryRow label="モットー" value={motto} />}

                  {/* Works thumbnails */}
                  <div>
                    <span className="text-text-muted text-xs block mb-2">作品画像（{works.length}枚）</span>
                    <div className="flex flex-wrap gap-2">
                      {works.map((w, i) => (
                        <div key={i} className="w-16 h-16 rounded-lg overflow-hidden border border-white/[0.08]">
                          <img src={w.data} alt={w.title} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {profileImage && (
                    <div>
                      <span className="text-text-muted text-xs block mb-2">プロフィール画像</span>
                      <div className="w-12 h-12 rounded-full overflow-hidden border border-white/[0.08]">
                        <img src={profileImage.data} alt="Profile" className="w-full h-full object-cover" />
                      </div>
                    </div>
                  )}

                  {/* SNS */}
                  {(snsX || snsInstagram || snsPixiv || snsNote || snsOther) && (
                    <>
                      <div className="border-t border-white/[0.06] my-4" />
                      {snsX && <SummaryRow label="X" value={snsX} />}
                      {snsInstagram && <SummaryRow label="Instagram" value={snsInstagram} />}
                      {snsPixiv && <SummaryRow label="Pixiv" value={snsPixiv} />}
                      {snsNote && <SummaryRow label="note" value={snsNote} />}
                      {snsOther && <SummaryRow label="その他" value={snsOther} />}
                    </>
                  )}

                  {requests && (
                    <>
                      <div className="border-t border-white/[0.06] my-4" />
                      <SummaryRow label="ご要望・備考" value={requests} />
                    </>
                  )}
                </div>

                <button
                  type="button"
                  onClick={goBack}
                  className="mt-6 flex items-center gap-2 text-text-muted text-xs hover:text-primary transition-colors"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  修正する
                </button>
              </section>

              {/* Plan Selection */}
              <section className="glass-card p-6 sm:p-8">
                <div className="flex items-center gap-2 mb-6">
                  <CreditCard className="w-4 h-4 text-primary" />
                  <h2 className="text-white text-sm font-bold tracking-wider">プラン選択</h2>
                  <span className="text-red-400 text-xs">*必須</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Template Plan */}
                  <button
                    type="button"
                    onClick={() => setPlan("template")}
                    className={`text-left rounded-xl border p-5 transition-all duration-300 ${
                      plan === "template"
                        ? "border-primary bg-primary/[0.03] shadow-lg shadow-primary/5"
                        : "border-white/[0.08] bg-white/[0.02] hover:border-white/[0.15]"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-white text-sm font-bold tracking-wide">テンプレートプラン</span>
                      <span
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                          plan === "template" ? "border-primary bg-primary" : "border-white/20"
                        }`}
                      >
                        {plan === "template" && <Check className="w-3 h-3 text-[#0a0a0f]" />}
                      </span>
                    </div>
                    <p className="text-primary text-2xl font-bold">
                      ¥980
                      <span className="text-text-muted text-xs font-normal ml-1">買い切り</span>
                    </p>
                    <p className="mt-3 text-text-muted text-xs leading-relaxed">
                      テンプレートから選んでサイトを作成。初回1回のみ編集可能
                    </p>
                  </button>

                  {/* Omakase Plan */}
                  <button
                    type="button"
                    onClick={() => setPlan("omakase")}
                    className={`text-left rounded-xl border p-5 transition-all duration-300 relative overflow-hidden ${
                      plan === "omakase"
                        ? "border-primary bg-primary/[0.03] shadow-lg shadow-primary/5"
                        : "border-white/[0.08] bg-white/[0.02] hover:border-white/[0.15]"
                    }`}
                  >
                    <span className="absolute top-0 right-0 bg-primary text-[#0a0a0f] text-[9px] font-bold tracking-widest px-2.5 py-0.5 rounded-bl-lg flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5" />
                      おすすめ
                    </span>
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-white text-sm font-bold tracking-wide">おまかせプラン</span>
                      <span
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                          plan === "omakase" ? "border-primary bg-primary" : "border-white/20"
                        }`}
                      >
                        {plan === "omakase" && <Check className="w-3 h-3 text-[#0a0a0f]" />}
                      </span>
                    </div>
                    <p className="text-primary text-2xl font-bold">
                      ¥2,980
                      <span className="text-text-muted text-xs font-normal ml-1">/月</span>
                    </p>
                    <p className="mt-3 text-text-muted text-xs leading-relaxed">
                      独自ドメイン・カスタマイズ月3回・会員コンテンツ付き
                    </p>
                    <p className="mt-2 text-primary/70 text-[11px]">
                      ¥980プランから1ヶ月以内のアップグレードで初月¥980引き
                    </p>
                  </button>
                </div>
              </section>

              {/* Submit */}
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting || !plan}
                  className="w-full py-4 rounded-xl bg-primary text-[#0a0a0f] font-bold text-sm tracking-wider hover:bg-primary/90 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-[#0a0a0f]/30 border-t-[#0a0a0f] rounded-full animate-spin" />
                      処理中...
                    </span>
                  ) : (
                    "お支払いへ進む"
                  )}
                </button>
                <p className="text-center text-text-muted text-[11px] tracking-wide flex items-center justify-center gap-1">
                  <Shield className="w-3 h-3" />
                  Stripeの安全な決済ページに移動します
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

// ─── Summary Row Component ──────────────────────────────────
function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4">
      <span className="text-text-muted text-xs shrink-0 sm:w-32 sm:text-right">{label}</span>
      <span className="text-text-secondary text-sm break-all">{value}</span>
    </div>
  );
}
