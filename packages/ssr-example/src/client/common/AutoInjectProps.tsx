import { memo } from "react";

import { useGetInitialProps } from "@client/hooks";

import type { ComponentType } from "react";

export const AutoInjectProps = (Component: ComponentType<unknown>, path = "/") => {
  const MemoComponent = memo(Component);

  const RouterComponentWithProps = () => {
    const props = useGetInitialProps(path);
    return <MemoComponent {...props} />;
  };

  return RouterComponentWithProps;
};
