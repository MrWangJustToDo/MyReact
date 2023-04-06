import type { forwardRef, memo, MixinMyReactClassComponent, MixinMyReactFunctionComponent, createRef, MyReactElementType } from "@my-react/react";
import type { setRefreshHandler, hmr, MyReactFiberNode } from "@my-react/react-reconciler";

const TYPEKEY = "$$typeof";

const ForwardRef = Symbol.for("react.forward_ref");

const Memo = Symbol.for("react.memo");

type Family = {
  current: MyReactComponentType;
  latest: MyReactComponentType;
};

type Signature = {
  key: string;
  forceReset: boolean;
  getCustomHooks: () => any[];

  fullKey?: string;
};

type MyReactComponentType = ReturnType<typeof forwardRef> | ReturnType<typeof memo> | MixinMyReactClassComponent | MixinMyReactFunctionComponent;

type HMRGlobal = {
  ["__@my-react/hmr__"]: {
    hmr: typeof hmr;
    setRefreshHandler: typeof setRefreshHandler;
    currentComponentFiber: ReturnType<typeof createRef<MyReactFiberNode>>;
  };
  ["__@my-react/react-refresh__"]: {
    register: typeof register;
    setSignature: typeof setSignature;
    getFamilyByID: typeof getFamilyByID;
    getFamilyByType: typeof getFamilyByType;
    performReactRefresh: typeof performReactRefresh;
    isLikelyComponentType: typeof isLikelyComponentType;
    collectCustomHooksForSignature: typeof collectCustomHooksForSignature;
    createSignatureFunctionForTransform: typeof createSignatureFunctionForTransform;
  };
  ["__@my-react/react-refresh__fiber"]: typeof allFibersByType;
  ["__@my-react/react-refresh__signature"]: typeof allSignaturesByType;
};

const typedSelf = self as unknown as HMRGlobal;

const pendingUpdates: Array<[Family, MyReactComponentType]> = [];

const allFamiliesByID = new Map<string, Family>();

const allFamiliesByType = new WeakMap<MyReactComponentType, Family>();

const allSignaturesByType = new WeakMap<MyReactComponentType, Signature>();

const updatedFamiliesByType = new WeakMap<MyReactComponentType, Family>();

const allFibersByType = new WeakMap<MyReactComponentType, MyReactFiberNode>();

const getProperty = (object: Record<string, unknown>, property: string) => {
  try {
    return object[property];
  } catch (err) {
    // Intentionally ignore.
    return undefined;
  }
};

const computeFullKey = (signature: Signature) => {
  let fullKey = signature.key;
  let hooks;

  try {
    hooks = signature.getCustomHooks();
  } catch (err) {
    signature.forceReset = true;
    return fullKey;
  }

  for (let i = 0; i < hooks.length; i++) {
    const hook = hooks[i];
    if (typeof hook !== "function") {
      signature.forceReset = true;
      return fullKey;
    }

    const nestedHookSignature = allSignaturesByType.get(hook);
    if (nestedHookSignature === undefined) continue;

    const nestedHookKey = computeFullKey(nestedHookSignature);
    if (nestedHookSignature.forceReset) signature.forceReset = true;

    fullKey += "\n---\n" + nestedHookKey;
  }

  return fullKey;
};

const haveEqualSignatures = (prevType: MyReactComponentType, nextType: MyReactComponentType) => {
  const prevSignature = allSignaturesByType.get(prevType);
  const nextSignature = allSignaturesByType.get(nextType);

  if (prevSignature === undefined && nextSignature === undefined) {
    return true;
  }
  if (prevSignature === undefined || nextSignature === undefined) {
    return false;
  }
  if (computeFullKey(prevSignature) !== computeFullKey(nextSignature)) {
    return false;
  }
  if (nextSignature.forceReset) {
    return false;
  }

  return true;
};

