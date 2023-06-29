import { createElement, useLayoutEffect, useMemo, useState } from "@my-react/react";

import { PlainBoxType } from "../native";

import type { Styles } from "../native";
import type { MyReactElement} from "@my-react/react";

export type StaticProps<T> = {
  /**
   * Array of items of any type to render using a function you pass as a component child.
   */
  readonly items: T[];

  /**
   * Styles to apply to a container of child elements. See <Box> for supported properties.
   */
  readonly style?: Styles;

  /**
   * Function that is called to render every item in `items` array.
   * First argument is an item itself and second argument is index of that item in `items` array.
   * Note that `key` must be assigned to the root component.
   */
  readonly children: (item: T, index: number) => MyReactElement;
};

/**
 * `<Static>` component permanently renders its output above everything else.
 * It's useful for displaying activity like completed tasks or logs - things that
 * are not changing after they're rendered (hence the name "Static").
 *
 * It's preferred to use `<Static>` for use cases like these, when you can't know
 * or control the amount of items that need to be rendered.
 *
 * For example, [Tap](https://github.com/tapjs/node-tap) uses `<Static>` to display
 * a list of completed tests. [Gatsby](https://github.com/gatsbyjs/gatsby) uses it
 * to display a list of generated pages, while still displaying a live progress bar.
 */
export function Static<T>(props: StaticProps<T>) {
  const { items, children: render, style: customStyle } = props;
  const [index, setIndex] = useState(0);

  const itemsToRender: T[] = useMemo(() => {
    return items.slice(index);
  }, [items, index]);

  useLayoutEffect(() => {
    setIndex(items.length);
  }, [items.length]);

  const children = itemsToRender.map((item, itemIndex) => {
    return render(item, index + itemIndex);
  });

  const style: Styles = useMemo(
    () => ({
      position: "absolute",
      flexDirection: "column",
      ...customStyle,
    }),
    [customStyle]
  );

  return createElement(PlainBoxType, { internal_static: true, style: style }, children);
}
