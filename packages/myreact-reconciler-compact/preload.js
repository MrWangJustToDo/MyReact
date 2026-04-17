"use strict";

if (process.env.NODE_ENV === "production") {
  module.exports = require("./dist/cjs/preload.production");
} else {
  module.exports = require("./dist/cjs/preload.development");
}