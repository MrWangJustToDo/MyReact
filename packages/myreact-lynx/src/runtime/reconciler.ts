/* eslint-disable @typescript-eslint/ban-ts-comment */
import { OP } from "../shared/op.js";

import { register, unregister, updateHandler } from "./event-registry.js";
import { scheduleFlush } from "./flush.js";
import { pushOp } from "./ops.js";
import { registerWorkletCtx } from "./run-on-background.js";
import { ShadowElement } from "./shadow-element.js";

import type { Props } from "@my-react/react/type";
import type { HostConfig } from "@my-react/react-reconciler-compact";

// ---------------------------------------------------------------------------
// Style normalisation – numeric values → 'Npx' (Lynx requires units)
// ---------------------------------------------------------------------------

// Properties that accept a bare number (no unit needed).
const DIMENSIONLESS = new Set(["flex", "flexGrow", "flexShrink", "flexOrder", "order", "opacity", "zIndex", "aspectRatio", "fontWeight", "lineClamp"]);

const isPlainObject = (value: unknown): value is Record<string, unknown> => !!value && typeof value === "object" && !Array.isArray(value);

const normalizeStyle = (style: Record<string, unknown>) => {
  const autoPixelUnit = (globalThis as any).__MY_REACT_LYNX_AUTO_PIXEL_UNIT__ ?? true;
  const output: Record<string, unknown> = {};

  Object.keys(style).forEach((key) => {
    const value = style[key];
    // TODO
    if (key === "flex" && typeof value === "number") {
      output[key] = `${value}`;
      return;
    }

    if (autoPixelUnit && typeof value === "number" && !DIMENSIONLESS.has(key)) {
      output[key] = value === 0 ? 0 : `${value}px`;
      return;
    }

    output[key] = value;
  });

  return output;
};

type EventSpec = {
  eventType: string;
  eventName: string;
};

const parseEventProp = (key: string): EventSpec | null => {
  if (key.startsWith("global-bind")) {
    return { eventType: "bindGlobalEvent", eventName: key.slice("global-bind".length) };
  }
  if (key.startsWith("global-catch")) {
    return { eventType: "catchGlobalEvent", eventName: key.slice("global-catch".length) };
  }
  if (key.startsWith("catch")) {
    return { eventType: "catchEvent", eventName: key.slice("catch".length) };
  }
  if (key.startsWith("bind")) {
    return { eventType: "bindEvent", eventName: key.slice("bind".length) };
  }
  if (key.startsWith("on")) {
    const name = key.slice(2);
    return { eventType: "bindEvent", eventName: name ? name.slice(0, 1).toLowerCase() + name.slice(1) : name };
  }
  return null;
};

// Track the sign registered for each (element, propKey) so we can unregister
// on prop removal / update.
const elementEventSigns = new Map<number, Map<string, string>>();

const diffProps = (prev: Props, next: Props) => {
  const propChanges: Record<string, unknown> = {};
  let hasPropChanges = false;

  let hasStyleChanges = false;

  const prevStyle = isPlainObject(prev.style) ? (prev.style as Record<string, unknown>) : null;
  const nextStyle = isPlainObject(next.style) ? (next.style as Record<string, unknown>) : null;

  const keys = new Set([...Object.keys(prev), ...Object.keys(next)]);

  keys.forEach((key) => {
    if (key === "children") {
      return;
    }

    const prevValue = prev[key];
    const nextValue = next[key];

    if (key === "style") {
      if (!prevStyle && !nextStyle) {
        return;
      }
      const styleKeys = new Set([...(prevStyle ? Object.keys(prevStyle) : []), ...(nextStyle ? Object.keys(nextStyle) : [])]);
      styleKeys.forEach((styleKey) => {
        if (!prevStyle || !nextStyle || prevStyle[styleKey] !== nextStyle[styleKey]) {
          hasStyleChanges = true;
        }
      });
      return;
    }

    if (prevValue !== nextValue) {
      propChanges[key] = nextValue;
      hasPropChanges = true;
    }
  });

  if (!hasPropChanges && !hasStyleChanges) {
    return null;
  }

  return {
    props: hasPropChanges ? propChanges : null,
    style: hasStyleChanges ? normalizeStyle(nextStyle || {}) : null,
  };
};

type LynxELementType = "view" | "text" | "image" | "scroll-view" | "list" | "page" | "frame" | "input" | "textarea" | "overlay";

type HostContext = {
  isInsideText: boolean;
};

const helpAppend = (parent: ShadowElement, child: ShadowElement, anchor?: ShadowElement | null) => {
  // Lynx's native <list> only accepts <list-item> children.
  if (parent.type === "list" && child.type !== "list-item") {
    // console.warn('')
    return;
  }

  if (anchor) {
    parent.insertBefore(child, anchor);
  } else {
    parent.appendChild(child);
  }

  // SEE main-thread
  pushOp(OP.INSERT, parent.id, child.id, anchor ? anchor.id : -1);
};

const helpRemove = (parent: ShadowElement, child: ShadowElement) => {
  if (child.parent) {
    if (child.parent !== parent) {
      // console.warn('')
    }
    const parentId = child.parent.id;
    child.parent.removeChild(child);
    pushOp(OP.REMOVE, parentId, child.id);
  }
};

