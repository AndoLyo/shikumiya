"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import {
  X, Eye, Pencil, Bot, Smartphone, Monitor,
  Check, Loader2, Lock, ChevronRight, Camera,
} from "lucide-react";
import type { SiteConfig } from "@/lib/site-config-schema";
import { normalizePlanId, PLAN_EDIT_LIMITS, type Plan } from "@/lib/stripe";

/* ═══════════════════════════════════════
   テンプレート描画コンポーネントの動的読み込み
   ═══════════════════════════════════════ */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TEMPLATE_RENDERERS: Record<string, React.ComponentType<any>> = {
  "warm-craft": dynamic(() => import("@/components/template-renderers/WarmCraftRenderer")),
  // 今後追加: trust-navy, clean-arch
};

/* ═══════════════════════════════════════
   色定義
   ═══════════════════════════════════════ */
const C = {
  purple: "#6c5ce7",
  purpleLight: "#a29bfe",
  purpleBg: "rgba(108, 92, 231, 0.06)",
  pink: "#e84393",
  gold: "#f39c12",
  card: "#ffffff",
  border: "#e8e8e8",
  text: "#222",
  textSub: "#777",
  textMuted: "#bbb",
};

/* ═══════════════════════════════════════
   AI質問データ
   ═══════════════════════════════════════ */
const AI_QUESTIONS = [
  {
    id: "impression", question: "サイトを見た人に、どんな印象を持ってほしいですか？",
    type: "select" as const,
    options: ["信頼感のある・安心できる", "親しみやすい・話しかけやすい", "洗練された・プロフェッショナル", "力強い・頼れる", "温かみのある・アットホーム", "モダンで先進的"],
    freeInputPlaceholder: "その他（自由に書いてください）",
  },
  {
    id: "strength", question: "一番伝えたいことは何ですか？",
    type: "select" as const,
    options: ["実績の豊富さ（施工件数・年数）", "技術力の高さ（資格・専門性）", "お客様との距離の近さ（丁寧な対応）", "価格の手頃さ（コストパフォーマンス）", "地域に根ざしている安心感", "デザイン力・提案力", "アフターサポートの手厚さ"],
    freeInputPlaceholder: "その他（自由に書いてください）",
  },
  {
    id: "target", question: "どんなお客様に来てほしいですか？",
    type: "select" as const,
    options: ["新築を考えている家族", "リフォーム・リノベーションしたい方", "法人・オフィス・店舗", "初めて家を建てる若い世代", "二世帯住宅を検討中の方", "幅広く、すべてのお客様"],
    freeInputPlaceholder: "その他（自由に書いてください）",
  },
  {
    id: "tone", question: "文章のトーンはどれが近いですか？",
    type: "select" as const,
    options: ["丁寧語で堅すぎない（「〜します」「〜です」）", "少しくだけた親しみやすい口調", "格式のある落ち着いた文体", "簡潔でシンプルに"],
    freeInputPlaceholder: "その他（自由に書いてください）",
  },
  { id: "avoid", question: "避けたい表現や、やめてほしいことはありますか？", type: "text" as const, placeholder: "例: 安さだけをアピールしないでほしい、堅すぎる表現は避けたい" },
  { id: "keywords", question: "サイトに入れたい言葉やこだわりがあれば教えてください", type: "text" as const, placeholder: "例: 地域密着、自然素材、笑顔、家族の安心、手仕事" },
];

/* ═══════════════════════════════════════
   メインページ
   ═══════════════════════════════════════ */
