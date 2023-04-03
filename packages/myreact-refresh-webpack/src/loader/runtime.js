module.exports = function () {
  const isRefreshComponent = __refresh_utils__.shouldBind(module);

  // `@vanilla-extract/webpack` does some custom preprocessing where
  // `module.hot` is partially replaced. This leads to our injected
  // code being executed although it shouldn't be:
  //
  // Intermediate result:
  //
  //   if (true) { // <- inlined by intermediate compile step
  //     const previousHotModuleExports = module.hot.data && ...
  //                    // Crash happens here ---^
  //
  // It crashes at that line because some intermediate compiler isn't
  // running in hot mode, but the overall guard condition was compiled
  // down to being truthy. By moving `module.hot` outside of the
  // condition of the if-statement, it will be left as is.
  const moduleHot = module.hot;

  if (moduleHot) {
    const currentExports = __refresh_utils__.getExports(module);
    const previousHotModuleExports = moduleHot.data && moduleHot.data.moduleExports;

    __refresh_utils__.registerExports(currentExports, module.id);

    if (isRefreshComponent) {
      if (previousHotModuleExports) {
        try {
          __refresh_utils__.performReactRefresh();
        } catch (e) {
          // Only available in newer webpack versions.
          if (moduleHot.invalidate) {
            moduleHot.invalidate();
          } else {
            self.location.reload();
          }
        }
      }

      moduleHot.dispose((data) => {
        data.moduleExports = __refresh_utils__.getExports(module);
      });

      moduleHot.accept(function errorRecovery() {
        // if (typeof __prefresh_errors__ !== "undefined" && __prefresh_errors__ && __prefresh_errors__.handleRuntimeError) {
        //   __prefresh_errors__.handleRuntimeError(error);
        // }
        console.log("has error");

        require.cache[module.id].hot.accept(errorRecovery);
      });
    }
  }
};
