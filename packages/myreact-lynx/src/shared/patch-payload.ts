/**
 * BG→MT ops patch payload.
 *
 * Legacy format: bare `unknown[]` ops array (first-screen inferred on MT).
 */
export interface PatchPayload {
  ops: unknown[];
  isFirstScreen?: boolean;
  endFirstScreen?: boolean;
}

export function parsePatchPayload(data: string): PatchPayload {
  const parsed: unknown = JSON.parse(data);
  if (Array.isArray(parsed)) {
    return { ops: parsed };
  }
  const payload = parsed as PatchPayload;
  return {
    ops: Array.isArray(payload.ops) ? payload.ops : [],
    isFirstScreen: payload.isFirstScreen,
    endFirstScreen: payload.endFirstScreen,
  };
}
