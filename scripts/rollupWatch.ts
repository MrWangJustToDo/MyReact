import { watch as rollup } from "rollup";

import { copyMyReact, copyMyReactDOM } from "./cope";
import { getRollupConfig } from "./rollupConfig";

import type { packages } from "./type";
import type { RollupOptions } from "rollup";

const obj: Record<string, NodeJS.Timeout> = {};

const watch = (packageName: string, rollupOptions: RollupOptions, mode: string, isUMD: boolean) => {
  rollupOptions.watch = {
    buildDelay: 300,
    exclude: isUMD ? [] : ["node_modules"],
    clearScreen: true,
  };

  const watcher = rollup(rollupOptions);

  const watchKey = `${packageName}_${mode}_${isUMD ? "umd" : "other"}`;

  watcher.on("event", (event) => {
    if (event.code === "BUNDLE_START") {
      // look like rollup watch have a bug for some usage

      // give ten seconds to exit rollup watch process,
      obj[watchKey] = setTimeout(() => {
        console.error("[watch] rebuild process not complete for a long time, look like a rollup bug, will exit rollup watch process!");
        process.exit(0);
      }, 10000);

      console.log(`[watch] start build package ${packageName} with ${mode} mode ${isUMD ? "in umd format" : ""}`);
    }
    if (event.code === "BUNDLE_END") {
      if (packageName === "myreact") copyMyReact();

      if (packageName === "myreact-dom") copyMyReactDOM();

      // cancel exit process
      clearTimeout(obj[watchKey]);

      console.log(`[watch] package ${packageName} with ${mode} mode ${isUMD ? "in umd format" : ""} build success!`);
    }
    if (event.code === "ERROR") {
      clearTimeout(obj[watchKey]);

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

rollupWatch("myreact-reconciler");

rollupWatch("myreact-dom");
