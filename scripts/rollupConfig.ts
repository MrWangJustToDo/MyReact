import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import cloneDeep from "lodash/cloneDeep";
import fs from "fs";
import { readFile, access } from "fs/promises";
import { resolve } from "path";
import typescript from "rollup-plugin-typescript2";

import type { Mode, MultipleOutput } from "./type";
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

const tsConfig = (relativePath: string) =>
  typescript({
    clean: true,
    tsconfig: resolve(relativePath, "tsconfig.json"),
    useTsconfigDeclarationDir: true,
    tsconfigOverride: {
      compilerOptions: {
        composite: true,
        declaration: true,
        declarationMap: true,
        declarationDir: "dist/types",
      },
    },
  });

const transformBuildOptions = (
  options: RollupOptions,
  packageFileObject: Record<string, any>,
  relativePath: string,
  mode: Mode
): {
  singleOther?: RollupOptions;
  singleUMD?: RollupOptions;
  multipleOther?: RollupOptions;
  multipleUMD?: RollupOptions;
} => {
  const allOptions: {
    singleOther?: RollupOptions;
    singleUMD?: RollupOptions;
    multipleOther?: RollupOptions;
    multipleUMD?: RollupOptions;
  } = {};
  if (typeof options.input === "string" && !options.input.startsWith(relativePath)) {
    options.input = resolve(relativePath, options.input);
  }
  if (options.output) {
    options.output = Array.isArray(options.output) ? options.output : [options.output];
    const singleConfig = options.output.filter((output: MultipleOutput) => !output.multiple);
    const singleOtherConfig = singleConfig.filter((output) => output.format !== "umd");
    const singleUMDConfig = singleConfig.filter((output) => output.format === "umd");
    const multipleConfig = options.output.filter((output: MultipleOutput) => output.multiple);
    const multipleOtherConfig = multipleConfig.filter((output) => output.format !== "umd");
    const multipleUMDConfig = multipleConfig.filter((output) => output.format === "umd");
    options.output = options.output.map((output: MultipleOutput) => {
      if (output.dir && !output.dir.startsWith(relativePath)) {
        output.dir = resolve(relativePath, output.dir);
        if (output.multiple) {
          const typedEntryFileNames = output.entryFileNames as string;
          const lastIndexofDote = typedEntryFileNames.lastIndexOf(".");
          output.entryFileNames = `${typedEntryFileNames.slice(0, lastIndexofDote)}.${mode}${typedEntryFileNames.slice(
            lastIndexofDote
          )}`;
          delete output.multiple;
        }
      }
      if (output.file && !output.file.startsWith(relativePath)) {
        output.file = resolve(relativePath, output.file);
        if (output.multiple) {
          const typedEntryFileNames = output.file as string;
          const lastIndexofDote = typedEntryFileNames.lastIndexOf(".");
          output.file = `${typedEntryFileNames.slice(0, lastIndexofDote)}.${mode}${typedEntryFileNames.slice(
            lastIndexofDote
          )}`;
          delete output.multiple;
        }
      }
      return output;
    });

    options.onwarn = (msg, warn) => {
      if (!/Circular/.test(msg.message)) {
        warn(msg);
      }
    };

    if (singleOtherConfig.length) {
      allOptions.singleOther = {
        ...options,
        output: singleOtherConfig,
        external: (id) => id.includes("node_modules") || id.includes("@my-react/"),
        plugins: [
          nodeResolve(),
          commonjs({ exclude: "node_modules" }),
          replace({
            __DEV__: 'process.env.NODE_ENV === "development"',
            __VERSION__: JSON.stringify(packageFileObject["version"] || "0.0.1"),
            preventAssignment: true,
          }),
          tsConfig(relativePath),
        ],
      };
    }

    if (singleUMDConfig.length) {
      allOptions.singleUMD = {
        ...options,
        output: singleUMDConfig,
        external: (id) => {
          if (packageFileObject["name"] === "@my-react/react-dom") {
            return id.endsWith("@my-react/react");
          }
        },
        plugins: [
          nodeResolve(),
          commonjs({ exclude: "node_modules" }),
          replace({
            __DEV__: 'process.env.NODE_ENV === "development"',
            __VERSION__: JSON.stringify(packageFileObject["version"] || "0.0.1"),
            preventAssignment: true,
          }),
          tsConfig(relativePath),
        ],
      };
    }

    if (multipleOtherConfig.length) {
      allOptions.multipleOther = {
        ...options,
        output: multipleOtherConfig,
        external: (id) => id.includes("node_modules") || id.includes("@my-react/"),
        plugins: [
          nodeResolve(),
          commonjs({ exclude: "node_modules" }),
          replace({
            __DEV__: mode === "development",
            __VERSION__: JSON.stringify(packageFileObject["version"] || "0.0.1"),
            preventAssignment: true,
          }),
          tsConfig(relativePath),
        ],
      };
    }

    if (multipleUMDConfig.length) {
      allOptions.multipleUMD = {
        ...options,
        output: multipleUMDConfig,
        external: (id) => {
          if (packageFileObject["name"] === "@my-react/react-dom") {
            return id.endsWith("@my-react/react");
          }
        },
        plugins: [
          nodeResolve(),
          commonjs({ exclude: "node_modules" }),
          replace({
            __DEV__: mode === "development",
            ["process.env.NODE_ENV"]: JSON.stringify(mode),
            __VERSION__: JSON.stringify(packageFileObject["version"] || "0.0.1"),
            preventAssignment: true,
          }),
          tsConfig(relativePath),
        ],
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

  const allRollupOptions = modes.map((mode) =>
    transformBuildOptions(cloneDeep(rollupConfig), packageFileObject, relativePath, mode)
  );

  const allDevBuild = allRollupOptions[0];

  const allProdBuild = allRollupOptions[1];

  const allSingleOther = allDevBuild["singleOther"];

  const allSingleUMD = allDevBuild["singleUMD"];

  const allOtherDev = allDevBuild["multipleOther"];

  const allUMDDev = allDevBuild["multipleUMD"];

  const allOtherProd = allProdBuild["multipleOther"];

  const allUMDProd = allProdBuild["multipleUMD"];

  return {
    allSingleOther,
    allSingleUMD,
    allOtherDev,
    allOtherProd,
    allUMDDev,
    allUMDProd,
  };
};
