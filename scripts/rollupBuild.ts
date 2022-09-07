import { rollup } from "rollup";

import { getRollupConfig } from "./rollupConfig";

import type { Mode, packages } from "./type";
import type { OutputOptions, RollupOptions } from "rollup";

const build = async (packageName: string, rollupOptions: RollupOptions, mode: Mode, isUMD: boolean) => {
  console.log(`[build] start build package ${packageName} with ${mode} mode ${isUMD ? "in umd format" : ""}`);
  try {
    const { output, ...options } = rollupOptions;
    const bundle = await rollup(options);
    await Promise.all((output as OutputOptions[]).map((output) => bundle.write(output)));
  } catch (e) {
    console.error(
      `[build] build package ${packageName} with ${mode} mode ${isUMD ? "in umd format error" : "error"}, ${
        (e as Error).message
      }`
    );
    throw e;
  }
  console.log(`[build] build package ${packageName} with ${mode} mode ${isUMD ? "in umd format success" : "success"}`);
};

const rollupBuild = async (packageName: packages) => {
  const { allDevBuild, allProdBuild } = await getRollupConfig(packageName);

  const all = [];

  if (allDevBuild.other) {
    const option = allDevBuild.other;
    all.push(() => build(packageName, option, "development", false));
  }
  if (allDevBuild.umd) {
    const option = allDevBuild.umd;
    all.push(() => build(packageName, option, "development", true));
  }
  if (allProdBuild.other) {
    const option = allProdBuild.other;
    all.push(() => build(packageName, option, "production", false));
  }
  if (allProdBuild.umd) {
    const option = allProdBuild.umd;
    all.push(() => build(packageName, option, "production", true));
  }
  await Promise.all(all.map((f) => f()));
};

const start = async () => {
  await rollupBuild("myreact");
  await rollupBuild("myreact-reconciler");
  // await rollupBuild("myreact-dom");
  process.exit(0);
};

start();
