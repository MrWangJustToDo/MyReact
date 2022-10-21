import { Component } from "react";
import { Helmet } from "react-helmet-async";
import { Outlet } from "react-router";

import { initialStateWrapper } from "@client/utils";

import type { ReactNode } from "react";

// TODO
@initialStateWrapper<{ title: string }>(({ relativePathname }) => ({ props: { title: relativePathname } }))
export default class Layout extends Component<{ title: string }> {
  constructor(props) {
    super(props);
    console.warn("create", this);
  }
  componentDidMount(): void {
    console.warn("mounted", this);
  }
  componentWillUnmount(): void {
    console.warn("unmount", this);
  }
  render(): ReactNode {
    console.warn("render");
    return (
      <>
        <Helmet title={"path: " + this.props.title} />
        <Outlet />
      </>
    );
  }
}
