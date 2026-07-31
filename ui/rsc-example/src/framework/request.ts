/**
 * Same-origin page URL for Flight renders (A1).
 * Accepts absolute same-origin http(s) URLs or paths starting with `/`.
 */
export function resolveSameOriginPageUrl(rawUrl: string | null | undefined, hostHeader: string | null): string | null {
  if (!rawUrl || typeof rawUrl !== "string") {
    return null;
  }

  if (!hostHeader) {
    return null;
  }

  const origin = `http://${hostHeader}`;

  try {
    if (rawUrl.startsWith("/") && !rawUrl.startsWith("//")) {
      return new URL(rawUrl, origin).toString();
    }

    const parsed = new URL(rawUrl);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return null;
    }
    if (parsed.host !== hostHeader) {
      return null;
    }
    return parsed.toString();
  } catch {
    return null;
  }
}

export function jsonResponse(status: number, body: Record<string, unknown>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
