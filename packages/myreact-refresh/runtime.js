"use strict";

if (process.env.NODE_ENV === "production") {
  module.exports = require("./dist/cjs/RefreshRuntime.production");
} else {
  module.exports = require("./dist/cjs/RefreshRuntime.development");
}

