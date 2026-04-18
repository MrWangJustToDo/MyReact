// @ts-nocheck
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

  // Handle missing factory for CSS HMR runtime in lazy-loaded chunks
  // When CSS modules are lazy-loaded, they require hotModuleReplacement.cjs
  // but this module may not be available in __webpack_modules__ yet.
  // We provide a no-op factory to prevent the "factory is undefined" error.
  if (typeof originalFactory !== "function") {
    // Check if this is the CSS HMR runtime module
    if (options.id && options.id.includes("hotModuleReplacement")) {
      // Provide a no-op factory that exports basic HMR stubs
      options.factory = function (module, exports, require) {
        // Provide stub HMR API for lazy-loaded CSS
        // This allows CSS to load without errors, but HMR won't work for lazy CSS
        module.exports = function (moduleId, options) {
          // No-op: CSS HMR is not supported for lazy-loaded modules
          return { dispose: function() {}, accept: function() {} };
        };
        module.exports.cssReload = function() {};
      };
    }
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
