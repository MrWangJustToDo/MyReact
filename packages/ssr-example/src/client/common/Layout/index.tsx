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
    console.log("create", this);
  }
  componentDidMount(): void {
    console.log("mounted", this);
  }
  componentWillUnmount(): void {
    console.log("unmount", this);
  }
  render(): ReactNode {
    console.log("render");
    return (
      <>
        <Helmet title={"path: " + this.props.title} />
        <Outlet />
      </>
    );
  }
}
