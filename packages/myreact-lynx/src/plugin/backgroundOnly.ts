import path from "node:path";
import { fileURLToPath } from "node:url";

import { LAYERS } from "./layers.js";

import type { RsbuildPluginAPI } from "@rsbuild/core";

const DETECT_IMPORT_ERROR = "myreact:detect-import-error";
const ALIAS_BACKGROUND_ONLY_MAIN = "myreact:alias-background-only-main";
const ALIAS_BACKGROUND_ONLY_BACKGROUND = "myreact:alias-background-only-background";

export function applyBackgroundOnly(api: RsbuildPluginAPI): void {
  api.modifyBundlerChain((chain) => {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const myReactLynxRoot = path.resolve(__dirname, "../..");
    const shimRoot = path.resolve(myReactLynxRoot, "shims/background-only");
    const backgroundOnly = path.resolve(shimRoot, "empty.js");
    const backgroundOnlyMainThread = path.resolve(shimRoot, "error.js");

    chain.module.rule(ALIAS_BACKGROUND_ONLY_MAIN).issuerLayer(LAYERS.MAIN_THREAD).resolve.alias.set("background-only$", backgroundOnlyMainThread);

    chain.module.rule(ALIAS_BACKGROUND_ONLY_BACKGROUND).issuerLayer(LAYERS.BACKGROUND).resolve.alias.set("background-only$", backgroundOnly);

    chain.module
      .rule(DETECT_IMPORT_ERROR)
      .test(backgroundOnlyMainThread)
      .issuerLayer(LAYERS.MAIN_THREAD)
      .use(DETECT_IMPORT_ERROR)
      .loader(path.resolve(__dirname, "./loaders/invalid-import-error-loader"))
      .options({
        message: "'background-only' cannot be imported from a main-thread module.",
      });
  });
}
