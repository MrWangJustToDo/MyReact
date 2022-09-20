import { resolve } from "path";
import { watch as rollup } from "rollup";

// import { copyMyReact, copyMyReactDOM } from "./cope";
import { getRollupConfig } from "./rollupConfig";

import type { packages } from "./type";
import type { RollupOptions } from "rollup";

const watch = (packageName: string, rollupOptions: RollupOptions, mode: string, isUMD: boolean) => {
  rollupOptions.watch = {
    buildDelay: 300,
    exclude: isUMD ? [] : ["node_modules"],
    include: resolve(process.cwd(), "packages", packageName, "src/**/*"),
    chokidar: {
      usePolling: true,
    },
    clearScreen: true,
  };

  const watcher = rollup(rollupOptions);

  watcher.on("event", (event) => {
    if (event.code === "BUNDLE_START") {
      console.log(`[watch] start build package ${packageName} with ${mode} mode ${isUMD ? "in umd format" : ""}`);
    }
    if (event.code === "BUNDLE_END") {
      // if (packageName === "myreact") copyMyReact();

      // if (packageName === "myreact-dom") copyMyReactDOM();

      console.log(`[watch] package ${packageName} with ${mode} mode ${isUMD ? "in umd format" : ""} build success!`);
    }
    if (event.code === "ERROR") {
      console.log(`[watch] package ${packageName} with ${mode} mode ${isUMD ? "in umd format" : ""} build error \n ${event.error.stack}`);
    }
    // console.log(event.code);
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

rollupWatch("myreact");

// rollupWatch("myreact-reconciler");

// rollupWatch("myreact-dom");
