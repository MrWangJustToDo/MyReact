"use strict";

if (process.env.NODE_ENV === "production") {
  module.exports = require("./dist/cjs/server.production");
} else {
  module.exports = require("./dist/cjs/server.development");
}
