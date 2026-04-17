/**
 * Placeholder exports for React compatibility.
 * These are stubs to prevent import errors when using @my-react as a drop-in replacement for react.
 */

/**
 * @public
 * useActionState hook - React 19+ feature (placeholder)
 */
export const useActionState = <State, Payload>(
  _action: (state: Awaited<State>, payload: Payload) => State | Promise<State>,
  initialState: Awaited<State>,
  _permalink?: string
): [state: Awaited<State>, dispatch: (payload: Payload) => void, isPending: boolean] => {
  if (__DEV__) {
    console.warn("[@my-react/react] useActionState is not yet implemented");
  }
  return [initialState, () => {}, false];
};

/**
 * @public
 * useFormStatus hook - React DOM feature, placeholder here for compatibility
 */
export const useFormStatus = (): {
  pending: boolean;
  data: FormData | null;
  method: string | null;
  action: string | ((formData: FormData) => void) | null;
} => {
  if (__DEV__) {
    console.warn("[@my-react/react] useFormStatus is a react-dom hook, import it from @my-react/react-dom instead");
  }
  return {
    pending: false,
    data: null,
    method: null,
    action: null,
  };
};

/**
 * @public
 * ViewTransition component - React 19+ feature for view transitions (placeholder)
 */
export const ViewTransition = Symbol.for("react.view_transition");

/**
 * @public
 * addTransitionType - React 19+ feature (placeholder)
 */
export const addTransitionType = (_type: string): void => {
  if (__DEV__) {
    console.warn("[@my-react/react] addTransitionType is not yet implemented");
  }
};

/**
 * @internal
 * unstable_LegacyHidden - deprecated/unstable (placeholder)
 */
export const unstable_LegacyHidden = Symbol.for("react.legacy_hidden");

/**
 * @internal
 * unstable_Scope - experimental feature (placeholder)
 */
export const unstable_Scope = Symbol.for("react.scope");

/**
 * @internal
 * unstable_SuspenseList - experimental feature for coordinating Suspense boundaries (placeholder)
 */
export const unstable_SuspenseList = Symbol.for("react.suspense_list");

/**
 * @internal
 * unstable_TracingMarker - experimental feature for tracing (placeholder)
 */
export const unstable_TracingMarker = Symbol.for("react.tracing_marker");

/**
 * @internal
 * unstable_getCacheForType - experimental cache feature (placeholder)
 */
export const unstable_getCacheForType = <T>(resourceType: () => T): T => {
  if (__DEV__) {
    console.warn("[@my-react/react] unstable_getCacheForType is not yet implemented");
  }
  return resourceType();
};

/**
 * @internal
 * unstable_useCacheRefresh - experimental cache feature (placeholder)
 */
export const unstable_useCacheRefresh = (): (() => void) => {
  if (__DEV__) {
    console.warn("[@my-react/react] unstable_useCacheRefresh is not yet implemented");
  }
  return () => {};
};
