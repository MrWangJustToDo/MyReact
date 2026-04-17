import { defineConfig } from "@lynx-js/rspeedy";
import { pluginMyReactLynx } from "@my-react/react-lynx/plugin";
import { pluginNodePolyfill } from "@rsbuild/plugin-node-polyfill";

export default defineConfig({
  source: {
    entry: {
      main: "./src/index.tsx",
    },
  },
  plugins: [
    pluginMyReactLynx({
      // Enable worklet transform to support 'main thread' directive functions
      enableWorkletTransform: true,
      reactRefresh: true,
    }),
    pluginNodePolyfill(),
  ],
  environments: {
    web: {},
    lynx: {},
  },
});
