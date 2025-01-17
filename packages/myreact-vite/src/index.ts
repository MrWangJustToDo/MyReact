// eslint-disable-next-line import/no-duplicates
import { createFilter } from "vite";

import { addRefreshWrapper, preambleCode, runtimeCode, runtimePublicPath } from "./fast-refresh";

import type * as babelCore from "@babel/core";
import type { BuildOptions, Plugin, PluginOption, ResolvedConfig, UserConfig } from "vite";

// lazy load babel since it's not used during build if plugins are not used
let babel: typeof babelCore | undefined;

async function loadBabel() {
  if (!babel) {
    babel = await import("@babel/core");
  }
  return babel;
}

export interface Options {
  include?: string | RegExp | Array<string | RegExp>;
  exclude?: string | RegExp | Array<string | RegExp>;
  /**
   * Control where the JSX factory is imported from.
   * https://esbuild.github.io/api/#jsx-import-source
   * @default 'react'
   */
  jsxImportSource?: string;
  /**
   * Note: Skipping React import with classic runtime is not supported from v4
   * @default "automatic"
   */
  jsxRuntime?: "classic" | "automatic";
  /**
   * Babel configuration applied in both dev and prod.
   */
  babel?: BabelOptions | ((id: string, options: { ssr?: boolean }) => BabelOptions);

  /**
   * for remix fast refresh
   */
  remix?: boolean;

  /**
   * for react-router >= 7 fast refresh
   */
  reactRouter?: boolean;
}

export type BabelOptions = Omit<babelCore.TransformOptions, "ast" | "filename" | "root" | "sourceFileName" | "sourceMaps" | "inputSourceMap">;

/**
 * The object type used by the `options` passed to plugins with
 * an `api.reactBabel` method.
 */
export interface ReactBabelOptions extends BabelOptions {
  plugins: Extract<BabelOptions["plugins"], any[]>;
  presets: Extract<BabelOptions["presets"], any[]>;
  overrides: Extract<BabelOptions["overrides"], any[]>;
  parserOpts: babelCore.ParserOptions & {
    plugins: Extract<babelCore.ParserOptions["plugins"], any[]>;
  };
}

type ReactBabelHook = (babelConfig: ReactBabelOptions, context: ReactBabelHookContext, config: ResolvedConfig) => void;

type ReactBabelHookContext = { ssr: boolean; id: string };

export type ViteReactPluginApi = {
  /**
   * Manipulate the Babel options of `@vitejs/plugin-react`
   */
  reactBabel?: ReactBabelHook;
};

