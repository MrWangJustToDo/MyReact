import { type ReactNode, type Key, type LegacyRef } from "react";
import { type Except } from "type-fest";
import { type DOMElement } from "./dom";
import { type Styles } from "./styles";

declare global {
  const __DEV__: boolean;
  const __VERSION__: string;
	
  namespace JSX {
    interface IntrinsicElements {
      "ink-box": Ink.Box;
      "ink-text": Ink.Text;
    }
  }
}

declare namespace Ink {
  type Box = {
    internal_static?: boolean;
    children?: ReactNode;
    key?: Key;
    ref?: LegacyRef<DOMElement>;
    style?: Except<Styles, "textWrap">;
  };

  type Text = {
    children?: ReactNode;
    key?: Key;
    style?: Styles;

    internal_transform?: (children: string, index: number) => string;
  };
}
