export {
  // reactive
  reactive,
  readonly,
  shallowReactive,
  shallowReadonly,
  isReactive,
  isReadonly,
  isShallow,
  isProxy,
  toRaw,
  toReadonly,
  toReactive,
  markRaw,
  // effect
  effect,
  ReactiveEffect,
  pauseTracking,
  enableTracking,
  resetTracking,
  enableTrigger,
  pauseTrigger,
  resetTrigger,
  shouldTrackRef,
  shouldTriggerRef,
  // computed
  computed,
  ComputedGetter,
  ComputedSetter,
  WritableComputedOptions,
  // watch
  watch,
  WatchSource,
  WatchCallback,
  // ref
  ref,
  toRef,
  toRefs,
  proxyRefs,
  isRef,
  UnwrapRef,
  // symbol
  EffectFlags,
  ReactiveFlags,
  RefFlags,
  ComputedFlags,
} from "./api";

export { createReactive, onBeforeMount, onBeforeUnmount, onBeforeUpdate, onMounted, onUnmounted, onUpdated, MyReactReactiveInstance } from "./reactive";

export { currentReactiveInstance } from "./share";

const version = __VERSION__;

export { version };
