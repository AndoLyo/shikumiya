"use client";

import { useState, useEffect } from "react";

/**
 * /start のプレビュー iframe から会社名を受け取るフック。
 *
 * グローバルで1つの postMessage リスナーを持ち、
 * 各コンポーネントの hook インスタンスが購読する。
 * Context 不要で、どのサブコンポーネントからでも呼べる。
 *
 * 使い方（テンプレートの page.tsx 内）:
 *   const displayName = usePreviewName(COMPANY.name);
 *   → JSX で COMPANY.name の代わりに displayName を使う
 */

type Listener = (name: string) => void;
const listeners = new Set<Listener>();
let currentOverride: string | null = null;
let initialized = false;

function initGlobalListener() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;

  // URL パラメータからの初期値
  try {
    const params = new URLSearchParams(window.location.search);
    const n = params.get("name");
    if (n) currentOverride = decodeURIComponent(n);
  } catch {
    // ignore
  }

  // postMessage リスナー（グローバルで1つだけ）
  window.addEventListener("message", (e: MessageEvent) => {
    if (
      e.data &&
      typeof e.data === "object" &&
      e.data.type === "shikumiya-preview-name" &&
      typeof e.data.name === "string"
    ) {
      currentOverride = e.data.name || null;
      listeners.forEach((fn) => fn(currentOverride!));
    }
  });
}

export function usePreviewName(defaultName: string): string {
  const [name, setName] = useState(() => {
    initGlobalListener();
    return currentOverride || defaultName;
  });

  useEffect(() => {
    initGlobalListener();
    if (currentOverride) setName(currentOverride);

    const listener: Listener = (n: string) => setName(n || defaultName);
    listeners.add(listener);
    return () => { listeners.delete(listener); };
  }, [defaultName]);

  return name;
}
