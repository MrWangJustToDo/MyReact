"use strict";

const React = require("react");

if (!React.isMyReact) {
  throw new Error(
    "@my-react/react-reconciler-compact requires 'React' to be set as '@my-react/react'. Please ensure you have set the alias correctly in your bundler configuration."
  );
}

if (process.env.NODE_ENV === "production") {
  module.exports = require("./dist/cjs/index.production");
} else {
  module.exports = require("./dist/cjs/index.development");
}
