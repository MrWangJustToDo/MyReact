import { __my_react_internal__, __my_react_shared__, cloneElement, isValidElement } from "@my-react/react";
import {
  MyReactFiberNode,
  debugWithNode,
  enableDebugUpdateQueue,
  enableFiberForLog,
  enableLogForCurrentFlowIsRunning,
  enableValidMyReactElement,
  getCurrentDispatchFromFiber,
  // getFiberTree,
  unmountFiber,
} from "@my-react/react-reconciler";
import { include } from "@my-react/react-shared";

import { ClientDomDispatch } from "@my-react-dom-client/renderDispatch";
import { latestNoopRender, legacyNoopRender } from "@my-react-dom-noop/mount/render";
import { PlainElement, ContainerElement, CommentStartElement } from "@my-react-dom-server/api";
import { enableControlComponent, enableDOMField, enableEventSystem, enableEventTrack, debounce, isServer } from "@my-react-dom-shared";

import type { LikeJSX } from "@my-react/react";
import type { CustomRenderDispatch, MyReactFiberNodeDev } from "@my-react/react-reconciler";
import type { RenderContainer } from "@my-react-dom-client/mount";
import type { CommentEndElement, TextElement } from "@my-react-dom-server/api";
import type { LatestServerStreamDispatch, LegacyServerStreamDispatch, ServerDomDispatch } from "@my-react-dom-server/renderDispatch";

const { enableScopeTreeLog } = __my_react_shared__;

export const __my_react_dom_shared__ = {
  enableFiberForLog,
  enableDebugUpdateQueue,
  enableValidMyReactElement,
  enableLogForCurrentFlowIsRunning,
  enableControlComponent,
  enableDOMField,
  enableEventSystem,
  enableEventTrack,
};

export const __my_react_dom_internal__ = {
  legacyNoopRender: (ele: LikeJSX) => __DEV__ ? legacyNoopRender(ele) : null,
  latestNoopRender: (ele: LikeJSX) => __DEV__ ? latestNoopRender(ele) : null,
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
        if (renderDispatch.enableAsyncHydrate) {
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
