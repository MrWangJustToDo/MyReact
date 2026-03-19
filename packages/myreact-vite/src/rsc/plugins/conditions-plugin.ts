/**
 * @file RSC Conditions Plugin
 * Configure resolve conditions for React Server Components
 */

import type { Plugin } from "vite";

/**
 * Create the RSC conditions plugin
 * Adds "react-server" to resolve conditions
 */
export function createConditionsPlugin(): Plugin {
  return {
    name: "vite:my-react-rsc-conditions",
    enforce: "pre",

    config() {
      return {
        resolve: {
          conditions: ["react-server"],
        },
      };
    },
  };
}
