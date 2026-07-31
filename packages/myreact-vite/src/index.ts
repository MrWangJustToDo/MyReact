/* eslint-disable import/no-duplicates */
import { exactRegex, makeIdFiltersToMatchWithQuery } from "@rolldown/pluginutils";
import { createFilter } from "vite";
import * as vite from "vite";

import { addRefreshWrapper, getPreambleCode, preambleCode, remixRuntimeCode, routerRuntimeCode, runtimeCode, runtimePublicPath } from "./fast-refresh";
import { withMyReactBuildOptions } from "./warning";

import type * as babelCore from "@babel/core";
import type { ParserOptions, TransformOptions } from "@babel/core";
import type { Plugin, ResolvedConfig } from "vite";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface Options {
  /**
   * Can be used to process extra files like `.mdx`
   * @example include: /\.(mdx|js|jsx|ts|tsx)$/
   * @default /\.[tj]sx?$/
   */
  include?: string | RegExp | Array<string | RegExp>;
  /**
   * Can be used to exclude JSX/TSX files that runs in a worker or are not React files.
   * Except if explicitly desired, you should keep node_modules in the exclude list
   * @example exclude: [/\/pdf\//, /\.solid\.tsx$/, /\/node_modules\//]
   * @default /\/node_modules\//
   */
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
   * React Fast Refresh runtime URL prefix.
   * Useful in a module federation context to enable HMR by specifying
   * the host application URL in the Vite config of a remote application.
   * @example
   * reactRefreshHost: 'http://localhost:3000'
   */
  reactRefreshHost?: string;
  /**
   * default false for remix & react-router >= 7
   */
  enableResolveAlias?: boolean;
  /** for remix fast refresh */
  remix?: boolean;
  /** for react-router >= 7 fast refresh */
  reactRouter?: boolean;
}

export type BabelOptions = Omit<TransformOptions, "ast" | "filename" | "root" | "sourceFileName" | "sourceMaps" | "inputSourceMap">;

/**
 * The object type used by the `options` passed to plugins with
 * an `api.reactBabel` method.
 */
export interface ReactBabelOptions extends BabelOptions {
  plugins: Extract<BabelOptions["plugins"], any[]>;
  presets: Extract<BabelOptions["presets"], any[]>;
  overrides: Extract<BabelOptions["overrides"], any[]>;
  parserOpts: ParserOptions & {
    plugins: Extract<ParserOptions["plugins"], any[]>;
  };
}

type ReactBabelHook = (babelConfig: ReactBabelOptions, context: ReactBabelHookContext, config: ResolvedConfig) => void;
type ReactBabelHookContext = { ssr: boolean; id: string };

