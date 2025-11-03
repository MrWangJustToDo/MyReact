import { createReconciler } from "@my-react/react-reconciler-compact";

import { hostConfig } from "./host-config";

import type { RootRenderable } from "@opentui/core";
import type React from "react";

export const reconciler = createReconciler(hostConfig);

export function _render(element: React.ReactNode, root: RootRenderable) {
  const container = reconciler.createContainer(root, 1, null, false, null, "", console.error, console.error, console.error, console.error, null);

  reconciler.updateContainer(element, container, null, () => {});
}
