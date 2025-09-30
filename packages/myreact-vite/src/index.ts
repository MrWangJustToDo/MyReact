/* eslint-disable max-lines */
/* eslint-disable import/no-duplicates */
import { exactRegex, makeIdFiltersToMatchWithQuery } from "@rolldown/pluginutils";
import { createFilter } from "vite";
import * as vite from "vite";

import { addRefreshWrapper, getPreambleCode, preambleCode, runtimeCode, remixRuntimeCode, routerRuntimeCode, runtimePublicPath } from "./fast-refresh";
import { silenceUseClientWarning } from "./warning";

import type * as babelCore from "@babel/core";
import type { ParserOptions, TransformOptions } from "@babel/core";
import type { Plugin, ResolvedConfig } from "vite";

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

  /**
   * for remix fast refresh
   */
  remix?: boolean;

  /**
   * for react-router >= 7 fast refresh
   */
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
  /**
   * Manipulate the Babel options of `@vitejs/plugin-react`
   */
  reactBabel?: ReactBabelHook;
};

const defaultIncludeRE = /\.[tj]sx?$/;
const defaultExcludeRE = /\/node_modules\//;
const tsRE = /\.tsx?$/;
const compilerAnnotationRE = /['"]use memo['"]/;

export default function viteReact(opts: Options = {}): Plugin[] {
  const include = opts.include ?? defaultIncludeRE;
  const exclude = opts.exclude ?? defaultExcludeRE;
  const filter = createFilter(include, exclude);

  const jsxImportSource = opts.jsxImportSource ?? "react";
  const jsxImportRuntime = `${jsxImportSource}/jsx-runtime`;
  const jsxImportDevRuntime = `${jsxImportSource}/jsx-dev-runtime`;

  const isRolldownVite = "rolldownVersion" in vite;
  let runningInVite = false;
  let isProduction = true;
  let projectRoot = process.cwd();
  let skipFastRefresh = true;
  let base: string;
  let isFullBundle = false;
  let runPluginOverrides: ((options: ReactBabelOptions, context: ReactBabelHookContext) => void) | undefined;
  let staticBabelOptions: ReactBabelOptions | undefined;

  // Support patterns like:
  // - import * as React from 'react';
  // - import React from 'react';
  // - import React, {useEffect} from 'react';
  const importReactRE = /\bimport\s+(?:\*\s+as\s+)?React\b/;

  opts.enableResolveAlias ??= true;

  const viteBabel: Plugin = {
    name: "vite:my-react-babel",
    enforce: "pre",
    config(_userConfig, { command }) {
      if ("rolldownVersion" in vite) {
        if (opts.jsxRuntime === "classic") {
          return {
            oxc: {
              jsx: {
                runtime: "classic",
                refresh: command === "serve",
                // disable __self and __source injection even in dev
                // as this plugin injects them by babel and oxc will throw
                // if development is enabled and those properties are already present
                development: false,
              },
              jsxRefreshInclude: makeIdFiltersToMatchWithQuery(include),
              jsxRefreshExclude: makeIdFiltersToMatchWithQuery(exclude),
            },
          };
        } else {
          return {
            oxc: {
              jsx: {
                runtime: "automatic",
                importSource: opts.jsxImportSource,
                refresh: command === "serve",
              },
              jsxRefreshInclude: makeIdFiltersToMatchWithQuery(include),
              jsxRefreshExclude: makeIdFiltersToMatchWithQuery(exclude),
            },
            optimizeDeps: {
              rollupOptions: { transform: { jsx: { runtime: "automatic" } } },
            },
          };
        }
      }

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
            // keep undefined by default so that vite's esbuild transform can prioritize jsxImportSource from tsconfig
            jsxImportSource: opts.jsxImportSource,
          },
          optimizeDeps: { esbuildOptions: { jsx: "automatic" } },
        };
      }
    },
    configResolved(config) {
      runningInVite = true;
      base = config.base;
      // @ts-expect-error only available in newer rolldown-vite
      if (config.experimental.fullBundleMode) {
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
        // Because hooks and the callback option can mutate the Babel options
        // we only create static option in this case and re-create them
        // each time otherwise
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
        options.jsx = {
          mode: opts.jsxRuntime,
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
          const newBabelOptions = createBabelOptions(typeof opts.babel === "function" ? opts.babel(id, { ssr }) : opts.babel);
          runPluginOverrides?.(newBabelOptions, { id, ssr });
          return newBabelOptions;
        })();
        const plugins = [...babelOptions.plugins];

        // remove react-compiler plugin on non client environment
        let reactCompilerPlugin = getReactCompilerPlugin(plugins);
        if (reactCompilerPlugin && ssr) {
          plugins.splice(plugins.indexOf(reactCompilerPlugin), 1);
          reactCompilerPlugin = undefined;
        }

        // filter by "use memo" when react-compiler { compilationMode: "annotation" }
        // https://react.dev/learn/react-compiler/incremental-adoption#annotation-mode-configuration
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

        if (opts.jsxRuntime === "classic" && isJSX) {
          if (!isProduction) {
            // These development plugins are only needed for the classic runtime.
            plugins.push(await loadPlugin("@babel/plugin-transform-react-jsx-self"), await loadPlugin("@babel/plugin-transform-react-jsx-source"));
          }
        }

        // Avoid parsing if no special transformation is needed
        if (canSkipBabel(plugins, babelOptions)) {
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
          // Required for esbuild.jsxDev to provide correct line numbers
          // This creates issues the react compiler because the re-order is too important
          // People should use @babel/plugin-transform-react-jsx-development to get back good line numbers
          retainLines: reactCompilerPlugin ? false : !isProduction && isJSX && opts.jsxRuntime !== "classic",
          parserOpts: {
            ...babelOptions.parserOpts,
            sourceType: "module",
            allowAwaitOutsideFunction: true,
            plugins: parserPlugins,
          },
          generatorOpts: {
            ...babelOptions.generatorOpts,
            // import attributes parsing available without plugin since 7.26
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            importAttributesKeyword: "with",
            decoratorsBeforeExport: true,
          },
          plugins,
          sourceMaps: true,
        });

        if (result) {
          if (!useFastRefresh) {
            return { code: result.code!, map: result.map };
          }
          const code = addRefreshWrapper(result.code!, "@vitejs/plugin-react", id, opts.reactRefreshHost);
          return { code: code ?? result.code!, map: result.map };
        }
      },
    },
  };

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

  const reactCompilerPlugin = getReactCompilerPlugin(staticBabelPlugins);

  if (reactCompilerPlugin) {
    dependencies.push("react-compiler-runtime");
  }

  const viteReactRefresh: Plugin = {
    name: "vite:my-react-refresh",
    enforce: "pre",
    config: (userConfig) => ({
      build: silenceUseClientWarning(userConfig),
      optimizeDeps: {
        include: dependencies,
      },
      resolve: {
        alias:
          !opts.reactRouter && !opts.remix && opts.enableResolveAlias
            ? {
                react: "@my-react/react",
                "react-dom": "@my-react/react-dom",
              }
            : undefined,
        dedupe: ["react", "react-dom", "@my-react/react", "@my-react/react-dom"],
      },
    }),
    resolveId: {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      filter: { id: exactRegex(runtimePublicPath) },
      handler(id) {
        if (id === runtimePublicPath) {
          return id;
        }
      },
    },
    load: {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      filter: { id: exactRegex(runtimePublicPath) },
      handler(id) {
        if (id === runtimePublicPath) {
          return runtimeCode;
        }
      },
    },
    transformIndexHtml() {
      if (!skipFastRefresh && !isFullBundle)
        return [
          {
            tag: "script",
            attrs: { type: "module" },
            children: getPreambleCode(base),
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
        return getPreambleCode(base);
      }
    },
  };
  const viteRemixRefreshRuntime: Plugin = {
    name: "vite:my-react-refresh-remix-runtime",
    enforce: "post",
    transform(code, id) {
      if (id === "\0virtual:remix/hmr-runtime") {
        return remixRuntimeCode;
      }
    },
  };

  const viteReactRouterRefresh: Plugin = {
    name: "vite:my-react-refresh-react-router",
    enforce: "post",
    transform(code, id) {
      // see https://github.com/remix-run/react-router/blob/20afd82a683f175150dd05095aa677686665fbc8/packages/react-router-dev/vite/plugin.ts#L1457
      if (id === "\0virtual:react-router/inject-hmr-runtime") {
        return getPreambleCode(base);
      }
    },
  };

  const viteReactRouterRefreshRuntime: Plugin = {
    name: "vite:my-react-refresh-react-router-runtime",
    enforce: "post",
    transform(code, id) {
      if (id === "\0virtual:react-router/hmr-runtime") {
        return routerRuntimeCode;
      }
    },
  };

  return [
    viteBabel,
    viteReactRefresh,
    opts.remix ? viteRemixRefresh : null,
    opts.remix ? viteRemixRefreshRuntime : null,
    opts.reactRouter ? viteReactRouterRefresh : null,
    opts.reactRouter ? viteReactRouterRefreshRuntime : null,
  ].filter(Boolean) as Plugin[];
}

viteReact.preambleCode = preambleCode;

// Compat for require
function viteReactForCjs(this: unknown, options: Options): Plugin[] {
  return viteReact.call(this, options);
}

Object.assign(viteReactForCjs, {
  default: viteReactForCjs,
});

export { viteReactForCjs };

function canSkipBabel(plugins: ReactBabelOptions["plugins"], babelOptions: ReactBabelOptions) {
  return !(plugins.length || babelOptions.presets.length || babelOptions.configFile || babelOptions.babelrc);
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
  babelOptions.parserOpts ||= {} as any;
  babelOptions.parserOpts.plugins ||= [];

  return babelOptions;
}

function defined<T>(value: T | undefined): value is T {
  return value !== undefined;
}

function getReactCompilerPlugin(plugins: ReactBabelOptions["plugins"]) {
  return plugins.find((p) => p === "babel-plugin-react-compiler" || (Array.isArray(p) && p[0] === "babel-plugin-react-compiler"));
}
