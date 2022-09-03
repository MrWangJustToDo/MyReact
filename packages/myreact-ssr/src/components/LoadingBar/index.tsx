import { useEffect, useState } from "react";

import { useLoadingBar, useLoadingBarState } from "hooks/useLoadingBar";

import { Bar } from "./LoadingBar";

import type { LoadingBarWrapperType } from "types/components";

export const LoadingBar: LoadingBarWrapperType = () => {
  const [loading, setLoading] = useState(false);
  const loadingState = useLoadingBarState((s) => s.loading);
  useEffect(() => {
    let id: NodeJS.Timeout | null = null;
    if (loadingState) {
      id = setTimeout(() => setLoading(loadingState), 200);
    } else {
      setLoading(false);
    }
    return () => {
      id && clearTimeout(id);
    };
  }, [loadingState]);
  const { ref } = useLoadingBar({ loading });
  return <Bar ref={ref} />;
};
