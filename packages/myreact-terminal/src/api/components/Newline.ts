import { createElement } from "@my-react/react";

import { TextType } from "../native";

export type NewlineProps = {
  /**
   * Number of newlines to insert.
   *
   * @default 1
   */
  readonly count?: number;
};

/**
 * Adds one or more newline (\n) characters. Must be used within <Text> components.
 */
export function Newline({ count = 1 }: NewlineProps) {
  return createElement(TextType, null, "\n".repeat(count));
}
