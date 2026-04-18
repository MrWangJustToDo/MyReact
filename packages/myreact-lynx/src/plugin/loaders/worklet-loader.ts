/**
 * Webpack loader that runs the SWC worklet transform on Background layer files.
 *
 * For each file in the Background layer:
 * 1. Quick-check for 'main thread' directive — skip files without it
 * 2. SWC with target='JS' → replaces worklet functions with context objects
 * 3. Append HMR invalidation code to force full reload on worklet file changes
 * 4. Return the JS output to webpack
 *
 * LEPUS registration extraction is handled separately by worklet-loader-mt
 * on the Main Thread layer, which provides natural per-entry isolation
 * via webpack's dependency graph.
 */

import { transformReactLynxSync } from "@lynx-js/react/transform";

import type { Rspack } from "@rsbuild/core";

export default function workletLoader(this: Rspack.LoaderContext, source: string): string {
  this.cacheable(true);

  // Quick check: skip files that don't contain the 'main thread' directive
  if (!source.includes("'main thread'") && !source.includes('"main thread"')) {
    return source;
  }

  const resourcePath = this.resourcePath;
  const filename = resourcePath;

  // JS target — replaces worklet functions with context objects
  // IMPORTANT: snapshot: false disables ReactLynx's JSX snapshot transformation
  // which generates ReactLynx-specific code (__DynamicPartSlot, etc.)
  // MyReact uses standard React JSX rendering, so we only need the worklet transform.
  // dynamicImport: false disables ReactLynx's lazy bundle transformation which
  // converts import() to __dynamicImport - MyReact uses standard React.lazy().
  const jsResult = transformReactLynxSync(source, {
    pluginName: "myreact:worklet",
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
      target: "JS",
      filename,
      runtimePkg: "@my-react/react-lynx",
    },
  });

  if (jsResult.errors.length > 0) {
    for (const err of jsResult.errors) {
      this.emitError(new Error(`[worklet-loader] JS transform: ${err.text}`));
    }
    return source;
  }

  return jsResult.code;
}
