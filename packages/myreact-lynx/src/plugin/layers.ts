/** Webpack module layers used to separate the dual-thread bundles. */
export const LAYERS = {
  BACKGROUND: "myreact:background",
  MAIN_THREAD: "myreact:main-thread",
} as const;

export type LayerType = (typeof LAYERS)[keyof typeof LAYERS];
