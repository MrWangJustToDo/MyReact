import { rollup } from "rollup";

// import { copyMyReact, copyMyReactDOM } from "./cope";
import { getRollupConfig } from "./rollupConfig";

import type { packages } from "./type";
import type { OutputOptions, RollupOptions, RollupBuild } from "rollup";

const build = async (packageName: string, rollupOptions: RollupOptions, mode: string, isUMD: boolean) => {
  console.log(`[build] start build package '${packageName}' with ${mode} mode ${isUMD ? "in umd format" : ""}`);
  let bundle: RollupBuild | null = null;
  try {
    const { output, ...options } = rollupOptions;
    bundle = await rollup(options);
    await Promise.all((output as OutputOptions[]).map((output) => bundle?.write(output)));
  } catch (e) {
    console.error(`[build] build package '${packageName}' with ${mode} mode ${isUMD ? "in umd format error" : "error"} \n ${(e as Error).message}`);
    throw e;
  } finally {
    await bundle?.close();
  }
  console.log(`[build] build package '${packageName}' with ${mode} mode ${isUMD ? "in umd format success" : "success"}`);
};

const rollupBuild = async (packageName: packages, packageScope?: string) => {
  const { allOtherDev, allOtherProd, allSingleOther, allSingleUMD, allUMDDev, allUMDProd } = await getRollupConfig(packageName, packageScope);

  const all = [];

  if (allOtherDev) {
    all.push(() => build(packageName, allOtherDev, "development", false));
  }

  if (allOtherProd) {
    all.push(() => build(packageName, allOtherProd, "production", false));
  }

  if (allSingleOther) {
    all.push(() => build(packageName, allSingleOther, "process.nev", false));
  }

  if (allSingleUMD) {
    all.push(() => build(packageName, allSingleUMD, "process.env", true));
  }

  if (allUMDDev) {
    all.push(() => build(packageName, allUMDDev, "development", true));
  }

  if (allUMDProd) {
    all.push(() => build(packageName, allUMDProd, "production", true));
  }

  await Promise.all(all.map((f) => f()));
};

const start = async () => {
  await rollupBuild("myreact-shared");
  await rollupBuild("myreact-reactivity");
  await rollupBuild("myreact");
  await rollupBuild("myreact-jsx");
  await rollupBuild("myreact-reconciler");
  await rollupBuild("myreact-dom");
  await rollupBuild("axios", "site");
  await rollupBuild("graphql", "site");
  process.exit(0);
};

start();
