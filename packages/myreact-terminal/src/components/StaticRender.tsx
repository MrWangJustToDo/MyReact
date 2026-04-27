import React, { useRef, useEffect, useState, type ReactNode, type DependencyList } from "react";

import { markNodeAsDirty, type DOMElement } from "../dom.js";
import { type Styles } from "../styles.js";

export type Props = {
  readonly children: () => ReactNode;
  readonly width: number;
  readonly style?: Styles;
  /**
   * Dependencies to determine when the static content should be re-rendered.
   * If provided, the content will only re-render when a dependency changes.
   * If omitted, the content will re-render whenever the `children` function reference changes.
   */
  readonly deps?: DependencyList;
};

const areDepsEqual = (prevDeps?: DependencyList, nextDeps?: DependencyList): boolean => {
  if (prevDeps === nextDeps) return true;
  if (!prevDeps || !nextDeps) return false;
  if (prevDeps.length !== nextDeps.length) return false;
  for (let i = 0; i < prevDeps.length; i++) {
    if (!Object.is(prevDeps[i], nextDeps[i])) {
      return false;
    }
  }

  return true;
};

/**
 * `<StaticRender>` is the modern, more powerful replacement for the legacy `<Static>` component.
 * It is designed to work natively with Ink's new worker-based renderer.
 *
 * Unlike the legacy `<Static>` component (which permanently writes output to the console
 * above the active Ink app and cannot be nested within other layout elements), `<StaticRender>`
 * caches its rendered output as a single "flattened" leaf node within the Yoga layout tree.
 *
 * This has several key advantages:
 * 1. **Nesting**: `<StaticRender>` can be nested *anywhere* in your layout, including inside
 *    scrollable `<Box>` components (which is impossible with `<Static>`).
 * 2. **Performance**: Because the layout and styling are computed once and cached, large
 *    lists or complex trees inside `<StaticRender>` will not slow down the main 60FPS render loop.
 * 3. **Alternate Buffer Support**: `<StaticRender>` is fully supported in alternate buffer mode.
 * 4. **Updating Content**: You do not need to provide an append-only `items` array. You can
 *    re-render a `<StaticRender>` block by updating its `deps` array.
 *
 * **API Differences vs `<Static>`:**
 * The legacy `<Static>` component requires an `items` array and a `children` function that maps
 * over newly appended items, allowing it to only render the newest items and append them to the
 * terminal output.
 *
 * `<StaticRender>` instead takes a `children` function that returns the entire block to be
 * rendered and cached. Currently, the API of `<StaticRender>` does not support taking an array
 * of items. However, we might modify it to support that in the future to improve performance
 * (for very large, continuously growing lists) if we can figure out the right incremental
 * invalidation solution.
 *
 * @param props.width Required. The width of the static block. Ink needs this to pre-calculate
 * the layout having it be dependent on the rest of the app's layout.
 */
export default function StaticRender({ children, width, style, deps }: Props) {
  const ref = useRef<DOMElement>(null);
  const [renderedVersion, setRenderedVersion] = useState(0);
  const prevChildren = useRef(children);
  const prevDeps = useRef(deps);
  const pendingVersion = useRef(1);

  let nextPendingVersion = pendingVersion.current;

  if (deps !== undefined) {
    if (!areDepsEqual(prevDeps.current, deps)) {
      prevDeps.current = deps;
      nextPendingVersion++;
    }
  } else if (children !== prevChildren.current) {
    prevChildren.current = children;
    nextPendingVersion++;
  }

  if (nextPendingVersion !== pendingVersion.current) {
    pendingVersion.current = nextPendingVersion;
    if (ref.current) {
      ref.current.cachedRender = undefined;
      markNodeAsDirty(ref.current);
    }
  }

  const shouldRender = renderedVersion !== pendingVersion.current;

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
      internal_onRendered={() => {
        const nextRenderedVersion = pendingVersion.current;
        setRenderedVersion((currentVersion) => (currentVersion === nextRenderedVersion ? currentVersion : nextRenderedVersion));
      }}
    >
      {shouldRender ? children() : null}
    </ink-static-render>
  );
}