const applyEvent = (instance: ShadowElement, key: string, value: any) => {
  const event = parseEventProp(key);
  if (!event) return;
  let signs = elementEventSigns.get(instance.id);
  const oldSign = signs?.get(key);
  if (value != null) {
    const handler = value as (data: unknown) => void;
    if (oldSign) {
      // Re-render: update handler in-place so the sign on the Main Thread
      // stays valid.  No new SET_EVENT op needed.
      updateHandler(oldSign, handler);
    } else {
      // First time this event is bound on this element.
      const sign = register(handler);
      if (!signs) {
        signs = new Map<string, string>();
        elementEventSigns.set(instance.id, signs);
      }
      signs.set(key, sign);
      pushOp(OP.SET_EVENT, instance.id, event.eventType, event.eventName, sign);
    }
  } else if (oldSign) {
    // Handler removed entirely.
    unregister(oldSign);
    signs!.delete(key);
    pushOp(OP.REMOVE_EVENT, instance.id, event.eventType, event.eventName);
  }
};

const applyWorklet = (instance: ShadowElement, key: string, value: any) => {
  const suffix = key.slice("main-thread-".length);
  if (suffix === "ref") {
    // MainThreadRef — send the serialised { _wvid, _initValue } to MT
    if (value != null && typeof value === "object" && "_wvid" in (value as Record<string, unknown>)) {
      pushOp(OP.SET_MT_REF, instance.id, (value as { toJSON(): unknown }).toJSON());
    }
  } else {
    const event = parseEventProp(suffix);
    if (event && value) {
      if (typeof value === "function") {
        registerWorkletCtx(value as unknown as Worklet);
        pushOp(OP.SET_WORKLET_EVENT, instance.id, event.eventType, event.eventName, value);
      } else {
        console.warn("");
      }
    } else {
      // Worklet handler removed — send REMOVE_EVENT so MT clears eventMap
      pushOp(OP.REMOVE_EVENT, instance.id, event.eventType, event.eventName);
    }
  }
};

const applyProps = (instance: ShadowElement, props: Props) => {
  Object.keys(props).forEach((key) => {
    if (key === "children") return;
    const value = props[key];
    if (key === "id") {
      pushOp(OP.SET_ID, instance.id, value ? String(value) : "");
      return;
    } else if (key === "className") {
      const className = value as string | undefined;
      instance.class = className;
      pushOp(OP.SET_CLASS, instance.id, className || "");
      return;
    } else if (key.startsWith("main-thread-") || key.startsWith("main-thread:")) {
      applyWorklet(instance, key, value);
      return;
    }

    const event = parseEventProp(key);

    if (event) {
      applyEvent(instance, key, value);
      return;
    }

    pushOp(OP.SET_PROP, instance.id, key, value);
  });
};

const applyStyle = (instance: ShadowElement, style: Props) => {
  instance.style = style;
  pushOp(OP.SET_STYLE, instance.id, style);
};

export const hostConfig: HostConfig<
  LynxELementType,
  Props,
  ShadowElement,
  ShadowElement,
  ShadowElement,
  unknown, // SuspenseInstance
  unknown, // HydratableInstance
  unknown, // FormInstance
  unknown,
  HostContext,
  unknown, // ChildSet
  unknown, // TimeoutHandle
  unknown, // NoTimeout
  unknown // TransitionStatus
> = {
  supportsMutation: true,
  supportsPersistence: false,
  supportsHydration: false,

  getRootHostContext: () => ({ isInsideText: false }),
  getChildHostContext: (parentContext, type) => {
    const isInsideText = parentContext.isInsideText || type === "text";
    return { ...parentContext, isInsideText };
  },

  shouldSetTextContent: () => false,

  createInstance(type) {
    const instance = new ShadowElement(type);
    pushOp(OP.CREATE, instance.id, type);
    return instance;
  },

  createTextInstance(text) {
    const instance = new ShadowElement("#text");
    instance.text = text;
    pushOp(OP.CREATE_TEXT, instance.id);
    if (text) pushOp(OP.SET_TEXT, instance.id, text);
    return instance;
  },

  appendInitialChild(parent, child) {
    helpAppend(parent, child);
  },

  appendChild(parent, child) {
    helpAppend(parent, child);
  },

  appendChildToContainer(container, child) {
    helpAppend(container, child);
  },

  insertBefore(parent, child, before) {
    helpAppend(parent, child, before as ShadowElement);
  },

  insertInContainerBefore(container, child, before) {
    helpAppend(container, child, before as ShadowElement);
  },

  removeChild(parent, child) {
    helpRemove(parent, child as ShadowElement);
  },

  removeChildFromContainer(container, child) {
    helpRemove(container, child as ShadowElement);
  },

  finalizeInitialChildren() {
    return true;
  },

  // @my-react support new/old react-reconciler flow
  // @ts-ignore
  prepareUpdate(_instance, _type, oldProps, newProps) {
    return diffProps(oldProps, newProps);
  },

  commitMount(instance, type, props) {
    const { style, ...restProps } = props;

    applyProps(instance, restProps);
    applyStyle(instance, style as Record<string, unknown>);
  },

  // @ts-ignore
  commitUpdate(instance, payload, _type, oldProps, newProps) {
    if (!payload) {
      return;
    }

    instance.props = newProps;

    const typedPayload = payload as unknown as { props: Record<string, unknown>; style: Record<string, unknown> };

    if (typedPayload.props) {
      applyProps(instance, typedPayload.props);
    }

    if (typedPayload.style) {
      applyStyle(instance, typedPayload.style);
    }
  },

  commitTextUpdate(textInstance, _oldText, newText) {
    textInstance.text = newText;
    pushOp(OP.SET_TEXT, textInstance.id, newText);
  },

  prepareForCommit() {
    return null;
  },

  resetAfterCommit() {
    scheduleFlush();
  },

  getPublicInstance: (instance) => instance,

  clearContainer() {
    elementEventSigns.clear();
    return false;
  },
};
