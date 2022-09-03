import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import typescript from "@rollup/plugin-typescript";
import cloneDeep from "lodash/cloneDeep";
import fs from "fs";
import { readFile, access } from "fs/promises";
import { resolve } from "path";

import type { Mode } from "./type";
import type { RollupOptions } from "rollup";

const defaultBuildOptions: RollupOptions = {
  input: "./src/index.ts",
  output: [
    {
      dir: "./dist",
      entryFileNames: "cjs/index.js",
      format: "cjs",
      sourcemap: true,
    },
    {
      dir: "./dist",
      entryFileNames: "esm/index.js",
      format: "esm",
      sourcemap: true,
    },
  ],
};

const checkFileExist = (path: string) =>
  access(path, fs.constants.F_OK)
    .then(() => true)
    .catch(() => false);

const transformBuildOptions = (
  options: RollupOptions,
  relativePath: string,
  mode: Mode
): { other?: RollupOptions; umd?: RollupOptions } => {
  const allOptions: { other?: RollupOptions; umd?: RollupOptions } = {};
  if (typeof options.input === "string" && !options.input.startsWith(relativePath)) {
    options.input = resolve(relativePath, options.input);
  }
  if (options.output) {
    options.output = Array.isArray(options.output) ? options.output : [options.output];
    const umdConfig = options.output.find((output) => output.format === "umd");
    const otherConfig = options.output.filter((output) => output.format !== "umd");
    options.output = options.output.map((output) => {
      if (output.dir && !output.dir.startsWith(relativePath)) {
        output.dir = resolve(relativePath, output.dir);
        output.entryFileNames = output.entryFileNames || `${output.format}/index.js`;
        const typedEntryFileNames = output.entryFileNames as string;
        const lastIndexofDote = typedEntryFileNames.lastIndexOf(".");
        output.entryFileNames = `${typedEntryFileNames.slice(0, lastIndexofDote)}.${mode}${typedEntryFileNames.slice(
          lastIndexofDote
        )}`;
      }
      if (output.file && !output.file.startsWith(relativePath)) {
        output.file = resolve(relativePath, output.file);
        const typedEntryFileNames = output.file as string;
        const lastIndexofDote = typedEntryFileNames.lastIndexOf(".");
        output.file = `${typedEntryFileNames.slice(0, lastIndexofDote)}.${mode}${typedEntryFileNames.slice(
          lastIndexofDote
        )}`;
      }
      return output;
    });

    allOptions.other = {
      input: options.input,
      output: otherConfig,
    };

    if (umdConfig) {
      allOptions.umd = {
        input: options.input,
        output: [umdConfig],
      };
    }
  }
  return allOptions;
};

export const getRollupConfig = async (packageName: string) => {
  const modes: Mode[] = ["development", "production"];

  const relativePath = resolve(process.cwd(), "packages", packageName);

  const packageFilePath = resolve(relativePath, "package.json");

  const isPackageFileExist = await checkFileExist(packageFilePath);

  if (!isPackageFileExist) {
    throw new Error(`current package ${packageName} not exist!`);
  }

  const packageFileContent = await readFile(packageFilePath, {
    encoding: "utf-8",
  });

  const packageFileObject = JSON.parse(packageFileContent);

  let rollupConfig: RollupOptions = { ...defaultBuildOptions };

  if (packageFileObject["buildOptions"]) {
    rollupConfig = packageFileObject["buildOptions"] as RollupOptions;
  }

  if (!rollupConfig.input) throw new Error(`current package ${packageName} not have a input config`);

  if (!rollupConfig.output) throw new Error(`current package ${packageName} not have a output config`);

  const allRollupOptions = modes.map((mode) => transformBuildOptions(cloneDeep(rollupConfig), relativePath, mode));

  const allDevBuild = allRollupOptions[0];

  const allProdBuild = allRollupOptions[1];

  const allUMDBuild = allRollupOptions.map((it) => it.umd);

  const allOtherBuild = allRollupOptions.map((it) => it.other);

  allOtherBuild.forEach((option) => {
    if (option) {
      option.external = (id) => id.includes("node_modules") || id.includes("@my-react/");
    }
  });

  allUMDBuild.forEach((option) => {
    if (option && packageName === "myreact-dom") {
      option.external = (id) => id.endsWith("@my-react/react");
    }
  });

  if (allDevBuild.other) {
    allDevBuild.other.plugins = [
      nodeResolve(),
      commonjs({ exclude: "node_modules" }),
      replace({
        __DEV__: true,
        __VERSION__: JSON.stringify(packageFileObject["version"] || "0.0.1"),
        preventAssignment: true,
      }),
      typescript({
        composite: true,
        declaration: true,
        declarationMap: true,
        emitDeclarationOnly: true,
        outputToFilesystem: false,
        cacheDir: resolve(relativePath, ".cache"),
        tsconfig: resolve(relativePath, "tsconfig.json"),
        declarationDir: resolve(relativePath, "dist/types"),
      }),
    ];
  }

  if (allDevBuild.umd) {
    allDevBuild.umd.plugins = [
      nodeResolve(),
      commonjs({ exclude: "node_modules" }),
      replace({
        __DEV__: true,
        ["process.env.NODE_ENV"]: JSON.stringify("development"),
        __VERSION__: JSON.stringify(packageFileObject["version"] || "0.0.1"),
        preventAssignment: true,
      }),
      typescript({
        composite: true,
        declaration: true,
        declarationMap: true,
        emitDeclarationOnly: true,
        outputToFilesystem: false,
        cacheDir: resolve(relativePath, ".cache"),
        tsconfig: resolve(relativePath, "tsconfig.json"),
        declarationDir: resolve(relativePath, "dist/types"),
      }),
    ];
  }

  if (allProdBuild.other) {
    allProdBuild.other.plugins = [
      nodeResolve(),
      commonjs({ exclude: "node_modules" }),
      replace({
        __DEV__: false,
        __VERSION__: JSON.stringify(packageFileObject["version"] || "0.0.1"),
        preventAssignment: true,
      }),
      typescript({
        composite: true,
        declaration: true,
        declarationMap: true,
        emitDeclarationOnly: true,
        outputToFilesystem: false,
        cacheDir: resolve(relativePath, ".cache"),
        tsconfig: resolve(relativePath, "tsconfig.json"),
        declarationDir: resolve(relativePath, "dist/types"),
      }),
    ];
  }

  if (allProdBuild.umd) {
    allProdBuild.umd.plugins = [
      nodeResolve(),
      commonjs({ exclude: "node_modules" }),
      replace({
        __DEV__: false,
        __VERSION__: JSON.stringify(packageFileObject["version"] || "0.0.1"),
        ["process.env.NODE_ENV"]: JSON.stringify("production"),
        preventAssignment: true,
      }),
      typescript({
        composite: true,
        declaration: true,
        declarationMap: true,
        emitDeclarationOnly: true,
        outputToFilesystem: false,
        cacheDir: resolve(relativePath, ".cache"),
        tsconfig: resolve(relativePath, "tsconfig.json"),
        declarationDir: resolve(relativePath, "dist/types"),
      }),
    ];
  }

  const allOptions = [...allUMDBuild, ...allOtherBuild].filter(Boolean) as RollupOptions[];

  allOptions.forEach((option) => {
    option.onwarn = (msg, warn) => {
      if (!/Circular/.test(msg.message)) {
        warn(msg);
      }
    };
  });

  return {
    allDevBuild,
    allProdBuild,
  };
};
