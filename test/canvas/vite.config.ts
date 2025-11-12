import _react from "@my-react/react-vite";
// import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// !SEE https://github.com/vitejs/vite/issues/12738
// !build will fail when using monorepo symlinks, npm install works fine, so build always fails in this case
// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "react-reconciler": "@my-react/react-reconciler-compact",
    }
  },
  ssr: {
    // switch to react need disable all the config below
    optimizeDeps: {
      include: [
        "react",
        "react-reconciler",
        "react-dom",
        "react-dom/server",
        "react-dom/client",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "react-router",
        "react-router-dom",
        "react-router-dom/server",
        "react-compiler-runtime",
      ],
    },
    noExternal: [
      "react",
      "react-dom",
      "react-reconciler",
      "react-dom/server",
      "react-dom/client",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "react-router",
      "react-router-dom",
      "react-router-dom/server",
      "react-compiler-runtime",
    ],
  },
  plugins: [
    _react({
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
    // react(),
  ],
});
