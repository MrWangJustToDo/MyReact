import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import typescript from "@rollup/plugin-typescript";
import fs from "fs";
import { readFile, access } from "fs/promises";
import { resolve } from "path";

import type { Mode } from "./type";
import type { RollupOptions } from "rollup";

const checkFileExist = (path: string) =>
  access(path, fs.constants.F_OK)
    .then(() => true)
    .catch(() => false);

const transformBuildOptions = (options: RollupOptions, relativePath: string, mode: Mode, isUMD: boolean) => {
  if (typeof options.input === "string" && !options.input.startsWith(relativePath)) {
    options.input = resolve(relativePath, options.input);
  }
  if (options.output) {
    options.output = Array.isArray(options.output) ? options.output : [options.output];
    if (isUMD) {
      const UMDConfig = options.output.find((output) => output.format === "umd");
      if (!UMDConfig) {
        throw new Error("current package do not have a umd build config");
      } else {
        options.output = [UMDConfig];
      }
    } else {
      options.output = options.output.filter((output) => output.format !== "umd");
    }
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
  }
  return options;
};

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

export const getRollupConfig = async (packageName: string, mode: Mode, isUMDBuild: boolean) => {
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

  const isProdBuild = mode === "production";

  rollupConfig = transformBuildOptions(rollupConfig, relativePath, mode, isUMDBuild);

  if (!isUMDBuild) {
    rollupConfig.external = (id) => id.includes("node_modules") || id.includes("@my-react/");
  } else {
    if (packageName === "myreact-dom") {
      rollupConfig.external = (id) => id.endsWith("@my-react/react");
    }
  }

  rollupConfig.plugins = [
    nodeResolve(),
    commonjs({ exclude: "node_modules" }),
    isUMDBuild
      ? replace({
          __DEV__: !isProdBuild,
          __VERSION__: JSON.stringify(packageFileObject["version"] || "0.0.1"),
          ["process.env.NODE_ENV"]: JSON.stringify(mode),
          preventAssignment: true,
        })
      : replace({
          __DEV__: !isProdBuild,
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

  rollupConfig.onwarn = (msg, warn) => {
    if (!/Circular/.test(msg.message)) {
      warn(msg);
    }
  };

  return rollupConfig;
};
