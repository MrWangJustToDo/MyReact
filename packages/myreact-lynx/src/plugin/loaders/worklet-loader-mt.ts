/**
 * Webpack loader for the Main Thread (LEPUS) layer.
 *
 * Applied to .js/.ts/.tsx files when imported from the MT entry.
 * For each file:
 * 1. Extract local (relative-path) imports to preserve webpack dep graph
 * 2. Quick-check for 'main thread' directive — skip LEPUS transform if absent
 * 3. SWC with target='LEPUS' → produces registerWorkletInternal calls
 * 4. Extract only registerWorkletInternal(...) calls
 * 5. Return local imports + extracted registrations as module content
 *
 * Files without 'main thread' directives return only their local imports.
 * This preserves the dependency chain so webpack can reach files that DO
 * contain worklet registrations.
 *
 * NOTE: We intentionally do NOT preserve dynamic imports on the MT layer.
 * This would create empty async chunks that cause build errors. Lazy loading
 * works via the BG layer's async chunks only.
 */

import { transformReactLynxSync } from "@lynx-js/react/transform";

import { extractLocalImports, extractRegistrations, extractSharedImports } from "./worklet-utils.js";

import type { Rspack } from "@rsbuild/core";

export default function workletLoaderMT(this: Rspack.LoaderContext, source: string): string {
  this.cacheable(true);

  // Preserve local (relative-path) imports so webpack follows the dependency
  // graph to sub-modules that may contain worklet registrations.
  const localImports = extractLocalImports(source);

  // Quick check: skip LEPUS transform for files without 'main thread' directive
  // (but still extract shared imports from source since they don't need LEPUS)
  if (!source.includes("'main thread'") && !source.includes('"main thread"')) {
    const sharedImports = extractSharedImports(source);
    if (!sharedImports) {
      return localImports || "";
    }
    return sharedImports + (localImports ? `\n${localImports}` : "");
  }

  const resourcePath = this.resourcePath;
  const filename = resourcePath;

  // LEPUS target — extracts registerWorkletInternal calls
  // IMPORTANT: snapshot: false disables ReactLynx's JSX snapshot transformation
  // which generates ReactLynx-specific code (__DynamicPartSlot, etc.)
  // MyReact uses standard React JSX rendering, so we only need the worklet transform.
  // dynamicImport: false disables ReactLynx's lazy bundle transformation.
  const lepusResult = transformReactLynxSync(source, {
    pluginName: "myreact:worklet-mt",
    filename,
    sourcemap: false,
    snapshot: false,
    cssScope: false,
    shake: false,
    compat: false,
    refresh: false,
    defineDCE: false,
    directiveDCE: false,
    dynamicImport: false,
    worklet: {
      target: "LEPUS",
      filename,
      runtimePkg: "@my-react/react-lynx",
    },
  });

  if (lepusResult.errors.length > 0) {
    for (const err of lepusResult.errors) {
      this.emitError(new Error(`[worklet-loader-mt] LEPUS transform: ${err.text}`));
    }
    return localImports || "";
  }

  // Extract shared imports from the LEPUS output (SWC preserves them)
  const sharedImports = extractSharedImports(lepusResult.code);

  // Return shared imports + local imports (for dep graph) + extracted registrations
  const registrations = extractRegistrations(lepusResult.code);
  const parts = [sharedImports, localImports, registrations].filter(Boolean);
  return parts.join("\n");
}
