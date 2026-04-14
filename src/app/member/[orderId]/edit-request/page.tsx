"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";
import {
  Send, Check, Upload, FileText, Image, Type, Layout,
  Puzzle, MoreHorizontal, X, AlertCircle, Eye, Monitor,
  Smartphone, Tablet, MapPin, Bot, CalendarDays,
  Globe, Video, Download, Users, Newspaper, Share2,
  Pencil, Replace, Plus, Trash2, ArrowRight, ChevronDown,
  Crop, ZoomIn, RotateCw,
} from "lucide-react";
import { useMember } from "@/lib/member-context";
import { useSession } from "next-auth/react";

/* ═══════════════════════════════════════
   site.config.json → 編集UI用セクションに変換
   ═══════════════════════════════════════ */
interface TextItem { id: string; label: string; value: string; configPath: string }
interface ImageItem { id: string; label: string; current: string; aspect: number; aspectLabel: string }
interface SiteSection { id: string; label: string; texts: TextItem[]; images: ImageItem[] }

function buildSectionsFromConfig(config: Record<string, unknown>): SiteSection[] {
  const c = config.company as Record<string, string> || {};
  const strengths = (config.strengths || []) as { title: string; description: string }[];
  const projects = (config.projects || []) as { title: string }[];

  const sections: SiteSection[] = [
    {
      id: "hero", label: "トップ（ヒーロー）",
      texts: [
        { id: "hero-tagline", label: "キャッチコピー", value: c.tagline || "", configPath: "company.tagline" },
        { id: "hero-desc", label: "説明文", value: c.description || "", configPath: "company.description" },
      ],
      images: [{ id: "hero-bg", label: "メイン背景画像", current: "ヒーロー背景", aspect: 12 / 5, aspectLabel: "12:5（横長バナー）" }],
    },
    {
      id: "about", label: "会社案内",
      texts: [
        { id: "about-ceo", label: "代表挨拶", value: c.bio || "", configPath: "company.bio" },
        { id: "about-name", label: "会社名", value: c.name || "", configPath: "company.name" },
        { id: "about-address", label: "所在地", value: c.address || "", configPath: "company.address" },
        { id: "about-phone", label: "電話番号", value: c.phone || "", configPath: "company.phone" },
        { id: "about-hours", label: "営業時間", value: c.hours || "", configPath: "company.hours" },
      ],
      images: [{ id: "about-ceo-photo", label: "代表写真", current: "代表者の写真", aspect: 3 / 4, aspectLabel: "3:4（縦長）" }],
    },
  ];

  // 強みセクション
  if (strengths.length > 0) {
    sections.splice(1, 0, {
      id: "strength", label: "私たちの強み",
      texts: strengths.flatMap((s, i) => [
        { id: `str-${i}-title`, label: `強み${i + 1}タイトル`, value: s.title || "", configPath: `strengths.${i}.title` },
        { id: `str-${i}-desc`, label: `強み${i + 1}説明`, value: s.description || "", configPath: `strengths.${i}.description` },
      ]),
      images: [],
    });
  }

  // 施工実績の画像
  if (projects.length > 0) {
    sections.splice(1, 0, {
      id: "works", label: "施工実績",
      texts: [],
      images: projects.map((p, i) => ({
        id: `work-${i}`, label: p.title || `実績${i + 1}`, current: p.title || "", aspect: 16 / 9, aspectLabel: "16:9（横長）",
      })),
    });
  }

  return sections;
}

const FALLBACK_SECTIONS: SiteSection[] = [{
  id: "hero", label: "トップ（ヒーロー）",
  texts: [
    { id: "hero-tagline", label: "キャッチコピー", value: "（読み込み中）", configPath: "company.tagline" },
  ],
  images: [],
}];

const FEATURES_TO_ADD = [
  { id: "google-maps", label: "Google Maps", icon: MapPin, plan: "omakase" },
  { id: "blog", label: "ブログ/お知らせ", icon: Newspaper, plan: "omakase" },
  { id: "testimonials", label: "お客様の声", icon: Users, plan: "omakase" },
  { id: "chatbot", label: "AIチャットボット", icon: Bot, plan: "omakase-pro" },
  { id: "booking", label: "予約システム", icon: CalendarDays, plan: "omakase-pro" },
  { id: "recruit", label: "採用ページ", icon: Users, plan: "omakase-pro" },
  { id: "i18n", label: "多言語対応", icon: Globe, plan: "omakase-pro" },
  { id: "video", label: "動画セクション", icon: Video, plan: "omakase-pro" },
  { id: "pdf", label: "PDF資料DL", icon: Download, plan: "omakase-pro" },
];

