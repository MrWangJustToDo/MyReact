import { useReducer } from "react";

export const useUpdate = () => {
  const [, update] = useReducer((p) => p + 1, 0);

  return update;
};
