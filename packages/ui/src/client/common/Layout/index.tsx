import { Component } from "react";
import { Helmet } from "react-helmet-async";
import { Outlet } from "react-router";

import { initialStateWrapper } from "@client/utils";

import type { ReactNode } from "react";

// TODO
@initialStateWrapper<{ title: string }>(({ relativePathname }) => ({ props: { title: relativePathname } }))
export default class Layout extends Component<{ title: string }> {
  render(): ReactNode {
    return (
      <>
        <Helmet title={"path: " + this.props.title} />
        <Outlet />
      </>
    );
  }
}
