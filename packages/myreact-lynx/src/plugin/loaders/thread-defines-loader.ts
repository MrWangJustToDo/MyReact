/**
 * Lightweight pre-loader that substitutes per-layer thread macros.
 *
 * We intentionally avoid `builtin:swc-loader` here. A pre-enforced SWC pass
 * without the main JSX/react config compiles TSX to `React.createElement`
 * while the user bundle does not import `React`, causing:
 *   ReferenceError: React is not defined
 */

import { LAYERS } from "../layers.js";

import type { Rspack } from "@rsbuild/core";

const THREAD_DEFINES_BY_LAYER: Record<string, Record<string, string>> = {
  [LAYERS.BACKGROUND]: {
    __LEPUS__: "false",
    __JS__: "true",
    __BACKGROUND__: "true",
    __MAIN_THREAD__: "false",
  },
  [LAYERS.MAIN_THREAD]: {
    __LEPUS__: "true",
    __JS__: "false",
    __BACKGROUND__: "false",
    __MAIN_THREAD__: "true",
  },
};

function substituteThreadDefines(source: string, vars: Record<string, string>): string {
  let result = source;
  for (const [name, value] of Object.entries(vars)) {
    result = result.replace(new RegExp(`\\b${name}\\b`, "g"), value);
  }
  return result;
}

export default function threadDefinesLoader(this: Rspack.LoaderContext<Record<string, string>>, source: string): string {
  this.cacheable(true);
  const vars = this.getOptions();
  if (!vars || Object.keys(vars).length === 0) {
    return source;
  }
  return substituteThreadDefines(source, vars);
}

/** @internal */
export { THREAD_DEFINES_BY_LAYER, substituteThreadDefines };