const LAYOUT_ACTIONS = [
  { id: "move-up", label: "セクションを上に移動" },
  { id: "move-down", label: "セクションを下に移動" },
  { id: "change-cols", label: "カラム数を変更（2列↔3列）" },
  { id: "change-color", label: "背景色・アクセント色を変更" },
  { id: "change-font", label: "フォントサイズを変更" },
  { id: "add-section", label: "新しいセクションを追加" },
  { id: "remove-section", label: "セクションを削除" },
];

const FONT_FAMILIES = [
  { id: "gothic", label: "ゴシック体", sample: "Noto Sans JP", css: "'Noto Sans JP', sans-serif" },
  { id: "mincho", label: "明朝体", sample: "Noto Serif JP", css: "'Noto Serif JP', serif" },
  { id: "maru", label: "丸ゴシック", sample: "M PLUS Rounded 1c", css: "'M PLUS Rounded 1c', sans-serif" },
];

const FONT_SIZES = [
  { id: "sm", label: "小さめ", desc: "控えめで落ち着いた印象" },
  { id: "md", label: "標準", desc: "バランスの取れたサイズ" },
  { id: "lg", label: "大きめ", desc: "力強くインパクトのある印象" },
];

const FONT_WEIGHTS = [
  { id: "normal", label: "標準" },
  { id: "bold", label: "太字" },
];

const STYLE_SECTIONS = [
  { id: "all", label: "サイト全体" },
  { id: "hero-heading", label: "トップ — キャッチコピー" },
  { id: "hero-sub", label: "トップ — 説明文" },
  { id: "section-heading", label: "各セクション — 見出し" },
  { id: "body-text", label: "本文テキスト" },
  { id: "nav", label: "ナビゲーション" },
];

const CATEGORIES = [
  { id: "text", label: "テキストを変える", icon: Type, ready: true },
  { id: "style", label: "フォント・色を変える", icon: Pencil, ready: false },
  { id: "image", label: "画像を変える", icon: Image, ready: false },
  { id: "layout", label: "レイアウトを変える", icon: Layout, ready: false },
  { id: "feature", label: "機能を追加する", icon: Puzzle, ready: false },
  { id: "other", label: "その他", icon: MoreHorizontal, ready: false },
];

const MAX_FILE_SIZE = 5 * 1024 * 1024;

/* ═══════════════════════════════════════
   クロップユーティリティ
   ═══════════════════════════════════════ */
async function getCroppedBlob(imageSrc: string, crop: Area): Promise<Blob> {
  const image = new window.Image();
  image.src = imageSrc;
  await new Promise((resolve) => { image.onload = resolve; });

  const canvas = document.createElement("canvas");
  canvas.width = crop.width;
  canvas.height = crop.height;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(image, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob!), "image/jpeg", 0.92);
  });
}

/* ═══════════════════════════════════════
   画像クロップカード
   ═══════════════════════════════════════ */
function ImageCropCard({
  imageId, label, aspect, aspectLabel, onCropped, onRemove,
}: {
  imageId: string;
  label: string;
  aspect: number;
  aspectLabel: string;
  onCropped: (blob: Blob) => void;
  onRemove: () => void;
}) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState<Area | null>(null);
  const [cropped, setCropped] = useState(false);
  const [croppedPreview, setCroppedPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) { alert("5MB以下の画像をお使いください"); return; }
    const reader = new FileReader();
    reader.onload = () => { setImageSrc(reader.result as string); setCropped(false); setCroppedPreview(null); };
    reader.readAsDataURL(file);
  };

  const onCropComplete = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedArea(croppedPixels);
  }, []);

  const handleCrop = async () => {
    if (!imageSrc || !croppedArea) return;
    const blob = await getCroppedBlob(imageSrc, croppedArea);
    onCropped(blob);
    setCropped(true);
    setCroppedPreview(URL.createObjectURL(blob));
  };

  const handleReset = () => {
    setImageSrc(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCropped(false);
    setCroppedPreview(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <motion.div className="bg-white rounded-2xl border border-gray-100 p-5" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Crop className="w-4 h-4 text-purple-500" />
          <span className="text-sm text-gray-700 font-medium">{label}</span>
          <span className="text-[10px] text-gray-400 px-2 py-0.5 rounded-full bg-gray-50">推奨 {aspectLabel}</span>
        </div>
        <button type="button" onClick={onRemove} className="text-gray-300 hover:text-red-400 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <input ref={inputRef} type="file" accept="image/*" onChange={onFileSelect} className="hidden" />

      {!imageSrc ? (
        /* アップロード前 */
        <button type="button" onClick={() => inputRef.current?.click()} className="w-full flex flex-col items-center justify-center gap-2 py-8 rounded-xl border-2 border-dashed border-gray-200 text-gray-400 hover:border-purple-200 hover:text-purple-400 transition-all">
          <Upload className="w-6 h-6" />
          <span className="text-sm">クリックして画像を選択</span>
          <span className="text-[10px]">5MBまで / JPG, PNG, WebP</span>
        </button>
      ) : cropped && croppedPreview ? (
        /* クロップ完了 */
        <div>
          <div className="rounded-xl overflow-hidden border border-green-200 mb-3">
            <img src={croppedPreview} alt="クロップ結果" className="w-full" style={{ aspectRatio: aspect, objectFit: "cover" }} />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-green-500 text-xs font-medium">
              <Check className="w-4 h-4" /> トリミング完了
            </div>
            <button type="button" onClick={handleReset} className="flex items-center gap-1 text-gray-400 text-xs hover:text-gray-600 transition-colors">
              <RotateCw className="w-3 h-3" /> やり直す
            </button>
          </div>
        </div>
      ) : (
        /* クロップUI */
        <div>
          <div className="relative w-full rounded-xl overflow-hidden bg-gray-900" style={{ height: "250px" }}>
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              style={{
                containerStyle: { borderRadius: "12px" },
              }}
            />
          </div>

          {/* Zoom control */}
          <div className="flex items-center gap-3 mt-3 px-2">
            <ZoomIn className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="flex-1 accent-purple-500"
            />
            <span className="text-gray-400 text-xs w-10 text-right">{zoom.toFixed(1)}x</span>
          </div>

          <div className="flex gap-2 mt-3">
            <button type="button" onClick={handleReset} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-500 text-xs hover:bg-gray-50 transition-colors">
              別の画像を選ぶ
            </button>
            <button type="button" onClick={handleCrop} className="flex-1 py-2.5 rounded-xl bg-purple-500 text-white text-xs font-medium hover:bg-purple-600 transition-colors flex items-center justify-center gap-1">
              <Crop className="w-3.5 h-3.5" /> この範囲で確定
            </button>
          </div>

          <p className="text-gray-400 text-[10px] text-center mt-2">ドラッグで位置調整、スライダーでズーム</p>
        </div>
      )}
    </motion.div>
  );
}

