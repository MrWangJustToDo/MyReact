// Thanks https://github.com/pmmmwh/react-refresh-webpack-plugin
const RefreshUtils = require("./refreshUtils");
const RefreshRuntime = require("@my-react/react-refresh/runtime");

// Port from https://github.com/pmmmwh/react-refresh-webpack-plugin/blob/main/loader/utils/getRefreshModuleRuntime.js#L29
function refresh(moduleId, webpackHot) {
  const currentExports = RefreshUtils.getModuleExports(moduleId);
  const fn = (exports) => {
    RefreshUtils.executeRuntime(exports, moduleId, webpackHot);
  };
  if (typeof Promise !== "undefined" && currentExports instanceof Promise) {
    currentExports.then(fn);
  } else {
    fn(currentExports);
  }
}

module.exports = {
  refresh,
  register: RefreshRuntime.register,
  createSignatureFunctionForTransform: RefreshRuntime.createSignatureFunctionForTransform,
};
