/**
 * Built-in allowlist for worklet-loader / worklet-loader-mt.
 *
 * Loaders exclude most of `node_modules`; these packages still need:
 * - BG JS worklet transform + MT bare `registerWorkletInternal` stitch
 * - `sideEffects: true` so stitches are not tree-shaken
 * - MT side-effect import keep when app code imports them
 *
 * Users can append more via `pluginMyReactLynx({ includeWorkletPackages })`.
 */

/** Packages that ship consumer-facing untransformed worklets. */
export const WORKLET_NODE_MODULES_PACKAGES = ["@lynx-js/gesture-runtime", "@lynx-js/motion"] as const;

/**
 * Merge user packages onto the default allowlist (deduped, order: defaults first).
 */
export function resolveWorkletPackages(includeWorkletPackages?: readonly string[]): string[] {
  const merged = [...WORKLET_NODE_MODULES_PACKAGES, ...(includeWorkletPackages ?? [])];
  return [...new Set(merged.map((pkg) => pkg.trim()).filter(Boolean))];
}

/**
 * Webpack `exclude` predicate: skip `node_modules` except worklet packages.
 * Function form required for pnpm's `node_modules/.pnpm/...` layout.
 */
export function createNodeModulesExceptWorkletPackagesExclude(packages: readonly string[] = WORKLET_NODE_MODULES_PACKAGES): (resourcePath: string) => boolean {
  const pkgMatchers = packages.map((pkg) => {
    const escaped = pkg.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\//g, "[\\\\/]");
    return new RegExp(`[\\\\/]${escaped}([\\\\/]|$)`);
  });

  return (resourcePath: string) => {
    if (pkgMatchers.some((re) => re.test(resourcePath))) {
      return false;
    }
    return /[\\/]node_modules[\\/]/.test(resourcePath);
  };
}

/** Regex for `sideEffects: true` (packages often declare sideEffects: false). */
export function createWorkletPackagesPathTest(packages: readonly string[] = WORKLET_NODE_MODULES_PACKAGES): RegExp {
  const alts = packages.map((pkg) => pkg.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\//g, "[\\\\/]"));
  return new RegExp(`[\\\\/](?:${alts.join("|")})[\\\\/]`);
}
