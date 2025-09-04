import React, { forwardRef, useContext, type PropsWithChildren } from "react";
import { type Except } from "type-fest";

import { type DOMElement } from "../dom";
import { type Styles } from "../styles";

import { accessibilityContext } from "./AccessibilityContext";
import { backgroundContext } from "./BackgroundContext";

export type Props = Except<Styles, "textWrap"> & {
  /**
   * Label for the element for screen readers.
   */
  readonly "aria-label"?: string;

  /**
   * Hide the element from screen readers.
   */
  readonly "aria-hidden"?: boolean;

  /**
   * Role of the element.
   */
  readonly "aria-role"?:
    | "button"
    | "checkbox"
    | "combobox"
    | "list"
    | "listbox"
    | "listitem"
    | "menu"
    | "menuitem"
    | "option"
    | "progressbar"
    | "radio"
    | "radiogroup"
    | "tab"
    | "tablist"
    | "table"
    | "textbox"
    | "timer"
    | "toolbar";

  /**
   * State of the element.
   */
  readonly "aria-state"?: {
    readonly busy?: boolean;
    readonly checked?: boolean;
    readonly disabled?: boolean;
    readonly expanded?: boolean;
    readonly multiline?: boolean;
    readonly multiselectable?: boolean;
    readonly readonly?: boolean;
    readonly required?: boolean;
    readonly selected?: boolean;
  };
};

/**
 * `<Box>` is an essential Ink component to build your layout. It's like `<div style="display: flex">` in the browser.
 */
const Box = forwardRef<DOMElement, PropsWithChildren<Props>>(
  ({ children, backgroundColor, "aria-label": ariaLabel, "aria-hidden": ariaHidden, "aria-role": role, "aria-state": ariaState, ...style }, ref) => {
    const { isScreenReaderEnabled } = useContext(accessibilityContext);
    const label = ariaLabel ? <ink-text>{ariaLabel}</ink-text> : undefined;
    if (isScreenReaderEnabled && ariaHidden) {
      return null;
    }

    const boxElement = (
      <ink-box
        ref={ref}
        style={{
          flexWrap: "nowrap",
          flexDirection: "row",
          flexGrow: 0,
          flexShrink: 1,
          ...style,
          backgroundColor,
          overflowX: style.overflowX ?? style.overflow ?? "visible",
          overflowY: style.overflowY ?? style.overflow ?? "visible",
        }}
        internal_accessibility={{
          role,
          state: ariaState,
        }}
      >
        {isScreenReaderEnabled && label ? label : children}
      </ink-box>
    );

    // If this Box has a background color, provide it to children via context
    if (backgroundColor) {
      return <backgroundContext.Provider value={backgroundColor}>{boxElement}</backgroundContext.Provider>;
    }

    return boxElement;
  }
);

Box.displayName = "Box";

export default Box;
