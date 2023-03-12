import { watch as rollup } from "rollup";

// import { copyMyReact, copyMyReactDOM } from "./cope";
import { getRollupConfig } from "./rollupConfig";

import type { packages } from "./type";
import type { RollupOptions } from "rollup";

const watch = (packageName: string, rollupOptions: RollupOptions, mode: string, isUMD: boolean) => {
  rollupOptions.watch = {
    buildDelay: 100,
  };

  const watcher = rollup(rollupOptions);

  watcher.on("event", (event) => {
    if (event.code === "BUNDLE_START") {
      // look like rollup watch have a bug for some usage

      console.log(`[watch] start build package ${packageName} with ${mode} mode ${isUMD ? "in umd format" : ""}`);
    }
    if (event.code === "BUNDLE_END") {
      if (event.result) event.result.close();

      console.log(`[watch] package ${packageName} with ${mode} mode ${isUMD ? "in umd format" : ""} build success!`);
    }
    if (event.code === "ERROR") {
      if (event.result) event.result.close();

      console.log(`[watch] package ${packageName} with ${mode} mode ${isUMD ? "in umd format" : ""} build error \n ${event.error.stack}`);
    }
  });
};

const rollupWatch = async (packageName: packages) => {
  const { allOtherDev, allUMDDev, allSingleOther } = await getRollupConfig(packageName);

  if (allOtherDev) {
    watch(packageName, allOtherDev, "development", false);
  }

  if (allSingleOther) {
    watch(packageName, allSingleOther, "process.env", false);
  }

  if (allUMDDev) {
    watch(packageName, allUMDDev, "development", true);
  }
};

rollupWatch("myreact-shared");

rollupWatch("myreact");

rollupWatch("myreact-jsx");

rollupWatch("myreact-reactivity");

rollupWatch("myreact-reconciler");

rollupWatch("myreact-dom");
