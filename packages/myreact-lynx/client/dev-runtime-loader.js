/**
 * DevTools Runtime Loader
 *
 * Tries to load the pre-fetched devtools (from postinstall), then falls back to CDN.
 *
 * Flow:
 * 1. Try to require the local dev-runtime.js (fetched during postinstall)
 * 2. If not available, fetch from CDN dynamically
 * 3. After script executes, call the inject callback if registered
 */
(function () {
  "use strict";

  var DEVTOOLS_URL = "https://mrwangjusttodo.github.io/myreact-devtools/bundle/bundle-ws-dev.js";

  function injectDevTools() {
    if (typeof globalThis.__MY_REACT_LYNX_INJECT_DEVTOOLS__ === "function") {
      globalThis.__MY_REACT_LYNX_INJECT_DEVTOOLS__();
    }
  }

  function loadFromCDN() {
    if (typeof globalThis.fetch !== "function") {
      console.warn("[@my-react/react-lynx] fetch not available, skipping devtools");
      return;
    }

    globalThis
      .fetch(DEVTOOLS_URL)
      .then(function (response) {
        if (!response.ok) {
          throw new Error("HTTP " + response.status);
        }
        return response.text();
      })
      .then(function (code) {
        try {
          var fn = new Function(code);
          fn();
          injectDevTools();
        } catch (e) {
          console.warn("[@my-react/react-lynx] failed to execute devtools:", e);
        }
      })
      .catch(function (err) {
        console.warn("[@my-react/react-lynx] failed to load devtools from CDN:", err);
      });
  }

  try {
    require("./dev-runtime.js");
    injectDevTools();
  } catch (_e) {
    loadFromCDN();
  }
})();
