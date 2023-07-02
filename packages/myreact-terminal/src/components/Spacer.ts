import { createElement } from "@my-react/react";

import { Box } from "./Box";

/**
 * A flexible space that expands along the major axis of its containing layout.
 * It's useful as a shortcut for filling all the available spaces between elements.
 */
export function Spacer() {
  return createElement(Box, { flexGrow: 1 });
}
