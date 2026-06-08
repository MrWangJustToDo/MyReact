import { createRequire } from "node:module";
import path from "node:path";

export const reactRefreshPath = path.join(import.meta.dirname, "../client/reactRefresh.js");
export const reactRefreshEntryPath = path.join(import.meta.dirname, "../client/reactRefreshEntry.js");
export const refreshUtilsPath = path.join(import.meta.dirname, "../client/refreshUtils.js");

const require = createRequire(import.meta.url);

let refreshRuntimeDirPath: string;

export function getRefreshRuntimeDirPath() {
  if (!refreshRuntimeDirPath) {
    refreshRuntimeDirPath = path.dirname(require.resolve("@my-react/react-refresh"));
  }
  return refreshRuntimeDirPath;
}

export const getRefreshRuntimePaths = () => [reactRefreshEntryPath, reactRefreshPath, refreshUtilsPath, getRefreshRuntimeDirPath()];
