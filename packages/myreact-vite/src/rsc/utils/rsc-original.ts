/**
 * Internal query used by the SSR graph to load the real implementation of a
 * `"use client"` module (skip RSC proxy transform).
 *
 * Must only be appended by our plugin (`dev-server-plugin` / SSR loader).
 * Transform honors it only when the current environment is SSR.
 */
export const RSC_SSR_ORIGINAL_QUERY = "__my_react_rsc_ssr_original";

export function hasRscSsrOriginalQuery(rawQuery: string | undefined): boolean {
  if (!rawQuery) return false;
  // Match as a full query param name (start, &, or ?)
  return new RegExp(`(?:^|&)${RSC_SSR_ORIGINAL_QUERY}(?:&|=|$)`).test(rawQuery);
}

export function withRscSsrOriginalQuery(moduleId: string): string {
  const sep = moduleId.includes("?") ? "&" : "?";
  return `${moduleId}${sep}${RSC_SSR_ORIGINAL_QUERY}`;
}
