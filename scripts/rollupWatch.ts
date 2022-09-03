import type { RollupOptions } from "rollup";
import { watch as rollup } from "rollup";

import { getRollupConfig } from "./rollupConfig";

import type { Mode, packages } from "./type";

const watch = (packageName: string, rollupOptions: RollupOptions, mode: Mode, isUMD: boolean) => {
  rollupOptions.watch = {
    buildDelay: 300,
    exclude: ["node_modules"],
    clearScreen: true,
  };

  const watcher = rollup(rollupOptions);

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

const rollupWatch = async (packageName: packages) => {
  const { allDevBuild } = await getRollupConfig(packageName);

  if (allDevBuild.other) {
    const option = allDevBuild.other;
    watch(packageName, option, "development", false);
  }
  if (allDevBuild.umd) {
    const option = allDevBuild.umd;
    watch(packageName, option, "development", true);
  }
};

rollupWatch("myreact");

rollupWatch("myreact-reconciler");

rollupWatch("myreact-dom");