/* ═══════════════════════════════════════
   Page
   ═══════════════════════════════════════ */
export default function EditRequestPage() {
  const params = useParams();
  const orderId = params.orderId as string;
  const { plan } = useMember();
  const { data: session } = useSession();

  // サイトデータ取得
  const [siteSections, setSiteSections] = useState<SiteSection[]>(FALLBACK_SECTIONS);
  const [siteLoading, setSiteLoading] = useState(true);
  const [siteError, setSiteError] = useState<string | null>(null);

  useEffect(() => {
    const email = session?.user?.email || "";
    if (!email) { setSiteLoading(false); setSiteError("ログインが必要です"); return; }

    fetch(`/api/site-content?orderId=${orderId}&email=${encodeURIComponent(email)}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data.config) {
          setSiteSections(buildSectionsFromConfig(data.config));
        } else if (data.error) {
          setSiteError(data.error);
        }
      })
      .catch((err) => {
        console.error("Failed to load site content:", err);
        setSiteError("サイトデータの読み込みに失敗しました");
      })
      .finally(() => setSiteLoading(false));
  }, [orderId]);

  const [categories, setCategories] = useState<Set<string>>(new Set());
  const toggleCategory = (id: string) => {
    setCategories((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string; editsRemaining?: number } | null>(null);
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");

  // テキスト変更
  const [selectedTexts, setSelectedTexts] = useState<Map<string, string>>(new Map());

  // 画像変更
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // スタイル（フォント・色）
  const [styleSection, setStyleSection] = useState<string | null>(null);
  const [styleFont, setStyleFont] = useState<string | null>(null);
  const [styleSize, setStyleSize] = useState<string | null>(null);
  const [styleWeight, setStyleWeight] = useState<string | null>(null);
  const [styleColor, setStyleColor] = useState("#333333");
  const [styleBgColor, setStyleBgColor] = useState<string | null>(null);

  // レイアウト
  const [selectedLayoutSection, setSelectedLayoutSection] = useState<string | null>(null);
  const [selectedLayoutActions, setSelectedLayoutActions] = useState<Set<string>>(new Set());
  const [layoutNote, setLayoutNote] = useState("");

  // 機能追加
  const [selectedFeatures, setSelectedFeatures] = useState<Set<string>>(new Set());
  const [featureNote, setFeatureNote] = useState("");

  // その他
  const [otherText, setOtherText] = useState("");

  // テキスト選択トグル
  const toggleText = (id: string) => {
    setSelectedTexts((prev) => {
      const next = new Map(prev);
      if (next.has(id)) next.delete(id);
      else next.set(id, "");
      return next;
    });
  };
  const updateTextValue = (id: string, value: string) => {
    setSelectedTexts((prev) => new Map(prev).set(id, value));
  };

  // 画像選択トグル
  const toggleImage = (id: string) => {
    setSelectedImages((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // ファイル
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setFileError(null);
    for (const file of Array.from(e.target.files)) {
      if (file.size > MAX_FILE_SIZE) { setFileError(`「${file.name}」は5MBを超えています。`); continue; }
      setFiles((prev) => [...prev, file]);
    }
    if (fileRef.current) fileRef.current.value = "";
  };

  const toggleLayoutAction = (id: string) => {
    setSelectedLayoutActions((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleFeature = (id: string) => {
    setSelectedFeatures((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  // バリデーション
  const canSubmit = () => {
    if (categories.size === 0) return false;
    // 選択したカテゴリのうち、少なくとも1つに内容があればOK
    if (categories.has("text") && selectedTexts.size > 0) return true;
    if (categories.has("style") && styleSection) return true;
    if (categories.has("image") && selectedImages.size > 0) return true;
    if (categories.has("layout") && selectedLayoutSection && selectedLayoutActions.size > 0) return true;
    if (categories.has("feature") && selectedFeatures.size > 0) return true;
    if (categories.has("other") && otherText.trim().length > 0) return true;
    return false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setSubmitResult(null);

    const email = session?.user?.email || "";
    if (!email) { setSubmitResult({ success: false, message: "ログインが必要です" }); setSubmitting(false); return; }

    // テキスト変更をAPIに送信
    const changes: { type: string; configPath: string; newValue: string }[] = [];
    for (const [textId, newValue] of selectedTexts) {
      if (!newValue.trim()) continue;
      // textIdからconfigPathを見つける
      const textItem = siteSections.flatMap((s) => s.texts).find((t) => t.id === textId);
      if (textItem?.configPath) {
        changes.push({ type: "text", configPath: textItem.configPath, newValue });
      }
    }

    if (changes.length === 0) {
      setSubmitResult({ success: false, message: "変更したいテキストを選んで、新しい内容を入力してください" });
      setSubmitting(false);
      return;
    }

    // 変更前と同じ値は除外
    const actualChanges = changes.filter((ch) => {
      const orig = siteSections.flatMap((s) => s.texts).find((t) => t.configPath === ch.configPath);
      return !orig || orig.value !== ch.newValue;
    });
    if (actualChanges.length === 0) {
      setSubmitResult({ success: false, message: "現在の値と同じです。変更したい箇所を修正してください" });
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/site-update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, email, changes: actualChanges }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSubmitResult({ success: false, message: data.error || "エラーが発生しました" });
      } else {
        setSubmitResult({ success: true, message: data.message || "変更を適用しました", editsRemaining: data.editsRemaining });
        setSubmitted(true);
      }
    } catch (err) {
      console.error("Submit failed:", err);
      setSubmitResult({ success: false, message: "通信エラーが発生しました" });
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-[600px] mx-auto">
        <motion.div className="bg-white rounded-2xl border border-gray-100 p-10 text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4"><Check className="w-8 h-8 text-green-500" /></div>
          <h2 className="text-gray-800 text-xl font-bold mb-2">
            {submitResult?.success ? "変更を適用しました" : "依頼を送信しました"}
          </h2>
          <p className="text-gray-500 text-sm mb-2">{submitResult?.message || "内容を確認のうえ、対応いたします。"}</p>
          {submitResult?.editsRemaining !== undefined && (
            <p className="text-purple-500 text-xs font-medium mb-2">今月の残り編集回数: {submitResult.editsRemaining}回</p>
          )}
          <p className="text-gray-400 text-xs mb-6">数分以内にサイトに反映されます。</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => { setSubmitted(false); setSubmitResult(null); setSelectedTexts(new Map()); setCategories(new Set()); }}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#e84393] via-[#6c5ce7] to-[#f39c12] text-white text-sm font-medium hover:opacity-90 text-center"
            >
              続けて編集する
            </button>
            <a href={`/member/${orderId}`} className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm hover:bg-gray-50 text-center">管理画面に戻る</a>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-gray-800 text-xl font-bold mb-1">サイト編集依頼</h2>
        <p className="text-gray-400 text-sm mb-6">何を変えたいですか？</p>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* ─── 左: フォーム ─── */}
        <div className="flex-1 min-w-0">
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* ステップ1: 何をしたい？（複数選択可） */}
            <motion.div className="bg-white rounded-2xl border border-gray-100 p-5" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
              <p className="text-xs text-purple-500 font-medium mb-1">STEP 1</p>
              <p className="text-gray-700 text-sm font-medium mb-3">何をしたいですか？（複数選択OK）</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const selected = categories.has(cat.id);
                  return (
                    <button key={cat.id} type="button"
                      onClick={() => cat.ready ? toggleCategory(cat.id) : undefined}
                      disabled={!cat.ready}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border text-center transition-all relative ${
                        !cat.ready ? "border-gray-100 text-gray-300 cursor-not-allowed opacity-60" :
                        selected ? "border-purple-300 bg-purple-50 text-purple-600" : "border-gray-100 text-gray-500 hover:border-purple-100"
                      }`}>
                      {!cat.ready && <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded text-[9px] bg-gray-100 text-gray-400 font-medium">準備中</span>}
                      {selected && cat.ready && <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center"><Check className="w-3 h-3 text-white" strokeWidth={3} /></div>}
                      <Icon className="w-5 h-5" strokeWidth={1.5} />
                      <span className="text-xs font-medium">{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>

            {/* ステップ2: 詳細（カテゴリ別） */}
            <AnimatePresence mode="popLayout">
              {/* ═══ テキスト変更 ═══ */}
              {categories.has("text") && (
                <motion.div key="text" className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <div>
                    <p className="text-xs text-purple-500 font-medium mb-0.5">STEP 2</p>
                    <p className="text-gray-700 text-sm font-medium">変更するテキストを選んでください</p>
                  </div>

                  {siteLoading ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="animate-pulse bg-gray-100 rounded-xl h-16" />
                      ))}
                    </div>
                  ) : siteError ? (
                    <div className="flex items-center gap-2 p-4 rounded-xl bg-red-50 border border-red-100 text-red-500 text-sm">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      {siteError}
                    </div>
                  ) : (
                    siteSections.filter((s) => s.texts.length > 0).map((section) => (
                      <div key={section.id}>
                        <p className="text-gray-700 text-sm font-medium mb-2">{section.label}</p>
                        <div className="space-y-1.5">
                          {section.texts.map((t) => {
                            const isSelected = selectedTexts.has(t.id);
                            const isLong = t.value.length > 60 || t.value.includes("\n");
                            const newValue = selectedTexts.get(t.id) || "";
                            const hasChange = isSelected && newValue.trim().length > 0 && newValue !== t.value;
                            return (
                              <div key={t.id}>
                                <button type="button" onClick={() => toggleText(t.id)}
                                  className={`w-full flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${isSelected ? "border-purple-200 bg-purple-50/50" : "border-gray-100 hover:border-purple-100"}`}>
                                  <div className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 mt-0.5 ${isSelected ? "bg-purple-500 border-purple-500" : "border-gray-300"}`}>
                                    {isSelected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs text-gray-400 mb-0.5">{t.label}</p>
                                    <p className={`text-sm ${isSelected ? "text-purple-700" : "text-gray-700"} ${isLong ? "line-clamp-2" : "truncate"}`}>
                                      {t.value || <span className="text-gray-300 italic">（未設定）</span>}
                                    </p>
                                  </div>
                                  <Pencil className={`w-3.5 h-3.5 flex-shrink-0 mt-1 ${isSelected ? "text-purple-400" : "text-gray-300"}`} />
                                </button>

                                <AnimatePresence>
                                  {isSelected && (
                                    <motion.div className="ml-8 mt-2 mb-2 space-y-2" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                                      {/* 現在値コピーボタン */}
                                      {t.value && !newValue && (
                                        <button
                                          type="button"
                                          onClick={() => updateTextValue(t.id, t.value)}
                                          className="text-purple-500 text-xs hover:text-purple-700 flex items-center gap-1"
                                        >
                                          <Replace className="w-3 h-3" /> 現在の値をコピーして編集
                                        </button>
                                      )}
                                      {/* 入力フィールド: 長文は textarea */}
                                      {isLong ? (
                                        <textarea
                                          value={newValue}
                                          onChange={(e) => updateTextValue(t.id, e.target.value)}
                                          placeholder="変更後のテキストを入力"
                                          rows={4}
                                          className="w-full px-4 py-2.5 rounded-lg bg-white border border-purple-200 text-gray-800 text-sm placeholder:text-gray-300 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 resize-y"
                                        />
                                      ) : (
                                        <input
                                          type="text"
                                          value={newValue}
                                          onChange={(e) => updateTextValue(t.id, e.target.value)}
                                          placeholder="変更後のテキストを入力"
                                          className="w-full px-4 py-2.5 rounded-lg bg-white border border-purple-200 text-gray-800 text-sm placeholder:text-gray-300 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                                        />
                                      )}
                                      {/* 変更プレビュー */}
                                      {hasChange && (
                                        <div className="rounded-lg bg-gray-50 border border-gray-100 p-3 text-xs space-y-1">
                                          <p className="text-gray-400 font-medium">変更プレビュー:</p>
                                          <p className="text-red-400 line-through">{t.value.length > 80 ? t.value.slice(0, 80) + "…" : t.value}</p>
                                          <p className="text-green-600">{newValue.length > 80 ? newValue.slice(0, 80) + "…" : newValue}</p>
                                        </div>
                                      )}
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))
                  )}
                </motion.div>
              )}

              {/* ═══ スタイル（フォント・色）変更 ═══ */}
              {categories.has("style") && (
                <motion.div key="style" className="bg-white rounded-2xl border border-gray-100 p-5 space-y-5" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <p className="text-xs text-purple-500 font-medium">STEP 2 — フォント・色の変更</p>

                  {/* 対象セクション */}
                  <div>
                    <p className="text-gray-700 text-sm font-medium mb-2">どこを変えますか？</p>
                    <div className="flex flex-wrap gap-2">
                      {STYLE_SECTIONS.map((s) => (
                        <button key={s.id} type="button" onClick={() => setStyleSection(s.id)}
                          className={`px-4 py-2 rounded-full text-xs transition-all ${styleSection === s.id ? "bg-purple-500 text-white" : "bg-gray-50 border border-gray-200 text-gray-600 hover:border-purple-200"}`}>
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {styleSection && (
                    <>
                      {/* フォントファミリー */}
                      <div>
                        <p className="text-gray-700 text-sm font-medium mb-2">フォント</p>
                        <div className="grid grid-cols-3 gap-2">
                          {FONT_FAMILIES.map((f) => (
                            <button key={f.id} type="button" onClick={() => setStyleFont(f.id)}
                              className={`p-3 rounded-xl border text-center transition-all ${styleFont === f.id ? "border-purple-300 bg-purple-50" : "border-gray-100 hover:border-purple-100"}`}>
                              <p className="text-lg mb-1" style={{ fontFamily: f.css }}>あいう</p>
                              <p className={`text-[10px] ${styleFont === f.id ? "text-purple-600 font-medium" : "text-gray-500"}`}>{f.label}</p>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* フォントサイズ */}
                      <div>
                        <p className="text-gray-700 text-sm font-medium mb-2">サイズ</p>
                        <div className="grid grid-cols-3 gap-2">
                          {FONT_SIZES.map((s) => (
                            <button key={s.id} type="button" onClick={() => setStyleSize(s.id)}
                              className={`p-3 rounded-xl border text-center transition-all ${styleSize === s.id ? "border-purple-300 bg-purple-50" : "border-gray-100 hover:border-purple-100"}`}>
                              <p className={`mb-1 text-gray-700 ${s.id === "sm" ? "text-sm" : s.id === "md" ? "text-base" : "text-xl"}`}>Aa</p>
                              <p className={`text-[10px] ${styleSize === s.id ? "text-purple-600 font-medium" : "text-gray-500"}`}>{s.label}</p>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* 太さ */}
                      <div>
                        <p className="text-gray-700 text-sm font-medium mb-2">太さ</p>
                        <div className="flex gap-2">
                          {FONT_WEIGHTS.map((w) => (
                            <button key={w.id} type="button" onClick={() => setStyleWeight(w.id)}
                              className={`flex-1 p-3 rounded-xl border text-center transition-all ${styleWeight === w.id ? "border-purple-300 bg-purple-50" : "border-gray-100 hover:border-purple-100"}`}>
                              <p className={`text-base text-gray-700 ${w.id === "bold" ? "font-bold" : "font-normal"}`}>テキスト</p>
                              <p className={`text-[10px] mt-1 ${styleWeight === w.id ? "text-purple-600 font-medium" : "text-gray-500"}`}>{w.label}</p>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* 文字色 */}
                      <div>
                        <p className="text-gray-700 text-sm font-medium mb-2">文字色</p>
                        <div className="flex items-center gap-3">
                          <div className="flex gap-1.5">
                            {["#333333", "#1B3A5C", "#3D3226", "#7BA23F", "#e84393", "#6c5ce7", "#f39c12", "#FFFFFF"].map((c) => (
                              <button key={c} type="button" onClick={() => setStyleColor(c)}
                                className={`w-8 h-8 rounded-lg border-2 transition-all ${styleColor === c ? "border-purple-500 scale-110" : "border-gray-200"}`}
                                style={{ backgroundColor: c }}
                              />
                            ))}
                          </div>
                          <div className="flex items-center gap-2 ml-2">
                            <input type="color" value={styleColor} onChange={(e) => setStyleColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0" />
                            <span className="text-gray-400 text-xs font-mono">{styleColor}</span>
                          </div>
                        </div>
                      </div>

                      {/* プレビュー */}
                      <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                        <p className="text-[10px] text-gray-400 mb-2">プレビュー</p>
                        <p
                          style={{
                            fontFamily: FONT_FAMILIES.find((f) => f.id === styleFont)?.css || "'Noto Sans JP', sans-serif",
                            fontSize: styleSize === "sm" ? "14px" : styleSize === "lg" ? "24px" : "18px",
                            fontWeight: styleWeight === "bold" ? 700 : 400,
                            color: styleColor,
                          }}
                        >
                          家族の暮らしに寄り添う家づくり
                        </p>
                      </div>
                    </>
                  )}
                </motion.div>
              )}

              {/* ═══ 画像変更（クロップUI付き） ═══ */}
              {categories.has("image") && (
                <motion.div key="image" className="space-y-4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
                    <p className="text-xs text-purple-500 font-medium">STEP 2 — 変更する画像を選んでください</p>

                    {siteSections.filter((s) => s.images.length > 0).map((section) => (
                      <div key={section.id}>
                        <p className="text-gray-700 text-sm font-medium mb-2">{section.label}</p>
                        <div className="grid grid-cols-2 gap-2">
                          {section.images.map((img) => {
                            const isSelected = selectedImages.has(img.id);
                            return (
                              <button key={img.id} type="button" onClick={() => toggleImage(img.id)}
                                className={`flex flex-col items-center gap-2 p-3 rounded-xl border text-center transition-all ${isSelected ? "border-purple-300 bg-purple-50" : "border-gray-100 hover:border-purple-100"}`}>
                                <div className={`w-full h-16 rounded-lg flex items-center justify-center ${isSelected ? "bg-purple-100" : "bg-gray-100"}`}>
                                  <Image className={`w-5 h-5 ${isSelected ? "text-purple-400" : "text-gray-300"}`} strokeWidth={1.5} />
                                </div>
                                <p className={`text-xs ${isSelected ? "text-purple-600 font-medium" : "text-gray-500"}`}>{img.label}</p>
                                <p className="text-[10px] text-gray-400">推奨: {img.aspectLabel}</p>
                                {isSelected && <span className="text-[10px] text-purple-400 font-medium">✓ 差替対象</span>}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 画像ごとにアップロード+クロップ */}
                  {Array.from(selectedImages).map((imgId) => {
                    const imgDef = siteSections.flatMap((s) => s.images).find((i) => i.id === imgId);
                    if (!imgDef) return null;
                    return (
                      <ImageCropCard
                        key={imgId}
                        imageId={imgId}
                        label={imgDef.label}
                        aspect={imgDef.aspect}
                        aspectLabel={imgDef.aspectLabel}
                        onCropped={(blob) => {
                          const file = new File([blob], `${imgId}.jpg`, { type: "image/jpeg" });
                          setFiles((prev) => [...prev.filter((f) => !f.name.startsWith(imgId)), file]);
                        }}
                        onRemove={() => {
                          toggleImage(imgId);
                          setFiles((prev) => prev.filter((f) => !f.name.startsWith(imgId)));
                        }}
                      />
                    );
                  })}
                </motion.div>
              )}

              {/* ═══ レイアウト変更 ═══ */}
              {categories.has("layout") && (
                <motion.div key="layout" className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <p className="text-xs text-purple-500 font-medium">STEP 2 — 対象セクションと変更内容を選んでください</p>

                  {/* セクション選択 */}
                  <div>
                    <p className="text-gray-700 text-sm font-medium mb-2">対象セクション</p>
                    <div className="flex flex-wrap gap-2">
                      {siteSections.map((s) => (
                        <button key={s.id} type="button" onClick={() => setSelectedLayoutSection(s.id)}
                          className={`px-4 py-2 rounded-full text-xs transition-all ${selectedLayoutSection === s.id ? "bg-purple-500 text-white" : "bg-gray-50 border border-gray-200 text-gray-600 hover:border-purple-200"}`}>
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* アクション選択 */}
                  {selectedLayoutSection && (
                    <div>
                      <p className="text-gray-700 text-sm font-medium mb-2">何をしますか？</p>
                      <div className="space-y-1.5">
                        {LAYOUT_ACTIONS.map((action) => {
                          const isSelected = selectedLayoutActions.has(action.id);
                          return (
                            <button key={action.id} type="button" onClick={() => toggleLayoutAction(action.id)}
                              className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${isSelected ? "border-purple-200 bg-purple-50/50" : "border-gray-100 hover:border-purple-100"}`}>
                              <div className={`w-5 h-5 rounded border flex items-center justify-center ${isSelected ? "bg-purple-500 border-purple-500" : "border-gray-300"}`}>
                                {isSelected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                              </div>
                              <span className={`text-sm ${isSelected ? "text-purple-700" : "text-gray-600"}`}>{action.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {selectedLayoutActions.size > 0 && (
                    <div>
                      <label className="block text-xs text-gray-500 mb-1.5 font-medium">補足（任意）</label>
                      <input type="text" value={layoutNote} onChange={(e) => setLayoutNote(e.target.value)} placeholder="例：3列表示にしたい、背景を白に" className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:border-purple-300" />
                    </div>
                  )}
                </motion.div>
              )}

              {/* ═══ 機能追加 ═══ */}
              {categories.has("feature") && (
                <motion.div key="feature" className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <p className="text-xs text-purple-500 font-medium">STEP 2 — 追加したい機能を選んでください</p>

                  <div className="grid grid-cols-2 gap-2">
                    {FEATURES_TO_ADD.map((f) => {
                      const Icon = f.icon;
                      const isSelected = selectedFeatures.has(f.id);
                      return (
                        <button key={f.id} type="button" onClick={() => toggleFeature(f.id)}
                          className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${isSelected ? "border-purple-200 bg-purple-50" : "border-gray-100 hover:border-purple-100"}`}>
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${isSelected ? "bg-purple-100" : "bg-gray-50"}`}>
                            <Icon className={`w-4 h-4 ${isSelected ? "text-purple-500" : "text-gray-400"}`} strokeWidth={1.5} />
                          </div>
                          <div>
                            <p className={`text-xs font-medium ${isSelected ? "text-purple-700" : "text-gray-600"}`}>{f.label}</p>
                            <p className="text-[10px] text-gray-400">{f.plan === "omakase" ? "おまかせ〜" : "おまかせプロ"}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {selectedFeatures.size > 0 && (
                    <div>
                      <label className="block text-xs text-gray-500 mb-1.5 font-medium">補足（任意）</label>
                      <input type="text" value={featureNote} onChange={(e) => setFeatureNote(e.target.value)} placeholder="例：チャットボットのFAQに「費用の目安」を入れてほしい" className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:border-purple-300" />
                    </div>
                  )}
                </motion.div>
              )}

              {/* ═══ その他 ═══ */}
              {categories.has("other") && (
                <motion.div key="other" className="bg-white rounded-2xl border border-gray-100 p-5" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <p className="text-xs text-purple-500 font-medium mb-3">STEP 2 — ご要望をお聞かせください</p>
                  <textarea value={otherText} onChange={(e) => setOtherText(e.target.value)} rows={5} className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:border-purple-300 resize-none" placeholder="参考サイトのURLや、やりたいことのイメージをできるだけ具体的にお書きください。" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* 送信 */}
            {categories.size > 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <button type="submit" disabled={!canSubmit() || submitting} className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-r from-[#e84393] via-[#6c5ce7] to-[#f39c12] text-white font-bold text-sm tracking-wider hover:opacity-90 transition-all shadow-lg shadow-purple-200/30 disabled:opacity-40 disabled:cursor-not-allowed">
                  <Send className="w-4 h-4" /> {submitting ? "送信中..." : "変更を送信する"}
                </button>
                {submitResult && !submitResult.success && (
                  <p className="text-red-500 text-xs text-center mt-2">{submitResult.message}</p>
                )}
                <p className="text-gray-400 text-xs text-center mt-3">テキスト変更は即座にサイトに反映されます</p>
              </motion.div>
            )}
          </form>
        </div>

        {/* ─── 右: サイトプレビュー ─── */}
        <motion.div className="lg:w-[440px] flex-shrink-0" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden sticky top-20">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2"><Eye className="w-4 h-4 text-purple-400" /><span className="text-gray-700 text-sm font-medium">現在のサイト</span></div>
              <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-0.5">
                {([["desktop", Monitor], ["tablet", Tablet], ["mobile", Smartphone]] as const).map(([id, Icon]) => (
                  <button key={id} onClick={() => setPreviewDevice(id)} className={`p-1.5 rounded-md transition-colors ${previewDevice === id ? "bg-white shadow-sm text-purple-500" : "text-gray-400"}`}><Icon className="w-3.5 h-3.5" strokeWidth={1.5} /></button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-2 bg-gray-50 border-b border-gray-100">
              <div className="flex gap-1"><div className="w-2 h-2 rounded-full bg-red-300" /><div className="w-2 h-2 rounded-full bg-yellow-300" /><div className="w-2 h-2 rounded-full bg-green-300" /></div>
              <div className="flex-1 mx-2 px-2 py-0.5 rounded bg-white border border-gray-200 text-[9px] text-gray-400 font-mono truncate">shikumiya-{orderId}.vercel.app</div>
            </div>
            <div className="flex justify-center bg-gray-100 p-2" style={{ minHeight: "400px" }}>
              <div style={{ width: "100%", maxWidth: "100%", transition: "width 0.3s" }}>
                <iframe
                  src="/portfolio-templates/warm-craft"
                  title="サイトプレビュー"
                  className="w-full border-0 bg-white rounded-sm"
                  style={{
                    transform: previewDevice === "desktop" ? "scale(0.55)" : previewDevice === "tablet" ? "scale(0.65)" : "scale(0.85)",
                    transformOrigin: "top center",
                    width: previewDevice === "desktop" ? "182%" : previewDevice === "tablet" ? "154%" : "118%",
                    height: previewDevice === "desktop" ? "910px" : previewDevice === "tablet" ? "770px" : "590px",
                    marginLeft: previewDevice === "desktop" ? "-41%" : previewDevice === "tablet" ? "-27%" : "-9%",
                  }}
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
