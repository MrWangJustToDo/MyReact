import { createElement, forwardRef } from "@my-react/react";

import { PlainBoxType } from "../api/native";

import type { Styles } from "../api/native";
import type { CreateElementConfig, ForwardRefType, MyReactElementNode } from "@my-react/react";
import type { Except } from "type-fest";

export type BoxProps = Except<Styles, "textWrap">;

type BoxType = ForwardRefType<BoxProps & { children?: MyReactElementNode }, CreateElementConfig<BoxProps & { children?: MyReactElementNode }>["ref"]>;

/**
 * `<Box>` is an essential Ink component to build your layout. It's like `<div style="display: flex">` in the browser.
 */
export const Box = forwardRef<BoxProps & { children?: MyReactElementNode }>(({ children, ...style }, ref) => {
  return createElement(
    PlainBoxType,
    { ref, style: { ...style, overflowX: style.overflowX ?? style.overflow ?? "visible", overflowY: style.overflowY ?? style.overflow ?? "visible" } },
    children
  );
  // type-error
  // https://github.com/microsoft/TypeScript/issues/47663
}) as BoxType;

Box.displayName = "Box";

Box.defaultProps = {
  flexWrap: "nowrap",
  flexDirection: "row",
  flexGrow: 0,
  flexShrink: 1,
};
