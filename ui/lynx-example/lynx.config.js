import { defineConfig } from "@lynx-js/rspeedy";
import { pluginMyReactLynx } from "@my-react/react-lynx/plugin";

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
      // SEE https://github.com/MrWangJustToDo/myreact-devtools
      // use pnpm run dev:websocket to debug lynx app
      // reactDevTool: true,
    }),
  ],
  environments: {
    web: {},
    lynx: {},
  },
});
