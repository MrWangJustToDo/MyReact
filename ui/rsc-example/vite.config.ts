import react from "@my-react/react-vite";
import { rsc } from "@my-react/react-vite/rsc";
import { defineConfig } from "vite";
import inspect from "vite-plugin-inspect";

const sharedSsrConfig = {
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-dom/server",
      "react-dom/client",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "@my-react/react/jsx-runtime",
      "@my-react/react/jsx-dev-runtime",
      "@my-react/react",
      "@my-react/react-dom",
      "@my-react/react-dom/client",
      "@my-react/react-dom/server",
      "@my-react/react-jsx",
      "react-compiler-runtime",
    ],
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
  ssr: sharedSsrConfig,
  plugins: [
    inspect(),
    react({
      babel: babelConfig,
    }),
    // Unified RSC plugin - works for both dev and build
    rsc({
      entries: {
        rsc: "./src/entry-rsc.tsx",
        ssr: "./src/entry-ssr.tsx",
        client: "./src/entry-client.tsx",
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
