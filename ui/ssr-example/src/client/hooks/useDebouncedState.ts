import { debounce } from "lodash-es";
import { useMemo, useState } from "react";

import type { Dispatch, SetStateAction } from "react";

export const useDebouncedState = <T>(initialState: T | (() => T), time = 200): [T, Dispatch<SetStateAction<T>>] => {
  const [state, setState] = useState(initialState);

  const setDebounceState = useMemo(() => debounce(setState, time), [time]);

  return [state, setDebounceState];
};
