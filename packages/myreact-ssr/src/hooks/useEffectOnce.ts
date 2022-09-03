import { useEffect } from "react";

export const useEffectOnce = (fn: () => unknown) => {
  useEffect(() => {
    fn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