export type ViteReactPluginApi = {
  /** Manipulate the Babel options of `@vitejs/plugin-react` */
  reactBabel?: ReactBabelHook;
};

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const defaultIncludeRE = /\.[tj]sx?$/;
const defaultExcludeRE = /\/node_modules\//;
const tsRE = /\.tsx?$/;
const compilerAnnotationRE = /['"]use memo['"]/;
/** import * as React / import React / import React, { … } */
const importReactRE = /\bimport\s+(?:\*\s+as\s+)?React\b/;

const isRolldownVite = "rolldownVersion" in vite;

// ---------------------------------------------------------------------------
// Plugin
// ---------------------------------------------------------------------------

export default function viteReact(opts: Options = {}): Plugin[] {
  const include = opts.include ?? defaultIncludeRE;
  const exclude = opts.exclude ?? defaultExcludeRE;
  const filter = createFilter(include, exclude);

  const jsxImportSource = opts.jsxImportSource ?? "react";
  const jsxImportRuntime = `${jsxImportSource}/jsx-runtime`;
  const jsxImportDevRuntime = `${jsxImportSource}/jsx-dev-runtime`;

  opts.enableResolveAlias ??= true;

  let runningInVite = false;
  let isProduction = true;
  let projectRoot = process.cwd();
  let skipFastRefresh = true;
  let base = "/";
  let isFullBundle = false;
  let runPluginOverrides: ((options: ReactBabelOptions, context: ReactBabelHookContext) => void) | undefined;
  let staticBabelOptions: ReactBabelOptions | undefined;

  // ---- Babel / JSX transform ----

  const viteBabel: Plugin = {
    name: "vite:my-react-babel",
    enforce: "pre",
    config(_userConfig, { command }) {
      if (isRolldownVite) {
        const refresh = command === "serve";
        if (opts.jsxRuntime === "classic") {
          return {
            oxc: {
              jsx: {
                runtime: "classic",
                refresh,
                // disable __self / __source — this plugin injects them via babel
                development: false,
              },
              jsxRefreshInclude: makeIdFiltersToMatchWithQuery(include),
              jsxRefreshExclude: makeIdFiltersToMatchWithQuery(exclude),
            },
          };
        }
        return {
          oxc: {
            jsx: {
              runtime: "automatic",
              importSource: opts.jsxImportSource,
              refresh,
            },
            jsxRefreshInclude: makeIdFiltersToMatchWithQuery(include),
            jsxRefreshExclude: makeIdFiltersToMatchWithQuery(exclude),
          },
          optimizeDeps: {
            rolldownOptions: { transform: { jsx: { runtime: "automatic" } } },
          },
        };
      }

      if (opts.jsxRuntime === "classic") {
        return { esbuild: { jsx: "transform" } };
      }
      return {
        esbuild: {
          jsx: "automatic",
          // keep undefined by default so vite can prefer jsxImportSource from tsconfig
          jsxImportSource: opts.jsxImportSource,
        },
        optimizeDeps: { esbuildOptions: { jsx: "automatic" } },
      };
    },
    configResolved(config) {
      runningInVite = true;
      base = config.base;
      // @ts-expect-error only available in newer rolldown-vite
      if (config.experimental.fullBundleMode || config.experimental.bundledDev) {
        isFullBundle = true;
      }
      projectRoot = config.root;
      isProduction = config.isProduction;
      skipFastRefresh = isProduction || config.command === "build" || config.server.hmr === false;

      const hooks: ReactBabelHook[] = config.plugins.map((plugin) => plugin.api?.reactBabel).filter(defined);

      if (hooks.length > 0) {
        runPluginOverrides = (babelOptions, context) => {
          hooks.forEach((hook) => hook(babelOptions, context, config));
        };
      } else if (typeof opts.babel !== "function") {
        // hooks / babel callback can mutate options — only cache when static
        staticBabelOptions = createBabelOptions(opts.babel);

        if (
          (isRolldownVite || skipFastRefresh) &&
          canSkipBabel(staticBabelOptions.plugins, staticBabelOptions) &&
          (opts.jsxRuntime === "classic" ? isProduction : true)
        ) {
          delete viteBabel.transform;
        }
      }
    },
    options(options) {
      if (!runningInVite) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment -- use ts-ignore for ecosystem-ci
        // @ts-ignore Rolldown has `transform.jsx`
        options.transform ??= {};
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment -- use ts-ignore for ecosystem-ci
        // @ts-ignore Rolldown has `transform.jsx`
        options.transform.jsx = {
          runtime: opts.jsxRuntime,
          importSource: opts.jsxImportSource,
        };
        return options;
      }
    },
    transform: {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      filter: {
        id: {
          include: makeIdFiltersToMatchWithQuery(include),
          exclude: makeIdFiltersToMatchWithQuery(exclude),
        },
      },
      async handler(code, id, options) {
        const [filepath] = id.split("?");
        if (!filter(filepath)) return;

        const ssr = options?.ssr === true;
        const babelOptions = (() => {
          if (staticBabelOptions) return staticBabelOptions;
          const next = createBabelOptions(typeof opts.babel === "function" ? opts.babel(id, { ssr }) : opts.babel);
          runPluginOverrides?.(next, { id, ssr });
          return next;
        })();
        const plugins = [...babelOptions.plugins];

        // react-compiler: client-only + optional "use memo" annotation mode
        let reactCompilerPlugin = getReactCompilerPlugin(plugins);
        if (reactCompilerPlugin && ssr) {
          plugins.splice(plugins.indexOf(reactCompilerPlugin), 1);
          reactCompilerPlugin = undefined;
        }
        if (Array.isArray(reactCompilerPlugin) && reactCompilerPlugin[1]?.compilationMode === "annotation" && !compilerAnnotationRE.test(code)) {
          plugins.splice(plugins.indexOf(reactCompilerPlugin), 1);
          reactCompilerPlugin = undefined;
        }

        const isJSX = filepath.endsWith("x");
        const useFastRefresh =
          !(isRolldownVite || skipFastRefresh) &&
          !ssr &&
          (isJSX || (opts.jsxRuntime === "classic" ? importReactRE.test(code) : code.includes(jsxImportDevRuntime) || code.includes(jsxImportRuntime)));

        if (useFastRefresh) {
          plugins.push([await loadPlugin("@my-react/react-refresh/babel"), { skipEnvCheck: true }]);
        }
        if (opts.jsxRuntime === "classic" && isJSX && !isProduction) {
          plugins.push(await loadPlugin("@babel/plugin-transform-react-jsx-self"), await loadPlugin("@babel/plugin-transform-react-jsx-source"));
        }
        if (canSkipBabel(plugins, babelOptions)) {
          return;
        }

        const parserPlugins = [...babelOptions.parserOpts.plugins];
        if (!filepath.endsWith(".ts")) parserPlugins.push("jsx");
        if (tsRE.test(filepath)) parserPlugins.push("typescript");

        const babel = await loadBabel();
        const result = await babel.transformAsync(code, {
          ...babelOptions,
          root: projectRoot,
          filename: id,
          sourceFileName: filepath,
          // Required for esbuild.jsxDev line numbers; conflicts with react-compiler reorder
          retainLines: reactCompilerPlugin ? false : !isProduction && isJSX && opts.jsxRuntime !== "classic",
          parserOpts: {
            ...babelOptions.parserOpts,
            sourceType: "module",
            allowAwaitOutsideFunction: true,
            plugins: parserPlugins,
          },
          generatorOpts: {
            ...babelOptions.generatorOpts,
            importAttributesKeyword: "with",
            decoratorsBeforeExport: true,
          },
          plugins,
          sourceMaps: true,
        });

        if (!result) return;
        if (!useFastRefresh) {
          return { code: result.code!, map: result.map };
        }
        const wrapped = addRefreshWrapper(result.code!, "@vitejs/plugin-react", id, opts.reactRefreshHost);
        return { code: wrapped ?? result.code!, map: result.map };
      },
    },
  };

  // ---- Resolve / optimizeDeps / Fast Refresh runtime ----

  const dependencies = [
    "react",
    "react-dom",
    jsxImportRuntime,
    jsxImportDevRuntime,
    "@my-react/react",
    "@my-react/react/jsx-runtime",
    "@my-react/react/jsx-dev-runtime",
    "@my-react/react-dom",
    "@my-react/react-dom/client",
    "@my-react/react-dom/server",
  ];

  const staticBabelPlugins = typeof opts.babel === "object" ? (opts.babel?.plugins ?? []) : [];
  if (getReactCompilerPlugin(staticBabelPlugins)) {
    dependencies.push("@my-react/react/compiler-runtime");
  }

  const viteReactRefresh: Plugin = {
    name: "vite:my-react-refresh",
    enforce: "pre",
    config: (userConfig) => ({
      build: withMyReactBuildOptions(userConfig),
      optimizeDeps: { include: dependencies },
      resolve: {
        alias: !opts.reactRouter && !opts.remix && opts.enableResolveAlias ? { react: "@my-react/react", "react-dom": "@my-react/react-dom" } : undefined,
        dedupe: ["react", "react-dom", "@my-react/react", "@my-react/react-dom"],
      },
    }),
    resolveId: {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      filter: { id: exactRegex(runtimePublicPath) },
      handler(id) {
        if (id === runtimePublicPath) return id;
      },
    },
    load: {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      filter: { id: exactRegex(runtimePublicPath) },
      handler(id) {
        if (id === runtimePublicPath) return runtimeCode;
      },
    },
    transformIndexHtml() {
      if (skipFastRefresh || isFullBundle) return;
      return [{ tag: "script", attrs: { type: "module" }, children: getPreambleCode(base) }];
    },
  };

  // ---- Framework-specific HMR virtual modules ----

  const frameworkRefreshPlugins: Plugin[] = [];
  if (opts.remix) {
    frameworkRefreshPlugins.push(
      createVirtualTransformPlugin("vite:my-react-refresh-remix", "\0virtual:remix/inject-hmr-runtime", () => getPreambleCode(base)),
      createVirtualTransformPlugin("vite:my-react-refresh-remix-runtime", "\0virtual:remix/hmr-runtime", () => remixRuntimeCode)
    );
  }
  if (opts.reactRouter) {
    frameworkRefreshPlugins.push(
      createVirtualTransformPlugin("vite:my-react-refresh-react-router", "\0virtual:react-router/inject-hmr-runtime", () => getPreambleCode(base)),
      createVirtualTransformPlugin("vite:my-react-refresh-react-router-runtime", "\0virtual:react-router/hmr-runtime", () => routerRuntimeCode)
    );
  }

  return [viteBabel, viteReactRefresh, ...frameworkRefreshPlugins];
}

