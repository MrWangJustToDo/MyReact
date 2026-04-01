import react from "@my-react/react-vite";
import { defineConfig } from "vite";
import inspect from "vite-plugin-inspect";

export default defineConfig({
  ssr: {
    // switch to react need disable all the config below
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
        "@my-react/react/jsx-runtime",
        "@my-react/react/jsx-dev-runtime",
        "react-compiler-runtime",
      ],
    },
    noExternal: [
      "react",
      "react-dom",
      "react-dom/server",
      "react-dom/client",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "@my-react/react",
      "@my-react/react/jsx-runtime",
      "@my-react/react/jsx-dev-runtime",
      "@my-react/react-dom",
      "@my-react/react-dom/client",
      "@my-react/react-dom/server",
      "@my-react/react-jsx",
      "@my-react/react/jsx-runtime",
      "@my-react/react/jsx-dev-runtime",
      "react-compiler-runtime",
    ],
  },
  plugins: [
    inspect(),
    react({
      rsc: true,
      rscEndpoint: "/__rsc",
      rscActionEndpoint: "/__rsc_action",
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
  server: {
    port: 3000,
  },
});
