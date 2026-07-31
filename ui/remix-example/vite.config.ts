import { vitePlugin as remix } from "@remix-run/dev";
import react from "@my-react/react-vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

/**
 * Monorepo build caveat
 * --------------------
 * `@my-react/react` publishes a CJS entry (`packages/myreact/index.js` → `module.exports`).
 * With workspace / `npm:@my-react/react@*` links, Vite resolves `react` to that file.
 * Remix / React Router ship prebuilt ESM that do `import { createContext } from "react"`,
 * which often fails Rollup with:
 *   "createContext" is not exported by .../packages/myreact/index.js
 * See https://github.com/vitejs/vite/issues/12738
 *
 * Installing published npm tarballs (no workspace symlink) usually works.
 * Framework packages (@remix-run/*) cannot be removed; expect build to need non-link installs
 * or a proper ESM entry for `@my-react/react` when developing inside this monorepo.
 */
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
    // Default walks to the monorepo workspace root and parses every tsconfig.json
    // (including tmp/* clones that extend unpublished @tsconfig/* packages).
    tsconfigPaths({ projects: ["./tsconfig.json"] }),
  ],
  // Helps DEV resolve CJS workspace packages under Vite SSR
  ssr: {
    optimizeDeps: {
      include: ["react", "react/jsx-dev-runtime", "react/jsx-runtime", "react-dom", "react-dom/server", "react-dom/client", "@remix-run/react"],
    },
    noExternal: ["react", "react/jsx-dev-runtime", "react/jsx-runtime", "react-dom", "react-dom/server", "react-dom/client", "@remix-run/react"],
  },
});
