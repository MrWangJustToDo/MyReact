import createReconciler from "@my-react/react-reconciler-compact";

import { hostConfig } from "./host-config";

import type { RootRenderable } from "@opentui/core";
import type React from "react";

export const reconciler = createReconciler(hostConfig);

if (process.env["DEV"]) {
  const injectIntoDevTools = async (url: string, config: any) => {
    const { io } = await import("socket.io-client");
    globalThis.io = io;
    const typedReconciler = reconciler as typeof reconciler & {
      injectIntoDevToolsWithSocketIO: (url: string, config: any) => Promise<void>;
    };
    typedReconciler.injectIntoDevToolsWithSocketIO(url, config);
  };

  const DEVTOOL_PATH = process.env["DEVTOOL_PATH"] || "localhost";

  const DEVTOOL_PORT = process.env["DEVTOOL_PORT"] || "3002";

  // TODO: make this configurable
  injectIntoDevTools(`http://${DEVTOOL_PATH}:${DEVTOOL_PORT}`, {
    rendererPackageName: "@my-react/react-opentui",
  });

  process.on("SIGINT", () => {
    globalThis["__MY_REACT_DEVTOOL_NODE__"]?.close?.();
  });
}

export function _render(element: React.ReactNode, root: RootRenderable) {
  const container = reconciler.createContainer(root, 1, null, false, null, "", console.error, console.error, console.error, console.error, null);

  reconciler.updateContainer(element, container, null, () => {});
}
