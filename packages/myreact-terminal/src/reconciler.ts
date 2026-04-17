/* eslint-disable @typescript-eslint/ban-ts-comment */
import { createContext, type Props } from "@my-react/react/type";
import createReconciler from "@my-react/react-reconciler-compact";
import { DefaultEventPriority, NoEventPriority } from "@my-react/react-reconciler-compact/constants";
import Yoga from "yoga-layout";

import {
  createTextNode,
  appendChildNode,
  insertBeforeNode,
  removeChildNode,
  setStyle,
  setTextNodeValue,
  createNode,
  setAttribute,
  markNodeAsDirty,
  type DOMNodeAttribute,
  type TextNode,
  type ElementNames,
  type DOMElement,
  type DOMNode,
} from "./dom.js";
import { type Region } from "./output.js";
import { type OutputTransformer } from "./render-node-to-output.js";
import applyStyles, { type Styles } from "./styles.js";

type AnyObject = Record<string, unknown>;

const diff = (before: AnyObject, after: AnyObject): AnyObject | undefined => {
  if (before === after) {
    return;
  }

  if (!before) {
    return after;
  }

  const changed: AnyObject = {};
  let isChanged = false;

  for (const key of Object.keys(before)) {
    const isDeleted = after ? !Object.hasOwn(after, key) : true;

    if (isDeleted) {
      changed[key] = undefined;
      isChanged = true;
    }
  }

  if (after) {
    for (const key of Object.keys(after)) {
      if (after[key] !== before[key]) {
        changed[key] = after[key];
        isChanged = true;
      }
    }
  }

  return isChanged ? changed : undefined;
};

const cleanupNodeTree = (node?: DOMNode): void => {
  if (!node) {
    return;
  }

  node.yogaNode?.unsetMeasureFunc();

  if ("resizeObservers" in node) {
    node.resizeObservers?.clear();
  }

  if ("childNodes" in node && node.childNodes) {
    for (const child of node.childNodes) {
      cleanupNodeTree(child);
    }
  }

  node.yogaNode?.free();

  if ("cachedRender" in node) {
    node.cachedRender = undefined;
  }

  if ("childNodes" in node) {
    node.childNodes = [];
  }

  node.parentNode = undefined;
};

type HostContext = {
  isInsideText: boolean;
};

let currentUpdatePriority = NoEventPriority;

export const Reconciler = createReconciler<
  ElementNames,
  Props,
  DOMElement,
  DOMElement,
  TextNode,
  DOMElement,
  unknown,
  unknown,
  unknown,
  HostContext,
  unknown,
  unknown,
  unknown,
  unknown