viteReact.preambleCode = preambleCode;

// Compat for require
function viteReactForCjs(this: unknown, options: Options): Plugin[] {
  return viteReact.call(this, options);
}
Object.assign(viteReactForCjs, { default: viteReactForCjs });
export { viteReactForCjs };

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function createVirtualTransformPlugin(name: string, virtualId: string, getCode: () => string): Plugin {
  return {
    name,
    enforce: "post",
    transform(_code, id) {
      if (id === virtualId) return getCode();
    },
  };
}

function canSkipBabel(plugins: ReactBabelOptions["plugins"], babelOptions: ReactBabelOptions) {
  return !(plugins.length || babelOptions.presets.length || babelOptions.overrides.length || babelOptions.configFile || babelOptions.babelrc);
}

let babel: typeof babelCore | undefined;
async function loadBabel() {
  if (!babel) babel = await import("@babel/core");
  return babel;
}

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
  babelOptions.parserOpts ||= { plugins: [] };
  babelOptions.parserOpts.plugins ||= [];
  return babelOptions;
}

function defined<T>(value: T | undefined): value is T {
  return value !== undefined;
}

function getReactCompilerPlugin(plugins: ReactBabelOptions["plugins"]) {
  return plugins.find((p) => p === "babel-plugin-react-compiler" || (Array.isArray(p) && p[0] === "babel-plugin-react-compiler"));
}
