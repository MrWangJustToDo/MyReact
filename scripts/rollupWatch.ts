import { watch } from "rollup";

import { getRollupConfig } from "./rollupConfig";

import type { Mode, packages } from "./type";

const rollupWatch = async (packageName: packages, mode: Mode, isUMD: boolean) => {
  const rollupOptions = await getRollupConfig(packageName, mode, isUMD);

  // watch options
  rollupOptions.watch = {
    buildDelay: 300,
    exclude: ["node_modules"],
    clearScreen: true,
  };

  const watcher = watch(rollupOptions);

  watcher.on("event", (event) => {
    if (event.code === "BUNDLE_START") {
      console.log(`[watch] start build package ${packageName} with ${mode} mode ${isUMD ? "in umd format" : ""}`);
    }
    if (event.code === "BUNDLE_END") {
      console.log(`[watch] package ${packageName} with ${mode} mode ${isUMD ? "in umd format" : ""} build success!`);
    }
    if (event.code === "ERROR") {
      console.log(
        `[watch] package ${packageName} with ${mode} mode ${isUMD ? "in umd format" : ""} build error, ${
          event.error.stack
        }`
      );
    }
  });
};

rollupWatch("myreact", "development", false);
rollupWatch("myreact", "production", false);

rollupWatch("myreact", "development", true);
rollupWatch("myreact", "production", true);

rollupWatch("myreact-reconciler", "development", false);
rollupWatch("myreact-reconciler", "production", false);

rollupWatch("myreact-reconciler", "development", true);
rollupWatch("myreact-reconciler", "production", true);

rollupWatch("myreact-dom", "development", false);
rollupWatch("myreact-dom", "production", false);

rollupWatch("myreact-dom", "development", true);
rollupWatch("myreact-dom", "production", true);
