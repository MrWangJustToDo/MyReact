import react from "@my-react/react-vite";
// import react from '@vitejs/plugin-react';
import { defineConfig } from "vite";

// !SEE https://github.com/vitejs/vite/issues/12738
// !build will fail when using monorepo symlinks, npm install works fine, so build always fails in this case
// https://vitejs.dev/config/
export default defineConfig({
  ssr: {
    // switch to react need disable all the config below
    optimizeDeps: {
      include: [
        "@my-react/react",
        "@my-react/react-dom",
        "@my-react/react-dom/server",
        "@my-react/react-dom/client",
        "@my-react/react/jsx-runtime",
        "@my-react/react/jsx-dev-runtime",
        "react-router",
        "react-router-dom",
        "react-router-dom/server",
        "framer-motion",
        "react-compiler-runtime"
      ],
    },
    noExternal: [
      "@my-react/react",
      "@my-react/react-dom",
      "@my-react/react-dom/server",
      "@my-react/react-dom/client",
      "@my-react/react/jsx-runtime",
      "@my-react/react/jsx-dev-runtime",
      "react-router",
      "react-router-dom",
      "react-router-dom/server",
      "framer-motion",
      "react-compiler-runtime"
    ],
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
