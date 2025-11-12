/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable import/namespace */
/* eslint-disable @typescript-eslint/ban-ts-comment */

// copy from https://github.com/pmndrs/its-fine, modified for @my-react compatible

import { HOOK_TYPE } from "@my-react/react-shared";
import * as React from "react";

import type { FiberNode, MyReactHookNode } from "@my-react/react-reconciler-compact/type";

/**
 * An SSR-friendly useLayoutEffect.
 *
 * React currently throws a warning when using useLayoutEffect on the server.
 * To get around it, we can conditionally useEffect on the server (no-op) and
 * useLayoutEffect elsewhere.
 *
 * @see https://github.com/facebook/react/issues/14927
 */
const useIsomorphicLayoutEffect = /* @__PURE__ */ (() =>
  typeof window !== "undefined" && (window.document?.createElement || window.navigator?.product === "ReactNative"))()
  ? React.useLayoutEffect
  : React.useEffect;

/**
 * Represents a react-internal Fiber node.
 */
export type Fiber<T = any> = Omit<FiberNode, "stateNode"> & { stateNode: T };

/**
 * Represents a {@link Fiber} node selector for traversal.
 */
export type FiberSelector<T = any> = (
  /** The current {@link Fiber} node. */
  node: Fiber<T | null>
) => boolean | void;

/**
 * Traverses up or down a {@link Fiber}, return `true` to stop and select a node.
 */
export function traverseFiber<T = any>(
  /** Input {@link Fiber} to traverse. */
  fiber: Fiber | undefined,
  /** Whether to ascend and walk up the tree. Will walk down if `false`. */
  ascending: boolean,
  /** A {@link Fiber} node selector, returns the first match when `true` is passed. */
  selector: FiberSelector<T>
): Fiber<T> | undefined {
  if (!fiber) return;
  if (selector(fiber) === true) return fiber;

  let child = ascending ? fiber.return : fiber.child;
  while (child) {
    const match = traverseFiber(child, ascending, selector);
    if (match) return match;

    child = ascending ? null : child.sibling;
  }
}

const FiberContext = /* @__PURE__ */ React.createContext<Fiber>(null!);

/**
 * A react-internal {@link Fiber} provider. This component binds React children to the React Fiber tree. Call its-fine hooks within this.
 */
export class FiberProvider extends React.Component<{ children?: React.ReactNode }> {
  private _reactInternals!: Fiber;

  render() {
    return <FiberContext.Provider value={this._reactInternals}>{this.props.children}</FiberContext.Provider>;
  }
}

/**
 * Returns the current react-internal {@link Fiber}. This is an implementation detail of [react-reconciler](https://github.com/facebook/react/tree/main/packages/react-reconciler).
 */
export function useFiber(): Fiber<null> | undefined {
  const root = React.useContext(FiberContext);
  if (root === null) throw new Error("its-fine: useFiber must be called within a <FiberProvider />!");

  const id = React.useId();
  const fiber = React.useMemo(() => {
    for (const maybeFiber of [root, root?.alternate]) {
      if (!maybeFiber) continue;
      const fiber = traverseFiber<null>(maybeFiber, false, (node) => {
        const hookList = node.hookList;
        let hook = hookList?.head;
        while (hook) {
          const typedHook = hook.value as MyReactHookNode;
          if (typedHook.type === HOOK_TYPE.useId && typedHook.result === id) {
            return true;
          }
          hook = hook.next;
        }
      });
      if (fiber) return fiber;
    }
  }, [root, id]);

  return fiber;
}

/**
 * Represents a react-reconciler container instance.
 */
export interface ContainerInstance<T = any> {
  containerInfo: T;
}

/**
 * Returns the current react-reconciler container info passed to {@link ReactReconciler.Reconciler.createContainer}.
 *
 * In react-dom, a container will point to the root DOM element; in react-three-fiber, it will point to the root Zustand store.
 */
