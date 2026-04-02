import { type ReactNode, type Key, type LegacyRef } from "react";
import { type Except } from "type-fest";
import { type DOMElement } from "./src/dom.js";
import { type Styles } from "./src/styles.js";
import { type Region } from "./src/output.js";

declare namespace Ink {
  type Box = {
    internal_static?: boolean;
    children?: ReactNode;
    key?: Key;
    ref?: LegacyRef<DOMElement>;
    style?: Except<Styles, "textWrap">;
    internal_accessibility?: DOMElement["internal_accessibility"];
    sticky?: boolean | "top" | "bottom";
    internal_stickyAlternate?: boolean;
    opaque?: boolean;
    scrollbar?: boolean;
    stableScrollback?: boolean;
  };

  type StaticRender = {
    children?: ReactNode;
    style?: Styles;
    ref?: LegacyRef<DOMElement>;
    internal_onBeforeRender?: (node: DOMElement) => void;
    cachedRender?: Region;
  };

  type Text = {
    children?: ReactNode;
    key?: Key;
    style?: Styles;
    internal_transform?: (children: string, index: number) => string;
    internal_terminalCursorFocus?: boolean;
    internal_terminalCursorPosition?: number;
    internal_accessibility?: DOMElement["internal_accessibility"];
  };
}

declare namespace JSX {
  interface IntrinsicElements {
    "ink-box": Ink.Box;
    "ink-text": Ink.Text;
    "ink-static-render": Ink.StaticRender;
  }
}
