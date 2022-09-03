import { useCallback, useState } from "react";

export const useBool = () => {
  const [bool, setBool] = useState(false);
  const show = useCallback(() => setBool(true), []);
  const hide = useCallback(() => setBool(false), []);
  const toggle = useCallback(() => setBool((last) => !last), []);

  return { bool, show, hide, toggle };
};
