require("module-alias/register");

const React = require("@my-react/react");

global.React = React;

if (process.env.NODE_ENV === "development") {
  require("../../dev/server/app");
} else {
  require("../../dist/server/app");
}