export default function EditorPage() {
  const params = useParams();
  const orderId = params.orderId as string;
  const { data: session } = useSession();

  // データ取得
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null);
  const [templateId, setTemplateId] = useState<string>("");
  const [plan, setPlan] = useState<Plan>("otameshi");
  const [repoName, setRepoName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // モード
  const [mode, setMode] = useState<"view" | "edit" | "ai">("edit");
  const [device, setDevice] = useState<"mobile" | "desktop">("desktop");

  // 編集状態
  const [activeFieldId, setActiveFieldId] = useState<string | null>(null);
  const [activeFieldValue, setActiveFieldValue] = useState("");
  const [activeFieldType, setActiveFieldType] = useState<"text" | "image">("text");
  const [editText, setEditText] = useState("");
  const [changes, setChanges] = useState<Map<string, { label: string; oldValue: string; newValue: string }>>(new Map());
  const [confirming, setConfirming] = useState(false);
  const [applying, setApplying] = useState(false);
  const [done, setDone] = useState(false);

  // AI
  const [aiStep, setAiStep] = useState(0);
  const [aiAnswers, setAiAnswers] = useState<Record<string, string>>({});
  const [aiSuggestions, setAiSuggestions] = useState<{ field: string; before: string; after: string }[]>([]);
  const [aiApplying, setAiApplying] = useState(false);
  const [aiDone, setAiDone] = useState(false);

  // データ取得
  useEffect(() => {
    const email = session?.user?.email;
    if (!email) return;

    fetch(`/api/site-content?orderId=${orderId}&email=${encodeURIComponent(email)}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setSiteConfig(data.config);
        setTemplateId((data.config?.templateId || "warm-craft").replace(/-(?:mid|pro)$/, ""));
        setPlan(normalizePlanId(data.plan || "otameshi"));
        setRepoName(data.repoName || "");
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [orderId, session]);

  // 編集操作
  const handleFieldClick = useCallback((fieldId: string, currentValue: string, fieldType: "text" | "image") => {
    if (mode !== "edit") return;
    setActiveFieldId(fieldId);
    setActiveFieldValue(currentValue);
    setActiveFieldType(fieldType);
    setEditText(changes.get(fieldId)?.newValue || currentValue);
  }, [mode, changes]);

  const cancelEdit = useCallback(() => {
    setActiveFieldId(null);
    setEditText("");
  }, []);

  const confirmEdit = useCallback(() => {
    if (!activeFieldId) return;
    if (editText !== activeFieldValue) {
      setChanges((prev) => {
        const next = new Map(prev);
        next.set(activeFieldId, { label: activeFieldId, oldValue: activeFieldValue, newValue: editText });
        return next;
      });
      // siteConfigにも即反映（プレビュー用）
      if (siteConfig) {
        const updated = JSON.parse(JSON.stringify(siteConfig));
        setNestedValue(updated, activeFieldId, editText);
        setSiteConfig(updated);
      }
    }
    setActiveFieldId(null);
    setEditText("");
  }, [activeFieldId, activeFieldValue, editText, siteConfig]);

  // 変更を反映
  const handleApply = useCallback(async () => {
    setApplying(true);
    try {
      const email = session?.user?.email;
      const changeArray = Array.from(changes.entries()).map(([fieldId, c]) => ({
        type: "text", configPath: fieldId, newValue: c.newValue,
      }));
      await fetch("/api/site-update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, email, changes: changeArray }),
      });
      setDone(true);
    } catch {
      alert("反映に失敗しました");
    } finally {
      setApplying(false);
    }
  }, [changes, orderId, session]);

  const resetAll = useCallback(() => {
    setChanges(new Map());
    setConfirming(false);
    setApplying(false);
    setDone(false);
    setActiveFieldId(null);
  }, []);

  // AI
  const handleAiAnswer = useCallback((qId: string, answer: string) => {
    setAiAnswers((prev) => ({ ...prev, [qId]: answer }));
    if (aiStep < AI_QUESTIONS.length) setAiStep(aiStep + 1);
  }, [aiStep]);

  const handleAiGenerate = useCallback(async () => {
    setAiStep(AI_QUESTIONS.length + 1);
    try {
      const res = await fetch("/api/ai-edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers: Object.entries(aiAnswers).map(([questionId, answer]) => ({ questionId, answer })),
          currentConfig: siteConfig,
          editTarget: "full",
        }),
      });
      const data = await res.json();
      setAiSuggestions(data.suggestions || []);
      setAiStep(AI_QUESTIONS.length + 2);
    } catch {
      setAiSuggestions([]);
      setAiStep(AI_QUESTIONS.length + 2);
    }
  }, [aiAnswers, siteConfig]);

  // 全質問回答後に自動生成
  useEffect(() => {
    if (aiStep === AI_QUESTIONS.length && Object.keys(aiAnswers).length >= AI_QUESTIONS.length) {
      const timer = setTimeout(() => handleAiGenerate(), 500);
      return () => clearTimeout(timer);
    }
  }, [aiStep, aiAnswers, handleAiGenerate]);

  const handleAiApprove = useCallback(async () => {
    setAiApplying(true);
    try {
      const email = session?.user?.email;
      const changeArray = aiSuggestions.map((s) => ({
        type: "text", configPath: `company.${s.field}`, newValue: s.after,
      }));
      await fetch("/api/site-update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, email, changes: changeArray }),
      });
      // siteConfigにも反映
      if (siteConfig) {
        const updated = JSON.parse(JSON.stringify(siteConfig));
        for (const s of aiSuggestions) {
          setNestedValue(updated, `company.${s.field}`, s.after);
        }
        setSiteConfig(updated);
      }
      setAiDone(true);
    } catch {
      alert("反映に失敗しました");
    } finally {
      setAiApplying(false);
    }
  }, [aiSuggestions, orderId, session, siteConfig]);

  const resetAi = useCallback(() => {
    setAiStep(0); setAiAnswers({}); setAiSuggestions([]); setAiApplying(false); setAiDone(false);
  }, []);

  // テンプレートの描画コンポーネントを取得
  const baseTemplate = templateId.replace(/-(?:mid|pro)$/, "");
  const TemplateRenderer = TEMPLATE_RENDERERS[baseTemplate];

  if (loading) {
    return (
      <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Loader2 size={28} className="animate-spin" style={{ color: C.purple }} />
      </div>
    );
  }

  if (error || !siteConfig) {
    return (
      <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12 }}>
        <p style={{ color: "#e74c3c", fontSize: 14 }}>{error || "サイトデータが見つかりません"}</p>
        <a href={`/member/${orderId}`} style={{ color: C.purple, fontSize: 13 }}>← ダッシュボードに戻る</a>
      </div>
    );
  }

  const changedFieldSet = new Set(changes.keys());

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: "#f0f0f0", overflow: "hidden" }}>
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
                  cursor: locked ? "not-allowed" : "pointer", opacity: locked ? 0.5 : 1,
                }}>
                {locked ? <Lock size={13} /> : <tab.icon size={15} />}
                {tab.label}
              </button>
            );
          })}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {changes.size > 0 && mode === "edit" && (
            <button onClick={() => setConfirming(true)}
              style={{
                padding: "6px 12px", borderRadius: 8, border: "none",
                background: `linear-gradient(135deg, ${C.pink}, ${C.purple})`,
                color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer",
              }}>
              反映する（{changes.size}件）
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

        {/* ── 見る / 編集 モード ── */}
        {(mode === "view" || mode === "edit") && (
          <div style={{ display: "flex", justifyContent: "center", padding: 16, minHeight: "100%" }}>
            <div style={{
              width: device === "mobile" ? 390 : "100%",
              maxWidth: device === "desktop" ? 1200 : 390,
              background: "#fff", borderRadius: 12,
              boxShadow: "0 2px 20px rgba(0,0,0,0.06)",
              overflow: "hidden", alignSelf: "flex-start",
              position: "relative",
            }}>
              {TemplateRenderer ? (
                <TemplateRenderer
                  config={siteConfig}
                  editMode={mode === "edit"}
                  onFieldClick={handleFieldClick}
                  changedFields={changedFieldSet}
                />
              ) : (
                <div style={{ padding: 40, textAlign: "center", color: C.textSub }}>
                  <p>テンプレート「{baseTemplate}」のエディタ表示は準備中です</p>
                  <p style={{ fontSize: 12, marginTop: 8 }}>対応テンプレート: warm-craft</p>
                </div>
              )}

              {/* 編集パネル（要素クリック時） */}
              <AnimatePresence>
                {activeFieldId && mode === "edit" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100,
                      background: C.card, borderTop: `1px solid ${C.border}`,
                      boxShadow: "0 -4px 20px rgba(0,0,0,0.1)", padding: 16,
                    }}
                  >
                    <div style={{ maxWidth: 600, margin: "0 auto" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: C.purple }}>{activeFieldId}</span>
                        <button onClick={cancelEdit} style={{ border: "none", background: "none", cursor: "pointer", color: C.textMuted }}><X size={16} /></button>
                      </div>

                      {activeFieldType === "text" ? (
                        <textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          autoFocus
                          rows={Math.min(5, Math.max(2, editText.split("\n").length + 1))}
                          style={{
                            width: "100%", padding: "12px", border: "2px solid #333",
                            borderRadius: 10, fontSize: 14, resize: "vertical",
                            outline: "none", lineHeight: 1.7, color: "#222",
                          }}
                        />
                      ) : (
                        <button style={{
                          width: "100%", padding: 16, borderRadius: 10,
                          border: `2px dashed ${C.purpleLight}`, background: C.purpleBg,
                          color: C.purple, fontSize: 13, cursor: "pointer",
                          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                        }}>
                          <Camera size={16} /> 写真を選んで差し替え
                        </button>
                      )}

                      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                        <button onClick={confirmEdit}
                          style={{
                            padding: "8px 16px", borderRadius: 8, border: "none",
                            background: C.purple, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer",
                            display: "flex", alignItems: "center", gap: 4,
                          }}>
                          <Check size={14} /> 決定
                        </button>
                        <button onClick={cancelEdit}
                          style={{
                            padding: "8px 16px", borderRadius: 8, border: `1px solid ${C.border}`,
                            background: C.card, fontSize: 13, color: C.textSub, cursor: "pointer",
                          }}>
                          やめる
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* ── AIモード ── */}
        {mode === "ai" && (
          <div style={{ maxWidth: 480, margin: "0 auto", padding: "24px 16px" }}>
            {aiStep === 0 && !aiDone && (
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 8 }}>AIでサイトを改善する</h3>
                <p style={{ fontSize: 13, color: C.textSub, lineHeight: 1.8, marginBottom: 24 }}>
                  6つの質問に答えるだけで、あなたに合ったキャッチコピーや説明文をAIが考えます。
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

            {aiStep >= 1 && aiStep <= AI_QUESTIONS.length && (() => {
              const q = AI_QUESTIONS[aiStep - 1];
              return (
                <motion.div key={q.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <div style={{ display: "flex", gap: 4, marginBottom: 20 }}>
                    {AI_QUESTIONS.map((_, i) => (
                      <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i < aiStep ? C.purple : "#e0e0e0" }} />
                    ))}
                  </div>
                  <p style={{ fontSize: 11, color: C.purple, fontWeight: 700, marginBottom: 6 }}>{aiStep} / {AI_QUESTIONS.length}</p>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 16, lineHeight: 1.6 }}>{q.question}</h3>

                  {q.type === "select" && (
                    <div>
                      {q.options?.map((opt) => (
                        <button key={opt} onClick={() => setAiAnswers((p) => ({ ...p, [q.id]: opt }))}
                          style={{
                            width: "100%", textAlign: "left", padding: "12px 16px", marginBottom: 6,
                            borderRadius: 10, border: aiAnswers[q.id] === opt ? `2px solid ${C.purple}` : "1px solid #ccc",
                            background: aiAnswers[q.id] === opt ? C.purpleBg : C.card,
                            color: C.text, fontSize: 14, cursor: "pointer",
                            fontWeight: aiAnswers[q.id] === opt ? 700 : 400,
                          }}>
                          {opt}
                        </button>
                      ))}
                      {"freeInputPlaceholder" in q && (
                        <textarea
                          value={aiAnswers[q.id]?.startsWith("【自由記述】") ? aiAnswers[q.id].replace("【自由記述】", "") : ""}
                          placeholder={q.freeInputPlaceholder}
                          onChange={(e) => setAiAnswers((p) => ({ ...p, [q.id]: e.target.value ? `【自由記述】${e.target.value}` : "" }))}
                          rows={2}
                          style={{ width: "100%", padding: 12, border: "2px solid #333", borderRadius: 10, fontSize: 14, resize: "none", outline: "none", marginTop: 8 }}
                        />
                      )}
                      <button onClick={() => handleAiAnswer(q.id, aiAnswers[q.id] || "特になし")} disabled={!aiAnswers[q.id]}
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
                      <textarea value={aiAnswers[q.id] || ""} placeholder={q.placeholder}
                        onChange={(e) => setAiAnswers((p) => ({ ...p, [q.id]: e.target.value }))}
                        rows={4} style={{ width: "100%", padding: 14, border: "2px solid #333", borderRadius: 10, fontSize: 14, resize: "none", outline: "none", lineHeight: 1.7 }}
                      />
                      <button onClick={() => handleAiAnswer(q.id, aiAnswers[q.id] || "特になし")}
                        style={{ marginTop: 10, padding: "12px 24px", borderRadius: 8, border: "none", background: C.purple, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
                        次へ →
                      </button>
                    </div>
                  )}
                </motion.div>
              );
            })()}

            {aiStep === AI_QUESTIONS.length + 1 && (
              <div style={{ textAlign: "center", padding: "60px 20px" }}>
                <Loader2 size={32} className="animate-spin" style={{ color: C.purple, margin: "0 auto 16px", display: "block" }} />
                <p style={{ fontSize: 18, fontWeight: 700, color: C.text }}>AIが考えています...</p>
                <div style={{ marginTop: 16, padding: "12px 16px", borderRadius: 10, background: "#fff8e1", border: "1px solid #ffe082", fontSize: 13, color: "#6d4c00" }}>
                  ⏳ これには数分かかる場合があります。
                </div>
              </div>
            )}

            {aiStep === AI_QUESTIONS.length + 2 && !aiApplying && !aiDone && (
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 16 }}>AIの提案</h3>
                {aiSuggestions.map((s) => (
                  <div key={s.field} style={{ marginBottom: 16, padding: 16, borderRadius: 12, border: `1px solid ${C.border}` }}>
                    <p style={{ fontSize: 12, fontWeight: 700, color: C.purple, marginBottom: 10 }}>
                      {s.field === "tagline" ? "キャッチコピー" : s.field === "description" ? "説明文" : "代表挨拶"}
                    </p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      <div>
                        <p style={{ fontSize: 10, color: C.textMuted, marginBottom: 4, fontWeight: 700 }}>Before</p>
                        <p style={{ fontSize: 13, color: C.textSub, lineHeight: 1.7, padding: 10, background: "#f5f5f5", borderRadius: 8 }}>{s.before}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: 10, color: C.purple, marginBottom: 4, fontWeight: 700 }}>After</p>
                        <p style={{ fontSize: 13, color: C.text, lineHeight: 1.7, padding: 10, background: C.purpleBg, borderRadius: 8, fontWeight: 600 }}>{s.after}</p>
                      </div>
                    </div>
                  </div>
                ))}
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={resetAi} style={{ flex: 1, padding: 12, borderRadius: 10, border: `1px solid ${C.border}`, background: C.card, fontSize: 13, cursor: "pointer", color: C.textSub }}>やめる</button>
                  <button onClick={handleAiApprove} style={{ flex: 1, padding: 12, borderRadius: 10, border: "none", background: `linear-gradient(135deg, ${C.pink}, ${C.purple})`, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>この内容で反映する</button>
                </div>
              </div>
            )}

            {aiApplying && (
              <div style={{ textAlign: "center", padding: "60px 20px" }}>
                <Loader2 size={32} className="animate-spin" style={{ color: C.purple, margin: "0 auto 16px", display: "block" }} />
                <p style={{ fontSize: 18, fontWeight: 700 }}>サイトに反映しています...</p>
              </div>
            )}

            {aiDone && (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <Check size={32} color={C.purple} style={{ margin: "0 auto 12px", display: "block" }} />
                <p style={{ fontSize: 17, fontWeight: 700 }}>反映しました！</p>
                <button onClick={() => { resetAi(); setMode("view"); }}
                  style={{ marginTop: 16, padding: "10px 24px", borderRadius: 10, border: "none", background: C.purple, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                  サイトを確認する
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── 確認・反映中・完了 ── */}
      <AnimatePresence>
        {confirming && !applying && !done && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.35)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
            <div style={{ background: C.card, borderRadius: 16, padding: 24, maxWidth: 340, width: "100%", boxShadow: "0 8px 30px rgba(0,0,0,0.15)" }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>以下の変更を反映しますか？</h3>
              {Array.from(changes.entries()).map(([fieldId, c], i) => (
                <div key={fieldId} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 0", borderBottom: i < changes.size - 1 ? `1px solid ${C.border}` : "none" }}>
                  <Check size={14} color={C.purple} />
                  <div>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{fieldId}</span>
                    <p style={{ fontSize: 11, color: C.textSub }}>→ {c.newValue.slice(0, 30)}…</p>
                  </div>
                </div>
              ))}
              <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
                <button onClick={() => setConfirming(false)} style={{ flex: 1, padding: 11, borderRadius: 10, border: `1px solid ${C.border}`, background: C.card, fontSize: 13, cursor: "pointer", color: C.textSub }}>戻る</button>
                <button onClick={handleApply} style={{ flex: 1, padding: 11, borderRadius: 10, border: "none", background: `linear-gradient(135deg, ${C.pink}, ${C.purple})`, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>反映する</button>
              </div>
            </div>
          </motion.div>
        )}
        {applying && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(255,255,255,0.95)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <Loader2 size={28} className="animate-spin" style={{ color: C.purple, marginBottom: 14 }} />
            <p style={{ fontSize: 15, fontWeight: 700 }}>反映しています...</p>
          </motion.div>
        )}
        {done && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(255,255,255,0.98)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <Check size={32} color={C.purple} style={{ marginBottom: 14 }} />
            <p style={{ fontSize: 17, fontWeight: 700 }}>反映しました！</p>
            <p style={{ fontSize: 13, color: C.textSub, marginTop: 6 }}>サイトに反映されるまで数分かかる場合があります</p>
            <button onClick={resetAll} style={{ marginTop: 20, padding: "10px 24px", borderRadius: 10, border: "none", background: C.purple, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
              編集画面に戻る
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function setNestedValue(obj: Record<string, unknown>, path: string, value: unknown): void {
  const keys = path.split(".");
  let current: Record<string, unknown> = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    if (!(keys[i] in current) || typeof current[keys[i]] !== "object") current[keys[i]] = {};
    current = current[keys[i]] as Record<string, unknown>;
  }
  current[keys[keys.length - 1]] = value;
}
