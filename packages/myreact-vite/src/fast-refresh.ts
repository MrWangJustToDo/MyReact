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

const _require = createRequire(import.meta.url);

const reactRefreshDir = path.dirname(_require.resolve("@my-react/react-refresh/package.json"));

const vitePluginDir = path.dirname(_require.resolve("@my-react/react-vite/package.json"));

const runtimeFilePath = path.join(reactRefreshDir, "dist/cjs/RefreshRuntime.development.js");

const refreshUtilsPath = path.join(vitePluginDir, "dist/cjs/refreshUtils.development.js");

export const runtimeCode = `
const exports = {}
${fs.readFileSync(runtimeFilePath, "utf-8")}
${fs.readFileSync(refreshUtilsPath, "utf-8")}
export default exports
`;

export const preambleCode = `
import MyRefreshRuntime from "__BASE__${runtimePublicPath.slice(1)}";
MyRefreshRuntime.injectIntoGlobalHook(window);
window.$RefreshReg$ = () => {}
window.$RefreshSig$ = () => (type) => type
window.__vite_plugin_my_react_preamble_installed__ = true
window.__vite_plugin_react_preamble_installed__ = true
`;

const sharedHeader = `
import MyRefreshRuntime from "${runtimePublicPath}";

const inWebWorker_ = typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope;
`.replace(/\n+/g, "");

const functionHeader = `let prevRefreshReg_;
let prevRefreshSig_;

if (import.meta.hot && !inWebWorker_) {
  if (!window.__vite_plugin_my_react_preamble_installed__) {
    throw new Error(
      "@vitejs/plugin-react can't detect preamble. Something is wrong. " +
      "See https://github.com/vitejs/vite-plugin-react/pull/11#discussion_r430879201"
    );
  }

  prevRefreshReg_ = window.$RefreshReg$;
  prevRefreshSig_ = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    MyRefreshRuntime.register(type, __SOURCE__ + " " + id)
  };
  window.$RefreshSig$ = MyRefreshRuntime.createSignatureFunctionForTransform;
}`.replace(/\n+/g, "");

const functionFooter = `
if (import.meta.hot && !inWebWorker_) {
  window.$RefreshReg$ = prevRefreshReg_;
  window.$RefreshSig$ = prevRefreshSig_;
}`;

const sharedFooter = (id: string) => `
if (import.meta.hot && !inWebWorker_) {
  MyRefreshRuntime.__hmr_import(import.meta.url).then((currentExports) => {
    MyRefreshRuntime.registerExportsForReactRefresh(${JSON.stringify(id)}, currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = MyRefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate(${JSON.stringify(id)}, currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}`;

export function addRefreshWrapper(code: string, id: string): string {
  return sharedHeader + functionHeader.replace("__SOURCE__", JSON.stringify(id)) + code + functionFooter + sharedFooter(id);
}

export function addClassComponentRefreshWrapper(code: string, id: string): string {
  return sharedHeader + code + sharedFooter(id);
}
