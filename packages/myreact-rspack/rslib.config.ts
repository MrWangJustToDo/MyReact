import { defineConfig } from "@rslib/core";

export default defineConfig({
  lib: [
    {
      format: "esm",
      syntax: "es2021",
      bundle: true,
      dts: true,
    },
  ],
  source: {
    entry: {
      index: "./src/index.ts",
    },
  },
  output: {
    distPath: { root: "dist" },
    externals: ["@rspack/core"],
  },
});
