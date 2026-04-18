// MyReact Lynx HMR Loader Runtime
// Appended to each module by the loader
var getExports = (m) => m.exports || m.__proto__.exports;

const isRefreshComponent = __myreact_refresh_utils__.isReactRefreshBoundary(getExports(module));

const moduleHot = module.hot;

if (moduleHot) {
  const currentExports = getExports(module);

  const previousHotModuleExports = moduleHot.data && moduleHot.data.moduleExports;

  const previousSignature = moduleHot.data && moduleHot.data.moduleSignature;

  __myreact_refresh_utils__.registerExportsForReactRefresh(currentExports, module.id);

  if (isRefreshComponent) {
    if (
      previousHotModuleExports &&
      !__myreact_refresh_utils__.shouldInvalidateReactRefreshBoundary(previousSignature, __myreact_refresh_utils__.getRefreshBoundarySignature(currentExports))
    ) {
      try {
        __myreact_refresh_utils__.forceUpdate();
        if (typeof __myreact_refresh_errors__ !== "undefined" && __myreact_refresh_errors__ && __myreact_refresh_errors__.clearRuntimeErrors) {
          __myreact_refresh_errors__.clearRuntimeErrors();
        }
      } catch (e) {
        // Only available in newer webpack versions.
        if (moduleHot.invalidate) {
          moduleHot.invalidate();
        } else {
          globalThis.location.reload();
        }
      }
    }

    moduleHot.dispose((data) => {
      data.moduleExports = getExports(module);
      data.moduleSignature = __myreact_refresh_utils__.getRefreshBoundarySignature(getExports(module));
    });

    moduleHot.accept(function errorRecovery() {
      if (typeof __myreact_refresh_errors__ !== "undefined" && __myreact_refresh_errors__ && __myreact_refresh_errors__.handleRuntimeError) {
        __myreact_refresh_errors__.handleRuntimeError(error);
      }

      require.cache[module.id].hot.accept(errorRecovery);
    });
  }
}
