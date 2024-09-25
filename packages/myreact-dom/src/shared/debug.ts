import { __my_react_internal__, __my_react_shared__, cloneElement, isValidElement } from "@my-react/react";
import {
  MyReactFiberNode,
  debugWithNode,
  devErrorWithFiber,
  devWarnWithFiber,
  getCurrentDispatchFromFiber,
  onceErrorWithKeyAndFiber,
  onceWarnWithKeyAndFiber,
  unmountFiber,
} from "@my-react/react-reconciler";
import { include } from "@my-react/react-shared";

import { ClientDomDispatch } from "@my-react-dom-client/renderDispatch";
import { latestNoopRender, legacyNoopRender } from "@my-react-dom-noop/mount/render";
import { PlainElement, ContainerElement, CommentStartElement } from "@my-react-dom-server/api";

import { enableControlComponent, enableDOMField, enableEventSystem, enableEventTrack, isServer } from "./env";
import { debounce } from "./tools";

import type { LikeJSX } from "@my-react/react";
import type { CustomRenderDispatch, MyReactFiberNodeDev } from "@my-react/react-reconciler";
import type { RenderContainer } from "@my-react-dom-client/mount";
import type { CommentEndElement, TextElement } from "@my-react-dom-server/api";
import type { LatestServerStreamDispatch, LegacyServerStreamDispatch, ServerDomDispatch } from "@my-react-dom-server/renderDispatch";

const { enableOptimizeTreeLog, enableScopeTreeLog } = __my_react_shared__;

const __my_react_dom_shared__ = {
  enableControlComponent,
  enableDOMField,
  enableEventSystem,
  enableEventTrack,
};

const __my_react_dom_internal__ = {
  legacyNoopRender: (ele: LikeJSX) => legacyNoopRender(ele),
  latestNoopRender: (ele: LikeJSX) => latestNoopRender(ele),
};

/**
 * @internal
 */
export const log = (fiber: MyReactFiberNode, level: "warn" | "error", ...rest: any) => {
  if (__DEV__) {
    const last = enableOptimizeTreeLog.current;

    enableOptimizeTreeLog.current = false;

    if (level === "warn") {
      devWarnWithFiber(fiber, `[@my-react/react-dom]`, ...rest);
    }
    if (level === "error") {
      devErrorWithFiber(fiber, `[@my-react/react-dom]`, ...rest);
    }

    enableOptimizeTreeLog.current = last;

    return;
  }

  if (level === "error") {
    console.error(`[@my-react/react-dom]`, ...rest);
  }
};

const onceMap: Record<string, boolean> = {};

/**
 * @internal
 */
export const logOnce = (fiber: MyReactFiberNode, level: "warn" | "error", key: string, ...rest: string[]) => {
  if (__DEV__) {
    if (level === "warn") {
      onceWarnWithKeyAndFiber(fiber, key, `[@my-react/react-dom]`, ...rest);
    }
    if (level === "error") {
      onceErrorWithKeyAndFiber(fiber, key, `[@my-react/react-dom]`, ...rest);
    }

    return;
  }

  if (level === "error") {
    if (onceMap[key]) return;

    onceMap[key] = true;

    console.error(`[@my-react/react-dom]`, ...rest);
  }
};

/**
 * @internal
 */
export const prepareDevContainer = (renderDispatch: ClientDomDispatch) => {
  Object.defineProperty(renderDispatch, "__my_react_shared__", { value: __my_react_shared__ });
  Object.defineProperty(renderDispatch, "__my_react_internal__", { value: __my_react_internal__ });
  Object.defineProperty(renderDispatch, "__my_react_dom_shared__", { value: __my_react_dom_shared__ });
  Object.defineProperty(renderDispatch, "__my_react_dom_internal__", { value: __my_react_dom_internal__ });
  Object.defineProperty(MyReactFiberNode.prototype, "_debugRender", {
    get: function (this: MyReactFiberNodeDev) {
      if (!isValidElement(this._debugElement)) return;

      const element = cloneElement(this._debugElement);

      if (!isValidElement(element)) return;

      const renderDispatch = getCurrentDispatchFromFiber(this) as
        | ClientDomDispatch
        | ServerDomDispatch
        | LegacyServerStreamDispatch
        | LatestServerStreamDispatch;

      const get = async () => {
        if (renderDispatch.enableASyncHydrate) {
          const _re = enableScopeTreeLog.current;

          enableScopeTreeLog.current = false;

          const re = await latestNoopRender(element);

          enableScopeTreeLog.current = _re;

          return re;
        } else {
          const _re = enableScopeTreeLog.current;

          enableScopeTreeLog.current = false;

          const re = legacyNoopRender(element);

          enableScopeTreeLog.current = _re;

          return re;
        }
      };

      const re = get();

      re.then((res) => (parse(res), res)).then((res) => {
        unmountFiber(res.__container__.rootFiber);
        res.__container__.isAppMounted = false;
        res.__container__.isAppUnmounted = true;
      });

      return re;
    },
    configurable: true,
  });
};

/**
 * @internal
 */
export const checkRehydrate = (container: Partial<RenderContainer>) => {
  const rootContainer = container.__container__;

  if (rootContainer instanceof ClientDomDispatch) {
    throw new Error(`[@my-react/react-dom] hydrate error, current container have been hydrated`);
  }
};

/**
 * @internal
 */
export const patchDOMField = (fiber: MyReactFiberNode, renderDispatch: CustomRenderDispatch) => {
  if ((enableDOMField.current || __DEV__) && include(fiber.type, renderDispatch.runtimeRef.typeForNativeNode)) {
    renderDispatch.pendingLayoutEffect(fiber, function pathDOMFieldOnFiber() {
      debugWithNode(fiber);
    });
  }
};

const eventArray: string[] = [];

/**
 * @internal
 */
const logEvent = debounce((eventArray: string[], fiber: MyReactFiberNode) => {
  console.log(`eventFlow: ${eventArray.join(" -> ")} (%o)`, fiber);
}, 16);

/**
 * @internal
 */
export const triggerEvent = (eventName: string, fiber: MyReactFiberNode) => {
  eventArray.push(eventName);

  logEvent(Array.from(eventArray), fiber);
};

/**
 * @internal
 */
export const clearEvent = () => {
  eventArray.pop();
};

/**
 * @internal
 */
export const draw = (node: PlainElement | ContainerElement | string | TextElement | CommentStartElement | CommentEndElement, level = 0) => {
  if (node instanceof PlainElement) {
    const indentation = " ".repeat(level);
    console.log(indentation + node.type);
    node.children.forEach((c) => draw(c, level + 1));
  }
  if (node instanceof ContainerElement) {
    node.children.forEach((c) => draw(c, level));
  }

  if (node instanceof CommentStartElement) {
    const indentation = " ".repeat(level);
    console.log(indentation + "<-- -->");
  }
};

/**
 * @internal
 */
export const parse = (node: ContainerElement) => {
  if (!isServer) {
    const p = new DOMParser();

    const document = p.parseFromString(node.toString(), "text/html");

    console.log(document);
  }
};
