import path from "node:path";

export const reactRefreshPath = path.join(__dirname, "../client/reactRefresh.js");

export const reactRefreshEntryPath = path.join(__dirname, "../client/reactRefreshEntry.js");

export const refreshUtilsPath = path.join(__dirname, "../client/refreshUtils.js");

let refreshRuntimeDirPath: string;

export function getRefreshRuntimeDirPath() {
  if (!refreshRuntimeDirPath) {
    refreshRuntimeDirPath = path.dirname(
      require.resolve("@my-react/react-refresh", {
        paths: [reactRefreshPath],
      })
    );
  }
  return refreshRuntimeDirPath;
}

export const getRefreshRuntimePaths = () => [reactRefreshEntryPath, reactRefreshPath, refreshUtilsPath, getRefreshRuntimeDirPath()];
