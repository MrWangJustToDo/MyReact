import { createContext, useContext, useState } from "react";

import type { ReactNode } from "react";

export const LoadingStateContext = createContext<{
  loading: boolean;
  setLoading: (p: boolean) => void;
}>({ loading: false, setLoading: () => void 0 });

export const WrapperLoading = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(false);
  return <LoadingStateContext.Provider value={{ loading, setLoading }}>{children}</LoadingStateContext.Provider>;
};

export const useLoadingState = () => useContext(LoadingStateContext);
