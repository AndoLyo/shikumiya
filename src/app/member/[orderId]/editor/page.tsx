"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Eye, Pencil, Bot, Smartphone, Monitor,
  Check, Loader2, Camera, Lock, ArrowRight,
  ChevronRight,
} from "lucide-react";

/* ═══════════════════════════════════════
   仮実装 v3: 手動編集 + AI質問フロー + Before/After
   - 手動編集: サイト上でクリックしてその場で編集（AIボタンなし）
   - AIタブ: 質問5問 → AI生成 → Before/After比較 → 承認
   ═══════════════════════════════════════ */

const C = {
  purple: "#6c5ce7",
  purpleLight: "#a29bfe",
  purpleBg: "rgba(108, 92, 231, 0.06)",
  pink: "#e84393",
  gold: "#f39c12",
  bg: "#f5f5f5",
  card: "#ffffff",
  border: "#e8e8e8",
  text: "#222",
  textSub: "#777",
  textMuted: "#bbb",
};

type DemoPlan = "otameshi" | "omakase" | "omakase-pro";

interface FieldChange {
  fieldId: string;
  label: string;
  oldValue: string;
  newValue: string;
}

/* ═══════════════════════════════════════
   AI質問データ
   ═══════════════════════════════════════ */
const AI_QUESTIONS = [
  {
    id: "impression",
    question: "サイトを見た人に、どんな印象を持ってほしいですか？",
    type: "select" as const,
    options: [
      "信頼感のある・安心できる",
      "親しみやすい・話しかけやすい",
      "洗練された・プロフェッショナル",
      "力強い・頼れる",
      "温かみのある・アットホーム",
      "モダンで先進的",
    ],
    freeInputPlaceholder: "その他（自由に書いてください）",
  },
  {
    id: "strength",
    question: "一番伝えたいことは何ですか？",
    type: "select" as const,
    options: [
      "実績の豊富さ（施工件数・年数）",
      "技術力の高さ（資格・専門性）",
      "お客様との距離の近さ（丁寧な対応）",
      "価格の手頃さ（コストパフォーマンス）",
      "地域に根ざしている安心感",
      "デザイン力・提案力",
      "アフターサポートの手厚さ",
    ],
    freeInputPlaceholder: "その他（自由に書いてください）",
  },
  {
    id: "target",
    question: "どんなお客様に来てほしいですか？",
    type: "select" as const,
    options: [
      "新築を考えている家族",
      "リフォーム・リノベーションしたい方",
      "法人・オフィス・店舗",
      "初めて家を建てる若い世代",
      "二世帯住宅を検討中の方",
      "幅広く、すべてのお客様",
    ],
    freeInputPlaceholder: "その他（自由に書いてください）",
  },
  {
    id: "tone",
    question: "文章のトーンはどれが近いですか？",
    type: "select" as const,
    options: [
      "丁寧語で堅すぎない（「〜します」「〜です」）",
      "少しくだけた親しみやすい口調",
      "格式のある落ち着いた文体",
      "簡潔でシンプルに",
    ],
    freeInputPlaceholder: "その他（自由に書いてください）",
  },
  {
    id: "avoid",
    question: "避けたい表現や、やめてほしいことはありますか？",
    type: "text" as const,
    placeholder: "例: 安さだけをアピールしないでほしい、堅すぎる表現は避けたい",
  },
  {
    id: "keywords",
    question: "サイトに入れたい言葉やこだわりがあれば教えてください",
    type: "text" as const,
    placeholder: "例: 地域密着、自然素材、笑顔、家族の安心、手仕事",
  },
];

/* ═══════════════════════════════════════
   メインページ
   ═══════════════════════════════════════ */
