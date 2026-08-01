"use strict";

if (process.env.NODE_ENV === "production") {
  module.exports = require("./dist/cjs/rsc/index.production");
} else {
  module.exports = require("./dist/cjs/rsc/index.development");
}
