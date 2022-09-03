import { rollup } from "rollup";

import { getRollupConfig } from "./rollupConfig";

import type { Mode, packages } from "./type";
import type { OutputOptions } from "rollup";

const rollupBuild = async (packageName: packages, mode: Mode, isUMD: boolean) => {
  const rollupOptions = await getRollupConfig(packageName, mode, isUMD);
  console.log(`[build] start build package ${packageName} with ${mode} mode ${isUMD ? "in umd format" : ""}`);
  try {
    const { output, ...options } = rollupOptions;
    const bundle = await rollup(options);
    await Promise.all((output as OutputOptions[]).map((output) => bundle.write(output)));
  } catch (e) {
    console.error(
      `[build] build package ${packageName} with ${mode} mode ${isUMD ? "in umd format" : ""} error, ${
        (e as Error).message
      }`
    );
    throw e;
  }
  console.log(`[build] build package ${packageName} with ${mode} mode ${isUMD ? "in umd format" : ""} success`);
};

const start = async () => {
  await Promise.all([
    rollupBuild("myreact", "development", false),
    rollupBuild("myreact", "production", false),
    rollupBuild("myreact", "development", true),
    rollupBuild("myreact", "production", true),
  ]);
  await Promise.all([
    rollupBuild("myreact-reconciler", "development", false),
    rollupBuild("myreact-reconciler", "production", false),
    rollupBuild("myreact-reconciler", "development", true),
    rollupBuild("myreact-reconciler", "production", true),
  ]);
  await Promise.all([
    rollupBuild("myreact-dom", "development", false),
    rollupBuild("myreact-dom", "production", false),
    rollupBuild("myreact-dom", "development", true),
    rollupBuild("myreact-dom", "production", true),
  ]);
  process.exit(0);
};

start();
