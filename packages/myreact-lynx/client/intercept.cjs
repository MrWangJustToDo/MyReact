// this file used for hmr setup
__webpack_require__.i.push(function (options) {
  if (
    // This means this is in main-thread
    !globalThis.$RefreshHelpers$ &&
    // Loading a module of background layer in main-thread, we replace the layer with the main-thread.
    options.id.includes("($BACKGROUND_LAYER$)")
  ) {
    // We may serialize the snapshot from background to main-thread.
    // The `(react:background)` layer in the module id cannot be found in the main-thread.
    // Thus we replace it here to make HMR work.
    //
    // Maybe it is better to run chunk loading on main thread.
    options.id = options.id.replace(
      `($BACKGROUND_LAYER$)`, // This is replaced by ReactRefreshWebpackPlugin
      "($MAIN_THREAD_LAYER$)" // This is replaced by ReactRefreshWebpackPlugin
    );
    const factory = __webpack_modules__[options.id];
    if (factory) {
      options.factory = factory;
    }
    return;
  }

  var originalFactory = options.factory;

  // Skip non-JS modules (e.g., CSS modules don't have factories)
  if (typeof originalFactory !== "function") {
    return;
  }

  options.factory = function (moduleObject, moduleExports, webpackRequire) {
    var prevRefreshReg = globalThis.$RefreshReg$;
    var prevRefreshSig = globalThis.$RefreshSig$;
    var reg = function (currentModuleId) {
      globalThis.$RefreshReg$ = function (type, id) {
        if (globalThis.$RefreshRuntime$) {
          globalThis.$RefreshRuntime$.register(type, currentModuleId + " " + id);
        }
      };
    };
    reg(moduleObject.id);
    var sig = function (currentModuleId) {
      if (globalThis.$RefreshRuntime$) {
        globalThis.$RefreshSig$ = globalThis.$RefreshRuntime$.createSignatureFunctionForTransform;
      } else {
        globalThis.$RefreshSig$ = function () {
          return function (type) {
            return type;
          };
        };
      }
    };
    sig(moduleObject.id);
    try {
      originalFactory.call(this, moduleObject, moduleExports, webpackRequire);
    } finally {
      globalThis.$RefreshReg$ = prevRefreshReg;
      globalThis.$RefreshSig$ = prevRefreshSig;
    }
  };
});

globalThis[Symbol.for("__LYNX_WEBPACK_MODULES__")] = __webpack_modules__;
