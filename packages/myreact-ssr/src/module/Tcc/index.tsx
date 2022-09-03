import { Component } from "react";

import { Box } from "./Box";

export class Tcc extends Component {
  render() {
    return (
      <div>
        <p>测试props注入</p>
        <p>{JSON.stringify(this.props)}</p>
        <hr />
        <Box />
      </div>
    );
  }
}
