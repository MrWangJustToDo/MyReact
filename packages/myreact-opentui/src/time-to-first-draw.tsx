import { TimeToFirstDrawRenderable } from "@opentui/core";
import { createElement } from "react";

import { extend } from "./components";

import type { ExtendedComponentProps } from "./types/components.js";

extend({ "time-to-first-draw": TimeToFirstDrawRenderable });

export type TimeToFirstDrawProps = ExtendedComponentProps<typeof TimeToFirstDrawRenderable>;

export const TimeToFirstDraw = (props: TimeToFirstDrawProps) => {
  return createElement("time-to-first-draw", props);
};
