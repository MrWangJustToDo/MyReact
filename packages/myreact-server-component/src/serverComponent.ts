import type { MyReactFunctionComponent } from "@my-react/react";

type MyReactServerElementNode = MyReactFunctionComponent | string | number | boolean | null | undefined;

export const resolveServerComponent = (_element: MyReactServerElementNode) => {
  return null;
};
