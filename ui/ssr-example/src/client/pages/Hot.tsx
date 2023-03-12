import { Component } from "react";

import { Hmr } from "@client/component/Hmr";

import { delay, initialStateWrapper } from "../utils";

import type { ReactNode } from "react";

@initialStateWrapper<{ bar: string }>(async () => {
  await delay(2000);
  return { props: { bar: "foo" } };
})
export default class Bar extends Component<{ bar: string }> {
  constructor(p) {
    super(p);
  }
  render(): ReactNode {
    return <Hmr />;
  }
}

export const isStatic = true;
