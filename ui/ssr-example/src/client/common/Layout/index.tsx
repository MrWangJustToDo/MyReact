import { Box } from "@chakra-ui/react";
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
export default class Layout extends Component<{ title: string }, { isMounted: boolean }> {
  state = {
    isMounted: false,
  };

  constructor(props) {
    super(props);
    console.warn("create", this);
  }
  componentDidMount(): void {
    console.warn("mounted", this);
    this.setState({ isMounted: true });
  }
  componentWillUnmount(): void {
    console.warn("unmount", this);
  }
  UNSAFE_componentWillMount(): void {
    console.warn("willMount", this);
  }
  render(): ReactNode {
    console.warn("render", this);
    const { title } = this.props;
    const { isMounted } = this.state;
    return (
      <>
        <Helmet title={(title?.slice(1)?.toLowerCase() || "@my-react") + " | @my-react"} />
        <LockBody />
        <ModuleManager>
          <Box id="page-header" position="sticky" top="0" backgroundColor={isMounted ? "bannerBackgroundColor" : undefined} zIndex="banner">
            <Header />
          </Box>
          <div id="page-content">
            <Outlet />
          </div>
          <div id="page-footer">
            <Footer />
          </div>
        </ModuleManager>
      </>
    );
  }
}
