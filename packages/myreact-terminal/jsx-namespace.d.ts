import { type ReactNode, type Key, type LegacyRef } from "react";
import { type Except } from "type-fest";
import { type DOMElement } from "./src/dom";
import { type Styles } from "./src/styles";

declare namespace Ink {
  type Box = {
    internal_static?: boolean;
    children?: ReactNode;
    key?: Key;
    ref?: LegacyRef<DOMElement>;
    style?: Except<Styles, "textWrap">;
    internal_accessibility?: DOMElement["internal_accessibility"];
    sticky?: boolean;
    internal_sticky_alternate?: boolean;
    opaque?: boolean;
  };

  type Text = {
    children?: ReactNode;
    key?: Key;
    style?: Styles;
    internal_transform?: (children: string, index: number) => string;
    internal_accessibility?: DOMElement["internal_accessibility"];
  };
}

declare namespace JSX {
  interface IntrinsicElements {
    "ink-box": Ink.Box;
    "ink-text": Ink.Text;
  }
}
