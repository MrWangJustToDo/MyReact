/**
 * Placeholder exports for React DOM compatibility.
 * These are stubs to prevent import errors when using @my-react/react-dom as a drop-in replacement for react-dom.
 */

/**
 * @public
 * requestFormReset - React 19+ feature (placeholder)
 * Requests that React reset the form after the current action completes.
 */
export const requestFormReset = (_form: HTMLFormElement): void => {
  if (__DEV__) {
    console.warn("[@my-react/react-dom] requestFormReset is not yet implemented");
  }
};

/**
 * @public
 * useFormState - React 19+ hook (placeholder)
 * @deprecated Use useActionState instead
 */
export const useFormState = <State, Payload>(
  _action: (state: Awaited<State>, payload: Payload) => State | Promise<State>,
  initialState: Awaited<State>,
  _permalink?: string
): [state: Awaited<State>, dispatch: (payload: Payload) => void] => {
  if (__DEV__) {
    console.warn("[@my-react/react-dom] useFormState is deprecated, use useActionState from @my-react/react instead");
  }
  return [initialState, () => {}];
};

/**
 * @public
 * useFormStatus - React 19+ hook (placeholder)
 * Returns the status of the parent form.
 */
export const useFormStatus = (): {
  pending: boolean;
  data: FormData | null;
  method: string | null;
  action: string | ((formData: FormData) => void) | null;
} => {
  if (__DEV__) {
    console.warn("[@my-react/react-dom] useFormStatus is not yet implemented");
  }
  return {
    pending: false,
    data: null,
    method: null,
    action: null,
  };
};
