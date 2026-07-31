/**
 * @file RSC Conditions Plugin
 * Configure resolve conditions for React Server Components
 *
 * NOTE: `react-server` must only apply to the `rsc` environment.
 * Applying it globally (client/ssr) can resolve server-only exports into
 * the wrong graphs. The build-config plugin already sets RSC conditions on
 * `environments.rsc`; this plugin reinforces that via `configEnvironment`.
 */

import type { Plugin } from "vite";

/**
 * Create the RSC conditions plugin
 * Adds "react-server" to resolve conditions for the `rsc` environment only
 */
export function createConditionsPlugin(): Plugin {
  return {
    name: "vite:my-react-rsc-conditions",
    enforce: "pre",

    configEnvironment(name) {
      if (name !== "rsc") {
        return;
      }

      return {
        resolve: {
          conditions: ["react-server", "node", "import"],
          // Keep in sync with build-plugin SERVER_NO_EXTERNAL_PACKAGES — CJS entries need Vite transform
          noExternal: [
            "server-only",
            "client-only",
            "react",
            "react-dom",
            "@my-react/react",
            "@my-react/react-dom",
            "@my-react/react-server",
            "@my-react/react-jsx",
            "react-compiler-runtime",
            "rsc-html-stream",
          ],
        },
      };
    },
  };
}
