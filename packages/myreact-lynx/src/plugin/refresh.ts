/**
 * React Refresh (HMR) integration for MyReact Lynx.
 *
 * Applies the refresh loader and plugin to enable hot module replacement
 * for React components in the Lynx dual-thread architecture.
 */

import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { LAYERS } from "./layers.js";
import { ReactRefreshRspackPlugin } from "./plugins";

import type { ChainIdentifier, RsbuildPluginAPI, RspackChain } from "@rsbuild/core";

export { ReactRefreshRspackPlugin };
export type { ReactRefreshRspackPluginOptions } from "./plugins";

const __filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(__filename);

const require = createRequire(__filename);

const myReactLynxRoot = path.resolve(_dirname, "../..");

const PLUGIN_NAME_REACT_REFRESH = "lynx:myreact:refresh";

export function applyRefresh(api: RsbuildPluginAPI): void {
  api.modifyWebpackChain?.(async (chain, { CHAIN_ID, isProd }) => {
    if (!isProd) {
      await applyRefreshRules(api, chain, CHAIN_ID, ReactRefreshRspackPlugin);
    }
  });
  api.modifyBundlerChain(async (chain, { isProd, CHAIN_ID }) => {
    if (!isProd) {
      await applyRefreshRules(api, chain, CHAIN_ID, ReactRefreshRspackPlugin);
    }
  });
}

async function applyRefreshRules(api: RsbuildPluginAPI, chain: RspackChain, CHAIN_ID: ChainIdentifier, ReactRefreshPlugin: typeof ReactRefreshRspackPlugin) {
  const reactRuntime = myReactLynxRoot;
  const refresh = require.resolve("@my-react/react-refresh-tools");

  // Place the ReactRefreshRspackPlugin at beginning to make the `react-refresh`
  // being injected at first.
  // dprint-ignore
  chain
    .plugin(PLUGIN_NAME_REACT_REFRESH)
    .before(CHAIN_ID.PLUGIN.HMR)
    .use(ReactRefreshPlugin)
    .end()
    .module.rule("react:refresh")
    .issuerLayer(LAYERS.BACKGROUND)
    .before(CHAIN_ID.RULE.JS)
    .test(/\.[jt]sx$/)
    .exclude.add(/node_modules/)
    .add(path.dirname(reactRuntime))
    .add(path.dirname(refresh))
    .add(ReactRefreshPlugin.loader)
    .end()
    .use("ReactRefresh")
    .loader(ReactRefreshPlugin.loader)
    .options({})
    .end()
    .end()
    .end()
    .end();
}
