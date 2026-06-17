import { TimeToFirstDrawRenderable } from "@opentui/core";
import { createElement } from "react";

import { extend } from "./components";

import type { ExtendedComponentProps } from "./types/components.js";

// declare module "@my-react/react-opentui" {
//   interface OpenTUIComponents {
//     "time-to-first-draw": typeof TimeToFirstDrawRenderable;
//   }
// }

extend({ "time-to-first-draw": TimeToFirstDrawRenderable });

export type TimeToFirstDrawProps = ExtendedComponentProps<typeof TimeToFirstDrawRenderable>;

export const TimeToFirstDraw = (props: TimeToFirstDrawProps) => {
  return createElement("time-to-first-draw", props);
};
