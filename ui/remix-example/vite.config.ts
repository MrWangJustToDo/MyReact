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
        v3_singleFetch: true,
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
      },
    }),
    tsconfigPaths(),
  ],
  // only need for local monorepo symlinks
  ssr: {
    optimizeDeps: {
      include: ["react", "react/jsx-dev-runtime", "react/jsx-runtime", "react-dom", "react-dom/server", "react-dom/client", "@remix-run/react"],
    },
    noExternal: ["react", "react/jsx-dev-runtime", "react/jsx-runtime", "react-dom", "react-dom/server", "react-dom/client", "@remix-run/react"],
  },
});
