import type { RuleSetCondition } from "@rspack/core";

export type PluginOptions = {
  /**
   * Specifies which files should be processed by the React Refresh loader.
   * This option is passed to the `builtin:react-refresh-loader` as the `rule.test` condition.
   * Works identically to Rspack's `rule.test` option.
   * @default /\.(?:js|jsx|mjs|cjs|ts|tsx|mts|cts)$/
   * @see https://rspack.rs/config/module-rules#rulestest
   */
  test?: RuleSetCondition;
  /**
   * Explicitly includes files to be processed by the React Refresh loader.
   * This option is passed to the `builtin:react-refresh-loader` as the `rule.include` condition.
   * Use this to limit processing to specific directories or file patterns.
   * Works identically to Rspack's `rule.include` option.
   * @default undefined
   * @see https://rspack.rs/config/module-rules#rulesinclude
   */
  include?: RuleSetCondition | null;
  /**
   * Exclude files from being processed by the plugin.
   * The value is the same as the `rule.exclude` option in Rspack.
   * @default /[\\/]node_modules[\\/]/
   * @see https://rspack.rs/config/module-rules#rulesexclude
   */
  exclude?: RuleSetCondition | null;
  /**
   * Can be used to exclude certain resources from being processed by
   * the plugin by the resource query.
   * @see https://rspack.rs/config/module-rules#rulesresourcequery
   *
   * @example
   * To exclude all resources with the `raw` query, such as
   * `import rawTs from './ReactComponent.ts?raw';`, use the following:
   * ```ts
   * { resourceQuery: { not: /raw/ } }
   * ```
   */
  resourceQuery?: RuleSetCondition;
  /**
   * Sets a namespace for the React Refresh runtime.
   * It is most useful when multiple instances of React Refresh is running
   * together simultaneously.
   * @default `output.uniqueName || output.library`
   */
  library?: string;
  /**
   * Whether to force enable the plugin.
   * By default, the plugin will not be enabled in non-development environments.
   * If you want to force enable the plugin, you can set this option to `true`.
   * @default false
   */
  forceEnable?: boolean;
  /**
   * Whether to inject the builtin:react-refresh-loader
   * @default true
   */
  injectLoader?: boolean;
  /**
   * Whether to inject the client/reactRefreshEntry.js
   * @default true
   */
  injectEntry?: boolean;
  /**
   * Whether to reload the page on runtime errors. E.g: undefined module factory
   * @default false
   */
  reloadOnRuntimeErrors?: boolean;
  /**
   * Allows to specify custom react-refresh loader
   * @default "builtin:react-refresh-loader"
   */
  reactRefreshLoader?: string;
};

export type NormalizedPluginOptions = Required<PluginOptions>;

const d = <K extends keyof PluginOptions>(object: PluginOptions, property: K, defaultValue?: PluginOptions[K]) => {
  // TODO: should we also add default for null?
  if (typeof object[property] === "undefined" && typeof defaultValue !== "undefined") {
    object[property] = defaultValue;
  }
  return object[property];
};

export function normalizeOptions(options: PluginOptions): NormalizedPluginOptions {
  d(options, "test", /\.(?:js|jsx|mjs|cjs|ts|tsx|mts|cts)$/);
  d(options, "exclude", /[\\/]node_modules[\\/]/);
  d(options, "library");
  d(options, "forceEnable", false);
  d(options, "injectLoader", true);
  d(options, "injectEntry", true);
  d(options, "reloadOnRuntimeErrors", false);
  d(options, "reactRefreshLoader", "builtin:react-refresh-loader");
  return options as NormalizedPluginOptions;
}
