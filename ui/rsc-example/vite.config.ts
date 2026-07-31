import react from "@my-react/react-vite";
import { rsc } from "@my-react/react-vite/rsc";
import { defineConfig } from "vite";
import inspect from "vite-plugin-inspect";

/**
 * SSR is on by default (starter-style: Flight → HTML → hydrate).
 * No-SSR: `RSC_SSR=0 pnpm dev` / `RSC_SSR=0 pnpm build` — shell + Flight only, browser createRoot.
 */
const enableSsr = process.env.RSC_SSR !== "0";

const sharedOptimizeDepsInclude = [
  "react",
  "react-dom",
  "react-dom/client",
  "react/jsx-runtime",
  "react/jsx-dev-runtime",
  "@my-react/react/jsx-runtime",
  "@my-react/react/jsx-dev-runtime",
  "@my-react/react",
  "@my-react/react-dom",
  "@my-react/react-dom/client",
  "@my-react/react-jsx",
  "@my-react/react-server",
  "react-compiler-runtime",
];

if (enableSsr) {
  sharedOptimizeDepsInclude.push("react-dom/server", "@my-react/react-dom/server");
}

const sharedSsrConfig = {
  optimizeDeps: {
    include: sharedOptimizeDepsInclude,
  },
  noExternal: ["react", "react-dom", "@my-react/react", "@my-react/react-dom", "@my-react/react-server", "react-compiler-runtime"],
};

const babelConfig = {
  plugins: [
    [
      "babel-plugin-react-compiler",
      {
        target: "18",
      },
    ],
  ],
};

export default defineConfig({
  define: {
    __RSC_ENABLE_SSR__: JSON.stringify(enableSsr),
  },
  ssr: sharedSsrConfig,
  plugins: [
    inspect(),
    react({
      babel: babelConfig,
    }),
    rsc({
      enableSsr,
      entries: enableSsr
        ? {
            rsc: "./src/framework/entry.rsc.tsx",
            ssr: "./src/framework/entry.ssr.tsx",
            client: "./src/framework/entry.browser.tsx",
          }
        : {
            rsc: "./src/framework/entry.rsc.tsx",
            client: "./src/framework/entry.browser.tsx",
          },
      rscEndpoint: "/__rsc",
      actionEndpoint: "/__rsc_action",
    }),
  ],
  server: {
    port: 3000,
  },
  build: {
    target: "esnext",
  },
});
