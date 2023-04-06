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
    if (Array.isArray(allOtherDev)) {
      allOtherDev.forEach((config) => config && all.push(() => build(packageName, config, "development", false)));
    } else {
      all.push(() => build(packageName, allOtherDev, "development", false));
    }
  }

  if (allOtherProd) {
    if (Array.isArray(allOtherProd)) {
      allOtherProd.forEach((config) => config && all.push(() => build(packageName, config, "production", false)));
    } else {
      all.push(() => build(packageName, allOtherProd, "production", false));
    }
  }

  if (allSingleOther) {
    if (Array.isArray(allSingleOther)) {
      allSingleOther.forEach((config) => config && all.push(() => build(packageName, config, "process.nev", false)));
    } else {
      all.push(() => build(packageName, allSingleOther, "process.nev", false));
    }
  }

  if (allSingleUMD) {
    if (Array.isArray(allSingleUMD)) {
      allSingleUMD.forEach((config) => config && all.push(() => build(packageName, config, "process.env", true)));
    } else {
      all.push(() => build(packageName, allSingleUMD, "process.env", true));
    }
  }

  if (allUMDDev) {
    if (Array.isArray(allUMDDev)) {
      allUMDDev.forEach((config) => config && all.push(() => build(packageName, config, "development", true)));
    } else {
      all.push(() => build(packageName, allUMDDev, "development", true));
    }
  }

  if (allUMDProd) {
    if (Array.isArray(allUMDProd)) {
      allUMDProd.forEach((config) => config && all.push(() => build(packageName, config, "production", true)));
    } else {
      all.push(() => build(packageName, allUMDProd, "production", true));
    }
  }

  await Promise.all(all.map((f) => f()));
};

const start = async () => {
  // await rollupBuild("myreact-shared");
  // await rollupBuild("myreact");
  // await rollupBuild("myreact-jsx");
  // await rollupBuild("myreact-reconciler");
  // await rollupBuild("myreact-dom");
  // await rollupBuild("myreact-reactivity");
  await rollupBuild("myreact-refresh");
  // await rollupBuild("axios", "site");
  // await rollupBuild("graphql", "site");
  process.exit(0);
};

start();
