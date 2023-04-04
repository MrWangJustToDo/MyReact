const TYPEKEY = "$$typeof";

const ForwardRef = Symbol.for("react.forward_ref");

const Memo = Symbol.for("react.memo");

// some type has been changed, need update pending array
const pendingUpdates = [];
// register type
const allFamiliesByID = new Map();
const allFamiliesByType = new WeakMap();
const allSignaturesByType = new WeakMap();

const updatedFamiliesByType = new WeakMap();

const allFiberByType = new Map();

function getProperty(object, property) {
  try {
    return object[property];
  } catch (err) {
    // Intentionally ignore.
    return undefined;
  }
}

function haveEqualSignatures(prevType, nextType) {
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
}

function getRenderTypeFormType(type) {
  if (!type) {
    console.error(`[@my-react/refresh] can not get the real type for current render, it is a bug for @my-react/react-refresh`);
    return null;
  }
  if (typeof type === "object") {
    switch (getProperty(type, TYPEKEY)) {
      case ForwardRef:
      case Memo:
        return getRenderTypeFormType(type.render);
    }
  }

  if (typeof type === "function") {
    return type;
  }
}

function isMyReactClass(type) {
  return type.prototype && type.prototype.isMyReactComponent;
}

function canPreserveStateBetween(prevType, nextType) {
  if (isMyReactClass(prevType) || isMyReactClass(nextType)) {
    return false;
  }
  if (haveEqualSignatures(prevType, nextType)) {
    return true;
  }
  return false;
}

function resolveFamily(type) {
  // Only check updated types to keep lookups fast.
  return updatedFamiliesByType.get(type);
}

const computeFullKey = (signature) => {
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

const setFiber = (type) => {
  if (!type) return;

  const currentFiber = self["__@my-react/hmr__"].currentComponentFiber.current;

  if (!currentFiber) {
    console.error("[@my-react/react-refresh] can not found current fiber node");
  }

  if (!allFiberByType.has(type)) {
    allFiberByType.set(type, currentFiber);
  }

  if (typeof type === "object" && type !== null) {
    switch (getProperty(type, TYPEKEY)) {
      case ForwardRef:
      case Memo:
        setFiber(type.render);
        break;
    }
  }
};

function getFamilyByID(id) {
  return allFamiliesByID.get(id);
}

function getFamilyByType(type) {
  return allFamiliesByType.get(type);
}

const setSignature = (type, key, forceReset, getCustomHooks) => {
  if (!allSignaturesByType.has(type)) {
    allSignaturesByType.set(type, {
      key,
      forceReset,
      getCustomHooks: getCustomHooks | (() => []),
    });
  }

  if (typeof type === "object" && type !== null) {
    // see @my-react/react element/feature.ts
    switch (getProperty(type, TYPEKEY)) {
      case ForwardRef:
      case Memo:
        setSignature(type.render, key, forceReset, getCustomHooks);
        break;
    }
  }
};

const collectCustomHooksForSignature = (type) => {
  const signature = allSignaturesByType.get(type);
  if (signature) {
    signature.fullKey = computeFullKey(signature);
  }
};

const register = (type, id) => {
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
        register(type.render, id + "$forwardRef");
        break;
      case Memo:
        register(type.render, id + "$memo");
        break;
    }
  }
};

const createSignatureFunctionForTransform = () => {
  let savedType = null;
  let hasCustomHooks = false;
  let didCollectFiber = false;
  let didCollectHooks = false;
  return (type, key, forceReset, getCustomHooks) => {
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
        setFiber(savedType);
      }
    }
  };
};

// TODO cause infinity loop error in some usage
const performReactRefresh = () => {
  if (!pendingUpdates.length) return;

  const allPending = pendingUpdates.slice(0);

  pendingUpdates.length = 0;

  let root = null;

  allPending.forEach(([family, _nextType]) => {
    const prevType = getRenderTypeFormType(family.current);
    const nextType = getRenderTypeFormType(_nextType);
    if (prevType) {
      const fiber = allFiberByType.get(prevType);
      updatedFamiliesByType.set(prevType, family);
      updatedFamiliesByType.set(_nextType, family);
      if (fiber) {
        root = root || fiber.container.rootFiber;
        const forceReset = !canPreserveStateBetween(prevType, nextType);
        self["__@my-react/hmr__"].hmr(fiber, nextType, forceReset);
      } else {
        console.error(`[@my-react/refresh] current type ${prevType} not have a fiber node for the render tree`);
      }
    }
  });

  console.log(`[@my-react/refresh] updating ...`);

  root?._update();
};

const isLikelyComponentType = (type) => {
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

const moduleObject = {
  isLikelyComponentType,
  performReactRefresh,
  createSignatureFunctionForTransform,
  register,
  collectCustomHooksForSignature,
  setSignature,
  getFamilyByID,
  getFamilyByType,
};

self["__@my-react/react-refresh__"] = moduleObject;

self["__@my-react/react-refresh__fiber"] = allFiberByType;

if (typeof window !== "undefined") {
  // inject type resolve handler
  window.addEventListener("load", () => {
    // set type resolve handler for fast refresh
    self["__@my-react/hmr__"]?.setRefreshHandler?.(resolveFamily);
  });
}

exports.isLikelyComponentType = isLikelyComponentType;
exports.performReactRefresh = performReactRefresh;
exports.createSignatureFunctionForTransform = createSignatureFunctionForTransform;
exports.register = register;
exports.collectCustomHooksForSignature = collectCustomHooksForSignature;
exports.setSignature = setSignature;
exports.getFamilyByID = getFamilyByID;
exports.getFamilyByType = getFamilyByType;
exports.injectIntoGlobalHook = () => void 0;
