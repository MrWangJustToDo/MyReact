/**
 * Webpack / Rspack module layers for Lynx dual-thread bundles.
 *
 * Layering is stable and on by default in Rspack 2 (no `experiments.layers`).
 * Entries set `layer` (below); rules match with `issuerLayer` so the same
 * filesystem path compiles twice — e.g. `(myreact:background)/…pkg…` vs
 * `(myreact:main-thread)/…pkg…` — with BG worklet JS transform vs MT
 * registration stitch. MT may strip package exports; that does not affect BG.
 */
export const LAYERS = {
  BACKGROUND: "myreact:background",
  MAIN_THREAD: "myreact:main-thread",
} as const;

export type LayerType = (typeof LAYERS)[keyof typeof LAYERS];
