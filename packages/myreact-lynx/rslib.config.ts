import { defineConfig } from "@rslib/core";

/**
 * Remap `@my-react/react/type` → `@my-react/react` in emitted JS.
 *
 * In rslib bundleless mode, once a request matches `output.externals`, redirect
 * is controlled by the externals mapping (not resolve.alias alone).
 * DTS still needs `scripts/rewrite-react-type.mjs` (tsc does not use externals).
 */
export default defineConfig({
  lib: [
    {
      format: "esm",
      syntax: "es2019",
      bundle: false,
      dts: true,
    },
  ],
  source: {
    entry: {
      index: ["./src/**/*.[t|j]s"],
    },
    tsconfigPath: "./tsconfig.build.json",
  },
  resolve: {
    alias: {
      "@my-react/react/type$": "@my-react/react",
      "@my-react/react/type": "@my-react/react",
    },
  },
  output: {
    distPath: { root: "dist" },
    externals: [
      { "@my-react/react/type": "@my-react/react" },
      "@lynx-js/type-element-api",
      "@lynx-js/types",
      "@lynx-js/react",
      "@lynx-js/gesture-runtime",
      "@lynx-js/react/transform",
      "@lynx-js/react/internal",
      "@lynx-js/runtime-wrapper-webpack-plugin",
      "@lynx-js/template-webpack-plugin",
      "@rspack/core",
      "@rsbuild/core",
      "@lynx-js/rspeedy",
      "@my-react/react",
      "@my-react/react-refresh",
      "@my-react/react-refresh-tools",
      // In bundleless mode every request is externalized by default. Returning
      // `false` from the externals matcher opts a dependency back into the
      // bundle, inlining its code (and its own relative imports) into dist.
      ({ request, contextInfo }, callback) => {
        if (
          request === "@my-react/react-reconciler-compact" ||
          request?.startsWith("@my-react/react-reconciler-compact/") ||
          contextInfo?.issuer?.includes("node_modules/@my-react/react-reconciler-compact")
        ) {
          callback(undefined, false);
          return;
        }
        callback();
      },
    ],
  },
});
