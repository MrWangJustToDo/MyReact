"use strict";

if (process.env.NODE_ENV === "production") {
  const { Fragment, jsx, jsxs } = require("./dist/cjs/index.production");
  module.exports = { Fragment, jsx, jsxs };
} else {
  const { Fragment, jsxDEV } = require("./dist/cjs/index.development");
  module.exports = { Fragment, jsxDEV };
}