export function useContainer<T = any>(): T | undefined {
  const fiber = useFiber();
  const root = React.useMemo(() => traverseFiber<ContainerInstance<T>>(fiber, true, (node) => node.stateNode?.containerInfo != null), [fiber]);

  return root?.stateNode.containerInfo;
}

/**
 * Returns the nearest react-reconciler child instance or the node created from {@link ReactReconciler.HostConfig.createInstance}.
 *
 * In react-dom, this would be a DOM element; in react-three-fiber this would be an instance descriptor.
 */
export function useNearestChild<T = any>(
  /** An optional element type to filter to. */
  type?: keyof React.JSX.IntrinsicElements
): React.RefObject<T | undefined> {
  const fiber = useFiber();
  const childRef = React.useRef<T>(undefined);

  useIsomorphicLayoutEffect(() => {
    childRef.current = traverseFiber<T>(
      fiber,
      false,
      (node) => typeof node.elementType === "string" && (type === undefined || node.elementType === type)
    )?.stateNode;
  }, [fiber]);

  return childRef;
}

/**
 * Returns the nearest react-reconciler parent instance or the node created from {@link ReactReconciler.HostConfig.createInstance}.
 *
 * In react-dom, this would be a DOM element; in react-three-fiber this would be an instance descriptor.
 */
export function useNearestParent<T = any>(
  /** An optional element type to filter to. */
  type?: keyof React.JSX.IntrinsicElements
): React.RefObject<T | undefined> {
  const fiber = useFiber();
  const parentRef = React.useRef<T>(undefined);

  useIsomorphicLayoutEffect(() => {
    parentRef.current = traverseFiber<T>(
      fiber,
      true,
      (node) => typeof node.elementType === "string" && (type === undefined || node.elementType === type)
    )?.stateNode;
  }, [fiber]);

  return parentRef;
}

export type ContextMap = Map<React.Context<any>, any> & {
  get<T>(context: React.Context<T>): T | undefined;
};

const REACT_CONTEXT_TYPE = Symbol.for("react.context");
const REACT_PROVIDER_TYPE = Symbol.for("react.provider");

const isContext = <T,>(type: unknown): type is React.Context<T> =>
  type !== null && typeof type === "object" && "$$typeof" in type && (type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_PROVIDER_TYPE);

/**
 * Returns a map of all contexts and their values.
 */
export function useContextMap(): ContextMap {
  const fiber = useFiber();
  const [contextMap] = React.useState(() => new Map<React.Context<any>, any>());

  // Collect live context
  contextMap.clear();
  let node = fiber;
  while (node) {
    const context = node.elementType;
    if (isContext(context)) {
      // @ts-ignore
      const contextProvider = context.Provider ? context : context.Context;
      if (!contextMap.has(context) && contextProvider !== FiberContext) {
        // @ts-ignore
        contextMap.set(context, React.use(contextProvider));
      }
    }

    node = node.return! as Fiber;
  }

  return contextMap;
}

/**
 * Represents a react-context bridge provider component.
 */
export type ContextBridge = React.FC<React.PropsWithChildren<{}>>;

/**
 * React Context currently cannot be shared across [React renderers](https://reactjs.org/docs/codebase-overview.html#renderers) but explicitly forwarded between providers (see [react#17275](https://github.com/facebook/react/issues/17275)). This hook returns a {@link ContextBridge} of live context providers to pierce Context across renderers.
 *
 * Pass {@link ContextBridge} as a component to a secondary renderer to enable context-sharing within its children.
 */
export function useContextBridge(): ContextBridge {
  const contextMap = useContextMap();

  // Flatten context and their memoized values into a `ContextBridge` provider
  return React.useMemo(
    () =>
      Array.from(contextMap.keys()).reduce(
        (Prev, context) => (props) => {
          const Tar = (context.Provider || context) as any;
          return (
            <Prev>
              <Tar {...props} value={contextMap.get(context)} />
            </Prev>
          );
        },
        (props) => <FiberProvider {...props} />
      ),
    [contextMap]
  );
}
