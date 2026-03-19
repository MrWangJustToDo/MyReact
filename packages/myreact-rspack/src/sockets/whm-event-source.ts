/**
 * The following code is modified based on
 * https://github.com/pmmmwh/react-refresh-webpack-plugin/blob/f770d3962c388da01eeda7079bff5f40c93992d2/sockets/WHMEventSource.js
 *
 * MIT Licensed
 * Author Michael Mok
 * Copyright (c) 2019 Michael Mok
 * https://github.com/pmmmwh/react-refresh-webpack-plugin/blob/f770d3962c388da01eeda7079bff5f40c93992d2/LICENSE
 */

/**
 * The hard-coded singleton key for webpack-hot-middleware's client instance.
 *
 * [Ref](https://github.com/webpack-contrib/webpack-hot-middleware/blob/cb29abb9dde435a1ac8e9b19f82d7d36b1093198/client.js#L152)
 */
const singletonKey = "__webpack_hot_middleware_reporter__";

interface WHMClient {
  cleanProblemsCache: () => void;
  problems: () => boolean;
  success: () => void;
  useCustomOverlay: (customOverlay: { showProblems: (type: string, data: string[]) => void; clear: () => void }) => void;
}

declare global {
  interface Window {
    [singletonKey]: WHMClient;
  }
}

/**
 * Initializes a socket server for HMR for webpack-hot-middleware.
 * @param {function(*): void} messageHandler A handler to consume Webpack compilation messages.
 * @returns {void}
 */
export function init(messageHandler: (...args: unknown[]) => void) {
  const client = window[singletonKey];

  client.useCustomOverlay({
    showProblems(type, data) {
      messageHandler({ type, data });
    },
    clear() {
      messageHandler({ type: "ok" });
    },
  });
}
