import { NextResponse } from "next/server";
import { getLogs } from "@/lib/error-handler";
import type { LogEntry } from "@/lib/error-handler";

/**
 * GET /api/logs
 * 管理画面用のログ取得API
 * クエリパラメータ: level, category, limit
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const level = searchParams.get("level") as LogEntry["level"] | null;
  const category = searchParams.get("category") as LogEntry["category"] | null;
  const limit = parseInt(searchParams.get("limit") || "100");

  const logs = getLogs({
    level: level || undefined,
    category: category || undefined,
    limit,
  });

  return NextResponse.json({ logs, total: logs.length });
}
