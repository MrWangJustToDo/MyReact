import { lazy, Suspense } from "react";

const InkUI = lazy(() => import("./UI").then(({ InkUI }) => ({ default: InkUI })));

export const ClientInkUI = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InkUI />
    </Suspense>
  );
};
