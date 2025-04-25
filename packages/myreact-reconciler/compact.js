"use strict";

if (process.env.NODE_ENV === "production") {
  module.exports = require("./dist/cjs/compact.production");
} else {
  module.exports = require("./dist/cjs/compact.development");
}
