const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

if (process.env.REACT === "myreact") {
  require("module-alias/register");
  // const React = require("@my-react/react");
  // global.React = React;
}

if (process.env.NODE_ENV === "development") {
  require(path.resolve(process.cwd(), "dev", "server", "app.js"));
} else {
  require(path.resolve(process.cwd(), "dist", "server", "app.js"));
}
