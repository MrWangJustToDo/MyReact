import { Component } from "react";

import type { ErrorInfo, ReactNode, ReactElement } from "react";

export class WrapperErrorCatch extends Component<Record<string, unknown> & { children: ReactElement }, { error: string; stack: string; hasError: boolean }> {
  state = {
    stack: "",
    error: "",
    hasError: false,
  };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.setState({
      error: error.message,
      stack: info.componentStack,
    });
  }

  render(): ReactNode {
    if (this.state.hasError)
      return (
        <pre style={{ fontFamily: "SFMono-Regular,Menlo,Monaco,Consolas,monospace" }}>
          <p style={{ color: "red", whiteSpace: "pre-wrap" }}>{this.state.error}</p>
          {this.state.stack}
        </pre>
      );
    return this.props.children;
  }
}
