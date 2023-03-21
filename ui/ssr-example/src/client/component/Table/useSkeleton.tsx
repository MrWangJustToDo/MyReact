import { useMemo } from "react";

export const useSkeleton = (hasData: any, skeletonRowCount = 0) => {
  const skeletonRows = useMemo(() => new Array(skeletonRowCount).fill(null), [skeletonRowCount]);
  return {
    skeletonRows,
    skeletonVisible: !hasData,
  };
};