const refreshContentRE = /\$Refresh(?:Reg|Sig)\$\(/;
const defaultIncludeRE = /\.[tj]sx?$/;
const tsRE = /\.tsx?$/;

export default function viteReact(opts: Options = {}): PluginOption[] {
  // Provide default values for Rollup compat.
  let devBase = "/";
  const filter = createFilter(opts.include ?? defaultIncludeRE, opts.exclude);
  const jsxImportSource = opts.jsxImportSource ?? "react";
  const jsxImportRuntime = `${jsxImportSource}/jsx-runtime`;
  const jsxImportDevRuntime = `${jsxImportSource}/jsx-dev-runtime`;
  let isProduction = true;
  let projectRoot = process.cwd();
  let skipFastRefresh = false;
  let runPluginOverrides: ((options: ReactBabelOptions, context: ReactBabelHookContext) => void) | undefined;
  let staticBabelOptions: ReactBabelOptions | undefined;

  // Support patterns like:
  // - import * as React from 'react';
  // - import React from 'react';
  // - import React, {useEffect} from 'react';
  const importReactRE = /\bimport\s+(?:\*\s+as\s+)?React\b/;

  const viteBabel: Plugin = {
    name: "vite:my-react-babel",
    enforce: "pre",
    config() {
      if (opts.jsxRuntime === "classic") {
        return {
          esbuild: {
            jsx: "transform",
          },
        };
      } else {
        return {
          esbuild: {
            jsx: "automatic",
            jsxImportSource: opts.jsxImportSource ?? "@my-react/react",
          },
          optimizeDeps: { esbuildOptions: { jsx: "automatic" }, include: ["@my-react/react/jsx-runtime", "@my-react/react/jsx-dev-runtime"] },
        };
      }
    },
    configResolved(config) {
      devBase = config.base;
      projectRoot = config.root;
      isProduction = config.isProduction;
      skipFastRefresh = isProduction || config.command === "build" || config.server.hmr === false;

      if ("jsxPure" in opts) {
        config.logger.warnOnce("[@vitejs/plugin-react] jsxPure was removed. You can configure esbuild.jsxSideEffects directly.");
      }

      const hooks: ReactBabelHook[] = config.plugins.map((plugin) => plugin.api?.reactBabel).filter(defined);

      if (hooks.length > 0) {
        runPluginOverrides = (babelOptions, context) => {
          hooks.forEach((hook) => hook(babelOptions, context, config));
        };
      } else if (typeof opts.babel !== "function") {
        // Because hooks and the callback option can mutate the Babel options
        // we only create static option in this case and re-create them
        // each time otherwise
        staticBabelOptions = createBabelOptions(opts.babel);
      }
    },
    async transform(code, id, options) {
      if (id.includes("/node_modules/")) return;

      const [filepath] = id.split("?");
      if (!filter(filepath)) return;

      const ssr = options?.ssr === true;
      const babelOptions = (() => {
        if (staticBabelOptions) return staticBabelOptions;
        const newBabelOptions = createBabelOptions(typeof opts.babel === "function" ? opts.babel(id, { ssr }) : opts.babel);
        runPluginOverrides?.(newBabelOptions, { id, ssr });
        return newBabelOptions;
      })();
      const plugins = [...babelOptions.plugins];

      const isJSX = filepath.endsWith("x");
      const useFastRefresh =
        !skipFastRefresh &&
        !ssr &&
        (isJSX || (opts.jsxRuntime === "classic" ? importReactRE.test(code) : code.includes(jsxImportDevRuntime) || code.includes(jsxImportRuntime)));
      if (useFastRefresh) {
        plugins.push([await loadPlugin("@my-react/react-refresh/babel"), { skipEnvCheck: true }]);
      }

      if (opts.jsxRuntime === "classic" && isJSX) {
        if (!isProduction) {
          // These development plugins are only needed for the classic runtime.
          plugins.push(await loadPlugin("@babel/plugin-transform-react-jsx-self"), await loadPlugin("@babel/plugin-transform-react-jsx-source"));
        }
      }

      // Avoid parsing if no special transformation is needed
      if (!plugins.length && !babelOptions.presets.length && !babelOptions.configFile && !babelOptions.babelrc) {
        return;
      }

      const parserPlugins = [...babelOptions.parserOpts.plugins];

      if (!filepath.endsWith(".ts")) {
        parserPlugins.push("jsx");
      }

      if (tsRE.test(filepath)) {
        parserPlugins.push("typescript");
      }

      const babel = await loadBabel();
      const result = await babel.transformAsync(code, {
        ...babelOptions,
        root: projectRoot,
        filename: id,
        sourceFileName: filepath,
        parserOpts: {
          ...babelOptions.parserOpts,
          sourceType: "module",
          allowAwaitOutsideFunction: true,
          plugins: parserPlugins,
        },
        generatorOpts: {
          ...babelOptions.generatorOpts,
          decoratorsBeforeExport: true,
        },
        plugins,
        sourceMaps: true,
      });

      if (result) {
        let code = result.code!;
        if (useFastRefresh && refreshContentRE.test(code)) {
          code = addRefreshWrapper(code, id);
        }
        return { code, map: result.map };
      }
    },
  };

  const viteReactRefresh: Plugin = {
    name: "vite:my-react-refresh",
    enforce: "pre",
    config: (userConfig) => ({
      build: silenceUseClientWarning(userConfig),
      optimizeDeps: {
        // We can't add `react-dom` because the dependency is `react-dom/client`
        // for React 18 while it's `react-dom` for React 17. We'd need to detect
        // what React version the user has installed.
        include: [
          "react",
          jsxImportRuntime,
          jsxImportDevRuntime,
          "@my-react/react",
          "@my-react/react/jsx-runtime",
          "@my-react/react/jsx-dev-runtime",
          "@my-react/react-dom",
          "@my-react/react-dom/client",
          "@my-react/react-dom/server",
        ],
      },
      resolve: {
        alias: {
          react: "@my-react/react",
          "react-dom": "@my-react/react-dom",
        },
        dedupe: ["react", "react-dom", "@my-react/react", "@my-react/react-dom"],
      },
    }),
    resolveId(id) {
      if (id === runtimePublicPath) {
        return id;
      }
    },
    load(id) {
      if (id === runtimePublicPath) {
        return runtimeCode;
      }
    },
    transformIndexHtml() {
      if (!skipFastRefresh)
        return [
          {
            tag: "script",
            attrs: { type: "module" },
            children: preambleCode.replace(`__BASE__`, devBase),
          },
        ];
    },
  };

  const viteRemixRefresh: Plugin = {
    name: "vite:my-react-refresh-remix",
    enforce: "post",
    transform(code, id) {
      // see https://github.com/remix-run/remix/blob/bff2d58bdd22fe305f3e7ca8ddad03c5940f4e90/packages/remix-dev/vite/plugin.ts#L1685
      // inject HMR runtime for remix
      if (id === "\0virtual:remix/inject-hmr-runtime") {
        return `${code} \n ${preambleCode.replace(`__BASE__`, devBase)}`;
      }
    },
  };

  const viteReactRouterRefresh: Plugin = {
    name: "vite:my-react-refresh-react-router",
    enforce: "post",
    transform(code, id) {
      // see https://github.com/remix-run/react-router/blob/20afd82a683f175150dd05095aa677686665fbc8/packages/react-router-dev/vite/plugin.ts#L1457
      if (id === "\0virtual:react-router/inject-hmr-runtime") {
        return `${code} \n ${preambleCode.replace(`__BASE__`, devBase)}`;
      }
    },
  };

  return [viteBabel, viteReactRefresh, opts.remix ? viteRemixRefresh : null, opts.reactRouter ? viteReactRouterRefresh : null].filter(Boolean);
}

viteReact.preambleCode = preambleCode;

const silenceUseClientWarning = (userConfig: UserConfig): BuildOptions => ({
  rollupOptions: {
    onwarn(warning, defaultHandler) {
      if (warning.code === "MODULE_LEVEL_DIRECTIVE" && warning.message.includes("use client")) {
        return;
      }
      if (userConfig.build?.rollupOptions?.onwarn) {
        userConfig.build.rollupOptions.onwarn(warning, defaultHandler);
      } else {
        defaultHandler(warning);
      }
    },
  },
});

const loadedPlugin = new Map<string, any>();
function loadPlugin(path: string): any {
  const cached = loadedPlugin.get(path);
  if (cached) return cached;

  const promise = import(path).then((module) => {
    const value = module.default || module;
    loadedPlugin.set(path, value);
    return value;
  });
  loadedPlugin.set(path, promise);
  return promise;
}

function createBabelOptions(rawOptions?: BabelOptions) {
  const babelOptions = {
    babelrc: false,
    configFile: false,
    ...rawOptions,
  } as ReactBabelOptions;

  babelOptions.plugins ||= [];
  babelOptions.presets ||= [];
  babelOptions.overrides ||= [];
  babelOptions.parserOpts ||= {} as any;
  babelOptions.parserOpts.plugins ||= [];

  return babelOptions;
}

function defined<T>(value: T | undefined): value is T {
  return value !== undefined;
}
