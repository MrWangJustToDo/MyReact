import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";

export const runtimePublicPath = "/@react-refresh";

const _require = createRequire(import.meta.url);
const reactRefreshDir = path.dirname(_require.resolve("@my-react/react-refresh/package.json"));

const vitePluginDir = path.dirname(_require.resolve("@my-react/react-vite/package.json"));

const runtimeFilePath = path.join(reactRefreshDir, "dist/cjs/RefreshRuntime.development.js");

const refreshUtilsPath = path.join(vitePluginDir, 'dist/cjs/refreshUtils.development.js')

export const runtimeCode = `
const exports = {}
${fs.readFileSync(runtimeFilePath, "utf-8")}
${fs.readFileSync(refreshUtilsPath, "utf-8")}
export default exports
`;

export const preambleCode = `
import RefreshRuntime from "__BASE__${runtimePublicPath.slice(1)}"
RefreshRuntime.injectIntoGlobalHook(window)
window.$RefreshReg$ = () => {}
window.$RefreshSig$ = () => (type) => type
window.__vite_plugin_react_preamble_installed__ = true
`;

const header = `
import RefreshRuntime from "${runtimePublicPath}";

const inWebWorker = typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope;
let prevRefreshReg;
let prevRefreshSig;

if (import.meta.hot && !inWebWorker) {
  if (!window.__vite_plugin_react_preamble_installed__) {
    throw new Error(
      "@vitejs/plugin-react can't detect preamble. Something is wrong. " +
      "See https://github.com/vitejs/vite-plugin-react/pull/11#discussion_r430879201"
    );
  }

  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    RefreshRuntime.register(type, __SOURCE__ + " " + id)
  };
  window.$RefreshSig$ = RefreshRuntime.createSignatureFunctionForTransform;
}`.replace(/\n+/g, "");

const footer = `
if (import.meta.hot && !inWebWorker) {
  window.$RefreshReg$ = prevRefreshReg;
  window.$RefreshSig$ = prevRefreshSig;

  RefreshRuntime.__hmr_import(import.meta.url).then((currentExports) => {
    RefreshRuntime.registerExportsForReactRefresh(__SOURCE__, currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate(currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}`;

export function addRefreshWrapper(code: string, id: string): string {
  return header.replace("__SOURCE__", JSON.stringify(id)) + code + footer.replace("__SOURCE__", JSON.stringify(id));
}