const getRenderTypeFormType = (type: MyReactComponentType): MixinMyReactClassComponent | MixinMyReactFunctionComponent | null => {
  if (!type) {
    console.error(`[@my-react/react-refresh] can not get the real type for current render, it is a bug for @my-react/react-refresh`);
    return null;
  }

  if (typeof type === "object") {
    switch (getProperty(type, TYPEKEY)) {
      case ForwardRef:
      case Memo:
        return getRenderTypeFormType(type.render as MyReactComponentType);
      default:
        return null;
    }
  }

  if (typeof type === "function") {
    return type;
  }

  return null;
};

const isMyReactClass = (type: MyReactComponentType) => {
  if (typeof type === "function") {
    return type.prototype && type.prototype.isMyReactComponent;
  } else {
    return false;
  }
};

const canPreserveStateBetween = (prevType: MyReactComponentType, nextType: MyReactComponentType) => {
  if (isMyReactClass(prevType) || isMyReactClass(nextType)) {
    return false;
  }
  if (haveEqualSignatures(prevType, nextType)) {
    return true;
  }
  return false;
};

const resolveFamily = (type: MyReactComponentType) => {
  return updatedFamiliesByType.get(type);
};

export const getFamilyByID = (id: string) => {
  return allFamiliesByID.get(id);
};

export const getFamilyByType = (type: MyReactComponentType) => {
  return allFamiliesByType.get(type);
};

const setFiber = (type: MyReactComponentType) => {
  if (!type) return;

  const currentFiber = typedSelf?.["__@my-react/hmr__"]?.currentComponentFiber?.current;

  if (!currentFiber) {
    console.error(`[@my-react/react-refresh] can not register current type's fiber node. type: ${type}`);
  }

  if (!allFibersByType.has(type)) {
    allFibersByType.set(type, currentFiber);
  }

  if (typeof type === "object" && type !== null) {
    switch (getProperty(type, TYPEKEY)) {
      case ForwardRef:
      case Memo:
        setFiber(type.render as MyReactComponentType);
        break;
    }
  }
};

export const setSignature = (type: MyReactComponentType, key: string, forceReset: boolean, getCustomHooks: Signature["getCustomHooks"]) => {
  if (!type) return;

  if (!allSignaturesByType.has(type)) {
    allSignaturesByType.set(type, {
      key,
      forceReset,
      getCustomHooks: getCustomHooks || (() => []),
    });
  }

  if (typeof type === "object" && type !== null) {
    // see @my-react/react element/feature.ts
    switch (getProperty(type, TYPEKEY)) {
      case ForwardRef:
      case Memo:
        setSignature(type.render as MyReactComponentType, key, forceReset, getCustomHooks);
        break;
    }
  }
};

export const collectCustomHooksForSignature = (type: MyReactComponentType) => {
  const signature = allSignaturesByType.get(type);
  if (signature) {
    signature.fullKey = computeFullKey(signature);
  }
};

export const register = (type: MyReactComponentType, id: string) => {
  if (type === null) {
    return;
  }
  if (typeof type !== "function" && typeof type !== "object") {
    return;
  }

  if (allFamiliesByType.has(type)) return;

  let family = allFamiliesByID.get(id);

  if (family === undefined) {
    family = { current: type, latest: type };

    allFamiliesByID.set(id, family);
  } else {
    family.latest = type;

    pendingUpdates.push([family, type]);
  }

  allFamiliesByType.set(type, family);

  if (typeof type === "object" && type !== null) {
    switch (getProperty(type, TYPEKEY)) {
      case ForwardRef:
        register(type.render as MyReactComponentType, id + "$forwardRef");
        break;
      case Memo:
        register(type.render as MyReactComponentType, id + "$memo");
        break;
    }
  }
};

