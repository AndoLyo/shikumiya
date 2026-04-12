/**
 * GitHub API 共通ユーティリティ
 * Gist操作、リポジトリ操作、ファイル操作を一元化
 */

import { logger, parseGitHubError } from "./error-handler";

const GITHUB_API = "https://api.github.com";

function getToken(): string {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error("GITHUB_TOKEN is not set");
  return token;
}

function getOwner(): string {
  return process.env.GITHUB_OWNER || "AndoLyo";
}

function headers(token?: string): Record<string, string> {
  return {
    Authorization: `token ${token || getToken()}`,
    "Content-Type": "application/json",
    Accept: "application/vnd.github.v3+json",
  };
}

/* ═══════════════════════════════════════
   Gist操作
   ═══════════════════════════════════════ */

export async function createGist(
  description: string,
  files: Record<string, { content: string }>,
  isPublic = false
): Promise<{ id: string; url: string }> {
  const res = await fetch(`${GITHUB_API}/gists`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ description, public: isPublic, files }),
  });

  if (!res.ok) {
    throw new Error(parseGitHubError(res));
  }

  const data = await res.json();
  return { id: data.id, url: data.html_url };
}

export async function fetchGist(gistId: string): Promise<Record<string, string>> {
  const res = await fetch(`${GITHUB_API}/gists/${gistId}`, { headers: headers() });
  if (!res.ok) throw new Error(parseGitHubError(res));

  const data = await res.json();
  const result: Record<string, string> = {};
  for (const [name, file] of Object.entries(data.files)) {
    result[name] = (file as { content: string }).content;
  }
  return result;
}

export async function deleteGist(gistId: string): Promise<void> {
  try {
    await fetch(`${GITHUB_API}/gists/${gistId}`, {
      method: "DELETE",
      headers: headers(),
    });
  } catch {
    logger.warn("GITHUB_API", `Gist削除失敗: ${gistId}`);
  }
}

/* ═══════════════════════════════════════
   リポジトリ操作
   ═══════════════════════════════════════ */

export async function createRepoFromTemplate(
  templateRepo: string,
  newRepoName: string,
  description?: string
): Promise<{ name: string; url: string }> {
  const owner = getOwner();
  const res = await fetch(`${GITHUB_API}/repos/${owner}/${templateRepo}/generate`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      owner,
      name: newRepoName,
      description: description || `しくみや顧客サイト: ${newRepoName}`,
      private: false,
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`リポジトリ作成失敗 (${res.status}): ${errorText}`);
  }

  const data = await res.json();
  return { name: data.name, url: data.html_url };
}

/* ═══════════════════════════════════════
   ファイル操作
   ═══════════════════════════════════════ */

export async function fetchFileFromRepo(
  repo: string,
  path: string,
  owner?: string
): Promise<string | null> {
  const o = owner || getOwner();
  const res = await fetch(`${GITHUB_API}/repos/${o}/${repo}/contents/${path}`, {
    headers: headers(),
  });

  if (!res.ok) return null;

  const data = await res.json();
  return Buffer.from(data.content, "base64").toString("utf-8");
}

export async function listFilesInRepo(
  repo: string,
  path: string,
  owner?: string
): Promise<Array<{ name: string; path: string }>> {
  const o = owner || getOwner();
  const res = await fetch(`${GITHUB_API}/repos/${o}/${repo}/contents/${path}`, {
    headers: headers(),
  });

  if (!res.ok) return [];

  const data = await res.json();
  if (!Array.isArray(data)) return [];
  return data.map((f: { name: string; path: string }) => ({ name: f.name, path: f.path }));
}

export async function pushFileToRepo(
  repo: string,
  path: string,
  content: string,
  message: string,
  owner?: string
): Promise<void> {
  const o = owner || getOwner();
  const token = getToken();

  // 既存ファイルのSHA取得（更新の場合に必要）
  let sha: string | undefined;
  const existing = await fetch(`${GITHUB_API}/repos/${o}/${repo}/contents/${path}`, {
    headers: headers(token),
  });
  if (existing.ok) {
    const data = await existing.json();
    sha = data.sha;
  }

  const res = await fetch(`${GITHUB_API}/repos/${o}/${repo}/contents/${path}`, {
    method: "PUT",
    headers: headers(token),
    body: JSON.stringify({
      message,
      content: Buffer.from(content).toString("base64"),
      ...(sha ? { sha } : {}),
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`ファイルpush失敗 (${path}): ${res.status} ${errorText}`);
  }
}

export async function pushBinaryFileToRepo(
  repo: string,
  path: string,
  base64Content: string,
  message: string,
  owner?: string
): Promise<void> {
  const o = owner || getOwner();
  const token = getToken();

  let sha: string | undefined;
  const existing = await fetch(`${GITHUB_API}/repos/${o}/${repo}/contents/${path}`, {
    headers: headers(token),
  });
  if (existing.ok) {
    const data = await existing.json();
    sha = data.sha;
  }

  const res = await fetch(`${GITHUB_API}/repos/${o}/${repo}/contents/${path}`, {
    method: "PUT",
    headers: headers(token),
    body: JSON.stringify({
      message,
      content: base64Content,
      ...(sha ? { sha } : {}),
    }),
  });

  if (!res.ok) {
    throw new Error(`バイナリファイルpush失敗 (${path}): ${res.status}`);
  }
}
