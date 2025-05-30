/* eslint-disable import/no-useless-path-segments */
// check pkg alias
import React from "react";

if (!React.isMyReact) {
  throw new Error(
    "@my-react/react-three-fiber requires 'React' to be set as '@my-react/react'. Please ensure you have set the alias correctly in your bundler configuration."
  );
}

export * from "./dist/esm/index.mjs";
