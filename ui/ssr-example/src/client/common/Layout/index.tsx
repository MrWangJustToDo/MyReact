import { Component } from "react";
import { Helmet } from "react-helmet-async";
import { Outlet } from "react-router";

import { Footer } from "@client/component/Footer";
import { Header } from "@client/component/Header";
import { LockBody } from "@client/component/LockBody";
import { ModuleManager } from "@client/component/ModuleManager";
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
  UNSAFE_componentWillMount(): void {
    console.warn("willMount", this);
  }
  render(): ReactNode {
    console.warn("render", this);
    return (
      <>
        <Helmet title={"path: " + this.props.title} />
        <LockBody />
        <ModuleManager>
          {!this.props.title.toLowerCase().includes("/foo") && (
            <div id="page-header">
              <Header />
            </div>
          )}
          <div id="page-content">
            <Outlet />
          </div>
          {!this.props.title.toLowerCase().includes("/foo") && (
            <div id="page-footer">
              <Footer />
            </div>
          )}
        </ModuleManager>
      </>
    );
  }
}
