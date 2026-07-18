import { LegacyRoot } from "@my-react/react-reconciler-compact/constants";
import React, { type ReactNode } from "react";

import { accessibilityContext } from "./components/AccessibilityContext.js";
import { createNode, type DOMElement } from "./dom.js";
import { type Region } from "./output.js";
import { Reconciler } from "./reconciler.js";
import { renderToStatic } from "./render-node-to-output.js";

const noop = () => {};

const renderPendingStaticRenderNodes = (node: DOMElement, width: number): void => {
  for (const child of node.childNodes) {
    if (child.nodeName !== "#text") {
      renderPendingStaticRenderNodes(child, width);
    }
  }

  if (node.nodeName !== "ink-static-render" || node.cachedRender) {
    return;
  }

  const staticWidth = typeof node.style.width === "number" ? node.style.width : width;

  node.yogaNode?.setWidth(staticWidth);

  renderToStatic(node, {
    calculateLayout: true,
    skipStaticElements: false,
  });
};

let nextRegionId = 0;

export const renderToRegion = (node: ReactNode, options: { width: number }): Region => {
  const rootNode = createNode("ink-root");
  rootNode.yogaNode!.setWidth(options.width);

  const container = Reconciler.createContainer(rootNode, LegacyRoot, null, false, null, `id-${nextRegionId++}`, noop, noop, noop, noop, null);

  const tree = <accessibilityContext.Provider value={{ isScreenReaderEnabled: false, instance: null }}>{node}</accessibilityContext.Provider>;

  Reconciler.updateContainer(tree, container, null, noop);

  renderPendingStaticRenderNodes(rootNode, options.width);

  renderToStatic(rootNode, {
    calculateLayout: true,
    skipStaticElements: false,
  });

  Reconciler.flushSync();

  const region = rootNode.cachedRender;
  if (!region) {
    throw new Error("renderToRegion failed to produce a cached region");
  }

  Reconciler.updateContainer(null, container, null, noop);

  Reconciler.flushSync();

  return region;
};
