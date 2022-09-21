import { useLoadingBar } from "@client/hooks";

import { useLoadingState } from "../WrapperLoading";

import { Bar } from "./LoadingBar";

import type { LoadingBarWrapperType } from "@client/types/common";

export const LoadingBar: LoadingBarWrapperType = () => {
  const { loading } = useLoadingState();
  const { ref } = useLoadingBar({ loading });
  return <Bar ref={ref} />;
};