export const createSignatureFunctionForTransform = () => {
  let savedType: MyReactComponentType | null = null;
  let hasCustomHooks = false;
  let didCollectFiber = false;
  let didCollectHooks = false;
  return (type: MyReactComponentType, key: string, forceReset: boolean, getCustomHooks: Signature["getCustomHooks"]) => {
    // call with argument
    if (typeof key === "string") {
      if (!savedType) {
        savedType = type;
        hasCustomHooks = typeof getCustomHooks === "function";
      }

      if (type != null && (typeof type === "function" || typeof type === "object")) {
        setSignature(type, key, forceReset, getCustomHooks);
      }
      return type;
    } else {
      // call without argument, only happen in the component
      if (!didCollectHooks && hasCustomHooks) {
        didCollectHooks = true;
        collectCustomHooksForSignature(type);
      }
      if (!didCollectFiber) {
        didCollectFiber = true;
        setFiber(savedType as MyReactComponentType);
      }
    }
  };
};

// TODO cause infinity loop error in some usage
export const performReactRefresh = () => {
  if (!pendingUpdates.length) return;

  const allPending = pendingUpdates.slice(0);

  pendingUpdates.length = 0;

  let root: null | MyReactFiberNode = null;

  allPending.forEach(([family, _nextType]) => {
    const prevType = getRenderTypeFormType(family.current);
    const nextType = getRenderTypeFormType(_nextType);
    if (prevType && nextType) {
      const fiber = allFibersByType.get(prevType);
      updatedFamiliesByType.set(prevType, family);
      updatedFamiliesByType.set(_nextType, family);
      if (fiber) {
        root = root || fiber.container.rootFiber;
        const forceReset = !canPreserveStateBetween(prevType, nextType);
        typedSelf?.["__@my-react/hmr__"]?.hmr?.(fiber as MyReactFiberNode, nextType, forceReset);
      } else {
        console.error(`[@my-react/react-refresh] current type ${prevType} not have a fiber node for the render tree`);
      }
    }
  });

  console.log(`[@my-react/react-refresh] updating ...`);

  (root as unknown as MyReactFiberNode)?._update();
};

export const isLikelyComponentType = (type: MyReactElementType) => {
  switch (typeof type) {
    case "function": {
      // First, deal with classes.
      if (type.prototype != null) {
        if (type.prototype.isMyReactComponent) {
          // React class.
          return true;
        }
        const ownNames = Object.getOwnPropertyNames(type.prototype);
        if (ownNames.length > 1 || ownNames[0] !== "constructor") {
          // This looks like a class.
          return false;
        }
        if (type.prototype.__proto__ !== Object.prototype) {
          // It has a superclass.
          return false;
        }
        // Pass through.
        // This looks like a regular function with empty prototype.
      }
      // For plain functions and arrows, use name as a heuristic.
      const name = type.name || type.displayName;
      return typeof name === "string" && /^[A-Z]/.test(name);
    }
    case "object": {
      if (type != null) {
        switch (getProperty(type, TYPEKEY)) {
          case ForwardRef:
          case Memo:
            // Definitely React components.
            return true;
          default:
            return false;
        }
      }
      return false;
    }
    default: {
      return false;
    }
  }
};

const tryToRegister = () => {
  if (__DEV__) {
    try {
      console.log(`[@my-react/react-refresh] dev refresh have been enabled`);

      typedSelf?.["__@my-react/hmr__"]?.setRefreshHandler?.(resolveFamily as Parameters<typeof setRefreshHandler>[0]);
    } catch {
      void 0;
    }
  }
};

export const injectIntoGlobalHook = tryToRegister;

if (__DEV__) {
  typedSelf["__@my-react/react-refresh__"] = {
    register,
    setSignature,
    getFamilyByID,
    getFamilyByType,
    performReactRefresh,
    isLikelyComponentType,
    collectCustomHooksForSignature,
    createSignatureFunctionForTransform,
  };

  typedSelf["__@my-react/react-refresh__fiber"] = allFibersByType;

  typedSelf["__@my-react/react-refresh__signature"] = allSignaturesByType;

  if (typeof window !== "undefined") {
    window.addEventListener("load", tryToRegister);
  }
}
