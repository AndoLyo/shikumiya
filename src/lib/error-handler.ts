/**
 * しくみや エラーハンドリング & ログシステム
 *
 * 全てのエラーを一元管理。
 * - ターミナルに色付きログ出力
 * - GASに記録（将来）
 * - 管理画面に表示（将来）
 */

/* ═══════════════════════════════════════
   ログレベル & 色
   ═══════════════════════════════════════ */
type LogLevel = "info" | "warn" | "error" | "success" | "debug";

const LOG_COLORS: Record<LogLevel, string> = {
  info:    "\x1b[36m",   // cyan
  warn:    "\x1b[33m",   // yellow
  error:   "\x1b[31m",   // red
  success: "\x1b[32m",   // green
  debug:   "\x1b[90m",   // gray
};
const RESET = "\x1b[0m";
const BOLD = "\x1b[1m";

/* ═══════════════════════════════════════
   エラーカテゴリ
   ═══════════════════════════════════════ */
export type ErrorCategory =
  | "GITHUB_API"       // GitHub APIエラー（リポ作成、ファイル更新等）
  | "VERCEL_API"       // Vercel APIエラー（デプロイ、プロジェクト作成等）
  | "STRIPE"           // Stripe決済エラー
  | "GAS_WEBHOOK"      // GAS連携エラー
  | "CLAUDE_API"       // Claude API呼び出しエラー
  | "FILE_UPLOAD"      // ファイルアップロードエラー
  | "AUTH"             // 認証エラー
  | "VALIDATION"       // バリデーションエラー
  | "DEPLOY"           // デプロイパイプラインエラー
  | "SITE_UPDATE"      // サイト更新エラー
  | "UNKNOWN";         // 不明なエラー

/* ═══════════════════════════════════════
   ログエントリ
   ═══════════════════════════════════════ */
export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  category: ErrorCategory;
  message: string;
  details?: Record<string, unknown>;
  orderId?: string;
  siteId?: string;
  stack?: string;
}

// メモリ内ログバッファ（管理画面で表示用）
const LOG_BUFFER: LogEntry[] = [];
const MAX_LOG_BUFFER = 500;

/* ═══════════════════════════════════════
   コアロガー
   ═══════════════════════════════════════ */
function logToTerminal(entry: LogEntry) {
  const color = LOG_COLORS[entry.level];
  const levelTag = entry.level.toUpperCase().padEnd(7);
  const time = entry.timestamp.split("T")[1]?.split(".")[0] || entry.timestamp;
  const prefix = `${color}${BOLD}[${levelTag}]${RESET}`;
  const catTag = `${LOG_COLORS.debug}[${entry.category}]${RESET}`;
  const idTag = entry.orderId ? `${LOG_COLORS.debug}(${entry.orderId})${RESET}` : "";

  console.log(`${prefix} ${catTag} ${idTag} ${entry.message}`);

  if (entry.details && entry.level !== "debug") {
    console.log(`${LOG_COLORS.debug}  └─ details:`, JSON.stringify(entry.details, null, 2), RESET);
  }

  if (entry.stack && entry.level === "error") {
    console.log(`${LOG_COLORS.error}  └─ stack: ${entry.stack.split("\n").slice(0, 3).join("\n         ")}${RESET}`);
  }
}

function addToBuffer(entry: LogEntry) {
  LOG_BUFFER.unshift(entry);
  if (LOG_BUFFER.length > MAX_LOG_BUFFER) {
    LOG_BUFFER.pop();
  }
}

/* ═══════════════════════════════════════
   公開API
   ═══════════════════════════════════════ */

/**
 * ログを記録（ターミナル出力 + バッファ保存）
 */
export function log(
  level: LogLevel,
  category: ErrorCategory,
  message: string,
  options?: {
    details?: Record<string, unknown>;
    orderId?: string;
    siteId?: string;
    error?: unknown;
  }
) {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    category,
    message,
    details: options?.details,
    orderId: options?.orderId,
    siteId: options?.siteId,
    stack: options?.error instanceof Error ? options.error.stack : undefined,
  };

  logToTerminal(entry);
  addToBuffer(entry);

  return entry;
}

/**
 * ショートカット
 */
export const logger = {
  info: (category: ErrorCategory, message: string, options?: Parameters<typeof log>[3]) =>
    log("info", category, message, options),

  warn: (category: ErrorCategory, message: string, options?: Parameters<typeof log>[3]) =>
    log("warn", category, message, options),

  error: (category: ErrorCategory, message: string, options?: Parameters<typeof log>[3]) =>
    log("error", category, message, options),

  success: (category: ErrorCategory, message: string, options?: Parameters<typeof log>[3]) =>
    log("success", category, message, options),

  debug: (category: ErrorCategory, message: string, options?: Parameters<typeof log>[3]) =>
    log("debug", category, message, options),
};

