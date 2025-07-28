import { forwardRef } from "react";
import { type Except } from "type-fest";

import { type DOMElement } from "../dom";
import { type Styles } from "../styles";

import { backgroundContext } from "./BackgroundContext";

import type { PropsWithChildren } from "react";

export type Props = Except<Styles, "textWrap">;

/**
 * `<Box>` is an essential Ink component to build your layout. It's like `<div style="display: flex">` in the browser.
 */
const Box = forwardRef<DOMElement, PropsWithChildren<Props>>(({ children, backgroundColor, ...style }, ref) => {
  const ele = (
    <ink-box
      ref={ref}
      style={{
        ...style,
        backgroundColor,
        overflowX: style.overflowX ?? style.overflow ?? "visible",
        overflowY: style.overflowY ?? style.overflow ?? "visible",
      }}
    >
      {children}
    </ink-box>
  );

  if (backgroundColor) {
    return <backgroundContext.Provider value={backgroundColor}>{ele}</backgroundContext.Provider>;
  }

  return ele;
});

Box.displayName = "Box";

Box.defaultProps = {
  flexWrap: "nowrap",
  flexDirection: "row",
  flexGrow: 0,
  flexShrink: 1,
};

export default Box;
