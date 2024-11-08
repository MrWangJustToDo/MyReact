import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import react from "@my-react/react-vite";
import tsconfigPaths from "vite-tsconfig-paths";

// !build will fail when using monorepo symlinks, npm install works fine, so build always fails in this case
export default defineConfig({
  plugins: [
    react({ remix: true }),
    remix({
      future: {
        // v3_singleFetch: true,
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
      },
    }),
    tsconfigPaths(),
  ],
  ssr: {
    optimizeDeps: {
      include: [
        "@my-react/react",
        "@my-react/react-dom",
        "@my-react/react-dom/server",
        "@my-react/react-dom/client",
        "@my-react/react/jsx-runtime",
        "@my-react/react/jsx-dev-runtime",
        "@remix-run/react",
      ],
    },
    noExternal: [
      "@my-react/react",
      "@my-react/react-dom",
      "@my-react/react-dom/server",
      "@my-react/react-dom/client",
      "@my-react/react/jsx-runtime",
      "@my-react/react/jsx-dev-runtime",
      "@remix-run/react",
    ],
  },
});
