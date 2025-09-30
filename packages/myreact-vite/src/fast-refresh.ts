import RefreshRuntime from "@my-react/react-refresh";
import { compareVersion } from "@my-react/react-shared";
import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";

if (!RefreshRuntime.version || !compareVersion(RefreshRuntime.version, "0.3.9")) {
  console.error(
    `[@my-react/react-refresh-tools] current RefreshRuntime version not match for the package required, please reinstall "@my-react/react-refresh" to fix this issue`
  );
}

export const runtimePublicPath = "/@my-react-refresh";

const reactCompRE = /extends\s+(?:React\.)?(?:Pure)?Component/;

const refreshContentRE = /\$RefreshReg\$\(/;

const _require = createRequire(import.meta.url);

const reactRefreshDir = path.dirname(_require.resolve("@my-react/react-refresh/package.json"));

const vitePluginDir = path.dirname(_require.resolve("@my-react/react-vite/package.json"));

const runtimeFilePath = path.join(reactRefreshDir, "dist/cjs/RefreshRuntime.development.js");

const refreshUtilsPath = path.join(vitePluginDir, "dist/cjs/refreshUtils.development.js");

const refreshUtilsRemixPath = path.join(vitePluginDir, "static/refreshUtils.remix.js");

const refreshUtilsRouterPath = path.join(vitePluginDir, "static/refreshUtils.router.js");

export const runtimeCode = `
const exports = {}
${fs.readFileSync(runtimeFilePath, "utf-8")}
${fs.readFileSync(refreshUtilsPath, "utf-8")}
export default exports
`;

export const remixRuntimeCode = `
const exports = {}
${fs.readFileSync(runtimeFilePath, "utf-8")}
${fs.readFileSync(refreshUtilsRemixPath, "utf-8")}
export default exports
`;

export const routerRuntimeCode = `
const exports = {}
${fs.readFileSync(runtimeFilePath, "utf-8")}
${fs.readFileSync(refreshUtilsRouterPath, "utf-8")}
export default exports
`;

export const preambleCode = `
import MyRefreshRuntime from "__BASE__${runtimePublicPath.slice(1)}";
MyRefreshRuntime.injectIntoGlobalHook(window);
window.$RefreshReg$ = () => {};
window.$RefreshSig$ = () => (type) => type;
window.__vite_plugin_my_react_preamble_installed__ = true;
window.__vite_plugin_react_preamble_installed__ = true;
`;

export const getPreambleCode = (base: string): string => preambleCode.replace("__BASE__", base);

export function addRefreshWrapper(code: string, pluginName: string, id: string, reactRefreshHost = ""): string | undefined {
  const hasRefresh = refreshContentRE.test(code);
  const onlyReactComp = !hasRefresh && reactCompRE.test(code);

  if (!hasRefresh && !onlyReactComp) return undefined;

  let newCode = code;
  newCode += `

import MyRefreshRuntime from "${reactRefreshHost}${runtimePublicPath}";
const _inWebWorker = typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope;
if (import.meta.hot && !_inWebWorker) {
  if (!window.$RefreshReg$) {
    throw new Error(
      "${pluginName} can't detect preamble. Something is wrong."
    );
  }

  MyRefreshRuntime.__hmr_import(import.meta.url).then((currentExports) => {
    MyRefreshRuntime.registerExportsForReactRefresh(${JSON.stringify(id)}, currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = MyRefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate(${JSON.stringify(id)}, currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}
`;

  if (hasRefresh) {
    newCode += `function $RefreshReg$(type, id) { return MyRefreshRuntime.register(type, ${JSON.stringify(id)} + ' ' + id) }
function $RefreshSig$() { return MyRefreshRuntime.createSignatureFunctionForTransform(); }
`;
  }

  return newCode;
}
