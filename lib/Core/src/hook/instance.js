import { isNormalEqual } from "../tool.js";
import { getContextFiber } from "../fiber/index.js";
import { MyReactInternalInstance } from "../share.js";

class MyReactHookNode extends MyReactInternalInstance {
  /**
   * @type number
   */
  hookIndex;
  /**
   * @type MyReactHookNode
   */
  hookNext = null;
  /**
   * @type MyReactHookNode
   */
  hookPrev = null;

  /**
   * @type Function
   */
  cancel = null;

  /**
   * @type boolean
   */
  effect = false;

  /**
   * @type any
   */
  value;

  /**
   * @type Function
   */
  reducer;

  /**
   * @type any[]
   */
  depArray;

  hookType;

  result = null;

  prevResult = null;

  __pendingEffect = false;

  constructor(hookIndex, value, reducer, depArray, hookType) {
    super();
    this.hookIndex = hookIndex;
    this.value = value;
    this.reducer = reducer;
    this.depArray = depArray;
    this.hookType = hookType;
  }

  contextValue() {
    const ProviderFiber = getContextFiber(this.__fiber__, this.value);
    if (ProviderFiber) {
      this.setContext(ProviderFiber);
    }
    return ProviderFiber?.__vdom__.props.value || this.value.Provider.value;
  }

  initialResult() {
    if (
      this.hookType === "useState" ||
      this.hookType === "useMemo" ||
      this.hookType === "useReducer"
    ) {
      this.result = this.value.call(null);
      return;
    }

    if (
      this.hookType === "useEffect" ||
      this.hookType === "useLayoutEffect" ||
      this.hookType === "useImperativeHandle"
    ) {
      this.effect = true;
      return;
    }

    if (this.hookType === "useCallback" || this.hookType === "useRef") {
      this.result = this.value;
      return;
    }

    if (this.hookType === "useContext") {
      this.result = this.contextValue();
      return;
    }
  }

  updateResult(newValue, newReducer, newDepArray) {
    if (
      this.hookType === "useMemo" ||
      this.hookType === "useEffect" ||
      this.hookType === "useCallback" ||
      this.hookType === "useLayoutEffect" ||
      this.hookType === "useImperativeHandle"
    ) {
      if (newDepArray && !this.depArray) {
        throw new Error("依赖状态变更");
      }
      if (!newDepArray && this.depArray) {
        throw new Error("依赖状态变更");
      }
    }

    if (
      this.hookType === "useEffect" ||
      this.hookType === "useLayoutEffect" ||
      this.hookType === "useImperativeHandle"
    ) {
      if (!newDepArray) {
        this.value = newValue;
        this.reducer = newReducer || this.reducer;
        this.effect = true;
      } else if (!isNormalEqual(this.depArray, newDepArray)) {
        this.value = newValue;
        this.reducer = newReducer || this.reducer;
        this.depArray = newDepArray;
        this.effect = true;
      }
    }

    if (this.hookType === "useCallback") {
      if (!isNormalEqual(this.depArray, newDepArray)) {
        this.value = newValue;
        this.prevResult = this.result;
        this.result = newValue;
        this.depArray = newDepArray;
      }
    }

    if (this.hookType === "useMemo") {
      if (!isNormalEqual(this.depArray, newDepArray)) {
        this.value = newValue;
        this.prevResult = this.result;
        this.result = newValue.call(null);
        this.depArray = newDepArray;
      }
    }

    if (this.hookType === "useContext") {
      if (
        !this.__context__ ||
        !this.__context__.mount ||
        !Object.is(this.value, newValue)
      ) {
        this.value = newValue;
        this.prevResult = this.result;
        this.result = this.contextValue();
      }
    }

    if (this.hookType === "useReducer") {
      this.value = newValue;
      this.reducer = newReducer;
    }
  }

  dispatch = (action) => {
    this.prevResult = this.result;

    this.result = this.reducer(this.result, action);

    if (!Object.is(this.result, this.prevResult)) {
      Promise.resolve().then(() => this.__fiber__.update());
    }
  };
}

export { MyReactHookNode };