>({
  getRootHostContext: () => ({
    isInsideText: false,
  }),
  prepareForCommit: () => null,
  preparePortalMount: () => null,
  clearContainer: () => false,
  resetAfterCommit(rootNode) {
    if (typeof rootNode.onComputeLayout === "function") {
      rootNode.onComputeLayout();
    }

    // Since renders are throttled at the instance level and <Static> component children
    // are rendered only once and then get deleted, we need an escape hatch to
    // trigger an immediate render to ensure <Static> children are written to output before they get erased
    if (rootNode.isStaticDirty) {
      rootNode.isStaticDirty = false;
      if (typeof rootNode.onImmediateRender === "function") {
        rootNode.onImmediateRender();
      }

      return;
    }

    if (typeof rootNode.onRender === "function") {
      rootNode.onRender();
    }
    // react will switch rootNode, so every time resetAfterCommit called, we need to clean the staticNode
    rootNode.staticNode = null;
  },
  getChildHostContext(parentHostContext, type) {
    const previousIsInsideText = parentHostContext.isInsideText;
    const isInsideText = type === "ink-text" || type === "ink-virtual-text";

    if (previousIsInsideText === isInsideText) {
      return parentHostContext;
    }

    return { isInsideText };
  },
  shouldSetTextContent: () => false,
  createInstance(originalType, newProps, rootNode, hostContext) {
    if (hostContext.isInsideText && originalType === "ink-box") {
      throw new Error(`<Box> can’t be nested inside <Text> component`);
    }

    const type = originalType === "ink-text" && hostContext.isInsideText ? "ink-virtual-text" : originalType;

    const node = createNode(type);

    for (const [key, value] of Object.entries(newProps)) {
      if (key === "children") {
        continue;
      }

      if (key === "style") {
        setStyle(node, value as Styles);

        if (node.yogaNode) {
          applyStyles(node.yogaNode, value as Styles);
        }

        continue;
      }

      if (key === "internal_transform") {
        node.internal_transform = value as OutputTransformer;
        continue;
      }

      if (key === "sticky") {
        node.internal_sticky = value as boolean | "top" | "bottom";
        continue;
      }

      if (key === "internal_stickyAlternate") {
        node.internal_stickyAlternate = value as boolean;
        continue;
      }

      if (key === "internal_terminalCursorFocus") {
        node.internal_terminalCursorFocus = value as boolean;
        continue;
      }

      if (key === "internal_terminalCursorPosition") {
        node.internal_terminalCursorPosition = value as number;
        continue;
      }

      if (key === "internal_onBeforeRender") {
        node.internal_onBeforeRender = value as () => void;
        continue;
      }

      if (key === "internal_static") {
        node.internal_static = true;
        continue;
      }

      if (key === "cachedRender") {
        node.cachedRender = value as Region;
        continue;
      }

      if (key === "opaque") {
        node.internal_opaque = value as boolean;
        continue;
      }

      if (key === "scrollbar") {
        node.internal_scrollbar = value as boolean;
        continue;
      }

      setAttribute(node, key, value as DOMNodeAttribute);
    }

    return node;
  },
  createTextInstance(text, _root, hostContext) {
    if (!hostContext.isInsideText) {
      throw new Error(`Text string "${text}" must be rendered inside <Text> component`);
    }

    return createTextNode(text);
  },
  resetTextContent() {},
  hideTextInstance(node) {
    setTextNodeValue(node, "");
  },
  unhideTextInstance(node, text) {
    setTextNodeValue(node, text);
  },
  getPublicInstance: (instance) => instance,
  hideInstance(node) {
    node.yogaNode?.setDisplay(Yoga.DISPLAY_NONE);
  },
  unhideInstance(node) {
    node.yogaNode?.setDisplay(Yoga.DISPLAY_FLEX);
  },
  appendInitialChild: appendChildNode,
  appendChild: appendChildNode,
  insertBefore: insertBeforeNode,
  finalizeInitialChildren() {
    return false;
  },
  isPrimaryRenderer: true,
  supportsMutation: true,
  supportsPersistence: false,
  supportsHydration: false,
  scheduleTimeout: setTimeout,
  cancelTimeout: clearTimeout,
  noTimeout: -1,
  beforeActiveInstanceBlur() {},
  afterActiveInstanceBlur() {},
  detachDeletedInstance() {},
  getInstanceFromNode: () => null,
  prepareScopeUpdate() {},
  getInstanceFromScope: () => null,
  appendChildToContainer: appendChildNode,
  insertInContainerBefore: insertBeforeNode,
  removeChildFromContainer(node, removeNode) {
    removeChildNode(node, removeNode);
    cleanupNodeTree(removeNode);
  },
  // @ts-ignore my-react flow
  prepareUpdate(node, _type, oldProps, newProps, rootNode) {
    if (node.internal_static) {
      rootNode.isStaticDirty = true;
    }

    const props = diff(oldProps, newProps);

    const style = diff(oldProps["style"] as Styles, newProps["style"] as Styles);

    if (!props && !style) {
      return null;
    }

    return { props, style };
  },
  // @ts-ignore
  commitUpdate(node, { props, style }) {
    if (props) {
      for (const [key, value] of Object.entries(props)) {
        if (key === "style") {
          setStyle(node, value as Styles);
          continue;
        }

        if (key === "internal_transform") {
          node.internal_transform = value as OutputTransformer;
          markNodeAsDirty(node);
          continue;
        }

        if (key === "sticky") {
          node.internal_sticky = value as boolean | "top" | "bottom";
          continue;
        }

        if (key === "internal_stickyAlternate") {
          node.internal_stickyAlternate = Boolean(value);
          continue;
        }

        if (key === "internal_terminalCursorFocus") {
          node.internal_terminalCursorFocus = value as boolean;
          continue;
        }

        if (key === "internal_terminalCursorPosition") {
          node.internal_terminalCursorPosition = value as number;
          continue;
        }

        if (key === "internal_onBeforeRender") {
          node.internal_onBeforeRender = value as (node: DOMElement) => void;
          continue;
        }

        if (key === "internal_static") {
          node.internal_static = true;
          continue;
        }

        if (key === "cachedRender") {
          node.cachedRender = value as Region;
          continue;
        }

        if (key === "opaque") {
          node.internal_opaque = Boolean(value);
          continue;
        }

        if (key === "scrollbar") {
          node.internal_scrollbar = value as boolean;
          continue;
        }

        setAttribute(node, key, value as DOMNodeAttribute);
      }
    }

    if (style && node.yogaNode) {
      applyStyles(node.yogaNode, style);
    }
  },
  commitTextUpdate(node, _oldText, newText) {
    setTextNodeValue(node, newText);
  },
  removeChild(node, removeNode) {
    removeChildNode(node, removeNode);
    cleanupNodeTree(removeNode);
  },
  setCurrentUpdatePriority(newPriority: number) {
    currentUpdatePriority = newPriority;
  },
  getCurrentUpdatePriority: () => currentUpdatePriority,
  resolveUpdatePriority() {
    if (currentUpdatePriority !== NoEventPriority) {
      return currentUpdatePriority;
    }

    return DefaultEventPriority;
  },
  maySuspendCommit() {
    return false;
  },

  NotPendingTransition: undefined,

  HostTransitionContext: createContext(null) as any,
  resetFormInstance() {},
  requestPostPaintCallback() {},
  shouldAttemptEagerTransition() {
    return false;
  },
  trackSchedulerEvent() {},
  resolveEventType() {
    return null;
  },
  resolveEventTimeStamp() {
    return -1.1;
  },
  preloadInstance() {
    return true;
  },
  startSuspendingCommit() {},
  suspendInstance() {},
  waitForCommitToBeReady() {
    return null;
  },
});
