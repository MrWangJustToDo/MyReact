import { useRef, useEffect, type ReactNode } from "react";

import { type DOMElement } from "../dom.js";
import { renderToStatic } from "../render-node-to-output.js";
import { type Styles } from "../styles.js";

export type Props = {
  readonly children: ReactNode;
  readonly width: number;
  readonly style?: Styles;
};

export default function StaticRender({ children, width, style }: Props) {
  const ref = useRef<DOMElement>(null);

  useEffect(() => {
    const node = ref.current;
    return () => {
      if (node) {
        node.cachedRender = undefined;
      }
    };
  }, []);

  return (
    <ink-static-render
      ref={ref}
      style={{ ...style, width }}
      internal_onBeforeRender={(node: DOMElement) => {
        if (node && !node.cachedRender) {
          renderToStatic(node);
        }
      }}
    >
      {children}
    </ink-static-render>
  );
}
