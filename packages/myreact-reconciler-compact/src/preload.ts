import { loadRemoteModule } from "./polyfill";

export const preloadDevToolRuntimeAuto = async () => {
  if (globalThis["__MY_REACT_DEVTOOL_INTERNAL__"]) return;

  // load core runtime
  await loadRemoteModule("https://mrwangjusttodo.github.io/myreact-devtools/bundle/hook.js", { context: { globalThis } });
  // connect to devtools, current need run https://github.com/MrWangJustToDo/myreact-devtools with pnpm run dev:web command
};

export const preloadDevToolRuntimeSocketIO = async () => {
  if (globalThis["__MY_REACT_DEVTOOL_INTERNAL__"]) return;

  // load core runtime
  // also load socket.io
  await loadRemoteModule("https://mrwangjusttodo.github.io/myreact-devtools/bundle/bundle-dev.js", { context: { globalThis } });
};

export const preloadDevToolRuntimeWebsocket = async () => {
  if (globalThis["__MY_REACT_DEVTOOL_INTERNAL__"]) return;

  // load core runtime
  await loadRemoteModule("https://mrwangjusttodo.github.io/myreact-devtools/bundle/bundle-ws-dev.js", { context: { globalThis } });
};
