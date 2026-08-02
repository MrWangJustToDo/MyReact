// HMR webpack intercept — layer remapping + $RefreshReg$ wrapping.
// React Refresh *updates* (forceUpdate / performReactRefresh) stay on Background
// (`applyRefresh` issuerLayer + jsx-dev-runtime BG-only inject). This file only
// keeps module-id remapping / noop refresh globals working when MT loads chunks.
__webpack_require__.i.push(function (options) {
  if (
    // This means this is in main-thread (no Refresh helpers installed)
    !globalThis.$RefreshHelpers$ &&
    // Loading a module of background layer in main-thread, we replace the layer with the main-thread.
    options.id.includes("($BACKGROUND_LAYER$)")
  ) {
    // Hot-update / chunk ids may still carry the Background layer tag.
    // Remap to the Main Thread module so require does not miss the factory.
    // This does NOT run React Refresh on MT — only resolves the correct module.
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