export default function EditorPage() {
  const [mode, setMode] = useState<"view" | "edit" | "ai">("edit");
  const [device, setDevice] = useState<"mobile" | "desktop">("mobile");
  const [plan] = useState<DemoPlan>("omakase");

  // 手動編集
  const [activeFieldId, setActiveFieldId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [changes, setChanges] = useState<FieldChange[]>([]);
  const [confirming, setConfirming] = useState(false);
  const [applying, setApplying] = useState(false);
  const [done, setDone] = useState(false);

  // AI質問フロー
  const [aiStep, setAiStep] = useState(0); // 0 = 未開始, 1-5 = 質問中, 6 = 生成中, 7 = Before/After
  const [aiAnswers, setAiAnswers] = useState<Record<string, string>>({});
  const [aiSuggestions, setAiSuggestions] = useState<{ field: string; before: string; after: string }[]>([]);
  const [aiApplying, setAiApplying] = useState(false);
  const [aiDone, setAiDone] = useState(false);

  // 仮データ
  const [liveData, setLiveData] = useState({
    tagline: "家族の暮らしに寄り添う家づくり",
    description: "東京・世田谷で30年。地域に根ざした家づくり。",
    ceoName: "山田 太郎",
    bio: "創業30年、地域の皆さまに支えられてまいりました。お客様の「こんな家に住みたい」という想いを、確かな技術でかたちにします。",
    phone: "03-1234-5678",
    address: "東京都世田谷区〇〇 1-2-3",
    hours: "9:00〜18:00（日曜・祝日定休）",
  });

  const getFieldValue = useCallback((fieldId: string) => {
    const change = changes.find((c) => c.fieldId === fieldId);
    if (change) return change.newValue;
    return liveData[fieldId as keyof typeof liveData] || "";
  }, [changes, liveData]);

  const saveChange = useCallback((fieldId: string, label: string, oldValue: string, newValue: string) => {
    if (oldValue === newValue) return;
    setChanges((prev) => {
      const idx = prev.findIndex((c) => c.fieldId === fieldId);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { fieldId, label, oldValue, newValue };
        return next;
      }
      return [...prev, { fieldId, label, oldValue, newValue }];
    });
  }, []);

  const startEdit = useCallback((fieldId: string) => {
    setActiveFieldId(fieldId);
    setEditText(getFieldValue(fieldId));
  }, [getFieldValue]);

  const cancelEdit = useCallback(() => {
    setActiveFieldId(null);
    setEditText("");
  }, []);

  const confirmEdit = useCallback((fieldId: string, label: string, original: string) => {
    saveChange(fieldId, label, original, editText);
    setActiveFieldId(null);
    setEditText("");
  }, [editText, saveChange]);

  const handleManualConfirm = useCallback(() => {
    setApplying(true);
    setTimeout(() => {
      setApplying(false);
      setDone(true);
      setLiveData((prev) => {
        const next = { ...prev };
        for (const c of changes) {
          if (c.fieldId in next) (next as Record<string, string>)[c.fieldId] = c.newValue;
        }
        return next;
      });
    }, 2000);
  }, [changes]);

  const resetManual = useCallback(() => {
    setChanges([]);
    setConfirming(false);
    setApplying(false);
    setDone(false);
    setActiveFieldId(null);
  }, []);

  // AI関連
  const handleAiAnswer = useCallback((questionId: string, answer: string) => {
    setAiAnswers((prev) => ({ ...prev, [questionId]: answer }));
    if (aiStep < AI_QUESTIONS.length) {
      setAiStep(aiStep + 1);
    }
  }, [aiStep]);

  const handleAiGenerate = useCallback(async () => {
    setAiStep(AI_QUESTIONS.length + 1); // 生成中

    try {
      const res = await fetch("/api/ai-edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers: Object.entries(aiAnswers).map(([questionId, answer]) => ({ questionId, answer })),
          currentConfig: { company: liveData },
          editTarget: "full",
        }),
      });
      const data = await res.json();
      setAiSuggestions(data.suggestions || []);
      setAiStep(AI_QUESTIONS.length + 2); // Before/After表示
    } catch {
      // エラー時はデモデータ
      setAiSuggestions([
        { field: "tagline", before: liveData.tagline, after: "確かな技術で、暮らしを守る。" },
        { field: "description", before: liveData.description, after: "創業30年。世田谷の街とともに歩む工務店。" },
      ]);
      setAiStep(AI_QUESTIONS.length + 2);
    }
  }, [aiAnswers, liveData]);

  const handleAiApprove = useCallback(() => {
    setAiApplying(true);
    setTimeout(() => {
      // 承認 → liveDataに反映
      setLiveData((prev) => {
        const next = { ...prev };
        for (const s of aiSuggestions) {
          if (s.field in next) (next as Record<string, string>)[s.field] = s.after;
        }
        return next;
      });
      setAiApplying(false);
      setAiDone(true);
    }, 2000);
  }, [aiSuggestions]);

  const resetAi = useCallback(() => {
    setAiStep(0);
    setAiAnswers({});
    setAiSuggestions([]);
    setAiApplying(false);
    setAiDone(false);
  }, []);

  const isEditing = mode === "edit";
  const isChanged = (fieldId: string) => changes.some((c) => c.fieldId === fieldId);

  /* ── その場編集 ── */
  function InlineEdit({ fieldId, label, original, children }: {
    fieldId: string; label: string; original: string; children: React.ReactNode;
  }) {
    const isActive = activeFieldId === fieldId;
    const changed = isChanged(fieldId);

    return (
      <div style={{ position: "relative" }}>
        <div
          onClick={() => isEditing && !isActive && startEdit(fieldId)}
          style={{
            cursor: isEditing ? "pointer" : "default",
            borderRadius: 6,
            outline: isEditing ? (isActive ? `2px solid ${C.purple}` : "1px dashed transparent") : "none",
            transition: "outline 0.15s",
            position: "relative",
          }}
          onMouseEnter={(e) => { if (isEditing && !isActive) (e.currentTarget as HTMLElement).style.outline = `1px dashed ${C.purpleLight}`; }}
          onMouseLeave={(e) => { if (isEditing && !isActive) (e.currentTarget as HTMLElement).style.outline = "1px dashed transparent"; }}
        >
          {changed && !isActive && (
            <div style={{ position: "absolute", top: -6, right: -6, zIndex: 10, width: 18, height: 18, borderRadius: "50%", background: C.purple, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Check size={10} color="#fff" />
            </div>
          )}
          {children}
        </div>

        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              style={{
                position: "absolute", left: 0, right: 0, top: "100%", zIndex: 100, marginTop: 6,
                background: C.card, border: `1px solid ${C.border}`, borderRadius: 12,
                boxShadow: "0 4px 24px rgba(0,0,0,0.12)", padding: 12, minWidth: 240,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: C.purple }}>{label}</span>
                <button onClick={cancelEdit} style={{ border: "none", background: "none", cursor: "pointer", color: C.textMuted, padding: 2 }}>
                  <X size={14} />
                </button>
              </div>
              <textarea
                value={editText} onChange={(e) => setEditText(e.target.value)} autoFocus
                rows={Math.min(5, Math.max(2, editText.split("\n").length + 1))}
                style={{
                  width: "100%", padding: "10px 12px", border: `1.5px solid ${C.purpleLight}`,
                  borderRadius: 8, fontSize: 14, resize: "vertical", outline: "none",
                  lineHeight: 1.7, color: C.text, fontFamily: "inherit",
                }}
              />
              <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                <button onClick={() => confirmEdit(fieldId, label, original)}
                  style={{ padding: "7px 14px", borderRadius: 8, border: "none", background: C.purple, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                  <Check size={12} /> 決定
                </button>
                <button onClick={cancelEdit}
                  style={{ padding: "7px 14px", borderRadius: 8, border: `1px solid ${C.border}`, background: C.card, fontSize: 12, color: C.textSub, cursor: "pointer" }}>
                  やめる
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  /* ── 画像差替え ── */
  function InlineImageEdit({ fieldId, label, children }: { fieldId: string; label: string; children: React.ReactNode }) {
    const isActive = activeFieldId === fieldId;
    const changed = isChanged(fieldId);

    return (
      <div style={{ position: "relative" }}>
        <div
          onClick={() => isEditing && !isActive && setActiveFieldId(fieldId)}
          style={{
            cursor: isEditing ? "pointer" : "default", borderRadius: 6, position: "relative",
            outline: isEditing ? (isActive ? `2px solid ${C.purple}` : "1px dashed transparent") : "none",
          }}
          onMouseEnter={(e) => { if (isEditing && !isActive) (e.currentTarget as HTMLElement).style.outline = `1px dashed ${C.purpleLight}`; }}
          onMouseLeave={(e) => { if (isEditing && !isActive) (e.currentTarget as HTMLElement).style.outline = "1px dashed transparent"; }}
        >
          {changed && !isActive && (
            <div style={{ position: "absolute", top: -6, right: -6, zIndex: 10, width: 18, height: 18, borderRadius: "50%", background: C.purple, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Check size={10} color="#fff" />
            </div>
          )}
          {isEditing && (
            <div style={{ position: "absolute", inset: 0, zIndex: 5, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 6, pointerEvents: "none" }}>
              <Camera size={22} color={C.purple} style={{ opacity: 0.4 }} />
            </div>
          )}
          {children}
        </div>

        <AnimatePresence>
          {isActive && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{
                position: "absolute", left: 0, right: 0, top: "100%", zIndex: 100, marginTop: 6,
                background: C.card, border: `1px solid ${C.border}`, borderRadius: 12,
                boxShadow: "0 4px 24px rgba(0,0,0,0.12)", padding: 12,
              }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: C.purple }}>{label}</span>
                <button onClick={cancelEdit} style={{ border: "none", background: "none", cursor: "pointer", color: C.textMuted, padding: 2 }}><X size={14} /></button>
              </div>
              <button
                onClick={() => { saveChange(fieldId, label, "", "[新しい写真]"); setActiveFieldId(null); }}
                style={{
                  width: "100%", padding: "14px", borderRadius: 8, border: `2px dashed ${C.purpleLight}`,
                  background: C.purpleBg, color: C.purple, fontSize: 13, fontWeight: 600, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                }}>
                <Camera size={16} /> 写真を選んで差し替え
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  /* ═══════════════════════════════════════
     レンダリング
     ═══════════════════════════════════════ */
  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: C.bg, overflow: "hidden" }}>
      {/* ── ヘッダー ── */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "6px 12px", background: C.card, borderBottom: `1px solid ${C.border}`, flexShrink: 0,
      }}>
        <div style={{ display: "flex", gap: 3 }}>
          {([
            { id: "view", icon: Eye, label: "見る" },
            { id: "edit", icon: Pencil, label: "編集" },
            { id: "ai", icon: Bot, label: "AI" },
          ] as const).map((tab) => {
            const locked = tab.id === "ai" && plan === "otameshi";
            return (
              <button key={tab.id}
                onClick={() => { if (!locked) { setMode(tab.id); cancelEdit(); } }}
                disabled={locked}
                style={{
                  display: "flex", alignItems: "center", gap: 5,
                  padding: "7px 14px", borderRadius: 8, border: "none",
                  background: mode === tab.id ? C.purple : "transparent",
                  color: locked ? C.textMuted : mode === tab.id ? "#fff" : C.textSub,
                  fontWeight: mode === tab.id ? 700 : 500, fontSize: 13,
                  cursor: locked ? "not-allowed" : "pointer",
                  opacity: locked ? 0.5 : 1,
                }}>
                {locked ? <Lock size={13} /> : <tab.icon size={15} />}
                {tab.label}
              </button>
            );
          })}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {changes.length > 0 && mode === "edit" && (
            <button onClick={() => setConfirming(true)}
              style={{
                padding: "6px 12px", borderRadius: 8, border: "none",
                background: `linear-gradient(135deg, ${C.pink}, ${C.purple})`,
                color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer",
              }}>
              反映する（{changes.length}件）
            </button>
          )}
          <div style={{ display: "flex", gap: 2 }}>
            {(["mobile", "desktop"] as const).map((d) => (
              <button key={d} onClick={() => setDevice(d)}
                style={{
                  padding: "5px 8px", borderRadius: 6, border: "none",
                  background: device === d ? C.purpleBg : "transparent",
                  color: device === d ? C.purple : C.textMuted, cursor: "pointer",
                }}>
                {d === "mobile" ? <Smartphone size={15} /> : <Monitor size={15} />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── メイン ── */}
      <div style={{ flex: 1, overflow: "auto", position: "relative" }}>

        {/* ── 見る / 編集 モード: サイトプレビュー ── */}
        {(mode === "view" || mode === "edit") && (
          <div style={{ display: "flex", justifyContent: "center", padding: 16, background: "#eee", minHeight: "100%" }}
            onClick={(e) => { if ((e.target as HTMLElement).dataset.bg) cancelEdit(); }}>
            <div data-bg="true" style={{
              width: device === "mobile" ? 375 : "100%", maxWidth: device === "desktop" ? 900 : 375,
              background: "#fff", borderRadius: 12, boxShadow: "0 2px 20px rgba(0,0,0,0.06)",
              overflow: "hidden", alignSelf: "flex-start",
            }}>
              {/* ヒーロー */}
              <InlineImageEdit fieldId="hero-image" label="背景画像">
                <div style={{ background: "linear-gradient(135deg, #7BA23F 0%, #5a8a2d 100%)", padding: "48px 24px", textAlign: "center", color: "#fff" }}>
                  <p style={{ fontSize: 10, letterSpacing: "0.2em", opacity: 0.6, marginBottom: 12 }}>YAMADA CONSTRUCTION</p>
                  <InlineEdit fieldId="tagline" label="キャッチコピー" original={liveData.tagline}>
                    <h1 style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.5, margin: "0 0 10px" }}>{getFieldValue("tagline")}</h1>
                  </InlineEdit>
                  <InlineEdit fieldId="description" label="説明文" original={liveData.description}>
                    <p style={{ fontSize: 13, opacity: 0.85, margin: 0 }}>{getFieldValue("description")}</p>
                  </InlineEdit>
                </div>
              </InlineImageEdit>

              {/* 施工実績 */}
              <div style={{ padding: "36px 24px" }}>
                <p style={{ fontSize: 10, color: C.textMuted, letterSpacing: "0.15em", marginBottom: 4 }}>WORKS</p>
                <h2 style={{ fontSize: 17, fontWeight: 700, color: C.text, marginBottom: 16 }}>施工実績</h2>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {[1, 2, 3, 4].map((i) => (
                    <InlineImageEdit key={i} fieldId={`work-${i}`} label={`実績${i}の写真`}>
                      <div style={{ aspectRatio: "4/3", background: `hsl(${80 + i * 20}, 25%, ${78 + i * 2}%)`, borderRadius: 8 }} />
                    </InlineImageEdit>
                  ))}
                </div>
              </div>

              {/* 会社案内 */}
              <div style={{ padding: "36px 24px", background: "#f9f7f2" }}>
                <p style={{ fontSize: 10, color: C.textMuted, letterSpacing: "0.15em", marginBottom: 4 }}>ABOUT</p>
                <h2 style={{ fontSize: 17, fontWeight: 700, color: C.text, marginBottom: 16 }}>会社案内</h2>
                <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
                  <InlineImageEdit fieldId="ceo-photo" label="代表写真">
                    <div style={{ width: 80, height: 100, background: "#e0dcd4", borderRadius: 8, flexShrink: 0 }} />
                  </InlineImageEdit>
                  <div style={{ flex: 1 }}>
                    <InlineEdit fieldId="ceoName" label="代表者名" original={liveData.ceoName}>
                      <p style={{ fontWeight: 700, fontSize: 15, color: C.text, marginBottom: 4 }}>{getFieldValue("ceoName")}</p>
                    </InlineEdit>
                    <InlineEdit fieldId="bio" label="代表挨拶" original={liveData.bio}>
                      <p style={{ fontSize: 13, color: C.textSub, lineHeight: 1.8, margin: 0 }}>{getFieldValue("bio")}</p>
                    </InlineEdit>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13, color: C.textSub }}>
                  <InlineEdit fieldId="address" label="住所" original={liveData.address}>
                    <p style={{ margin: 0 }}>📍 {getFieldValue("address")}</p>
                  </InlineEdit>
                  <InlineEdit fieldId="phone" label="電話番号" original={liveData.phone}>
                    <p style={{ margin: 0 }}>📞 {getFieldValue("phone")}</p>
                  </InlineEdit>
                  <InlineEdit fieldId="hours" label="営業時間" original={liveData.hours}>
                    <p style={{ margin: 0 }}>🕐 {getFieldValue("hours")}</p>
                  </InlineEdit>
                </div>
              </div>

              <div style={{ padding: "36px 24px", textAlign: "center" }}>
                <h2 style={{ fontSize: 17, fontWeight: 700, color: C.text, marginBottom: 8 }}>お問い合わせ</h2>
                <p style={{ fontSize: 13, color: C.textSub }}>お気軽にご相談ください</p>
              </div>
            </div>
          </div>
        )}

        {/* ── AIモード: 質問フロー ── */}
        {mode === "ai" && (
          <div style={{ maxWidth: 480, margin: "0 auto", padding: "24px 16px" }}>

            {/* 質問前: 説明 */}
            {aiStep === 0 && !aiDone && (
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 8 }}>AIでサイトを改善する</h3>
                <p style={{ fontSize: 13, color: C.textSub, lineHeight: 1.8, marginBottom: 24 }}>
                  5つの質問に答えるだけで、あなたの会社に合った<br />
                  キャッチコピーや説明文をAIが考えます。
                </p>
                <p style={{ fontSize: 12, color: C.textMuted, marginBottom: 20 }}>
                  残り: {plan === "omakase-pro" ? "無制限" : "2回 / 月3回"}
                </p>
                <button onClick={() => setAiStep(1)}
                  style={{
                    width: "100%", padding: "14px", borderRadius: 12, border: "none",
                    background: `linear-gradient(135deg, ${C.pink}, ${C.purple})`,
                    color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer",
                  }}>
                  始める <ChevronRight size={16} style={{ verticalAlign: "middle" }} />
                </button>
              </div>
            )}

            {/* 質問中 */}
            {aiStep >= 1 && aiStep <= AI_QUESTIONS.length && (
              <div>
                <div style={{ display: "flex", gap: 4, marginBottom: 20 }}>
                  {AI_QUESTIONS.map((_, i) => (
                    <div key={i} style={{
                      flex: 1, height: 4, borderRadius: 2,
                      background: i < aiStep ? C.purple : i === aiStep - 1 ? C.purpleLight : "#e0e0e0",
                    }} />
                  ))}
                </div>

                {(() => {
                  const q = AI_QUESTIONS[aiStep - 1];
                  return (
                    <motion.div key={q.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                      <p style={{ fontSize: 11, color: C.purple, fontWeight: 700, marginBottom: 6 }}>
                        {aiStep} / {AI_QUESTIONS.length}
                      </p>
                      <h3 style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 16, lineHeight: 1.6 }}>
                        {q.question}
                      </h3>

                      {q.type === "select" && (
                        <div>
                          {q.options?.map((opt) => (
                            <button key={opt} onClick={() => setAiAnswers((prev) => ({ ...prev, [q.id]: opt }))}
                              style={{
                                width: "100%", textAlign: "left", padding: "12px 16px", marginBottom: 6,
                                borderRadius: 10, border: aiAnswers[q.id] === opt ? `2px solid ${C.purple}` : `1px solid #ccc`,
                                background: aiAnswers[q.id] === opt ? C.purpleBg : C.card,
                                color: C.text, fontSize: 14, cursor: "pointer",
                                fontWeight: aiAnswers[q.id] === opt ? 700 : 400,
                              }}>
                              {opt}
                            </button>
                          ))}

                          {/* 自由記述欄（選択肢の下） */}
                          {"freeInputPlaceholder" in q && (
                            <div style={{ marginTop: 8 }}>
                              <textarea
                                value={aiAnswers[q.id]?.startsWith("【自由記述】") ? aiAnswers[q.id].replace("【自由記述】", "") : ""}
                                placeholder={q.freeInputPlaceholder || "その他（自由に書いてください）"}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setAiAnswers((prev) => ({ ...prev, [q.id]: val ? `【自由記述】${val}` : "" }));
                                }}
                                rows={2}
                                style={{
                                  width: "100%", padding: "12px",
                                  border: "2px solid #333", borderRadius: 10,
                                  fontSize: 14, resize: "none", outline: "none",
                                  lineHeight: 1.6, color: "#222",
                                }}
                              />
                            </div>
                          )}

                          <button
                            onClick={() => handleAiAnswer(q.id, aiAnswers[q.id] || "特になし")}
                            disabled={!aiAnswers[q.id]}
                            style={{
                              marginTop: 12, padding: "12px 24px", borderRadius: 8, border: "none",
                              background: aiAnswers[q.id] ? C.purple : "#ddd",
                              color: aiAnswers[q.id] ? "#fff" : "#999",
                              fontSize: 14, fontWeight: 700, cursor: aiAnswers[q.id] ? "pointer" : "not-allowed",
                            }}>
                            次へ →
                          </button>
                        </div>
                      )}

                      {q.type === "text" && (
                        <div>
                          <textarea
                            value={aiAnswers[q.id] || ""}
                            placeholder={q.placeholder}
                            onChange={(e) => setAiAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))}
                            rows={4}
                            style={{
                              width: "100%", padding: "14px",
                              border: "2px solid #333", borderRadius: 10,
                              fontSize: 14, resize: "none", outline: "none",
                              lineHeight: 1.7, color: "#222",
                            }}
                          />
                          <p style={{ fontSize: 11, color: "#666", marginTop: 4 }}>
                            なければ空欄のままで大丈夫です
                          </p>
                          <button
                            onClick={() => handleAiAnswer(q.id, aiAnswers[q.id] || "特になし")}
                            style={{
                              marginTop: 10, padding: "12px 24px", borderRadius: 8, border: "none",
                              background: C.purple, color: "#fff",
                              fontSize: 14, fontWeight: 700, cursor: "pointer",
                            }}>
                            次へ →
                          </button>
                        </div>
                      )}
                    </motion.div>
                  );
                })()}
              </div>
            )}

            {/* 全質問回答後に自動で生成開始 */}
            {aiStep === AI_QUESTIONS.length && Object.keys(aiAnswers).length >= AI_QUESTIONS.length && (() => {
              setTimeout(() => handleAiGenerate(), 500);
              return null;
            })()}

            {/* 生成中（数分かかる場合がある） */}
            {aiStep === AI_QUESTIONS.length + 1 && (
              <div style={{ textAlign: "center", padding: "60px 20px" }}>
                <div style={{
                  width: 64, height: 64, borderRadius: "50%",
                  background: `linear-gradient(135deg, ${C.pink}33, ${C.purple}33)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 20px",
                }}>
                  <Loader2 size={32} className="animate-spin" style={{ color: C.purple }} />
                </div>
                <p style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 8 }}>
                  サイトを作成しています
                </p>
                <p style={{ fontSize: 14, color: C.textSub, lineHeight: 1.8, marginBottom: 16 }}>
                  あなたの回答をもとに、AIがサイトの内容を<br />
                  考えています。
                </p>
                <div style={{
                  padding: "12px 16px", borderRadius: 10,
                  background: "#fff8e1", border: "1px solid #ffe082",
                  fontSize: 13, color: "#6d4c00", lineHeight: 1.6,
                }}>
                  ⏳ これには数分かかる場合があります。<br />
                  このページを閉じずにお待ちください。
                </div>
              </div>
            )}

            {/* Before/After */}
            {aiStep === AI_QUESTIONS.length + 2 && !aiApplying && !aiDone && (
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 16 }}>AIの提案</h3>
                {aiSuggestions.map((s) => (
                  <div key={s.field} style={{
                    marginBottom: 16, padding: 16, borderRadius: 12,
                    border: `1px solid ${C.border}`, background: C.card,
                  }}>
                    <p style={{ fontSize: 12, fontWeight: 700, color: C.purple, marginBottom: 10 }}>
                      {s.field === "tagline" ? "キャッチコピー" : s.field === "description" ? "説明文" : "代表挨拶"}
                    </p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      <div>
                        <p style={{ fontSize: 10, color: C.textMuted, marginBottom: 4, fontWeight: 700 }}>Before</p>
                        <p style={{ fontSize: 13, color: C.textSub, lineHeight: 1.7, padding: 10, background: "#f5f5f5", borderRadius: 8 }}>
                          {s.before}
                        </p>
                      </div>
                      <div>
                        <p style={{ fontSize: 10, color: C.purple, marginBottom: 4, fontWeight: 700 }}>After</p>
                        <p style={{ fontSize: 13, color: C.text, lineHeight: 1.7, padding: 10, background: C.purpleBg, borderRadius: 8, fontWeight: 600 }}>
                          {s.after}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <button onClick={resetAi}
                    style={{
                      flex: 1, padding: "12px", borderRadius: 10,
                      border: `1px solid ${C.border}`, background: C.card,
                      fontSize: 13, cursor: "pointer", color: C.textSub,
                    }}>
                    やめる（手動で入力する）
                  </button>
                  <button onClick={handleAiApprove}
                    style={{
                      flex: 1, padding: "12px", borderRadius: 10, border: "none",
                      background: `linear-gradient(135deg, ${C.pink}, ${C.purple})`,
                      color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer",
                    }}>
                    この内容で反映する
                  </button>
                </div>
                <p style={{ fontSize: 11, color: C.textMuted, marginTop: 10, textAlign: "center" }}>
                  ※ 「やめる」を選んでも1回分としてカウントされます
                </p>
              </div>
            )}

            {/* AI反映中 */}
            {aiApplying && (
              <div style={{ textAlign: "center", padding: "60px 20px" }}>
                <div style={{
                  width: 64, height: 64, borderRadius: "50%",
                  background: `linear-gradient(135deg, ${C.pink}33, ${C.purple}33)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 20px",
                }}>
                  <Loader2 size={32} className="animate-spin" style={{ color: C.purple }} />
                </div>
                <p style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 8 }}>
                  サイトに反映しています
                </p>
                <p style={{ fontSize: 14, color: C.textSub, lineHeight: 1.8 }}>
                  変更内容をサイトに書き込んでいます。
                </p>
                <div style={{
                  marginTop: 16, padding: "12px 16px", borderRadius: 10,
                  background: "#fff8e1", border: "1px solid #ffe082",
                  fontSize: 13, color: "#6d4c00", lineHeight: 1.6,
                }}>
                  ⏳ これには数分かかる場合があります。
                </div>
              </div>
            )}

            {/* AI完了 → サイトを表示 */}
            {aiDone && (
              <div style={{ padding: 0 }}>
                {/* 完了メッセージ */}
                <div style={{
                  textAlign: "center", padding: "24px 16px",
                  background: `linear-gradient(135deg, ${C.pink}11, ${C.purple}11)`,
                  borderBottom: `1px solid ${C.border}`,
                }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 8 }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: "50%",
                      background: `linear-gradient(135deg, ${C.pink}, ${C.purple})`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <Check size={16} color="#fff" />
                    </div>
                    <p style={{ fontSize: 16, fontWeight: 700, color: C.text }}>反映が完了しました</p>
                  </div>
                  <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                    <button onClick={() => { resetAi(); setMode("edit"); }}
                      style={{
                        padding: "8px 16px", borderRadius: 8,
                        border: `1px solid ${C.border}`, background: C.card,
                        fontSize: 12, color: C.textSub, cursor: "pointer",
                      }}>
                      編集に戻る
                    </button>
                    <button onClick={resetAi}
                      style={{
                        padding: "8px 16px", borderRadius: 8, border: "none",
                        background: C.purple, color: "#fff",
                        fontSize: 12, fontWeight: 700, cursor: "pointer",
                      }}>
                      もう一度AIを使う
                    </button>
                  </div>
                </div>

                {/* 実際のサイトプレビュー表示 */}
                <div style={{ display: "flex", justifyContent: "center", padding: 16, background: "#eee" }}>
                  <div style={{
                    width: device === "mobile" ? 375 : "100%", maxWidth: device === "desktop" ? 900 : 375,
                    background: "#fff", borderRadius: 12, boxShadow: "0 2px 20px rgba(0,0,0,0.06)",
                    overflow: "hidden",
                  }}>
                    {/* 更新後のサイトプレビュー */}
                    <div style={{
                      background: "linear-gradient(135deg, #7BA23F 0%, #5a8a2d 100%)",
                      padding: "48px 24px", textAlign: "center", color: "#fff",
                    }}>
                      <p style={{ fontSize: 10, letterSpacing: "0.2em", opacity: 0.6, marginBottom: 12 }}>YAMADA CONSTRUCTION</p>
                      <h1 style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.5, margin: "0 0 10px" }}>
                        {liveData.tagline}
                      </h1>
                      <p style={{ fontSize: 13, opacity: 0.85, margin: 0 }}>
                        {liveData.description}
                      </p>
                    </div>
                    <div style={{ padding: "36px 24px" }}>
                      <h2 style={{ fontSize: 17, fontWeight: 700, color: C.text, marginBottom: 16 }}>施工実績</h2>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} style={{ aspectRatio: "4/3", background: `hsl(${80 + i * 20}, 25%, ${78 + i * 2}%)`, borderRadius: 8 }} />
                        ))}
                      </div>
                    </div>
                    <div style={{ padding: "36px 24px", background: "#f9f7f2" }}>
                      <h2 style={{ fontSize: 17, fontWeight: 700, color: C.text, marginBottom: 16 }}>会社案内</h2>
                      <p style={{ fontWeight: 700, fontSize: 15, color: C.text, marginBottom: 8 }}>{liveData.ceoName}</p>
                      <p style={{ fontSize: 13, color: C.textSub, lineHeight: 1.8 }}>{liveData.bio}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── 手動編集: 確認・反映中・完了 ── */}
      <AnimatePresence>
        {confirming && !applying && !done && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.35)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }}
              style={{ background: C.card, borderRadius: 16, padding: 24, maxWidth: 340, width: "100%", boxShadow: "0 8px 30px rgba(0,0,0,0.15)" }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14, color: C.text }}>以下の変更を反映しますか？</h3>
              {changes.map((c, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 0", borderBottom: i < changes.length - 1 ? `1px solid ${C.border}` : "none" }}>
                  <Check size={14} color={C.purple} />
                  <div>
                    <span style={{ fontSize: 13, color: C.text, fontWeight: 600 }}>{c.label}</span>
                    <p style={{ fontSize: 11, color: C.textSub, margin: "2px 0 0" }}>→ {c.newValue.length > 30 ? c.newValue.slice(0, 30) + "…" : c.newValue}</p>
                  </div>
                </div>
              ))}
              <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
                <button onClick={() => setConfirming(false)} style={{ flex: 1, padding: "11px", borderRadius: 10, border: `1px solid ${C.border}`, background: C.card, fontSize: 13, cursor: "pointer", color: C.textSub }}>戻る</button>
                <button onClick={handleManualConfirm} style={{ flex: 1, padding: "11px", borderRadius: 10, border: "none", background: `linear-gradient(135deg, ${C.pink}, ${C.purple})`, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>反映する</button>
              </div>
            </motion.div>
          </motion.div>
        )}
        {applying && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(255,255,255,0.95)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <Loader2 size={28} className="animate-spin" style={{ color: C.purple, marginBottom: 14 }} />
            <p style={{ fontSize: 15, fontWeight: 700, color: C.text }}>反映しています...</p>
          </motion.div>
        )}
        {done && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(255,255,255,0.98)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: `linear-gradient(135deg, ${C.pink}, ${C.purple})`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
              <Check size={28} color="#fff" />
            </div>
            <p style={{ fontSize: 17, fontWeight: 700, color: C.text }}>反映しました！</p>
            <button onClick={resetManual} style={{ marginTop: 20, padding: "10px 24px", borderRadius: 10, border: "none", background: C.purple, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
              編集画面に戻る
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
