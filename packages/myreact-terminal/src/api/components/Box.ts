import { createElement, forwardRef } from "@my-react/react";

import type { Styles } from "../native";
import type { MyReactElementNode } from "@my-react/react";
import type { Except } from "type-fest";

export type Props = Except<Styles, "textWrap">;

/**
 * `<Box>` is an essential Ink component to build your layout. It's like `<div style="display: flex">` in the browser.
 */
export const Box = forwardRef<Props & { children?: MyReactElementNode }>(({ children, ...style }, ref) => {
  return createElement(
    "terminal-box",
    { ref, style: { ...style, overflowX: style.overflowX ?? style.overflow ?? "visible", overflowY: style.overflowY ?? style.overflow ?? "visible" } },
    children
  );
});

Box.displayName = "Box";

Box.defaultProps = {
  flexWrap: "nowrap",
  flexDirection: "row",
  flexGrow: 0,
  flexShrink: 1,
};
