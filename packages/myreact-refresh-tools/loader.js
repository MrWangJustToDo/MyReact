"use strict";

if (process.env.NODE_ENV === "production") {
  module.exports = require("./dist/cjs/loader.production");
} else {
  module.exports = require("./dist/cjs/loader.development");
}

