import path from "node:path";

export const reactRefreshPath = require.resolve("../client/reactRefresh.js");
export const reactRefreshEntryPath = require.resolve("../client/reactRefreshEntry.js");
export const refreshUtilsPath = require.resolve("../client/refreshUtils.js");
export const refreshRuntimeDirPath = path.dirname(
  require.resolve("@my-react/react-refresh", {
    paths: [reactRefreshPath],
  })
);
export const runtimePaths = [reactRefreshEntryPath, reactRefreshPath, refreshUtilsPath, refreshRuntimeDirPath];
