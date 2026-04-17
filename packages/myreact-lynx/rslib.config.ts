import { defineConfig } from "@rslib/core";

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
  output: {
    distPath: { root: "dist" },
    externals: [
      "@lynx-js/type-element-api",
      "@lynx-js/types",
      "@lynx-js/react",
      "@lynx-js/react/transform",
      "@lynx-js/runtime-wrapper-webpack-plugin",
      "@lynx-js/template-webpack-plugin",
      "@rspack/core",
      "@rsbuild/core",
      "@lynx-js/rspeedy",
    ],
  },
});