/**
 * ログバッファを取得（管理画面用）
 */
export function getLogs(filter?: { level?: LogLevel; category?: ErrorCategory; limit?: number }): LogEntry[] {
  let logs = [...LOG_BUFFER];
  if (filter?.level) logs = logs.filter((l) => l.level === filter.level);
  if (filter?.category) logs = logs.filter((l) => l.category === filter.category);
  if (filter?.limit) logs = logs.slice(0, filter.limit);
  return logs;
}

/**
 * エラーをラップして安全に実行
 */
export async function safeExecute<T>(
  category: ErrorCategory,
  operation: string,
  fn: () => Promise<T>,
  options?: { orderId?: string; siteId?: string }
): Promise<{ success: true; data: T } | { success: false; error: string }> {
  try {
    logger.info(category, `${operation} 開始`, options);
    const data = await fn();
    logger.success(category, `${operation} 完了`, options);
    return { success: true, data };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    logger.error(category, `${operation} 失敗: ${message}`, { ...options, error: err });
    return { success: false, error: message };
  }
}

/* ═══════════════════════════════════════
   API固有のエラーハンドラー
   ═══════════════════════════════════════ */

/**
 * GitHub APIエラーのパース
 */
export function parseGitHubError(error: unknown): string {
  if (error instanceof Response) {
    const status = error.status;
    if (status === 401) return "GitHub認証エラー: トークンが無効または期限切れです";
    if (status === 403) return "GitHub権限エラー: API rate limitに達したか、権限が不足しています";
    if (status === 404) return "GitHubリポジトリが見つかりません";
    if (status === 409) return "GitHubコンフリクト: ファイルが他の更新と競合しています";
    if (status === 422) return "GitHub入力エラー: リクエスト内容に問題があります";
    return `GitHub APIエラー (HTTP ${status})`;
  }
  return error instanceof Error ? error.message : "不明なGitHubエラー";
}

/**
 * Vercel APIエラーのパース
 */
export function parseVercelError(error: unknown): string {
  if (error instanceof Response) {
    const status = error.status;
    if (status === 401) return "Vercel認証エラー: トークンが無効です";
    if (status === 403) return "Vercel権限エラー: プロジェクトへのアクセス権がありません";
    if (status === 404) return "Vercelプロジェクトが見つかりません";
    return `Vercel APIエラー (HTTP ${status})`;
  }
  return error instanceof Error ? error.message : "不明なVercelエラー";
}

/**
 * Claude APIエラーのパース
 */
export function parseClaudeError(error: unknown): string {
  if (error instanceof Response) {
    const status = error.status;
    if (status === 401) return "Claude API認証エラー: APIキーが無効です";
    if (status === 429) return "Claude APIレート制限: しばらく待ってから再試行してください";
    if (status === 500) return "Claude APIサーバーエラー: Anthropic側の問題です";
    if (status === 529) return "Claude API過負荷: しばらく待ってから再試行してください";
    return `Claude APIエラー (HTTP ${status})`;
  }
  return error instanceof Error ? error.message : "不明なClaude APIエラー";
}

/**
 * ファイルアップロードのバリデーション
 */
export function validateFileUpload(file: { name: string; size: number; type: string }): { valid: boolean; error?: string } {
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];

  if (file.size > MAX_SIZE) {
    return { valid: false, error: `ファイルサイズが上限を超えています（${(file.size / 1024 / 1024).toFixed(1)}MB / 上限5MB）` };
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, error: `対応していないファイル形式です: ${file.type}` };
  }

  return { valid: true };
}

/**
 * GAS Webhookエラーのリトライ
 */
export async function retryGasWebhook(
  url: string,
  body: unknown,
  maxRetries: number = 3
): Promise<Response> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      logger.debug("GAS_WEBHOOK", `GAS Webhook 試行 ${attempt}/${maxRetries}`);

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        logger.success("GAS_WEBHOOK", `GAS Webhook 成功（試行${attempt}回目）`);
        return res;
      }

      lastError = new Error(`HTTP ${res.status}: ${res.statusText}`);
      logger.warn("GAS_WEBHOOK", `GAS Webhook 失敗 (HTTP ${res.status})、リトライ中...`);
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      logger.warn("GAS_WEBHOOK", `GAS Webhook 接続エラー、リトライ中...`, { error: err });
    }

    // 指数バックオフ（1秒、2秒、4秒）
    if (attempt < maxRetries) {
      await new Promise((resolve) => setTimeout(resolve, 1000 * Math.pow(2, attempt - 1)));
    }
  }

  logger.error("GAS_WEBHOOK", `GAS Webhook ${maxRetries}回リトライ後も失敗`, { error: lastError });
  throw lastError || new Error("GAS Webhook failed");
}
