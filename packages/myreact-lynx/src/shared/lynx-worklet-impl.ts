/**
 * Typed access to the host `lynxWorkletImpl` global (from worklet-runtime).
 * Prefer this over `globalThis as …` casts.
 */

export function getLynxWorkletImpl(): typeof lynxWorkletImpl | undefined {
  return typeof lynxWorkletImpl !== "undefined" ? lynxWorkletImpl : undefined;
}
