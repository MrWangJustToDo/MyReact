import { defineConfig } from "@lynx-js/rspeedy";
import { pluginQRCode } from "@lynx-js/qrcode-rsbuild-plugin";
import { pluginMyReactLynx } from "@my-react/react-lynx/plugin";

export default defineConfig({
  source: {
    entry: {
      main: "./src/index.tsx",
    },
  },
  plugins: [
    pluginMyReactLynx({
      reactRefresh: true,
      // SEE https://github.com/MrWangJustToDo/myreact-devtools
      // use pnpm run dev:websocket to debug lynx app
      // reactDevTool: true,
      reactDevTool: {
        // wsUrl: 'ws://192.168.0.100:3002/ws'
      }
    }),
    pluginQRCode({
      schema(url) {
        // We use `?fullscreen=true` to open the page in LynxExplorer in full screen mode
        return `${url}?fullscreen=true`;
      },
    }),
  ],
  environments: {
    web: {},
    lynx: {},
  },
});
