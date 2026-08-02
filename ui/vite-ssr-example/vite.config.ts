import react from "@my-react/react-vite";
import { defineConfig } from "vite";

/**
 * Monorepo notes
 * -------------
 * `react` / `react-dom` resolve to workspace CJS (`packages/myreact/index.js`).
 * `@my-react/react-vite` sets `build.commonjsOptions.include` so Rollup interops
 * those entries (otherwise: `"useState" is not exported by .../index.js`).
 *
 * Prebuilt third-party ESM (react-router, framer-motion, …) that do
 * `import { createContext } from "react"` can still fail against CJS react;
 * this example avoids those deps. See https://github.com/vitejs/vite/issues/12738
 */
export default defineConfig({
  ssr: {
    optimizeDeps: {
      include: ["react", "react-dom", "react-dom/server", "react-dom/client", "react/jsx-runtime", "react/jsx-dev-runtime", "react-compiler-runtime"],
    },
    noExternal: ["react", "react-dom", "react-dom/server", "react-dom/client", "react/jsx-runtime", "react/jsx-dev-runtime", "react-compiler-runtime"],
  },
  plugins: [
    react({
      babel: {
        plugins: [
          [
            "babel-plugin-react-compiler",
            {
              target: "18",
            },
          ],
        ],
      },
    }),
  ],
});
