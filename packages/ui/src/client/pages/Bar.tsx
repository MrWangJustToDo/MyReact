import { Code, Heading } from "@chakra-ui/react";
import { Component } from "react";

import { delay, initialStateWrapper } from "@client/utils";

import type { ReactNode } from "react";

// current page will generate static page

@initialStateWrapper<{ bar: string }>(async () => {
  await delay(2000);
  return { props: { bar: "foo" } };
})
export default class Bar extends Component<{ bar: string }> {
  render(): ReactNode {
    return (
      <>
        <Heading>bar page</Heading>
        <Code>props: bar {this.props.bar}</Code>
      </>
    );
  }
}

export const isStatic = true;
