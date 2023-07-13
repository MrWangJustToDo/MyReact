"use strict";

if (process.env.NODE_ENV === "production") {
  module.exports = require("./dist/cjs/webpackPlugin.development");
} else {
  module.exports = require("./dist/cjs/webpackPlugin.production");
}

