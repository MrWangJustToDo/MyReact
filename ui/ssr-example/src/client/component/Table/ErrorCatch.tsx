import { Component } from "react";

import type { ErrorInfo, ReactNode } from "react";

export class ErrorCatch extends Component<Record<string, unknown>, { error: string; stack: string; hasError: boolean }> {
  state = {
    error: "",
    stack: "",
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
    const { hasError, stack, error } = this.state;
    if (hasError) {
      console.error(error, stack);
      return "";
    } else {
      return this.props.children as ReactNode;
    }
  }
}
